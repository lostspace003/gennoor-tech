/**
 * Generates per-slide MP3 audio files from chapter transcripts
 * using Azure Speech Service, and uploads directly to Azure Blob Storage.
 *
 * Usage:
 *   npx tsx scripts/generate-course-audio.ts
 *   npx tsx scripts/generate-course-audio.ts --chapter 00
 *   npx tsx scripts/generate-course-audio.ts --force          (regenerate all, overwriting existing)
 *   npx tsx scripts/generate-course-audio.ts --chapter 00 --force
 *
 * Prerequisites:
 *   - AZURE_SPEECH_KEY env var (or fetched via: az cognitiveservices account keys list --name gennoor-speech --resource-group rg-gennoor-tech)
 *   - AZURE_SPEECH_REGION env var (default: centralindia)
 *   - AZURE_STORAGE_CONNECTION_STRING env var
 *   - Transcript files with slide markers in course-4-free/ab-100-course/transcripts/
 *
 * Output:
 *   Blobs in 'website-content' container:
 *   courses/ab-100/audio/chapter-XX/slide-00.mp3, slide-01.mp3, ...
 */

import * as fs from 'fs'
import * as path from 'path'
import { BlobServiceClient } from '@azure/storage-blob'

const SPEECH_KEY = process.env.AZURE_SPEECH_KEY
const SPEECH_REGION = process.env.AZURE_SPEECH_REGION || 'centralindia'
const VOICE = 'en-US-AndrewMultilingualNeural'
const CONTAINER = 'website-content'
const FORCE = process.argv.includes('--force')

const TRANSCRIPT_DIR = path.resolve(__dirname, '../../course-4-free/ab-100-course/transcripts')

function getStorageClient() {
  const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!connStr) throw new Error('AZURE_STORAGE_CONNECTION_STRING not set')
  return BlobServiceClient.fromConnectionString(connStr)
}

function buildSSML(text: string): string {
  // Text contains SSML <break> tags — don't escape. Only escape bare & characters.
  const safeText = text.trim().replace(/&(?!amp;|lt;|gt;|quot;|apos;)/g, '&amp;')
  return `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='https://www.w3.org/2001/mstts' xml:lang='en-US'>
  <voice name='${VOICE}'>
    <mstts:express-as style='cheerful'>
      <prosody rate='-5%'>
        ${safeText}
      </prosody>
    </mstts:express-as>
  </voice>
</speak>`
}

interface SlideSegment {
  slideIndex: number
  text: string
}

function parseTranscript(content: string): SlideSegment[] {
  const segments: SlideSegment[] = []
  const marker = /^---\s*SLIDE\s+(\d+)\s*---$/gm
  let match: RegExpExecArray | null
  const markers: { index: number; slideNum: number; markerStart: number }[] = []

  while ((match = marker.exec(content)) !== null) {
    markers.push({ index: match.index + match[0].length, slideNum: parseInt(match[1], 10), markerStart: match.index })
  }

  if (markers.length === 0) {
    console.error('  ERROR: No slide markers found. Expected format: --- SLIDE 01 ---')
    return []
  }

  for (let i = 0; i < markers.length; i++) {
    const start = markers[i].index
    const end = i + 1 < markers.length ? markers[i + 1].markerStart : content.length
    const text = content.slice(start, end).trim()
    if (text) {
      segments.push({ slideIndex: markers[i].slideNum, text })
    }
  }

  return segments
}

async function synthesize(text: string): Promise<Buffer> {
  if (!SPEECH_KEY) throw new Error('AZURE_SPEECH_KEY not set')

  const url = `https://${SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`

  const MAX_CHARS = 8000
  if (text.length <= MAX_CHARS) {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': SPEECH_KEY,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
      },
      body: buildSSML(text),
    })
    if (!res.ok) {
      throw new Error(`TTS API error: ${res.status} ${await res.text()}`)
    }
    return Buffer.from(await res.arrayBuffer())
  }

  const sentences = text.split(/(?<=\.)\s+/)
  const chunks: string[] = []
  let current = ''
  for (const sentence of sentences) {
    if (current.length + sentence.length > MAX_CHARS) {
      chunks.push(current)
      current = sentence
    } else {
      current += (current ? ' ' : '') + sentence
    }
  }
  if (current) chunks.push(current)

  const buffers: Buffer[] = []
  for (let i = 0; i < chunks.length; i++) {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': SPEECH_KEY,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
      },
      body: buildSSML(chunks[i]),
    })
    if (!res.ok) {
      throw new Error(`TTS API error: ${res.status} ${await res.text()}`)
    }
    buffers.push(Buffer.from(await res.arrayBuffer()))
    if (i < chunks.length - 1) await new Promise(r => setTimeout(r, 500))
  }

  return Buffer.concat(buffers)
}

