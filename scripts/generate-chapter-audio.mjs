#!/usr/bin/env node
/*
 * Chapter-level MP3 generator (timestamp-fire pattern).
 *
 * Reads a chapter transcript from docs/academy/courses/<slug>/transcripts/<chapter>.md,
 * parses the embedded cue markers, generates ONE MP3 chunk per cue via Azure
 * Speech, concatenates, and emits a precisely-timed cues.json so slides sync
 * exactly with the audio.
 *
 * Slide-boundary silence: 3000ms tail of the last cue in a slide +
 *                         2000ms head before the first cue of the next slide
 *                         (= 5000ms total between slides).
 *
 * Output:
 *   tmp/academy-build/<slug>/audio/<chapter>/<chapter>.mp3
 *   tmp/academy-build/<slug>/audio/<chapter>/cues.json   (real timestamps)
 *
 * Usage:
 *   node scripts/generate-chapter-audio.mjs <courseSlug> <chapterId> [--voice <azureVoice>]
 */

import { config } from 'dotenv'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')

config({ path: path.join(PROJECT_ROOT, '.env.local') })

const SPEECH_KEY    = process.env.AZURE_SPEECH_ACADEMY_KEY
const SPEECH_REGION = process.env.AZURE_SPEECH_ACADEMY_REGION
const DEFAULT_VOICE = 'en-US-EmmaMultilingualNeural'

// Slide-boundary pacing — user-locked.
const SLIDE_TAIL_MS = 3000   // wait after slide ends
const SLIDE_HEAD_MS = 2000   // wait before next slide starts
// MP3 format we ask Azure Speech to emit: 48 kbps CBR mono → 6000 bytes/sec.
const MP3_BYTES_PER_SEC = 48000 / 8

// ─────────────────────────────────────────────────────────────────────
// CLI
// ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const positional = args.filter(a => !a.startsWith('--'))
const voiceArgIdx = args.findIndex(a => a === '--voice')
const voiceArg = voiceArgIdx >= 0 ? args[voiceArgIdx + 1] : undefined

if (positional.length < 2) {
  console.error('Usage: node scripts/generate-chapter-audio.mjs <courseSlug> <chapterId> [--voice <azureVoice>]')
  process.exit(1)
}

const [courseSlug, chapterId] = positional
const voice = voiceArg ?? DEFAULT_VOICE

if (!SPEECH_KEY || !SPEECH_REGION) {
  console.error('Missing AZURE_SPEECH_ACADEMY_KEY or AZURE_SPEECH_ACADEMY_REGION in .env.local')
  process.exit(1)
}

// ─────────────────────────────────────────────────────────────────────
// TRANSCRIPT → CUE-KEYED PARAGRAPH BUCKETS
// ─────────────────────────────────────────────────────────────────────

/**
 * Parses the transcript into an ordered list of cues. Each cue carries the
 * paragraphs spoken under it and any inline directives (e.g. hands-on pause).
 *
 * Cue marker shapes in the transcript:
 *   > [S1 ▸ slide active · t = 0.0]
 *   > [S2 ▸ slide change · t ≈ 1:10]
 *   > [S2 ▸ reveal 1 · "the red squiggle" · t ≈ 1:24]
 *   > [pause for hands-on …]              (special — injects extra silence)
 */
