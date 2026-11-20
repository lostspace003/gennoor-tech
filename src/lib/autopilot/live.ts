import { webGroundedCompletion } from '@/lib/crm/foundry'
import { toPlain } from '@/lib/linkedin-format'
import { embedTexts } from '@/lib/crm/embeddings'
import { sendEmail } from '@/lib/email-service'
import { getLinkedInState } from '@/lib/linkedin'
import { agentFetch } from '@/lib/social/agent-service'
import { publishNew } from '@/lib/social/publisher'
import { createAgentDraft, createDraft, foundry, getDraft, listDrafts, mutateDraft, readBlob, recordSpend, textUsd, tokensOf, writeBlob, type TraceStep } from '@/lib/social/studio'
import { isTransient, withRetry, type Deps } from './engine'
import { emptyState, DEFAULT_CONFIG, type Slot, type State, type TargetKey, type TopicIdea } from './types'
import { BLOG_FORMATS, POST_FORMATS, RESEARCH_SOURCES, buildBrief, firstLine, formatOf, freshEnough, pillarOf } from './variety'
import { READER_CHECK, aboutTheWords, lastLookInput, lastLookRules, postRules, readLastLook } from '@/lib/writing-rules'
import { cut } from '@/lib/safe-text'
import { linksHtml } from './email-actions'

const FILE = 'autopilot/state.json'
const TEXT_MODEL = process.env.FOUNDRY_POST_MODEL || process.env.FOUNDRY_WEB_MODEL || 'gpt-5.4'
const FALLBACK_MODEL = process.env.FOUNDRY_FALLBACK_MODEL || 'gpt-5-mini'
/** The longest brief sent to the agent service. Its own limit is higher (services/studio-agents/app.py, RunBody.brief). */
const BRIEF_MAX = 6000

export async function loadState(): Promise<State> {
  const raw = await readBlob(FILE)
  if (!raw) return emptyState()
  const s = JSON.parse(raw.toString('utf-8')) as State
  // Older saved configs get any newly added settings filled in.
  const merged = { ...emptyState(), ...s, config: { ...DEFAULT_CONFIG, ...s.config, targets: { ...DEFAULT_CONFIG.targets, ...s.config?.targets } } }
  // Motion graphics are retired: saved motion slots become normal image posts.
  const noMotion = (list: { time: string; kind: string }[]) => list.map(x => (x.kind === 'motion' ? { ...x, kind: 'post' } : x))
  merged.config.weekdaySlots = noMotion(merged.config.weekdaySlots) as typeof merged.config.weekdaySlots
  merged.config.weekendSlots = noMotion(merged.config.weekendSlots) as typeof merged.config.weekendSlots
  for (const d of Object.values(merged.days)) for (const sl of d.slots) if ((sl.kind as string) === 'motion') sl.kind = 'post'
  return merged
}
export async function saveState(s: State) { await writeBlob(FILE, JSON.stringify(s), 'application/json') }

// The writing rules themselves travel with the request (src/lib/writing-rules.ts, sent as `rules`). These few lines
// are the editor's notes that go with every post: the shape follows the format, and the facts are in the references.
const POST_NOTES = `Editor's notes for this LinkedIn post:
- The reader is a manager who is not technical. Follow the writing rules you were given, to the letter.
- Let the format below decide the shape and the length. Posts must not all look alike.
- The reference material holds the facts (use only these), the words to explain and the day it happened.`

const retry = <T,>(fn: () => Promise<T>, sleep: (ms: number) => Promise<void>, tries = 3) => withRetry(fn, { tries, baseMs: 3000, sleep, retryable: isTransient })

function parseJson<T>(text: string): T | null {
  try { return JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1)) as T } catch { return null }
}

