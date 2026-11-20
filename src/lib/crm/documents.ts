import { BlobServiceClient, BlobSASPermissions } from '@azure/storage-blob'

// CRM document library: 2-page manuals (tech / non-tech), webinar posters,
// and anything else the team attaches to outreach emails.
const CONTAINER = 'crm-documents'

function getContainer() {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!conn) throw new Error('AZURE_STORAGE_CONNECTION_STRING not configured')
  return BlobServiceClient.fromConnectionString(conn).getContainerClient(CONTAINER)
}

// The name of a file comes from the BROWSER (which file to open, attach or delete), and the storage library reads
// "../" in a name the way a file system does. Until 20 November 2026 the name
//   email-attachments/../../crm-data/leads.json
// did not mean a file in this library: it meant the leads store itself, in another part of the storage account,
// and anyone signed in to the CRM could download it, attach it to an email or delete it (docs/SECURITY.md,
// "Files"). So every name is checked twice before it is used: its shape here, and then where the storage library
// says it really points (`libraryBlob`). Every function below goes through `libraryBlob`; none builds a file
// address of its own.

/** Thrown for a name that is not a file of this library. A route answers it with 400, not 500. */
export class BadDocumentName extends Error {
  constructor() { super('Not the name of a document in the library') }
}

/** Is this the name of a file in the library: folders and a file name, nothing that climbs out of them? */
export function isDocumentName(name: unknown): name is string {
  if (typeof name !== 'string' || !name.trim() || name.length > 400) return false
  if (/[\u0000-\u001f\u007f\\]/.test(name)) return false             // no control characters, no backslash
  // every part between slashes is a real name: not empty, and not "." or ".." or any run of dots
  return name.split('/').every((part) => part.trim() !== '' && !/^\.+$/.test(part.trim()))
}

/** The file of THIS library with that name. Throws `BadDocumentName` for anything else. */
function libraryBlob(name: unknown) {
  if (!isDocumentName(name)) throw new BadDocumentName()
  const blob = getContainer().getBlockBlobClient(name)
  // The storage library's own reading of the address it built: it must be this store and this very name
  if (blob.containerName !== CONTAINER || blob.name !== name) throw new BadDocumentName()
  return blob
}

export interface CrmDocument {
  name: string
  size: number
  contentType: string
  lastModified: string
  /**
   * Blob metadata — Azure lower-cases the keys. We write `leadid`, `leadname`,
   * `company`, `version` and `kind` on generated proposals so the library can
   * be filtered by lead and collapsed to the latest version.
   */
  metadata?: Record<string, string>
}

export async function listDocuments(): Promise<CrmDocument[]> {
  const container = getContainer()
  const exists = await container.exists()
  if (!exists) return []
  const docs: CrmDocument[] = []
  for await (const blob of container.listBlobsFlat({ includeMetadata: true })) {
    docs.push({
      name: blob.name,
      size: blob.properties.contentLength || 0,
      contentType: blob.properties.contentType || 'application/octet-stream',
      lastModified: blob.properties.lastModified?.toISOString() || '',
      metadata: blob.metadata && Object.keys(blob.metadata).length ? blob.metadata : undefined,
    })
  }
  return docs.sort((a, b) => b.lastModified.localeCompare(a.lastModified))
}

// Azure rejects metadata values that aren't printable ASCII, and keys that
// aren't valid identifiers — lead names carry accents and punctuation, so
// everything is scrubbed before it goes near a header.
function safeMetadata(metadata?: Record<string, string>): Record<string, string> | undefined {
  if (!metadata) return undefined
  const out: Record<string, string> = {}
  for (const [key, raw] of Object.entries(metadata)) {
    const k = key.toLowerCase().replace(/[^a-z0-9_]/g, '')
    const v = String(raw ?? '').replace(/[^\x20-\x7E]/g, '').trim().slice(0, 250)
    if (k && v) out[k] = v
  }
  return Object.keys(out).length ? out : undefined
}

export async function uploadDocument(
  name: string,
  content: Buffer,
  contentType: string,
  metadata?: Record<string, string>
): Promise<void> {
  const blob = libraryBlob(name)
  await getContainer().createIfNotExists()
  await blob.upload(content, content.length, {
    blobHTTPHeaders: { blobContentType: contentType },
    metadata: safeMetadata(metadata),
  })
}

export async function downloadDocument(name: string): Promise<{ content: Buffer; contentType: string } | null> {
  const blob = libraryBlob(name)
  try {
    const download = await blob.download()
    const chunks: Buffer[] = []
    for await (const chunk of download.readableStreamBody as AsyncIterable<Buffer>) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    }
    return {
      content: Buffer.concat(chunks),
      contentType: download.contentType || 'application/octet-stream',
    }
  } catch (error: any) {
    if (error?.statusCode === 404) return null
    throw error
  }
}

export async function deleteDocument(name: string): Promise<void> {
  await libraryBlob(name).deleteIfExists()
}

// Short-lived read-only SAS URL — used so the Office web viewer can render
// docx/xlsx/pptx previews (it must fetch the file itself, so it gets a
// time-boxed link rather than access to our authenticated endpoint).
export async function getDocumentSasUrl(name: string, minutes = 10): Promise<string> {
  const blob = libraryBlob(name)
  return blob.generateSasUrl({
    permissions: BlobSASPermissions.parse('r'),
    startsOn: new Date(Date.now() - 60_000),
    expiresOn: new Date(Date.now() + minutes * 60_000),
  })
}
