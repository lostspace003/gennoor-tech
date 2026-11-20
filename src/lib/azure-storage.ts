import { TableClient, TableServiceClient, AzureNamedKeyCredential } from '@azure/data-tables'

function getConnectionConfig() {
  const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!connStr) throw new Error('AZURE_STORAGE_CONNECTION_STRING not configured')
  return connStr
}

function getTableClient(tableName: string): TableClient {
  return TableClient.fromConnectionString(getConnectionConfig(), tableName)
}

/**
 * A value on its way into the text of a table filter: every single quote in it is doubled, so it stays text.
 * Without this a visitor who typed  x' or PartitionKey ne '  as a blog post's name was read every comment in the
 * table, hidden ones too (20 November 2026). EVERY value put into a filter goes through this, whoever it is from
 * (docs/SECURITY.md, "Questions to the database").
 */
export const odq = (value: unknown): string => String(value ?? '').replace(/'/g, "''")

// Ensure table exists (creates if not)
async function ensureTable(tableName: string) {
  try {
    const client = getTableClient(tableName)
    await client.createTable()
  } catch (err: any) {
    // TableAlreadyExists is fine
    if (err?.statusCode !== 409) throw err
  }
}

// ─── Page Views ──────────────────────────────────────────────

// Table Storage is schemaless: the identity / attribution columns below are simply added to new rows.
// Rows written before this change have no visitorId; readers fall back to "ip:<ip>" so history still counts.

export type Touch = Record<string, string>

export interface PageViewInput {
  page: string
  url: string
  referrer?: string
  userAgent?: string
  ip?: string
  country?: string
  city?: string
  visitorId?: string
  sessionId?: string
  isNewVisitor?: boolean
  isInternal?: boolean
  firstTouch?: Touch
  lastTouch?: Touch
}

const clip = (v: unknown, n = 200) => String(v ?? '').slice(0, n)

/** Keep only the known marketing keys, clipped; drops anything else a client sends. */
export function cleanTouch(t: unknown): Touch {
  const out: Touch = {}
  if (!t || typeof t !== 'object') return out
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid', 'referrer', 'landing']) {
    const v = (t as Record<string, unknown>)[k]
    if (typeof v === 'string' && v) out[k] = clip(v)
  }
  return out
}

const touchColumns = (prefix: string, t: Touch = {}) => ({
  [`${prefix}Source`]: t.utm_source || '', [`${prefix}Medium`]: t.utm_medium || '', [`${prefix}Campaign`]: t.utm_campaign || '',
  [`${prefix}Content`]: t.utm_content || '', [`${prefix}Term`]: t.utm_term || '',
  [`${prefix}Gclid`]: t.gclid || '', [`${prefix}Fbclid`]: t.fbclid || '',
  [`${prefix}Referrer`]: t.referrer || '', [`${prefix}Landing`]: t.landing || '',
})

export async function savePageView(data: PageViewInput) {
  await ensureTable('PageViews')
  const client = getTableClient('PageViews')
  const now = new Date()
  const partitionKey = now.toISOString().slice(0, 10) // YYYY-MM-DD
  const rowKey = `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`

  await client.createEntity({
    partitionKey,
    rowKey,
    page: data.page || '',
    url: data.url || '',
    referrer: data.referrer || '',
    userAgent: (data.userAgent || '').slice(0, 500),
    ip: data.ip || '',
    country: data.country || '',
    city: data.city || '',
    timestamp: now.toISOString(),
    visitorId: data.visitorId || '',
    sessionId: data.sessionId || '',
    isInternal: !!data.isInternal,
    ...touchColumns('first', data.firstTouch),
    ...touchColumns('last', data.lastTouch),
  })

  // One profile row per visitor: first seen (+ first touch) is written once, last seen / last touch each visit.
  if (data.visitorId && !data.isInternal) {
    await upsertVisitor(data.visitorId, now.toISOString(), data.firstTouch, data.lastTouch, data.country)
  }
}

async function upsertVisitor(id: string, nowIso: string, first?: Touch, last?: Touch, country?: string) {
  await ensureTable('Visitors')
  const client = getTableClient('Visitors')
  try {
    await client.createEntity({
      partitionKey: 'v', rowKey: id, firstSeen: nowIso, lastSeen: nowIso, country: country || '', email: '',
      ...touchColumns('first', first), ...touchColumns('last', last || first),
    })
  } catch (err: any) {
    if (err?.statusCode !== 409) throw err
    await client.updateEntity({ partitionKey: 'v', rowKey: id, lastSeen: nowIso, ...touchColumns('last', last) }, 'Merge')
  }
}

