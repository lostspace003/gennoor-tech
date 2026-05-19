/*
 * Build pipeline for Academy chapters in the AB-100 style.
 *
 * Takes a chapter from the ChapterContent data, generates:
 *   1. A slide-deck HTML file (compatible with ChapterViewer iframe protocol)
 *   2. Per-slide MP3 narration via Azure Speech (eastus)
 *
 * Uploads everything to Azure Blob Storage container `website-content` at:
 *   courses/<course-id>/chapters/<chapter-slug>.html
 *   courses/<course-id>/audio/<chapter-id>/slide-XX.mp3
 *
 * Run with:
 *   node --experimental-strip-types scripts/build-academy-chapter.ts <courseId> <chapterId>
 *
 * Example:
 *   node --experimental-strip-types scripts/build-academy-chapter.ts ai-foundations chapter-01
 */

import { config } from 'dotenv'
import { BlobServiceClient } from '@azure/storage-blob'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')

// Load .env.local
config({ path: path.join(PROJECT_ROOT, '.env.local') })

const SPEECH_KEY = process.env.AZURE_SPEECH_ACADEMY_KEY
const SPEECH_REGION = process.env.AZURE_SPEECH_ACADEMY_REGION
const STORAGE_CONN = process.env.AZURE_STORAGE_CONNECTION_STRING
const CONTAINER = 'website-content'
const DEFAULT_VOICE = 'en-US-JennyNeural'

if (!SPEECH_KEY || !SPEECH_REGION) {
  console.error('Missing AZURE_SPEECH_ACADEMY_KEY or AZURE_SPEECH_ACADEMY_REGION')
  process.exit(1)
}
if (!STORAGE_CONN) {
  console.error('Missing AZURE_STORAGE_CONNECTION_STRING')
  process.exit(1)
}

// ─────────────────────────────────────────────────────────────────────
// SLIDE DEFINITIONS — Chapter 1: What is AI?
// ─────────────────────────────────────────────────────────────────────

interface Slide {
  title: string
  steps?: { html: string; narration: string }[]
  bodyHtml?: string
  narrationLead?: string
  narrationTrail?: string
  calloutHtml?: string
  calloutNarration?: string
}

interface Chapter {
  courseId: string
  chapterId: string
  chapterNumber: number
  chapterSlug: string
  title: string
  subtitle: string
  slides: Slide[]
}

