import { TableClient, RestError } from '@azure/data-tables'
import { BlobServiceClient, BlobSASPermissions, generateBlobSASQueryParameters, StorageSharedKeyCredential } from '@azure/storage-blob'
import crypto from 'crypto'

const TABLE_NAME = 'Certificates'
const BLOB_CONTAINER = 'website-content'
const BLOB_PREFIX = 'certificates'

export type Certificate = {
  certId: string
  recipientName: string
  recipientEmail: string
  workshopSlug: string
  workshopTitle: string
  workshopSubtitle: string
  workshopDate: string
  issueDate: string
  durationMinutes: number
  trainerName: string
  issuerName: string
  issuerDomain: string
  pdfBlobPath: string
  verifyUrl: string
  status: 'issued' | 'revoked'
  createdAt: string
}

function getConnectionString() {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!conn) throw new Error('AZURE_STORAGE_CONNECTION_STRING not configured')
  return conn
}

function getTable() {
  return TableClient.fromConnectionString(getConnectionString(), TABLE_NAME)
}

async function ensureTable() {
  try {
    await getTable().createTable()
  } catch (err: unknown) {
    if (err instanceof RestError && err.statusCode !== 409) throw err
  }
}

export function generateCertId(workshopSlug: string, year: number): string {
  const prefix = workshopSlug === 'claude-cowork' ? 'GNR-CC' : `GNR-${workshopSlug.toUpperCase().slice(0, 3)}`
  const rand = crypto.randomBytes(4).toString('hex').toUpperCase()
  return `${prefix}-${year}-${rand}`
}

export async function saveCertificate(cert: Omit<Certificate, 'createdAt' | 'status'> & { status?: 'issued' | 'revoked' }) {
  await ensureTable()
  const client = getTable()
  const now = new Date().toISOString()
  const entity = {
    partitionKey: cert.workshopSlug,
    rowKey: cert.certId,
    recipientName: cert.recipientName,
    recipientEmail: cert.recipientEmail,
    workshopSlug: cert.workshopSlug,
    workshopTitle: cert.workshopTitle,
    workshopSubtitle: cert.workshopSubtitle,
    workshopDate: cert.workshopDate,
    issueDate: cert.issueDate,
    durationMinutes: cert.durationMinutes,
    trainerName: cert.trainerName,
    issuerName: cert.issuerName,
    issuerDomain: cert.issuerDomain,
    pdfBlobPath: cert.pdfBlobPath,
    verifyUrl: cert.verifyUrl,
    status: cert.status || 'issued',
    createdAt: now,
  }
  await client.upsertEntity(entity, 'Replace')
  return { ...entity } as unknown as Certificate
}

