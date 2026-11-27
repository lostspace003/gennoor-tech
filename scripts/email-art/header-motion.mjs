/**
 * The top of every light email, moving gently (owner, 27 November 2026, of a Claude email: "this icon is round and
 * moving. It's so beautiful, so minimum written ... this should be for the entire CRM, whatever comes out of us").
 * A soft swell travels once round the logo's ring of dots, then the logo rests. The first frame is the logo at rest:
 * old Outlook shows only the first frame of a GIF, so it shows the finished logo.
 *   node scripts/email-art/header-motion.mjs        writes public/email/header.gif from public/email/header.png
 * Run scripts/email-art/logo.mjs first when the logo itself changes. Needs Chrome and ffmpeg on this machine.
 */
import { createRequire } from 'module'
import { execFileSync } from 'child_process'
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const require = createRequire(path.join(ROOT, 'package.json'))
const puppeteer = require('puppeteer-core')
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const FFMPEG = process.env.FFMPEG || (existsSync('C:/Users/losts/ffmpeg/bin/ffmpeg.exe') ? 'C:/Users/losts/ffmpeg/bin/ffmpeg.exe' : 'ffmpeg')
const PNG = path.join(ROOT, 'public', 'email', 'header.png')
const OUT = path.join(ROOT, 'public', 'email', 'header.gif')
const WORK = path.join(ROOT, 'scripts', 'email-art', '.work', 'header-motion')

// Where logo.mjs draws the ring on the 1200 x 256 header: its 352 x 120 logo at twice the size, from (240, 10)
const ARC = [[98.1, 77.7], [86.5, 92.6], [69.7, 100.9], [50.9, 101], [34, 92.9], [22.2, 78.3], [18, 60], [22.2, 41.7], [34, 27.1], [50.9, 19], [69.7, 19.1], [86.5, 27.4]]
const at = ([x, y]) => [240 + x * 2, 10 + y * 2]
const R = 11
const STEPS = 24 // two frames a dot

const ground = `data:image/png;base64,${readFileSync(PNG).toString('base64')}`
function frame(t) {
  // t from 0 to 1 travels the ring once; each dot swells as the wave passes, and the wave is soft (three dots wide)
  const dots = ARC.map((p, i) => {
    const d = Math.min(Math.abs(t * ARC.length - i), ARC.length - Math.abs(t * ARC.length - i))
    const s = Math.max(0, 1 - d / 1.6)
    if (!s) return ''
    const [x, y] = at(p)
    return `<circle cx="${x}" cy="${y}" r="${(R * (1 + 0.42 * s)).toFixed(2)}" fill="#2563EB" fill-opacity="${(0.9 + 0.1 * s).toFixed(2)}"/>`
  }).join('')
  return `<!doctype html><html><body style="margin:0;width:1200px;height:256px;position:relative">
<img src="${ground}" width="1200" height="256" style="position:absolute;left:0;top:0">
<svg width="1200" height="256" style="position:absolute;left:0;top:0" xmlns="http://www.w3.org/2000/svg">${dots}</svg></body></html>`
}

rmSync(WORK, { recursive: true, force: true })
mkdirSync(WORK, { recursive: true })
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })
const list = []
try {
  const tab = await browser.newPage()
  await tab.setViewport({ width: 1200, height: 256, deviceScaleFactor: 1 })
  // Frame 0: the logo at rest, held while the eye finds it
  await tab.setContent(frame(-10))
  await tab.screenshot({ path: path.join(WORK, 'f000.png') })
  list.push(`file 'f000.png'\nduration 1.6`)
  for (let k = 1; k <= STEPS; k++) {
    const name = `f${String(k).padStart(3, '0')}.png`
    await tab.setContent(frame(k / STEPS))
    await tab.screenshot({ path: path.join(WORK, name) })
    list.push(`file '${name}'\nduration 0.07`)
  }
  list.push(`file 'f000.png'\nduration 2.4`, `file 'f000.png'`)
} finally {
  await browser.close()
}
writeFileSync(path.join(WORK, 'list.txt'), list.join('\n'))
// Half size is what an email shows (600 wide); twice that keeps it sharp on a phone, so the full 1200 is kept
execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(WORK, 'list.txt'), '-fps_mode', 'vfr',
  '-vf', 'split[a][b];[a]palettegen=max_colors=64:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle', '-loop', '0', OUT])
console.log(`public/email/header.gif  ${(statSync(OUT).size / 1024).toFixed(0)} KB`)
