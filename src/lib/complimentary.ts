import { createHmac, randomBytes, timingSafeEqual } from 'crypto'
import { BlobServiceClient } from '@azure/storage-blob'
import { listLmsCourses } from '@/lib/lms'
import { createCoupon, newCode } from '@/lib/lms-coupons'
import { UNI_COURSES, isEmail, manyLinesText, oneLineText } from '@/lib/crm/universities-types'
import { escapeHtml } from '@/lib/escape-html'

// Complimentary access to the Learning Studio (owner, 27 November 2026): anyone asks for up to two courses on
// /complimentary-access; admin@ gets an email with Approve and Reject; Approve makes one code for each course chosen
// and emails them, saying which code is for which course. The university form uses the same course list and codes.

/** Up to this many courses in one request. */
export const MAX_COURSES = 2
const CODE_DAYS = 90
export const COMPLIMENTARY_NOTE = 'Complimentary access'

export interface CourseChoice { slug: string; title: string; code: string; level: string; lessons: number }

/** The courses a request may choose: every published course of the Learning Studio, so a new course appears by itself. */
export async function courseChoices(): Promise<CourseChoice[]> {
  const all = await listLmsCourses()
  return all.map((c) => ({
    slug: c.slug, title: c.title, code: c.code || '', level: c.level || '',
    lessons: c.sections.reduce((n, s) => n + s.items.length, 0),
  })).sort((a, b) => a.title.localeCompare(b.title))
}

/** The chosen courses, kept only when they are real published courses: at most two, no repeats. */
export function pickCourses(v: unknown, allowed: string[]): string[] {
  return [...new Set((Array.isArray(v) ? v : []).filter((x): x is string => typeof x === 'string' && allowed.includes(x)))].slice(0, MAX_COURSES)
}

/** One code for each course, 100% off that course only, for `people` people, 90 days. Returns course -> code. */
export async function codesFor(slugs: string[], people: number, note: string): Promise<Record<string, string>> {
  const out: Record<string, string> = {}
  const expiresAt = new Date(Date.now() + CODE_DAYS * 86_400_000).toISOString()
  for (const slug of slugs) {
    for (let tries = 0; tries < 5; tries++) {
      const code = newCode()
      if (await createCoupon({ code, percent: 100, slug, expiresAt, maxUses: Math.max(1, people), note: note.slice(0, 200), createdBy: 'complimentary access' })) { out[slug] = code; break }
    }
  }
  return out
}

// ---------------------------------------------------------------------------------------------------------------
// Requests

export interface AccessRequest {
  id: string
  at: string
  name: string
  title: string
  email: string
  org: string
  place: string
  courses: string[]
  notes: string
  status: 'pending' | 'approved' | 'rejected'
  decidedAt?: string
  codes?: Record<string, string>
}

/** What a stranger sent, rebuilt from what we allow (docs/SECURITY.md). `machine` is the hidden field filled in. */
export function cleanRequest(input: unknown, allowed: string[]): { ok: true; req: Pick<AccessRequest, 'name' | 'title' | 'email' | 'org' | 'place' | 'courses' | 'notes'>; machine: boolean } | { ok: false; error: string } {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { ok: false, error: 'The form is empty.' }
  const p = input as Record<string, unknown>
  const name = oneLineText(p.name, 120), title = oneLineText(p.title, 120), org = oneLineText(p.org, 160), place = oneLineText(p.place, 120)
  const email = String(p.email ?? '').trim().toLowerCase()
  if (!name || !isEmail(email)) return { ok: false, error: 'Please give your name and a valid email address.' }
  if (!org) return { ok: false, error: 'Please give your organisation or university.' }
  const courses = pickCourses(p.courses, allowed)
  if (!courses.length) return { ok: false, error: 'Please choose at least one course.' }
  return { ok: true, machine: oneLineText(p.website, 200) !== '', req: { name, title, email, org, place, courses, notes: manyLinesText(p.notes, 1500).trim() } }
}

const CONTAINER = 'crm-data'
const BLOB = 'complimentary/requests.json'
const blob = () => BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING || '').getContainerClient(CONTAINER).getBlockBlobClient(BLOB)

