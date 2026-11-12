/**
 * Draws the Gennoor show from stage.html.
 *
 *   node scripts/show/build.mjs stills overview            one picture per scene, to look at (.work/stills)
 *   node scripts/show/build.mjs deck overview              cuts out every piece for PowerPoint (.work/deck), then run deck.py
 *   node scripts/show/build.mjs film overview              the film without sound (.work/overview.silent.mp4), then run mix.py
 *   node scripts/show/build.mjs film weekend 12 20         only seconds 12 to 20 of it, to check a passage quickly
 *
 * Needs Chrome and ffmpeg on this machine, the course pictures that scripts/catalog/extract-site-data.ts
 * and scripts/email-art/fetch-assets.ts save, and (for a film) the narration timing that voice.py writes.
 */
import puppeteer from 'puppeteer-core'
import sharp from 'sharp'
import { spawn } from 'child_process'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '..', '..')
const WORK = path.join(HERE, '.work')
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const FFMPEG = process.env.FFMPEG || (existsSync('C:/Users/losts/ffmpeg/bin/ffmpeg.exe') ? 'C:/Users/losts/ffmpeg/bin/ffmpeg.exe' : 'ffmpeg')
const [cmd = 'stills', show = 'overview', ...rest] = process.argv.slice(2)
mkdirSync(WORK, { recursive: true })
const url = (p) => pathToFileURL(p).href

// ---------------------------------------------------------------- what the page is given
const ICONS = ['play', 'flask-conical', 'blocks', 'award', 'bot-message-square', 'list-checks', 'messages-square', 'captions', 'file-text', 'rocket', 'sparkles', 'users', 'workflow',
  'ear', 'pencil-ruler', 'presentation', 'monitor-play', 'book-open', 'badge-check', 'life-buoy', 'zap', 'bot', 'video', 'calendar-days', 'eye', 'package-open', 'repeat', 'table-2',
  'folder-open', 'timer', 'app-window', 'target', 'check', 'mic', 'globe', 'graduation-cap', 'inbox', 'list-filter', 'file-pen-line']
