/**
 * See the series emails before they are live: screenshots with the pictures
 * taken from this folder instead of the website.
 *
 *   npx tsx scripts/crm-flow-test.ts --out <dir>     writes the nine emails
 *   node scripts/email-art/preview.mjs <dir>         writes <dir>/*.png beside them
 */
import puppeteer from 'puppeteer-core'
import { readFileSync, readdirSync, writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const dir = path.resolve(process.argv[2] || '.')
const width = Number(process.argv[3] || 640)
const local = pathToFileURL(path.join(ROOT, 'public')).href

const browser = await puppeteer.launch({ executablePath: process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--allow-file-access-from-files'] })
const page = await browser.newPage()
await page.setViewport({ width, height: 800, deviceScaleFactor: 1 })
for (const f of readdirSync(dir).filter((f) => /^\d\d-.*\.html$/.test(f))) {
  const tmp = path.join(dir, `_${f}`)
  writeFileSync(tmp, readFileSync(path.join(dir, f), 'utf8').replaceAll('https://www.gennoor.com/email/', `${local}/email/`).replaceAll('https://www.gennoor.com/logos/', `${local}/logos/`))
  await page.goto(pathToFileURL(tmp).href, { waitUntil: 'load' })
  await page.screenshot({ path: path.join(dir, f.replace('.html', `-${width}.png`)), fullPage: true })
}
await browser.close()
