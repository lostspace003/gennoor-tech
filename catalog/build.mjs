/**
 * Builds the one-page catalogue from catalog/catalogue.html:
 *   catalog/Gennoor-Tech-Catalogue.pdf         A4 landscape, every card and contact a clickable link (attach to emails)
 *   catalog/Gennoor-Tech-Catalogue.png         the same page as a picture, twice the size, for slides or posts
 *   catalog/Gennoor-Tech-Catalogue-email.png   one tall column, 600 wide at twice the size: to put inside an email
 * and copies the PDF and the email picture to public/Gennoor-Tech-Catalog/, where an email can link to them.
 *   node catalog/build.mjs
 * Needs Chrome on this machine and the internet once (the brand's fonts come from Google Fonts). It stops, and
 * writes nothing, if the fonts did not load.
 */
import { createRequire } from 'module'
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '..')
const require = createRequire(path.join(ROOT, 'package.json'))
const puppeteer = require('puppeteer-core')
const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const icons = require('lucide-react')
const { lineIcon, brandMark } = await import('../scripts/email-art/line-icons.mjs')
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe'

// The Gennoor mark, as in scripts/email-art/logo.mjs and src/components/GennoorLogo.tsx
const ARC = [[98.1, 77.7], [86.5, 92.6], [69.7, 100.9], [50.9, 101], [34, 92.9], [22.2, 78.3], [18, 60], [22.2, 41.7], [34, 27.1], [50.9, 19], [69.7, 19.1], [86.5, 27.4]]
const BAR = [[74, 60], [88, 60], [102, 60]]
const C = { ring: '#2563EB', gold: '#F59E0B', name: '#16213a', tech: '#3d4b63', tag: '#5b6b84' }
const LOGO = `<svg class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="8 10 344 100">${ARC.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5.5" fill="${C.ring}"/>`).join('')}${BAR.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="5.5" fill="${i < 2 ? C.gold : C.ring}"/>`).join('')}
<text x="128" y="62" font-family="'Plus Jakarta Sans'" font-size="32" font-weight="800" letter-spacing="0.2"><tspan fill="${C.name}">Ge</tspan><tspan fill="${C.ring}">nn</tspan><tspan fill="${C.gold}">oo</tspan><tspan fill="${C.ring}">r</tspan><tspan fill="${C.tech}"> Tech</tspan></text>
<text x="129.5" y="84" font-family="'Sora'" font-size="10.4" font-weight="600" fill="${C.tag}" letter-spacing="3.1">TRAIN. INNOVATE. BUILD.</text></svg>`

/** A small line icon in the text (its colour and weight come from the page's CSS, svg.mi). */
function icon(name) {
  const I = icons[name]
  if (!I) throw new Error(`There is no lucide icon called ${name}`)
  return renderToStaticMarkup(React.createElement(I, { className: 'mi' }))
}

const cpn = readFileSync(path.join(ROOT, 'public', 'cpn', 'cpn-certified-horizontal.svg'))
const html = readFileSync(path.join(HERE, 'catalogue.html'), 'utf8')
  .replace(/\{\{li:(\w+):(\w+)\}\}/g, (_, n, w) => lineIcon(n, { wash: w }))
  .replace(/\{\{mi:(\w+)\}\}/g, (_, n) => icon(n))
  .replace(/\{\{mark:(microsoft|claude)(?::(\d+))?\}\}/g, (_, m, s) => brandMark(m, s ? Number(s) : 13))
  .replace('{{logo}}', LOGO)
  .replace('../public/cpn/cpn-certified-horizontal.svg', `data:image/svg+xml;base64,${cpn.toString('base64')}`)

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })
try {
  const open = async (width, height, email) => {
    const tab = await browser.newPage()
    await tab.setViewport({ width, height, deviceScaleFactor: 2 })
    await tab.setContent(email ? html.replace('<body>', '<body class="email">') : html, { waitUntil: 'networkidle0', timeout: 60000 })
    const ok = await tab.evaluate(async () => {
      await Promise.all([document.fonts.load('800 20px "Plus Jakarta Sans"'), document.fonts.load('700 11px "Sora"')])
      await document.fonts.ready
      return document.fonts.check('800 20px "Plus Jakarta Sans"') && document.fonts.check('700 11px "Sora"')
    })
    if (!ok) throw new Error('The brand fonts did not load (is the internet reachable?). Nothing was written.')
    await new Promise((r) => setTimeout(r, 300))
    return tab
  }

  const page = await open(1123, 794, false)
  const pdf = path.join(HERE, 'Gennoor-Tech-Catalogue.pdf')
  await page.pdf({ path: pdf, width: '1123px', height: '794px', printBackground: true, pageRanges: '1' })
  await page.screenshot({ path: path.join(HERE, 'Gennoor-Tech-Catalogue.png'), clip: { x: 0, y: 0, width: 1123, height: 794 } })

  const mail = await open(600, 900, true)
  const tall = await mail.evaluate(() => document.querySelector('.page').getBoundingClientRect().height)
  const emailPng = path.join(HERE, 'Gennoor-Tech-Catalogue-email.png')
  await mail.screenshot({ path: emailPng, clip: { x: 0, y: 0, width: 600, height: Math.ceil(tall) } })

  const pub = path.join(ROOT, 'public', 'Gennoor-Tech-Catalog')
  mkdirSync(pub, { recursive: true })
  copyFileSync(pdf, path.join(pub, 'Gennoor-Tech-Catalogue.pdf'))
  copyFileSync(emailPng, path.join(pub, 'Gennoor-Tech-Catalogue-email.png'))
  writeFileSync(path.join(HERE, '.built.html'), html)
  console.log(`written: catalog/Gennoor-Tech-Catalogue.pdf, .png, -email.png (600 x ${Math.ceil(tall)}), and the PDF and email picture in public/Gennoor-Tech-Catalog/`)
} finally {
  await browser.close()
}
