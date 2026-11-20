import { blogPostsMeta } from '@/data/blog-posts'
import { briefWithIconRule } from '@/lib/blog-icon'
import { researchIdeas, lastLook, loadState as loadLinkedInAutopilot } from '@/lib/autopilot/live'
import { DEFAULT_CONFIG, type TopicIdea } from '@/lib/autopilot/types'
import { BLOG_FORMATS, formatOf } from '@/lib/autopilot/variety'
import { embedTexts } from '@/lib/crm/embeddings'
import { createBlogDraft, dateLabel, getBlogDraft, listBlogDrafts, mutateBlogDraft, reviseBlogDraft, taxonomy, type BlogDraft } from '@/lib/blog-studio'
import { emptyAutoState, DEFAULT_BLOG_AUTO, type AutoDeps, type AutoState } from '@/lib/blog-auto'
import { sendAdminAlert, submitBlogPost } from '@/lib/blog-publish'
import { agentFetch } from '@/lib/social/agent-service'
import { webGroundedCompletion } from '@/lib/crm/foundry'
import { isTransient, withRetry } from '@/lib/autopilot/engine'
import { READER_CHECK, aboutTheWords, articleRules } from '@/lib/writing-rules'
import { foundry, readBlob, recordSpend, textUsd, tokensOf, writeBlob } from '@/lib/social/studio'

const FILE = 'blog/automation.json'
/** An article with fewer characters than this is not an article yet (1,100 words is about 6,500). */
const MIN_ARTICLE = 2500
const TEXT_MODEL = process.env.FOUNDRY_POST_MODEL || process.env.FOUNDRY_WEB_MODEL || 'gpt-5.4'

export async function loadAutoState(): Promise<AutoState> {
  const raw = await readBlob(FILE)
  if (!raw) return emptyAutoState()
  const s = JSON.parse(raw.toString('utf-8')) as AutoState
  return { ...emptyAutoState(), ...s, config: { ...DEFAULT_BLOG_AUTO, ...s.config } }
}
export async function saveAutoState(s: AutoState) { await writeBlob(FILE, JSON.stringify(s), 'application/json') }

/** What the writers are given about the story. They have no web access: the facts come with the request. */
const sourcesText = (t: TopicIdea) => [
  `The story: ${t.angle}`,
  t.date ? `When it happened: ${t.date}` : '',
  t.why ? `Why it matters now: ${t.why}` : '',
  t.facts?.length ? `FACTS (use only these; each ends with where it comes from):\n${t.facts.map(f => `- ${f}`).join('\n')}` : '',
  t.terms?.length ? `WORDS TO EXPLAIN in plain words where they first appear:\n${t.terms.map(x => `- ${x.term}: ${x.plain}`).join('\n')}` : '',
  t.unknown?.length ? `NOT YET KNOWN (state each as a fact about the world, for example "Microsoft has not said when ..."; never mention sources, pages or material):\n${t.unknown.map(u => `- ${u}`).join('\n')}` : '',
  `Sources (cite ONLY these URLs):\n${t.sources.map(s => `- ${s.title}: ${s.url}`).join('\n')}`,
].filter(Boolean).join('\n')

/**
 * Reads up on the chosen story before anything is written. The topic search returns a title and a line or two;
 * an article written from that alone is padding, and a reviewer with no web access then strips out what it cannot
 * trace. That is how the article on Claude 5.2 (10 November 2026) became an article about not being able to check
 * the news, although the launch was real. So: one more search, for this story only, and the writers get the facts.
 */
