/*
 * Build pipeline for Academy chapters in the AB-100 style.
 *
 * Chapter data lives in scripts/chapters-data/ — one file per chapter.
 * This script handles the pipeline: SSML composition, Azure Speech TTS,
 * HTML rendering, and blob storage upload.
 *
 * Run with:
 *   node --experimental-strip-types scripts/build-academy-chapter.ts <chapterId>
 *   node --experimental-strip-types scripts/build-academy-chapter.ts all
 *
 * Examples:
 *   node --experimental-strip-types scripts/build-academy-chapter.ts chapter-01
 *   node --experimental-strip-types scripts/build-academy-chapter.ts all
 */

import { config } from 'dotenv'
import { BlobServiceClient } from '@azure/storage-blob'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chapters, type Chapter, type Slide } from './chapters-data/index.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')

config({ path: path.join(PROJECT_ROOT, '.env.local') })

const SPEECH_KEY = process.env.AZURE_SPEECH_ACADEMY_KEY
const SPEECH_REGION = process.env.AZURE_SPEECH_ACADEMY_REGION
const STORAGE_CONN = process.env.AZURE_STORAGE_CONNECTION_STRING
const CONTAINER = 'website-content'
const DEFAULT_VOICE = 'en-IN-NeerjaExpressiveNeural'

if (!SPEECH_KEY || !SPEECH_REGION) {
  console.error('Missing AZURE_SPEECH_ACADEMY_KEY or AZURE_SPEECH_ACADEMY_REGION')
  process.exit(1)
}
if (!STORAGE_CONN) {
  console.error('Missing AZURE_STORAGE_CONNECTION_STRING')
  process.exit(1)
}

// ─────────────────────────────────────────────────────────────────────
// SSML COMPOSITION — natural pacing via prosody + breaks
// ─────────────────────────────────────────────────────────────────────

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function paceText(text: string): string {
  let paced = escapeXml(text)
  paced = paced.replace(/([.!?])\s+/g, '$1<break time="350ms"/> ')
  paced = paced.replace(/\s—\s/g, ' <break time="250ms"/>— <break time="150ms"/>')
  return paced
}

function composeSlideSSML(slide: Slide, voice: string = DEFAULT_VOICE): string {
  const parts: string[] = []

  if (slide.narrationLead) {
    parts.push(paceText(slide.narrationLead))
  }
  if (slide.steps) {
    for (const step of slide.steps) {
      parts.push('<break time="700ms"/>')
      parts.push(paceText(step.narration))
    }
  }
  if (slide.calloutNarration) {
    parts.push('<break time="800ms"/>')
    parts.push(paceText(slide.calloutNarration))
  }
  if (slide.narrationTrail) {
    parts.push('<break time="500ms"/>')
    parts.push(paceText(slide.narrationTrail))
  }

  const body = parts.join(' ')

  return `<speak version="1.0" xml:lang="en-IN" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts">
<voice name="${voice}">
<prosody rate="-7%" pitch="+0Hz">
${body}
</prosody>
</voice>
</speak>`
}

// ─────────────────────────────────────────────────────────────────────
// AZURE SPEECH CALL
// ─────────────────────────────────────────────────────────────────────

