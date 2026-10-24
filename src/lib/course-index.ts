import crypto from 'crypto'
import { BlobServiceClient } from '@azure/storage-blob'
import { embedTexts } from '@/lib/crm/embeddings'
import { flattenItems, readBlobText, type LmsCourse } from '@/lib/lms'
import type { Course } from '@/config/courses'
import {
  chunkCues, chunkText, estimateTokens, formatClock, htmlToPlain, parseVtt,
  type Chunk,
} from '@/lib/course-chunker'

/**
 * Lesson-content index for the course Ask bots. What the lessons actually say (captions of the video
 * courses, chapter text of the interactive ones) is cut into chunks, embedded with the same model the
 * site chatbot uses, and kept in Qdrant (open source, hosted free tier is enough for ~200 courses).
 *
 * Env: QDRANT_URL, QDRANT_API_KEY, QDRANT_COLLECTION (default course_chunks). Without them everything
 * here is a no-op, so the chat keeps working exactly as before.
 */

const COLLECTION = () => process.env.QDRANT_COLLECTION || 'course_chunks'
const DIM = 1536 // text-embedding-3-small
const EMBED_BATCH = 32
const UPSERT_BATCH = 64

export interface ChunkPayload {
  courseSlug: string
  courseKind: 'lms' | 'interactive'
  moduleTitle: string
  lessonTitle: string
  lessonId: string
  startSeconds?: number
  text: string
}
export interface CourseHit extends ChunkPayload { score: number }
export interface IndexStats {
  slug: string
  kind: 'lms' | 'interactive'
  lessons: number
  lessonsWithText: number
  chunks: number
  tokens: number
  source: 'captions' | 'descriptions' | 'mixed' | 'chapters'
  skipped: string[]
  written: boolean
}

export function qdrantConfigured(): boolean {
  return !!(process.env.QDRANT_URL && process.env.QDRANT_API_KEY)
}

function base(): string {
  return (process.env.QDRANT_URL || '').replace(/\/+$/, '')
}

async function q(path: string, init: { method?: string; body?: unknown } = {}, timeoutMs = 15_000): Promise<any> {
  const res = await fetch(`${base()}${path}`, {
    method: init.method || (init.body ? 'POST' : 'GET'),
    headers: { 'api-key': process.env.QDRANT_API_KEY || '', 'Content-Type': 'application/json' },
    body: init.body ? JSON.stringify(init.body) : undefined,
    signal: AbortSignal.timeout(timeoutMs),
    cache: 'no-store',
  })
  if (!res.ok) {
    const err: any = new Error(`Qdrant ${res.status}: ${(await res.text()).slice(0, 200)}`)
    err.status = res.status
    throw err
  }
  return res.json()
}

let ensured = false
async function ensureCollection() {
  if (ensured) return
  try {
    await q(`/collections/${COLLECTION()}`)
  } catch (e: any) {
    if (e?.status !== 404) throw e
    await q(`/collections/${COLLECTION()}`, { method: 'PUT', body: { vectors: { size: DIM, distance: 'Cosine' } } })
  }
  for (const field of ['courseSlug', 'lessonId']) {
    try {
      await q(`/collections/${COLLECTION()}/index?wait=true`, { method: 'PUT', body: { field_name: field, field_schema: 'keyword' } })
    } catch { /* already there */ }
  }
  ensured = true
}

