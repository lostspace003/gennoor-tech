import { webGroundedCompletion } from '@/lib/crm/foundry'
import { toPlain } from '@/lib/linkedin-format'
import { sendEmail } from '@/lib/email-service'
import { getLinkedInState } from '@/lib/linkedin'
import { agentFetch } from '@/lib/social/agent-service'
import { publishNew } from '@/lib/social/publisher'
import { createAgentDraft, createDraft, foundry, generateImage, getDraft, mutateDraft, readBlob, recordSpend, textUsd, tokensOf, writeBlob, type TraceStep } from '@/lib/social/studio'
import { isTransient, withRetry, type Deps } from './engine'
import { emptyState, DEFAULT_CONFIG, type Slot, type State, type TargetKey, type TopicIdea } from './types'

const FILE = 'autopilot/state.json'
const TEXT_MODEL = process.env.FOUNDRY_POST_MODEL || process.env.FOUNDRY_WEB_MODEL || 'gpt-5.4'
const FALLBACK_MODEL = process.env.FOUNDRY_FALLBACK_MODEL || 'gpt-5-mini'

export async function loadState(): Promise<State> {
  const raw = await readBlob(FILE)
  if (!raw) return emptyState()
  const s = JSON.parse(raw.toString('utf-8')) as State
  // Older saved configs get any newly added settings filled in.
  return { ...emptyState(), ...s, config: { ...DEFAULT_CONFIG, ...s.config, targets: { ...DEFAULT_CONFIG.targets, ...s.config?.targets } } }
}
export async function saveState(s: State) { await writeBlob(FILE, JSON.stringify(s), 'application/json') }

const REACH_RULES = `Write for REACH on LinkedIn, for senior IT, engineering and AI leaders in India, the Gulf, Europe and the US:
- The first line is the hook and must stop the scroll: a specific claim, a surprising fact from the sources, a sharp contrast, or a question the reader has an opinion on. Never "Excited to share", never a vague opener.
- One idea per post. Say what changed, why it matters to someone running IT or building agents, and the one thing to do about it.
- Be concrete and opinionated where the sources support it. A clear point of view invites replies; fence-sitting does not.
- Short lines and short paragraphs. No jargon without a plain-English gloss. No hype words (revolutionary, game-changing).
- End with a specific question that invites comments from practitioners, then 3-4 relevant hashtags.
- Mention every vendor fairly. Never invent facts, numbers, quotes or links; use only the supplied sources.`

const retry = <T,>(fn: () => Promise<T>, sleep: (ms: number) => Promise<void>, tries = 3) => withRetry(fn, { tries, baseMs: 3000, sleep, retryable: isTransient })

function parseJson<T>(text: string): T | null {
  try { return JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1)) as T } catch { return null }
}

/** Web-grounded topic research. Also used by the daily blog autopilot (`blog: true`, fewer ideas, more substance). */
export async function researchIdeas(ctx: Parameters<Deps['research']>[0] & { count?: number; blog?: boolean }, sleep: Deps['sleep']): Promise<TopicIdea[]> {
  const { cfg, weekend, recent, date } = ctx
  const n = ctx.count ?? ((weekend ? cfg.weekendSlots : cfg.weekdaySlots).length + 3)
  const instructions = `You are the research editor for Gennoor Tech, an enterprise AI training company, whose LinkedIn audience is IT leaders, architects, developers and AI practitioners. Use web search to find what is genuinely being discussed RIGHT NOW (last 24-72 hours) across the whole industry, not one vendor.
${ctx.blog ? 'These are for a long-form blog article of about 1,800 words, so choose topics with enough substance, a clear enterprise angle and several credible sources, not a single press release.\n' : ''}Pick ${n} topic ideas that will earn reach: widely discussed, relevant to a broad IT audience, with a real news item, release, incident, benchmark or debate behind each.
Rules:
- Cover at least 3 different vendors or communities across the set (Microsoft, Google, AWS, OpenAI, Anthropic, Meta, open source, regulators). Never two ideas about the same vendor.
- Prefer topics with a clear opinion to take or a practical consequence for IT teams over pure press-release summaries.
- ${weekend ? `It is the weekend. ${cfg.weekendTheme}` : 'It is a weekday: lead with the biggest fresh news.'}
- Stay inside these areas: ${cfg.topics.join('; ')}.
- Never touch: ${cfg.avoid.join('; ')}.
- Do not repeat these recent topics: ${recent.slice(-40).join(' | ') || 'none'}.
- Only include sources you actually found.
Reply with JSON only: {"ideas":[{"title": string (<=110 chars), "angle": string (the specific take, 1-2 sentences), "hook": string (a draft opening line), "vendor": string, "heat": number 1-10 (how widely discussed and shareable right now), "why": string, "sources":[{"title": string, "url": string}]}]}`
  // Several ideas with sources need far more room than a short answer; a cut-off JSON reply would read as "no topics".
  const res = await retry(() => webGroundedCompletion(instructions, `Today is ${date}. Find the topics.`, 6000), sleep)
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
    ideas.push({ ...i, sources: kept.length ? kept : [...known.values()].slice(0, 2) })
  }
  // Hottest first, but never two of the same vendor in the top slots.
  ideas.sort((a, b) => (b.heat || 0) - (a.heat || 0))
  const seen = new Set<string>()
  const picked = ideas.filter(i => { const v = (i.vendor || i.title).toLowerCase(); if (seen.has(v)) return false; seen.add(v); return true })
  return picked.length >= n - 2 ? picked : ideas
}