async function generateMp3(ssml: string): Promise<Buffer> {
  const endpoint = `https://${SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': SPEECH_KEY!,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
      'User-Agent': 'gennoor-academy-build',
    },
    body: ssml,
  })
  if (!res.ok) {
    const errText = await res.text().catch(() => '<no body>')
    throw new Error(`Azure Speech failed: ${res.status} — ${errText.slice(0, 300)}`)
  }
  const arrayBuf = await res.arrayBuffer()
  return Buffer.from(arrayBuf)
}

// ─────────────────────────────────────────────────────────────────────
// HTML SLIDE-DECK GENERATION
// ─────────────────────────────────────────────────────────────────────

function renderSlideHtml(slide: Slide, slideNumber: number, totalSlides: number, ICONS: Record<string, string>): string {
  const stepsHtml = slide.steps
    ? `<div class="steps">
        ${slide.steps
          .map((step, i) => `<div class="step" data-step="${i + 1}">${step.html}</div>`)
          .join('\n')}
      </div>`
    : ''

  const iconHtml = slide.iconKey ? `<div class="slide-icon">${ICONS[slide.iconKey]}</div>` : ''
  const eyebrowHtml = slide.eyebrow ? `<p class="slide-eyebrow">${escapeXml(slide.eyebrow)}</p>` : ''

  return `
    <section class="slide" data-slide="${slideNumber}">
      <div class="slide-inner">
        <div class="slide-meta">Slide ${slideNumber} of ${totalSlides}</div>
        <header class="slide-header">
          ${iconHtml}
          <div class="slide-head-text">
            ${eyebrowHtml}
            <h2>${escapeXml(slide.title)}</h2>
          </div>
        </header>
        ${slide.bodyHtml ?? ''}
        ${stepsHtml}
        ${slide.calloutHtml ?? ''}
      </div>
    </section>
  `
}

function renderChapterHtml(chapter: Chapter, ICONS: Record<string, string>): string {
  const totalSlides = chapter.slides.length
  const slidesHtml = chapter.slides
    .map((slide, i) => renderSlideHtml(slide, i + 1, totalSlides, ICONS))
    .join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeXml(chapter.title)}</title>
  <style>
    :root {
      --brand-blue: #2563eb;
      --brand-blue-dark: #1d4ed8;
      --brand-amber: #f59e0b;
      --brand-amber-dark: #d97706;
      --text-strong: #0f172a;
      --text-body: #334155;
      --text-mute: #64748b;
      --text-soft: #94a3b8;
      --surface-base: #ffffff;
      --surface-tint: #f8fafc;
      --border-soft: #e2e8f0;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(180deg, #fafafa 0%, #f1f5f9 100%);
      color: var(--text-body);
      line-height: 1.6;
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    body::before, body::after {
      content: '';
      position: fixed;
      width: 480px; height: 480px; border-radius: 50%;
      filter: blur(80px);
      pointer-events: none;
      z-index: 0;
    }
    body::before {
      top: -120px; right: -120px;
      background: radial-gradient(circle, rgba(37,99,235,0.10), transparent 70%);
    }
    body::after {
      bottom: -120px; left: -120px;
      background: radial-gradient(circle, rgba(245,158,11,0.08), transparent 70%);
    }
    .controls-top {
      position: fixed; top: 0; left: 0; right: 0; height: 48px;
      background: #0c1426; color: #fff; display: flex; align-items: center;
      justify-content: space-between; padding: 0 16px; z-index: 50;
    }
    .controls-top button {
      background: rgba(255,255,255,0.1); color: #fff; border: 0;
      padding: 6px 14px; border-radius: 6px; cursor: pointer; font-weight: 600;
    }
    .controls-top button:disabled { opacity: 0.3; cursor: not-allowed; }
    .controls-top #counter { font-size: 13px; opacity: 0.7; }
    .progress-track {
      position: fixed; top: 0; left: 0; right: 0; height: 3px;
      background: rgba(0,0,0,0.05); z-index: 100;
    }
    #progressFill {
      height: 100%; width: 0%;
      background: linear-gradient(90deg, var(--brand-blue), var(--brand-amber));
      transition: width 500ms cubic-bezier(0.16, 1, 0.3, 1);
    }
    #stepIndicator {
      position: fixed; bottom: 18px; right: 18px;
      background: rgba(15, 23, 42, 0.85); color: #fff;
      padding: 6px 12px; border-radius: 999px; font-size: 11px;
      font-weight: 600; letter-spacing: 0.05em;
      z-index: 40; backdrop-filter: blur(8px);
    }
    .slides-container {
      max-width: 920px; margin: 0 auto;
      padding: 60px 32px 120px;
      position: relative;
      z-index: 1;
    }
    .slide { display: none; }
    .slide.active {
      display: block;
      animation: slideIn 600ms cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .slide-inner {
      background: var(--surface-base);
      border-radius: 24px;
      padding: 48px 44px 56px;
      box-shadow:
        0 1px 3px rgba(15,23,42,0.04),
        0 12px 32px -8px rgba(15,23,42,0.10);
      border: 1px solid rgba(226,232,240,0.6);
    }
    .slide-meta {
      font-size: 11px; font-weight: 700; letter-spacing: 0.18em;
      text-transform: uppercase; color: var(--text-soft); margin-bottom: 20px;
    }
    .slide-header {
      display: flex; align-items: flex-start; gap: 20px;
      margin-bottom: 24px;
    }
    .slide-icon {
      width: 56px; height: 56px; flex-shrink: 0;
      border-radius: 16px;
      background: linear-gradient(135deg, var(--brand-blue), var(--brand-blue-dark));
      color: #fff; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 8px 24px -6px rgba(37,99,235,0.35);
    }
    .slide-icon svg { width: 28px; height: 28px; }
    .slide-head-text { flex-grow: 1; padding-top: 4px; }
    .slide-eyebrow {
      font-size: 11px; font-weight: 700; letter-spacing: 0.15em;
      text-transform: uppercase; color: var(--brand-blue); margin-bottom: 6px;
    }
    .slide h2 {
      font-size: 32px; font-weight: 800; color: var(--text-strong);
      line-height: 1.15; letter-spacing: -0.015em;
    }
    .slide p {
      font-size: 17px; color: var(--text-body); margin-bottom: 16px;
    }
    .slide p:last-child { margin-bottom: 0; }
    .slide p.lead {
      font-size: 19px; color: var(--text-strong); line-height: 1.6;
      border-left: 4px solid var(--brand-amber);
      padding-left: 22px; padding-top: 4px; padding-bottom: 4px;
      margin-top: 8px; margin-bottom: 8px;
    }
    .slide em {
      color: var(--text-strong); font-weight: 600; font-style: italic;
    }
    .slide strong { color: var(--text-strong); font-weight: 700; }
    .steps { margin-top: 28px; display: grid; gap: 14px; }
    .step {
      opacity: 0; transform: translateY(12px) scale(0.98);
      transition: opacity 500ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms cubic-bezier(0.16, 1, 0.3, 1);
    }
    .step.revealed {
      opacity: 1; transform: translateY(0) scale(1);
    }
    .step-card {
      display: flex; gap: 18px; align-items: flex-start;
      background: #fff;
      border: 1px solid var(--border-soft);
      border-radius: 14px;
      padding: 18px 22px;
      box-shadow: 0 1px 2px rgba(15,23,42,0.03);
      transition: border-color 200ms, box-shadow 200ms, transform 200ms;
    }
    .step-card:hover {
      border-color: rgba(37,99,235,0.3);
      box-shadow: 0 4px 12px -2px rgba(37,99,235,0.10);
      transform: translateY(-1px);
    }
    .step-icon {
      width: 40px; height: 40px; flex-shrink: 0;
      border-radius: 10px; display: flex; align-items: center; justify-content: center;
      color: #fff;
    }
    .step-icon svg { width: 20px; height: 20px; }
    .step-card.accent-blue .step-icon { background: linear-gradient(135deg, #3b82f6, #2563eb); }
    .step-card.accent-amber .step-icon { background: linear-gradient(135deg, #fbbf24, #d97706); }
    .step-card.accent-red .step-icon { background: linear-gradient(135deg, #f87171, #dc2626); }
    .step-card.accent-green .step-icon { background: linear-gradient(135deg, #4ade80, #16a34a); }
    .step-content { flex-grow: 1; padding-top: 2px; }
    .step-content h3 {
      font-size: 17px; font-weight: 700; color: var(--text-strong);
      margin-bottom: 4px; letter-spacing: -0.005em;
    }
    .step-content p {
      font-size: 15px; color: var(--text-body); margin: 0; line-height: 1.55;
    }
    .callout {
      margin-top: 28px;
      display: flex; gap: 16px; align-items: flex-start;
      padding: 20px 22px;
      border-radius: 14px;
      border: 1px solid;
    }
    .callout-icon {
      width: 36px; height: 36px; flex-shrink: 0;
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      color: #fff;
    }
    .callout-icon svg { width: 18px; height: 18px; }
    .callout-info { background: #eff6ff; border-color: #bfdbfe; }
    .callout-info .callout-icon { background: var(--brand-blue); }
    .callout-info .callout-title { color: var(--brand-blue-dark); }
    .callout-tip { background: #fffbeb; border-color: #fde68a; }
    .callout-tip .callout-icon { background: var(--brand-amber); }
    .callout-tip .callout-title { color: var(--brand-amber-dark); }
    .callout-warning { background: #fef2f2; border-color: #fecaca; }
    .callout-warning .callout-icon { background: #dc2626; }
    .callout-warning .callout-title { color: #b91c1c; }
    .callout > div:last-child { flex-grow: 1; }
    .callout-title {
      font-size: 11px; font-weight: 700; letter-spacing: 0.15em;
      text-transform: uppercase; margin-bottom: 6px;
    }
    .callout-body {
      font-size: 15px; color: var(--text-body); line-height: 1.6;
    }
    .takeaways {
      list-style: none; padding: 0; display: grid; gap: 12px; margin-top: 8px;
    }
    .takeaways li {
      display: flex; gap: 14px; align-items: flex-start;
      background: linear-gradient(135deg, rgba(239,246,255,0.6), rgba(255,251,235,0.4));
      border: 1px solid rgba(191,219,254,0.5);
      border-left: 4px solid var(--brand-blue);
      border-radius: 12px;
      padding: 16px 20px;
      font-size: 16px; color: var(--text-strong);
      line-height: 1.6;
      opacity: 0; transform: translateY(10px);
      transition: opacity 500ms, transform 500ms;
    }
    .takeaways li.revealed { opacity: 1; transform: translateY(0); }
    .takeaway-icon {
      width: 28px; height: 28px; flex-shrink: 0;
      border-radius: 8px;
      background: linear-gradient(135deg, var(--brand-blue), var(--brand-blue-dark));
      color: #fff;
      display: flex; align-items: center; justify-content: center;
    }
    .takeaway-icon svg { width: 16px; height: 16px; }
    .kb-hint {
      position: fixed; bottom: 18px; left: 18px; font-size: 11px;
      color: var(--text-soft); background: rgba(255,255,255,0.9);
      padding: 6px 12px; border-radius: 999px;
      backdrop-filter: blur(8px);
      border: 1px solid var(--border-soft);
      font-weight: 500;
    }
    .kb-hint kbd {
      background: var(--surface-tint); padding: 2px 6px; border-radius: 4px;
      font-size: 10px; font-weight: 700; border: 1px solid var(--border-soft);
      color: var(--text-strong); margin: 0 2px;
    }
    @media (max-width: 720px) {
      .slides-container { padding: 32px 16px 80px; }
      .slide-inner { padding: 32px 24px 40px; border-radius: 18px; }
      .slide h2 { font-size: 24px; }
      .slide-header { flex-direction: column; gap: 14px; }
      .slide-icon { width: 44px; height: 44px; }
      .slide-icon svg { width: 22px; height: 22px; }
      .step-card { padding: 14px 18px; }
      .kb-hint { display: none; }
    }
  </style>
</head>
<body>
  <div class="controls-top">
    <button id="prevBtn">‹ Prev</button>
    <span id="counter">1 / ${totalSlides}</span>
    <button id="nextBtn">Next ›</button>
  </div>
  <div class="progress-track">
    <div id="progressFill"></div>
  </div>
  <div id="stepIndicator">Step 1</div>
  <main class="slides-container">
    ${slidesHtml}
  </main>
  <div class="kb-hint">
    <kbd>←</kbd><kbd>→</kbd> Navigate · <kbd>Space</kbd> Play audio
  </div>
  <script>
    (function() {
      var slides = document.querySelectorAll('.slide');
      var totalSlides = slides.length;
      var currentSlide = 1;
      var counter = document.getElementById('counter');
      var progressFill = document.getElementById('progressFill');
      var stepIndicator = document.getElementById('stepIndicator');
      var prevBtn = document.getElementById('prevBtn');
      var nextBtn = document.getElementById('nextBtn');
      function show(n) {
        if (n < 1 || n > totalSlides) return;
        currentSlide = n;
        slides.forEach(function(s, i) {
          s.classList.toggle('active', i === n - 1);
        });
        counter.textContent = n + ' / ' + totalSlides;
        progressFill.style.width = ((n / totalSlides) * 100) + '%';
        var active = slides[n - 1];
        var stepsInSlide = active.querySelectorAll('[data-step]');
        stepsInSlide.forEach(function(s) { s.classList.remove('revealed'); });
        updateStepIndicator();
      }
      function updateStepIndicator() {
        var active = slides[currentSlide - 1];
        var steps = active.querySelectorAll('[data-step]');
        var revealed = active.querySelectorAll('[data-step].revealed');
        if (steps.length === 0) {
          stepIndicator.style.display = 'none';
        } else {
          stepIndicator.style.display = 'block';
          stepIndicator.textContent = 'Step ' + revealed.length + ' / ' + steps.length;
        }
      }
      function advanceStep() {
        var active = slides[currentSlide - 1];
        var next = active.querySelector('[data-step]:not(.revealed)');
        if (next) {
          next.classList.add('revealed');
          updateStepIndicator();
          return true;
        }
        return false;
      }
      prevBtn.addEventListener('click', function() {
        if (currentSlide > 1) show(currentSlide - 1);
      });
      nextBtn.addEventListener('click', function() {
        if (!advanceStep() && currentSlide < totalSlides) {
          show(currentSlide + 1);
        }
      });
      show(1);
    })();
  </script>
</body>
</html>`
}

