import { randomBytes } from 'crypto'
import { knownEmoji } from '@/lib/blog-icon'
import { blogPostsMeta } from '@/data/blog-posts'
import { readBlob, writeBlob, foundry, recordSpend, textUsd, tokensOf } from '@/lib/social/studio'

// Blog studio: the agent drafts a post in the blog's exact file format, an editor reviews and edits it here,
// and publishing opens a GitHub pull request that adds the post to the codebase (merge = deploy).
const DRAFTS = 'blog/drafts.json'
const TEXT_MODEL = process.env.FOUNDRY_POST_MODEL || process.env.FOUNDRY_WEB_MODEL || 'gpt-5.4'

export interface BlogMeta {
  title: string; slug: string; excerpt: string; tldr: string
  keyTakeaways: string[]; faqs: { question: string; answer: string }[]; references: { title: string; url: string; source: string }[]
  category: string; tags: string[]; hashtags: string[]; readTime: string; coverColor: string; icon: string; date: string
}
export interface BlogDraft {
  id: string; topic: string; status: 'draft' | 'approved' | 'submitted'
  meta: BlogMeta; body: string
  review?: { verdict: string; notes: string[] }
  trace?: { agent: string; label: string; output: string; usd: number }[]
  pr?: { url: string; number: number; branch: string }
  /** Publishing flow after approval: pull request -> merged -> live on the website -> shared on LinkedIn. */
  pipeline?: BlogPipeline
  shared?: Partial<Record<'organization' | 'member', { urn: string; at: string }>>
  /** Made by the daily blog autopilot rather than by hand. */
  auto?: boolean
  /** The short LinkedIn posts written for this article (company page and profile), kept so a retry reuses them. */
  shareText?: { page: string; profile: string }
  /** Set when the editor chose a publish time: the heartbeat opens the pull request then. */
  scheduled?: { at: string; autoMerge: boolean; shareToLinkedIn: boolean; tries: number; failed?: boolean; error?: string }
  createdAt: string; updatedAt: string
}

export interface BlogPipeline {
  stage: 'pr' | 'merged' | 'live' | 'done' | 'attention'
  autoMerge: boolean
  shareToLinkedIn: boolean
  mergedAt?: string
  liveAt?: string
  note?: string
  mergeTries: number
  shareTries: Partial<Record<'organization' | 'member', number>>
  /** Set just before a merge or a LinkedIn post, so an interrupted run can never post twice. */
  busy?: { what: string; at: string }
}

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70)
export const wordCount = (html: string) => html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length
export const readTimeOf = (html: string) => `${Math.max(3, Math.round(wordCount(html) / 200))} min read`

export async function listBlogDrafts(): Promise<BlogDraft[]> {
  const raw = await readBlob(DRAFTS)
  const all: BlogDraft[] = raw ? JSON.parse(raw.toString('utf-8')) : []
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}
async function save(all: BlogDraft[]) { await writeBlob(DRAFTS, JSON.stringify(all), 'application/json') }
export async function getBlogDraft(id: string) { return (await listBlogDrafts()).find(d => d.id === id) || null }

export async function mutateBlogDraft(id: string, fn: (d: BlogDraft) => void): Promise<BlogDraft | null> {
  const all = await listBlogDrafts()
  const d = all.find(x => x.id === id)
  if (!d) return null
  fn(d)
  d.updatedAt = new Date().toISOString()
  await save(all)
  return d
}
export async function deleteBlogDraft(id: string) { await save((await listBlogDrafts()).filter(d => d.id !== id)) }

/** What the agent needs to match the site: today's date, existing categories/tags, and related posts for internal links. */
export function taxonomy() {
  const cats = new Map<string, number>(), tags = new Map<string, number>()
  for (const p of blogPostsMeta) {
    cats.set(p.category, (cats.get(p.category) || 0) + 1)
    for (const t of p.tags) tags.set(t, (tags.get(t) || 0) + 1)
  }
  const top = (m: Map<string, number>) => [...m.entries()].sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }))
  return { categories: top(cats), tags: top(tags), posts: blogPostsMeta.map(p => ({ slug: p.slug, title: p.title })) }
}

