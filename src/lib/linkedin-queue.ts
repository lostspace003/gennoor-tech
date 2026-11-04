import { BlobServiceClient } from '@azure/storage-blob'
import { randomBytes } from 'crypto'
import { createExternalEvent, deleteLinkedInPost, getLinkedInState, publishDocument, publishPost } from '@/lib/linkedin'
import { getEvent, mutateEvents, eventUrl, type SiteEvent } from '@/lib/events'
import { renderCarouselPdf, type CarouselPlan } from '@/lib/social/carousel'
import { foundry, TEXT_MODEL } from '@/lib/social/studio'
import { formatForLinkedIn } from '@/lib/linkedin-format'
import { sendAdminAlert } from '@/lib/blog-publish'

// Scheduled and already-posted LinkedIn items that are not blog/social drafts: carousels, event announcements and
// LinkedIn Events. One small JSON blob. The heartbeat runs due jobs; finished ones stay listed so they can be deleted.
const CONTAINER = 'crm-data'
const BLOB = 'linkedin-jobs.json'
const GRACE_MS = 6 * 3_600_000
const BUSY_MS = 10 * 60_000
const MAX_TRIES = 3

export type Target = 'organization' | 'member'
export type JobKind = 'carousel' | 'event-announce' | 'event-linkedin'
export interface Job {
  id: string
  kind: JobKind
  at: string
  as: Target
  title: string
  payload: { plan?: CarouselPlan; eventId?: string }
  state: 'pending' | 'publishing' | 'done' | 'failed' | 'deleted'
  tries: number
  error?: string
  urn?: string
  doneAt?: string
  busyAt?: string
}

const client = () => {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!conn) throw new Error('AZURE_STORAGE_CONNECTION_STRING not configured')
  return BlobServiceClient.fromConnectionString(conn).getContainerClient(CONTAINER)
}

async function read(): Promise<{ jobs: Job[]; etag?: string }> {
  try {
    const d = await client().getBlockBlobClient(BLOB).download()
    const chunks: Buffer[] = []
    for await (const c of d.readableStreamBody as AsyncIterable<Buffer>) chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c))
    return { jobs: JSON.parse(Buffer.concat(chunks).toString('utf-8')), etag: d.etag }
  } catch (e: any) {
    if (e?.statusCode === 404) return { jobs: [] }
    throw e
  }
}

export const listJobs = async () => (await read()).jobs.sort((a, b) => b.at.localeCompare(a.at))

async function mutate<T>(fn: (jobs: Job[]) => T): Promise<T> {
  let last: unknown
  for (let i = 0; i < 4; i++) {
    const { jobs, etag } = await read()
    const out = fn(jobs)
    try {
      await client().createIfNotExists()
      const body = JSON.stringify(jobs.slice(-300))
      await client().getBlockBlobClient(BLOB).upload(body, Buffer.byteLength(body), { blobHTTPHeaders: { blobContentType: 'application/json' }, conditions: etag ? { ifMatch: etag } : undefined })
      return out
    } catch (e: any) {
      if (e?.statusCode === 412 || e?.statusCode === 409) { last = e; continue }
      throw e
    }
  }
  throw last
}

/** Time chosen in the admin: a real date, at least a minute ahead, at most 90 days out. */
export function parseWhen(v: unknown, now = new Date()): Date {
  const t = typeof v === 'string' ? Date.parse(v) : NaN
  if (!Number.isFinite(t)) throw new Error('That date and time is not valid.')
  if (t < now.getTime() + 60_000) throw new Error('Pick a time at least a minute from now.')
  if (t > now.getTime() + 90 * 86_400_000) throw new Error('Pick a time within the next 90 days.')
  return new Date(t)
}

