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
import { BLOG_FORMATS, HOOK_RULES, POST_FORMATS, RESEARCH_SOURCES, firstLine, formatOf } from './variety'
import { linksHtml } from './email-actions'

const FILE = 'autopilot/state.json'
const TEXT_MODEL = process.env.FOUNDRY_POST_MODEL || process.env.FOUNDRY_WEB_MODEL || 'gpt-5.4'
const FALLBACK_MODEL = process.env.FOUNDRY_FALLBACK_MODEL || 'gpt-5-mini'

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

// The shape of a post follows its format, not one template: some posts are a short punchy take, some a numbered
// walkthrough, some a list of seven tools, some a short story. Only the rules every post shares are fixed here.
const REACH_RULES = `Write for REACH on LinkedIn, for senior IT, engineering and AI leaders in India, the Gulf, Europe and the US.
- Let the format below decide the shape and length. Vary it: a tight 60-word take, a numbered walkthrough, a list of as many items as the material really supports, a short before/after story, a copyable prompt in its own block. Do not force every post into "hook + 3 bullets".
- Short lines and white space; no paragraph longer than two sentences. Plain words, no hype words, no filler.
- Never open with "X launched / announced / released Y", "Excited to share", or a company name as the first words.
- One idea per post. Be concrete and opinionated where the sources support it; give the reader something to do or try.
- End with one line that earns a reply or a save (a specific question, or "save this for..."), then 3-5 relevant hashtags.
- Mention every vendor fairly. Never invent facts, numbers, quotes or links; use only the supplied sources.
- Do not paste source links in the post body: the reference link goes in the first comment, which is posted automatically.`

const retry = <T,>(fn: () => Promise<T>, sleep: (ms: number) => Promise<void>, tries = 3) => withRetry(fn, { tries, baseMs: 3000, sleep, retryable: isTransient })

function parseJson<T>(text: string): T | null {
  try { return JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1)) as T } catch { return null }
}

