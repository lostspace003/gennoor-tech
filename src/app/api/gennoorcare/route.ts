import { NextRequest, NextResponse } from 'next/server'
import { chatCompletion, aiConfigured } from '@/lib/crm/ai'
import { embedTexts } from '@/lib/crm/embeddings'
import {
  loadIndexMeta, loadVectors, topKChunks, addUsage, getUsage,
  questionKey, getCachedAnswer, setCachedAnswer, appendLog, EMBED_DIM,
} from '@/lib/bot/store'

// PUBLIC endpoint — every protection is server-side:
// kill switch, per-IP rate limits, size caps, retrieval-only grounding,
// answer cache, daily token budget breaker, full audit log.
const MAX_INPUT = 500
const MAX_HISTORY = 6
const TOP_K = 6
const PER_MIN = 8
const PER_DAY = 40
const DAILY_TOKEN_BUDGET = Number(process.env.BOT_DAILY_TOKEN_BUDGET || 1_000_000)

const minuteHits = new Map<string, number[]>()
const dayHits = new Map<string, { date: string; n: number }>()

function rateLimited(ip: string): string | null {
  const now = Date.now()
  const mins = (minuteHits.get(ip) || []).filter((t) => now - t < 60_000)
  if (mins.length >= PER_MIN) return 'rate'
  mins.push(now)
  minuteHits.set(ip, mins)
  if (minuteHits.size > 5000) minuteHits.clear() // memory guard

  const today = new Date().toISOString().slice(0, 10)
  const day = dayHits.get(ip)
  if (day?.date === today && day.n >= PER_DAY) return 'daily'
  dayHits.set(ip, { date: today, n: (day?.date === today ? day.n : 0) + 1 })
  if (dayHits.size > 20000) dayHits.clear()
  return null
}

const HUMAN_FALLBACK = {
  reply: "We're seeing high demand right now. Leave your email with the callback button below, or reach us directly — admin@gennoor.com / WhatsApp +91 9326352241 — and our team will get back to you personally.",
  links: [],
  offerLead: true,
}

export async function POST(req: NextRequest) {
  if (process.env.GENNOORBOT_ENABLED === 'false') {
    return NextResponse.json({ reply: 'GennoorCare is taking a short break. Reach us at admin@gennoor.com or +91 9326352241.', links: [] })
  }

  try {
    const ip = (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim()
    const limited = rateLimited(ip)
    if (limited) {
      return NextResponse.json(limited === 'rate'
        ? { reply: 'One moment — please slow down a little and try again.', links: [] }
        : HUMAN_FALLBACK)
    }

    const body = await req.json()
    const sessionId = String(body.sessionId || 'anon').slice(0, 40)
    const visitorName = String(body.visitorName || '').replace(/[^a-zA-Z .'-]/g, '').slice(0, 40)
    const history: Array<{ role: string; content: string }> = Array.isArray(body.messages)
      ? body.messages.slice(-MAX_HISTORY).map((m: any) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: String(m.content || '').slice(0, MAX_INPUT),
        }))
      : []
    const question = history.filter((m) => m.role === 'user').pop()?.content?.trim()
    if (!question) return NextResponse.json({ error: 'No question' }, { status: 400 })

    if (!aiConfigured()) return NextResponse.json(HUMAN_FALLBACK)

    // Budget breaker — the graceful failure is lead capture, not silence
    const usage = await getUsage(new Date().toISOString().slice(0, 10))
    if (usage.tokens >= DAILY_TOKEN_BUDGET) {
      await appendLog({ at: new Date().toISOString(), sessionId, q: question, a: '[budget breaker]', links: [] })
      return NextResponse.json(HUMAN_FALLBACK)
    }

    // Cache — only for opening questions (no conversation context)
    const isOpening = history.filter((m) => m.role === 'user').length === 1
    const cacheKey = questionKey(question)
    if (isOpening) {
      const hit = await getCachedAnswer(cacheKey)
      if (hit) {
        await appendLog({ at: new Date().toISOString(), sessionId, q: question, a: hit.answer, links: hit.links.map((l: any) => l.url), cached: true })
        return NextResponse.json({ reply: hit.answer, links: hit.links, cached: true })
      }
    }

    // Retrieve
    const meta = await loadIndexMeta()
    const vectors = meta ? await loadVectors(meta.updatedAt) : null
    if (!meta || !vectors) {
      return NextResponse.json({ reply: 'I’m still learning the website. Meanwhile: explore gennoor.com/services and gennoor.com/academy, or write to admin@gennoor.com.', links: [] })
    }
    const [qv] = await embedTexts([question])
    const top = topKChunks(Float32Array.from(qv), vectors, meta.chunks, TOP_K)

    const context = top.map((c, i) => `[${i + 1}] ${c.title} (${c.url})\n${c.text.slice(0, 1600)}`).join('\n\n')
    const reply = await chatCompletion(
      [
        {
          role: 'system',
          content: `You are GennoorCare, the assistant on gennoor.com (Gennoor Tech: AI training, POCs, and AI product development — TRAIN. INNOVATE. BUILD.). You help visitors find the right courses, programs and services.

ANSWER SHAPE — every substantive reply covers, briefly:
1. Show you understood THEIR need (one clause, mirrored back)
2. WHAT Gennoor provides for it (the specific course/program/service — not everything)
3. HOW it's delivered (online/duration/format — only if stated in the content)
4. HOW to connect (the relevant page link; callback button for companies)

RULES:
- Answer ONLY from the WEBSITE CONTENT below. If it doesn't contain the answer, say EXACTLY that in one honest line — "I don't have that on the website" — then give the human route (admin@gennoor.com / +91 9326352241). NEVER improvise to sound helpful; a wrong answer is worse than a short one.
- If the visitor's question is vague, ask ONE short clarifying question instead of dumping options.
- Always include relevant page links in markdown [title](url) — links must come from the content below, never invented.
- Business-grade brevity: lead with the answer, max ~120 words, bullets for lists. No filler.
- Prices, dates, durations: only if stated in the content. Never guess.
- If the visitor sounds like a company wanting training/POC, end with ONE line offering a free tailored webinar and suggest the callback button.
- Stay on Gennoor topics; politely decline anything else in one line.
${visitorName ? `- The visitor's name is ${visitorName} — address them naturally by first name, not in every message.` : ''}

WEBSITE CONTENT:
${context}`,
        },
        ...history,
      ],
      { maxTokens: 450 }
    )

    const links = top
      .filter((c) => reply.includes(c.url))
      .map((c) => ({ title: c.title, url: c.url }))
      .filter((l, i, arr) => arr.findIndex((x) => x.url === l.url) === i)
      .slice(0, 4)

    // Rough token accounting: context + history + reply
    await addUsage(Math.round((context.length + question.length + reply.length) / 4))
    if (isOpening) await setCachedAnswer(cacheKey, reply, links)
    await appendLog({ at: new Date().toISOString(), sessionId, q: question, a: reply, links: links.map((l) => l.url) })

    return NextResponse.json({ reply, links })
  } catch (error) {
    console.error('GennoorCare error:', error)
    return NextResponse.json(HUMAN_FALLBACK)
  }
}