/** Deterministic point id (a UUID built from a hash) so re-running overwrites instead of duplicating. */
function pointId(slug: string, lessonId: string, n: number): string {
  const h = crypto.createHash('sha1').update(`${slug}|${lessonId}|${n}`).digest('hex')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-5${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`
}

export async function courseIndexedCount(slug: string): Promise<number> {
  await ensureCollection()
  const r = await q(`/collections/${COLLECTION()}/points/count`, { body: { exact: true, filter: { must: [{ key: 'courseSlug', match: { value: slug } }] } } })
  return r?.result?.count ?? 0
}

export async function deleteCourseIndex(slug: string) {
  await ensureCollection()
  await q(`/collections/${COLLECTION()}/points/delete?wait=true`, { body: { filter: { must: [{ key: 'courseSlug', match: { value: slug } }] } } })
}

interface Prepared { lessonId: string; payloads: ChunkPayload[] }

async function embedAll(texts: string[]): Promise<number[][]> {
  const out: number[][] = []
  for (let i = 0; i < texts.length; i += EMBED_BATCH) out.push(...(await embedTexts(texts.slice(i, i + EMBED_BATCH))))
  return out
}

async function write(slug: string, prepared: Prepared[]) {
  await ensureCollection()
  for (const lesson of prepared) {
    // replace this lesson's old points first, so edited lessons never leave stale chunks behind
    await q(`/collections/${COLLECTION()}/points/delete?wait=true`, {
      body: { filter: { must: [{ key: 'courseSlug', match: { value: slug } }, { key: 'lessonId', match: { value: lesson.lessonId } }] } },
    })
  }
  const flat = prepared.flatMap(p => p.payloads.map((payload, n) => ({ lessonId: p.lessonId, n, payload })))
  const vectors = await embedAll(flat.map(f => `${f.payload.lessonTitle}\n${f.payload.text}`))
  for (let i = 0; i < flat.length; i += UPSERT_BATCH) {
    const points = flat.slice(i, i + UPSERT_BATCH).map((f, k) => ({ id: pointId(slug, f.lessonId, f.n), vector: vectors[i + k], payload: f.payload }))
    await q(`/collections/${COLLECTION()}/points?wait=true`, { method: 'PUT', body: { points } })
  }
}

// ------------------------------------------------------------------ video courses

export async function indexLmsCourse(course: LmsCourse, opts: { dryRun?: boolean } = {}): Promise<IndexStats> {
  const prepared: Prepared[] = []
  const skipped: string[] = []
  let withCaptions = 0
  let withDescriptions = 0
  const items = flattenItems(course)
  const moduleOf = new Map<string, string>()
  for (const s of course.sections) for (const it of s.items) moduleOf.set(it.id, s.title)

  for (const item of items) {
    const moduleTitle = moduleOf.get(item.id) || ''
    let chunks: Chunk[] = []
    if (item.type === 'lecture' && item.caption) {
      try {
        const vtt = await readBlobText(course.container, item.caption)
        chunks = chunkCues(parseVtt(vtt))
        if (chunks.length) withCaptions++
      } catch {
        skipped.push(`${item.id} caption unreadable`)
      }
    }
    if (!chunks.length && item.description) {
      chunks = chunkText(item.description).map(text => ({ text }))
      if (chunks.length) withDescriptions++
    }
    if (!chunks.length) continue
    prepared.push({
      lessonId: item.id,
      payloads: chunks.map(c => ({
        courseSlug: course.slug, courseKind: 'lms', moduleTitle, lessonTitle: item.title, lessonId: item.id,
        ...(c.startSeconds !== undefined ? { startSeconds: c.startSeconds } : {}), text: c.text,
      })),
    })
  }
  const chunkCount = prepared.reduce((n, p) => n + p.payloads.length, 0)
  const tokens = prepared.reduce((n, p) => n + p.payloads.reduce((m, c) => m + estimateTokens(c.text), 0), 0)
  if (!opts.dryRun) await write(course.slug, prepared)
  return {
    slug: course.slug, kind: 'lms', lessons: items.length, lessonsWithText: prepared.length, chunks: chunkCount, tokens,
    source: withCaptions && withDescriptions ? 'mixed' : withCaptions ? 'captions' : 'descriptions', skipped, written: !opts.dryRun,
  }
}

// ------------------------------------------------------------------ interactive courses

async function readContentBlob(path: string): Promise<string> {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!conn) throw new Error('AZURE_STORAGE_CONNECTION_STRING not configured')
  const blob = BlobServiceClient.fromConnectionString(conn).getContainerClient('website-content').getBlobClient(path.replace(/^\/+/, ''))
  return (await blob.downloadToBuffer()).toString('utf8')
}

export async function indexInteractiveCourse(course: Course, opts: { dryRun?: boolean; readFile?: (path: string) => Promise<string> } = {}): Promise<IndexStats> {
  const read = opts.readFile || readContentBlob
  const slug = `ia-${course.id}`
  const prepared: Prepared[] = []
  const skipped: string[] = []
  for (const ch of course.chapters) {
    if (ch.isMockExam) continue
    let text = ''
    try { text = htmlToPlain(await read(ch.htmlFile)) } catch { skipped.push(`${ch.id} html unreadable`) }
    if (ch.transcriptFile) {
      try { text += '\n' + (await read(ch.transcriptFile)).replace(/<[^>]+>/g, ' ') } catch { /* transcript is optional */ }
    }
    const chunks = chunkText([ch.title, ch.description, text].filter(Boolean).join('. '))
    if (!chunks.length) continue
    prepared.push({
      lessonId: ch.id,
      payloads: chunks.map(t => ({ courseSlug: slug, courseKind: 'interactive' as const, moduleTitle: course.title, lessonTitle: ch.title, lessonId: ch.id, text: t })),
    })
  }
  const chunkCount = prepared.reduce((n, p) => n + p.payloads.length, 0)
  const tokens = prepared.reduce((n, p) => n + p.payloads.reduce((m, c) => m + estimateTokens(c.text), 0), 0)
  if (!opts.dryRun) await write(slug, prepared)
  return { slug, kind: 'interactive', lessons: course.chapters.length, lessonsWithText: prepared.length, chunks: chunkCount, tokens, source: 'chapters', skipped, written: !opts.dryRun }
}

// ------------------------------------------------------------------ retrieval

/** Top chunks of one course for a question. Returns [] (never throws) when Qdrant is unset or down. */
export async function searchCourse(query: string, opts: { courseSlug: string; limit?: number }): Promise<CourseHit[]> {
  if (!qdrantConfigured()) return []
  try {
    const [vector] = await embedTexts([query.slice(0, 1500)])
    const r = await q(
      `/collections/${COLLECTION()}/points/search`,
      { body: { vector, limit: opts.limit ?? 6, with_payload: true, filter: { must: [{ key: 'courseSlug', match: { value: opts.courseSlug } }] } } },
      6_000,
    )
    return (r?.result ?? []).filter((h: any) => h?.payload?.text).map((h: any) => ({ ...(h.payload as ChunkPayload), score: h.score }))
  } catch (e) {
    console.error('course-index search failed:', e instanceof Error ? e.message : e)
    return []
  }
}

/** Best chunks across every course, for the website search. Returns [] (never throws) when Qdrant is unset or down. */
export async function searchAllCourses(query: string, limit = 24): Promise<CourseHit[]> {
  if (!qdrantConfigured()) return []
  try {
    const [vector] = await embedTexts([query.slice(0, 300)])
    const r = await q(
      `/collections/${COLLECTION()}/points/search`,
      { body: { vector, limit, with_payload: true } },
      5_000,
    )
    return (r?.result ?? []).filter((h: any) => h?.payload?.text).map((h: any) => ({ ...(h.payload as ChunkPayload), score: h.score }))
  } catch (e) {
    console.error('course-index site search failed:', e instanceof Error ? e.message : e)
    return []
  }
}

/** The grounding block for the model, plus instructions on how to use and cite it. */
export function groundingBlock(hits: CourseHit[]): string {
  if (!hits.length) return ''
  const lines = hits.map((h, i) => {
    const at = h.startSeconds !== undefined ? ` @ ${formatClock(h.startSeconds)}` : ''
    return `[${i + 1}] ${h.lessonTitle}${at}\n${h.text}`
  })
  return (
    '\n\nCOURSE CONTENT (excerpts of what the lessons say; use these first):\n' + lines.join('\n\n') +
    '\n\nAnswer from these excerpts when they cover the question, and name the lesson (with the time when shown) where the learner can hear it, for example "(see the lesson X, 12:30)". ' +
    'If the excerpts do not cover the question, say in one sentence that the course does not cover it directly, then answer briefly. Never paste the excerpts word for word.'
  )
}

// ------------------------------------------------------------------ keep the index current

/**
 * Fire-and-forget: index a video course after it is published. Does nothing when Qdrant or the
 * embedding service is not configured, and never throws (publishing must not depend on it).
 */
export function indexLmsCourseInBackground(course: LmsCourse): void {
  if (!qdrantConfigured()) return
  void indexLmsCourse(course)
    .then(s => console.log(`course-index: ${s.slug} ${s.chunks} chunks (${s.source})`))
    .catch(e => console.error('course-index failed:', e instanceof Error ? e.message : e))
}