/** Web-grounded topic research. Also used by the daily blog autopilot (`blog: true`, fewer ideas, more substance). */
export async function researchIdeas(ctx: Parameters<Deps['research']>[0] & { count?: number; blog?: boolean }, sleep: Deps['sleep']): Promise<TopicIdea[]> {
  const { cfg, weekend, recent, date } = ctx
  const formats = ctx.blog ? BLOG_FORMATS : POST_FORMATS
  const n = ctx.count ?? ((weekend ? cfg.weekendSlots : cfg.weekdaySlots).length + 5)
  const instructions = `You are the research editor for Gennoor Tech, an enterprise AI training company, whose audience is IT leaders, architects, developers and AI practitioners. Use web search to find what people in AI are genuinely talking about, trying and sharing RIGHT NOW (mostly the last 24-72 hours; a strong use case or tool from the last few weeks is fine).
${RESEARCH_SOURCES}
${ctx.blog ? 'These are for a long-form blog article of about 1,800 words, so choose topics with enough substance, a clear enterprise angle and several credible sources, not a single press release.\n' : ''}Pick ${n} ideas that people will save, share or comment on: useful, specific, surprising or hands-on. Each needs a real release, tool, repo, paper, case study, benchmark, number or debate behind it.
Rules:
- Variety is the priority. Spread the set across at least ${Math.min(n, 4)} different formats from the list below, and across different vendors and communities. Never two ideas about the same vendor or product.
- ${ctx.blog ? 'At most one idea may be plain vendor news.' : 'At most two ideas may use the "news-take" format; the rest come from what builders are trying, real use cases, workflows, numbers and debates.'}
- Prefer ideas the reader can act on (try it, copy it, decide with it) over announcements.
- ${weekend ? `It is the weekend. ${cfg.weekendTheme}` : 'It is a weekday.'}
- Stay inside these areas, broadly read: ${cfg.topics.join('; ')}.
- Never touch: ${cfg.avoid.join('; ')}.
${ctx.avoidVendors?.length ? `- These vendors have had enough coverage this week; avoid them unless the story is unmissable: ${ctx.avoidVendors.join(', ')}.\n` : ''}${ctx.recentFormats?.length ? `- Recently used formats (favour the others): ${ctx.recentFormats.join(', ')}.\n` : ''}- Do not repeat or re-angle these recent topics, even in different words: ${recent.slice(-60).join(' | ') || 'none'}.
- Only include sources you actually found.
- Do not put the format name in the title (no "Builder buzz:", "Myth vs fact:" prefixes).
Formats (use the key):
${formats.map(f => `- ${f.key}: ${f.guide}`).join('\n')}
Reply with JSON only: {"ideas":[{"title": string (<=110 chars), "format": string (one key above), "angle": string (the specific take, 1-2 sentences), "hook": string (a draft opening line), "vendor": string (the main company or product, or "none"), "heat": number 1-10 (how much people are talking about it and would share it), "why": string, "sources":[{"title": string, "url": string}]}]}`
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
  // Unknown format keys are dropped (the planner then treats the idea as format-less). Ranking and the vendor and
  // format spread are decided by the planner, which knows the day's slots and the week's history.
  for (const i of ideas) if (!formatOf(formats, i.format)) i.format = undefined
  return ideas.sort((a, b) => (b.heat || 0) - (a.heat || 0))
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

const sourcesText = (t: TopicIdea) => `${t.angle}\nSuggested hook (a starting point, not a must): ${t.hook || ''}\n${t.why ? `Why now: ${t.why}\n` : ''}Sources (use only these):\n${t.sources.map(s => `- ${s.title}: ${s.url}`).join('\n')}`
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

async function generate(ctx: Parameters<Deps['generate']>[0], sleep: Deps['sleep']): ReturnType<Deps['generate']> {
  const { slot, cfg, notes, recentHooks = [] } = ctx
  const topic = slot.topic!
  const hooks = recentHooks.length ? `\n${HOOK_RULES}\n- ${recentHooks.slice(-15).join('\n- ')}\n` : ''
  const brief = `${REACH_RULES}\n${slot.kind === 'poll' ? '' : formatBrief(topic)}${hooks}\n${slot.weekend ? `Weekend flavour: ${cfg.weekendTheme}\n` : ''}Never mention: ${cfg.avoid.join('; ')}.\n${notes.length ? `\nFix these problems from the last attempt:\n- ${notes.join('\n- ')}` : ''}`

  if (slot.kind === 'poll') {
    const draft = await createDraft(topic.title, `${brief}\nThe poll should ask a question practitioners will have an opinion on, based on: ${sourcesText(topic)}`, 'poll')
    await recordSpend(draft.id, 'Autopilot poll', 0)
    const p = draft.poll
    const ok = !!p && p.question.length >= 10 && p.options.length >= 2 && p.options.every(o => o.length >= 2) && draft.text.length >= 40
    const variant = ok ? await variantOf(draft.text, sleep) : undefined
    return { draftId: draft.id, text: toPlain(draft.text), verdict: ok ? 'pass' : 'revise', notes: ok ? [] : ['The poll needs a clear question and 2-4 distinct options with an intro.'], variant }
  }

  // GIF/motion posts are switched off: every slot produces a normal post.
  const mode = 'post'
  const { result, trace } = await runTeam(topic.title, brief, sourcesText(topic), mode)
  const draft = await createAgentDraft(topic.title, result, trace, [], topic.sources.map(x => x.url))
  for (const t of trace) if (t.usd) await recordSpend(draft.id, `Autopilot ${t.label}`, t.usd)
  // Autopilot posts are text-only: no image is generated for them.
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
    embed: embedTexts,
    // Posts published from Social Studio by hand (and blog shares) count as "already said" too.
    pastPosts: async () => (await listDrafts())
      .filter(d => d.published.length && Date.parse(d.published[0].at) > Date.now() - 30 * 86_400_000)
      .map(d => ({ at: d.published[0].at, title: d.topic, hook: firstLine(d.publishedText || d.text) })),
    links: linksHtml,
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
