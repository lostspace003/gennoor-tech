import { TableClient, AzureNamedKeyCredential } from '@azure/data-tables'
import { BlobServiceClient } from '@azure/storage-blob'

// ── Connection ──────────────────────────────────────────────────────────────

function getConnectionString(): string {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!conn) throw new Error('AZURE_STORAGE_CONNECTION_STRING not set')
  return conn
}

// ── Table Storage (Enquiries & Page Views) ──────────────────────────────────

function getTableClient(tableName: string): TableClient {
  return TableClient.fromConnectionString(getConnectionString(), tableName)
}

export type EnquiryType = 'TrainingEnquiry' | 'CertificationEnquiry' | 'ExpertCallBooking'

export interface EnquiryRecord {
  partitionKey: string   // EnquiryType
  rowKey: string         // unique ID (timestamp-based)
  name: string
  email: string
  phone?: string
  company?: string
  designation?: string
  programTitle?: string
  leadScore?: string
  details: string        // JSON string of all form fields
  timestamp: string
}

export interface PageViewRecord {
  partitionKey: string   // date YYYY-MM-DD
  rowKey: string         // unique ID
  page: string
  url: string
  referrer: string
  userAgent: string
  ip: string
  country: string
  city: string
  timestamp: string
}

// Save an enquiry to Azure Table Storage
export async function saveEnquiry(type: EnquiryType, data: Record<string, unknown>): Promise<void> {
  try {
    const client = getTableClient('Enquiries')
    const now = new Date()
    const rowKey = `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`

    const entity: EnquiryRecord = {
      partitionKey: type,
      rowKey,
      name: String(data.name || ''),
      email: String(data.email || ''),
      phone: String(data.phone || data.whatsapp || ''),
      company: String(data.company || ''),
      designation: String(data.designation || ''),
      programTitle: String(data.programTitle || data.selectedCertification || ''),
      leadScore: String(data.leadScore || ''),
      details: JSON.stringify(data),
      timestamp: now.toISOString(),
    }

    await client.createEntity(entity)
    console.log(`Enquiry saved to Azure Table: ${type} / ${rowKey}`)
  } catch (error) {
    console.error('Failed to save enquiry to Azure Table:', error)
  }
}

// Save a page view to Azure Table Storage
export async function savePageView(data: {
  page: string
  url: string
  referrer: string
  userAgent: string
  ip: string
  country: string
  city: string
}): Promise<void> {
  try {
    const client = getTableClient('PageViews')
    const now = new Date()
    const dateKey = now.toISOString().split('T')[0] // YYYY-MM-DD
    const rowKey = `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`

    const entity: PageViewRecord = {
      partitionKey: dateKey,
      rowKey,
      page: data.page,
      url: data.url,
      referrer: data.referrer,
      userAgent: data.userAgent,
      ip: data.ip,
      country: data.country,
      city: data.city,
      timestamp: now.toISOString(),
    }

    await client.createEntity(entity)
  } catch (error) {
    console.error('Failed to save page view to Azure Table:', error)
  }
}

// ── Blob Storage (PDFs) ─────────────────────────────────────────────────────

function getBlobServiceClient(): BlobServiceClient {
  return BlobServiceClient.fromConnectionString(getConnectionString())
}

// Download a PDF from blob storage as a Buffer (for email attachments)
export async function downloadPdfFromBlob(blobPath: string): Promise<Buffer | null> {
  try {
    const blobService = getBlobServiceClient()
    const containerClient = blobService.getContainerClient('course-brochures')
    const blobClient = containerClient.getBlobClient(blobPath)
    const downloadResponse = await blobClient.download(0)

    if (!downloadResponse.readableStreamBody) return null

    const chunks: Buffer[] = []
    for await (const chunk of downloadResponse.readableStreamBody) {
      chunks.push(Buffer.from(chunk))
    }
    return Buffer.concat(chunks)
  } catch (error) {
    console.error(`Failed to download blob ${blobPath}:`, error)
    return null
  }
}

// Upload a file to blob storage
export async function uploadToBlob(
  containerName: string,
  blobName: string,
  content: Buffer,
  contentType: string = 'application/pdf'
): Promise<string | null> {
  try {
    const blobService = getBlobServiceClient()
    const containerClient = blobService.getContainerClient(containerName)
    const blockBlobClient = containerClient.getBlockBlobClient(blobName)

    await blockBlobClient.upload(content, content.length, {
      blobHTTPHeaders: { blobContentType: contentType },
    })

    return blockBlobClient.url
  } catch (error) {
    console.error(`Failed to upload blob ${blobName}:`, error)
    return null
  }
}

// ── Career Coach Sessions ───────────────────────────────────────────────────

