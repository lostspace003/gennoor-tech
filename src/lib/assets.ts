import { BlobServiceClient } from '@azure/storage-blob'

// Files the editor uploads by hand (event cover images, carousel PDFs waiting for their scheduled time).
const CONTAINER = 'crm-data'

function container() {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!conn) throw new Error('AZURE_STORAGE_CONNECTION_STRING not configured')
  return BlobServiceClient.fromConnectionString(conn).getContainerClient(CONTAINER)
}

export async function putAsset(key: string, data: Buffer, contentType: string) {
  const c = container()
  await c.createIfNotExists()
  await c.getBlockBlobClient(key).upload(data, data.length, { blobHTTPHeaders: { blobContentType: contentType } })
}

export async function getAsset(key: string): Promise<{ data: Buffer; contentType: string } | null> {
  try {
    const blob = container().getBlockBlobClient(key)
    const d = await blob.download()
    const chunks: Buffer[] = []
    for await (const ch of d.readableStreamBody as AsyncIterable<Buffer>) chunks.push(Buffer.isBuffer(ch) ? ch : Buffer.from(ch))
    return { data: Buffer.concat(chunks), contentType: d.contentType || 'application/octet-stream' }
  } catch (e: any) {
    if (e?.statusCode === 404) return null
    throw e
  }
}

export const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp']

/** Reads one uploaded file from a multipart form and checks type and size. */
export async function readUpload(form: FormData, field: string, types: string[], maxMb: number): Promise<{ data: Buffer; type: string; name: string }> {
  const f = form.get(field)
  if (!(f instanceof File) || f.size === 0) throw new Error('Choose a file first.')
  if (!types.includes(f.type)) throw new Error(`That file type is not allowed (${f.type || 'unknown'}).`)
  if (f.size > maxMb * 1024 * 1024) throw new Error(`The file is too large. The limit is ${maxMb} MB.`)
  return { data: Buffer.from(await f.arrayBuffer()), type: f.type, name: f.name }
}
