import type { TopicIdea } from './types'
import { toPlain } from '@/lib/linkedin-format'
import { cut } from '@/lib/safe-text'

// Variety rules shared by the LinkedIn and blog autopilots: post formats that rotate, a wider pool of research
// sources than vendor press releases, a repeat check that compares meaning (not just title words), a per-vendor
// weekly cap and a check that a new opening line does not echo a recent one. Pure functions, so they are testable.

export interface Format { key: string; label: string; guide: string }

/** LinkedIn post formats. The research editor tags every idea with one; the planner rotates them. */
export const POST_FORMATS: Format[] = [
  { key: 'news-explained', label: 'Today\'s news, explained', guide: 'The story people are talking about today, for a reader who is not technical. Line 1: what happened, in plain words (who did what). Then: what it is, in one or two sentences with every technical word explained. Then two or three short points on why it matters to a business. Then what to do or watch next. 90-160 words.' },
  { key: 'walkthrough', label: 'Try-it walkthrough', guide: 'Something the reader can try today with the AI tools they already have at work. Open with the time or the trouble it saves, then 3-5 steps a person who does not write code can follow (use → for each step) and the result to expect.' },
  { key: 'use-case', label: 'Real use case', guide: 'How a real company, named in the source, used AI: the problem they had, what they did in plain words, the result the source reports with what was measured, and the lesson for the reader.' },
  { key: 'workflow', label: 'Copyable workflow', guide: 'A prompt, a checklist or a way of working the reader can copy and use today. Show it, then say when it works and when it does not. Ask readers to save it.' },
  { key: 'builder-buzz', label: 'What people are trying', guide: 'Something people are excited about right now (a new tool, a demo, a study, a new way of working), explained plainly: what it is, why people care, whether a business can use it yet.' },
  { key: 'contrarian', label: 'Contrarian take', guide: 'Challenge a popular claim or common practice, backed by the source. State the common belief, why it is wrong or incomplete, and what to do instead.' },
  { key: 'number', label: 'One number explained', guide: 'Lead with one striking number from the source. Say what was measured, what it means, what it does not mean, and the decision it should change.' },
  { key: 'myth-fact', label: 'Myth vs fact', guide: 'Three or four common myths about one topic, each followed by the fact, all traceable to the sources.' },
  { key: 'news-take', label: 'News, with a take', guide: 'One fresh release or announcement. Say what it is in one plain line, then what it changes for the reader. At most one of these a day.' },
]

/** Long-form blog formats. */
export const BLOG_FORMATS: Format[] = [
  { key: 'how-to', label: 'How-to guide', guide: 'A step-by-step guide to doing one real thing, with prerequisites, numbered steps, pitfalls and how to check it worked.' },
  { key: 'case-study', label: 'Case study breakdown', guide: 'Break down how a real organisation used AI: the starting problem, the architecture or approach, the results the sources report, what transfers to other teams.' },
  { key: 'comparison', label: 'Comparison', guide: 'Compare two to four tools, models or approaches against the criteria an enterprise cares about (cost, control, security, effort), and say when to pick each.' },
  { key: 'deep-dive', label: 'Explainer deep dive', guide: 'Explain how something actually works under the hood, plainly, then what it means for design and operating decisions.' },
  { key: 'contrarian', label: 'Contrarian analysis', guide: 'Take on a popular belief with evidence: the belief, what the evidence says, the better approach.' },
  { key: 'field-guide', label: 'Field guide / checklist', guide: 'A practical reference the reader will bookmark: a checklist, decision tree or readiness assessment for one topic, with the reasoning behind each item.' },
]

export const formatOf = (list: Format[], key?: string) => list.find(f => f.key === key)

/**
 * Content pillars: each slot of the day has one, and each pillar gets its own research search, so the day always has
 * the core business (Microsoft), a real use case, something hands-on and a debate, from different places on the web.
 */
