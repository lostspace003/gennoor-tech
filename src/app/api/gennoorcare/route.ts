import { NextRequest, NextResponse } from 'next/server'
import { chatCompletion, aiConfigured } from '@/lib/crm/ai'
import { embedTexts } from '@/lib/crm/vector-service'
import {
  loadIndexMeta, loadVectors, topKScored, addUsage, getUsage, isCacheableQuestion,
  questionKey, getCachedAnswer, setCachedAnswer, appendLog, EMBED_DIM,
} from '@/lib/bot/store'
import { getStudioCourses, studioBlock, matchStudioCourses, ensureStudioLinks } from '@/lib/bot/studio-courses'

// PUBLIC endpoint — every protection is server-side:
// kill switch, per-IP rate limits, size caps, retrieval-only grounding,
// answer cache, daily token budget breaker, full audit log.
// Local testing against real services without writing logs, usage or cache.
const READONLY = process.env.GENNOORBOT_READONLY === 'true'
const MAX_INPUT = 500
const MAX_HISTORY = 6
/**
 * Shared voice rules for both answer paths.
 *
 * Two things this fixes, both observed in production:
 *  - The bot narrated its own sourcing ("that's general background rather than
 *    something from our site"). Visitors don't need our retrieval plumbing
 *    explained; it reads as hedging and breaks the conversation.
 *  - It recommended other training providers by name. We can name Microsoft —
 *    we deliver their official curriculum as a Certified Trainer — but sending
 *    a visitor to a competing platform is not what this assistant is for.
 *
 * Honesty is preserved where it counts: never claim an offering we don't have,
 * never invent numbers, clients, prices or dates.
 */
