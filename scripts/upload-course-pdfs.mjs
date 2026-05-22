#!/usr/bin/env node
/*
 * Upload all academy-course PDF brochures from public/Gennoor-Academy-Course-PDFs/
 * to Azure Blob Storage under courses-pdfs/. The website then references them
 * via /api/content/courses-pdfs/<id>.pdf, not the public/ static path.
 *
 * Per project convention: content lives in blob, NOT in public/.
 *
 * Usage:
 *   node scripts/upload-course-pdfs.mjs           # upload all
 *   node scripts/upload-course-pdfs.mjs <courseId> # upload one
 */
import { config } from 'dotenv'
import { BlobServiceClient } from '@azure/storage-blob'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')

config({ path: path.join(PROJECT_ROOT, '.env.local') })

const STORAGE_CONN = process.env.AZURE_STORAGE_CONNECTION_STRING
const CONTAINER = 'website-content'
const BLOB_PREFIX = 'courses-pdfs'
const LOCAL_DIR = path.join(PROJECT_ROOT, 'public', 'Gennoor-Academy-Course-PDFs')

if (!STORAGE_CONN) {
  console.error('Missing AZURE_STORAGE_CONNECTION_STRING')
  process.exit(1)
}

const filter = process.argv[2] // optional courseId

const service = BlobServiceClient.fromConnectionString(STORAGE_CONN)
const container = service.getContainerClient(CONTAINER)
await container.createIfNotExists()

const all = await readdir(LOCAL_DIR)
const pdfs = all.filter(f => f.endsWith('.pdf')).filter(f => !filter || f === `${filter}.pdf`)

console.log(`\n→ Uploading ${pdfs.length} PDF${pdfs.length === 1 ? '' : 's'} to blob (courses-pdfs/)`)

for (const fname of pdfs) {
  const localPath = path.join(LOCAL_DIR, fname)
  const blobPath = `${BLOB_PREFIX}/${fname}`
  const body = await readFile(localPath)
  const blob = container.getBlockBlobClient(blobPath)
  await blob.uploadData(body, {
    blobHTTPHeaders: { blobContentType: 'application/pdf' },
  })
  console.log(`  ✓ ${blobPath} (${(body.length / 1024).toFixed(1)} KB)`)
}

console.log(`\n✓ Done. PDFs accessible at /api/content/${BLOB_PREFIX}/<id>.pdf`)