/** Web-grounded topic research. Also used by the daily blog autopilot (`blog: true`, fewer ideas, more substance). */
export async function researchIdeas(ctx: Parameters<Deps['research']>[0] & { count?: number; blog?: boolean; pillar?: string }, sleep: Deps['sleep']): Promise<TopicIdea[]> {
  const { cfg, weekend, recent, date } = ctx
  const pillar = pillarOf(ctx.pillar)
  const formats = ctx.blog ? BLOG_FORMATS : pillar ? POST_FORMATS.filter(f => pillar.formats.includes(f.key)) : POST_FORMATS
  const n = ctx.count ?? ((weekend ? cfg.weekendSlots : cfg.weekdaySlots).length + 5)
  const maxAge = pillar?.maxAgeDays ?? 21
  const instructions = `You are the research editor for Gennoor Tech, an AI training company. The readers are managers and business owners who are curious about AI and are NOT technical, and the technical people who work beside them. Use web search to find what people in AI are really talking about, trying and sharing RIGHT NOW. Today is ${date}.
${pillar ? `This search covers ONE stream of the day's plan: ${pillar.label}.\n${pillar.brief}` : RESEARCH_SOURCES}
${ctx.blog ? 'These are for a blog article of about 1,300 words that explains ONE story to a reader who is not technical. Prefer the biggest AI story of the last few days that a business should understand (a launch, a new rule, a study, a deal), with several credible sources. Not a niche developer topic, and not a single press release.\n' : ''}Pick ${n} ideas that people will save, share or comment on: useful, specific, surprising or something to try. Each needs something real behind it: a release, a tool, a case study, a study, a number or a debate.
Rules:
- Freshness. Every idea carries "date": the day it happened or was published, taken from the source. ${pillar?.news ? `Only stories from the last ${maxAge} days. Never an older story.` : `Prefer the last 7 days; nothing older than ${maxAge} days.`}
- Variety is the priority. Spread the set across ${pillar ? `at least ${Math.min(n, pillar.formats.length, 3)}` : `at least ${Math.min(n, 4)}`} different formats from the list below${pillar?.key === 'microsoft' ? ' and different Microsoft products' : ', and across different companies. Never two ideas about the same company or product'}.
- ${ctx.blog ? 'At most one idea may be a niche technical topic.' : pillar?.news ? 'Rank by how many people are talking about it today.' : 'At most one idea may use the "news-take" format.'}
- Plain titles. "title" and "hook" are written for the reader who is not technical: say who did what, or what the reader gets, in everyday words, with no jargon. Never a clever frame ("X makes Y a Z problem", "X is not a Y story", "X turned Y into a Z story", "the real story is", "X turns Y into Z"). Not "Anthropic's IPO roadshow turned AI demand into a Wall Street story" but "Anthropic has started selling its shares to the public". Not "GitHub's BYOK usage API update makes Copilot FinOps a Monday problem" but "GitHub now shows what each team's AI coding assistant costs".
- "facts": the 5 to 8 facts a writer needs to tell this story WITHOUT opening the links: who did what, when, the numbers with what they measure, what is new compared with before, and one limit or open question. One plain sentence each, true to the source, ending with the source's name in brackets.
- "terms": up to 4 technical words in this story that the reader would not know, each with a plain explanation of under 15 words.
- ${weekend ? `It is the weekend. ${cfg.weekendTheme}` : 'It is a weekday.'}
- Stay inside these areas, broadly read: ${cfg.topics.join('; ')}.
- Never touch: ${cfg.avoid.join('; ')}.
${ctx.avoidVendors?.length && !pillar?.news ? `- These companies have had enough coverage this week; avoid them unless the story is unmissable: ${ctx.avoidVendors.join(', ')}.\n` : ''}${ctx.recentFormats?.length ? `- Recently used formats (favour the others): ${ctx.recentFormats.join(', ')}.\n` : ''}- Do not repeat or re-angle these recent topics, even in different words: ${recent.slice(-60).join(' | ') || 'none'}.
- Only include sources you actually found.
- Do not put the format name in the title (no "Myth vs fact:" prefixes).
Formats (use the key):
${formats.map(f => `- ${f.key}: ${f.guide}`).join('\n')}
Reply with JSON only: {"ideas":[{"title": string (<=110 chars, plain words), "date": "YYYY-MM-DD", "format": string (one key above), "angle": string (what happened and why it matters to a business, 1-2 plain sentences), "hook": string (a draft opening line, plain words), "company": string (the organisation the story is about: for a use case the company that did it, e.g. "Wayfair", not the AI vendor it used; for a launch the vendor; "none" for a general debate), "vendor": string (the main AI vendor or product involved, or "none"), "heat": number 1-10 (how many people are talking about it and would share it), "why": string, "facts": [string], "terms": [{"term": string, "plain": string}], "sources":[{"title": string, "url": string}]}]}`
  // Several ideas with sources need far more room than a short answer; a cut-off JSON reply would read as "no topics".
  const res = await retry(() => webGroundedCompletion(instructions, `Today is ${date}. Find the topics.`, 9000), sleep)
  const parsed = parseJson<{ ideas?: TopicIdea[] }>(res.text)
  // Citation links carry tracking parameters (utm_source=...), so compare on host + path and keep the clean link.
  const clean = (u: string) => { try { const x = new URL(u); [...x.searchParams.keys()].filter(k => /^utm_|^ref$/i.test(k)).forEach(k => x.searchParams.delete(k)); x.hash = ''; return x.toString().replace(/\/$/, '') } catch { return u } }
  const norm = (u: string) => { try { const x = new URL(u); return `${x.hostname.replace(/^www\./, '')}${x.pathname}`.replace(/\/$/, '').toLowerCase() } catch { return u } }
  const known = new Map(res.citations.map(c => [norm(c.url), { title: c.title, url: clean(c.url) }]))
  // A listed link is only kept if the search really returned it, or (when the answer carried no citations) if it
  // actually loads. That keeps invented links out of drafts.
  const loads = async (u: string) => { try { const r = await fetch(u, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(7000), headers: { 'User-Agent': 'GennoorResearch/1.0' } }); return r.status < 400 } catch { return false } }
  const ideas: TopicIdea[] = []
  for (const i of parsed?.ideas || []) {
    const listed = (i.sources || []).filter(s => /^https?:\/\//.test(s.url)).slice(0, 4)
    let kept = listed.filter(s => known.has(norm(s.url))).map(s => ({ title: s.title, url: known.get(norm(s.url))!.url }))
    if (!kept.length) {
      const checks = await Promise.all(listed.map(async s => ((await loads(s.url)) ? { title: s.title, url: clean(s.url) } : null)))
      kept = checks.filter((x): x is { title: string; url: string } => !!x)
    }
    const facts = Array.isArray(i.facts) ? i.facts.map(f => String(f).replace(/\s+/g, ' ').trim()).filter(f => f.length > 12).slice(0, 10) : []
    const terms = Array.isArray(i.terms) ? i.terms.filter(t => t && t.term && t.plain).map(t => ({ term: String(t.term).slice(0, 60), plain: String(t.plain).slice(0, 160) })).slice(0, 5) : []
    ideas.push({ ...i, facts, terms, sources: kept.length ? kept : [...known.values()].slice(0, 2) })
  }
  // An idea that happened too long ago for its stream is not news: it is dropped here, whatever the model called it.
  const stale = ideas.filter(i => !freshEnough(i, pillar, date, maxAge))
  if (stale.length) console.log(`[research] ${pillar?.key || (ctx.blog ? 'blog' : 'all')}: dropped ${stale.length} stale idea(s): ${stale.map(i => `${i.date || 'no date'} ${i.title.slice(0, 50)}`).join(' | ')}`)
  const current = ideas.filter(i => !stale.includes(i))
  ideas.length = 0
  ideas.push(...current)
  // Unknown format keys are dropped (the planner then treats the idea as format-less). Ranking and the vendor and
  // format spread are decided by the planner, which knows the day's slots and the week's history.
  for (const i of ideas) if (!formatOf(formats, i.format)) i.format = undefined
  return ideas.sort((a, b) => (b.heat || 0) - (a.heat || 0))
}

/** Runs the Python agent team to completion and returns its final result (the web app does not need the live steps here). */
async function runTeam(body: TeamRequest) {
  const res = await agentFetch('/run', body)
  // The service's own words are kept, so the Autopilot page says why (a bare "returned 500" hid the cause for two days)
  if (!res.ok || !res.body) throw new Error(`Agent service returned ${res.status}${res.ok ? '' : `: ${(await res.text().catch(() => '')).replace(/\s+/g, ' ').slice(0, 160)}`}`)
  const reader = res.body.getReader(), dec = new TextDecoder()
  let buf = '', result: any = null
  const trace: TraceStep[] = []
  const handle = (line: string) => {
    if (!line.trim()) return
    const ev = JSON.parse(line)
    if (ev.type === 'error') throw new Error(ev.message)
    if (ev.type === 'step' && ev.status === 'done') trace.push({ agent: ev.agent, label: ev.label, output: String(ev.output || '').slice(0, 12000), usd: ev.usd || 0 })
    if (ev.type === 'result') result = ev
  }
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    buf += dec.decode(value, { stream: true })
    const lines = buf.split('\n'); buf = lines.pop() || ''
    lines.forEach(handle)
  }
  handle(buf)
  if (!result) throw new Error('The agent team returned no result.')
  return { result, trace }
}

/** What the writers are given about a story: they have no web access, so the facts come with the request. */
export const sourcesText = (t: TopicIdea) => [
  `The story: ${t.angle}`,
  t.date ? `When it happened: ${t.date}` : '',
  t.why ? `Why it matters now: ${t.why}` : '',
  t.facts?.length ? `FACTS (use only these and the sources; each ends with where it comes from):\n${t.facts.map(f => `- ${f}`).join('\n')}` : '',
  t.terms?.length ? `WORDS TO EXPLAIN in plain words where you use them:\n${t.terms.map(x => `- ${x.term}: ${x.plain}`).join('\n')}` : '',
  `Sources (the link goes in the first comment, never in the post):\n${t.sources.map(s => `- ${s.title}: ${s.url}`).join('\n')}`,
].filter(Boolean).join('\n')
const formatBrief = (t: TopicIdea) => { const f = formatOf(POST_FORMATS, t.format); return f ? `Format: ${f.label}. ${f.guide}\n` : '' }

/** A different opening line for the personal profile, so the page and profile posts are not word-for-word identical. */
async function variantOf(text: string, sleep: Deps['sleep']): Promise<string | undefined> {
  try {
    const j = await retry(() => foundry('/openai/v1/responses', {
      model: TEXT_MODEL,
      instructions: 'Rewrite ONLY the first line (the hook) of this LinkedIn post so it opens differently but makes the same point, without using first-person singular ("I", "my", "me"). Keep every other line exactly as it is. Return the complete post text only.',
      input: text,
    }), sleep, 2)
    const out: string = j.output_text || (j.output || []).flatMap((o: any) => o.content || []).map((c: any) => c.text || '').join('')
    return out.trim().length > text.length * 0.6 ? out.trim() : undefined
  } catch { return undefined }
}

/** One request to the agent team (services/studio-agents, POST /run). */
export interface TeamRequest { topic: string; brief: string; references: string; mode: 'post' | 'motion' | 'text'; rules: string; review_rules: string }

/**
 * What is sent to the writers for one slot: the editor's notes and the reference material. Kept apart from the
 * sending so that `npx tsx --env-file=.env.local scripts/autopilot-live-check.ts` can build the real thing and try it.
 * The brief is built to a fixed size: the service refuses a longer one, and on 12 and 13 November 2026 an over-long,
 * half-cut list of openings stopped every draft.
 */
export function draftRequest(ctx: Parameters<Deps['generate']>[0]): TeamRequest {
  const { slot, cfg, notes, recentHooks = [] } = ctx
  const topic = slot.topic!
  const brief = buildBrief({ rules: POST_NOTES, format: slot.kind === 'poll' ? '' : formatBrief(topic), weekend: slot.weekend ? cfg.weekendTheme : '', avoid: cfg.avoid, notes, openings: recentHooks }, BRIEF_MAX)
  // "text": the post alone (the writer, then the reviewer). The writing rules travel with every request.
  return { topic: topic.title, brief, references: sourcesText(topic), mode: 'text', rules: postRules(), review_rules: READER_CHECK }
}

/** The text a model call returned. */
const textOf = (j: any): string => j.output_text || (j.output || []).flatMap((o: any) => o.content || []).map((c: any) => c.text || '').join('')

/**
 * The website's own writer and reviewer: two direct model calls with the same rules the agent team is given.
 * Used only when the agent service does not answer.
 */
export async function writeDirect(topic: string, brief: string, refs: string): Promise<{ result: { text: string; review: { verdict: string; notes: string[] } }; trace: TraceStep[] }> {
  const input = `Topic: ${topic}\nEditor's notes: ${brief}\n\nReference material:\n${refs}`
  const w = await foundry('/openai/v1/responses', {
    model: TEXT_MODEL,
    instructions: `You write LinkedIn posts for Gennoor Tech, an AI training company in India. Using ONLY the facts supplied, write the post. Follow the format and the length the editor's notes ask for (otherwise 80-200 words, short lines).\n\n${postRules()}\n\nReply as JSON only: {"text": string}`,
    input,
  })
  const text = (parseJson<{ text?: string }>(textOf(w))?.text || textOf(w)).trim()
  const r = await foundry('/openai/v1/responses', {
    model: TEXT_MODEL,
    instructions: `You review LinkedIn posts for Gennoor Tech before they are published.\n\n${READER_CHECK}\n\nThen check the post against the rules the writer was given, below: one idea; the first line as the rules ask; every number and name is in the facts supplied; the format and length of the editor's notes; an opening unlike the recent ones in the notes; hashtags present; no first person singular; nothing of ours called free, no price, no customer's name, no promised result.\n\nRULES THE WRITER WAS GIVEN:\n${postRules()}\n\nReply as JSON only: {"verdict": "pass" | "revise", "notes": [string]}. Each note names the exact words to change.`,
    input: `${input}\n\nTHE POST TO REVIEW:\n${text}`,
  })
  const review = parseJson<{ verdict?: string; notes?: string[] }>(textOf(r))
  return {
    result: { text, review: { verdict: review?.verdict === 'pass' ? 'pass' : 'revise', notes: Array.isArray(review?.notes) ? review!.notes!.map(String) : ['The review could not be read.'] } },
    trace: [
      { agent: 'writer', label: 'Write (by the website: the agent service did not answer)', output: text.slice(0, 12000), usd: textUsd(w) },
      { agent: 'reviewer', label: 'Review (by the website)', output: textOf(r).slice(0, 4000), usd: textUsd(r) },
    ],
  }
}

