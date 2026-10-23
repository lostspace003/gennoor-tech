import { TableClient } from '@azure/data-tables'
import {
  BlobServiceClient,
  ContainerClient,
  BlobSASPermissions,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
} from '@azure/storage-blob'
import ai103 from '@/data/lms/ai-103.json'
import ai500 from '@/data/lms/ai-500.json'
import type { AboutBlock } from '@/lib/lms-about'
import ai103q from '@/data/lms/ai-103.quizzes.json'
import ai500q from '@/data/lms/ai-500.quizzes.json'

/**
 * Gennoor LMS - the certification video courses (AI-103, AI-500).
 *
 * Videos never pass through the web app: the app checks sign-in + enrollment,
 * then hands the browser a short-lived, read-only SAS link and Azure Storage
 * streams the bytes. That is what keeps the site fast with hundreds of
 * learners watching at once - the web server only ever answers tiny JSON calls.
 */

export interface LmsResource { name: string; blob: string }
export interface LmsLecture {
  id: string
  type: 'lecture'
  kind: string
  title: string
  description: string
  preview: boolean
  video: string
  caption: string | null
  /** from the caption file's last cue; within a few seconds of the video */
  durationSec?: number
  resources: LmsResource[]
}
export interface LmsQuiz {
  id: string
  type: 'quiz'
  title: string
  description: string
  questionCount: number
  passPercent: number
}
export type LmsItem = LmsLecture | LmsQuiz
export interface LmsSection { title: string; items: LmsItem[] }
export interface LmsCourse {
  slug: string
  code: string
  container: string
  title: string
  subtitle: string
  level: string
  description: string[]
  /** the description as structured blocks (headings, bullet lists), for the course page */
  about?: AboutBlock[]
  outcomes: string[]
  requirements: string[]
  audience: string[]
  instructor: string
  topics: string[]
  /** who the course is about, for the catalog filter: Microsoft, Google, AWS, Claude, ... */
  vendor: string
  /** what kind of course: certification | project | course */
  kind: 'certification' | 'project' | 'course'
  /** skills it teaches, from the shared taxonomy (filter: Topic) */
  topics_tags?: string[]
  /** lines of work it is applied to, from the shared taxonomy (filter: Domain) */
  domains?: string[]
  /** blob in the course container, shown on cards and as the video poster */
  thumbnail?: string
  /** true when the lectures are encrypted HLS (no plain MP4 is ever linked) */
  protected?: boolean
  /** number of files in the imported Learning Studio package (for copy progress) */
  packageFiles?: number
  /** promo video blob in the course container; autoplays on the course page */
  promo?: string
  /** certification badge image, shown on the course page */
  badge?: string
  /** congratulations video, played when every lesson is done */
  congrats?: string
  stats: { sections: number; lectures: number; quizzes: number }
  sections: LmsSection[]
}

const STATIC_COURSES = [ai103, ai500] as unknown as LmsCourse[]
const CATALOG_CONTAINER = 'lms-catalog'

export type LmsQuizBank = Record<string, { title: string; passPercent: number; questions: { question: string; answers: string[]; correct: number; explanation: string }[] }>

/** Courses imported from the admin console live as JSON in the catalog container. */
async function catalogBlobs(): Promise<{ client: ContainerClient }> {
  const { conn } = parseConnection()
  const client = BlobServiceClient.fromConnectionString(conn).getContainerClient(CATALOG_CONTAINER)
  await client.createIfNotExists()
  return { client }
}

let dynCache: { at: number; courses: (LmsCourse & { published?: boolean })[] } | null = null

async function loadDynamic(force = false): Promise<(LmsCourse & { published?: boolean })[]> {
  if (!force && dynCache && Date.now() - dynCache.at < 60_000) return dynCache.courses
  const courses: (LmsCourse & { published?: boolean })[] = []
  try {
    const { client } = await catalogBlobs()
    for await (const b of client.listBlobsFlat()) {
      if (!b.name.endsWith('.json') || b.name.endsWith('.quizzes.json')) continue
      const buf = await client.getBlobClient(b.name).downloadToBuffer()
      courses.push(JSON.parse(buf.toString('utf8')))
    }
  } catch {
    // storage not configured / unreachable: the bundled courses still work
  }
  dynCache = { at: Date.now(), courses }
  return courses
}

export function invalidateLmsCatalog() {
  dynCache = null
}

/** Every course incl. unpublished drafts (admin use). */
export async function listAllLmsCourses(): Promise<(LmsCourse & { published?: boolean })[]> {
  const dyn = await loadDynamic()
  const slugs = new Set(dyn.map(c => c.slug))
  return [...STATIC_COURSES.filter(c => !slugs.has(c.slug)), ...dyn]
}

