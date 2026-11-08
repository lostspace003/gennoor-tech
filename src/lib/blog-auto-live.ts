import { blogPostsMeta } from '@/data/blog-posts'
import { researchIdeas, loadState as loadLinkedInAutopilot } from '@/lib/autopilot/live'
import { DEFAULT_CONFIG, type TopicIdea } from '@/lib/autopilot/types'
import { createBlogDraft, dateLabel, getBlogDraft, listBlogDrafts, mutateBlogDraft, reviseBlogDraft, taxonomy, type BlogDraft } from '@/lib/blog-studio'
import { emptyAutoState, DEFAULT_BLOG_AUTO, type AutoDeps, type AutoState } from '@/lib/blog-auto'
import { sendAdminAlert, submitBlogPost } from '@/lib/blog-publish'
import { agentFetch } from '@/lib/social/agent-service'
import { foundry, readBlob, recordSpend, textUsd, tokensOf, writeBlob } from '@/lib/social/studio'

const FILE = 'blog/automation.json'
const TEXT_MODEL = process.env.FOUNDRY_POST_MODEL || process.env.FOUNDRY_WEB_MODEL || 'gpt-5.4'

export async function loadAutoState(): Promise<AutoState> {
  const raw = await readBlob(FILE)
  if (!raw) return emptyAutoState()
  const s = JSON.parse(raw.toString('utf-8')) as AutoState
  return { ...emptyAutoState(), ...s, config: { ...DEFAULT_BLOG_AUTO, ...s.config } }
}
export async function saveAutoState(s: AutoState) { await writeBlob(FILE, JSON.stringify(s), 'application/json') }

const sourcesText = (t: TopicIdea) => `${t.angle}\n${t.why ? `Why now: ${t.why}\n` : ''}Sources (cite ONLY these URLs):\n${t.sources.map(s => `- ${s.title}: ${s.url}`).join('\n')}`

/** Runs the Python agent team to completion and saves the result as a normal blog draft. */
async function writeDraft(topic: TopicIdea): Promise<{ draftId: string; review: { verdict: string; notes: string[] } }> {
  const t = taxonomy()
  const today = new Date().toISOString().slice(0, 10)
  const res = await agentFetch('/blog', {
    topic: topic.title, brief: `Audience: enterprise IT and AI leaders. Take: ${topic.angle}
Opening: start with a hook about the reader's problem or a sharp tension (what goes wrong, what it costs, what they get wrong), never with "X launched / announced Y". The news is evidence inside the argument, not the headline. Keep paragraphs short, use bullet lists for steps and takeaways, and vary the rhythm so the piece does not read as a press summary.`, references: sourcesText(topic).slice(0, 30_000),
    context: { date: today, dateLabel: dateLabel(today), categories: t.categories.map(c => c.name), tags: t.tags.slice(0, 150).map(x => x.name), posts: t.posts.slice(0, 60) },
  })
  if (!res.ok || !res.body) throw new Error(`Agent service returned ${res.status}`)
  const reader = res.body.getReader(), dec = new TextDecoder()
  let buf = '', result: any = null
  const trace: BlogDraft['trace'] = []
  const spend: { label: string; usd: number; tokens?: number }[] = []
  const handle = (line: string) => {
    if (!line.trim()) return
    const ev = JSON.parse(line)
    if (ev.type === 'error') throw new Error(ev.message)
    if (ev.type === 'step' && ev.status === 'done') { trace!.push({ agent: ev.agent, label: ev.label, output: String(ev.output || '').slice(0, 12000), usd: ev.usd || 0 }); if (ev.usd) spend.push({ label: `${ev.label} agent`, usd: ev.usd, tokens: ev.tokens }) }
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
  if (!result?.body || !result?.meta) throw new Error('The blog team returned an incomplete article.')
  const draft = await createBlogDraft(topic.title, result, trace)
  await mutateBlogDraft(draft.id, x => { x.auto = true })
  for (const s of spend) await recordSpend(`blog-${draft.id}`, `Auto: ${s.label}`, s.usd, s.tokens)
  return { draftId: draft.id, review: { verdict: result.review?.verdict || 'revise', notes: result.review?.notes || [] } }
}

/** A fresh editorial review of the current draft (used after each revision). */
async function reviewDraft(id: string): Promise<{ verdict: string; notes: string[] }> {
  const d = await getBlogDraft(id)
  if (!d) throw new Error('Draft not found.')
  const j = await foundry('/openai/v1/responses', {
    model: TEXT_MODEL,
    instructions: `You are the editorial review agent for the Gennoor Tech blog (enterprise AI training company, India). Check the article and metadata: facts and numbers are plausible and not invented, no invented quotes or URLs, every external link looks like a real source, roughly 1,600-2,400 words, practitioner voice with no hype, a hook opening about the reader's problem (revise if it opens by announcing a launch), short paragraphs with bullets where useful, h2 sections, internal links present (relative /resources/blog/<slug> and /services/training are correct), a practical next step, excerpt and TL;DR consistent with the body, FAQs answerable from the body. Pass an article that is good enough to publish; ask for revision only for real problems. Reply as JSON only: {"verdict": "pass" | "revise", "notes": [string]} with specific, actionable notes.`,
    input: `METADATA:\n${JSON.stringify({ ...d.meta, date: undefined })}\n\nARTICLE BODY (HTML):\n${d.body}`,
  })
  await recordSpend(`blog-${id}`, 'Auto: re-review', textUsd(j), tokensOf(j))
  const out: string = j.output_text || (j.output || []).flatMap((o: any) => o.content || []).map((c: any) => c.text || '').join('')
  try {
    const p = JSON.parse(out.slice(out.indexOf('{'), out.lastIndexOf('}') + 1))
    return { verdict: p.verdict === 'pass' ? 'pass' : 'revise', notes: Array.isArray(p.notes) ? p.notes.map(String) : [] }
  } catch { return { verdict: 'revise', notes: ['The review could not be read; please check the article.'] } }
}

export function liveAutoDeps(): AutoDeps {
  const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))
  return {
    now: () => new Date(), sleep, load: loadAutoState, save: saveAutoState,
    research: async ({ date, recent }) => {
      const li = await loadLinkedInAutopilot()
      return researchIdeas({ date, weekend: false, cfg: { ...DEFAULT_CONFIG, ...li.config }, recent, count: 4, blog: true }, sleep)
    },
    published: async () => [...blogPostsMeta.map(p => p.title), ...(await listBlogDrafts()).map(d => d.meta.title)],
    avoidKeywords: async () => (await loadLinkedInAutopilot()).config.avoidKeywords,
    generate: topic => writeDraft(topic),
    review: id => reviewDraft(id),
    revise: async (id, notes) => { await reviseBlogDraft(id, `Apply the reviewer's notes and fix every real problem they raise: ${notes.join(' ')}`, 'all') },
    text: async id => { const d = await getBlogDraft(id); return d ? `${d.meta.title} ${d.meta.excerpt} ${d.meta.tldr} ${d.body}` : '' },
    submit: async (id, opts) => {
      await mutateBlogDraft(id, x => { x.status = 'approved' })
      await submitBlogPost(id, opts)
    },
    alert: sendAdminAlert,
  }
}