async function auth(as: Target) {
  const s = await getLinkedInState()
  const org = as === 'organization'
  const token = org ? s.orgAccessToken : s.accessToken
  const exp = org ? s.orgExpiresAt : s.expiresAt
  const author = org ? s.orgUrn : s.memberUrn
  if (!token || !author || !exp || new Date(exp) < new Date()) throw new Error(`The LinkedIn ${org ? 'company page' : 'member'} connection is missing or expired. Reconnect first.`)
  return { token, author, state: s }
}

const outputText = (j: any): string => j.output_text || (j.output || []).flatMap((o: any) => o.content || []).map((c: any) => c.text || '').join('')
export const NO_I = 'Never use first-person singular (no "I", "my", "me"); write direct and impersonal. No emoji. Never invent facts, names or numbers.'
export async function ai(instructions: string, input: string): Promise<string> {
  return outputText(await foundry('/openai/v1/responses', { model: TEXT_MODEL, instructions, input }))
}

// ---- the actual publish actions (used immediately or by the scheduler) ----

export async function announceEvent(ev: SiteEvent, as: Target): Promise<{ urn: string; text: string }> {
  const { token, author } = await auth(as)
  const when = new Date(ev.startsAt).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Asia/Kolkata' })
  const text = formatForLinkedIn((await ai(
    `You write LinkedIn event announcements for Gennoor Tech. ${NO_I} 70-120 words, a strong first line, short paragraphs, the date and time in IST, a call to register free at the link given, and 3-4 CamelCase hashtags at the end. Return only the post text.`,
    `Title: ${ev.title}\nWhen: ${when} IST, ${ev.durationMinutes} minutes, online on Microsoft Teams\nDetails: ${ev.description}\nRegister: ${eventUrl(ev)}`,
  )).trim())
  return { urn: await publishPost({ token, author, commentary: text }), text }
}

export async function publishEventToLinkedIn(ev: SiteEvent): Promise<{ eventId: string; postUrn: string }> {
  const { token, author } = await auth('organization')
  const start = new Date(ev.startsAt).getTime()
  const r = await createExternalEvent({
    token, organizer: author, name: ev.title.slice(0, 120), description: ev.description.slice(0, 2000),
    startsAt: start, endsAt: start + ev.durationMinutes * 60_000, url: eventUrl(ev), privacyPolicyUrl: 'https://www.gennoor.com/privacy',
  })
  await mutateEvents((events) => { const e = events.find((x) => x.id === ev.id); if (e) { e.linkedinEventId = r.eventId; e.linkedinPostUrn = r.postUrn } })
  return r
}

export async function publishCarousel(plan: CarouselPlan, as: Target): Promise<string> {
  const { token, author } = await auth(as)
  return publishDocument({ token, author, commentary: String(plan.caption || plan.title).slice(0, 3000), pdf: await renderCarouselPdf(plan), title: plan.title.slice(0, 100) })
}

async function run(job: Job): Promise<string> {
  if (job.kind === 'carousel') return publishCarousel(job.payload.plan!, job.as)
  const ev = await getEvent(job.payload.eventId || '')
  if (!ev || ev.cancelled) throw new Error('The event no longer exists or was cancelled.')
  if (job.kind === 'event-announce') return (await announceEvent(ev, job.as)).urn
  return (await publishEventToLinkedIn(ev)).postUrn
}

// ---- queue API ----

const newJob = (kind: JobKind, as: Target, title: string, payload: Job['payload'], at: Date): Job =>
  ({ id: randomBytes(5).toString('hex'), kind, at: at.toISOString(), as, title: title.slice(0, 120), payload, state: 'pending', tries: 0 })

export async function schedule(kind: JobKind, as: Target, title: string, payload: Job['payload'], when: unknown): Promise<Job> {
  const job = newJob(kind, as, title, payload, parseWhen(when))
  await mutate((jobs) => { jobs.push(job) })
  return job
}

/** Remember something that was posted straight away so it can be found and deleted later. */
export async function recordPosted(kind: JobKind, as: Target, title: string, urn: string, payload: Job['payload'] = {}) {
  const job: Job = { ...newJob(kind, as, title, payload, new Date()), state: 'done', urn, doneAt: new Date().toISOString() }
  await mutate((jobs) => { jobs.push(job) })
}