export interface Pillar {
  key: string; label: string; brief: string; formats: string[]
  /** An idea that happened longer ago than this is dropped (see `freshEnough`). */
  maxAgeDays: number
  /** A stream of news may return to a company it covered this week: the cap on one company a week does not apply. */
  news?: boolean
}
export const PILLARS: Pillar[] = [
  // The owner's words (13 November 2026): "The hot news, the cake of the market needs to be found."
  { key: 'top-story', label: 'Today\'s top story', formats: ['news-explained'], maxAgeDays: 3, news: true,
    brief: 'The one or two AI stories most people are talking about in the last 48 hours: a major model or product launch (OpenAI, Anthropic, Google, Microsoft, Meta, Mistral, xAI, NVIDIA, Apple, Amazon), a big deal or funding round, a new law or rule, an outage or a security incident, a widely shared study or number. Look at the front pages: Reuters, Bloomberg, The Verge, TechCrunch, the Economic Times, Mint, the vendors\' own newsrooms, the Hacker News front page, and what is trending on LinkedIn and X. The test: would a manager hear about this at lunch today? Take the biggest stories, not the most technical ones, and never an old story dressed as new.' },
  { key: 'microsoft', label: 'Microsoft and Azure', formats: ['walkthrough', 'workflow', 'news-take', 'myth-fact', 'number', 'use-case'], maxAgeDays: 10,
    brief: 'Microsoft AI at work, the core of the business: Microsoft 365 Copilot, Copilot Studio, Azure AI Foundry, Azure OpenAI, Agent Framework, Fabric, GitHub Copilot, Power Platform AI, and Microsoft AI certifications (AI-102, AI-900 and new ones). Look at the Microsoft 365 and Azure blogs, Microsoft Learn and Tech Community, GitHub changelogs, Ignite and Build sessions, and real customer stories. Favour what a team can use or decide this week, and what a person who does not write code can try.' },
  { key: 'use-case', label: 'Real use case', formats: ['use-case', 'number'], maxAgeDays: 45,
    brief: 'How real organisations use AI in their daily work, from any industry and any company EXCEPT Microsoft: customer case studies, company blogs, conference talks, earnings-call remarks, and survey numbers. Spread across regions (India, the Gulf, Europe, the US) and industries (banking, retail, health, manufacturing, telecom, public sector, software). One company per idea, and never two ideas about the same company. Choose stories a manager can picture: a named team, a task they do, the time or money it changed.' },
  { key: 'hands-on', label: 'Try it today', formats: ['walkthrough', 'workflow', 'builder-buzz'], maxAgeDays: 30,
    brief: 'Something a person at work can try today with an AI assistant they already have (Claude, ChatGPT, Copilot, Gemini): a prompt that works, a way to write a weekly report in minutes, a way to turn notes into slides or a spreadsheet, a simple automation, a first agent, a new feature worth switching on. Look at what people share on LinkedIn, X, Reddit (r/ClaudeAI, r/OpenAI, r/ChatGPT) and YouTube, and at the vendors\' own tips. Prefer what needs no code. A tool for developers only when it is the talk of the week, and then explained for everyone. Any vendor, but not Microsoft. Each idea must be something a reader can try or copy.' },
  { key: 'debate', label: 'Debate', formats: ['contrarian', 'myth-fact', 'news-take', 'number'], maxAgeDays: 10,
    brief: 'What people who use AI at work are arguing about: does it really save time, cost against value, build or buy, which assistant to choose, can an AI agent be trusted with real tasks, AI and jobs, AI security incidents, new rules (the EU AI Act, India). Each idea must have two credible sides that a manager could vote on in a poll, with the question put in plain words. Any vendor or none, but not Microsoft.' },
]
export const pillarOf = (key?: string) => PILLARS.find(p => p.key === key)

