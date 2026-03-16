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
