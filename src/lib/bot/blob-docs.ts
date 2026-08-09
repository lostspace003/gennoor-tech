import crypto from 'crypto'
import { BlobServiceClient } from '@azure/storage-blob'
import type { SiteChunk } from './store'

/**
 * Documents held in blob storage — course PDFs, bootcamp brochures, course
 * tables of contents — turned into indexable chunks for the site bot.
 *
 * These are the files a visitor is actually asking about when they say "send
 * me the course outline" or "what's in the agentic AI bootcamp?". The rendered
 * pages link to them but never contain their text, so without this pass the
 * bot can point at a PDF it cannot read.
 *
 * SAFETY — this reads a storage account that also holds private material, so
 * the allowlist is explicit and there is a second, independent block on
 * anything that looks like a certificate:
 *   - `certificates/` holds issued learner certificates (names, credential
 *     ids). Never indexed. The bot must never surface someone's certificate.
 *   - crm-data, crm-documents, email-attachments, sql-backup are not listed
 *     and must never be added — they are lead and client material.
 */

const CONNECTION = () => process.env.AZURE_STORAGE_CONNECTION_STRING || ''

/** Public marketing/course material only. Anything not listed is not read. */
const SOURCES: Array<{ container: string; prefix: string; label: string; url: string }> = [
  { container: 'website-content', prefix: 'courses-pdfs/', label: 'Course PDF', url: '/services/training/curriculum' },
  { container: 'course-brochures', prefix: 'bootcamp-brochures/', label: 'Bootcamp brochure', url: '/services/training' },
  { container: 'course-brochures', prefix: 'course-tocs/', label: 'Course outline', url: '/services/training' },
  { container: 'website-content', prefix: 'Gennoor-Tech-Course-TOCs/', label: 'Course outline', url: '/services/training' },
  { container: 'website-content', prefix: 'Gennoor-Bootcamp-Brochures/', label: 'Bootcamp brochure', url: '/services/training' },
]

/** Belt and braces: never index anything whose path smells like a credential. */
const FORBIDDEN = /certificate|certificates\/|\bcert-|learner|invoice|receipt|contract/i

const MAX_BYTES = 12 * 1024 * 1024 // skip anything implausibly large for a brochure
const CHUNK_CHARS = 2800

const hash = (s: string) => crypto.createHash('sha1').update(s).digest('hex')

const prettyName = (blobName: string) =>
  (blobName.split('/').pop() || blobName)
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/^Gennoor-(Tech-)?/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

async function extractPdf(buffer: Buffer): Promise<string> {
  const pdfParse = (await import('pdf-parse')).default
  const parsed = await pdfParse(buffer)
  return parsed.text || ''
}

async function extractDocx(buffer: Buffer): Promise<string> {
  const mammoth = (await import('mammoth')).default
  return (await mammoth.extractRawText({ buffer })).value || ''
}

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

export interface BlobDocResult {
  chunks: SiteChunk[]
  documents: number
  skipped: number
  errors: string[]
}

/**
 * Read the allowlisted documents and chunk them.
 *
 * `includeHtml` pulls the academy chapter HTML too (~500 files). It is off by
 * default: the chapter titles and objectives are already indexed from the repo,
 * and pulling every slide multiplies the first index run for modest gain.
 */
export async function blobDocumentChunks(opts?: { includeHtml?: boolean; limit?: number }): Promise<BlobDocResult> {
  const conn = CONNECTION()
  if (!conn) return { chunks: [], documents: 0, skipped: 0, errors: ['AZURE_STORAGE_CONNECTION_STRING not set'] }

  const service = BlobServiceClient.fromConnectionString(conn)
  const chunks: SiteChunk[] = []
  const errors: string[] = []
  // The same brochure exists in two containers — index each document once.
  const seenDocs = new Set<string>()
  let documents = 0
  let skipped = 0

  for (const source of SOURCES) {
    let container
    try {
      container = service.getContainerClient(source.container)
      if (!(await container.exists())) continue
    } catch (error: any) {
      errors.push(`${source.container}: ${error.message}`)
      continue
    }

    for await (const blob of container.listBlobsFlat({ prefix: source.prefix })) {
      if (opts?.limit && documents >= opts.limit) break
      const name = blob.name
      const ext = (name.split('.').pop() || '').toLowerCase()

      if (FORBIDDEN.test(name)) { skipped++; continue }
      const allowed = opts?.includeHtml ? ['pdf', 'docx', 'html'] : ['pdf', 'docx']
      if (!allowed.includes(ext)) { skipped++; continue }
      const size = blob.properties.contentLength || 0
      if (size === 0 || size > MAX_BYTES) { skipped++; continue }

      const docKey = `${prettyName(name).toLowerCase()}|${ext}`
      if (seenDocs.has(docKey)) { skipped++; continue }
      seenDocs.add(docKey)

      try {
        const buffer = await container.getBlockBlobClient(name).downloadToBuffer()
        let text = ''
        if (ext === 'pdf') text = await extractPdf(buffer)
        else if (ext === 'docx') text = await extractDocx(buffer)
        else text = htmlToText(buffer.toString('utf-8'))

        text = text.replace(/\s+/g, ' ').trim()
        // Scanned/image-only PDFs come back near-empty — honest skip, no
        // point embedding a page number and a footer.
        if (text.length < 300) { skipped++; continue }

        const title = `${prettyName(name)} — ${source.label}`
        const docHash = hash(`${source.container}/${name}|${text.length}`)
        documents++
        for (let i = 0, n = 0; i < text.length && n < 14; i += CHUNK_CHARS - 250, n++) {
          const piece = text.slice(i, i + CHUNK_CHARS)
          if (piece.trim().length < 120) break
          chunks.push({
            id: hash(`${source.container}/${name}|${n}|${piece}`),
            url: source.url,
            title: n === 0 ? title : `${title} (part ${n + 1})`,
            text: piece,
            hash: docHash,
          })
        }
      } catch (error: any) {
        errors.push(`${name}: ${String(error.message).slice(0, 120)}`)
      }
    }
  }

  return { chunks, documents, skipped, errors: errors.slice(0, 20) }
}