const VOICE_RULES = `WHO WE ARE:
Gennoor Tech is a training and automation company in Mumbai, India, run by Jalal Ahmed Khan, a Microsoft Certified Trainer. We train organizations to work with AI and Claude, and we build automations one process at a time. Gennoor is Certified in the Claude Partner Network. Never describe it as anything more than that wording.

YOUR JOB — read the intent, then move them one step:
Every message has a person behind it with something they're trying to achieve. "What is AI" from someone on an AI training company's website is rarely idle curiosity — they're orienting themselves before deciding something. Work out what they're actually after, answer that, and put one concrete Gennoor thing in front of them that fits it. You are not an encyclopedia; a correct answer that leaves them exactly where they started has failed.

CARRY THE THREAD — do not answer each message from scratch:
- Remember what they've already told you. "I'm from a finance background" three messages ago still governs everything after it. Never re-suggest a generic beginner course to someone who has already told you their field, their role or their problem.
- Build on the last answer instead of restating it. "ok" and "thats it?" mean "give me more" — go deeper or wider, don't repeat the same recommendation in different words.
- Be worth reading. Say the specific, slightly surprising thing — the pattern that actually pays in their sector, the mistake teams make, the timeline a build really takes. Generic reassurance is what makes an assistant boring.
- Have a view. When someone is vague, make a recommendation and say why, rather than listing everything and asking them to choose.

GREETINGS AND SMALL TALK — "hi", "hello", "thanks", "ok": reply in one short line, warm and human. No card, no link, no menu of options. Then let them lead.

THE ONE HARD RULE — every substantive reply names something specific of ours, with its link:
- Name the actual course, programme or build from the WEBSITE CONTENT — "AI Foundations for Everyone", not "our training". Give its markdown link: [AI Foundations for Everyone](/ai-academy).
- One link, sometimes two. Never zero. If the content genuinely has nothing close, point them to [Contact](/contact).
- The link is the point of the message. Everything before it is context for why that link is the right next step.

WHAT WE OFFER:
- **Training for organizations** — live training for a team, built around the work the team does. Microsoft certification tracks are included.
- **Automation** — scoped one process at a time, built with Claude and other tools.
- **Learning Studio** — video courses with labs, quizzes and certificates (AI-103 and AI-500 are live), and Claude courses by domain being prepared.
- **AI Essentials** — free self-paced courses, the on-ramp for an individual.
Never quote prices, durations or client names. If asked about cost, say it depends on scope and send them to [Contact](/contact).
Match the answer to who is asking: an individual learning gets a course; someone describing an organisational problem gets the build or the programme that solves it, and the course only as the on-ramp.

WHY US:
We are Microsoft Certified Trainers, Gennoor is Certified in the Claude Partner Network, and we build what we teach. Use one strand only where it answers what they asked. Never paste this.

ANSWERING — talk like a knowledgeable colleague, not a brochure:
- Match the length to the question. A one-line question gets a one-line answer. Most replies are 2-4 sentences (~40-60 words). 110 words is a hard ceiling you should rarely reach, not a target.
- LAND THE ANSWER. Finish the thought. Do NOT end every message with a question — that makes the visitor do all the work. Most messages should simply end.
- Ask something only when you genuinely cannot proceed without it. When that happens, use a CARD (below) — never write the choices out as prose.
- Vary your shape. Do not repeat the same "answer → what makes us different → question" template every turn. Once they know the difference, stop restating it.
- Short follow-ups ("explain", "more", "why", "ok") continue the CURRENT topic. Never ask what they meant.
- Typos and half-words ("mamager", "trainin") are obvious — read the intent and answer it. NEVER reply "did you mean…". Never ask someone to clarify a word you already understood.
- Acknowledgements ("ok", "thanks", "got it") get one short line, not a menu of options.

SCOPE — you are an assistant on a company website, not a general search engine:
- In scope: AI, data, technology, training, skills, careers in tech, and how organisations adopt any of it. Answer these properly.
- Out of scope: weather, news, sport, travel, politics, health, personal advice, anything unrelated to the above. Decline in ONE short line and offer what you can help with instead. Do NOT answer the out-of-scope question, even partially, and do NOT cite outside sources for it.

NEVER:
- Never narrate where your information came from. No "that's general background", no "from our site", no "I don't see a page on this". Just answer.
- Never link to any website other than gennoor.com. No citations, no external sources, no reference URLs — not even to support a fact.
- Never name or recommend another training provider, platform or course marketplace. Microsoft is the ONE exception — name their certifications (AI-900, AI-102, AB-100, Applied Skills) because we deliver that curriculum officially.
- Never invent statistics, client names, prices, dates or durations.

CAPABILITY vs SPECIFICS — the distinction that matters most:
- Our CAPABILITY is wider than any single page. We train and build across AI: agentic systems and AI agents, LLMs and RAG, classic machine learning and forecasting, MLOps, computer vision, Microsoft/Azure AI, AWS and Google Cloud AI, plus responsible AI and governance. If someone asks about an AI or data topic with no listed course, the answer is YES — we can deliver it as a programme scoped to their team. Never answer "we don't have that" for something inside AI, data or technology enablement.
- SPECIFICS must be real: named courses, durations, prices, certification codes, client names and dates come only from the material you were given. When you don't have the specific, describe what we'd do and offer to scope it — don't invent a course name or a number to fill the gap.
- Say no only when it is genuinely outside what we do (a university degree, legal or medical advice, hardware supply).

STYLE — small chat window: short sentences, plain "- " bullets only when genuinely listing (max 4), no headings, tables or code blocks. Bullets are not mandatory — most answers are plain sentences.

EMOJI — sparing and grown-up. At most ONE per message, and only where it carries meaning: a bullet list of tracks, a genuine congratulation, a clear next step. Restrained set only: ▸ · → · ✓ · ⚡ · 🎯 · 📄 · 💡 · 🤝. Never 😊😂🔥🚀💯, never decorate a sentence, never open a message with one. Many messages should carry none at all — an emoji you didn't need reads as filler.

COURSE OUTLINES: when someone asks what a course covers, or wants the syllabus, modules or a brochure, link the curriculum page — it carries the full PDF outline alongside the chapter list. Offer it only where they're actually asking about content depth, not on every mention of a course.`

/**
 * Adaptive card protocol. The model appends a card when the useful answer
 * genuinely depends on things it doesn't know yet — role, team size, goal —
 * instead of guessing or dumping every option. Free text always available so
 * a visitor is never trapped in our dropdowns.
 */