export async function listLmsCourses(): Promise<LmsCourse[]> {
  return (await listAllLmsCourses()).filter(c => c.published !== false)
}

export async function getLmsCourse(slug: string): Promise<LmsCourse | undefined> {
  return (await listLmsCourses()).find(c => c.slug === slug)
}

export async function getLmsQuizzes(slug: string): Promise<LmsQuizBank> {
  const dyn = (await loadDynamic()).find(c => c.slug === slug)
  if (dyn) {
    const { client } = await catalogBlobs()
    const buf = await client.getBlobClient(`${slug}.quizzes.json`).downloadToBuffer().catch(() => null)
    return buf ? JSON.parse(buf.toString('utf8')) : {}
  }
  return (slug === 'ai-103' ? ai103q : slug === 'ai-500' ? ai500q : {}) as unknown as LmsQuizBank
}

export async function saveCatalogCourse(course: LmsCourse & { published?: boolean }, quizzes?: LmsQuizBank) {
  const { client } = await catalogBlobs()
  const put = (name: string, body: string) =>
    client.getBlockBlobClient(name).upload(body, Buffer.byteLength(body), { blobHTTPHeaders: { blobContentType: 'application/json' } })
  await put(`${course.slug}.json`, JSON.stringify(course))
  if (quizzes) await put(`${course.slug}.quizzes.json`, JSON.stringify(quizzes))
  invalidateLmsCatalog()
}

export function findLmsItem(course: LmsCourse, itemId: string): LmsItem | undefined {
  for (const s of course.sections) {
    const hit = s.items.find(i => i.id === itemId)
    if (hit) return hit
  }
  return undefined
}

export function flattenItems(course: LmsCourse): LmsItem[] {
  return course.sections.flatMap(s => s.items)
}

/**
 * Lab starter files are the only archives we let learners take away: the labs
 * cannot be done without them. Every other zip (full course bundle, slide
 * packs) and all videos stay view-only on the site.
 */
export function isLabFilesZip(name: string): boolean {
  return /(lab files|student files)\.zip$/i.test(name)
}

// ---------------------------------------------------------------- storage

export function getStorage() {
  return parseConnection()
}

function parseConnection() {
  const conn = process.env.LMS_STORAGE_CONNECTION_STRING || process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!conn) throw new Error('LMS_STORAGE_CONNECTION_STRING not configured')
  const field = (k: string) => conn.match(new RegExp(`${k}=([^;]+)`))?.[1]
  const account = field('AccountName')
  const key = field('AccountKey')
  if (!account || !key) throw new Error('LMS_STORAGE_CONNECTION_STRING must carry AccountName and AccountKey')
  return { conn, account, key, suffix: field('EndpointSuffix') || 'core.windows.net' }
}

let credCache: { cred: StorageSharedKeyCredential; account: string; suffix: string } | null = null
function credential() {
  if (!credCache) {
    const { account, key, suffix } = parseConnection()
    credCache = { cred: new StorageSharedKeyCredential(account, key), account, suffix }
  }
  return credCache
}

/**
 * A read-only, expiring link to one blob. `inline` makes the browser render
 * the file (PDF viewer) instead of offering a save dialog.
 */
export function signBlobUrl(container: string, blob: string, minutes = 120, opts: { inline?: boolean; contentType?: string; filename?: string } = {}): string {
  const { cred, account, suffix } = credential()
  const now = Date.now()
  const sas = generateBlobSASQueryParameters(
    {
      containerName: container,
      blobName: blob,
      permissions: BlobSASPermissions.parse('r'),
      startsOn: new Date(now - 5 * 60_000),
      expiresOn: new Date(now + minutes * 60_000),
      cacheControl: 'private, no-store',
      contentDisposition: opts.inline === false ? (opts.filename ? `attachment; filename="${opts.filename.replace(/["\\\r\n]/g, '')}"` : undefined) : 'inline',
      contentType: opts.contentType,
    },
    cred,
  ).toString()
  return `https://${account}.blob.${suffix}/${container}/${blob.split('/').map(encodeURIComponent).join('/')}?${sas}`
}

/** Read a small blob (captions) server-side. */
export async function readBlobText(container: string, blob: string): Promise<string> {
  const res = await fetch(signBlobUrl(container, blob, 5), { cache: 'no-store' })
  if (!res.ok) throw new Error(`blob ${res.status}`)
  return res.text()
}

// ----------------------------------------------------------------- tables

function table(name: string): TableClient {
  const { conn } = parseConnection()
  return TableClient.fromConnectionString(conn, name)
}

const ensured = new Set<string>()
async function ensure(name: string) {
  if (ensured.has(name)) return
  try {
    await table(name).createTable()
  } catch (err: any) {
    if (err?.statusCode !== 409) throw err
  }
  ensured.add(name)
}

