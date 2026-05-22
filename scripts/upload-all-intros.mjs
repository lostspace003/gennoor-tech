#!/usr/bin/env node
/*
 * Upload chapter-00-welcome.html for all 19 courses in a single batch.
 * (AB-100 already has chapter-00-introduction.html — skipped.)
 */
import { config } from 'dotenv'
import { BlobServiceClient } from '@azure/storage-blob'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')

config({ path: path.join(PROJECT_ROOT, '.env.local') })

const STORAGE_CONN = process.env.AZURE_STORAGE_CONNECTION_STRING
const CONTAINER = 'website-content'

if (!STORAGE_CONN) {
  console.error('Missing AZURE_STORAGE_CONNECTION_STRING')
  process.exit(1)
}

const SLUGS = [
  'ai-foundations',
  'ai-strategy-c-suite',
  'ai-governance-risk-boards',
  'ai-for-finance-accounting',
  'ai-in-financial-services',
  'generative-ai-for-business',
  'ai-for-hr-people-teams',
  'ai-in-healthcare',
  'm365-copilot-adoption',
  'ai-for-sales-marketing',
  'ai-for-customer-service-support',
  'ai-for-supply-chain-logistics',
  'ai-for-manufacturing',
  'ai-for-energy-utilities',
  'ai-for-retail-ecommerce',
  'ai-readiness-assessment-deep-dive',
  'ai-program-management-pmo',
  'ai-talent-strategy',
  'enterprise-data-foundations-for-ai',
]

const service = BlobServiceClient.fromConnectionString(STORAGE_CONN)
const container = service.getContainerClient(CONTAINER)
await container.createIfNotExists()

console.log(`→ Uploading chapter-00 intro for ${SLUGS.length} courses`)

for (const slug of SLUGS) {
  const localPath = path.join(PROJECT_ROOT, 'tmp', 'academy-build', slug, 'chapters', 'chapter-00-welcome.html')
  const blobPath = `courses/${slug}/chapters/chapter-00-welcome.html`
  try {
    const body = await readFile(localPath)
    const blob = container.getBlockBlobClient(blobPath)
    await blob.uploadData(body, { blobHTTPHeaders: { blobContentType: 'text/html; charset=utf-8' } })
    console.log(`  ✓ ${slug} · ${(body.length / 1024).toFixed(1)} KB`)
  } catch (err) {
    console.error(`  ✗ ${slug} — ${err.message}`)
  }
}

console.log('\n✓ Done.')