/** Anonymous → identified: stamp the lead's email on the visitor profile. */
export async function linkVisitorToLead(visitorId: string, email: string) {
  if (!visitorId || !email) return
  try {
    await ensureTable('Visitors')
    await getTableClient('Visitors').upsertEntity({ partitionKey: 'v', rowKey: visitorId, email: clip(email, 254), convertedAt: new Date().toISOString() }, 'Merge')
  } catch (err) {
    console.error('linkVisitorToLead failed:', err)
  }
}

export async function getVisitorProfile(visitorId: string): Promise<Record<string, any> | null> {
  try {
    await ensureTable('Visitors')
    return (await getTableClient('Visitors').getEntity('v', visitorId)) as Record<string, any>
  } catch {
    return null
  }
}

export async function getPageViews(days: number = 7) {
  await ensureTable('PageViews')
  const client = getTableClient('PageViews')
  const since = new Date()
  since.setDate(since.getDate() - days)
  const sinceStr = since.toISOString().slice(0, 10)

  const views: Array<Record<string, any>> = []
  const query = client.listEntities({
    queryOptions: { filter: `PartitionKey ge '${sinceStr}'` },
  })

  for await (const entity of query) {
    views.push({
      date: entity.partitionKey,
      page: entity.page,
      url: entity.url,
      referrer: entity.referrer,
      country: entity.country,
      city: entity.city,
      timestamp: entity.timestamp,
      ip: entity.ip,
      visitorId: entity.visitorId || '',
      sessionId: entity.sessionId || '',
      isInternal: entity.isInternal === true,
      firstSource: entity.firstSource || '',
      lastSource: entity.lastSource || '',
    })
  }

  return views
}

/** Pages one visitor viewed, oldest first, from `fromIso` up to `toIso` (the enquiry's pre-submission journey). */
export async function getVisitorJourney(visitorId: string, fromIso: string, toIso: string) {
  await ensureTable('PageViews')
  const client = getTableClient('PageViews')
  const out: Array<{ page: string; at: string; referrer: string }> = []
  const query = client.listEntities({
    queryOptions: { filter: `PartitionKey ge '${fromIso.slice(0, 10)}' and PartitionKey le '${toIso.slice(0, 10)}' and visitorId eq '${visitorId.replace(/[^a-zA-Z0-9-]/g, '')}'` },
  })
  for await (const e of query) {
    const at = String(e.timestamp || '')
    if (at && at <= toIso) out.push({ page: String(e.page || ''), at, referrer: String(e.referrer || '') })
  }
  return out.sort((a, b) => a.at.localeCompare(b.at))
}

// ─── Behaviour events (scroll depth, CTA clicks, form abandonment) ───

export async function saveEvent(data: { type: string; page: string; visitorId: string; sessionId: string; meta: Record<string, unknown> }) {
  await ensureTable('AnalyticsEvents')
  const now = new Date()
  await getTableClient('AnalyticsEvents').createEntity({
    partitionKey: now.toISOString().slice(0, 10),
    rowKey: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
    type: data.type,
    page: data.page,
    visitorId: data.visitorId,
    sessionId: data.sessionId,
    meta: JSON.stringify(data.meta).slice(0, 2000),
    timestamp: now.toISOString(),
    isInternal: false,
  })
}

export async function getEvents(days: number = 7) {
  await ensureTable('AnalyticsEvents')
  const since = new Date()
  since.setDate(since.getDate() - days)
  const out: Array<{ type: string; page: string; visitorId: string; meta: Record<string, any>; date: string }> = []
  for await (const e of getTableClient('AnalyticsEvents').listEntities({ queryOptions: { filter: `PartitionKey ge '${since.toISOString().slice(0, 10)}'` } })) {
    let meta: Record<string, any> = {}
    try { meta = JSON.parse(String(e.meta || '{}')) } catch { /* keep empty */ }
    out.push({ type: String(e.type), page: String(e.page), visitorId: String(e.visitorId || ''), meta, date: String(e.partitionKey) })
  }
  return out
}

