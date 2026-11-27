/**
 * PNG copies of the drawn line icons (./line-icons.mjs) for emails, which show no SVG: public/email/line/<name>.png,
 * 96 x 96, shown at 48. Each has its own white ground, so an email app that turns pages dark cannot lose the drawing.
 *   node scripts/email-art/icons-png.mjs
 */
import { createRequire } from 'module'
import { mkdirSync, statSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { brandMark, lineIcon } from './line-icons.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const require = createRequire(path.join(ROOT, 'package.json'))
const puppeteer = require('puppeteer-core')
const OUT = path.join(ROOT, 'public', 'email', 'line')
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe'

/** The icons an email uses: its file name, then what is drawn. Add a line here and run again. */
export const EMAIL_ICONS = {
  microsoft: () => `<div style="width:64px;height:64px;display:flex;align-items:center;justify-content:center"><div style="position:absolute;width:48px;height:48px;border-radius:50%;background:#eef2f9;left:11px;top:11px"></div><div style="position:relative">${brandMark('microsoft', 26)}</div></div>`,
  claude: () => `<div style="width:64px;height:64px;display:flex;align-items:center;justify-content:center"><div style="position:absolute;width:48px;height:48px;border-radius:50%;background:#f5e4dc;left:11px;top:11px"></div><div style="position:relative">${brandMark('claude', 30)}</div></div>`,
  assistant: () => lineIcon('Bot', { wash: 'mint' }),
  'course-ai-103': () => lineIcon('Bot', { wash: 'blue' }),
  'course-ai-500': () => lineIcon('Network', { wash: 'blue' }),
  'course-agents': () => lineIcon('Workflow', { wash: 'mint' }),
  'course-fabric': () => lineIcon('Activity', { wash: 'sky' }),
  'course-foundations': () => lineIcon('Sparkles', { wash: 'sand' }),
  'course-governance': () => lineIcon('ShieldCheck', { wash: 'lilac' }),
  'course-strategy': () => lineIcon('Compass', { wash: 'rose' }),
  'step-choose': () => lineIcon('MousePointerClick', { wash: 'blue' }),
  'step-access': () => lineIcon('KeyRound', { wash: 'sand' }),
  'step-debrief': () => lineIcon('MessagesSquare', { wash: 'mint' }),
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })
try {
  mkdirSync(OUT, { recursive: true })
  const tab = await browser.newPage()
  await tab.setViewport({ width: 64, height: 64, deviceScaleFactor: 1.5 })
  for (const [name, draw] of Object.entries(EMAIL_ICONS)) {
    await tab.setContent(`<!doctype html><html><body style="margin:0;background:#fff;width:64px;height:64px;position:relative">${draw()}</body></html>`)
    const file = path.join(OUT, `${name}.png`)
    await tab.screenshot({ path: file, clip: { x: 0, y: 0, width: 64, height: 64 } })
    console.log(`public/email/line/${name}.png  ${(statSync(file).size / 1024).toFixed(1)} KB`)
  }
} finally {
  await browser.close()
}
