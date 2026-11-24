#!/usr/bin/env node
/*
 * Upload the HR Intelligence film (the proof-of-concept page, /automation/hr-intelligence) to the
 * `media` blob container, served through the /media/[...path] proxy with range support.
 * The poster and the captions are small and live in public/videos.
 *
 *   node scripts/upload-hr-film.mjs [path-to-film.mp4]
 */
import { config } from 'dotenv'
import { BlobServiceClient } from '@azure/storage-blob'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
config({ path: path.join(PROJECT_ROOT, '.env.local') })

const STORAGE_CONN = process.env.AZURE_STORAGE_CONNECTION_STRING
if (!STORAGE_CONN) {
  console.error('Missing AZURE_STORAGE_CONNECTION_STRING')
  process.exit(1)
}

const local = process.argv[2] ?? path.join(process.env.USERPROFILE || '', 'Downloads', 'HR-PROJECT', 'HR Intelligence use case film', 'HR Intelligence - use case film (wide 16x9).mp4')
const blob = 'videos/hr-intelligence-film.mp4'

const container = BlobServiceClient.fromConnectionString(STORAGE_CONN).getContainerClient('media')
await container.createIfNotExists()
const body = await readFile(local)
await container.getBlockBlobClient(blob).uploadData(body, { blobHTTPHeaders: { blobContentType: 'video/mp4', blobCacheControl: 'public, max-age=86400' } })
console.log(`  ✓ ${blob} · ${(body.length / 1024 / 1024).toFixed(1)} MB`)
