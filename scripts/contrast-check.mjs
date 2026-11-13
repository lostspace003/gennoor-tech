/**
 * Can every word be read? Opens pages in the light look and in the dark look and measures each piece
 * of text against what is behind it. The owner's rule (13 November 2026): "when you change it to the
 * light mode, the font should be properly visible."
 *
 *   npx next dev -p 3111                                            (in another terminal)
 *   node scripts/contrast-check.mjs home ai-weekend contact        both looks
 *   node scripts/contrast-check.mjs --light resources/blog          one look
 *   SITE=https://www.gennoor.com node scripts/contrast-check.mjs home
 *
 * It lists text whose contrast is under 3 to 1 (hard to read for anyone) and counts text under 4.5 to 1
 * (the usual standard for small text). What is behind a word is taken from the nearest thing with a
 * colour of its own; over a gradient it is the gradient's lightest and darkest colour, and the worse of
 * the two counts. Text over a photograph or a film cannot be measured this way and is left out, so this
 * does not replace looking at the page (node scripts/shot.mjs). Pages are named without the leading
 * slash; the home page is "home".
 */
import puppeteer from 'puppeteer-core'

const args = process.argv.slice(2)
const themes = args.includes('--light') ? ['light'] : args.includes('--dark') ? ['dark'] : ['light', 'dark']
const pages = args.filter((a) => !a.startsWith('--'))
const base = process.env.SITE || 'http://localhost:3111'
if (!pages.length) { console.log('Name at least one page, for example: node scripts/contrast-check.mjs home ai-weekend'); process.exit(1) }

const browser = await puppeteer.launch({ executablePath: process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
let hard = 0
for (const theme of themes) {
  const context = await browser.createBrowserContext()
  const page = await context.newPage()
  await page.setViewport({ width: 1366, height: 900, deviceScaleFactor: 1 })
  await page.evaluateOnNewDocument((t) => { try { localStorage.setItem('gennoor.theme', t) } catch { /* no storage */ } }, theme)
  for (const p of pages) {
    await page.goto(`${base}/${p === 'home' ? '' : p.replace(/^\/+/, '')}`, { waitUntil: 'domcontentloaded', timeout: 120000 }).catch((e) => console.log(`${p}: ${e.message}`))
    await new Promise((r) => setTimeout(r, 3000))
    // walk down the page, so things that arrive when they come into view are there
    await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)) } window.scrollTo(0, 0) })
    await new Promise((r) => setTimeout(r, 700))
    const found = await page.evaluate(() => {
      const parse = (c) => { const m = String(c).match(/rgba?\(([^)]+)\)/); if (!m) return null; const v = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return [v[0], v[1], v[2], v.length > 3 ? v[3] : 1] }
      const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b) }
      const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05) }
      const over = (top, under) => { const a = top[3]; return [0, 1, 2].map((i) => Math.round(top[i] * a + under[i] * (1 - a))) }
      // What is behind an element: every see-through colour on the way up is laid over the first solid one.
      // Returns the candidates (one colour, or the ends of a gradient), or null over a picture.
      const behind = (el) => {
        const layers = []
        for (let e = el; e; e = e.parentElement) {
          const cs = getComputedStyle(e)
          const img = cs.backgroundImage
          if (img && img !== 'none') {
            if (/url\(/.test(img)) return null
            const stops = [...img.matchAll(/rgba?\([^)]+\)/g)].map((m) => parse(m[0])).filter((c) => c && c[3] > 0.5)
            if (stops.length) { const sorted = stops.sort((a, b) => lum(a) - lum(b)); return [sorted[0], sorted[sorted.length - 1]].map((c) => layers.reduceRight((u, t) => over(t, u), c.slice(0, 3))) }
          }
          const c = parse(cs.backgroundColor)
          if (c && c[3] >= 0.98) return [layers.reduceRight((u, t) => over(t, u), c.slice(0, 3))]
          if (c && c[3] > 0.02) layers.push(c)
          if (e.tagName === 'VIDEO' || e.tagName === 'IMG' || e.tagName === 'CANVAS') return null
        }
        const root = parse(getComputedStyle(document.body).backgroundColor)
        return [layers.reduceRight((u, t) => over(t, u), root && root[3] > 0.5 ? root.slice(0, 3) : (document.documentElement.classList.contains('stage') ? [6, 9, 20] : [236, 240, 246]))]
      }
      const out = []
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
      const seen = new Set()
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const text = n.nodeValue.replace(/\s+/g, ' ').trim()
        const el = n.parentElement
        if (text.length < 2 || !el || seen.has(el)) continue
        seen.add(el)
        if (el.closest('script,style,noscript,svg,[aria-hidden="true"],.sr-only,option,button:disabled,[aria-disabled="true"]')) continue
        // the logo is drawn in the brand's own colours, letter by letter: it is a picture, not text to be judged
        if (/^Gennoor\s*Tech/i.test((el.parentElement?.textContent || '').trim()) && text.length <= 4) continue
        const cs = getComputedStyle(el)
        const r = el.getBoundingClientRect()
        if (r.width < 2 || r.height < 2 || cs.visibility === 'hidden' || cs.display === 'none') continue
        let shown = 1
        for (let e = el; e; e = e.parentElement) shown *= Number(getComputedStyle(e).opacity)
        if (shown < 0.5) continue // on its way in or out, or switched off on purpose
        const color = parse(cs.color)
        if (!color) continue
        // words filled with a gradient have a see-through colour of their own: not measurable here
        if (color[3] < 0.5 || cs.webkitTextFillColor === 'rgba(0, 0, 0, 0)') continue
        const backs = behind(el)
        if (!backs) continue
        const worst = Math.min(...backs.map((b) => ratio(over(color, b), b)))
        const size = parseFloat(cs.fontSize)
        const big = size >= 24 || (size >= 18.66 && Number(cs.fontWeight) >= 700)
        out.push({ ratio: +worst.toFixed(2), big, text: text.slice(0, 54), color: color.slice(0, 3).join(','), back: backs.map((b) => b.join(',')).join(' .. '), where: (el.closest('section,header,footer,nav,aside,main') || el).tagName.toLowerCase() })
      }
      return out
    })
    const bad = found.filter((f) => f.ratio < 3)
    const weak = found.filter((f) => f.ratio >= 3 && f.ratio < 4.5 && !f.big)
    hard += bad.length
    console.log(`${bad.length ? 'WRONG' : 'ok   '} ${theme.padEnd(5)} /${p.padEnd(34)} ${String(found.length).padStart(4)} pieces of text, ${bad.length} hard to read, ${weak.length} under the standard for small text`)
    const once = new Map()
    for (const f of bad) once.set(`${f.text}|${f.color}|${f.back}`, f)
    for (const f of [...once.values()].slice(0, 12)) console.log(`        ${f.ratio}:1  "${f.text}"  words ${f.color} on ${f.back}  (in <${f.where}>)`)
  }
  await context.close()
}
await browser.close()
console.log(hard ? `\n${hard} piece(s) of text are hard to read` : '\nno text was found that is hard to read')
process.exit(hard ? 1 : 0)
