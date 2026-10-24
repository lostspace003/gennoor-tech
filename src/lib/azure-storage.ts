import { TableClient, TableServiceClient, AzureNamedKeyCredential } from '@azure/data-tables'

function getConnectionConfig() {
  const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!connStr) throw new Error('AZURE_STORAGE_CONNECTION_STRING not configured')
  return connStr
}

function getTableClient(tableName: string): TableClient {
  return TableClient.fromConnectionString(getConnectionConfig(), tableName)
}

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

export async function savePageView(data: {
  page: string
  url: string
  referrer?: string
  userAgent?: string
  ip?: string
  country?: string
  city?: string
}) {
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
  })
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
    })
  }

  return views
}

// ─── Blog Comments ───────────────────────────────────────────

export async function getCommentsBySlug(slug: string) {
  await ensureTable('BlogComments')
  const client = getTableClient('BlogComments')

  const comments: Array<Record<string, any>> = []
  const query = client.listEntities({
    queryOptions: { filter: `PartitionKey eq '${slug}' and status ne 'hidden'` },
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

  await client.createEntity({
    partitionKey: type,
    rowKey,
    ...toTableSafe(data),
    ...(await sourceOfRequest()),
    status: 'New',
    createdAt: now.toISOString(),
  })

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

export async function getEnquiries(type?: string, days: number = 30) {
  const tableName = 'Enquiries'
  await ensureTable(tableName)
  const client = getTableClient(tableName)

  const enquiries: Array<Record<string, any>> = []
  const filter = type ? `PartitionKey eq '${type}'` : undefined
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
      filter: `PartitionKey eq '${pk}' and RowKey ge '${courseId}:' and RowKey lt '${courseId};'`,
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
    queryOptions: { filter: `PartitionKey eq '${pk}'` },
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
