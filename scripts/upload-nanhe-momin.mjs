#!/usr/bin/env node
/*
 * Upload the Nanhe Momin Episode 1 video to the `media` blob container,
 * served publicly through the /media/[...path] proxy with range support.
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
const CONTAINER = 'media'

if (!STORAGE_CONN) {
  console.error('Missing AZURE_STORAGE_CONNECTION_STRING')
  process.exit(1)
}

const UPLOADS = [
  {
    local: path.join(PROJECT_ROOT, 'showcase', 'nanhe-momin', 'assets', 'nanhe-momin-ep01.mp4'),
    blob: 'videos/nanhe-momin-ep01.mp4',
    type: 'video/mp4',
  },
]

const service = BlobServiceClient.fromConnectionString(STORAGE_CONN)
const container = service.getContainerClient(CONTAINER)
await container.createIfNotExists()

for (const { local, blob, type } of UPLOADS) {
  const body = await readFile(local)
  const client = container.getBlockBlobClient(blob)
  await client.uploadData(body, { blobHTTPHeaders: { blobContentType: type } })
  console.log(`  ✓ ${blob} · ${(body.length / 1024 / 1024).toFixed(1)} MB`)
}

console.log('\n✓ Done.')
