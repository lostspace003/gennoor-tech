import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob'
import { Lead, LeadActivity } from './types'

// Leads live as one JSON blob in the existing storage account — the same
// pattern every other persisted feature on the site uses. At CRM scale
// (hundreds of leads, a handful of users) this is simpler and more reliable
// than a database, and writes are guarded with ETag optimistic concurrency.
const CONTAINER = 'crm-data'
const LEADS_BLOB = 'leads.json'

function getBlobClient(): BlockBlobClient {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!conn) throw new Error('AZURE_STORAGE_CONNECTION_STRING not configured')
  const service = BlobServiceClient.fromConnectionString(conn)
  return service.getContainerClient(CONTAINER).getBlockBlobClient(LEADS_BLOB)
}

async function ensureContainer() {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!conn) throw new Error('AZURE_STORAGE_CONNECTION_STRING not configured')
  const service = BlobServiceClient.fromConnectionString(conn)
  await service.getContainerClient(CONTAINER).createIfNotExists()
}

async function readAll(): Promise<{ leads: Lead[]; etag?: string }> {
  const blob = getBlobClient()
  try {
    const download = await blob.download()
    const chunks: Buffer[] = []
    for await (const chunk of download.readableStreamBody as AsyncIterable<Buffer>) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    }
    const leads = JSON.parse(Buffer.concat(chunks).toString('utf-8')) as Lead[]
    return { leads, etag: download.etag }
  } catch (error: any) {
    if (error?.statusCode === 404) return { leads: [] }
    throw error
  }
}

async function writeAll(leads: Lead[], etag?: string) {
  await ensureContainer()
  const blob = getBlobClient()
  const body = JSON.stringify(leads)
  await blob.upload(body, Buffer.byteLength(body), {
    blobHTTPHeaders: { blobContentType: 'application/json' },
    conditions: etag ? { ifMatch: etag } : undefined,
  })
}

export async function getLeads(): Promise<Lead[]> {
  const { leads } = await readAll()
  return leads
}

export async function getLead(id: string): Promise<Lead | null> {
  const { leads } = await readAll()
  return leads.find((l) => l.id === id) || null
}

// Read-modify-write with ETag retry so two users saving at once can't
// silently drop each other's changes.
export async function mutateLeads<T>(mutate: (leads: Lead[]) => T): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt < 4; attempt++) {
    const { leads, etag } = await readAll()
    const result = mutate(leads)
    try {
      await writeAll(leads, etag)
      return result
    } catch (error: any) {
      // 412 = blob changed under us; re-read and retry
      if (error?.statusCode === 412 || error?.statusCode === 409) {
        lastError = error
        continue
      }
      throw error
    }
  }
  throw lastError
}

export function touch(lead: Lead, activity?: LeadActivity) {
  const now = new Date().toISOString()
  lead.updatedAt = now
  lead.lastActivity = now
  if (activity) {
    lead.activities.unshift(activity)
    if (lead.activities.length > 200) lead.activities.length = 200
  }
}

// Upsert imported leads, deduping by email (fallback: name+company) so
// re-uploading the same sheet never creates duplicates.
export async function upsertLeads(incoming: Lead[], by: string): Promise<{ added: number; updated: number }> {
  return mutateLeads((leads) => {
    let added = 0
    let updated = 0
    const keyOf = (l: Lead) =>
      l.email ? `e:${l.email.toLowerCase()}` : `nc:${l.name.toLowerCase()}|${l.company.toLowerCase()}`
    const index = new Map(leads.map((l, i) => [keyOf(l), i]))

    for (const lead of incoming) {
      const key = keyOf(lead)
      const existingIdx = index.get(key)
      if (existingIdx !== undefined) {
        const existing = leads[existingIdx]
        // Fill blanks on the existing record; imports never overwrite worked data
        for (const field of ['phone', 'designation', 'linkedin', 'website', 'priority', 'leadType', 'sector', 'region', 'country', 'city', 'notes'] as const) {
          if (!existing[field] && lead[field]) (existing as any)[field] = lead[field]
        }
        touch(existing, { at: new Date().toISOString(), by, type: 'imported', description: 'Refreshed from Excel import' })
        updated++
      } else {
        leads.unshift(lead)
        index.set(key, 0)
        added++
      }
    }
    return { added, updated }
  })
}
