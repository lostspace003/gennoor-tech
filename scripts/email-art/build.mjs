/**
 * Step 2 of the email pictures: draw them.
 *
 *   node scripts/email-art/build.mjs            every picture
 *   node scripts/email-art/build.mjs time chat  only these scenes
 *   node scripts/email-art/build.mjs icons      only the icon tiles
 *
 * Opens art.html in Chrome, steps each scene's animation frame by frame, and
 * writes public/email/brief/<scene>.gif. Icon tiles are written as PNG.
 * Needs Chrome and ffmpeg on this machine, and (for the video and the course
 * carousel) the files that fetch-assets.ts saves in .work/.
 *
 * The FIRST frame of every GIF is the finished picture: old Outlook on Windows
 * shows only that frame, so it has to carry the whole message.
 */
import puppeteer from 'puppeteer-core'
import { execFileSync } from 'child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '..', '..')
const WORK = path.join(HERE, '.work')
const OUT = path.join(ROOT, 'public', 'email', 'brief')
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const FFMPEG = process.env.FFMPEG || (existsSync('C:/Users/losts/ffmpeg/bin/ffmpeg.exe') ? 'C:/Users/losts/ffmpeg/bin/ffmpeg.exe' : 'ffmpeg')

const SCENES = ['video', 'courses', 'custom', 'time', 'claude', 'build', 'chat', 'platform']
// Icon tiles used in the emails: file name -> [lucide icon, colour of the tile].
// The colour says what kind of thing it is: blue to watch or read, violet to do, green for help and results,
// gold for what is earned or should not be missed, rose for checks, grey for "no".
const TILES = {
  play: ['play', 'blue'], labs: ['flask-conical', 'violet'], certificate: ['award', 'gold'], assistant: ['bot-message-square', 'green'], catalogue: ['file-spreadsheet', 'gold'],
  work: ['workflow', 'blue'], voice: ['mic', 'violet'], doubts: ['messages-square', 'rose'], learn: ['book-open', 'blue'], trainer: ['user-round-check', 'green'],
  project: ['rocket', 'green'], module: ['layers', 'violet'], result: ['badge-check', 'gold'], open: ['rotate-ccw', 'blue'], quiz: ['list-checks', 'rose'],
  team: ['users', 'blue'], automation: ['zap', 'gold'], calendar: ['calendar-clock', 'blue'], person: ['user-round-plus', 'violet'], stop: ['circle-x', 'ink'],
}
// Art tiles: the badge or mark of one certification or course, used where an email names it.
// The AI-103 one is the certification badge from its course page; the Claude ones are our own
// tiles in Claude's colour with each certification's code (they are not official badges).
const ARTS = {
  'ai-103': { img: 'badge-ai-103', size: '118%', pos: '50% 42%' },
  'ai-500': { img: 'thumb-ai-500', size: '273%', pos: '13.7% 51%' },
  claude: { claude: true },
  'ccas-f': { claude: true, code: 'CCAS-F' }, 'ccdv-f': { claude: true, code: 'CCDV-F' },
  'ccar-f': { claude: true, code: 'CCAR-F' }, 'ccar-p': { claude: true, code: 'CCAR-P' },
  project: { icon: 'rocket', tone: 'green' },
  certification: { icon: 'award', tone: 'blue' },
}
// Icons drawn inside the scenes themselves
const SCENE_ICONS = ['award', 'play', 'sparkles', 'volume-2', 'users', 'workflow', 'wrench', 'file-text', 'rocket', 'monitor-play', 'flask-conical']