/**
 * The stream of each slot of a day. It changes with the day of the week, so the day does not look the same
 * every day: the first post is always the top story, the poll is always the debate, and the other posts take
 * turns between Microsoft, a real use case and something to try. `today` is the date in the autopilot's own
 * time zone (YYYY-MM-DD).
 */
export function pillarsFor(today: string, slots: { kind: string }[]): string[] {
  const day = new Date(`${today}T12:00:00Z`).getUTCDay() // 0 Sunday ... 6 Saturday
  const turns: Record<number, string[]> = {
    0: ['microsoft', 'use-case'],
    1: ['microsoft', 'hands-on'],
    2: ['use-case', 'microsoft'],
    3: ['microsoft', 'hands-on'],
    4: ['use-case', 'microsoft'],
    5: ['microsoft', 'hands-on'],
    6: ['use-case', 'hands-on'],
  }
  const rest = [...turns[day], ...['microsoft', 'use-case', 'hands-on'].filter(p => !turns[day].includes(p))]
  let posts = 0
  return slots.map(s => {
    if (s.kind === 'poll') return 'debate'
    posts++
    return posts === 1 ? 'top-story' : rest[(posts - 2) % rest.length]
  })
}

/**
 * Is this idea recent enough for its stream? An idea with no date is kept, except in a news stream, where
 * "when did it happen" is the whole point. `today` is YYYY-MM-DD.
 */
export function freshEnough(idea: { date?: string }, pillar: Pillar | undefined, today: string, fallbackDays = 21): boolean {
  const at = idea.date && /^\d{4}-\d{2}-\d{2}/.test(idea.date) ? Date.parse(`${idea.date.slice(0, 10)}T12:00:00Z`) : NaN
  if (Number.isNaN(at)) return !pillar?.news
  const age = (Date.parse(`${today}T12:00:00Z`) - at) / 86_400_000
  // A date a day ahead is a time-zone difference, not a mistake; further ahead is one.
  return age >= -1.5 && age <= (pillar?.maxAgeDays ?? fallbackDays)
}

/** Where the research editor should look, beyond vendor newsrooms. */
export const RESEARCH_SOURCES = `Look well beyond vendor press releases. Search across:
- What builders are sharing and trying: Hacker News front page, GitHub trending (AI repos), Reddit (r/LocalLLaMA, r/MachineLearning, r/ClaudeAI, r/OpenAI, r/AZURE, r/sysadmin), developer posts on X and LinkedIn, YouTube demos.
- Research: arXiv and Papers with Code, lab and university blogs, benchmark leaderboards.
- How real companies use AI: engineering blogs (Netflix, Uber, Airbnb, Shopify, Stripe, LinkedIn, Indian firms such as Flipkart, Swiggy, Zomato, Razorpay, Infosys, TCS), customer stories, conference talks.
- Numbers: analyst and survey reports (Gartner, McKinsey, Stanford AI Index, Stack Overflow survey), pricing pages, benchmark results.
- Vendor news (Microsoft, Google, AWS, OpenAI, Anthropic, Meta, open source) and regulators, as only one of these streams.`

// ---- Similarity ----------------------------------------------------------------------------------------------------

const words = (s: string) => new Set(s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(w => w.length > 3))
/** Word-overlap (Jaccard) similarity: cheap, used when embeddings are unavailable and for opening lines. */
export function wordSimilarity(a: string, b: string) {
  const x = words(a), y = words(b)
  if (!x.size || !y.size) return 0
  let n = 0
  x.forEach(w => { if (y.has(w)) n++ })
  return n / (x.size + y.size - n)
}

export function cosine(a: number[], b: number[]) {
  let dot = 0, na = 0, nb = 0
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i] }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1)
}

