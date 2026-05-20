/*
 * Build branded course PDFs and upload to Azure blob storage.
 *
 * Per the plan in docs/transformation/05-courses-plan.md, each course gets a
 * ~6–10 page branded PDF that lives under courses/pdfs/<slug>.pdf in the
 * website-content container and is served via the /api/content/ proxy.
 *
 * Usage:
 *   node --experimental-strip-types scripts/build-course-pdfs.ts <slug>
 *   node --experimental-strip-types scripts/build-course-pdfs.ts all
 *
 * Examples:
 *   node --experimental-strip-types scripts/build-course-pdfs.ts claude-code-for-developers
 *   node --experimental-strip-types scripts/build-course-pdfs.ts ai-for-finance-accounting
 *   node --experimental-strip-types scripts/build-course-pdfs.ts all
 */

import { config } from 'dotenv'
import { BlobServiceClient } from '@azure/storage-blob'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { mkdir, writeFile } from 'node:fs/promises'

import { allCoursePdfs, getCoursePdfBySlug } from '../src/data/course-pdfs.ts'
import { generateCoursePdf } from '../src/lib/course-pdf-generator.ts'
import type { CoursePdf } from '../src/data/course-pdfs.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')

config({ path: path.join(PROJECT_ROOT, '.env.local') })

const STORAGE_CONN = process.env.AZURE_STORAGE_CONNECTION_STRING
const CONTAINER = 'website-content'
const BLOB_PREFIX = 'courses/pdfs'

if (!STORAGE_CONN) {
  console.error('Missing AZURE_STORAGE_CONNECTION_STRING')
  process.exit(1)
}

async function uploadPdf(slug: string, buffer: Buffer): Promise<string> {
  const service = BlobServiceClient.fromConnectionString(STORAGE_CONN!)
  const container = service.getContainerClient(CONTAINER)
  const blobPath = `${BLOB_PREFIX}/${slug}.pdf`
  const blob = container.getBlockBlobClient(blobPath)
  await blob.uploadData(buffer, {
    blobHTTPHeaders: {
      blobContentType: 'application/pdf',
      blobContentDisposition: `inline; filename="${slug}.pdf"`,
      blobCacheControl: 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
  return blobPath
}

async function buildOne(course: CoursePdf): Promise<void> {
  process.stdout.write(`→ ${course.slug.padEnd(40)} `)
  const start = Date.now()
  try {
    const buf = await generateCoursePdf(course)
    const localOutDir = path.join(PROJECT_ROOT, 'tmp', 'course-pdfs')
    await mkdir(localOutDir, { recursive: true })
    const localPath = path.join(localOutDir, `${course.slug}.pdf`)
    await writeFile(localPath, buf)

    const blobPath = await uploadPdf(course.slug, buf)
    const ms = Date.now() - start
    const kb = (buf.length / 1024).toFixed(1)
    console.log(`✓ ${kb} KB · ${ms}ms · blob: ${blobPath}`)
  } catch (err) {
    console.log('✗ FAILED')
    console.error(`  ${(err as Error).message}`)
    throw err
  }
}

async function main() {
  const target = process.argv[2]
  if (!target) {
    console.error('Usage: node scripts/build-course-pdfs.ts <slug>|all')
    console.error('')
    console.error('Available slugs:')
    allCoursePdfs.forEach(c => console.error(`  ${c.slug}`))
    process.exit(1)
  }

  if (target === 'all') {
    console.log(`Building ${allCoursePdfs.length} course PDFs and uploading to blob`)
    console.log(`Public URL pattern: /api/content/${BLOB_PREFIX}/<slug>.pdf`)
    console.log('')
    for (const c of allCoursePdfs) {
      await buildOne(c)
    }
    console.log('')
    console.log('✓ All done.')
    return
  }

  const course = getCoursePdfBySlug(target)
  if (!course) {
    console.error(`Unknown course slug: ${target}`)
    console.error('Run with "all" to see all available slugs.')
    process.exit(1)
  }
  await buildOne(course)
  console.log(`\n  Public URL: /api/content/${BLOB_PREFIX}/${course.slug}.pdf`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