export function dateLabel(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}

/** Turns the agent's output into a clean draft: unique slug, sane lengths, read time from the real word count. */
export async function createBlogDraft(topic: string, agent: { body?: string; meta?: Partial<BlogMeta>; review?: BlogDraft['review'] }, trace: BlogDraft['trace']): Promise<BlogDraft> {
  const m = agent.meta || {}
  const body = (agent.body || '').trim()
  const taken = new Set([...blogPostsMeta.map(p => p.slug), ...(await listBlogDrafts()).map(d => d.meta.slug)])
  let slug = slugify(m.slug || m.title || topic) || 'new-post', n = 2
  while (taken.has(slug)) slug = `${slugify(m.slug || m.title || topic).slice(0, 64)}-${n++}`
  const now = new Date().toISOString()
  const draft: BlogDraft = {
    id: randomBytes(6).toString('hex'), topic, status: 'draft', body, review: agent.review, trace,
    meta: {
      title: String(m.title || topic).slice(0, 140), slug, excerpt: String(m.excerpt || ''), tldr: String(m.tldr || ''),
      keyTakeaways: (m.keyTakeaways || []).map(String), faqs: (m.faqs || []).map(f => ({ question: String(f.question), answer: String(f.answer) })),
      references: (m.references || []).filter(r => /^https?:\/\//.test(r.url)).map(r => ({ title: String(r.title), url: String(r.url), source: String(r.source || '') })),
      category: String(m.category || 'AI Strategy'), tags: [...new Set((m.tags || []).map(t => String(t).trim()).filter(Boolean))].slice(0, 8), hashtags: (m.hashtags || []).map(h => (String(h).startsWith('#') ? String(h) : `#${h}`)),
      readTime: readTimeOf(body), coverColor: /^#[0-9a-f]{6}$/i.test(m.coverColor || '') ? m.coverColor! : '#1D4ED8', icon: knownEmoji(m.icon), date: now.slice(0, 10),
    },
    createdAt: now, updatedAt: now,
  }
  await save([draft, ...(await listBlogDrafts())])
  return draft
}

/**
 * What every reviser is told. On 13 November 2026 six published articles were found to describe their own
 * revision ("What changed in this revision", "the earlier draft stated...", "the source set provided for this
 * article does not support..."): the reviser had been told to apply the reviewer's notes and wrote about doing so.
 */
const NO_SELF_TALK = `The reader must never be able to tell that the article was revised. Never mention a draft, a revision, a reviewer, an editor, notes, "the sources provided" or what was removed or softened, and never explain why something is not said. A claim that cannot be supported is simply left out, and the sentences around it are joined so that nothing looks missing. Never add a section about the changes.`

/** One revision call: edit the whole article or a single part according to the editor's instruction. */
export async function reviseBlogDraft(id: string, instruction: string, part: 'body' | 'meta' | 'all'): Promise<BlogDraft | null> {
  const d = await getBlogDraft(id)
  if (!d) return null
  const wantBody = part !== 'meta', wantMeta = part !== 'body'
  const json = await foundry('/openai/v1/responses', {
    model: TEXT_MODEL,
    instructions: `You are the editor of the Gennoor Tech blog (an AI training company in India). Apply the editor's instruction to the draft. Keep the house style: written for a manager who is not technical, every technical word explained where it first appears, short sentences, no hype, HTML body using <h2>, <p>, <ul>, <strong>, relative internal links; never invent facts, numbers, quotes or URLs.
${NO_SELF_TALK}
Return JSON only: {${wantBody ? '"body": string (the full revised HTML body),' : ''}${wantMeta ? ' "meta": {only the fields you changed: title, excerpt, tldr, keyTakeaways, faqs, references, category, tags, hashtags}' : ''}}`,
    input: `Instruction: ${instruction}\n\nCURRENT META:\n${JSON.stringify({ ...d.meta, date: undefined, slug: undefined })}\n\nCURRENT BODY:\n${d.body}`,
  })
  const out: string = json.output_text || (json.output || []).flatMap((o: any) => o.content || []).map((c: any) => c.text || '').join('')
  let p: { body?: string; meta?: Partial<BlogMeta> } = {}
  try { p = JSON.parse(out.slice(out.indexOf('{'), out.lastIndexOf('}') + 1)) } catch { throw new Error('The editor returned something unreadable. Try rephrasing the instruction.') }
  await recordSpend(`blog-${id}`, 'Blog revised', textUsd(json), tokensOf(json))
  return mutateBlogDraft(id, x => {
    if (wantBody && p.body?.trim()) { x.body = p.body.trim(); x.meta.readTime = readTimeOf(x.body) }
    if (wantMeta && p.meta) { const { slug: _s, date: _d, readTime: _r, ...rest } = p.meta; Object.assign(x.meta, rest) }
    if (x.status !== 'draft') x.status = 'draft'
  })
}

// ---- Code generation: the same files the team commits by hand today ----------------------------------------------
const q = (s: string) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r?\n/g, ' ')}'`
const list = (a: string[], pad: string) => `[\n${a.map(x => `${pad}  ${q(x)},`).join('\n')}\n${pad}]`