// Calibrated on a simulated week (text-embedding-3-small on title + angle): the same story retold scored 0.75-0.81,
// a recurring theme 0.60-0.79, unrelated posts 0.40 on average (90th percentile 0.52).
/** At or above this, an idea is the same story told again (checked against 30 days). */
export const SEMANTIC_REPEAT = 0.72
/** At or above this, an idea is on the same theme as an earlier post... */
export const THEME_NEAR = 0.6
/** ...and a theme already covered this many times in 7 days is rested. */
export const THEME_MAX_PER_WEEK = 2
/** Word overlap at or above this means a repeat, when embeddings are not available. */
export const WORD_REPEAT = 0.5

export type Embed = (texts: string[]) => Promise<number[][]>

const ideaText = (i: { title: string; angle?: string }) => `${i.title}. ${i.angle || ''}`.trim()

/**
 * Drops ideas that repeat something already posted, or repeat each other. With `embed` it compares meaning
 * (title + angle) so a reworded story is still caught; it always also applies the word-overlap check, and falls
 * back to it alone when embedding fails.
 */
export async function freshIdeas<T extends { title: string; angle?: string }>(ideas: T[], past: { title: string; angle?: string; at?: string }[], embed?: Embed, now?: Date, themeMax = THEME_MAX_PER_WEEK): Promise<T[]> {
  ideas = ideas.filter(i => i.title)
  let vecs: number[][] | null = null
  if (embed && ideas.length) {
    try {
      const all = await embed([...ideas.map(ideaText), ...past.map(ideaText)])
      if (all.length === ideas.length + past.length) vecs = all
    } catch { vecs = null }
  }
  const pastVecs = vecs ? vecs.slice(ideas.length) : []
  const kept: { i: T; v?: number[] }[] = []
  ideas.forEach((idea, k) => {
    const v = vecs?.[k]
    const repeatsPast = past.some((p, j) => wordSimilarity(p.title, idea.title) >= WORD_REPEAT || (v && cosine(v, pastVecs[j]) >= SEMANTIC_REPEAT))
    // Theme fatigue: the same subject (say, coding benchmarks) at most twice a week, even told differently.
    const weekAgo = now ? now.getTime() - 7 * 86_400_000 : null
    const themeHits = v && weekAgo !== null ? past.filter((p, j) => p.at && Date.parse(p.at) > weekAgo && cosine(v, pastVecs[j]) >= THEME_NEAR).length : 0
    if (themeHits >= themeMax) return
    const repeatsKept = kept.some(x => wordSimilarity(x.i.title, idea.title) >= WORD_REPEAT || (v && x.v && cosine(v, x.v) >= SEMANTIC_REPEAT))
    if (!repeatsPast && !repeatsKept) kept.push({ i: idea, v })
  })
  return kept.map(x => x.i)
}

// ---- Vendors -------------------------------------------------------------------------------------------------------

const VENDOR_ALIASES: [RegExp, string][] = [
  [/microsoft|azure|copilot|github|fabric/, 'microsoft'],
  [/google|gemini|vertex|deepmind/, 'google'],
  [/aws|amazon|bedrock|agentcore/, 'aws'],
  [/openai|chatgpt|gpt/, 'openai'],
  [/anthropic|claude/, 'anthropic'],
  [/meta|llama/, 'meta'],
  [/mistral/, 'mistral'],
  [/nvidia/, 'nvidia'],
  [/spotify/, 'spotify'],
]
/** One canonical vendor key, so "Azure AI Foundry" and "Microsoft" count as the same vendor. */
export function vendorKey(v?: string): string {
  const s = (v || '').toLowerCase().trim()
  if (!s) return ''
  return VENDOR_ALIASES.find(([re]) => re.test(s))?.[1] ?? s
}

