/**
 * Generate brochure PDFs for academy courses.
 *
 * Usage:
 *   npx tsx scripts/build-academy-pdfs.ts              # all courses
 *   npx tsx scripts/build-academy-pdfs.ts <courseId>   # one course only
 *
 * Reads course config from src/config/courses.ts. Writes PDFs to
 * public/Gennoor-Academy-Course-PDFs/ for local previewing, then uploads
 * each to Azure Blob Storage under courses-pdfs/<id>.pdf — the website
 * serves them from blob via /api/content/courses-pdfs/<id>.pdf.
 *
 * Per project convention: content lives in blob, NOT public/. The local
 * public/ output is .gitignored and exists only for the build step.
 */
import path from 'node:path'
import fs from 'node:fs'
import dotenv from 'dotenv'
import { BlobServiceClient } from '@azure/storage-blob'
// @ts-expect-error — sibling ESM script, no .d.ts
import { buildCoursePdf } from './build-course-pdf.mjs'
import { courses } from '../src/config/courses'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const STORAGE_CONN = process.env.AZURE_STORAGE_CONNECTION_STRING
const CONTAINER = 'website-content'
const BLOB_PREFIX = 'courses-pdfs'

const arg = process.argv[2]
const targets = arg ? courses.filter(c => c.id === arg) : courses

if (targets.length === 0) {
  console.error(`No course found matching "${arg}"`)
  process.exit(1)
}

console.log(`→ Generating PDFs for ${targets.length} academy ${targets.length === 1 ? 'course' : 'courses'}\n`)

const OUT_DIR = path.resolve(process.cwd(), 'public', 'Gennoor-Academy-Course-PDFs')

async function main() {
  const blobContainer = STORAGE_CONN
    ? BlobServiceClient.fromConnectionString(STORAGE_CONN).getContainerClient(CONTAINER)
    : null
  if (blobContainer) await blobContainer.createIfNotExists()

  for (const course of targets) {
    const outPath = path.join(OUT_DIR, `${course.id}.pdf`)
    try {
      await buildCoursePdf(course, outPath)
      const stats = fs.statSync(outPath)
      console.log(`  ✓ ${course.id}.pdf (${(stats.size / 1024).toFixed(1)} KB) — ${course.title}`)
      if (blobContainer) {
        const body = fs.readFileSync(outPath)
        const blob = blobContainer.getBlockBlobClient(`${BLOB_PREFIX}/${course.id}.pdf`)
        await blob.uploadData(body, { blobHTTPHeaders: { blobContentType: 'application/pdf' } })
        console.log(`     ↑ uploaded to blob: ${BLOB_PREFIX}/${course.id}.pdf`)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`  ✗ ${course.id} — ${msg}`)
    }
  }
  console.log(`\n✓ Done. Local: ${path.relative(process.cwd(), OUT_DIR)}/  ·  Blob: /api/content/${BLOB_PREFIX}/<id>.pdf`)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