export interface CareerSessionRecord {
  partitionKey: string   // 'CareerSession'
  rowKey: string         // session ID
  agentId: string
  agentName: string
  inputFields: string    // JSON of field key-value pairs
  aiResults: string      // JSON of agent results
  resumeFileName?: string
  resumeBlobPath?: string
  contactInfo?: string   // JSON: { name, email, whatsapp }
  status: string         // 'submitted' | 'completed' | 'downloaded' | 'error'
  timestamp: string
}

// Save a career coach session (inputs + results)
export async function saveCareerSession(data: {
  sessionId: string
  agentId: string
  agentName: string
  inputFields: Record<string, string>
  aiResults?: Record<string, string>
  resumeFileName?: string
  resumeBlobPath?: string
  contactInfo?: { name: string; email: string; whatsapp: string }
  status: string
}): Promise<void> {
  try {
    const client = getTableClient('CareerSessions')
    const entity: CareerSessionRecord = {
      partitionKey: 'CareerSession',
      rowKey: data.sessionId,
      agentId: data.agentId,
      agentName: data.agentName,
      inputFields: JSON.stringify(data.inputFields),
      aiResults: JSON.stringify(data.aiResults || {}),
      resumeFileName: data.resumeFileName || '',
      resumeBlobPath: data.resumeBlobPath || '',
      contactInfo: data.contactInfo ? JSON.stringify(data.contactInfo) : '',
      status: data.status,
      timestamp: new Date().toISOString(),
    }
    await client.upsertEntity(entity, 'Replace')
    console.log(`Career session saved: ${data.sessionId}`)
  } catch (error) {
    console.error('Failed to save career session:', error)
  }
}

// Upload resume to blob storage and return the blob path
export async function uploadResume(
  sessionId: string,
  fileName: string,
  content: Buffer
): Promise<string | null> {
  const blobName = `career-resumes/${sessionId}/${fileName}`
  return uploadToBlob('media', blobName, content, 'application/pdf')
}

// ── Query Helpers ───────────────────────────────────────────────────────────

// Get all enquiries by type
export async function getEnquiriesByType(type: EnquiryType): Promise<EnquiryRecord[]> {
  const client = getTableClient('Enquiries')
  const results: EnquiryRecord[] = []
  const entities = client.listEntities<EnquiryRecord>({
    queryOptions: { filter: `PartitionKey eq '${type}'` },
  })
  for await (const entity of entities) {
    results.push(entity)
  }
  return results
}

// Get page views for a specific date
export async function getPageViewsByDate(date: string): Promise<PageViewRecord[]> {
  const client = getTableClient('PageViews')
  const results: PageViewRecord[] = []
  const entities = client.listEntities<PageViewRecord>({
    queryOptions: { filter: `PartitionKey eq '${date}'` },
  })
  for await (const entity of entities) {
    results.push(entity)
  }
  return results
}

// ── Blog Comments ──────────────────────────────────────────────────────────

export interface BlogComment {
  partitionKey: string   // blog post slug
  rowKey: string         // comment ID (timestamp-based)
  parentId: string       // empty for top-level, parent rowKey for replies
  authorName: string
  authorEmail: string
  content: string
  isAuthorReply: boolean
  status: string         // 'approved' | 'hidden'
  timestamp: string
}

export async function saveComment(data: {
  slug: string
  parentId?: string
  authorName: string
  authorEmail: string
  content: string
}): Promise<BlogComment> {
  const client = getTableClient('BlogComments')
  const now = new Date()
  const rowKey = `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`

  const adminEmail = process.env.EMAIL_USER || ''
  const entity: BlogComment = {
    partitionKey: data.slug,
    rowKey,
    parentId: data.parentId || '',
    authorName: data.authorName,
    authorEmail: data.authorEmail,
    content: data.content,
    isAuthorReply: data.authorEmail.toLowerCase() === adminEmail.toLowerCase(),
    status: 'approved',
    timestamp: now.toISOString(),
  }

  await client.createEntity(entity)
  return entity
}

export async function getCommentsBySlug(slug: string): Promise<BlogComment[]> {
  const client = getTableClient('BlogComments')
  const results: BlogComment[] = []
  const entities = client.listEntities<BlogComment>({
    queryOptions: { filter: `PartitionKey eq '${slug}' and status eq 'approved'` },
  })
  for await (const entity of entities) {
    results.push(entity)
  }
  return results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export async function getAllComments(): Promise<BlogComment[]> {
  const client = getTableClient('BlogComments')
  const results: BlogComment[] = []
  const entities = client.listEntities<BlogComment>()
  for await (const entity of entities) {
    results.push(entity)
  }
  return results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export async function updateCommentStatus(slug: string, rowKey: string, status: string): Promise<void> {
  const client = getTableClient('BlogComments')
  await client.updateEntity({ partitionKey: slug, rowKey, status }, 'Merge')
}
