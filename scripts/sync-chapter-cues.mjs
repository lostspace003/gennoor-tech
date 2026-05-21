#!/usr/bin/env node
/*
 * Sync a chapter HTML's embedded `var cues = [...]` array with the real
 * timestamps from the corresponding cues.json (produced by
 * generate-chapter-audio.mjs).
 *
 * Usage:
 *   node scripts/sync-chapter-cues.mjs <courseSlug> <chapterId> <chapterHtmlFilename>
 *
 * Example:
 *   node scripts/sync-chapter-cues.mjs prompting-mastery chapter-01 chapter-01-prompting-principles.html
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')

const [, , courseSlug, chapterId, htmlFilename] = process.argv
if (!courseSlug || !chapterId || !htmlFilename) {
  console.error('Usage: node scripts/sync-chapter-cues.mjs <courseSlug> <chapterId> <chapterHtmlFilename>')
  process.exit(1)
}

const cuesPath = path.join(PROJECT_ROOT, 'tmp', 'academy-build', courseSlug, 'audio', chapterId, 'cues.json')
const htmlPath = path.join(PROJECT_ROOT, 'tmp', 'academy-build', courseSlug, 'chapters', htmlFilename)

const cuesDoc = JSON.parse(fs.readFileSync(cuesPath, 'utf8'))

const lines = cuesDoc.cues.map((c) => {
  const at = c.at.toFixed(2).padStart(7, ' ')
  return c.step === undefined
    ? `    { at: ${at}, slide: ${c.slide} }`
    : `    { at: ${at}, slide: ${c.slide}, step: ${c.step} }`
})
const newBlock = 'var cues = [\n' + lines.join(',\n') + '\n  ];'

let html = fs.readFileSync(htmlPath, 'utf8')
const re = /var cues = \[[\s\S]*?\];/
if (!re.test(html)) {
  console.error('No `var cues = [...]` array found in', htmlPath)
  process.exit(1)
}
html = html.replace(re, newBlock)
fs.writeFileSync(htmlPath, html, 'utf8')
console.log(`✓ ${htmlFilename} synced · ${cuesDoc.cues.length} cues · ${cuesDoc.expectedDurationDisplay}`)
