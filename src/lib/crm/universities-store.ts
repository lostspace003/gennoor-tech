import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob'
import { UNIVERSITY_SEED, MASTER_EMAIL } from '@/data/university-partnership'
import { getLeads } from './store'
import { HOURLY_SEND_LIMIT, sentInLastHour } from './replies'
import { universityFromSeed, type UniActivity, type UniDoc, type University } from './universities-types'

// The University Partnership campaign lives in one file of the storage account, apart from the leads
// (docs/CRM.md, section 15). The same pattern as ./store.ts: one JSON file, saved with the ETag guard so two
// people saving at once cannot drop each other's changes. The first time it is read, the toolkit's 27 universities
// and 55 contacts are put in; after that the file is the truth and the seed is never applied again.
const CONTAINER = 'crm-data'
const BLOB = 'universities.json'

function client(): BlockBlobClient {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!conn) throw new Error('AZURE_STORAGE_CONNECTION_STRING not configured')
  return BlobServiceClient.fromConnectionString(conn).getContainerClient(CONTAINER).getBlockBlobClient(BLOB)
}

const seedDoc = (): UniDoc => ({
  version: 1,
  settings: { formUrl: '' },
  universities: UNIVERSITY_SEED.map((s) => universityFromSeed(s, MASTER_EMAIL)),
})

async function readAll(): Promise<{ doc: UniDoc; etag?: string; fresh: boolean }> {
  const blob = client()
  try {
    const download = await blob.download()
    const chunks: Buffer[] = []
    for await (const chunk of download.readableStreamBody as AsyncIterable<Buffer>) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    const doc = JSON.parse(Buffer.concat(chunks).toString('utf-8')) as UniDoc
    doc.settings = { formUrl: String(doc.settings?.formUrl ?? '') }
    doc.universities = Array.isArray(doc.universities) ? doc.universities : []
    return { doc, etag: download.etag, fresh: false }
  } catch (error: any) {
    if (error?.statusCode === 404) return { doc: seedDoc(), fresh: true }
    throw error
  }
}

async function writeAll(doc: UniDoc, etag?: string) {
  await BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING || '').getContainerClient(CONTAINER).createIfNotExists()
  const body = JSON.stringify(doc)
  await client().upload(body, Buffer.byteLength(body), {
    blobHTTPHeaders: { blobContentType: 'application/json' },
    // A brand-new file may only be created if nobody else created it first
    conditions: etag ? { ifMatch: etag } : { ifNoneMatch: '*' },
  })
}

/** The campaign as it stands. The first read puts the toolkit's data in. */
export async function getUniversities(): Promise<UniDoc> {
  const { doc, fresh } = await readAll()
  if (fresh) {
    try { await writeAll(doc) } catch (e: any) { if (e?.statusCode !== 409 && e?.statusCode !== 412) throw e; return (await readAll()).doc }
  }
  return doc
}

/** Read, change, save: tried again when someone else saved in between. Returns what `mutate` returns. */
export async function mutateUniversities<T>(mutate: (doc: UniDoc) => T): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt < 4; attempt++) {
    const { doc, etag } = await readAll()
    const result = mutate(doc)
    try {
      await writeAll(doc, etag)
      return result
    } catch (error: any) {
      if (error?.statusCode === 412 || error?.statusCode === 409) { lastError = error; continue }
      throw error
    }
  }
  throw lastError
}

/** Writes a line of what happened on the university, newest first, and marks it as changed. */
export function note(u: University, by: string, type: string, description: string, now = new Date().toISOString()): void {
  const line: UniActivity = { at: now, by, type, description: description.slice(0, 300) }
  u.activities.unshift(line)
  if (u.activities.length > 200) u.activities.length = 200
  u.updatedAt = now
}

/** How many emails the CRM has sent this hour, leads and universities together: the whole site shares one allowance. */
export async function sentThisHour(universities: Array<Pick<University, 'emails'>>) {
  const leads = await getLeads().catch(() => [])
  const fromLeads = sentInLastHour(leads).count
  const since = new Date(Date.now() - 3_600_000).toISOString()
  const fromUniversities = universities.reduce((n, u) => n + u.emails.filter((e) => e.status === 'sent' && e.at > since).length, 0)
  return { used: fromLeads + fromUniversities, limit: HOURLY_SEND_LIMIT }
}

