/**
 * Takes pictures of pages of the site running on this machine, to check a change by eye.
 *
 *   npx next dev -p 3111                                  (in another terminal)
 *   node scripts/shot.mjs <folder> home studio training   one picture per page, 1366 wide and 390 wide
 *   node scripts/shot.mjs <folder> --full about           the whole page, top to bottom
 *
 * Pages are named without the leading slash (studio/ai-103), and the home page is "home":
 * Git Bash on Windows rewrites anything that starts with a slash into a file path.
 *
 * Pictures are named after the page: home-1366.png, studio-390.png, ...
 * Needs Chrome on this machine. Pages behind a sign-in (admin, CRM) show the sign-in page.
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'fs'
import path from 'path'

const [out, ...rest] = process.argv.slice(2)
const full = rest.includes('--full')
const pages = rest.filter((a) => !a.startsWith('--')).map((a) => (a === 'home' ? '/' : `/${a.replace(/^\/+/, '')}`))
const base = process.env.SITE || 'http://localhost:3111'
mkdirSync(out, { recursive: true })

const browser = await puppeteer.launch({ executablePath: process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
const page = await browser.newPage()
for (const p of pages) {
  const name = p === '/' ? 'home' : p.replace(/^\//, '').replace(/[^a-z0-9]+/gi, '-')
  for (const width of [1366, 390]) {
    await page.setViewport({ width, height: width > 600 ? 768 : 800, deviceScaleFactor: 1 })
    await page.goto(base + p, { waitUntil: 'networkidle2', timeout: 180000 }).catch((e) => console.log(`${p}: ${e.message}`))
    await new Promise((r) => setTimeout(r, 1800))
    await page.screenshot({ path: path.join(out, `${name}-${width}.png`), fullPage: full })
  }
  console.log(`${p} -> ${name}-1366.png, ${name}-390.png`)
}
await browser.close()
