#!/usr/bin/env node
/*
 * Puts the tall films (1080 x 1920, for Instagram, LinkedIn and phones) in the website's
 * media store, where anyone can reach them as
 *
 *   https://www.gennoor.com/media/videos/gennoor-ai-weekend-reel.mp4
 *   https://www.gennoor.com/media/videos/gennoor-what-we-do-reel.mp4
 *
 * They are too large for the repository, so they are not in public/videos like the wide
 * films. Run it after `python scripts/show/mix.py <film>-reel`:
 *
 *   node scripts/show/upload-reels.mjs
 *
 * Needs AZURE_STORAGE_CONNECTION_STRING in .env.local. A film that is already there is replaced.
 */
import { config } from 'dotenv'
import { BlobServiceClient } from '@azure/storage-blob'
import { existsSync, readdirSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
config({ path: path.join(HERE, '..', '..', '.env.local') })

const conn = process.env.AZURE_STORAGE_CONNECTION_STRING
if (!conn) {
  console.error('AZURE_STORAGE_CONNECTION_STRING is not set in .env.local')
  process.exit(1)
}
const dir = path.join(HERE, '.work', 'reels')
const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('-reel.mp4')) : []
if (!files.length) {
  console.error(`Nothing to upload: ${dir} has no tall film. Run mix.py first.`)
  process.exit(1)
}

const container = BlobServiceClient.fromConnectionString(conn).getContainerClient('media')
await container.createIfNotExists()
for (const f of files) {
  const body = await readFile(path.join(dir, f))
  // A day in the browser's cache: the name stays the same when a film is made again
  await container.getBlockBlobClient(`videos/${f}`).uploadData(body, { blobHTTPHeaders: { blobContentType: 'video/mp4', blobCacheControl: 'public, max-age=86400' } })
  console.log(`uploaded videos/${f}  ${(body.length / 1024 / 1024).toFixed(1)} MB  ->  /media/videos/${f}`)
}
