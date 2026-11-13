/**
 * Draws the logo pictures that sit at the top of every email the site sends.
 *
 *   node scripts/email-art/logo.mjs            writes public/email/header.png and public/email/logo-dark.png
 *   node scripts/email-art/logo.mjs --look DIR also writes a preview of each at the size an email shows it
 *
 * Why they are drawn here and not taken from public/logos: those PNG files were made on a machine without the
 * brand's lettering, so the name came out in a stand-in font, and the line under it in a grey too pale to read.
 * The owner (13 November 2026): "When it comes to our logo, we can have it defined more appropriately."
 * This draws the same mark as src/components/GennoorLogo.tsx, in Plus Jakarta Sans and Sora, twice the size an
 * email shows it, so it is sharp on a phone.
 *
 *   header.png      the top of the light emails (emailShell): the logo in the middle of a light band, with the
 *                   logo's own ring of dots, large and pale, at both ends. One picture, so it looks the same
 *                   in Outlook, Gmail and on a phone, and it has its own ground, so an email app that turns
 *                   pages dark cannot make the name unreadable.
 *   logo-dark.png   the logo for the dark briefing emails (briefShell), on that email's own card colour.
 *
 * Needs Chrome on this machine and the internet once (the two fonts come from Google Fonts). It stops, and
 * writes nothing, if the fonts did not load: a logo in the wrong lettering is what this replaces.
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync, readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const OUT = path.join(ROOT, 'public', 'email')
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const lookAt = process.argv.includes('--look') ? process.argv[process.argv.indexOf('--look') + 1] : ''

// The mark, as in GennoorLogo.tsx ("hero"): twelve dots of a ring open on the right, and a bar of three.
const ARC = [[98.1, 77.7], [86.5, 92.6], [69.7, 100.9], [50.9, 101], [34, 92.9], [22.2, 78.3], [18, 60], [22.2, 41.7], [34, 27.1], [50.9, 19], [69.7, 19.1], [86.5, 27.4]]
const BAR = [[74, 60], [88, 60], [102, 60]]

/** The logo as SVG markup, in a box of 352 x 120 units. `c` are its colours. */
function logo(c) {
  const dots = ARC.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5.5" fill="${c.ring}"/>`).join('')
  const bar = BAR.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="5.5" fill="${i < 2 ? c.gold : c.ring}"/>`).join('')
  return `${dots}${bar}
    <text x="128" y="62" font-family="'Plus Jakarta Sans'" font-size="32" font-weight="800" letter-spacing="0.2"><tspan fill="${c.name}">Ge</tspan><tspan fill="${c.ring}">nn</tspan><tspan fill="${c.gold}">oo</tspan><tspan fill="${c.ring}">r</tspan><tspan fill="${c.tech}"> Tech</tspan></text>
    <text x="129.5" y="84" font-family="'Sora'" font-size="10.4" font-weight="600" fill="${c.tag}" letter-spacing="3.1">TRAIN. INNOVATE. BUILD.</text>`
}

// The light header: 600 x 128 in an email, drawn at twice that. The logo fills well over half its width, so the
// name can still be read when a phone shows the whole picture 350 wide.
const HEADER = { w: 1200, h: 256 }

/**
 * The brand's only ornament is the ring of dots. Here it is large and pale: an arc of evenly spaced dots, part
 * of a ring whose centre is at (cx, cy). `gold` colours the dot on the middle line, as the logo's bar does.
 */
function arc(cx, cy, radius, dot, gap, colour, gold) {
  const step = gap / radius
  let out = ''
  for (let k = -6; k <= 6; k++) {
    const x = cx + radius * Math.cos(k * step), y = cy + radius * Math.sin(k * step)
    if (y < -dot || y > HEADER.h + dot) continue
    out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${dot}" fill="${k === 0 && gold ? gold : colour}"/>`
  }
  return out
}
/** Three arcs, like ripples, coming in from the left end of the header. Mirrored for the right end. */
const ripples = () => `${arc(-160, 128, 236, 13, 50, '#cfdcf7', '#f9d99a')}${arc(-160, 128, 318, 10, 50, '#dde7fa', '')}${arc(-160, 128, 392, 7, 50, '#e8eefb', '')}`

const LIGHT = { ring: '#2563EB', gold: '#F59E0B', name: '#16213a', tech: '#3d4b63', tag: '#5b6b84' }
const DARK = { ring: '#6ea8ff', gold: '#ffb020', name: '#ffffff', tech: '#e8eefb', tag: '#9db4d6' }

const headerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${HEADER.w}" height="${HEADER.h}" viewBox="0 0 ${HEADER.w} ${HEADER.h}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f8fafd"/><stop offset="1" stop-color="#eaf0fa"/></linearGradient></defs>
  <rect width="${HEADER.w}" height="${HEADER.h}" fill="url(#g)"/>
  <g>${ripples()}</g>
  <g transform="translate(${HEADER.w} 0) scale(-1 1)">${ripples()}</g>
  <g transform="translate(${(HEADER.w - 352 * 2) / 2 - 8} ${(HEADER.h - 120 * 2) / 2 + 2}) scale(2)">${logo(LIGHT)}</g>
  <rect y="${HEADER.h - 2}" width="${HEADER.w}" height="2" fill="#dde6f5"/>
</svg>`

// The logo for the dark briefing: 182 x 60 in an email, drawn at four times that. The ground is the card's own colour.
const DARK_LOGO = { w: 728, h: 240, ground: '#0c1426' }
const darkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${DARK_LOGO.w}" height="${DARK_LOGO.h}" viewBox="0 0 364 120">
  <rect width="364" height="120" fill="${DARK_LOGO.ground}"/>${logo(DARK)}</svg>`

const page = (svg, w, h) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Sora:wght@400;600&display=swap" rel="stylesheet">
<style>html,body{margin:0;padding:0;background:#fff}svg{display:block}</style></head><body style="width:${w}px;height:${h}px">${svg}</body></html>`

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })
try {
  mkdirSync(OUT, { recursive: true })
  for (const [name, svg, size] of [['header.png', headerSvg, HEADER], ['logo-dark.png', darkSvg, DARK_LOGO]]) {
    const tab = await browser.newPage()
    await tab.setViewport({ width: size.w, height: size.h, deviceScaleFactor: 1 })
    await tab.setContent(page(svg, size.w, size.h), { waitUntil: 'networkidle0', timeout: 60000 })
    const fonts = await tab.evaluate(async () => {
      await Promise.all([document.fonts.load('800 32px "Plus Jakarta Sans"'), document.fonts.load('600 10px "Sora"')])
      await document.fonts.ready
      return document.fonts.check('800 32px "Plus Jakarta Sans"') && document.fonts.check('600 10px "Sora"')
    })
    if (!fonts) throw new Error('The brand fonts did not load (is the internet reachable?). Nothing was written.')
    await new Promise((r) => setTimeout(r, 300))
    await tab.screenshot({ path: path.join(OUT, name), clip: { x: 0, y: 0, width: size.w, height: size.h } })
    console.log(`public/email/${name}  ${size.w} x ${size.h}`)
    await tab.close()
  }
  if (lookAt) {
    mkdirSync(lookAt, { recursive: true })
    const tab = await browser.newPage()
    await tab.setViewport({ width: 700, height: 420, deviceScaleFactor: 2 })
    // The pictures are put into the page itself: a page made from text may not open files by their address
    const src = (f) => `data:image/png;base64,${readFileSync(path.join(OUT, f)).toString('base64')}`
    await tab.setContent(`<body style="margin:0;padding:24px;background:#f1f5f9;font-family:Segoe UI,Arial">
      <div style="width:600px;border-radius:14px;overflow:hidden;border:1px solid #e2e8f0;background:#fff"><img src="${src('header.png')}" width="600" style="display:block;width:100%"><div style="padding:22px 30px;color:#374151">The body of a light email begins here.</div></div>
      <div style="width:600px;margin-top:18px;border-radius:20px;background:#0c1426;border:1px solid #24365c"><div style="padding:22px 28px 0"><img src="${src('logo-dark.png')}" width="182" style="display:block"></div><div style="padding:16px 28px 22px;color:#c9d6ea">The body of a dark briefing begins here.</div></div>
      <div style="width:330px;margin-top:18px;border-radius:14px;overflow:hidden;border:1px solid #e2e8f0;background:#fff"><img src="${src('header.png')}" width="330" style="display:block;width:100%"><div style="padding:14px 18px;color:#374151;font-size:14px">On a phone.</div></div>
    </body>`, { waitUntil: 'load' })
    await new Promise((r) => setTimeout(r, 400))
    await tab.screenshot({ path: path.join(lookAt, 'email-logos.png'), fullPage: true })
    console.log(`preview: ${path.join(lookAt, 'email-logos.png')}`)
  }
} finally {
  await browser.close()
}
