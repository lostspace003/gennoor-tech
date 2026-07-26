import { BlobServiceClient, BlobSASPermissions } from '@azure/storage-blob'

// CRM document library: 2-page manuals (tech / non-tech), webinar posters,
// and anything else the team attaches to outreach emails.
const CONTAINER = 'crm-documents'

function getContainer() {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!conn) throw new Error('AZURE_STORAGE_CONNECTION_STRING not configured')
  return BlobServiceClient.fromConnectionString(conn).getContainerClient(CONTAINER)
}

export interface CrmDocument {
  name: string
  size: number
  contentType: string
  lastModified: string
}

export async function listDocuments(): Promise<CrmDocument[]> {
  const container = getContainer()
  const exists = await container.exists()
  if (!exists) return []
  const docs: CrmDocument[] = []
  for await (const blob of container.listBlobsFlat()) {
    docs.push({
      name: blob.name,
      size: blob.properties.contentLength || 0,
      contentType: blob.properties.contentType || 'application/octet-stream',
      lastModified: blob.properties.lastModified?.toISOString() || '',
    })
  }
  return docs.sort((a, b) => b.lastModified.localeCompare(a.lastModified))
}

export async function uploadDocument(name: string, content: Buffer, contentType: string): Promise<void> {
  const container = getContainer()
  await container.createIfNotExists()
  const blob = container.getBlockBlobClient(name)
  await blob.upload(content, content.length, { blobHTTPHeaders: { blobContentType: contentType } })
}

export async function downloadDocument(name: string): Promise<{ content: Buffer; contentType: string } | null> {
  const container = getContainer()
  const blob = container.getBlockBlobClient(name)
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
  const container = getContainer()
  await container.getBlockBlobClient(name).deleteIfExists()
}

// Short-lived read-only SAS URL — used so the Office web viewer can render
// docx/xlsx/pptx previews (it must fetch the file itself, so it gets a
// time-boxed link rather than access to our authenticated endpoint).
export async function getDocumentSasUrl(name: string, minutes = 10): Promise<string> {
  const blob = getContainer().getBlockBlobClient(name)
  return blob.generateSasUrl({
    permissions: BlobSASPermissions.parse('r'),
    startsOn: new Date(Date.now() - 60_000),
    expiresOn: new Date(Date.now() + minutes * 60_000),
  })
}