async function read(): Promise<{ rows: AccessRequest[]; etag?: string }> {
  try {
    const d = await blob().download()
    const chunks: Buffer[] = []
    for await (const c of d.readableStreamBody as AsyncIterable<Buffer>) chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c))
    return { rows: JSON.parse(Buffer.concat(chunks).toString('utf-8')), etag: d.etag }
  } catch (e: any) {
    if (e?.statusCode === 404) return { rows: [] }
    throw e
  }
}

export const listRequests = async () => (await read()).rows

export async function mutateRequests<T>(fn: (rows: AccessRequest[]) => T): Promise<T> {
  let last: unknown
  for (let i = 0; i < 4; i++) {
    const { rows, etag } = await read()
    const out = fn(rows)
    try {
      await BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING || '').getContainerClient(CONTAINER).createIfNotExists()
      const body = JSON.stringify(rows.slice(-2000))
      await blob().upload(body, Buffer.byteLength(body), { blobHTTPHeaders: { blobContentType: 'application/json' }, conditions: etag ? { ifMatch: etag } : { ifNoneMatch: '*' } })
      return out
    } catch (e: any) {
      if (e?.statusCode === 412 || e?.statusCode === 409) { last = e; continue }
      throw e
    }
  }
  throw last
}

export const newRequestId = () => `CA-${randomBytes(6).toString('hex')}`

// ---------------------------------------------------------------------------------------------------------------
// The Approve and Reject buttons: signed for one request, one action and seven days. Opening a link only shows a
// confirmation page; the action runs when its button is pressed, so a mail scanner that opens links decides nothing.

const TTL_MS = 7 * 86_400_000
const secretKey = () => process.env.AUTOPILOT_ACTION_SECRET || process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || null
const sign = (key: string, id: string, action: string, exp: number) => createHmac('sha256', key).update(`complimentary|${id}|${action}|${exp}`).digest('hex').slice(0, 40)
export type Decision = 'approve' | 'reject'

export function decisionUrl(id: string, action: Decision, now = Date.now()): string | null {
  const key = secretKey()
  if (!key) return null
  const exp = now + TTL_MS
  return `https://www.gennoor.com/complimentary-access/decide?${new URLSearchParams({ r: id, a: action, e: String(exp), t: sign(key, id, action, exp) })}`
}

export function verifyDecision(id: string, action: string, exp: string, token: string): { ok: true; action: Decision } | { ok: false; why: string } {
  const key = secretKey()
  if (!key) return { ok: false, why: 'Decisions by email are not configured.' }
  if (action !== 'approve' && action !== 'reject') return { ok: false, why: 'Unknown action.' }
  if (!/^CA-[a-f0-9]{12}$/.test(id)) return { ok: false, why: 'This link is not valid.' }
  const e = Number(exp)
  if (!Number.isFinite(e) || e < Date.now()) return { ok: false, why: 'This link has expired.' }
  const expected = sign(key, id, action, e)
  const given = String(token || '')
  if (given.length !== expected.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(given))) return { ok: false, why: 'This link is not valid.' }
  return { ok: true, action }
}

/** Each course chosen, its link, and the one code for it: so nobody has to guess which code is for which course. */
export function accessRows(codes: Record<string, string>, live: Array<{ slug: string; title: string }>): string {
  const cells = Object.entries(codes).map(([slug, code]) => {
    const title = live.find((c) => c.slug === slug)?.title || UNI_COURSES.find((c) => c.slug === slug)?.title || slug
    return `<tr><td style="padding:10px 0;border-bottom:1px solid #eef2f8"><a href="https://www.gennoor.com/studio/${encodeURIComponent(slug)}" style="color:#1b2540;font-size:15px;font-weight:700;text-decoration:none">${escapeHtml(title)} &rsaquo;</a></td>
      <td align="right" style="padding:10px 0 10px 12px;border-bottom:1px solid #eef2f8;white-space:nowrap"><span style="display:inline-block;background:#f1f4f9;border:1px dashed #b9c6dc;border-radius:8px;padding:6px 12px;font-family:Consolas,'Courier New',monospace;font-size:15px;font-weight:700;letter-spacing:1px;color:#1b2540">${code}</span></td></tr>`
  }).join('')
  return `<p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:#6b7790">Your courses and their codes</p><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 18px">${cells}</table>`
}