const aiFoundationsChapter01: Chapter = {
  courseId: 'ai-foundations',
  chapterId: 'chapter-01',
  chapterNumber: 1,
  chapterSlug: 'chapter-01-what-is-ai',
  title: 'What is AI? (Without the hype)',
  subtitle: 'A working definition that survives contact with reality.',
  slides: [
    {
      title: 'What is AI?',
      bodyHtml: `<p class="lead">Before you can use AI well, you need a working definition that survives contact with reality. This chapter cuts through three years of marketing noise and gives you a mental model you can actually use at work — including three things AI is decisively <em>not</em>.</p>`,
      narrationLead:
        'Welcome to chapter one — What is AI, without the hype. Before you can use AI well, you need a working definition that survives contact with reality. This chapter cuts through three years of marketing noise and gives you a mental model you can actually use at work — including three things AI is decisively not.',
    },
    {
      title: 'AI, machine learning, and generative AI — what each one means',
      bodyHtml: `<p>These three terms get used interchangeably by vendors. They are not the same. Getting them straight is the first step to spotting which problems each can solve.</p>`,
      narrationLead:
        'These three terms get used interchangeably by vendors. They are not the same. Getting them straight is the first step to spotting which problems each can solve.',
      steps: [
        {
          html: `<div class="step-card"><h3>AI — Artificial Intelligence</h3><p>The umbrella term for any system that performs tasks normally requiring human intelligence — recognizing faces, translating languages, navigating roads, drafting emails. It's a goal, not a technique.</p></div>`,
          narration:
            'AI, or Artificial Intelligence, is the umbrella term for any system that performs tasks normally requiring human intelligence — recognizing faces, translating languages, navigating roads, drafting emails. It is a goal, not a technique.',
        },
        {
          html: `<div class="step-card"><h3>ML — Machine Learning</h3><p>A specific technique for achieving AI: instead of programming the rules, you show a system many examples and let it figure out the patterns. Spam filters, fraud detection, recommendation engines all use ML.</p></div>`,
          narration:
            'Machine Learning, or ML, is a specific technique for achieving AI. Instead of programming the rules, you show a system many examples and let it figure out the patterns. Spam filters, fraud detection, recommendation engines all use machine learning.',
        },
        {
          html: `<div class="step-card"><h3>GenAI — Generative AI</h3><p>A recent subset of ML that learned from so much text and so many images that it can produce new text and images on demand. ChatGPT, Microsoft Copilot, Claude, Gemini — these are generative AI.</p></div>`,
          narration:
            'Generative AI, or GenAI, is a recent subset of machine learning that learned from so much text and so many images that it can produce new text and images on demand. ChatGPT, Microsoft Copilot, Claude, Gemini — these are generative AI.',
        },
      ],
      calloutHtml: `<div class="callout callout-info"><div class="callout-title">The shorthand to remember</div><div class="callout-body">AI is the destination. ML is the road. Generative AI is the truck that arrived at the destination in late 2022 and changed which problems we now think are worth solving.</div></div>`,
      calloutNarration:
        'The shorthand to remember. AI is the destination. Machine learning is the road. Generative AI is the truck that arrived at the destination in late 2022 and changed which problems we now think are worth solving.',
    },
    {
      title: 'Three things AI is decisively NOT',
      bodyHtml: `<p>Half the bad decisions about AI come from misunderstanding what it isn't. Three myths to retire:</p>`,
      narrationLead:
        'Three things AI is decisively not. Half the bad decisions about AI come from misunderstanding what it is not. Three myths to retire.',
      steps: [
        {
          html: `<div class="step-card"><h3>1 — Not sentient</h3><p>It does not understand, in the way you and I understand. It predicts. ChatGPT is not "thinking about your question" — it's computing the statistically most likely next word given everything before. That doesn't make it less useful, but it should change how you trust its output.</p></div>`,
          narration:
            'One. AI is not sentient. It does not understand, in the way you and I understand. It predicts. ChatGPT is not thinking about your question — it is computing the statistically most likely next word given everything before. That does not make it less useful, but it should change how you trust its output.',
        },
        {
          html: `<div class="step-card"><h3>2 — Not infallible</h3><p>It produces fluent, confident-sounding text that is sometimes completely wrong. The fluency comes from how it was trained; the wrongness comes from the same place. Always verify factual claims it makes — especially numbers, names, dates, and citations.</p></div>`,
          narration:
            'Two. AI is not infallible. It produces fluent, confident-sounding text that is sometimes completely wrong. The fluency comes from how it was trained; the wrongness comes from the same place. Always verify factual claims it makes, especially numbers, names, dates, and citations.',
        },
        {
          html: `<div class="step-card"><h3>3 — Not magic</h3><p>It can only work with the information it has — what it was trained on (a snapshot of the past) and what you give it in your prompt (the present). It doesn't know your company's policies unless you tell it. It doesn't know what happened last week unless that information is supplied.</p></div>`,
          narration:
            'Three. AI is not magic. It can only work with the information it has — what it was trained on, a snapshot of the past, and what you give it in your prompt, the present. It does not know your company policies unless you tell it. It does not know what happened last week unless that information is supplied.',
        },
      ],
    },
    {
      title: 'Why now — what actually changed in 2022',
      bodyHtml: `<p>AI research has been going for 70 years. Two things made the recent wave different: the scale of training data — the entire public internet — and an architectural breakthrough called the Transformer, introduced in 2017 by researchers at Google. Together they produced language models that were so much better than what came before that, when ChatGPT launched in November 2022, the conversation about what AI could do for work changed permanently — for non-technical professionals, not just specialists.</p>`,
      narrationLead:
        'Why now — what actually changed in 2022. AI research has been going for 70 years. Two things made the recent wave different. The scale of training data — the entire public internet — and an architectural breakthrough called the Transformer, introduced in 2017 by researchers at Google. Together they produced language models that were so much better than what came before that, when ChatGPT launched in November 2022, the conversation about what AI could do for work changed permanently — for non-technical professionals, not just specialists.',
      calloutHtml: `<div class="callout callout-tip"><div class="callout-title">Why this matters for your week</div><div class="callout-body">You don't need to track research papers. But you should know that GenAI is genuinely different from the AI that came before — different enough that the playbooks of 2019 don't apply. What changed is who can benefit. Five years ago, you needed a data science team. Now you need a curious manager with thirty minutes.</div></div>`,
      calloutNarration:
        'Why this matters for your week. You do not need to track research papers. But you should know that generative AI is genuinely different from the AI that came before — different enough that the playbooks of 2019 do not apply. What changed is who can benefit. Five years ago, you needed a data science team. Now, you need a curious manager with thirty minutes.',
    },
    {
      title: "What this course doesn't cover",
      bodyHtml: `<p>This is a foundations course. It deliberately does not teach you to code, fine-tune a model, or architect a multi-agent system. It teaches you the mental model and the practical workflows that let you apply AI to your work this week. If you need the technical depth, the Builder track is where you go next.</p>`,
      narrationLead:
        'What this course does not cover. This is a foundations course. It deliberately does not teach you to code, fine-tune a model, or architect a multi-agent system. It teaches you the mental model and the practical workflows that let you apply AI to your work this week. If you need the technical depth, the Builder track is where you go next.',
    },
    {
      title: 'Key takeaways',
      bodyHtml: `<ul class="takeaways">
        <li data-step="1">AI is the goal; ML is the technique; Generative AI is the recent wave that brought AI to non-technical work.</li>
        <li data-step="2">AI is not sentient, not infallible, and not magic — it predicts, fluently, from training data and your prompt.</li>
        <li data-step="3">The 2022 inflection point was a combination of scale (internet-sized training data) and architecture (Transformers).</li>
        <li data-step="4">You don't need to be technical to benefit — you need a working mental model and a willingness to try things.</li>
      </ul>`,
      narrationLead:
        'Key takeaways from this chapter. One. AI is the goal; ML is the technique; Generative AI is the recent wave that brought AI to non-technical work. Two. AI is not sentient, not infallible, and not magic — it predicts, fluently, from training data and your prompt. Three. The 2022 inflection point was a combination of scale — internet-sized training data — and architecture — the Transformer. Four. You do not need to be technical to benefit — you need a working mental model and a willingness to try things. That is chapter one.',
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────
// SSML COMPOSITION
// ─────────────────────────────────────────────────────────────────────

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function composeSlideSSML(slide: Slide, voice: string = DEFAULT_VOICE): string {
  const parts: string[] = []

  if (slide.narrationLead) {
    parts.push(escapeXml(slide.narrationLead))
  }
  if (slide.steps) {
    for (const step of slide.steps) {
      parts.push('<break time="500ms"/>')
      parts.push(escapeXml(step.narration))
    }
  }
  if (slide.calloutNarration) {
    parts.push('<break time="600ms"/>')
    parts.push(escapeXml(slide.calloutNarration))
  }
  if (slide.narrationTrail) {
    parts.push('<break time="400ms"/>')
    parts.push(escapeXml(slide.narrationTrail))
  }

  const body = parts.join(' ')
  return `<speak version="1.0" xml:lang="en-US" xmlns="http://www.w3.org/2001/10/synthesis">
<voice name="${voice}">
<prosody rate="+0%">
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

function renderSlideHtml(slide: Slide, slideNumber: number, totalSlides: number): string {
  const stepsHtml = slide.steps
    ? `<div class="steps">
        ${slide.steps
          .map((step, i) => `<div data-step="${i + 1}">${step.html}</div>`)
          .join('\n')}
      </div>`
    : ''

  return `
    <section class="slide" data-slide="${slideNumber}">
      <div class="slide-inner">
        <p class="slide-meta">Slide ${slideNumber} of ${totalSlides}</p>
        <h2>${escapeXml(slide.title)}</h2>
        ${slide.bodyHtml ?? ''}
        ${stepsHtml}
        ${slide.calloutHtml ?? ''}
      </div>
    </section>
  `
}

function renderChapterHtml(chapter: Chapter): string {
  const totalSlides = chapter.slides.length
  const slidesHtml = chapter.slides
    .map((slide, i) => renderSlideHtml(slide, i + 1, totalSlides))
    .join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeXml(chapter.title)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f9fafb;
      color: #1f2937;
      line-height: 1.6;
      min-height: 100vh;
    }
    /* Top controls — hidden by parent iframe injection */
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

    /* Progress bar */
    .progress-track {
      position: fixed; top: 0; left: 0; right: 0; height: 3px;
      background: rgba(0,0,0,0.05); z-index: 100;
    }
    #progressFill {
      height: 100%; width: 0%; background: #2563eb;
      transition: width 400ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* Step indicator — hidden by parent script */
    #stepIndicator {
      position: fixed; bottom: 16px; right: 16px;
      background: rgba(0,0,0,0.7); color: #fff;
      padding: 6px 12px; border-radius: 6px; font-size: 12px; z-index: 40;
    }

    /* Slides */
    .slides-container {
      max-width: 900px; margin: 0 auto;
      padding: 60px 40px 100px;
    }
    .slide { display: none; }
    .slide.active { display: block; animation: fadeIn 400ms ease; }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .slide-inner { padding: 20px 0; }
    .slide-meta {
      font-size: 11px; font-weight: 700; letter-spacing: 0.15em;
      text-transform: uppercase; color: #9ca3af; margin-bottom: 16px;
    }
    .slide h2 {
      font-size: 36px; font-weight: 800; color: #111827;
      line-height: 1.15; margin-bottom: 24px; letter-spacing: -0.01em;
    }
    .slide p {
      font-size: 18px; color: #374151; margin-bottom: 18px;
    }
    .slide p.lead {
      font-size: 20px; color: #1f2937; font-style: italic;
      border-left: 4px solid #f59e0b; padding-left: 20px; margin-bottom: 24px;
    }

    /* Steps */
    .steps { margin-top: 24px; display: grid; gap: 14px; }
    [data-step] {
      opacity: 0; transform: translateY(8px);
      transition: opacity 400ms ease, transform 400ms ease;
    }
    [data-step].revealed {
      opacity: 1; transform: translateY(0);
    }
    .step-card {
      background: #fff; border: 1px solid #e5e7eb; border-radius: 12px;
      padding: 20px 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    .step-card h3 {
      font-size: 18px; font-weight: 700; color: #2563eb; margin-bottom: 8px;
    }
    .step-card p { font-size: 16px; color: #4b5563; margin: 0; }

    /* Callouts */
    .callout {
      margin-top: 24px; padding: 18px 22px; border-radius: 12px;
      border: 1px solid;
    }
    .callout-info { background: #eff6ff; border-color: #bfdbfe; }
    .callout-tip { background: #ecfdf5; border-color: #a7f3d0; }
    .callout-warning { background: #fef2f2; border-color: #fecaca; }
    .callout-action { background: #fffbeb; border-color: #fde68a; }
    .callout-title {
      font-size: 11px; font-weight: 700; letter-spacing: 0.15em;
      text-transform: uppercase; margin-bottom: 8px; color: #1d4ed8;
    }
    .callout-tip .callout-title { color: #047857; }
    .callout-warning .callout-title { color: #b91c1c; }
    .callout-action .callout-title { color: #b45309; }
    .callout-body { font-size: 15px; color: #374151; line-height: 1.6; }

    /* Takeaways */
    .takeaways {
      list-style: none; padding: 0; display: grid; gap: 12px;
    }
    .takeaways li {
      background: linear-gradient(to right, #eff6ff, #f0f9ff);
      border-left: 4px solid #2563eb; border-radius: 8px;
      padding: 14px 18px; font-size: 16px; color: #1f2937;
    }

    /* Keyboard hint */
    .kb-hint {
      position: fixed; bottom: 16px; left: 16px; font-size: 11px;
      color: #9ca3af; background: rgba(255,255,255,0.9);
      padding: 6px 10px; border-radius: 6px; backdrop-filter: blur(8px);
    }
    .kb-hint kbd {
      background: #f3f4f6; padding: 2px 6px; border-radius: 3px;
      font-size: 10px; font-weight: 600; border: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <!-- Built-in slide controls (hidden by parent iframe script) -->
  <div class="controls-top">
    <button id="prevBtn">‹ Prev</button>
    <span id="counter">1 / ${totalSlides}</span>
    <button id="nextBtn">Next ›</button>
  </div>

  <!-- Progress bar — parent observes #progressFill style.width -->
  <div class="progress-track">
    <div id="progressFill"></div>
  </div>

  <!-- Step indicator -->
  <div id="stepIndicator">Step 1</div>

  <!-- Slides -->
  <main class="slides-container">
    ${slidesHtml}
  </main>

  <!-- Keyboard hint -->
  <div class="kb-hint">
    <kbd>←</kbd> <kbd>→</kbd> Navigate · <kbd>Space</kbd> Play audio
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
        // Reset steps in newly active slide
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
        // Try to advance a step first; if none left, advance slide
        if (!advanceStep() && currentSlide < totalSlides) {
          show(currentSlide + 1);
        }
      });

      // Initialise
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

async function build(chapter: Chapter): Promise<void> {
  console.log(`\n→ Building ${chapter.courseId} / ${chapter.chapterId} — "${chapter.title}"`)
  console.log(`  ${chapter.slides.length} slides\n`)

  const stagingDir = path.join(PROJECT_ROOT, 'tmp', 'academy-build', chapter.courseId)
  const audioDir = path.join(stagingDir, 'audio', chapter.chapterId)
  await mkdir(audioDir, { recursive: true })

  // 1. Generate per-slide MP3s
  for (let i = 0; i < chapter.slides.length; i++) {
    const slide = chapter.slides[i]
    const slideNum = i + 1
    const slideNumStr = String(slideNum).padStart(2, '0')
    const mp3Path = path.join(audioDir, `slide-${slideNumStr}.mp3`)

    if (existsSync(mp3Path)) {
      console.log(`  [${slideNum}/${chapter.slides.length}] slide-${slideNumStr}.mp3 — already exists, skipping speech`)
    } else {
      const ssml = composeSlideSSML(slide)
      console.log(`  [${slideNum}/${chapter.slides.length}] Generating slide-${slideNumStr}.mp3 (${slide.title})...`)
      const mp3 = await generateMp3(ssml)
      await writeFile(mp3Path, mp3)
      console.log(`     ✓ ${(mp3.length / 1024).toFixed(1)} KB`)
    }

    // Upload MP3
    const blobPath = `courses/${chapter.courseId}/audio/${chapter.chapterId}/slide-${slideNumStr}.mp3`
    const mp3Buf = await readFile(mp3Path)
    await uploadToBlob(blobPath, mp3Buf, 'audio/mpeg')
    console.log(`     ↑ uploaded to ${blobPath}`)
  }

  // 2. Generate chapter HTML
  const html = renderChapterHtml(chapter)
  const htmlPath = path.join(stagingDir, 'chapters', `${chapter.chapterSlug}.html`)
  await mkdir(path.dirname(htmlPath), { recursive: true })
  await writeFile(htmlPath, html, 'utf8')
  console.log(`\n  ✓ HTML: ${(html.length / 1024).toFixed(1)} KB → ${htmlPath}`)

  // 3. Upload HTML
  const htmlBlobPath = `courses/${chapter.courseId}/chapters/${chapter.chapterSlug}.html`
  await uploadToBlob(htmlBlobPath, Buffer.from(html, 'utf8'), 'text/html; charset=utf-8')
  console.log(`  ↑ uploaded to ${htmlBlobPath}`)

  console.log(`\n✓ Done. Visit: /ai-academy/${chapter.courseId}/${chapter.chapterSlug}\n`)
}

// ─────────────────────────────────────────────────────────────────────
// RUN
// ─────────────────────────────────────────────────────────────────────

const chapters: Record<string, Chapter> = {
  'chapter-01': aiFoundationsChapter01,
}

const args = process.argv.slice(2)
const chapterId = args[0] ?? 'chapter-01'
const chapter = chapters[chapterId]

if (!chapter) {
  console.error(`Unknown chapterId: ${chapterId}. Available: ${Object.keys(chapters).join(', ')}`)
  process.exit(1)
}

build(chapter).catch((err) => {
  console.error('Build failed:', err)
  process.exit(1)
})