async function dossier(topic: TopicIdea, sleep: (ms: number) => Promise<void>): Promise<TopicIdea> {
  if ((topic.facts?.length || 0) >= 12) return topic
  try {
    const res = await withRetry(() => webGroundedCompletion(
      `You are the researcher for an article that explains ONE story to a reader who is not technical. Use web search and read the primary sources (the company's own announcement and documentation first, then two or three good reports). Collect only what the pages really say.
Reply with JSON only: {"facts": [14 to 20 strings: who did what and when; what it is; the numbers, each with what was measured; what is new compared with before; who can use it and where; what it costs to change, if the pages say; the limits and conditions; what is not yet known. One plain sentence each, true to the page, ending with the page's name in brackets], "terms": [{"term": string, "plain": string (under 15 plain words)}] (the 4 to 8 technical words in this story a manager would not know), "unknown": [string] (what the pages do not say and a reader might ask), "sources": [{"title": string, "url": string}] (the pages you read, primary first)}`,
      `Today is ${new Date().toISOString().slice(0, 10)}.\nThe story: ${topic.title}\n${topic.angle}\nStart from: ${topic.sources.map(s => s.url).join(' , ') || '(search for it)'}`,
      6000,
    ), { tries: 2, baseMs: 4000, sleep, retryable: isTransient })
    const p = JSON.parse(res.text.slice(res.text.indexOf('{'), res.text.lastIndexOf('}') + 1)) as { facts?: string[]; terms?: { term: string; plain: string }[]; unknown?: string[]; sources?: { title: string; url: string }[] }
    const facts = (p.facts || []).map(f => String(f).replace(/\s+/g, ' ').trim()).filter(f => f.length > 12).slice(0, 22)
    if (facts.length < 6) return topic
    const cited = new Set(res.citations.map(c => c.url.split('?')[0].replace(/\/$/, '')))
    const read = (p.sources || []).filter(x => /^https?:\/\//.test(x.url) && (cited.size === 0 || cited.has(x.url.split('?')[0].replace(/\/$/, '')))).slice(0, 8)
    const sources = [...read, ...topic.sources.filter(x => !read.some(r => r.url === x.url))].slice(0, 10)
    return {
      ...topic,
      facts,
      unknown: (p.unknown || []).map(u => String(u).replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 4),
      terms: (p.terms || []).filter(t => t && t.term && t.plain).slice(0, 8),
      sources,
    }
  } catch (e) {
    console.error('[blog] the dossier search failed; writing from the topic notes', e)
    return topic
  }
}

/**
 * What is sent to the agent team for one article (POST /blog): the story after a second, deeper search, the
 * editor's notes, the writing rules and what the site already has. Kept apart from the sending so that
 * `npx tsx --env-file=.env.local scripts/blog-live-check.ts` can build the real thing and try it.
 */
export async function blogRequest(idea: TopicIdea) {
  const t = taxonomy()
  const today = new Date().toISOString().slice(0, 10)
  const topic = await dossier(idea, ms => new Promise<void>(r => setTimeout(r, ms)))
  return {
    topic: topic.title, brief: briefWithIconRule(`The reader is a manager who is not technical. What to explain: ${topic.angle}
${formatOf(BLOG_FORMATS, topic.format) ? `Article format: ${formatOf(BLOG_FORMATS, topic.format)!.label}. ${formatOf(BLOG_FORMATS, topic.format)!.guide} Let this format shape the sections.
` : ''}Opening: say what happened or what the problem is in the first paragraph, in plain words. Keep paragraphs short, and explain every technical word where it first appears (the reference material lists the ones to explain).`), references: sourcesText(topic).slice(0, 30_000),
    rules: articleRules(), review_rules: READER_CHECK,
    context: { date: today, dateLabel: dateLabel(today), categories: t.categories.map(c => c.name), tags: t.tags.slice(0, 150).map(x => x.name), posts: t.posts.slice(0, 60) },
  }
}

/**
 * A review as the engine reads it: only the notes about the WORDS count. A reviewer that complained of nothing but
 * the wrapping of the writer's reply (JSON, the names of its keys) had nothing to say about the article, and no
 * revision could ever satisfy it (20 November 2026, a post held for exactly that).
 */
function wordsOnly(verdict: unknown, notes: unknown): { verdict: string; notes: string[] } {
  const said = Array.isArray(notes) ? notes.map(String) : []
  const kept = aboutTheWords(said)
  return { verdict: verdict === 'pass' || (said.length > 0 && kept.length === 0) ? 'pass' : 'revise', notes: kept }
}

/** Runs the Python agent team to completion and saves the result as a normal blog draft. */
async function writeDraft(topic: TopicIdea): Promise<{ draftId: string; review: { verdict: string; notes: string[] } }> {
  const res = await agentFetch('/blog', await blogRequest(topic))
  if (!res.ok || !res.body) throw new Error(`Agent service returned ${res.status}${res.ok ? '' : `: ${(await res.text().catch(() => '')).replace(/\s+/g, ' ').slice(0, 160)}`}`)
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
  return { draftId: draft.id, review: wordsOnly(result.review?.verdict, result.review?.notes) }
}

/** A fresh editorial review of the current draft (used after each revision). */
async function reviewDraft(id: string): Promise<{ verdict: string; notes: string[] }> {
  const d = await getBlogDraft(id)
  if (!d) throw new Error('Draft not found.')
  const j = await foundry('/openai/v1/responses', {
    model: TEXT_MODEL,
    instructions: `You are the editorial review agent for the Gennoor Tech blog (an AI training company in India).

${READER_CHECK}

Then check the article and its metadata: facts and numbers are plausible and not invented, no invented quotes or URLs, every external link looks like a real source, 1,100-1,600 words (never ask for more words), h2 sections with plain headings, short paragraphs with lists where useful, internal links present (relative /resources/blog/<slug> and /services/training are correct), a practical next step, excerpt and TL;DR consistent with the body, FAQs answerable from the body. If there is news, the first paragraph says it. When a claim looks unsupported, the note to the writer is "leave this claim out": the article must never explain that something was removed or could not be checked. Pass an article that is good enough to publish; ask for a revision only for real problems. Reply as JSON only: {"verdict": "pass" | "revise", "notes": [string]} with notes that name the exact words to change.`,
    input: `METADATA:\n${JSON.stringify({ ...d.meta, date: undefined })}\n\nARTICLE BODY (HTML):\n${d.body}`,
  })
  await recordSpend(`blog-${id}`, 'Auto: re-review', textUsd(j), tokensOf(j))
  const out: string = j.output_text || (j.output || []).flatMap((o: any) => o.content || []).map((c: any) => c.text || '').join('')
  try {
    const p = JSON.parse(out.slice(out.indexOf('{'), out.lastIndexOf('}') + 1))
    return wordsOnly(p.verdict, p.notes)
  } catch { return { verdict: 'revise', notes: ['The review could not be read; please check the article.'] } }
}

export function liveAutoDeps(): AutoDeps {
  const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))
  return {
    now: () => new Date(), sleep, load: loadAutoState, save: saveAutoState,
    embed: embedTexts,
    research: async ({ date, recent, recentFormats }) => {
      const li = await loadLinkedInAutopilot()
      return researchIdeas({ date, weekend: false, cfg: { ...DEFAULT_CONFIG, ...li.config }, recent, recentFormats, count: 5, blog: true }, sleep)
    },
    published: async () => [...blogPostsMeta.map(p => p.title), ...(await listBlogDrafts()).map(d => d.meta.title)],
    avoidKeywords: async () => (await loadLinkedInAutopilot()).config.avoidKeywords,
    generate: topic => writeDraft(topic),
    review: id => reviewDraft(id),
    revise: async (id, notes) => { await reviseBlogDraft(id, `Fix these problems in the article: ${notes.join(' ')}`, 'all') },
    text: async id => { const d = await getBlogDraft(id); return d ? `${d.meta.title} ${d.meta.excerpt} ${d.meta.tldr} ${d.body}` : '' },
    submit: async (id, opts) => {
      await mutateBlogDraft(id, x => { x.status = 'approved' })
      await submitBlogPost(id, opts)
    },
    alert: sendAdminAlert,
    // The last look: its title, summary and words as a reader meets them (no tags)
    lastLook: async (id, notes) => {
      const d = await getBlogDraft(id)
      if (!d) return { ok: false, notes: ['The draft is no longer there.'] }
      const words = d.body.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
      return lastLook('blog article', `${d.meta.title}\n${d.meta.excerpt}\n${d.meta.tldr}\n\n${words}`, notes, MIN_ARTICLE)
    },
  }
}