/** First-seen date for every visitor: the source of truth for new vs returning. */
export async function getVisitorFirstSeen(): Promise<Map<string, string>> {
  await ensureTable('Visitors')
  const m = new Map<string, string>()
  for await (const e of getTableClient('Visitors').listEntities({ queryOptions: { select: ['RowKey', 'firstSeen'] } })) {
    m.set(String(e.rowKey), String(e.firstSeen || ''))
  }
  return m
}

// ─── Blog Comments ───────────────────────────────────────────

export async function getCommentsBySlug(slug: string) {
  await ensureTable('BlogComments')
  const client = getTableClient('BlogComments')

  const comments: Array<Record<string, any>> = []
  const query = client.listEntities({
    queryOptions: { filter: `PartitionKey eq '${odq(slug)}' and status ne 'hidden'` },
  })

  for await (const entity of query) {
    comments.push({
      rowKey: entity.rowKey,
      slug: entity.partitionKey,
      parentId: entity.parentId || null,
      authorName: entity.authorName,
      authorEmail: entity.authorEmail,
      content: entity.content,
      status: entity.status || 'approved',
      createdAt: entity.createdAt,
    })
  }

  return comments
}

export async function getAllComments() {
  await ensureTable('BlogComments')
  const client = getTableClient('BlogComments')

  const comments: Array<Record<string, any>> = []
  const query = client.listEntities()

  for await (const entity of query) {
    comments.push({
      rowKey: entity.rowKey,
      slug: entity.partitionKey,
      parentId: entity.parentId || null,
      authorName: entity.authorName,
      authorEmail: entity.authorEmail,
      content: entity.content,
      status: entity.status || 'approved',
      createdAt: entity.createdAt,
    })
  }

  return comments
}

export async function saveComment(data: {
  slug: string
  parentId?: string
  authorName: string
  authorEmail: string
  content: string
}) {
  await ensureTable('BlogComments')
  const client = getTableClient('BlogComments')
  const now = new Date()
  const rowKey = `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`

  const entity = {
    partitionKey: data.slug,
    rowKey,
    parentId: data.parentId || '',
    authorName: data.authorName,
    authorEmail: data.authorEmail,
    content: data.content,
    status: 'approved',
    createdAt: now.toISOString(),
  }

  await client.createEntity(entity)
  return { ...entity, slug: data.slug }
}

export async function updateCommentStatus(slug: string, rowKey: string, status: string) {
  await ensureTable('BlogComments')
  const client = getTableClient('BlogComments')
  await client.updateEntity(
    { partitionKey: slug, rowKey, status },
    'Merge'
  )
}

// ─── Enquiries ───────────────────────────────────────────────

// Azure Table Storage only accepts primitive Edm types (string/number/boolean/
// Date/binary). Arrays and plain objects throw "Unknown EDM type object", which
// would 500 the whole request before any email is sent. Serialise them so any
// caller can hand us structured fields safely.
function toTableSafe(data: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = {}
  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) {
      out[key] = ''
    } else if (
      Array.isArray(value) ||
      (typeof value === 'object' && !(value instanceof Date) && !Buffer.isBuffer(value))
    ) {
      out[key] = JSON.stringify(value)
    } else {
      out[key] = value
    }
  }
  return out
}

/**
 * Where this enquiry came from: the small tag the browser attaches to every form (see AttributionTracker).
 * Read from the request that is being handled; empty when there is none (scripts) or the tag is missing.
 */
async function sourceOfRequest(): Promise<Record<string, string>> {
  try {
    const { headers } = await import('next/headers')
    const raw = (await headers()).get('x-gnr-attr')
    if (!raw) return {}
    const a = JSON.parse(decodeURIComponent(raw)) as Record<string, string>
    const clip = (v: unknown) => String(v ?? '').slice(0, 200)
    return {
      srcTag: clip(a.src), srcMedium: clip(a.medium), srcCampaign: clip(a.campaign),
      srcReferrer: clip(a.referrer), srcLanding: clip(a.landing), srcPage: clip(a.page),
      visitorId: /^[a-zA-Z0-9-]{8,64}$/.test(String(a.visitorId)) ? String(a.visitorId) : '',
    }
  } catch {
    return {}
  }
}

export async function saveEnquiry(type: string, data: Record<string, any>) {
  const tableName = 'Enquiries'
  await ensureTable(tableName)
  const client = getTableClient(tableName)
  const now = new Date()
  const rowKey = `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`

  const source = await sourceOfRequest()
  await client.createEntity({
    partitionKey: type,
    rowKey,
    ...toTableSafe(data),
    ...source,
    status: 'New',
    createdAt: now.toISOString(),
  })

  // Stitch the anonymous visitor to this lead so the journey and first/last touch can be read back later
  if (source.visitorId && typeof data.email === 'string') await linkVisitorToLead(source.visitorId, data.email)

  return { partitionKey: type, rowKey }
}