function parseCues(md) {
  const lines = md.split(/\r?\n/)

  // Window: from "## Transcript" to the next "---".
  let start = -1, end = -1
  for (let i = 0; i < lines.length; i++) {
    if (start < 0 && /^##\s+Transcript/i.test(lines[i])) { start = i + 1; continue }
    if (start >= 0 && /^---\s*$/.test(lines[i])) { end = i; break }
  }
  if (start < 0) throw new Error('Transcript file is missing a "## Transcript" section.')
  if (end < 0) end = lines.length

  const cues = []
  let current = null
  let buf = []

  const flushBuf = () => {
    if (buf.length === 0) return
    const text = cleanInline(buf.join(' '))
    if (text && current) current.paragraphs.push(text)
    buf = []
  }

  for (const raw of lines.slice(start, end)) {
    const line = raw.trim()
    if (line === '') { flushBuf(); continue }

    // Cue marker line — strict shape.
    const cueMatch = line.match(/^>\s*\[S(\d+)\s*▸\s*([^\]]+)\]/)
    if (cueMatch) {
      flushBuf()
      const slide = parseInt(cueMatch[1], 10)
      const detail = cueMatch[2].trim()
      const isStep = /reveal\s+(\d+)/i.exec(detail)
      current = {
        slide,
        step: isStep ? parseInt(isStep[1], 10) : undefined,
        paragraphs: [],
        extraSilenceMs: 0,
        label: detail,
      }
      cues.push(current)
      continue
    }

    // Special editor direction: hands-on pause.
    if (/^>\s*\[pause\s+for\s+hands-on/i.test(line) || /^>\s*\[pause\b/i.test(line)) {
      flushBuf()
      if (current) {
        const m = line.match(/(\d+)\s*seconds?/i)
        const secs = m ? parseInt(m[1], 10) : 8
        current.extraSilenceMs += secs * 1000
      }
      continue
    }

    // Any other blockquote line — non-spoken direction. Skip.
    if (/^>\s/.test(line)) { flushBuf(); continue }

    // Headings, horizontal rules, lone bracketed directives — skip.
    if (/^#{1,6}\s/.test(line)) { flushBuf(); continue }
    if (/^---+$/.test(line)) { flushBuf(); continue }
    if (/^\[[^\]]+\]$/.test(line)) { flushBuf(); continue }

    buf.push(line)
  }
  flushBuf()

  // Keep empty slide-start cues as navigation anchors (their timestamp will
  // equal the next non-empty cue's start). Drop only truly orphan empty cues
  // (e.g. step cues that ended up empty, which shouldn't normally happen).
  return cues.filter(c =>
    c.paragraphs.length > 0 ||
    c.extraSilenceMs > 0 ||
    c.step === undefined,   // empty slide-start = anchor, keep
  )
}

function cleanInline(p) {
  let out = p
  out = out.replace(/\[…\]/g, ', ')
  out = out.replace(/\[—\]/g, ' — ')
  out = out.replace(/\*\*([^*]+)\*\*/g, '$1')
  out = out.replace(/\*([^*]+)\*/g, '$1')
  out = out.replace(/_([^_]+)_/g, '$1')
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
  out = out.replace(/`([^`]+)`/g, '$1')
  out = out.replace(/\s+/g, ' ').trim()
  return out
}

// ─────────────────────────────────────────────────────────────────────
// SSML
// ─────────────────────────────────────────────────────────────────────

function escapeXml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function paceText(text) {
  let p = escapeXml(text)
  p = p.replace(/([.!?])\s+/g, '$1<break time="350ms"/> ')
  p = p.replace(/\s—\s/g, ' <break time="220ms"/>— <break time="120ms"/>')
  p = p.replace(/,\s+/g, ',<break time="120ms"/> ')
  return p
}

function composeCueSSML(cue, trailingBreakMs, voiceName) {
  const paragraphs = cue.paragraphs.map(paceText).join(' <break time="650ms"/> ')
  const extra = cue.extraSilenceMs > 0 ? `<break time="${cue.extraSilenceMs}ms"/>` : ''
  const trail = trailingBreakMs > 0 ? `<break time="${trailingBreakMs}ms"/>` : ''
  return `<speak version="1.0" xml:lang="en-US" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts">
<voice name="${voiceName}">
<prosody rate="-3%" pitch="+0Hz">
${paragraphs}${extra}${trail}
</prosody>
</voice>
</speak>`
}

// ─────────────────────────────────────────────────────────────────────
// AZURE SPEECH
// ─────────────────────────────────────────────────────────────────────

async function generateMp3(ssml) {
  const endpoint = `https://${SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': SPEECH_KEY,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
      'User-Agent': 'gennoor-academy-chapter-build',
    },
    body: ssml,
  })
  if (!res.ok) {
    const errText = await res.text().catch(() => '<no body>')
    throw new Error(`Azure Speech failed: ${res.status} — ${errText.slice(0, 400)}`)
  }
  return Buffer.from(await res.arrayBuffer())
}

async function generateWithRetry(ssml, label) {
  let lastErr
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      return await generateMp3(ssml)
    } catch (e) {
      lastErr = e
      console.log(`      ⚠ attempt ${attempt} failed for ${label}: ${e.message || e}. retrying…`)
      await new Promise(r => setTimeout(r, 1500 * attempt))
    }
  }
  throw lastErr ?? new Error('Speech synthesis failed after retries')
}

// ─────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────

