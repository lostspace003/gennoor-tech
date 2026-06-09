#!/usr/bin/env node
/*
 * One-time font sweep: align every academy deck HTML on blob with the
 * website's type system — Inter for body text, Sora for headings.
 *
 * Handles all three deck generations found on blob:
 *   1. Template decks (build-chapter-html.mjs) — body already Inter;
 *      headings used 'Plus Jakarta Sans' → swapped to 'Sora' (CSS + the
 *      Google Fonts URL).
 *   2. AB-100 decks — 'Segoe UI' body → Inter; Sora heading rule + Google
 *      Fonts link injected.
 *   3. Intro screens (chapter-00-welcome.html) — system-ui stack → Inter
 *      first; Sora heading rule + fonts link injected.
 *
 * Idempotent: files already mentioning Sora are skipped.
 *
 * Usage: node scripts/sweep-deck-fonts.mjs [--dry-run]
 */

import { config } from 'dotenv'
import { BlobServiceClient } from '@azure/storage-blob'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')
config({ path: path.join(PROJECT_ROOT, '.env.local') })

const CONN = process.env.AZURE_STORAGE_CONNECTION_STRING
if (!CONN) { console.error('Missing AZURE_STORAGE_CONNECTION_STRING'); process.exit(1) }

const DRY = process.argv.includes('--dry-run')
const CONTAINER = 'website-content'

const FONTS_LINK = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@500;600;700;800&display=swap" rel="stylesheet">`
const HEADING_RULE = `<style>/* site-font alignment */h1,h2,h3,h4,h5,h6{font-family:'Sora','Inter',sans-serif}</style>`

function transform(html) {
  if (html.includes('Sora')) return null // already swept

  let out = html
  let touched = false

  // 1. Template decks: Google Fonts URL + CSS family name.
  if (out.includes('Plus+Jakarta+Sans') || out.includes('Plus Jakarta Sans')) {
    out = out.replace(/Plus\+Jakarta\+Sans/g, 'Sora')
    out = out.replace(/(['"])Plus Jakarta Sans\1/g, "$1Sora$1")
    touched = true
    return touched ? out : null
  }

  // 2. AB-100 decks: Segoe UI body stacks → Inter.
  if (out.includes("font-family:'Segoe UI'")) {
    out = out.replace(
      /font-family:'Segoe UI',-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif/g,
      "font-family:'Inter',-apple-system,'Segoe UI',Arial,sans-serif",
    )
    out = out.replace(/font-family:'Segoe UI',sans-serif/g, "font-family:'Inter',sans-serif")
    touched = true
  }

  // 3. Intro screens: system-ui stack → Inter-first.
  if (/font-family:\s*ui-sans-serif,\s*system-ui/.test(out)) {
    out = out.replace(
      /font-family:\s*ui-sans-serif,\s*system-ui/g,
      "font-family: 'Inter', ui-sans-serif, system-ui",
    )
    touched = true
  }

  if (!touched) return null

  // Decks in groups 2/3 have no Google Fonts link and no heading font —
  // inject both so Inter/Sora actually load.
  if (!out.includes('fonts.googleapis.com')) {
    out = out.replace(/<head([^>]*)>/i, `<head$1>${FONTS_LINK}`)
  }
  out = out.includes('</head>')
    ? out.replace('</head>', `${HEADING_RULE}</head>`)
    : out

  return out
}

const service = BlobServiceClient.fromConnectionString(CONN)
const container = service.getContainerClient(CONTAINER)

let scanned = 0, updated = 0, skipped = 0
const untouchedFiles = []

for await (const blob of container.listBlobsFlat({ prefix: 'courses/' })) {
  if (!blob.name.endsWith('.html')) continue
  scanned++
  const client = container.getBlockBlobClient(blob.name)
  const html = (await client.downloadToBuffer()).toString('utf8')
  const next = transform(html)
  if (next === null) {
    skipped++
    if (!html.includes('Sora')) untouchedFiles.push(blob.name)
    continue
  }
  if (!DRY) {
    await client.upload(next, Buffer.byteLength(next), {
      blobHTTPHeaders: { blobContentType: 'text/html; charset=utf-8' },
    })
  }
  updated++
  if (updated % 50 === 0) console.log(`  …${updated} updated`)
}

console.log(`\n${DRY ? '[dry run] ' : ''}scanned ${scanned} · updated ${updated} · skipped ${skipped}`)
if (untouchedFiles.length) {
  console.log('\nFiles with no recognised font pattern (review manually):')
  untouchedFiles.forEach(f => console.log('  - ' + f))
}