const NO_VENDOR = ['', 'none', 'n/a', 'industry', 'open source', 'various', 'multiple', 'community']
// Hosts that publish about everyone, so they say nothing about whose story it is.
const GENERIC_HOSTS = new Set(['github', 'arxiv', 'reddit', 'ycombinator', 'medium', 'substack', 'x', 'twitter', 'youtube', 'linkedin', 'techcrunch', 'theverge', 'venturebeat', 'wired', 'reuters', 'bloomberg', 'zdnet', 'infoq', 'huggingface', 'paperswithcode', 'thenewstack', 'forbes', 'cnbc', 'businessinsider', 'economictimes', 'livemint', 'gartner', 'mckinsey', 'stanford', 'newscura'])
/**
 * Whose story an idea is. Uses the vendor tag, and when that is empty or "none", the first source's site
 * (shopify.engineering -> shopify), so two posts about one company on the same day are still caught.
 */
export function ideaVendor(i: { vendor?: string; company?: string; sources?: { url: string }[] }): string {
  // The organisation the story is about comes first: Wayfair's use of Gemini is a Wayfair story, not a Google one.
  const c = vendorKey(i.company)
  if (c && !NO_VENDOR.includes(c)) return c
  const v = vendorKey(i.vendor)
  if (v && !NO_VENDOR.includes(v)) return v
  for (const src of i.sources || []) {
    try {
      const parts = new URL(src.url).hostname.replace(/^www\./, '').split('.')
      // shopify.engineering -> shopify, engineering.atspotify.com -> atspotify (alias -> spotify), example.co.in -> example
      let k = parts.length > 1 ? parts.length - 2 : 0
      if (k > 0 && ['co', 'com', 'org', 'ac', 'gov', 'net'].includes(parts[k])) k--
      const host = parts[k]
      // Check the site before aliasing: a repo on github.com is not a Microsoft story.
      if (host && !GENERIC_HOSTS.has(host)) return vendorKey(host)
    } catch { /* not a URL */ }
  }
  return ''
}

/** How many times each vendor was posted about in the window. */
export function vendorCounts(history: { at: string; vendor?: string }[], now: Date, days = 7): Record<string, number> {
  const out: Record<string, number> = {}
  for (const h of history) {
    if (Date.parse(h.at) < now.getTime() - days * 86_400_000) continue
    const k = vendorKey(h.vendor)
    if (k && !NO_VENDOR.includes(k)) out[k] = (out[k] || 0) + 1
  }
  return out
}

// ---- Slot planner --------------------------------------------------------------------------------------------------

/**
 * Picks one idea per slot, in order: hottest first, but never the same vendor twice in a day, never a vendor that has
 * hit its weekly cap (relaxed only if there is otherwise not enough to fill the day), never the same format twice in
 * a row or twice in a day where an alternative exists, and at most one plain news post a day.
 */
export function planSlots(ideas: TopicIdea[], slots: { kind: string }[], o: { lastFormat?: string; vendorWeek: Record<string, number>; vendorCap: number; pillars?: string[]; core?: string[]; pillarFormats?: Record<string, string[]> }): TopicIdea[] | null {
  const pool = [...ideas].sort((a, b) => (b.heat || 0) - (a.heat || 0))
  const core = o.core || []
  const pick = (strict: boolean): TopicIdea[] | null => {
    const used = new Set<TopicIdea>(), vendorsToday = new Set<string>(), formatsToday: string[] = []
    let prev = o.lastFormat
    const out: TopicIdea[] = []
    for (const [idx, slot] of slots.entries()) {
      // The slot's pillar comes first; another pillar's idea is used only when the pillar has nothing usable.
      const want = o.pillars?.length ? o.pillars[idx % o.pillars.length] : undefined
      const own = want ? pool.filter(i => i.pillar === want) : pool
      const ok = (i: TopicIdea, level: number) => {
        if (used.has(i)) return false
        const v = ideaVendor(i)
        if (v && vendorsToday.has(v)) return false
        // The weekly cap on one company does not hold back the news: if a company is today's story, it is today's story.
        if (strict && v && !core.includes(v) && !pillarOf(i.pillar)?.news && (o.vendorWeek[v] || 0) >= o.vendorCap) return false
        if (slot.kind === 'poll') return true
        const f = i.format || ''
        if (level >= 1 && f && f === prev) return false
        if (level >= 2 && f && formatsToday.includes(f)) return false
        // Each pillar rotates its formats across days too (the Microsoft slot should not be "a number" every day).
        if (level >= 2 && f && want && o.pillarFormats?.[want]?.includes(f)) return false
        if (level >= 1 && f === 'news-take' && formatsToday.includes('news-take')) return false
        return true
      }
      const choice = own.find(i => ok(i, 2)) || own.find(i => ok(i, 1)) || own.find(i => ok(i, 0))
        || pool.find(i => ok(i, 2)) || pool.find(i => ok(i, 1)) || pool.find(i => ok(i, 0))
      if (!choice) return null
      used.add(choice); out.push(choice)
      const v = ideaVendor(choice); if (v) vendorsToday.add(v)
      if (slot.kind !== 'poll' && choice.format) { formatsToday.push(choice.format); prev = choice.format }
    }
    return out
  }
  return pick(true) || pick(false)
}