const CARD_RULES = `ADAPTIVE CARD — this is your ONLY way to ask a question:

THE RULE: if your reply would offer the visitor a choice, or ask which/who/what-kind, you MUST express that as a card instead of prose. Writing "Which fits — executive, manager, or practitioner?" as text is WRONG. That exact sentence is a card.

Use a card when:
- they ask about training or a pilot without saying who it's for, the level, or the goal ("AI training", "we want AI training", "can you train my team")
- they ask which course or path to pick without stating role or level
- their problem could map to several offerings

NEVER use a card for:
- a greeting or acknowledgement ("hi", "hello", "ok", "thanks") — those get one line
- "what do you do", "what do you provide", "tell me about Gennoor" — you can answer these outright; answer, name one thing with its link, stop
- any factual question you can answer (a price, a duration, "what is AI")
A card is for narrowing a real request, never for opening a conversation.

When you use a card:
- your text is ONE or TWO sentences of substance, then the card. No trailing question in the text.
- never restate the card's options in the prose above it.
Format, on its own line at the very end, nothing after it:
<card>{"title":"short heading","fields":[{"id":"audience","label":"Who is this for?","type":"select","options":["Whole team","Managers","Engineers","Just me"]},{"id":"goal","label":"What's the goal?","type":"select","options":["Awareness","Certification","Build something"]},{"id":"notes","label":"Anything specific?","type":"text","placeholder":"optional"}],"submitLabel":"Show me options"}</card>
Rules: 2-4 fields maximum. At least one select. Always include one "text" field so they can type instead. Options must be short and mutually exclusive. Valid JSON on ONE line.`

/**
 * The question isn't covered by the website. Answer it from live web search,
 * then bring it back to what Gennoor actually does — in one message, without
 * narrating the source or naming competitors. Returns null when web search is
 * unavailable so the caller can fall back to the site-content path.
 */
/**
 * Strip links to anywhere that isn't ours.
 *
 * The web-grounded path cites its sources by habit, and a prompt rule alone
 * doesn't reliably stop it — production returned a weather answer linking to
 * arabiaweather.com and accuweather.com. This enforces it structurally:
 * markdown links keep their text and lose the URL, bare foreign URLs go
 * entirely. gennoor.com and mailto:/tel: links pass through.
 */
function stripForeignLinks(text: string): string {
  const ours = (url: string) => /^(mailto:|tel:|\/)/i.test(url) || /(^|\/\/|\.)gennoor\.com/i.test(url) || /^https?:\/\/wa\.me\//i.test(url)
  return text
    // [label](url) → label, unless the url is ours
    .replace(/\[([^\]]+)\]\(([^)\s]+)[^)]*\)/g, (match, label, url) => (ours(String(url)) ? match : String(label)))
    // Bare URLs and parenthesised citations like "(example.com)"
    .replace(/\((?:https?:\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z]{2,})+[^)]*\)/gi, (m) => (ours(m.replace(/[()]/g, '')) ? m : ''))
    .replace(/https?:\/\/[^\s)]+/gi, (m) => (ours(m) ? m : ''))
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export interface BotCardField {
  id: string
  label: string
  type: 'select' | 'text'
  options?: string[]
  placeholder?: string
}

export interface BotCard {
  title: string
  fields: BotCardField[]
  submitLabel: string
}

/**
 * Pull a trailing <card>{…}</card> out of a reply and validate it hard.
 *
 * Anything malformed is dropped silently and the text still renders — a
 * broken card must never cost the visitor their answer. Options are capped
 * and trimmed because the model occasionally returns a dozen of them, which
 * would not fit the chat window.
 */
/**
 * When a card is present the prose must not also ask. The model still tends to
 * write "Could you tell me more about your team?" directly above its own card
 * — the double-asking that made the bot feel like an interrogation.
 */
function dropTrailingQuestion(text: string): string {
  const lines = text.split('\n').map((l) => l.trimEnd()).filter((l) => l.trim())
  if (lines.length < 2) return text.trim()
  const last = lines[lines.length - 1].trim()
  if (last.endsWith('?') && last.length <= 180) return lines.slice(0, -1).join('\n').trim()
  return lines.join('\n').trim()
}

