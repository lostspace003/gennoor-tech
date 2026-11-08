#!/usr/bin/env node
/*
 * Upload the rendered Claude certification flow animations (MP4 for the pages, JPG poster) from claude-thing/flows/out/ to the `media` blob container under cert-flows/.
 * Served through /media/cert-flows/<id>.<ext> (the /media proxy supports range requests).
 *
 *   node scripts/upload-cert-flows.mjs            # upload files newer than their blob (or missing)
 *   node scripts/upload-cert-flows.mjs --force    # upload everything
 */
import { config } from 'dotenv'
import { BlobServiceClient } from '@azure/storage-blob'
import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')
config({ path: path.join(PROJECT_ROOT, '.env.local') })

const STORAGE_CONN = process.env.AZURE_STORAGE_CONNECTION_STRING
if (!STORAGE_CONN) { console.error('Missing AZURE_STORAGE_CONNECTION_STRING'); process.exit(1) }
const OUT = path.join(PROJECT_ROOT, 'claude-thing', 'flows', 'out')
// GIFs stay local (owner's own sharing); they are never published
const TYPES = { '.mp4': 'video/mp4', '.jpg': 'image/jpeg' }
const force = process.argv.includes('--force')

const container = BlobServiceClient.fromConnectionString(STORAGE_CONN).getContainerClient('media')
await container.createIfNotExists()

const files = (await readdir(OUT)).filter(f => TYPES[path.extname(f)])
let uploaded = 0, skipped = 0, bytes = 0
for (const f of files) {
  const local = path.join(OUT, f)
  const blob = container.getBlockBlobClient('cert-flows/' + f)
  const st = await stat(local)
  if (!force) {
    try {
      const props = await blob.getProperties()
      if (props.contentLength === st.size && props.lastModified >= st.mtime) { skipped++; continue }
    } catch { /* missing: upload */ }
  }
  const body = await readFile(local)
  await blob.uploadData(body, { blobHTTPHeaders: { blobContentType: TYPES[path.extname(f)], blobCacheControl: 'public, max-age=31536000, immutable' } })
  uploaded++; bytes += body.length
  console.log(`  ✓ cert-flows/${f} · ${(body.length / 1024).toFixed(0)} KB`)
}
console.log(`\n✓ ${uploaded} uploaded (${(bytes / 1024 / 1024).toFixed(1)} MB), ${skipped} unchanged.`)