// ---- Opening lines -------------------------------------------------------------------------------------------------

/**
 * The opening line of a post, in plain letters. Published posts keep their first line in Unicode bold, where
 * one letter is two units: compared as written they match nothing, and cut at "200" they can end on half a
 * letter (that stopped every draft on 12 and 13 November 2026; see lib/safe-text.ts).
 */
export const firstLine = (text: string) => cut(toPlain(text).split('\n').map(l => l.replace(/[*_#]/g, '').trim()).find(Boolean) || '', 200)

/** The recent opening line that the new one echoes, or null. Catches same-shape hooks like "Your agent passes every demo…". */
export function echoedHook(text: string, recentHooks: string[]): string | null {
  const h = firstLine(text)
  if (!h) return null
  const lead = (s: string) => s.toLowerCase().split(/\s+/).slice(0, 4).join(' ')
  return recentHooks.find(r => r && (wordSimilarity(r, h) >= 0.45 || (lead(r).length > 10 && lead(r) === lead(h)))) ?? null
}

/**
 * The editor's notes sent with a post, never longer than `max` (the agent service refuses a longer brief) and
 * never holding half a letter. What must be there is kept whole: the rules, the format, what to avoid and the
 * problems to fix from the last attempt. The recent openings fill the room that is left, newest first.
 */
export function buildBrief(p: { rules: string; format?: string; weekend?: string; avoid?: string[]; notes?: string[]; openings?: string[] }, max: number): string {
  const fixes = (p.notes || []).map(n => cut(n.replace(/\s+/g, ' ').trim(), 300)).filter(Boolean).slice(0, 6)
  const tail = [
    p.weekend ? `Weekend flavour: ${p.weekend}` : '',
    p.avoid?.length ? `Never mention: ${p.avoid.join('; ')}.` : '',
    fixes.length ? `\nFix these problems from the last attempt:\n- ${fixes.join('\n- ')}` : '',
  ].filter(Boolean).join('\n')
  const head = [p.rules.trim(), (p.format || '').trim()].filter(Boolean).join('\n')
  let room = max - head.length - tail.length - HOOK_RULES.length - 8
  const lines: string[] = []
  for (const h of [...(p.openings || [])].reverse()) {
    const line = `- ${cut(h.replace(/\s+/g, ' ').trim(), 140)}`
    if (lines.length >= 12 || line.length + 1 > room) break
    lines.unshift(line)
    room -= line.length + 1
  }
  const openings = lines.length ? `${HOOK_RULES}\n${lines.join('\n')}` : ''
  return cut([head, openings, tail].filter(Boolean).join('\n\n'), max)
}

export const HOOK_RULES = `Opening line: before writing, draft five different hooks of different types (the reader's problem, one striking number, a contrarian claim, a specific question, the outcome the reader gets) and use the strongest. It must not open with "X launched / announced", and must not resemble these recent openings in wording or shape:`