function extractCard(raw: string): { text: string; card?: BotCard } {
  const match = raw.match(/<card>\s*([\s\S]*?)\s*<\/card>/i)
  if (!match) return { text: raw }
  const text = raw.replace(match[0], '').trim()
  try {
    const parsed = JSON.parse(match[1])
    const fields: BotCardField[] = (Array.isArray(parsed.fields) ? parsed.fields : [])
      .map((f: any, i: number) => {
        const type = f?.type === 'text' ? 'text' : 'select'
        const options = Array.isArray(f?.options)
          ? f.options.map((o: any) => String(o).slice(0, 60)).filter(Boolean).slice(0, 6)
          : []
        // A select with no options is unusable — demote it to free text
        if (type === 'select' && options.length < 2) {
          return { id: String(f?.id || `f${i}`).slice(0, 40), label: String(f?.label || '').slice(0, 90), type: 'text' as const, placeholder: 'Type your answer' }
        }
        return {
          id: String(f?.id || `f${i}`).slice(0, 40),
          label: String(f?.label || '').slice(0, 90),
          type,
          ...(type === 'select' ? { options } : { placeholder: String(f?.placeholder || 'Type your answer').slice(0, 60) }),
        }
      })
      .filter((f: BotCardField) => f.label)
      .slice(0, 4)

    if (fields.length === 0) return { text }
    return {
      text: dropTrailingQuestion(text),
      card: {
        title: String(parsed.title || 'A couple of quick questions').slice(0, 80),
        fields,
        submitLabel: String(parsed.submitLabel || 'Continue').slice(0, 30),
      },
    }
  } catch {
    return { text }
  }
}

/**
 * Backstop for the "which — a, b, or c?" sentence.
 *
 * The prompt says choice-questions must be cards, but the model still writes
 * them as prose sometimes, which is exactly the behaviour that made the bot
 * feel like an interrogation. When we spot a trailing choice-question and no
 * card was emitted, lift the options out of the sentence into a real card and
 * drop the sentence — the visitor taps instead of typing.
 *
 * Deliberately conservative: only a final-line question containing an "or"
 * list of 2-4 short options qualifies. Anything else is left alone.
 */
function choiceQuestionToCard(text: string): { text: string; card?: BotCard } {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
  const last = lines[lines.length - 1]
  if (!last || !last.endsWith('?') || last.length > 160) return { text }

  // "Which fits — executive, manager, or practitioner?" → the part after the
  // final dash/colon, or after "is it" / "are you", split on commas and "or".
  const tail = last.replace(/\?$/, '').split(/[—:–-]\s*/).pop() || ''
  const parts = tail
    .split(/,| or /i)
    .map((p) => p.trim().replace(/^(the|a|an)\s+/i, '').replace(/\.$/, ''))
    .filter((p) => p.length > 1 && p.length <= 32 && !/\s{0,}\bhttps?:/i.test(p))
  if (parts.length < 2 || parts.length > 4) return { text }
  // Guard against splitting an ordinary sentence: options are short phrases
  if (parts.some((p) => p.split(/\s+/).length > 4)) return { text }

  const label = last.replace(/\s*[—:–-]\s*[^—:–-]*\?$/, '?').trim()
  return {
    text: lines.slice(0, -1).join('\n').trim(),
    card: {
      title: label.length > 4 && label.endsWith('?') ? label : 'Which fits best?',
      fields: [
        { id: 'choice', label: 'Pick one', type: 'select', options: parts.map((p) => p[0].toUpperCase() + p.slice(1)) },
        { id: 'notes', label: 'Or tell us in your words', type: 'text', placeholder: 'optional' },
      ],
      submitLabel: 'Continue',
    },
  }
}

