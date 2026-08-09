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

const BADGE = path.join(LOGOS, 'gennoor-tech-icon-transparent_256x256_icon-medium.png')

/**
 * Pin the real Gennoor mark on his left shoulder (viewer's right).
 *
 * Composited from the actual brand asset rather than described in the image
 * prompt — generative models approximate a logo, they don't reproduce it, and
 * an almost-right logo is worse than none. `glow` brightens it for the
 * twinkle frames.
 */
async function withBadge(src, glow = 0) {
  const meta = await sharp(src).metadata()
  // Big enough to read as the Gennoor mark once the avatar is scaled down to
  // a 40px button, without looking like a pinned poster on his lapel.
  const size = Math.round(meta.width * 0.19)
  const badge = await sharp(BADGE)
    .resize(size, size)
    .modulate({ brightness: 1 + glow * 0.5, saturation: 1 + glow * 0.35 })
    .toBuffer()
  // Placed so it survives the circular crop below — further out and it lands
  // on the masked-away corner and disappears.
  const bx = Math.round(meta.width * 0.605)
  const by = Math.round(meta.height * 0.625)
  const layers = [{ input: badge, left: bx, top: by }]
  // A soft white bloom behind the mark at the top of the twinkle
  if (glow > 0) {
    const r = Math.round(size * 0.75)
    layers.unshift({
      input: Buffer.from(
        `<svg width="${r * 2}" height="${r * 2}"><circle cx="${r}" cy="${r}" r="${r}" fill="#ffffff" opacity="${0.16 * glow}"/></svg>`
      ),
      left: bx + Math.round(size / 2) - r,
      top: by + Math.round(size / 2) - r,
    })
  }
  return sharp(src).composite(layers).png().toBuffer()
}

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
  // Static sizes use the calm badge
  const still = await withBadge(BASE, 0)
  for (const size of [256, 128, 64]) {
    const out = path.join(LOGOS, `gennoorbot-face-${size}.png`)
    fs.writeFileSync(out, await circular(still, size))
    console.log(path.basename(out), fs.statSync(out).size)
  }

  // Looping animation: long holds on the open-eyed frame, brief blinks, and
  // the shoulder badge catching the light on its own slower cycle. Just the
  // blink for the face — a head-turn frame made him look away, which reads as
  // distracted on a support avatar that should hold your gaze.
  if (!fs.existsSync(BLINK)) {
    console.log('blink frame missing — skipping the animated build')
    return
  }
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gbot-'))

  // glow ramps up and back down so the mark twinkles rather than flashes
  const plan = [
    [BASE, 0], [BASE, 0], [BASE, 0.35], [BASE, 0.8], [BASE, 1], [BASE, 0.6], [BASE, 0.2],
    [BLINK, 0],
    [BASE, 0], [BASE, 0], [BASE, 0], [BASE, 0], [BASE, 0],
    [BASE, 0.3], [BASE, 0.7], [BASE, 0.3],
    [BASE, 0], [BASE, 0],
    [BLINK, 0],
    [BASE, 0], [BASE, 0], [BASE, 0],
  ]
  let i = 0
  for (const [src, glow] of plan) {
    const framed = await withBadge(src, glow)
    fs.writeFileSync(path.join(tmp, `f${String(i++).padStart(3, '0')}.png`), await circular(framed, 192))
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