/** A post shorter than this is not a post yet. */
const MIN_POST = 200

/**
 * The last look, for a post or an article the reviewer is still not satisfied with after every rewrite: one direct
 * question to a model, "would publishing this break a rule that matters?" (the rules: `lastLookRules`). A remark
 * about style is not a reason to hold (owner, 20 November 2026). An answer that cannot be read counts as "hold".
 */
export async function lastLook(kind: string, text: string, notes: string[], minLength: number): Promise<{ ok: boolean; notes: string[] }> {
  // What code can see needs no model: a text that is not there, or still wrapped as the writer sent it
  const plain = text.trim()
  if (plain.length <= minLength) return { ok: false, notes: [`The ${kind} is too short to publish (${plain.length} characters).`] }
  if (/^\s*(```|\{\s*"(text|body)"\s*:)/.test(plain)) return { ok: false, notes: [`The ${kind} is still wrapped in code, not plain words.`] }
  const j = await foundry('/openai/v1/responses', { model: TEXT_MODEL, instructions: lastLookRules(kind), input: lastLookInput(cut(plain, 60_000), notes.slice(0, 8)) })
  return readLastLook(textOf(j)) || { ok: false, notes: ['The last look could not be read, so this was not published by itself.'] }
}

async function generate(ctx: Parameters<Deps['generate']>[0], sleep: Deps['sleep']): ReturnType<Deps['generate']> {
  const { slot } = ctx
  const topic = slot.topic!
  const request = draftRequest(ctx)
  const { brief } = request

  if (slot.kind === 'poll') {
    const draft = await createDraft(topic.title, `${brief}\nThe poll should ask a question a manager who is not technical would have an opinion on, in plain words, based on:\n${sourcesText(topic)}`, 'poll')
    await recordSpend(draft.id, 'Autopilot poll', 0)
    const p = draft.poll
    const ok = !!p && p.question.length >= 10 && p.options.length >= 2 && p.options.every(o => o.length >= 2) && draft.text.length >= 40
    const variant = ok ? await variantOf(draft.text, sleep) : undefined
    return { draftId: draft.id, text: toPlain(draft.text), verdict: ok ? 'pass' : 'revise', notes: ok ? [] : ['The poll needs a clear question and 2-4 distinct options with an intro.'], variant }
  }

  // Autopilot posts have no picture, so the team runs its two-step text mode: the writer, then the reviewer.
  // "It should not fail" (owner, 13 November 2026): when the agent service does not answer, the website writes the
  // post itself with the same rules, so a slot is not held because one service is down.
  const refs = request.references
  const { result, trace } = await runTeam(request).catch(async (e) => {
    console.error(`[autopilot] the agent team did not answer (${String(e?.message || e).slice(0, 160)}); the website writes this post itself`)
    return writeDirect(topic.title, brief, refs)
  })
  const draft = await createAgentDraft(topic.title, result, trace, [], topic.sources.map(x => x.url))
  for (const t of trace) if (t.usd) await recordSpend(draft.id, `Autopilot ${t.label}`, t.usd)
  // Autopilot posts are text-only: no image is generated for them.
  const text = (await getDraft(draft.id))?.text || draft.text
  // Only what the reviewer said about the WORDS counts. On 20 November 2026 a reviewer judged the wrapping of the
  // writer's reply instead ("not in the required JSON shape: it uses "text" instead of the required key "verdict"").
  // No rewrite can fix that, so a good post failed three times and was held. A review whose every note was of that
  // kind had nothing to say about the post.
  const said = Array.isArray(result.review?.notes) ? result.review!.notes.map(String) : []
  const notes = aboutTheWords(said)
  const reviewerPassed = result.review?.verdict === 'pass' || (said.length > 0 && notes.length === 0)
  const verdict = reviewerPassed && text.trim().length > MIN_POST ? 'pass' : 'revise'
  // The engine screens for banned words, so it gets plain letters, not the Unicode-bold ones.
  return { draftId: draft.id, text: toPlain(text), verdict, notes, variant: verdict === 'pass' ? await variantOf(text, sleep) : undefined }
}

export function liveDeps(): Deps {
  const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))
  return {
    now: () => new Date(),
    load: loadState,
    save: saveState,
    sleep,
    // One web search per pillar of the day, in parallel, so no single source fills the day. A failed stream is
    // tolerated (the planner fills its slot from another pillar); all failing counts as a research failure.
    research: async ctx => {
      const streams = [...new Set(ctx.pillars || [])]
      if (!streams.length) return researchIdeas(ctx, sleep)
      const res = await Promise.allSettled(streams.map(p => researchIdeas({ ...ctx, pillar: p, count: 4 }, sleep).then(list => list.map(i => ({ ...i, pillar: p })))))
      const ok = res.flatMap(r => (r.status === 'fulfilled' ? r.value : []))
      if (!ok.length) throw (res.find(r => r.status === 'rejected') as PromiseRejectedResult | undefined)?.reason || new Error('Research found nothing')
      return ok
    },
    embed: embedTexts,
    // Posts published from Social Studio by hand (and blog shares) count as "already said" too.
    pastPosts: async () => (await listDrafts())
      .filter(d => d.published.length && Date.parse(d.published[0].at) > Date.now() - 30 * 86_400_000)
      .map(d => ({ at: d.published[0].at, title: d.topic, hook: firstLine(d.publishedText || d.text) })),
    links: linksHtml,
    generate: ctx => generate(ctx, sleep),
    lastLook: ({ text, notes }) => lastLook('LinkedIn post', text, notes, MIN_POST),
    draft: async id => {
      const d = await getDraft(id)
      return d ? { text: d.text, publishedAs: d.published.map(p => p.as) as TargetKey[] } : null
    },
    approve: async id => { await mutateDraft(id, x => { if (x.status === 'draft') x.status = 'approved' }) },
    publish: (id, target, opts) => publishNew(id, target, { commentary: opts.commentary }),
    tokens: async () => {
      const s = await getLinkedInState()
      const days = (iso?: string) => (iso ? Math.floor((Date.parse(iso) - Date.now()) / 86_400_000) : -1)
      return {
        member: { ok: !!s.accessToken && days(s.expiresAt) >= 0, days: days(s.expiresAt) },
        organization: { ok: !!s.orgAccessToken && days(s.orgExpiresAt) >= 0, days: days(s.orgExpiresAt) },
      }
    },
    alert: async (subject, html) => {
      const s = await loadState()
      try {
        await sendEmail({ from: process.env.EMAIL_FROM_INFO || 'info@gennoor.com', to: s.config.alertEmail, subject: `[Gennoor autopilot] ${subject}`, html: `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.5">${html}<p style="color:#666;font-size:12px">Manage this on the Autopilot page of the admin centre.</p></div>` })
      } catch (e) { console.error('autopilot alert email failed', e) }
    },
  }
}

export { textUsd, tokensOf, FALLBACK_MODEL }