/** The inside of a lucide icon as SVG markup. */
function lucide(name) {
  const file = path.join(ROOT, 'node_modules', 'lucide-react', 'dist', 'esm', 'icons', `${name}.js`)
  if (!existsSync(file)) throw new Error(`No lucide icon called ${name}`)
  const src = readFileSync(file, 'utf8')
  const nodes = new Function(`return ${src.slice(src.indexOf('['), src.indexOf('];', src.indexOf('__iconNode')) + 1)}`)()
  return nodes.map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).filter(([k]) => k !== 'key').map(([k, v]) => `${k}="${v}"`).join(' ')}/>`).join('')
}

const fileUrl = (p) => pathToFileURL(p).href
const want = process.argv.slice(2)
const doing = (name) => want.length === 0 || want.includes(name)

const art = {
  icons: Object.fromEntries([...new Set([...Object.values(TILES).map(([icon]) => icon), ...SCENE_ICONS])].map((n) => [n, lucide(n)])),
  files: {
    clip: existsSync(path.join(WORK, 'clip')) ? readdirSync(path.join(WORK, 'clip')).sort().map((f) => fileUrl(path.join(WORK, 'clip', f))) : [],
    'thumb-ai-103': fileUrl(path.join(WORK, 'thumb-ai-103.jpg')),
    'thumb-ai-500': fileUrl(path.join(WORK, 'thumb-ai-500.jpg')),
    'badge-ai-103': fileUrl(path.join(WORK, 'badge-ai-103.jpg')),
  },
}

mkdirSync(OUT, { recursive: true })
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--allow-file-access-from-files'] })
const page = await browser.newPage()
await page.evaluateOnNewDocument((a) => { window.ART = a }, art)
const open = async (query) => {
  await page.goto(`${fileUrl(path.join(HERE, 'art.html'))}?${query}`, { waitUntil: 'load' })
  await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {}))))
}

if (doing('icons')) {
  await page.setViewport({ width: 88, height: 88, deviceScaleFactor: 2 })
  for (const [file, [icon, tone]] of Object.entries(TILES)) {
    await open(`scene=icon&name=${icon}&tone=${tone}`)
    await (await page.$('#tile')).screenshot({ path: path.join(OUT, `icon-${file}.png`), omitBackground: true })
  }
  for (const [file, a] of Object.entries(ARTS)) {
    if (a.img && !existsSync(path.join(WORK, `${a.img}.jpg`))) { console.log(`art-${file}: skipped, run fetch-assets.ts first`); continue }
    await open(`scene=art&a=${encodeURIComponent(JSON.stringify(a))}`)
    await (await page.$('#tile')).screenshot({ path: path.join(OUT, `art-${file}.png`), omitBackground: true })
  }
  console.log(`${Object.keys(TILES).length} icon tiles, ${Object.keys(ARTS).length} art tiles`)
}

const FPS = 10
for (const scene of SCENES.filter(doing)) {
  if ((scene === 'video' || scene === 'courses') && art.files.clip.length === 0) { console.log(`${scene}: skipped, run fetch-assets.ts first`); continue }
  await page.setViewport({ width: 600, height: 320, deviceScaleFactor: 1 })
  await open(`scene=${scene}`)
  const ms = await page.$eval('#stage', (el) => Number(el.dataset.ms))
  const dir = path.join(WORK, `frames-${scene}`)
  rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true })
  const el = await page.$('#stage')
  const shots = []
  const shoot = async (at, hold) => {
    await page.evaluate((t) => window.seek(t), at)
    const file = path.join(dir, `${String(shots.length).padStart(3, '0')}.png`)
    await el.screenshot({ path: file })
    shots.push({ file, hold })
  }
  await shoot(ms, 1.4)                                    // the finished picture first
  const fps = scene === 'video' ? 8 : FPS             // the clip itself is 8 frames a second
  for (let t = 0; t < ms; t += 1000 / fps) await shoot(t, 1 / fps)
  await shoot(ms, 2.6)                                    // and rest on it at the end

  const list = path.join(dir, 'list.txt')
  writeFileSync(list, shots.map((s) => `file '${s.file.replace(/\\/g, '/')}'\nduration ${s.hold.toFixed(3)}`).join('\n') + `\nfile '${shots.at(-1).file.replace(/\\/g, '/')}'\n`)
  const out = path.join(OUT, `${scene}.gif`)
  // Photographs (the video, the course pictures) are kept a little smaller: they weigh the most.
  // Every scene has lit, graded surfaces, so all of them get a full palette and a light dither.
  const photo = scene === 'video' || scene === 'courses'
  const width = photo ? 480 : 600
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-fps_mode', 'vfr',
    '-vf', `scale=${width}:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=${photo ? 96 : 128}:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle`,
    '-loop', '0', out])
  console.log(`${scene}.gif  ${shots.length} frames  ${(statSync(out).size / 1024).toFixed(0)} KB`)
}
await browser.close()
