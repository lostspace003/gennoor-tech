/*
 * Build pipeline for Academy chapters in the AB-100 style.
 *
 * Chapter data lives in scripts/chapters-data/ — one file per chapter.
 * This script handles SSML composition, Azure Speech TTS, HTML rendering,
 * and blob storage upload.
 *
 * Run with:
 *   node --experimental-strip-types scripts/build-academy-chapter.ts <chapterId> [--html-only]
 *   node --experimental-strip-types scripts/build-academy-chapter.ts all [--html-only]
 *
 * --html-only skips MP3 generation/upload (use when only the slide HTML changed).
 */

import { config } from 'dotenv'
import { BlobServiceClient } from '@azure/storage-blob'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chapters, type Chapter, type Slide, type CourseTheme, DEFAULT_THEME } from './chapters-data/index.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')

config({ path: path.join(PROJECT_ROOT, '.env.local') })

const SPEECH_KEY = process.env.AZURE_SPEECH_ACADEMY_KEY
const SPEECH_REGION = process.env.AZURE_SPEECH_ACADEMY_REGION
const STORAGE_CONN = process.env.AZURE_STORAGE_CONNECTION_STRING
const CONTAINER = 'website-content'
const DEFAULT_VOICE = 'en-US-AndrewMultilingualNeural'