async function blobExists(container: ReturnType<BlobServiceClient['getContainerClient']>, blobName: string): Promise<boolean> {
  try {
    await container.getBlobClient(blobName).getProperties()
    return true
  } catch {
    return false
  }
}

async function processChapter(chapterId: string) {
  const transcriptFile = path.join(TRANSCRIPT_DIR, `${chapterId}-transcript.txt`)

  if (!fs.existsSync(transcriptFile)) {
    console.log(`  SKIP ${chapterId} (no transcript file)`)
    return
  }

  const content = fs.readFileSync(transcriptFile, 'utf-8')
  const segments = parseTranscript(content)

  if (segments.length === 0) {
    console.log(`  SKIP ${chapterId} (no valid slide segments)`)
    return
  }

  const blobService = getStorageClient()
  const container = blobService.getContainerClient(CONTAINER)
  const blobPrefix = `courses/ab-100/audio/${chapterId}`

  console.log(`  ${chapterId}: ${segments.length} slides → blob: ${blobPrefix}/`)

  let generated = 0
  let skipped = 0

  for (const seg of segments) {
    const blobName = `${blobPrefix}/slide-${String(seg.slideIndex).padStart(2, '0')}.mp3`

    if (await blobExists(container, blobName)) {
      if (FORCE) {
        await container.getBlobClient(blobName).deleteIfExists()
      } else {
        skipped++
        continue
      }
    }

    console.log(`    Slide ${String(seg.slideIndex).padStart(2, '0')} (${seg.text.length} chars)`)

    try {
      const audio = await synthesize(seg.text)
      const blockBlob = container.getBlockBlobClient(blobName)
      await blockBlob.uploadData(audio, {
        blobHTTPHeaders: { blobContentType: 'audio/mpeg' },
      })
      generated++
    } catch (err) {
      console.error(`    ERROR on slide ${seg.slideIndex}: ${err}`)
    }

    await new Promise(r => setTimeout(r, 300))
  }

  console.log(`  DONE ${chapterId}: ${generated} generated, ${skipped} skipped (already exist)`)
}

async function main() {
  if (!SPEECH_KEY) {
    console.error('ERROR: Set AZURE_SPEECH_KEY environment variable')
    console.error('  Get it: az cognitiveservices account keys list --name gennoor-speech --resource-group rg-gennoor-tech --query key1 -o tsv')
    process.exit(1)
  }

  if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
    console.error('ERROR: Set AZURE_STORAGE_CONNECTION_STRING environment variable')
    process.exit(1)
  }

  if (!fs.existsSync(TRANSCRIPT_DIR)) {
    console.error(`ERROR: Transcript directory not found: ${TRANSCRIPT_DIR}`)
    process.exit(1)
  }

  const chapterArg = process.argv.find(a => a === '--chapter')
  const chapterIdx = chapterArg ? process.argv.indexOf(chapterArg) + 1 : -1
  const specificChapter = chapterIdx > 0 ? `chapter-${process.argv[chapterIdx].padStart(2, '0')}` : null

  if (specificChapter) {
    console.log(`Processing single chapter: ${specificChapter}\n`)
    await processChapter(specificChapter)
  } else {
    const files = fs.readdirSync(TRANSCRIPT_DIR)
      .filter(f => f.endsWith('-transcript.txt'))
      .sort()

    console.log(`Found ${files.length} transcript files\n`)

    for (const file of files) {
      const chapterId = file.replace('-transcript.txt', '')
      await processChapter(chapterId)
      await new Promise(r => setTimeout(r, 500))
    }
  }

  console.log('\nDone! Audio blobs uploaded to: website-content/courses/ab-100/audio/')
}

main().catch(console.error)
