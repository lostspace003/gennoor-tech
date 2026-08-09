/**
 * Builds the GennoorBot avatar assets.
 *
 * The agent is a FLUX-generated portrait plus two consistent variant frames
 * (a blink and a softer smile) produced from it as reference. Those become a
 * short looping animation so the person feels alive inside a stationary ring
 * — Sora refuses to animate uploaded images of people
 * (`moderation_blocked: people-in-user-uploads`), and that limit is respected
 * rather than worked around.
 *
 * Outputs, all circular-masked so the ring behind them stays visible:
 *   gennoorbot-face-{64,128,256}.png   static fallback / small chips
 *   gennoorbot-face-live.webp          the looping agent (button + header)
 *
 * Run: node scripts/make-bot-avatar.cjs
 */
const sharp = require('sharp')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { execFileSync } = require('child_process')

const LOGOS = path.join(__dirname, '..', 'public', 'logos')
const BASE = path.join(LOGOS, 'agent-white.png')
const BLINK = path.join(LOGOS, 'agent-frame-blink.png')
const WARM = path.join(LOGOS, 'agent-frame-warm.png')

/** Crop to the head and shoulders, then mask to a circle. */
async function circular(src, size) {
  const meta = await sharp(src).metadata()
  const S = Math.min(meta.width, meta.height)
  // Portraits sit centred with headroom; a slight upward bias frames the face
  const side = Math.round(S * 0.86)
  const left = Math.round((meta.width - side) / 2)
  const top = Math.round((meta.height - side) / 2 * 0.55)
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`
  )
  return sharp(src)
    .extract({ left, top, width: side, height: side })
    .resize(size, size)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer()
}

async function main() {
  for (const size of [256, 128, 64]) {
    const out = path.join(LOGOS, `gennoorbot-face-${size}.png`)
    fs.writeFileSync(out, await circular(BASE, size))
    console.log(path.basename(out), fs.statSync(out).size)
  }

  // Looping animation: long holds on the open-eyed frame, brief blinks. Just the
  // blink — a head-turn frame made him look away, which reads as
  // distracted on a support avatar that should hold your gaze.
  if (!fs.existsSync(BLINK)) {
    console.log('blink frame missing — skipping the animated build')
    return
  }
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gbot-'))

  const seq = [
    BASE, BASE, BASE, BASE, BASE, BASE, BASE,
    BLINK,
    BASE, BASE, BASE, BASE, BASE, BASE, BASE, BASE, BASE, BASE,
    BLINK,
    BASE, BASE, BASE,
  ]
  let i = 0
  for (const frame of seq) {
    fs.writeFileSync(path.join(tmp, `f${String(i++).padStart(3, '0')}.png`), await circular(frame, 192))
  }

  const out = path.join(LOGOS, 'gennoorbot-face-live.webp')
  execFileSync('ffmpeg', [
    '-y', '-hide_banner', '-loglevel', 'error',
    '-framerate', '5',
    '-i', path.join(tmp, 'f%03d.png'),
    '-loop', '0',
    '-lossless', '0', '-q:v', '72', '-compression_level', '6',
    out,
  ])
  fs.rmSync(tmp, { recursive: true, force: true })
  console.log('gennoorbot-face-live.webp', fs.statSync(out).size)
}

main().catch((e) => { console.error(e); process.exit(1) })