export async function updateEnquiry(type: string, rowKey: string, updates: Record<string, any>) {
  const tableName = 'Enquiries'
  await ensureTable(tableName)
  const client = getTableClient(tableName)
  await client.updateEntity(
    { partitionKey: type, rowKey, ...toTableSafe(updates) },
    'Merge',
  )
}

export async function deleteEnquiry(type: string, rowKey: string) {
  const tableName = 'Enquiries'
  await ensureTable(tableName)
  const client = getTableClient(tableName)
  await client.deleteEntity(type, rowKey)
}

export async function getEnquiry(type: string, rowKey: string): Promise<Record<string, any> | null> {
  try {
    await ensureTable('Enquiries')
    return (await getTableClient('Enquiries').getEntity(type, rowKey)) as Record<string, any>
  } catch {
    return null
  }
}

export async function getEnquiries(type?: string, days: number = 30) {
  const tableName = 'Enquiries'
  await ensureTable(tableName)
  const client = getTableClient(tableName)

  const enquiries: Array<Record<string, any>> = []
  const filter = type ? `PartitionKey eq '${odq(type)}'` : undefined
  const query = client.listEntities({
    queryOptions: filter ? { filter } : undefined,
  })

  const since = new Date()
  since.setDate(since.getDate() - days)

  for await (const entity of query) {
    const createdAt = entity.createdAt as string
    if (createdAt && new Date(createdAt) >= since) {
      enquiries.push({
        rowKey: entity.rowKey,
        type: entity.partitionKey,
        ...entity,
      })
    }
  }

  return enquiries
}

// ─── Pending Bookings ───────────────────────────────────────

export async function savePendingBooking(data: {
  serviceId: string
  serviceName: string
  date: string
  startTime: string
  endTime: string
  timezone: string
  name: string
  email: string
  whatsapp: string
  topic: string
  country: string
}) {
  const tableName = 'PendingBookings'
  await ensureTable(tableName)
  const client = getTableClient(tableName)
  const now = new Date()
  const rowKey = `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`

  await client.createEntity({
    partitionKey: 'booking',
    rowKey,
    ...data,
    status: 'pending',
    createdAt: now.toISOString(),
  })

  return { partitionKey: 'booking', rowKey }
}

export async function getPendingBookings() {
  const tableName = 'PendingBookings'
  await ensureTable(tableName)
  const client = getTableClient(tableName)

  const bookings: Array<Record<string, any>> = []
  const query = client.listEntities()

  for await (const entity of query) {
    bookings.push({
      rowKey: entity.rowKey,
      ...entity,
    })
  }

  bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return bookings
}

export async function updatePendingBooking(rowKey: string, updates: Record<string, any>) {
  const tableName = 'PendingBookings'
  await ensureTable(tableName)
  const client = getTableClient(tableName)

  await client.updateEntity(
    { partitionKey: 'booking', rowKey, ...updates },
    'Merge',
  )
}

export async function deletePendingBooking(rowKey: string) {
  const tableName = 'PendingBookings'
  await ensureTable(tableName)
  const client = getTableClient(tableName)
  await client.deleteEntity('booking', rowKey)
}

// ─── Career Sessions ─────────────────────────────────────────

export async function uploadResume(
  sessionId: string,
  fileName: string,
  buffer: Buffer
): Promise<string> {
  const { BlobServiceClient } = await import('@azure/storage-blob')
  const connStr = getConnectionConfig()
  const blobService = BlobServiceClient.fromConnectionString(connStr)
  const container = blobService.getContainerClient('resumes')
  await container.createIfNotExists()
  const blobName = `${sessionId}/${fileName}`
  const blob = container.getBlockBlobClient(blobName)
  await blob.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: 'application/pdf' },
  })
  return blobName
}

// ─── Email Logs ─────────────────────────────────────────────