// ─────────────────────────────────────────────────────────────────────
// BLOB UPLOAD
// ─────────────────────────────────────────────────────────────────────

async function uploadToBlob(blobPath: string, body: Buffer, contentType: string): Promise<void> {
  const service = BlobServiceClient.fromConnectionString(STORAGE_CONN!)
  const container = service.getContainerClient(CONTAINER)
  await container.createIfNotExists()
  const blob = container.getBlockBlobClient(blobPath)
  await blob.uploadData(body, {
    blobHTTPHeaders: { blobContentType: contentType },
  })
}

// ─────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────

async function build(chapter: Chapter, ICONS: Record<string, string>): Promise<void> {
  console.log(`\n→ Building ${chapter.courseId} / ${chapter.chapterId} — "${chapter.title}"`)
  console.log(`  Voice: ${DEFAULT_VOICE} · ${chapter.slides.length} slides`)

  const stagingDir = path.join(PROJECT_ROOT, 'tmp', 'academy-build', chapter.courseId)
  const audioDir = path.join(stagingDir, 'audio', chapter.chapterId)
  await mkdir(audioDir, { recursive: true })

  for (let i = 0; i < chapter.slides.length; i++) {
    const slide = chapter.slides[i]
    const slideNum = i + 1
    const slideNumStr = String(slideNum).padStart(2, '0')
    const mp3Path = path.join(audioDir, `slide-${slideNumStr}.mp3`)

    const ssml = composeSlideSSML(slide)
    console.log(`  [${slideNum}/${chapter.slides.length}] slide-${slideNumStr}.mp3 — ${slide.title}`)
    const mp3 = await generateMp3(ssml)
    await writeFile(mp3Path, mp3)

    const blobPath = `courses/${chapter.courseId}/audio/${chapter.chapterId}/slide-${slideNumStr}.mp3`
    const mp3Buf = await readFile(mp3Path)
    await uploadToBlob(blobPath, mp3Buf, 'audio/mpeg')
    console.log(`     ✓ ${(mp3.length / 1024).toFixed(1)} KB · uploaded`)
  }

  const html = renderChapterHtml(chapter, ICONS)
  const htmlPath = path.join(stagingDir, 'chapters', `${chapter.chapterSlug}.html`)
  await mkdir(path.dirname(htmlPath), { recursive: true })
  await writeFile(htmlPath, html, 'utf8')

  const htmlBlobPath = `courses/${chapter.courseId}/chapters/${chapter.chapterSlug}.html`
  await uploadToBlob(htmlBlobPath, Buffer.from(html, 'utf8'), 'text/html; charset=utf-8')
  console.log(`  ✓ HTML uploaded → ${htmlBlobPath}`)
  console.log(`  → /ai-academy/${chapter.courseId}/${chapter.chapterSlug}`)
}

// ─────────────────────────────────────────────────────────────────────
// RUN
// ─────────────────────────────────────────────────────────────────────

const { ICONS } = await import('./chapters-data/index.ts')

const args = process.argv.slice(2)
const target = args[0] ?? 'chapter-01'

async function main() {
  if (target === 'all') {
    const ids = Object.keys(chapters).sort()
    console.log(`Building ALL chapters: ${ids.join(', ')}\n`)
    for (const id of ids) {
      await build(chapters[id], ICONS)
    }
  } else {
    const chapter = chapters[target]
    if (!chapter) {
      console.error(`Unknown chapterId: ${target}. Available: ${Object.keys(chapters).join(', ')}`)
      process.exit(1)
    }
    await build(chapter, ICONS)
  }
  console.log('\n✓ All done.')
}

main().catch((err) => {
  console.error('Build failed:', err)
  process.exit(1)
})