const pk = (email: string) => email.toLowerCase().trim()

export async function getEnrollments(email: string): Promise<Record<string, string>> {
  await ensure('LmsEnrollments')
  const out: Record<string, string> = {}
  for await (const e of table('LmsEnrollments').listEntities({ queryOptions: { filter: `PartitionKey eq '${pk(email).replace(/'/g, "''")}'` } })) {
    out[e.rowKey as string] = (e.enrolledAt as string) || ''
  }
  return out
}

export async function isEnrolled(email: string, slug: string): Promise<boolean> {
  await ensure('LmsEnrollments')
  try {
    await table('LmsEnrollments').getEntity(pk(email), slug)
    return true
  } catch (err: any) {
    if (err?.statusCode === 404) return false
    throw err
  }
}

export async function enroll(email: string, name: string, slug: string) {
  await ensure('LmsEnrollments')
  await table('LmsEnrollments').upsertEntity(
    { partitionKey: pk(email), rowKey: slug, name, enrolledAt: new Date().toISOString() },
    'Merge',
  )
}

export interface LmsProgressEntry { done: boolean; positionSec: number; updatedAt: string; passed?: boolean; score?: number }

export async function getLmsProgress(email: string, slug: string): Promise<Record<string, LmsProgressEntry>> {
  await ensure('LmsProgress')
  const out: Record<string, LmsProgressEntry> = {}
  const filter = `PartitionKey eq '${pk(email).replace(/'/g, "''")}' and RowKey ge '${slug}:' and RowKey lt '${slug};'`
  for await (const e of table('LmsProgress').listEntities({ queryOptions: { filter } })) {
    out[(e.rowKey as string).slice(slug.length + 1)] = {
      done: !!e.done,
      positionSec: Number(e.positionSec || 0),
      updatedAt: (e.updatedAt as string) || '',
      passed: e.passed === undefined ? undefined : !!e.passed,
      score: e.score === undefined ? undefined : Number(e.score),
    }
  }
  return out
}

export async function saveLmsProgress(email: string, slug: string, itemId: string, patch: Partial<LmsProgressEntry>) {
  await ensure('LmsProgress')
  await table('LmsProgress').upsertEntity(
    { partitionKey: pk(email), rowKey: `${slug}:${itemId}`, ...patch, updatedAt: new Date().toISOString() },
    'Merge',
  )
}


// ------------------------------------------------------------ public media

export interface LmsCourseCard {
  slug: string
  code: string
  title: string
  subtitle: string
  level: string
  vendor: string
  kind: LmsCourse['kind']
  topics: string[]
  domains: string[]
  lectures: number
  hours: number
  thumbnailUrl: string | null
  /** signed link to the promo, for the preview pop-up */
  promoUrl: string | null
  /** average review rating and how many people rated, when any */
  rating?: { average: number; count: number }
}

/** Catalog-card view of a course, with a signed link for its thumbnail. */
export function toCard(c: LmsCourse): LmsCourseCard {
  let seconds = 0
  for (const s of c.sections) for (const i of s.items) if (i.type === 'lecture') seconds += i.durationSec || 0
  let thumbnailUrl: string | null = null
  try {
    if (c.thumbnail) thumbnailUrl = signBlobUrl(c.container, c.thumbnail, 180, { contentType: /\.jpe?g$/i.test(c.thumbnail) ? 'image/jpeg' : 'image/png' })
  } catch {
    // storage not configured
  }
  return {
    slug: c.slug,
    code: c.code,
    title: c.title,
    subtitle: c.subtitle,
    level: c.level,
    vendor: c.vendor || 'Other',
    kind: c.kind || 'course',
    topics: c.topics_tags || [],
    domains: c.domains || [],
    lectures: c.stats.lectures,
    hours: Math.round((seconds / 3600) * 10) / 10,
    thumbnailUrl,
    promoUrl: promoUrl(c),
  }
}

export function promoUrl(c: LmsCourse): string | null {
  if (!c.promo) return null
  try {
    return signBlobUrl(c.container, c.promo, 120, { contentType: 'video/mp4' })
  } catch {
    return null
  }
}

/** Signed link for any public image of a course (badge, completion card). */
export function videoUrl(c: LmsCourse, blob?: string): string | null {
  if (!blob) return null
  try {
    return signBlobUrl(c.container, blob, 180, { contentType: 'video/mp4' })
  } catch {
    return null
  }
}

export function imageUrl(c: LmsCourse, blob?: string): string | null {
  if (!blob) return null
  try {
    return signBlobUrl(c.container, blob, 180, { contentType: /\.jpe?g$/i.test(blob) ? 'image/jpeg' : 'image/png' })
  } catch {
    return null
  }
}