export async function saveEmailLog(data: {
  to: string
  from: string
  subject: string
  status: 'sent' | 'failed'
  messageId?: string
  error?: string
  source?: string
}) {
  await ensureTable('EmailLogs')
  const client = getTableClient('EmailLogs')
  const now = new Date()
  const partitionKey = now.toISOString().slice(0, 10)
  const rowKey = `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`

  await client.createEntity({
    partitionKey,
    rowKey,
    to: data.to,
    from: data.from,
    subject: (data.subject || '').slice(0, 500),
    status: data.status,
    messageId: data.messageId || '',
    error: (data.error || '').slice(0, 1000),
    source: data.source || 'api',
    createdAt: now.toISOString(),
  })
}

export async function getEmailLogs(days: number = 30) {
  await ensureTable('EmailLogs')
  const client = getTableClient('EmailLogs')
  const since = new Date()
  since.setDate(since.getDate() - days)
  const sinceStr = since.toISOString().slice(0, 10)

  const logs: Array<Record<string, any>> = []
  const query = client.listEntities({
    queryOptions: { filter: `PartitionKey ge '${sinceStr}'` },
  })

  for await (const entity of query) {
    logs.push({
      date: entity.partitionKey,
      rowKey: entity.rowKey,
      to: entity.to,
      from: entity.from,
      subject: entity.subject,
      status: entity.status,
      messageId: entity.messageId,
      error: entity.error,
      source: entity.source,
      createdAt: entity.createdAt,
    })
  }

  return logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// ─── Learners ───────────────────────────────────────────────

/** The row key a learner's record lives under. */
const learnerKey = (email: string) =>
  email.toLowerCase().trim().replace(/[^a-z0-9@._-]/g, '')

export async function saveLearner(data: {
  email: string
  name: string
  provider: 'otp' | 'google' | 'microsoft' | 'password'
}) {
  await ensureTable('Learners')
  const client = getTableClient('Learners')
  const sanitizedEmail = learnerKey(data.email)

  // createdAt is written ONLY on first sight. A 'Merge' upsert overwrites every
  // property it carries, so including it unconditionally used to reset the
  // signup date on every single login — which is what made the profile card
  // say "Learner since" the current month for everyone.
  const existing = await getLearner(data.email)

  await client.upsertEntity({
    partitionKey: 'learner',
    rowKey: sanitizedEmail,
    email: data.email.toLowerCase().trim(),
    name: data.name,
    provider: data.provider,
    lastLogin: new Date().toISOString(),
    ...(existing?.createdAt ? {} : { createdAt: new Date().toISOString() }),
  }, 'Merge')
}


/** Merge arbitrary fields onto a learner record (profile, password hash…). */
export async function updateLearnerFields(email: string, fields: Record<string, unknown>) {
  await ensureTable('Learners')
  const client = getTableClient('Learners')
  await client.upsertEntity({
    partitionKey: 'learner',
    rowKey: learnerKey(email),
    email: email.toLowerCase().trim(),
    ...fields,
  }, 'Merge')
}

export async function getLearner(email: string) {
  await ensureTable('Learners')
  const client = getTableClient('Learners')
  try {
    return await client.getEntity('learner', learnerKey(email))
  } catch {
    return null
  }
}

// ─── Username → email index ─────────────────────────────────
// Lives in the same Learners table under a separate partition, so a lookup is
// a single point read rather than a scan of every learner.

/** The email a username points at, or null when the username is unclaimed. */
export async function getEmailForUsername(username: string): Promise<string | null> {
  const key = username.toLowerCase().trim()
  if (!key) return null
  await ensureTable('Learners')
  const client = getTableClient('Learners')
  try {
    const entity = await client.getEntity('username', key)
    return (entity.email as string) || null
  } catch {
    return null
  }
}

/**
 * Claim a username for an email address, releasing any previous handle the
 * learner held. Returns false when someone else already owns it.
 */
export async function claimUsername(username: string, email: string): Promise<boolean> {
  const key = username.toLowerCase().trim()
  const owner = email.toLowerCase().trim()
  if (!key || !owner) return false

  const existingOwner = await getEmailForUsername(key)
  if (existingOwner && existingOwner !== owner) return false
  if (existingOwner === owner) return true

  await ensureTable('Learners')
  const client = getTableClient('Learners')

  // Free the learner's old handle so it doesn't linger as a dead pointer.
  const record = await getLearner(owner)
  const previous = (record?.username as string | undefined)?.toLowerCase().trim()
  if (previous && previous !== key) {
    try { await client.deleteEntity('username', previous) } catch { /* already gone */ }
  }

  // createEntity (not upsert) so two people claiming the same handle at the
  // same moment can't both win — the loser gets a 409 from the table.
  try {
    await client.createEntity({ partitionKey: 'username', rowKey: key, email: owner })
  } catch (err: any) {
    if (err?.statusCode === 409) return false
    throw err
  }
  return true
}

/** Resolve an email address OR a username to the learner's email. */
export async function resolveLearnerEmail(identifier: string): Promise<string | null> {
  const value = String(identifier || '').trim().toLowerCase()
  if (!value) return null
  if (value.includes('@')) return value
  return getEmailForUsername(value)
}

// ─── Course Progress ────────────────────────────────────────

export async function saveCourseProgress(data: {
  email: string
  courseId: string
  chapterId: string
  currentSlide: number
  totalSlides: number
  completionPercent: number
  completed: boolean
}) {
  await ensureTable('CourseProgress')
  const client = getTableClient('CourseProgress')
  const partitionKey = data.email.toLowerCase().trim()
  const rowKey = `${data.courseId}:${data.chapterId}`

  // Completion is sticky: revisiting a finished chapter (scrolling back to
  // slide 1) must never flip completed=true back to false, or the cert gate
  // in issue-cert rejects a learner who genuinely finished the course.
  let prev: { completed?: boolean; completionPercent?: number } | null = null
  try {
    prev = await client.getEntity<{ completed?: boolean; completionPercent?: number }>(partitionKey, rowKey)
  } catch { /* first write for this chapter */ }

  await client.upsertEntity({
    partitionKey,
    rowKey,
    courseId: data.courseId,
    chapterId: data.chapterId,
    currentSlide: data.currentSlide,
    totalSlides: data.totalSlides,
    completionPercent: Math.max(data.completionPercent, Number(prev?.completionPercent) || 0),
    completed: data.completed || prev?.completed === true,
    lastAccessed: new Date().toISOString(),
  }, 'Merge')
}

export async function getCourseProgress(email: string, courseId: string): Promise<Array<Record<string, any>>> {
  await ensureTable('CourseProgress')
  const client = getTableClient('CourseProgress')

  const results: Array<Record<string, any>> = []
  const pk = email.toLowerCase().trim()
  const query = client.listEntities({
    queryOptions: {
      filter: `PartitionKey eq '${odq(pk)}' and RowKey ge '${odq(courseId)}:' and RowKey lt '${odq(courseId)};'`,
    },
  })

  for await (const entity of query) {
    results.push({
      chapterId: entity.chapterId,
      courseId: entity.courseId,
      currentSlide: entity.currentSlide,
      totalSlides: entity.totalSlides,
      completionPercent: entity.completionPercent,
      completed: entity.completed,
      lastAccessed: entity.lastAccessed,
    })
  }
  return results
}

/**
 * Return every chapter-progress row for a learner across all courses.
 * Used by the dashboard to render an at-a-glance view of in-progress vs
 * completed vs not-started courses.
 */
export async function getAllCourseProgress(email: string): Promise<Array<Record<string, any>>> {
  await ensureTable('CourseProgress')
  const client = getTableClient('CourseProgress')

  const results: Array<Record<string, any>> = []
  const pk = email.toLowerCase().trim()
  const query = client.listEntities({
    queryOptions: { filter: `PartitionKey eq '${odq(pk)}'` },
  })

  for await (const entity of query) {
    results.push({
      chapterId: entity.chapterId,
      courseId: entity.courseId,
      currentSlide: entity.currentSlide,
      totalSlides: entity.totalSlides,
      completionPercent: entity.completionPercent,
      completed: entity.completed,
      lastAccessed: entity.lastAccessed,
    })
  }
  return results
}

// ─── PDF from Blob ───────────────────────────────────────────

export async function downloadPdfFromBlob(blobPath: string): Promise<Buffer | null> {
  try {
    const { BlobServiceClient } = await import('@azure/storage-blob')
    const connStr = getConnectionConfig()
    const blobService = BlobServiceClient.fromConnectionString(connStr)
    const container = blobService.getContainerClient('pdfs')
    const blob = container.getBlobClient(blobPath)
    const response = await blob.download(0)
    const chunks: Buffer[] = []
    if (response.readableStreamBody) {
      for await (const chunk of response.readableStreamBody) {
        chunks.push(Buffer.from(chunk))
      }
    }
    return Buffer.concat(chunks)
  } catch {
    return null
  }
}
