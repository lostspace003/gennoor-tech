import { TableClient } from '@azure/data-tables'

/**
 * Course reviews and discussion. Reviews: one per learner per course, a 1 to 5 rating and
 * optional words. Discussion: threads and replies, per course or in the community space.
 * Names are shown as first name and last initial. Nothing is deleted by learners' actions
 * except their own posts; the team can hide anything from the admin.
 */
const REVIEWS = 'LmsReviews'
const POSTS = 'LmsPosts'

export const COMMUNITY_SCOPE = 'community'

function client(name: string): TableClient {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!conn) throw new Error('AZURE_STORAGE_CONNECTION_STRING not configured')
  return TableClient.fromConnectionString(conn, name)
}
const ready = new Set<string>()
async function table(name: string): Promise<TableClient> {
  const c = client(name)
  if (!ready.has(name)) {
    try { await c.createTable() } catch (e) { if ((e as { statusCode?: number })?.statusCode !== 409) throw e }
    ready.add(name)
  }
  return c
}
const esc = (s: string) => s.replace(/'/g, "''")
const newId = () => `${Date.now().toString().padStart(14, '0')}-${Math.random().toString(36).slice(2, 7)}`

/** "Asha Rao" -> "Asha R."; an email-only name -> its first part. */
export function displayName(name: string, email: string): string {
  const base = (name || '').trim() || email.split('@')[0].replace(/[._-]+/g, ' ')
  const parts = base.split(/\s+/).filter(Boolean)
  const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1)
  if (parts.length === 1) return cap(parts[0])
  return `${cap(parts[0])} ${parts[parts.length - 1].charAt(0).toUpperCase()}.`
}

// ---------- Reviews ----------

export interface Review {
  id: string // learner key, never shown
  name: string
  rating: number
  text: string
  createdAt: string
  updatedAt: string
  hidden: boolean
  mine?: boolean
}

export interface ReviewSummary { average: number; count: number; counts: Record<1 | 2 | 3 | 4 | 5, number> }

const reviewKey = (email: string) => email.toLowerCase().trim()

export async function saveReview(slug: string, email: string, name: string, rating: number, text: string): Promise<void> {
  const t = await table(REVIEWS)
  const now = new Date().toISOString()
  let createdAt = now
  try { createdAt = String((await t.getEntity(slug, reviewKey(email))).createdAt || now) } catch { /* first review */ }
  await t.upsertEntity({
    partitionKey: slug, rowKey: reviewKey(email), name: displayName(name, email), email: reviewKey(email),
    rating: Math.min(5, Math.max(1, Math.round(rating))), text: text.slice(0, 2000), createdAt, updatedAt: now,
    hidden: false,
  }, 'Merge')
}

async function allReviews(slug: string): Promise<Review[]> {
  const t = await table(REVIEWS)
  const out: Review[] = []
  for await (const e of t.listEntities({ queryOptions: { filter: `PartitionKey eq '${esc(slug)}'` } })) {
    out.push({
      id: String(e.rowKey), name: String(e.name || 'Learner'), rating: Number(e.rating) || 0, text: String(e.text || ''),
      createdAt: String(e.createdAt || ''), updatedAt: String(e.updatedAt || ''), hidden: e.hidden === true || e.hidden === 'true',
    })
  }
  return out
}

function summarize(list: Review[]): ReviewSummary {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as ReviewSummary['counts']
  let sum = 0
  for (const r of list) { if (r.rating >= 1 && r.rating <= 5) { counts[r.rating as 1] += 1; sum += r.rating } }
  const count = list.length
  return { average: count ? Math.round((sum / count) * 10) / 10 : 0, count, counts }
}