if (!STORAGE_CONN) {
  console.error('Missing AZURE_STORAGE_CONNECTION_STRING')
  process.exit(1)
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

function paceText(text: string): string {
  let paced = escapeXml(text)
  paced = paced.replace(/([.!?])\s+/g, '$1<break time="350ms"/> ')
  paced = paced.replace(/\s—\s/g, ' <break time="250ms"/>— <break time="150ms"/>')
  return paced
}

function composeSlideSSML(slide: Slide, voice: string = DEFAULT_VOICE): string {
  const parts: string[] = []
  if (slide.narrationLead) parts.push(paceText(slide.narrationLead))
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
  return `<speak version="1.0" xml:lang="en-US" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts">
<voice name="${voice}">
<mstts:express-as style="cheerful">
<prosody rate="-5%" pitch="+0Hz">
${body}
</prosody>
</mstts:express-as>
</voice>
</speak>`
}

// ─────────────────────────────────────────────────────────────────────
// AZURE SPEECH
// ─────────────────────────────────────────────────────────────────────

async function generateMp3(ssml: string): Promise<Buffer> {
  if (!SPEECH_KEY || !SPEECH_REGION) {
    throw new Error('Missing AZURE_SPEECH_ACADEMY_KEY or AZURE_SPEECH_ACADEMY_REGION')
  }
  const endpoint = `https://${SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': SPEECH_KEY,
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
  return Buffer.from(await res.arrayBuffer())
}

// ─────────────────────────────────────────────────────────────────────
// HTML SLIDE-DECK GENERATION — AB-100 style
// ─────────────────────────────────────────────────────────────────────

function gennoorBrandMark(size: number, theme: CourseTheme): string {
  const p = theme.primary
  const a = theme.accent
  return `<svg class="brand-mark" width="${size}" height="${size}" viewBox="0 0 130 130" xmlns="http://www.w3.org/2000/svg">
    <circle cx="105.8" cy="84.0" r="6" fill="${p}"/><circle cx="93.4" cy="99.9" r="6" fill="${p}"/>
    <circle cx="75.4" cy="108.8" r="6" fill="${p}"/><circle cx="55.3" cy="108.9" r="6" fill="${p}"/>
    <circle cx="37.1" cy="100.3" r="6" fill="${p}"/><circle cx="24.5" cy="84.6" r="6" fill="${p}"/>
    <circle cx="20.0" cy="65.0" r="6" fill="${p}"/><circle cx="24.5" cy="45.4" r="6" fill="${p}"/>
    <circle cx="37.1" cy="29.7" r="6" fill="${p}"/><circle cx="55.3" cy="21.1" r="6" fill="${p}"/>
    <circle cx="75.4" cy="21.2" r="6" fill="${p}"/><circle cx="93.4" cy="30.1" r="6" fill="${p}"/>
    <circle cx="80" cy="65" r="6" fill="${a}"/><circle cx="95" cy="65" r="6" fill="${a}"/>
    <circle cx="110" cy="65" r="6" fill="${p}"/>
  </svg>`
}

function renderTitleSlide(slide: Slide, num: string, total: string, theme: CourseTheme): string {
  const eyebrow = slide.eyebrow ? escapeXml(slide.eyebrow.toUpperCase()) : ''
  const subtitle = (slide.bodyHtml ?? '')
    .replace(/<p class="lead">/g, '')
    .replace(/<\/p>/g, '')
    .replace(/<p>/g, '')

  return `
    <section class="slide title-slide" data-slide="${num}">
      <div class="slide-num">${num} / ${total}</div>
      <div class="brand-full">
        ${gennoorBrandMark(52, theme)}
        <div class="brand-wordmark">
          <span class="name"><span class="b-w">Ge</span><span class="b-c1">nn</span><span class="b-c2">oo</span><span class="b-c1">r</span><span class="b-w-soft"> Academy</span></span>
          <span class="tag">TRAIN · INNOVATE · BUILD</span>
        </div>
      </div>
      <div class="title-inner">
        ${eyebrow ? `<div class="eyebrow">${eyebrow}</div>` : ''}
        <h1>${escapeXml(slide.title)}</h1>
        <p class="subtitle">${subtitle}</p>
      </div>
    </section>
  `
}

function renderContentSlide(slide: Slide, num: string, total: string, ICONS: Record<string, string>): string {
  const eyebrow = slide.eyebrow ? `<div class="eyebrow">${escapeXml(slide.eyebrow)}</div>` : ''
  const iconHtml = slide.iconKey ? `<div class="slide-icon">${ICONS[slide.iconKey]}</div>` : ''
  const lead = slide.bodyHtml ?? ''

  let stepsHtml = ''
  if (slide.steps && slide.steps.length > 0) {
    const cols = slide.steps.length <= 2 ? 'cols-2' : 'cols-3'
    stepsHtml = `<div class="cards ${cols}">
      ${slide.steps.map((step, i) => `
        <div class="card" data-step="${i + 1}">
          <div class="card-num">${String(i + 1).padStart(2, '0')}</div>
          ${step.html}
        </div>
      `).join('')}
    </div>`
  }

  const calloutHtml = slide.calloutHtml ?? ''

  return `
    <section class="slide content-slide" data-slide="${num}">
      <div class="slide-num">${num} / ${total}</div>
      ${eyebrow}
      <div class="slide-head">
        ${iconHtml}
        <h2 class="slide-h">${escapeXml(slide.title)}</h2>
      </div>
      ${lead}
      ${stepsHtml}
      ${calloutHtml}
    </section>
  `
}

function renderRecapSlide(slide: Slide, num: string, total: string): string {
  const takeawayPattern = /<li[^>]*data-step="(\d+)"[^>]*>([\s\S]*?)<\/li>/g
  const items: { stepNum: string; content: string }[] = []
  let match: RegExpExecArray | null
  const body = slide.bodyHtml ?? ''
  while ((match = takeawayPattern.exec(body)) !== null) {
    const inner = match[2]
      .replace(/<span class="takeaway-icon">[\s\S]*?<\/span>/g, '')
      .replace(/<span>/g, '')
      .replace(/<\/span>/g, '')
      .trim()
    items.push({ stepNum: match[1], content: inner })
  }
  const recapItems = items.map(({ stepNum, content }, i) => `
    <div class="recap-item" data-step="${stepNum}">
      <div class="check">${String(i + 1).padStart(2, '0')}</div>
      <div class="text">${content}</div>
    </div>
  `).join('')

  return `
    <section class="slide recap-slide" data-slide="${num}">
      <div class="slide-num">${num} / ${total}</div>
      ${slide.eyebrow ? `<div class="eyebrow">${escapeXml(slide.eyebrow)}</div>` : ''}
      <h2 class="slide-h">${escapeXml(slide.title)}</h2>
      <div class="recap">
        <p class="lead">A quick recap before you move on.</p>
        <div class="recap-list">${recapItems}</div>
      </div>
    </section>
  `
}

function renderSlide(slide: Slide, idx: number, total: number, ICONS: Record<string, string>, theme: CourseTheme): string {
  const slideNum = idx + 1
  const numStr = String(slideNum).padStart(2, '0')
  const totalStr = String(total).padStart(2, '0')
  const isTitle = idx === 0
  const isRecap = slide.bodyHtml?.includes('class="takeaways"') ?? false
  if (isTitle) return renderTitleSlide(slide, numStr, totalStr, theme)
  if (isRecap) return renderRecapSlide(slide, numStr, totalStr)
  return renderContentSlide(slide, numStr, totalStr, ICONS)
}

function renderChapterHtml(chapter: Chapter, ICONS: Record<string, string>): string {
  const totalSlides = chapter.slides.length
  const theme: CourseTheme = chapter.theme ?? DEFAULT_THEME
  const courseLabel = chapter.courseId.toUpperCase().replace(/-/g, ' ')
  const slidesHtml = chapter.slides.map((slide, i) => renderSlide(slide, i, totalSlides, ICONS, theme)).join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeXml(chapter.title)} · Gennoor Academy</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap">
<style>
:root{
  --bg:#FAFAFA;--paper:#FFFFFF;
  --ink:#0F172A;--ink-soft:#475569;--ink-mute:#64748B;--ink-soft-2:#94A3B8;
  --line:#E2E8F0;--line-soft:#F1F5F9;
  --c-primary:${theme.primary};--c-primary-deep:${theme.primaryDeep};
  --c-cyan:${theme.cyan};--c-dark:${theme.navy};
  --c-accent:${theme.accent};--c-accent-light:${theme.accentLight};
  --c-tint:${theme.tint};
  --semantic-green:#10B981;--semantic-red:#EF4444;
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden}
body{
  background:var(--bg);color:var(--ink);
  font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Arial,sans-serif;
  font-size:18px;line-height:1.55;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility;
}
h1,h2,h3,.slide-h,.brand-wordmark .name,.brand-name{font-family:'Plus Jakarta Sans','Inter',-apple-system,sans-serif;font-feature-settings:'ss01','cv01'}
.app{position:fixed;inset:0;display:flex;flex-direction:column}
.topbar{height:56px;background:var(--c-dark);color:#fff;display:flex;align-items:center;padding:0 22px;gap:18px;border-bottom:1px solid rgba(255,255,255,.06);z-index:10;flex-shrink:0}
.brand-lockup{display:flex;align-items:center;gap:12px;flex-shrink:0}
.brand-mark{flex-shrink:0}
.brand-text{display:flex;flex-direction:column;line-height:1.1}
.brand-name{font-size:16px;font-weight:600;letter-spacing:.3px;color:#fff}
.brand-name .b-c1{color:var(--c-cyan)}
.brand-name .b-c2{color:var(--c-accent)}
.brand-name .b-w{color:#fff}
.brand-name .b-w-soft{color:rgba(255,255,255,.7);font-weight:500}
.brand-sub{font-size:10px;color:var(--c-accent);letter-spacing:1.5px;text-transform:uppercase;font-weight:600;font-family:'JetBrains Mono','SFMono-Regular','Menlo','Consolas',monospace;margin-top:2px}
.topbar .divider{width:1px;height:22px;background:rgba(255,255,255,.15)}
.topbar .chapter-title{font-size:15px;opacity:.78;letter-spacing:.2px;font-weight:400;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.topbar .meta{display:flex;gap:8px;align-items:center;flex-shrink:0}
.topbar .meta .pill{padding:3px 11px;background:rgba(255,255,255,.10);border-radius:4px;font-size:13px;font-weight:600;font-family:'JetBrains Mono','SFMono-Regular','Menlo','Consolas',monospace;letter-spacing:.5px}
.progress{height:3px;background:rgba(0,0,0,.05);position:relative;flex-shrink:0}
#progressFill{position:absolute;top:0;left:0;height:100%;width:0%;background:linear-gradient(90deg,var(--c-primary) 0%,var(--c-accent) 100%);transition:width .5s cubic-bezier(.4,0,.2,1)}
.stage{flex:1;position:relative;overflow:hidden;background:var(--bg)}
.slides{width:100%;height:100%;position:relative}
.slide{position:absolute;inset:0;padding:42px 64px 100px;display:flex;flex-direction:column;opacity:0;pointer-events:none;transition:opacity .35s ease;overflow-y:auto}
.slide.active{opacity:1;pointer-events:auto}
.slide-num{position:absolute;top:16px;right:24px;font-family:'JetBrains Mono','SFMono-Regular','Menlo','Consolas',monospace;font-size:12px;color:var(--ink-soft-2);letter-spacing:1.5px;font-weight:600;z-index:5}
[data-step]{opacity:0;transform:translateY(14px);transition:opacity .55s cubic-bezier(.2,.7,.3,1),transform .55s cubic-bezier(.2,.7,.3,1);pointer-events:none}
[data-step].revealed{opacity:1;transform:translateY(0);pointer-events:auto}

/* TITLE SLIDE */
.slide.title-slide{background:linear-gradient(135deg,${theme.navy} 0%,${theme.primaryDeep} 35%,${theme.primary} 70%,${theme.accent} 130%);color:#fff;justify-content:center;padding:120px 80px;overflow:hidden}
.slide.title-slide::before{content:"";position:absolute;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,${theme.accent}33 0%,transparent 70%);top:-200px;right:-200px;pointer-events:none}
.slide.title-slide::after{content:"";position:absolute;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,${theme.cyan}3F 0%,transparent 70%);bottom:-160px;left:-160px;pointer-events:none}
.slide.title-slide .slide-num{color:rgba(255,255,255,.55)}
.slide.title-slide .brand-full{position:absolute;top:42px;left:64px;display:flex;align-items:center;gap:16px;z-index:2}
.slide.title-slide .brand-wordmark{display:flex;flex-direction:column;line-height:1}
.slide.title-slide .brand-wordmark .name{font-size:24px;font-weight:600;letter-spacing:.5px;color:#fff}
.slide.title-slide .brand-wordmark .name .b-c1{color:var(--c-cyan)}
.slide.title-slide .brand-wordmark .name .b-c2{color:var(--c-accent-light)}
.slide.title-slide .brand-wordmark .tag{font-size:11px;color:var(--c-accent-light);letter-spacing:3px;font-weight:600;font-family:'JetBrains Mono','SFMono-Regular','Menlo','Consolas',monospace;margin-top:5px;text-transform:uppercase}
.slide.title-slide .title-inner{position:relative;z-index:2;max-width:1100px}
.slide.title-slide .eyebrow{font-family:'JetBrains Mono','SFMono-Regular','Menlo','Consolas',monospace;font-size:14px;letter-spacing:3px;color:var(--c-accent-light);margin-bottom:18px;font-weight:600;text-transform:uppercase}
.slide.title-slide h1{font-size:64px;line-height:1.1;font-weight:700;letter-spacing:-1.2px;margin-bottom:20px;color:#fff}
.slide.title-slide h1 em{font-style:normal;color:var(--c-accent-light);font-weight:700}
.slide.title-slide .subtitle{font-size:21px;line-height:1.55;color:rgba(255,255,255,.92);font-weight:400;max-width:880px}
.slide.title-slide .subtitle em{color:var(--c-accent-light);font-style:italic;font-weight:600}
.slide.title-slide .subtitle strong{color:#fff;font-weight:600}

/* CONTENT SLIDE */
.slide.content-slide{padding:42px 64px 100px}
.slide .eyebrow{font-family:'JetBrains Mono','SFMono-Regular','Menlo','Consolas',monospace;font-size:12px;letter-spacing:2.5px;color:var(--c-primary);margin-bottom:12px;font-weight:700;text-transform:uppercase}
.slide-head{display:flex;align-items:flex-start;gap:16px;margin-bottom:18px}
.slide-icon{width:48px;height:48px;flex-shrink:0;border-radius:10px;background:linear-gradient(135deg,var(--c-primary),var(--c-primary-deep));color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 16px -4px ${theme.primary}66}
.slide-icon svg{width:24px;height:24px}
.slide h2.slide-h{font-size:38px;font-weight:700;letter-spacing:-.6px;line-height:1.15;color:var(--c-dark);flex-grow:1;padding-top:4px}
.slide h2.slide-h em{font-style:normal;color:var(--c-accent);font-weight:700}
.slide p{font-size:17px;color:var(--ink-soft);margin-bottom:14px}
.slide p:last-child{margin-bottom:0}
.slide .lead{font-size:19px;color:var(--ink);line-height:1.5;max-width:1000px;margin-bottom:20px}
.slide .lead em{color:var(--c-accent);font-style:italic;font-weight:600}
.slide em{color:var(--c-accent);font-style:italic;font-weight:600}
.slide strong{color:var(--c-dark);font-weight:700}

/* CARDS GRID */
.cards{display:grid;gap:14px;margin-top:14px;max-width:1320px}
.cards.cols-2{grid-template-columns:repeat(2,1fr)}
.cards.cols-3{grid-template-columns:repeat(3,1fr)}
.card{background:var(--paper);border:1px solid var(--line);border-top:3px solid var(--c-primary);border-radius:6px;padding:20px 22px;position:relative;box-shadow:0 1px 3px rgba(15,23,42,.04);display:flex;flex-direction:column;gap:6px}
.card-num{font-size:22px;color:var(--c-primary);font-weight:700;line-height:1;letter-spacing:-.5px;font-family:'JetBrains Mono','SFMono-Regular','Menlo','Consolas',monospace}
.card:has(.step-card.accent-amber){border-top-color:var(--c-accent)}
.card:has(.step-card.accent-red){border-top-color:var(--semantic-red)}
.card:has(.step-card.accent-green){border-top-color:var(--semantic-green)}
.card:has(.step-card.accent-amber) .card-num{color:var(--c-accent)}
.card:has(.step-card.accent-red) .card-num{color:var(--semantic-red)}
.card:has(.step-card.accent-green) .card-num{color:var(--semantic-green)}

/* Old step-card markup re-styled for cards */
.step-card{background:transparent;border:0;padding:0;margin:0;display:flex;flex-direction:column;gap:6px;box-shadow:none}
.step-card .step-icon{width:32px;height:32px;border-radius:7px;display:flex;align-items:center;justify-content:center;color:#fff;margin-bottom:4px}
.step-card .step-icon svg{width:16px;height:16px}
.step-card.accent-blue .step-icon{background:linear-gradient(135deg,#3B82F6,var(--c-primary))}
.step-card.accent-amber .step-icon{background:linear-gradient(135deg,#FBBF24,var(--c-accent))}
.step-card.accent-red .step-icon{background:linear-gradient(135deg,#F87171,var(--semantic-red))}
.step-card.accent-green .step-icon{background:linear-gradient(135deg,#4ADE80,var(--semantic-green))}
.step-card .step-content h3{font-size:17px;font-weight:700;color:var(--c-dark);margin-bottom:5px;letter-spacing:-.2px;line-height:1.25}
.step-card .step-content p{font-size:14.5px;color:var(--ink-soft);margin:0;line-height:1.55}

/* CALLOUTS */
.callout{margin-top:22px;padding:16px 22px;border-radius:6px;display:flex;gap:14px;align-items:flex-start;max-width:1100px}
.callout-icon{width:32px;height:32px;flex-shrink:0;border-radius:7px;display:flex;align-items:center;justify-content:center;color:#fff}
.callout-icon svg{width:16px;height:16px}
.callout > div:last-child{flex:1}
.callout-title{font-family:'JetBrains Mono','SFMono-Regular','Menlo','Consolas',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-bottom:5px;font-weight:700}
.callout-body{font-size:15.5px;line-height:1.55;color:var(--c-dark)}
.callout-body em{color:var(--c-accent);font-style:italic;font-weight:600}
.callout-info{background:${theme.tint};border-left:4px solid var(--c-primary)}
.callout-info .callout-icon{background:var(--c-primary)}
.callout-info .callout-title{color:var(--c-primary-deep)}
.callout-tip{background:${theme.accentLight}33;border-left:4px solid var(--c-accent)}
.callout-tip .callout-icon{background:var(--c-accent)}
.callout-tip .callout-title{color:#92400E}
.callout-warning{background:#FEF2F2;border-left:4px solid var(--semantic-red)}
.callout-warning .callout-icon{background:var(--semantic-red)}
.callout-warning .callout-title{color:#B91C1C}

/* RECAP SLIDE */
.slide.recap-slide{padding:42px 64px 100px;background:linear-gradient(180deg,var(--bg) 0%,#F1F5F9 100%)}
.recap{max-width:980px;margin-top:8px}
.recap .lead{font-size:17px;color:var(--ink-soft);margin-bottom:22px}
.recap-list{display:grid;gap:12px}
.recap-item{background:var(--paper);border:1px solid var(--line);border-left:3px solid var(--c-primary);padding:16px 22px;border-radius:6px;display:flex;gap:16px;align-items:flex-start;box-shadow:0 1px 3px rgba(15,23,42,.04)}
.recap-item .check{flex-shrink:0;width:34px;height:34px;border-radius:7px;background:linear-gradient(135deg,var(--c-primary),var(--c-primary-deep));color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;font-family:'JetBrains Mono','SFMono-Regular','Menlo','Consolas',monospace;letter-spacing:.5px}
.recap-item .text{font-size:17px;color:var(--c-dark);line-height:1.45;font-weight:500;padding-top:6px;flex:1}
.recap-item .text em{color:var(--c-accent);font-style:italic;font-weight:600}
.recap-item .text strong{color:var(--c-dark)}

/* CONTROLS (hidden by parent iframe script) */
.controls-top{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:6px;background:var(--c-dark);padding:8px 12px;border-radius:6px;box-shadow:0 8px 24px rgba(12,20,38,.30);z-index:15}
.controls-top button{width:34px;height:34px;border:0;background:transparent;color:#fff;cursor:pointer;font-size:20px;display:flex;align-items:center;justify-content:center;border-radius:4px;transition:.15s}
.controls-top button:hover{background:rgba(255,255,255,.12)}
.controls-top button:disabled{opacity:.3;cursor:not-allowed}
.controls-top .counter,.controls-top #counter{font-family:'JetBrains Mono','SFMono-Regular','Menlo','Consolas',monospace;font-size:13px;font-weight:600;color:#fff;letter-spacing:.5px;padding:0 12px;min-width:60px;text-align:center}
#stepIndicator{position:fixed;bottom:72px;left:50%;transform:translateX(-50%);background:rgba(12,20,38,.85);color:var(--c-accent);padding:5px 14px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:2px;font-family:'JetBrains Mono','SFMono-Regular','Menlo','Consolas',monospace;z-index:14;text-transform:uppercase;backdrop-filter:blur(8px)}

@media (max-width:900px){
  .slide{padding:32px 24px 100px}
  .slide.title-slide{padding:90px 24px}
  .slide.title-slide .brand-full{top:20px;left:24px}
  .slide.title-slide h1{font-size:38px}
  .slide.title-slide .subtitle{font-size:17px}
  .slide h2.slide-h{font-size:26px}
  .slide-head{flex-direction:column;gap:12px}
  .cards.cols-3,.cards.cols-2{grid-template-columns:1fr}
  .topbar{padding:0 14px;gap:10px}
  .topbar .chapter-title{display:none}
}
</style>
</head>
<body>
<div class="app">
  <div class="topbar">
    <div class="brand-lockup">
      ${gennoorBrandMark(28, theme)}
      <div class="brand-text">
        <span class="brand-name"><span class="b-w">Ge</span><span class="b-c1">nn</span><span class="b-c2">oo</span><span class="b-c1">r</span><span class="b-w-soft"> Academy</span></span>
        <span class="brand-sub">${courseLabel}</span>
      </div>
    </div>
    <div class="divider"></div>
    <div class="chapter-title">${escapeXml(chapter.title)}</div>
    <div class="meta"><span class="pill" id="counterTop">01 / ${String(totalSlides).padStart(2, '0')}</span></div>
  </div>
  <div class="progress"><div id="progressFill"></div></div>
  <div class="stage">
    <div class="slides">
      ${slidesHtml}
    </div>
  </div>
</div>
<div class="controls-top">
  <button id="prevBtn" title="Previous">‹</button>
  <span class="counter" id="counter">1 / ${totalSlides}</span>
  <button id="nextBtn" title="Next">›</button>
</div>
<div id="stepIndicator">Step 1</div>
<script>
(function(){
  var slides = document.querySelectorAll('.slide');
  var totalSlides = slides.length;
  var currentSlide = 1;
  var counter = document.getElementById('counter');
  var counterTop = document.getElementById('counterTop');
  var progressFill = document.getElementById('progressFill');
  var stepIndicator = document.getElementById('stepIndicator');
  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');
  function pad(n){return String(n).padStart(2,'0')}
  function show(n){
    if(n<1||n>totalSlides) return;
    currentSlide=n;
    slides.forEach(function(s,i){s.classList.toggle('active',i===n-1)});
    if(counter) counter.textContent = n+' / '+totalSlides;
    if(counterTop) counterTop.textContent = pad(n)+' / '+pad(totalSlides);
    if(progressFill) progressFill.style.width = ((n/totalSlides)*100)+'%';
    var active = slides[n-1];
    active.querySelectorAll('[data-step]').forEach(function(s){s.classList.remove('revealed')});
    updateStepIndicator();
  }
  function updateStepIndicator(){
    var active = slides[currentSlide-1];
    var steps = active.querySelectorAll('[data-step]');
    var revealed = active.querySelectorAll('[data-step].revealed');
    if(!stepIndicator) return;
    if(steps.length===0){stepIndicator.style.display='none'}
    else{stepIndicator.style.display='block';stepIndicator.textContent='Step '+revealed.length+' / '+steps.length}
  }
  function advanceStep(){
    var active = slides[currentSlide-1];
    var next = active.querySelector('[data-step]:not(.revealed)');
    if(next){next.classList.add('revealed');updateStepIndicator();return true}
    return false
  }
  if(prevBtn) prevBtn.addEventListener('click',function(){if(currentSlide>1)show(currentSlide-1)});
  if(nextBtn) nextBtn.addEventListener('click',function(){if(!advanceStep()&&currentSlide<totalSlides)show(currentSlide+1)});
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
  await blob.uploadData(body, { blobHTTPHeaders: { blobContentType: contentType } })
}

// ─────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────

interface BuildOptions {
  htmlOnly: boolean
}

async function build(chapter: Chapter, ICONS: Record<string, string>, opts: BuildOptions): Promise<void> {
  console.log(`\n→ ${chapter.chapterId} · "${chapter.title}" · ${chapter.slides.length} slides${opts.htmlOnly ? ' · HTML only' : ''}`)
  const stagingDir = path.join(PROJECT_ROOT, 'tmp', 'academy-build', chapter.courseId)
  const audioDir = path.join(stagingDir, 'audio', chapter.chapterId)

  if (!opts.htmlOnly) {
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
  }

  const html = renderChapterHtml(chapter, ICONS)
  const htmlPath = path.join(stagingDir, 'chapters', `${chapter.chapterSlug}.html`)
  await mkdir(path.dirname(htmlPath), { recursive: true })
  await writeFile(htmlPath, html, 'utf8')
  const htmlBlobPath = `courses/${chapter.courseId}/chapters/${chapter.chapterSlug}.html`
  await uploadToBlob(htmlBlobPath, Buffer.from(html, 'utf8'), 'text/html; charset=utf-8')
  console.log(`  ✓ HTML ${(html.length / 1024).toFixed(1)} KB → ${htmlBlobPath}`)
}

const { ICONS } = await import('./chapters-data/index.ts')

const args = process.argv.slice(2)
const target = args[0] ?? 'chapter-01'
const htmlOnly = args.includes('--html-only')

async function main() {
  const opts: BuildOptions = { htmlOnly }
  if (target === 'all') {
    const ids = Object.keys(chapters).sort()
    console.log(`Building ALL chapters: ${ids.join(', ')}${htmlOnly ? ' · HTML only' : ''}\n`)
    for (const id of ids) {
      await build(chapters[id], ICONS, opts)
    }
  } else {
    const chapter = chapters[target]
    if (!chapter) {
      console.error(`Unknown chapterId: ${target}. Available: ${Object.keys(chapters).join(', ')}`)
      process.exit(1)
    }
    await build(chapter, ICONS, opts)
  }
  console.log('\n✓ All done.')
}

main().catch((err) => {
  console.error('Build failed:', err)
  process.exit(1)
})