const transcriptPath = path.join(
  PROJECT_ROOT, 'docs', 'academy', 'courses', courseSlug, 'transcripts', `${chapterId}.md`,
)
const outDir = path.join(PROJECT_ROOT, 'tmp', 'academy-build', courseSlug, 'audio', chapterId)
const outPath = path.join(outDir, `${chapterId}.mp3`)
const cuesOutPath = path.join(outDir, 'cues.json')

console.log(`\n→ Generating chapter MP3 + cues`)
console.log(`  course:     ${courseSlug}`)
console.log(`  chapter:    ${chapterId}`)
console.log(`  voice:      ${voice}`)
console.log(`  transcript: ${path.relative(PROJECT_ROOT, transcriptPath)}`)
console.log(`  output:     ${path.relative(PROJECT_ROOT, outPath)}`)
console.log(`  pacing:     ${SLIDE_TAIL_MS}ms tail + ${SLIDE_HEAD_MS}ms head between slides\n`)

const md = await readFile(transcriptPath, 'utf8')
const cues = parseCues(md)
console.log(`  → ${cues.length} cues parsed`)
const totalParagraphs = cues.reduce((s, c) => s + c.paragraphs.length, 0)
console.log(`  → ${totalParagraphs} spoken paragraphs in total\n`)

await mkdir(outDir, { recursive: true })

const partBuffers = []
const cueTimings = [] // accumulated start time (sec) for each cue

let cumulativeBytes = 0
for (let i = 0; i < cues.length; i++) {
  const cue = cues[i]
  const next = cues[i + 1]
  const nextSlideDiffers = next && next.slide !== cue.slide
  // If next cue is on a new slide, this cue gets the full slide-boundary
  // silence appended to its tail (3000ms + 2000ms = 5000ms).
  const trailingBreakMs = nextSlideDiffers ? (SLIDE_TAIL_MS + SLIDE_HEAD_MS) : 0

  const label = `cue ${i + 1}/${cues.length} · S${cue.slide}${cue.step !== undefined ? ` step ${cue.step}` : ''}`
  const isEmptyAnchor = cue.paragraphs.length === 0 && cue.extraSilenceMs === 0

  // Record the START time of this cue (always equals current cumulative).
  const startSec = cumulativeBytes / MP3_BYTES_PER_SEC
  cueTimings.push({ slide: cue.slide, step: cue.step, at: +startSec.toFixed(2), label })

  if (isEmptyAnchor) {
    // Slide-start anchor with no narration — no synthesis, no audio bytes.
    console.log(`  [${i + 1}/${cues.length}] ${label} · anchor (no audio) · starts at ${startSec.toFixed(2)}s`)
    continue
  }

  const partNum = String(i + 1).padStart(2, '0')
  const ssml = composeCueSSML(cue, trailingBreakMs, voice)

  console.log(`  [${i + 1}/${cues.length}] ${label} · ${cue.paragraphs.length} para · trail ${trailingBreakMs}ms`)
  const t0 = Date.now()
  const mp3 = await generateWithRetry(ssml, label)
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1)
  cumulativeBytes += mp3.length

  const partPath = path.join(outDir, `${chapterId}-part-${partNum}.mp3`)
  await writeFile(partPath, mp3)
  partBuffers.push(mp3)
  console.log(`         ✓ ${(mp3.length / 1024).toFixed(1)} KB · ${elapsed}s · cue starts at ${startSec.toFixed(2)}s`)
}

const concatenated = Buffer.concat(partBuffers)
await writeFile(outPath, concatenated)
const totalSec = cumulativeBytes / MP3_BYTES_PER_SEC
console.log(`\n  ✓ Final MP3: ${path.relative(PROJECT_ROOT, outPath)} (${(concatenated.length / 1024).toFixed(1)} KB · ${formatMMSS(totalSec)})`)

// Emit accurate cues.json.
const cuesDoc = {
  chapter: `${courseSlug}/${chapterId}`,
  audioFile: `${chapterId}.mp3`,
  status: 'real',
  voice,
  pacing: { slideTailMs: SLIDE_TAIL_MS, slideHeadMs: SLIDE_HEAD_MS },
  expectedDurationSeconds: +totalSec.toFixed(2),
  expectedDurationDisplay: formatMMSS(totalSec),
  cues: cueTimings,
}
await writeFile(cuesOutPath, JSON.stringify(cuesDoc, null, 2), 'utf8')
console.log(`  ✓ cues.json: ${path.relative(PROJECT_ROOT, cuesOutPath)} (real timings from MP3 byte positions)\n`)

function formatMMSS(sec) {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}