/** Runs the Python agent team to completion and returns its final result (the web app does not need the live steps here). */
async function runTeam(topic: string, brief: string, refs: string, mode: 'post' | 'motion') {
  const res = await agentFetch('/run', { topic, brief, references: refs, mode })
  if (!res.ok || !res.body) throw new Error(`Agent service returned ${res.status}`)
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

const sourcesText = (t: TopicIdea) => `${t.angle}\nSuggested hook: ${t.hook || ''}\n${t.why ? `Why now: ${t.why}\n` : ''}Sources (use only these):\n${t.sources.map(s => `- ${s.title}: ${s.url}`).join('\n')}`

/** A different opening line for the personal profile, so the page and profile posts are not word-for-word identical. */
async function variantOf(text: string, sleep: Deps['sleep']): Promise<string | undefined> {
  try {
    const j = await retry(() => foundry('/openai/v1/responses', {
      model: TEXT_MODEL,
      instructions: 'Rewrite ONLY the first line (the hook) of this LinkedIn post so it opens differently but makes the same point, in the first person where natural. Keep every other line exactly as it is. Return the complete post text only.',
      input: text,
    }), sleep, 2)
    const out: string = j.output_text || (j.output || []).flatMap((o: any) => o.content || []).map((c: any) => c.text || '').join('')
    return out.trim().length > text.length * 0.6 ? out.trim() : undefined
  } catch { return undefined }
}

async function generate(ctx: Parameters<Deps['generate']>[0], sleep: Deps['sleep']): ReturnType<Deps['generate']> {
  const { slot, cfg, notes } = ctx
  const topic = slot.topic!
  const brief = `${REACH_RULES}\n\n${slot.weekend ? `Weekend flavour: ${cfg.weekendTheme}\n` : ''}Never mention: ${cfg.avoid.join('; ')}.\n${notes.length ? `\nFix these problems from the last attempt:\n- ${notes.join('\n- ')}` : ''}`

  if (slot.kind === 'poll') {
    const draft = await createDraft(topic.title, `${brief}\nThe poll should ask a question practitioners will have an opinion on, based on: ${sourcesText(topic)}`, 'poll')
    await recordSpend(draft.id, 'Autopilot poll', 0)
    const p = draft.poll
    const ok = !!p && p.question.length >= 10 && p.options.length >= 2 && p.options.every(o => o.length >= 2) && draft.text.length >= 40
    const variant = ok ? await variantOf(draft.text, sleep) : undefined
    return { draftId: draft.id, text: toPlain(draft.text), verdict: ok ? 'pass' : 'revise', notes: ok ? [] : ['The poll needs a clear question and 2-4 distinct options with an intro.'], variant }
  }

  const mode = slot.kind === 'motion' ? 'motion' : 'post'
  const { result, trace } = await runTeam(topic.title, brief, sourcesText(topic), mode)
  const draft = await createAgentDraft(topic.title, result, trace, [])
  for (const t of trace) if (t.usd) await recordSpend(draft.id, `Autopilot ${t.label}`, t.usd)
  if (mode === 'post' && draft.imagePrompt) {
    try { await retry(() => generateImage(draft.id), sleep, 3) } catch { /* a text-only post is better than none */ }
  }
  const text = (await getDraft(draft.id))?.text || draft.text
  const verdict = result.review?.verdict === 'pass' && text.trim().length > 200 ? 'pass' : 'revise'
  // The engine screens for banned words, so it gets plain letters, not the Unicode-bold ones.
  return { draftId: draft.id, text: toPlain(text), verdict, notes: result.review?.notes || [], variant: verdict === 'pass' ? await variantOf(text, sleep) : undefined }
}

export function liveDeps(): Deps {
  const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))
  return {
    now: () => new Date(),
    load: loadState,
    save: saveState,
    sleep,
    research: ctx => researchIdeas(ctx, sleep),
    generate: ctx => generate(ctx, sleep),
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