export async function cancelJob(id: string) {
  return mutate((jobs) => { const i = jobs.findIndex((j) => j.id === id && j.state !== 'done'); if (i >= 0) jobs.splice(i, 1); return i >= 0 })
}

/** Deletes the post on LinkedIn and marks the record. */
export async function deleteJobPost(id: string) {
  const job = (await read()).jobs.find((j) => j.id === id)
  if (!job?.urn) throw new Error('Nothing to delete for that item.')
  const { token } = await auth(job.as)
  await deleteLinkedInPost(token, job.urn)
  await mutate((jobs) => { const j = jobs.find((x) => x.id === id); if (j) j.state = 'deleted' })
}

/** Delete any of our posts from a pasted post URL or URN (urn:li:share / ugcPost / activity). */
export async function deleteByUrn(input: string, as: Target) {
  const full = input.match(/urn:li:(?:share|ugcPost|activity):\d+/)
  const loose = input.match(/(share|ugcPost|activity)[-:](\d{10,})/)
  const urn = full ? full[0] : loose ? `urn:li:${loose[1]}:${loose[2]}` : ''
  if (!urn) throw new Error('Paste the post link or its urn:li:share / ugcPost / activity id.')
  const { token } = await auth(as)
  await deleteLinkedInPost(token, urn)
}

export async function jobsTick(now = new Date()): Promise<string[]> {
  const out: string[] = []
  const due = (await read()).jobs.filter((j) => (j.state === 'pending' || j.state === 'publishing') && Date.parse(j.at) <= now.getTime())
  for (const j of due) {
    if (j.state === 'publishing') {
      if (now.getTime() - Date.parse(j.busyAt || j.at) > BUSY_MS) {
        await mutate((jobs) => { const x = jobs.find((y) => y.id === j.id); if (x) { x.state = 'failed'; x.error = 'Interrupted mid-post. Check LinkedIn before posting again.' } })
        await sendAdminAlert('Check LinkedIn for a scheduled item', `<p>"${j.title}" was interrupted and may or may not have gone out. Check LinkedIn before posting it again.</p>`, `job-busy-${j.id}`).catch(() => {})
        out.push(`${j.id}: interrupted`)
      }
      continue
    }
    if (now.getTime() - Date.parse(j.at) > GRACE_MS) {
      await mutate((jobs) => { const x = jobs.find((y) => y.id === j.id); if (x) { x.state = 'failed'; x.error = 'The scheduled time passed before it could be posted, so it was not sent late.' } })
      out.push(`${j.id}: missed its window`)
      continue
    }
    await mutate((jobs) => { const x = jobs.find((y) => y.id === j.id); if (x) { x.state = 'publishing'; x.busyAt = now.toISOString() } })
    try {
      const urn = await run(j)
      await mutate((jobs) => { const x = jobs.find((y) => y.id === j.id); if (x) { x.state = 'done'; x.urn = urn; x.doneAt = new Date().toISOString(); x.error = undefined } })
      out.push(`${j.id}: posted ${j.kind}`)
    } catch (e: any) {
      const tries = j.tries + 1, msg = String(e?.message || e).slice(0, 200)
      await mutate((jobs) => { const x = jobs.find((y) => y.id === j.id); if (x) { x.tries = tries; x.error = msg; x.state = tries >= MAX_TRIES ? 'failed' : 'pending'; x.busyAt = undefined } })
      out.push(`${j.id}: failed (${tries}/${MAX_TRIES}) ${msg}`)
      if (tries >= MAX_TRIES) await sendAdminAlert('A scheduled LinkedIn item failed', `<p>"${j.title}" failed ${tries} times: ${msg}</p>`, `job-fail-${j.id}`).catch(() => {})
    }
  }
  return out.length ? out : ['nothing to do']
}
