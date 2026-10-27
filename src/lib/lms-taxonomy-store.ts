import { BlobServiceClient } from '@azure/storage-blob'
import { EMPTY_CUSTOM, sanitizeCustom, type CustomTaxonomy } from '@/lib/lms-taxonomy'

// Custom filter values live in the same catalog container as the courses, in a file the
// course loader ignores (it only reads *.json).
const CONTAINER = 'lms-catalog'
const BLOB = 'taxonomy.cfg'

let cache: { at: number; value: CustomTaxonomy } | null = null

function client() {
  const conn = process.env.LMS_STORAGE_CONNECTION_STRING || process.env.AZURE_STORAGE_CONNECTION_STRING || ''
  if (!conn) throw new Error('storage not configured')
  return BlobServiceClient.fromConnectionString(conn).getContainerClient(CONTAINER)
}

export async function getCustomTaxonomy(force = false): Promise<CustomTaxonomy> {
  if (!force && cache && Date.now() - cache.at < 30_000) return cache.value
  let value = EMPTY_CUSTOM
  try {
    const buf = await client().getBlobClient(BLOB).downloadToBuffer().catch(() => null)
    if (buf) value = sanitizeCustom(JSON.parse(buf.toString('utf8')))
  } catch {
    // storage not configured / unreachable: built-in options only
  }
  cache = { at: Date.now(), value }
  return value
}

export async function saveCustomTaxonomy(value: CustomTaxonomy) {
  const c = client()
  await c.createIfNotExists()
  const clean = sanitizeCustom(value)
  const body = JSON.stringify(clean)
  await c.getBlockBlobClient(BLOB).upload(body, Buffer.byteLength(body), { blobHTTPHeaders: { blobContentType: 'application/json' } })
  cache = { at: Date.now(), value: clean }
}