function lucide(name) {
  const file = path.join(ROOT, 'node_modules', 'lucide-react', 'dist', 'esm', 'icons', `${name}.js`)
  if (!existsSync(file)) throw new Error(`No lucide icon called ${name}`)
  const src = readFileSync(file, 'utf8')
  const nodes = new Function(`return ${src.slice(src.indexOf('['), src.indexOf('];', src.indexOf('__iconNode')) + 1)}`)()
  return nodes.map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).filter(([k]) => k !== 'key').map(([k, v]) => `${k}="${v}"`).join(' ')}/>`).join('')
}

/** The logo picture has its own navy box behind it. Take the box away, so the logo sits on any dark ground. */
async function logoOnDark() {
  const out = path.join(WORK, 'logo-dark.png')
  if (existsSync(out)) return out
  const { data, info } = await sharp(path.join(ROOT, 'public', 'logos', 'gennoor-tech-horizontal-dark-bright_1200x410_email-signature.png')).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const B = [data[0], data[1], data[2]]                    // the box colour, read from the top left corner
  for (let i = 0; i < data.length; i += 4) {
    let a = 0
    for (let c = 0; c < 3; c++) { const p = data[i + c]; a = Math.max(a, p > B[c] ? (p - B[c]) / (255 - B[c]) : (B[c] - p) / B[c]) }
    for (let c = 0; c < 3; c++) data[i + c] = a > 0 ? Math.max(0, Math.min(255, Math.round((data[i + c] - B[c]) / a + B[c]))) : 0
    data[i + 3] = Math.round(Math.min(1, a * 1.15) * 255)
  }
  await sharp(data, { raw: info }).png().toFile(out)
  return out
}

const pic = (...parts) => { const p = path.join(...parts); return existsSync(p) ? url(p) : '' }
const catalog = path.join(ROOT, 'scripts', 'catalog')
const timingFile = path.join(WORK, `${show}.timing.json`)
/** Before the voice is recorded: a stand-in clock, 0.42 seconds a word, so scenes can be looked at. */
function standInTiming() {
  const spec = JSON.parse(readFileSync(path.join(HERE, 'narration', `${show}.json`), 'utf8'))
  let t = spec.lead || 1
  const lines = spec.lines.map((l) => {
    const words = l.text.split(/\s+/).map((w, i) => ({ w, start: t + i * 0.42, end: t + i * 0.42 + 0.36 }))
    const line = { id: l.id, text: l.text, start: t, end: t + words.length * 0.42, words }
    t = line.end + (l.pad ?? 0.45)
    return line
  })
  return { duration: t + (spec.tail || 2.5), lines }
}
const art = {
  icons: Object.fromEntries(ICONS.map((n) => [n, lucide(n)])),
  files: {
    logo: url(await logoOnDark()),
    cpn: pic(ROOT, 'public', 'email', 'cpn-certified-horizontal.png'),
    ...Object.fromEntries(['ai-103', 'ai-500', 'agent-ops', 'build-real-time-ai-on-microsoft-fabric'].map((s) => [`thumb-${s}`, pic(catalog, '.work', `thumb-${s}.jpg`)])),
  },
  data: JSON.parse(readFileSync(path.join(catalog, 'catalog-data.json'), 'utf8')),
  timing: existsSync(timingFile) ? JSON.parse(readFileSync(timingFile, 'utf8')) : standInTiming(),
}
for (const [k, v] of Object.entries(art.files)) if (!v) console.warn(`missing picture: ${k} (run scripts/catalog/extract-site-data.ts)`)

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--allow-file-access-from-files', '--force-color-profile=srgb', '--font-render-hinting=none'] })
const page = await browser.newPage()
page.on('console', (m) => { if (m.type() === 'warning' || m.type() === 'error') console.log(`  [page] ${m.text()}`) })
page.on('pageerror', (e) => console.log(`  [page error] ${e.message}`))
await page.evaluateOnNewDocument((a) => { window.ART = a }, art)
const open = async (mode, scale, extra = '') => {
  await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: scale })
  await page.goto(`${url(path.join(HERE, 'stage.html'))}?show=${show}&mode=${mode}${extra}`, { waitUntil: 'load' })
  await page.evaluate(() => Promise.all([document.fonts.ready, ...[...document.images].map((i) => i.decode().catch(() => {}))]))
}

// ---------------------------------------------------------------- stills: every scene finished, to look at
if (cmd === 'stills') {
  const dir = path.join(WORK, 'stills')
  mkdirSync(dir, { recursive: true })
  await open('deck', 1)
  const scenes = await page.evaluate(() => window.deck().map((s) => s.id))
  const files = []
  for (const id of scenes.filter((s) => rest.length === 0 || rest.includes(s))) {
    await page.evaluate((s) => window.ground1(s, true), id)
    const file = path.join(dir, `${show}-${id}.png`)
    await page.screenshot({ path: file, clip: { x: 0, y: 0, width: 1280, height: 720 } })
    files.push(file)
  }
  // contact sheets, two scenes across, so several can be looked at in one picture
  for (let i = 0; i < files.length; i += 4) {
    const group = files.slice(i, i + 4)
    const rows = Math.ceil(group.length / 2)
    const sheet = await sharp({ create: { width: 1280 * 2 + 12, height: 720 * rows + 12 * (rows - 1), channels: 3, background: '#30343c' } })
      .composite(group.map((f, k) => ({ input: f, left: (k % 2) * 1292, top: Math.floor(k / 2) * 732 }))).png().toBuffer()
    await sharp(sheet).resize({ width: 1800 }).jpeg({ quality: 86 }).toFile(path.join(dir, `${show}-sheet-${1 + i / 4}.jpg`))
  }
  console.log(`${files.length} stills in ${dir}`)
}

// ---------------------------------------------------------------- deck: the ground and every piece, cut out at twice the size
if (cmd === 'deck') {
  const dir = path.join(WORK, 'deck', show)
  rmSync(dir, { recursive: true, force: true })
  mkdirSync(dir, { recursive: true })
  await open('deck', 2)
  const scenes = await page.evaluate(() => window.deck())
  let n = 0
  for (const s of scenes) {
    await page.evaluate((id) => window.ground1(id, false), s.id)
    await page.evaluate(() => { document.documentElement.style.background = '#060914' })
    s.bg = `${s.id}.jpg`
    await page.screenshot({ path: path.join(dir, s.bg), type: 'jpeg', quality: 90, clip: { x: 0, y: 0, width: 1280, height: 720 } })
    await page.evaluate(() => { document.documentElement.style.background = 'transparent' })
    for (const p of s.pieces) {
      await page.evaluate((a, b) => window.isolate(a, b), s.id, p.id)
      p.file = `${p.id}.png`
      await page.screenshot({ path: path.join(dir, p.file), omitBackground: true, clip: { x: p.x, y: p.y, width: p.w, height: p.h } })
      n++
    }
    // the whole scene finished, for the slide thumbnail check
    await page.evaluate((id) => window.ground1(id, true), s.id)
  }
  writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify({ show, scenes }, null, 1))
  console.log(`${scenes.length} slides, ${n} pieces in ${dir}`)
}

// ---------------------------------------------------------------- film: every frame, straight into ffmpeg
if (cmd === 'film') {
  const FPS = 30
  await open('film', 1.5, rest.includes('nocaptions') ? '&captions=0' : '')
  const total = await page.evaluate(() => window.DURATION)
  const nums = rest.filter((x) => /^[\d.]+$/.test(x)).map(Number)
  const from = nums[0] ?? 0, to = Math.min(nums[1] ?? total, total)
  const out = path.join(WORK, nums.length ? `${show}.part.mp4` : `${show}.silent.mp4`)
  console.log(JSON.stringify(await page.evaluate(() => window.PLAN)))
  const ff = spawn(FFMPEG, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] })
  const frames = Math.round((to - from) * FPS)
  const started = Date.now()
  for (let f = 0; f < frames; f++) {
    await page.evaluate((t) => window.seek(t), from + f / FPS)
    const shot = await page.screenshot({ type: 'jpeg', quality: 96, optimizeForSpeed: true, clip: { x: 0, y: 0, width: 1280, height: 720 } })
    if (!ff.stdin.write(shot)) await new Promise((r) => ff.stdin.once('drain', r))
    if (f % 300 === 0) console.log(`  ${f}/${frames} frames, ${((Date.now() - started) / 1000).toFixed(0)}s`)
  }
  ff.stdin.end()
  await new Promise((r) => ff.on('close', r))
  console.log(`${out}  ${(to - from).toFixed(1)}s, ${frames} frames, ${((Date.now() - started) / 1000).toFixed(0)}s to draw`)
}
await browser.close()