async function answerFromWeb(
  question: string,
  nearby: Array<{ title: string; url: string; text: string }>,
  visitorName?: string,
  studioText = ''
): Promise<{ reply: string; links: Array<{ title: string; url: string }>; card?: BotCard } | null> {
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

Use live web search to get the facts right, then answer as Gennoor's assistant.

${VOICE_RULES}

LINKS: exactly one, from the offerings or Learning Studio courses listed below, written as markdown [title](url). Never invent a URL. Only when nothing below genuinely relates may you skip it and point to [Contact](/contact) instead — but look hard first; a visitor who leaves with no next step is a failed answer.
${visitorName ? `The visitor's name is ${visitorName}; use it naturally, not in every message.` : ''}

${CARD_RULES}

GENNOOR OFFERINGS CLOSEST TO THIS QUESTION:
${catalogue || '(nothing in the catalogue is close to this topic)'}

${studioText}`,
      question
    )

    const { text: rawText, card } = extractCard((result.text || '').trim())
    // The grounded model cites its sources — none of which may reach a visitor
    const reply = stripForeignLinks(rawText)
    if (!reply) return null
    // Only surface links the model actually used, and only ours
    const links = nearby
      .filter((c) => reply.includes(c.url))
      .map((c) => ({ title: c.title, url: c.url }))
      .filter((l, i, arr) => arr.findIndex((x) => x.url === l.url) === i)
      .slice(0, 2)
    return { reply, links, card }
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

    const studio = await getStudioCourses()

    // Cache — only opening questions, and only ones distinctive enough that a
    // shared answer is safe. "?" and greetings are deliberately never cached.
    const isOpening = history.filter((m) => m.role === 'user').length === 1 && isCacheableQuestion(question)
    const cacheKey = questionKey(question)
    if (isOpening) {
      const hit = await getCachedAnswer(cacheKey)
      if (hit) {
        // Answers cached before the Studio courses were known get the link added now
        const fixed = ensureStudioLinks(hit.answer, matchStudioCourses(question, studio))
        const cachedLinks = [...fixed.links, ...hit.links.filter((l: any) => !fixed.links.some((x) => x.url === l.url))]
        if (!READONLY) await appendLog({ at: new Date().toISOString(), sessionId, q: question, a: fixed.reply, links: cachedLinks.map((l: any) => l.url), cached: true })
        return NextResponse.json({ reply: fixed.reply, links: cachedLinks, cached: true })
      }
    }

    // Retrieve
    const meta = await loadIndexMeta()
    const vectors = meta ? await loadVectors(meta.updatedAt) : null
    if (!meta || !vectors) {
      return NextResponse.json({
        reply: 'I’m still learning the website — give me a little while. Meanwhile:\n- Explore [our services](https://www.gennoor.com/training)\n- Browse the free [AI Essentials](https://www.gennoor.com/ai-academy)\n- Or write to [admin@gennoor.com](mailto:admin@gennoor.com)',
        links: [],
      })
    }
    // 'query' side of the asymmetric prefix pair the model was trained with.
    // A visitor can ask in Arabic, French, German or Swahili and still match
    // the English pages — that's what the multilingual model buys us.
    const [qv] = await embedTexts([question], 'query')
    // One scoring pass, read twice: the best overall, and the best commercial
    // pages further down the ranking that the course-heavy index would bury.
    const wide = topKScored(Float32Array.from(qv), vectors, meta.chunks, 60)
    const top = wide.slice(0, TOP_K).map((s) => s.chunk)
    const bestScore = wide[0]?.score ?? 0

    // When the site genuinely doesn't cover the question, answer it from the
    // web rather than stonewalling — but honestly, and always landing back on
    // what Gennoor actually does. Threshold is low because this model's
    // cosine scores are compressed (a correct match lands around 0.30-0.40).
    if (bestScore < WEAK_MATCH) {
      const grounded = await answerFromWeb(question, top, visitorName, studioBlock(studio))
      if (grounded) {
        const fixed = ensureStudioLinks(grounded.reply, matchStudioCourses(question, studio))
        const out = { ...grounded, reply: fixed.reply, links: [...fixed.links, ...grounded.links.filter((l) => !fixed.links.some((x) => x.url === l.url))].slice(0, 4) }
        if (!READONLY) {
          await addUsage(Math.round((question.length + out.reply.length) / 4))
          await appendLog({ at: new Date().toISOString(), sessionId, q: question, a: out.reply, links: out.links.map((l) => l.url) })
        }
        return NextResponse.json(out)
      }
      // Web unavailable (Foundry busy) — fall through to the site-only path,
      // which says "I don't have that" honestly rather than inventing.
    }

    // Retrieval alone skews hard to courses — the index holds ~110 training and
    // academy chunks against 7 industries, 6 functions and 18 POCs, so vector
    // similarity almost always returns a course and the bot only ever offers
    // free ones. Reserving slots for the commercial side keeps builds,
    // industries and delivered work in front of the model on every turn.
    const isCourse = (url: string) => /\/academy\/|\/curriculum\//.test(url)
    const isCommercial = (url: string) => /\/services\/|\/training|\/automation|\/claude/.test(url)
    // `wide` reuses the single scoring pass already done above — the vectors
    // array is positional, so a filtered chunk list must never be re-scored.
    const commercialTop = wide.filter((s) => isCommercial(s.chunk.url)).slice(0, 3).map((s) => s.chunk)
    const merged = [
      ...top.filter((c) => !isCourse(c.url)),
      ...commercialTop,
      ...top.filter((c) => isCourse(c.url)),
    ].filter((c, i, arr) => arr.findIndex((x) => x.id === c.id) === i)
      .slice(0, TOP_K + 2)

    const context = merged.map((c, i) => `[${i + 1}] ${c.title} (${c.url})\n${c.text.slice(0, 1600)}`).join('\n\n')
    const rawReply = await chatCompletion(
      [
        {
          role: 'system',
          content: `You are GennoorCare, the assistant on gennoor.com (Gennoor Tech: AI training, POCs, and AI product development — TRAIN. INNOVATE. BUILD.). You help visitors find the right courses, programs and services.

${VOICE_RULES}

GROUNDING:
- The WEBSITE CONTENT below is numbered, and each entry carries its real URL. Pick the entry that best matches what this person is trying to do and link it — that is the single most useful thing you can do for them.
- Specifics — course names, durations, prices, dates, modules — come ONLY from the WEBSITE CONTENT. Never guess them, and never invent a URL.
- Where the content doesn't cover a detail, answer the part you can and move to the next step. Don't announce the gap.
- If a company sounds ready, offer the free tailored 2-hour webinar or free 1-day training as the starting point.
- Off-topic requests: decline in one line and steer back.
${visitorName ? `- The visitor's name is ${visitorName} — address them naturally by first name, not in every message.` : ''}

${CARD_RULES}

WEBSITE CONTENT:
${context}

${studioBlock(studio)}`,
        },
        ...history,
      ],
      // Room for a real answer plus the named offering and its link — 320 was
      // squeezing the link out. Still far short of an essay.
      { maxTokens: 420 }
    )

    const extracted = extractCard(rawReply)
    // If it asked a choice-question in prose instead of emitting a card, convert it
    const promoted = extracted.card ? extracted : choiceQuestionToCard(extracted.text)
    const card = extracted.card || promoted.card
    // A matching Studio course always gets its link, even if the model left it out
    const fixed = ensureStudioLinks(stripForeignLinks(promoted.text), matchStudioCourses(question, studio))
    const reply = fixed.reply
    const links = [
      ...fixed.links,
      ...top
        .filter((c) => reply.includes(c.url))
        .map((c) => ({ title: c.title, url: c.url })),
    ]
      .filter((l, i, arr) => arr.findIndex((x) => x.url === l.url) === i)
      .slice(0, 4)

    // Rough token accounting: context + history + reply
    if (!READONLY) {
      await addUsage(Math.round((context.length + question.length + reply.length) / 4))
      // Cards are conversation state, not a cacheable answer — a cached card
      // would replay someone else's questions at the wrong moment.
      if (isOpening && !card) await setCachedAnswer(cacheKey, reply, links)
      await appendLog({ at: new Date().toISOString(), sessionId, q: question, a: reply, links: links.map((l) => l.url) })
    }

    return NextResponse.json({ reply, links, card })
  } catch (error) {
    console.error('GennoorCare error:', error)
    return NextResponse.json(HUMAN_FALLBACK)
  }
}