export function contentFile(d: BlogDraft): string {
  const m = d.meta
  const body = d.body.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')
  return `import type { BlogPost } from '../index'

export const post: BlogPost = {
    slug: ${q(m.slug)},
    title: ${q(m.title)},
    excerpt: ${q(m.excerpt)},
    tldr: ${q(m.tldr)},
    keyTakeaways: ${list(m.keyTakeaways, '    ')},
    faqs: [
${m.faqs.map(f => `      {\n        question: ${q(f.question)},\n        answer: ${q(f.answer)},\n      },`).join('\n')}
    ],
    references: [
${m.references.map(r => `      { title: ${q(r.title)}, url: ${q(r.url)}, source: ${q(r.source)} },`).join('\n')}
    ],
    content: \`
${body}
\`,
    author: 'Gennoor Tech',
    date: ${q(m.date)},
    readTime: ${q(m.readTime)},
    category: ${q(m.category)},
    tags: [${m.tags.map(q).join(', ')}],
    hashtags: [${m.hashtags.map(q).join(', ')}],
    coverColor: ${q(m.coverColor)},
    icon: ${q(m.icon)},
  }
`
}

/** The index.ts changes: a metadata entry at the top of the list and the lazy content loader. */
export function patchIndex(src: string, d: BlogDraft): string {
  const m = d.meta
  const entry = `  {
    slug: ${q(m.slug)},
    title: ${q(m.title)},
    excerpt: ${q(m.excerpt)},
    tldr: ${q(m.tldr)},
    author: 'Gennoor Tech',
    date: ${q(m.date)},
    readTime: ${q(m.readTime)},
    category: ${q(m.category)},
    tags: [${m.tags.map(q).join(', ')}],
    hashtags: [${m.hashtags.map(q).join(', ')}],
    coverColor: ${q(m.coverColor)},
    icon: ${q(m.icon)},
  },
`
  // Work in LF and convert back, so the patch is right for both Windows (CRLF) and Linux (LF) checkouts.
  const crlf = src.includes('\r\n')
  const lf = src.replace(/\r\n/g, '\n')
  const listHead = 'export const blogPostsMeta: BlogPostMeta[] = [\n'
  const loaderHead = 'const contentImports: Record<string, () => Promise<{ post: BlogPost }>> = {\n'
  if (!lf.includes(listHead) || !lf.includes(loaderHead)) throw new Error('index.ts has changed shape; the blog studio cannot patch it automatically. Use Export instead.')
  if (lf.includes(`slug: ${q(m.slug)}`)) throw new Error('A post with this slug already exists.')
  const out = lf
    .replace(listHead, listHead + entry)
    .replace(loaderHead, loaderHead + `  ${q(m.slug)}: () => import('./content/${m.slug}'),\n`)
  return crlf ? out.replace(/\n/g, '\r\n') : out
}
