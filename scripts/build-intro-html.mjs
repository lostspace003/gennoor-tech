// Build chapter-00 intro HTML for academy courses.
// Pure HTML — no audio, no cues. Renders course title, 3 takeaways,
// "Let's Begin" button. Button posts a message that the parent ChapterViewer
// catches to advance to chapter-01 (or any first real chapter).

import fs from 'node:fs'
import path from 'node:path'

const SHARED_CSS = `
:root {
  --c-primary: #475569;
  --c-primary-deep: #334155;
  --c-accent: #F97316;
  --c-tint: #F8FAFC;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; -webkit-font-smoothing: antialiased; color: #0F172A; background: var(--c-tint); }
h1, h2, h3, h4, h5, h6 { font-family: 'Sora', 'Inter', sans-serif; }
.wrap { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px 24px; text-align: center; background: linear-gradient(140deg, var(--c-tint) 0%, #ffffff 100%); }
.eyebrow { font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 700; color: var(--c-accent); margin-bottom: 16px; }
.title { font-size: clamp(28px, 4vw, 44px); font-weight: 800; line-height: 1.15; max-width: 880px; margin-bottom: 14px; color: var(--c-primary-deep); letter-spacing: -0.02em; }
.subtitle { font-size: clamp(15px, 1.4vw, 18px); line-height: 1.55; color: #475569; max-width: 720px; margin-bottom: 36px; }
.takeaways { display: grid; gap: 14px; max-width: 720px; width: 100%; margin-bottom: 40px; }
@media (min-width: 760px) { .takeaways { grid-template-columns: 1fr 1fr 1fr; gap: 16px; } }
.takeaway { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px 18px 18px 18px; text-align: left; display: flex; gap: 12px; align-items: flex-start; box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04); transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease; }
.takeaway:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08); border-color: #cbd5e1; }
.takeaway .num { flex-shrink: 0; width: 28px; height: 28px; border-radius: 50%; background: var(--c-accent); color: #fff; font-weight: 700; font-size: 13px; display: flex; align-items: center; justify-content: center; }
.takeaway .text { font-size: 14px; line-height: 1.5; color: #0F172A; }
.cta { display: inline-flex; align-items: center; gap: 10px; padding: 16px 32px; background: var(--c-primary-deep); color: #fff; border: none; border-radius: 14px; font-size: 16px; font-weight: 700; cursor: pointer; box-shadow: 0 6px 20px rgba(51, 65, 85, 0.25); transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease; letter-spacing: 0.01em; }
.cta:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(51, 65, 85, 0.32); background: var(--c-primary); }
.cta:active { transform: translateY(0); }
.foot { margin-top: 28px; font-size: 12px; color: #64748b; }
.meta { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; margin-top: 8px; margin-bottom: 24px; font-size: 13px; color: #475569; }
.meta span { display: inline-flex; align-items: center; gap: 6px; }
.dot { width: 4px; height: 4px; border-radius: 50%; background: #cbd5e1; }
`

const SHARED_JS = (nextHref) => `
// Notify parent ChapterViewer that this is the intro screen so the audio
// player can be hidden and the slide-progress signal stays at "ready".
window.parent.postMessage({ type: 'gennoor-slide-progress', percent: 0, slideInfo: 'Intro · 1 / 1', totalSteps: 0, currentStep: 0, chapterId: 'chapter-00' }, '*')

document.getElementById('begin').addEventListener('click', function () {
  var nextHref = ${JSON.stringify(nextHref)}
  var inIframe = window.parent !== window
  if (inIframe) {
    // Parent (ChapterViewer) handles via Next.js router.push — a client-side
    // navigation that PRESERVES fullscreen state. A hard navigation here
    // (window.top.location.href) would exit fullscreen, so we don't do it.
    try {
      window.parent.postMessage({ type: 'gennoor-academy:advance', target: nextHref }, '*')
      return
    } catch (e) { /* fall through to hard nav as last resort */ }
  }
  window.location.href = nextHref
})
`

/**
 * Build a single intro HTML.
 * @param {object} spec
 * @param {string} spec.courseTagline - Top eyebrow line (e.g. "Strategy · AI for the C-Suite")
 * @param {string} spec.title - Course title
 * @param {string} spec.subtitle - One-line tagline shown under title
 * @param {{number: number, total: number}} spec.chapterMeta - Chapter count
 * @param {string} spec.duration - "~36 min"
 * @param {string} spec.level - "Intermediate"
 * @param {string[]} spec.takeaways - exactly 3 short outcome statements
 * @param {{primary: string, primaryDeep: string, accent: string, tint: string}} spec.theme
 * @param {string} spec.nextHref - URL to navigate to when Let's Begin is clicked
 * @param {string} spec.outPath - file path to write
 */
export function buildIntro(spec) {
  const t = spec.theme
  const takeaways = (spec.takeaways || []).slice(0, 3)
  while (takeaways.length < 3) takeaways.push('') // pad so layout is stable
  const themeCss = `:root { --c-primary: ${t.primary}; --c-primary-deep: ${t.primaryDeep}; --c-accent: ${t.accent}; --c-tint: ${t.tint}; }`

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
<title>${spec.title} — Welcome</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@500;600;700;800&display=swap" rel="stylesheet">
<style>${themeCss}${SHARED_CSS}</style>
</head>
<body>
<div class="wrap">
  <div class="eyebrow">${spec.courseTagline}</div>
  <h1 class="title">${spec.title}</h1>
  <p class="subtitle">${spec.subtitle}</p>

  <div class="meta">
    <span><strong>${spec.chapterMeta.total}</strong>&nbsp;chapters</span>
    <span class="dot"></span>
    <span><strong>${spec.duration}</strong></span>
    <span class="dot"></span>
    <span><strong>${spec.level}</strong></span>
  </div>

  <div class="takeaways">
    ${takeaways.map((tk, i) => tk ? `<div class="takeaway"><div class="num">${i + 1}</div><div class="text">${tk}</div></div>` : '').filter(Boolean).join('\n    ')}
  </div>

  <button class="cta" id="begin" type="button">
    Let&rsquo;s begin
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
  </button>
  <p class="foot">No audio on this screen. Once you press start, the chapter audio will play and slides auto-advance.</p>
</div>
<script>${SHARED_JS(spec.nextHref)}</script>
</body>
</html>`

  fs.mkdirSync(path.dirname(spec.outPath), { recursive: true })
  fs.writeFileSync(spec.outPath, html, 'utf8')
  console.log(`✓ ${path.basename(spec.outPath)} · ${(html.length / 1024).toFixed(1)} KB`)
}