/** Public view: the summary and the reviews that have words, newest first. */
export async function getReviews(slug: string, viewerEmail?: string): Promise<{ summary: ReviewSummary; reviews: Review[]; mine: Review | null }> {
  const visible = (await allReviews(slug)).filter(r => !r.hidden)
  const me = viewerEmail ? reviewKey(viewerEmail) : ''
  const mine = me ? visible.find(r => r.id === me) ?? null : null
  const reviews = visible.filter(r => r.text.trim()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map(r => ({ ...r, id: '', mine: r.id === me }))
  return { summary: summarize(visible), reviews, mine: mine ? { ...mine, id: '' } : null }
}

export async function ratingSummaries(slugs: string[]): Promise<Record<string, { average: number; count: number }>> {
  const out: Record<string, { average: number; count: number }> = {}
  await Promise.all(slugs.map(async s => {
    try { const x = summarize((await allReviews(s)).filter(r => !r.hidden)); out[s] = { average: x.average, count: x.count } } catch { out[s] = { average: 0, count: 0 } }
  }))
  return out
}

export async function setReviewHidden(slug: string, key: string, hidden: boolean): Promise<void> {
  const t = await table(REVIEWS)
  await t.updateEntity({ partitionKey: slug, rowKey: key, hidden }, 'Merge')
}

export async function listAllReviewsForAdmin(): Promise<Array<Review & { slug: string; email: string }>> {
  const t = await table(REVIEWS)
  const out: Array<Review & { slug: string; email: string }> = []
  for await (const e of t.listEntities()) {
    out.push({
      id: String(e.rowKey), slug: String(e.partitionKey), email: String(e.email || e.rowKey), name: String(e.name || ''), rating: Number(e.rating) || 0,
      text: String(e.text || ''), createdAt: String(e.createdAt || ''), updatedAt: String(e.updatedAt || ''), hidden: e.hidden === true || e.hidden === 'true',
    })
  }
  return out.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

// ---------- Discussion ----------

export interface Post {
  id: string
  scope: string // course slug or "community"
  parentId: string // '' for a thread, thread id for a reply
  title: string // threads only
  body: string
  author: string // display name
  isTeam: boolean
  createdAt: string
  hidden: boolean
  mine?: boolean
  /** how many learners liked it, and whether the viewer did */
  likes: number
  liked?: boolean
}

interface PostRow extends Post { email: string; likers: string[] }

function toPost(e: Record<string, unknown>): PostRow {
  let likers: string[] = []
  try { likers = e.likes ? JSON.parse(String(e.likes)) : [] } catch { likers = [] }
  return {
    id: String(e.rowKey), scope: String(e.partitionKey), parentId: String(e.parentId || ''), title: String(e.title || ''),
    body: String(e.body || ''), author: String(e.author || 'Learner'), isTeam: e.isTeam === true || e.isTeam === 'true',
    createdAt: String(e.createdAt || ''), hidden: e.hidden === true || e.hidden === 'true', email: String(e.email || ''),
    likers, likes: likers.length,
  }
}

export async function addPost(p: { scope: string; parentId?: string; title?: string; body: string; email: string; name: string; isTeam?: boolean }): Promise<Post> {
  const t = await table(POSTS)
  const id = newId()
  const createdAt = new Date().toISOString()
  const author = p.isTeam ? 'Gennoor team' : displayName(p.name, p.email)
  await t.createEntity({
    partitionKey: p.scope, rowKey: id, parentId: p.parentId || '', title: (p.title || '').slice(0, 140),
    body: p.body.slice(0, 4000), author, email: p.email.toLowerCase(), isTeam: !!p.isTeam, createdAt, hidden: false,
  })
  return { id, scope: p.scope, parentId: p.parentId || '', title: p.title || '', body: p.body, author, isTeam: !!p.isTeam, createdAt, hidden: false, likes: 0 }
}

async function postsIn(scope: string): Promise<PostRow[]> {
  const t = await table(POSTS)
  const out: PostRow[] = []
  for await (const e of t.listEntities({ queryOptions: { filter: `PartitionKey eq '${esc(scope)}'` } })) out.push(toPost(e as Record<string, unknown>))
  return out.sort((a, b) => a.id.localeCompare(b.id))
}

const strip = (p: PostRow, me: string): Post => { const { email, likers, ...rest } = p; return { ...rest, mine: !!me && email === me, liked: !!me && likers.includes(me) } }

export interface ThreadRow extends Post { replies: number; lastAt: string }

export async function listThreads(scope: string, viewerEmail?: string): Promise<ThreadRow[]> {
  const me = (viewerEmail || '').toLowerCase()
  const all = (await postsIn(scope)).filter(p => !p.hidden)
  const replies = new Map<string, PostRow[]>()
  for (const p of all) if (p.parentId) replies.set(p.parentId, [...(replies.get(p.parentId) ?? []), p])
  return all.filter(p => !p.parentId).map(p => {
    const r = replies.get(p.id) ?? []
    return { ...strip(p, me), replies: r.length, lastAt: r.length ? r[r.length - 1].createdAt : p.createdAt }
  }).sort((a, b) => b.lastAt.localeCompare(a.lastAt))
}

export async function getThread(scope: string, id: string, viewerEmail?: string): Promise<{ thread: Post; replies: Post[] } | null> {
  const me = (viewerEmail || '').toLowerCase()
  const all = (await postsIn(scope)).filter(p => !p.hidden)
  const thread = all.find(p => p.id === id && !p.parentId)
  if (!thread) return null
  return { thread: strip(thread, me), replies: all.filter(p => p.parentId === id).map(p => strip(p, me)) }
}

export async function getPostRaw(scope: string, id: string): Promise<PostRow | null> {
  const t = await table(POSTS)
  try { return toPost((await t.getEntity(scope, id)) as Record<string, unknown>) } catch { return null }
}

/** Like or unlike a post. Returns the new count and whether the viewer now likes it. */
export async function toggleLike(scope: string, id: string, email: string): Promise<{ likes: number; liked: boolean } | null> {
  const t = await table(POSTS)
  let e: Record<string, unknown>
  try { e = (await t.getEntity(scope, id)) as Record<string, unknown> } catch { return null }
  let likers: string[] = []
  try { likers = e.likes ? JSON.parse(String(e.likes)) : [] } catch { likers = [] }
  const me = email.toLowerCase()
  const liked = !likers.includes(me)
  likers = liked ? [...likers, me] : likers.filter(x => x !== me)
  await t.updateEntity({ partitionKey: scope, rowKey: id, likes: JSON.stringify(likers) }, 'Merge')
  return { likes: likers.length, liked }
}

export async function setPostHidden(scope: string, id: string, hidden: boolean): Promise<void> {
  const t = await table(POSTS)
  await t.updateEntity({ partitionKey: scope, rowKey: id, hidden }, 'Merge')
}

export async function deletePost(scope: string, id: string): Promise<void> {
  const t = await table(POSTS)
  for (const p of await postsIn(scope)) if (p.id === id || p.parentId === id) await t.deleteEntity(scope, p.id)
}

export async function listAllPostsForAdmin(): Promise<PostRow[]> {
  const t = await table(POSTS)
  const out: PostRow[] = []
  for await (const e of t.listEntities()) out.push(toPost(e as Record<string, unknown>))
  return out.sort((a, b) => b.id.localeCompare(a.id))
}
