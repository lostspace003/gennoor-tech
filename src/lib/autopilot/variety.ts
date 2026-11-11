import type { TopicIdea } from './types'

// Variety rules shared by the LinkedIn and blog autopilots: post formats that rotate, a wider pool of research
// sources than vendor press releases, a repeat check that compares meaning (not just title words), a per-vendor
// weekly cap and a check that a new opening line does not echo a recent one. Pure functions, so they are testable.

export interface Format { key: string; label: string; guide: string }

/** LinkedIn post formats. The research editor tags every idea with one; the planner rotates them. */
export const POST_FORMATS: Format[] = [
  { key: 'walkthrough', label: 'Try-it walkthrough', guide: 'A tool, feature or technique the reader can try today. Hook on the time or pain it removes, then 3-5 concrete setup steps (use → for each step) and the result to expect.' },
  { key: 'use-case', label: 'Real use case', guide: 'How a real, named company or team used AI: the problem they had, what they built, the measurable result from the source, and the lesson for the reader.' },
  { key: 'workflow', label: 'Copyable workflow', guide: 'A prompt, checklist or workflow the reader can copy and use today. Show it, then say when it works and when it does not. Ask readers to save it.' },
  { key: 'builder-buzz', label: 'What builders are trying', guide: 'Something practitioners are excited about right now (an open-source repo, a demo, a paper, a new pattern), explained plainly: what it is, why people care, whether it is ready for enterprise use.' },
  { key: 'contrarian', label: 'Contrarian take', guide: 'Challenge a popular claim or common practice, backed by the source. State the common belief, why it is wrong or incomplete, and what to do instead.' },
  { key: 'number', label: 'One number explained', guide: 'Lead with one striking number, benchmark or cost from the source. Explain what it means, what it does not mean, and the decision it should change.' },
  { key: 'myth-fact', label: 'Myth vs fact', guide: 'Three or four common myths about one topic, each followed by the fact, all traceable to the sources.' },
  { key: 'news-take', label: 'News, with a take', guide: 'One fresh release or announcement, but the post is about the consequence for the reader, not the announcement. At most one of these a day.' },
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
export interface Pillar { key: string; label: string; brief: string; formats: string[] }
export const PILLARS: Pillar[] = [
  { key: 'microsoft', label: 'Microsoft and Azure', formats: ['walkthrough', 'workflow', 'news-take', 'myth-fact', 'number', 'use-case'],
    brief: 'Microsoft enterprise AI, the core of the business: Azure AI Foundry, Azure OpenAI, Copilot Studio, Microsoft 365 Copilot, Agent Framework, Fabric, GitHub Copilot, Power Platform AI, and Microsoft AI certifications (AI-102, AI-900 and new ones). Look at the Azure and Microsoft 365 blogs, Microsoft Learn and Tech Community, GitHub changelogs, Ignite/Build sessions, MVP and practitioner posts, and real customer stories. Favour what a team can use or decide this week over announcements.' },
  { key: 'use-case', label: 'Real use case', formats: ['use-case', 'number'],
    brief: 'How real organisations use AI in production, from any industry and any company EXCEPT Microsoft: engineering blogs, customer case studies, conference talks, earnings-call remarks, and survey or benchmark numbers. Spread across regions (India, the Gulf, Europe, the US) and industries (banking, retail, health, manufacturing, telecom, public sector, software). One company per idea, and never two ideas about the same company.' },
  { key: 'hands-on', label: 'Hands-on', formats: ['walkthrough', 'workflow', 'builder-buzz'],
    brief: 'Tools, open-source projects, techniques and workflows practitioners are trying right now: Hacker News, GitHub trending, Reddit (r/LocalLLaMA, r/MachineLearning, r/ClaudeAI, r/OpenAI, r/sysadmin), developer posts on X and LinkedIn, YouTube demos, new arXiv techniques with code. Any vendor or open source, but not Microsoft. Each idea must be something a reader can try or copy.' },
  { key: 'debate', label: 'Debate', formats: ['contrarian', 'myth-fact', 'news-take', 'number'],
    brief: 'What AI practitioners are arguing about: benchmark disputes, cost versus value, build versus buy, open versus closed models, agent reliability, AI security incidents, regulation (EU AI Act, India), skills and jobs. Each idea must have two credible sides a practitioner could vote on in a poll. Any vendor or none, but not Microsoft.' },
]
export const pillarOf = (key?: string) => PILLARS.find(p => p.key === key)

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

/** Embedding cosine at or above this means "the same story told again" (text-embedding-3-small on title + angle). */
export const SEMANTIC_REPEAT = 0.82
/** Word overlap at or above this means a repeat, when embeddings are not available. */
export const WORD_REPEAT = 0.5

export type Embed = (texts: string[]) => Promise<number[][]>

const ideaText = (i: { title: string; angle?: string }) => `${i.title}. ${i.angle || ''}`.trim()

/**
 * Drops ideas that repeat something already posted, or repeat each other. With `embed` it compares meaning
 * (title + angle) so a reworded story is still caught; it always also applies the word-overlap check, and falls
 * back to it alone when embedding fails.
 */
export async function freshIdeas<T extends { title: string; angle?: string }>(ideas: T[], past: { title: string; angle?: string }[], embed?: Embed): Promise<T[]> {
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
export function ideaVendor(i: { vendor?: string; sources?: { url: string }[] }): string {
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
export function planSlots(ideas: TopicIdea[], slots: { kind: string }[], o: { lastFormat?: string; vendorWeek: Record<string, number>; vendorCap: number; pillars?: string[]; core?: string[] }): TopicIdea[] | null {
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
        if (strict && v && !core.includes(v) && (o.vendorWeek[v] || 0) >= o.vendorCap) return false
        if (slot.kind === 'poll') return true
        const f = i.format || ''
        if (level >= 1 && f && f === prev) return false
        if (level >= 2 && f && formatsToday.includes(f)) return false
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

export const firstLine = (text: string) => (text.split('\n').map(l => l.replace(/[*_#]/g, '').trim()).find(Boolean) || '').slice(0, 200)

/** The recent opening line that the new one echoes, or null. Catches same-shape hooks like "Your agent passes every demo…". */
export function echoedHook(text: string, recentHooks: string[]): string | null {
  const h = firstLine(text)
  if (!h) return null
  const lead = (s: string) => s.toLowerCase().split(/\s+/).slice(0, 4).join(' ')
  return recentHooks.find(r => r && (wordSimilarity(r, h) >= 0.45 || (lead(r).length > 10 && lead(r) === lead(h)))) ?? null
}

export const HOOK_RULES = `Opening line: before writing, draft five different hooks of different types (the reader's problem, one striking number, a contrarian claim, a specific question, the outcome the reader gets) and use the strongest. It must not open with "X launched / announced", and must not resemble these recent openings in wording or shape:`