export async function getCertificate(certId: string): Promise<Certificate | null> {
  await ensureTable()
  const client = getTable()
  const safeId = certId.replace(/'/g, "''")
  const iter = client.listEntities({ queryOptions: { filter: `RowKey eq '${safeId}'` } })
  for await (const entity of iter) {
    if (entity.status === 'revoked') return null
    return {
      certId: entity.rowKey as string,
      recipientName: (entity.recipientName as string) || '',
      recipientEmail: (entity.recipientEmail as string) || '',
      workshopSlug: (entity.workshopSlug as string) || (entity.partitionKey as string) || '',
      workshopTitle: (entity.workshopTitle as string) || '',
      workshopSubtitle: (entity.workshopSubtitle as string) || '',
      workshopDate: (entity.workshopDate as string) || '',
      issueDate: (entity.issueDate as string) || '',
      durationMinutes: Number(entity.durationMinutes) || 0,
      trainerName: (entity.trainerName as string) || '',
      issuerName: (entity.issuerName as string) || 'Gennoor Tech',
      issuerDomain: (entity.issuerDomain as string) || 'gennoor.com',
      pdfBlobPath: (entity.pdfBlobPath as string) || '',
      verifyUrl: (entity.verifyUrl as string) || '',
      status: (entity.status as 'issued' | 'revoked') || 'issued',
      createdAt: (entity.createdAt as string) || '',
    }
  }
  return null
}

export async function listCertificatesByWorkshop(workshopSlug: string): Promise<Certificate[]> {
  await ensureTable()
  const client = getTable()
  const safe = workshopSlug.replace(/'/g, "''")
  const iter = client.listEntities({ queryOptions: { filter: `PartitionKey eq '${safe}'` } })
  const out: Certificate[] = []
  for await (const entity of iter) {
    out.push({
      certId: entity.rowKey as string,
      recipientName: (entity.recipientName as string) || '',
      recipientEmail: (entity.recipientEmail as string) || '',
      workshopSlug: (entity.workshopSlug as string) || (entity.partitionKey as string) || '',
      workshopTitle: (entity.workshopTitle as string) || '',
      workshopSubtitle: (entity.workshopSubtitle as string) || '',
      workshopDate: (entity.workshopDate as string) || '',
      issueDate: (entity.issueDate as string) || '',
      durationMinutes: Number(entity.durationMinutes) || 0,
      trainerName: (entity.trainerName as string) || '',
      issuerName: (entity.issuerName as string) || 'Gennoor Tech',
      issuerDomain: (entity.issuerDomain as string) || 'gennoor.com',
      pdfBlobPath: (entity.pdfBlobPath as string) || '',
      verifyUrl: (entity.verifyUrl as string) || '',
      status: (entity.status as 'issued' | 'revoked') || 'issued',
      createdAt: (entity.createdAt as string) || '',
    })
  }
  return out
}

export async function uploadCertificatePdf(certId: string, pdfBuffer: Buffer): Promise<string> {
  const conn = getConnectionString()
  const blobService = BlobServiceClient.fromConnectionString(conn)
  const container = blobService.getContainerClient(BLOB_CONTAINER)
  try {
    await container.createIfNotExists()
  } catch {
    // already exists or no permission to create — that's fine
  }
  const blobPath = `${BLOB_PREFIX}/${certId}.pdf`
  const blob = container.getBlockBlobClient(blobPath)
  await blob.uploadData(pdfBuffer, {
    blobHTTPHeaders: {
      blobContentType: 'application/pdf',
      blobContentDisposition: `inline; filename="${certId}.pdf"`,
      blobCacheControl: 'public, max-age=31536000, immutable',
    },
  })
  return blobPath
}

export async function downloadCertificatePdf(blobPath: string): Promise<Buffer | null> {
  const conn = getConnectionString()
  const blobService = BlobServiceClient.fromConnectionString(conn)
  const container = blobService.getContainerClient(BLOB_CONTAINER)
  const blob = container.getBlobClient(blobPath)
  try {
    const dl = await blob.download(0)
    if (!dl.readableStreamBody) return null
    const chunks: Buffer[] = []
    for await (const chunk of dl.readableStreamBody) {
      chunks.push(Buffer.from(chunk))
    }
    return Buffer.concat(chunks)
  } catch (err: unknown) {
    if (
      err instanceof RestError &&
      (err.statusCode === 404 || (err.details as { errorCode?: string } | undefined)?.errorCode === 'BlobNotFound')
    ) {
      return null
    }
    throw err
  }
}

const SITE_ORIGIN = process.env.SITE_ORIGIN || 'https://gennoor.com'

export function buildVerifyUrl(certId: string): string {
  return `${SITE_ORIGIN}/verify/${certId}`
}

export function buildPdfDownloadUrl(certId: string): string {
  return `${SITE_ORIGIN}/api/certificates/${certId}/pdf`
}

export function buildLinkedInAddToProfileUrl(cert: Pick<Certificate, 'certId' | 'workshopTitle' | 'workshopDate'>): string {
  const linkedInOrgId = process.env.LINKEDIN_ORG_ID
  const issuedAt = new Date(cert.workshopDate)
  const issueYear = issuedAt.getUTCFullYear()
  const issueMonth = issuedAt.getUTCMonth() + 1
  const params = new URLSearchParams()
  params.set('startTask', 'CERTIFICATION_NAME')
  params.set('name', cert.workshopTitle)
  if (linkedInOrgId) {
    params.set('organizationId', linkedInOrgId)
  } else {
    params.set('organizationName', 'Gennoor Tech')
  }
  params.set('issueYear', String(issueYear))
  params.set('issueMonth', String(issueMonth))
  params.set('certUrl', buildVerifyUrl(cert.certId))
  params.set('certId', cert.certId)
  return `https://www.linkedin.com/profile/add?${params.toString()}`
}

export function buildLinkedInShareUrl(cert: Pick<Certificate, 'certId' | 'workshopTitle'>): string {
  const params = new URLSearchParams()
  params.set('url', buildVerifyUrl(cert.certId))
  return `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`
}
