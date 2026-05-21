#!/usr/bin/env node
/*
 * Upload chapter assets (HTML + MP3 + cues.json) to Azure Blob Storage so
 * they're served through /api/content/ proxy. Per the project's standing
 * convention: content lives in blob, never in /public/.
 *
 * Usage:
 *   node scripts/upload-chapter-assets.mjs <courseSlug>
 *   node scripts/upload-chapter-assets.mjs <courseSlug> <chapterId>
 *
 * Iterates everything under tmp/academy-build/<slug>/ — chapters/*.html and
 * audio/chapter-NN/(chapter-NN.mp3 | cues.json). Skips intermediate
 * chapter-NN-part-NN.mp3 files (they're for debugging only).
 */

import { config } from 'dotenv'
import { BlobServiceClient } from '@azure/storage-blob'
import { readFile, readdir, stat } from 'node:fs/promises'
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

const args = process.argv.slice(2)
const courseSlug = args[0]
const chapterId = args[1] // optional

if (!courseSlug) {
  console.error('Usage: node scripts/upload-chapter-assets.mjs <courseSlug> [chapterId]')
  process.exit(1)
}

const stagingDir = path.join(PROJECT_ROOT, 'tmp', 'academy-build', courseSlug)

const service = BlobServiceClient.fromConnectionString(STORAGE_CONN)
const container = service.getContainerClient(CONTAINER)
await container.createIfNotExists()

async function uploadFile(localPath, blobPath, contentType) {
  const body = await readFile(localPath)
  const blob = container.getBlockBlobClient(blobPath)
  await blob.uploadData(body, {
    blobHTTPHeaders: { blobContentType: contentType },
  })
  const sizeKB = (body.length / 1024).toFixed(1)
  console.log(`  ✓ ${blobPath} (${sizeKB} KB)`)
}

console.log(`\n→ Uploading chapter assets for ${courseSlug}${chapterId ? ' · ' + chapterId : ''}`)
console.log(`  staging:   ${path.relative(PROJECT_ROOT, stagingDir)}`)
console.log(`  container: ${CONTAINER}\n`)

// 1. Upload chapter HTMLs
const chaptersDir = path.join(stagingDir, 'chapters')
try {
  const files = await readdir(chaptersDir)
  console.log('HTML files:')
  for (const f of files) {
    if (!f.endsWith('.html')) continue
    if (chapterId && !f.startsWith(chapterId + '-')) continue
    const localPath = path.join(chaptersDir, f)
    const blobPath = `courses/${courseSlug}/chapters/${f}`
    await uploadFile(localPath, blobPath, 'text/html; charset=utf-8')
  }
} catch (e) {
  if (e.code !== 'ENOENT') throw e
  console.log('  (no chapters/ dir found)')
}

// 2. Upload audio MP3s + cues.json per chapter
const audioRoot = path.join(stagingDir, 'audio')
try {
  const chapterDirs = await readdir(audioRoot)
  console.log('\nAudio files:')
  for (const cd of chapterDirs) {
    if (chapterId && cd !== chapterId) continue
    const chapterAudioDir = path.join(audioRoot, cd)
    const s = await stat(chapterAudioDir)
    if (!s.isDirectory()) continue
    const files = await readdir(chapterAudioDir)
    for (const f of files) {
      const localPath = path.join(chapterAudioDir, f)
      // Skip intermediate part files (chapter-NN-part-NN.mp3)
      if (/-part-\d+\.mp3$/.test(f)) continue
      // Skip SSML reference files
      if (f.endsWith('.ssml.xml')) continue
      let contentType
      if (f.endsWith('.mp3')) contentType = 'audio/mpeg'
      else if (f.endsWith('.json')) contentType = 'application/json; charset=utf-8'
      else continue
      const blobPath = `courses/${courseSlug}/audio/${cd}/${f}`
      await uploadFile(localPath, blobPath, contentType)
    }
  }
} catch (e) {
  if (e.code !== 'ENOENT') throw e
  console.log('  (no audio/ dir found)')
}

console.log('\n✓ Upload complete.\n')
