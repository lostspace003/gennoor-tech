import { NextRequest, NextResponse } from 'next/server'
import { chatCompletion, aiConfigured } from '@/lib/crm/ai'
import { embedTexts } from '@/lib/crm/vector-service'
import {
  loadIndexMeta, loadVectors, topKScored, addUsage, getUsage,
  questionKey, getCachedAnswer, setCachedAnswer, appendLog, EMBED_DIM,
} from '@/lib/bot/store'

// PUBLIC endpoint — every protection is server-side:
// kill switch, per-IP rate limits, size caps, retrieval-only grounding,
// answer cache, daily token budget breaker, full audit log.
const MAX_INPUT = 500
const MAX_HISTORY = 6
/**
 * The question isn't covered by the website. Rather than a dead end, answer it
 * from live web search — then bring it back to what Gennoor actually does.
 *
 * The honesty rules matter more than the bridge: the answer must be clearly
 * marked as general knowledge rather than something from gennoor.com, and the
 * bridge is only allowed when a genuinely relevant offering exists. A forced
 * link to an unrelated course is exactly the sales-pitch behaviour we don't
 * want. Returns null when web search is unavailable so the caller can fall
 * back to the honest "I don't have that" reply.
 */
async function answerFromWeb(
  question: string,
  nearby: Array<{ title: string; url: string; text: string }>,
  visitorName?: string
): Promise<{ reply: string; links: Array<{ title: string; url: string }> } | null> {
  try {
    const { foundryConfigured, webGroundedCompletion } = await import('@/lib/crm/foundry')
    if (!foundryConfigured()) return null

    // Closest site content, so the model can judge whether a real bridge exists
    const catalogue = nearby
      .slice(0, 4)
      .map((c) => `- ${c.title} (${c.url}): ${c.text.slice(0, 260)}`)
      .join('\n')

    const result = await webGroundedCompletion(
      `You are GennoorCare, the assistant on gennoor.com. Gennoor Tech does AI training, proofs of concept and AI product development (TRAIN. INNOVATE. BUILD.).

This visitor asked something the website does not cover. Answer it properly using live web search, then connect it to Gennoor — honestly.

HOW TO ANSWER:
1. Answer the actual question first, factually and briefly, from what you find. This is general knowledge, not Gennoor material.
2. Make that boundary explicit in a short natural clause — e.g. "that's general background rather than something from our site".
3. THEN, only if one of the Gennoor offerings below genuinely relates, add one line connecting it: what we do and the page link. If nothing genuinely relates, say plainly that this isn't an area Gennoor works in and point to admin@gennoor.com. Do NOT force a link.

HONESTY RULES — these override everything:
- Never claim Gennoor offers something not listed below.
- Never invent statistics, client names, prices or dates.
- Never present general web information as if it came from gennoor.com.
- One link maximum, and only from the list below. Never invent a URL.

STYLE: small chat window. Under 110 words. Short sentences, plain "- " bullets if listing (max 3). No headings, tables or code blocks.${visitorName ? ` The visitor's name is ${visitorName}; use it naturally, not every message.` : ''}

GENNOOR OFFERINGS CLOSEST TO THIS QUESTION:
${catalogue || '(nothing on the site is close to this topic)'}`,
      question
    )

    const reply = (result.text || '').trim()
    if (!reply) return null
    // Only surface links the model actually used, and only ours
    const links = nearby
      .filter((c) => reply.includes(c.url))
      .map((c) => ({ title: c.title, url: c.url }))
      .filter((l, i, arr) => arr.findIndex((x) => x.url === l.url) === i)
      .slice(0, 2)
    return { reply, links }
  } catch (error: any) {
    console.error('GennoorCare web fallback failed:', error?.message)
    return null
  }
}

const TOP_K = 6
// Below this cosine the site content isn't really answering the question.
// nomic-embed-text-v2-moe produces compressed similarities — a solidly correct
// match sits around 0.30-0.40 — so this floor is deliberately low.
const WEAK_MATCH = Number(process.env.GENNOORCARE_WEAK_MATCH || 0.24)
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
  reply: "We're seeing high demand right now. Leave your email with the callback button below, or reach us directly — [admin@gennoor.com](mailto:admin@gennoor.com) / [WhatsApp +91 9326352241](https://wa.me/919326352241) — and our team will get back to you personally.",
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
      return NextResponse.json({
        reply: 'I’m still learning the website — give me a little while. Meanwhile:\n- Explore [our services](https://www.gennoor.com/services)\n- Browse the free [Gennoor Academy](https://www.gennoor.com/academy)\n- Or write to [admin@gennoor.com](mailto:admin@gennoor.com)',
        links: [],
      })
    }
    // 'query' side of the asymmetric prefix pair the model was trained with.
    // A visitor can ask in Arabic, French, German or Swahili and still match
    // the English pages — that's what the multilingual model buys us.
    const [qv] = await embedTexts([question], 'query')
    const scored = topKScored(Float32Array.from(qv), vectors, meta.chunks, TOP_K)
    const top = scored.map((s) => s.chunk)
    const bestScore = scored[0]?.score ?? 0

    // When the site genuinely doesn't cover the question, answer it from the
    // web rather than stonewalling — but honestly, and always landing back on
    // what Gennoor actually does. Threshold is low because this model's
    // cosine scores are compressed (a correct match lands around 0.30-0.40).
    if (bestScore < WEAK_MATCH) {
      const grounded = await answerFromWeb(question, top, visitorName)
      if (grounded) {
        await addUsage(Math.round((question.length + grounded.reply.length) / 4))
        await appendLog({ at: new Date().toISOString(), sessionId, q: question, a: grounded.reply, links: grounded.links.map((l) => l.url) })
        return NextResponse.json(grounded)
      }
      // Web unavailable (Foundry busy) — fall through to the site-only path,
      // which says "I don't have that" honestly rather than inventing.
    }

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
- Business-grade brevity: lead with the answer, max ~100 words. No filler.
- FORMAT for a small chat window: short sentences; plain "- " bullets for lists (max 4); NEVER use headings (#), tables, code blocks or long paragraphs.
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
