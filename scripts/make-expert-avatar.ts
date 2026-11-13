/**
 * Makes the picture shown beside "Learn from an industry expert" on the AI Weekend page:
 * a drawn 3D figure in a circle. It is asked of the Foundry image model, once, and saved in
 * public/assets. It is NOT a photograph or a likeness of any person, and the page names nobody
 * (owner, 13 November 2026: "Don't put my name under trainer ... you can put an avatar in 3D").
 *
 *   npx tsx --env-file=.env.local scripts/make-expert-avatar.ts            asks for a new picture
 *   npx tsx --env-file=.env.local scripts/make-expert-avatar.ts 3          asks for three, to choose from
 *
 * Each picture costs what the image model charges (about 0.17 US dollars); the cost is written to the
 * ledger the admin centre shows. Pictures are written to scripts/.avatar/ ; copy the one you choose to
 * public/assets/ai-weekend-expert.jpg (the script does that for the first one when run without a number).
 */
import { mkdirSync, writeFileSync } from 'fs'
import path from 'path'
import sharp from 'sharp'
import { foundry, recordSpend } from '@/lib/social/studio'

const DEPLOYMENT = process.env.FOUNDRY_IMAGE_DEPLOYMENT || 'gpt-image-2'
const USD = Number(process.env.FOUNDRY_IMAGE_USD || 0.17)

const PROMPT = `A friendly 3D character avatar of a technology trainer, in the polished style of a modern animated film: stylised and clearly drawn, not a photograph and not a real person.
Head and shoulders, centred in the frame with room around the head, facing the viewer with a warm, confident smile.
A man in his thirties with short dark hair and a neatly trimmed beard, wearing a dark navy blazer over a light shirt, no tie.
Soft studio lighting from the upper left. A plain, smooth background that fades from light sky blue to pale lavender, with nothing else in it.
Square picture. No text, no letters, no logo, no watermark, no border, no hands, no props.`

const count = Math.max(1, Math.min(4, Number(process.argv[2]) || 1))
const outDir = path.join(process.cwd(), 'scripts', '.avatar')
mkdirSync(outDir, { recursive: true })

async function one(n: number): Promise<Buffer> {
  const url = `/openai/deployments/${DEPLOYMENT}/images/generations?api-version=2025-04-01-preview`
  const body = { prompt: PROMPT, size: '1024x1024', n: 1 }
  const json = await foundry(url, { ...body, quality: 'high' }).catch((e: Error) => (/quality|unknown|unsupported|invalid/i.test(String(e?.message)) ? foundry(url, body) : Promise.reject(e)))
  const b64 = json.data?.[0]?.b64_json
  if (!b64) throw new Error('The image model returned no picture.')
  await recordSpend('site-assets', 'AI Weekend expert picture', USD).catch(() => undefined)
  const png = Buffer.from(b64, 'base64')
  writeFileSync(path.join(outDir, `expert-${n}.png`), png)
  return png
}

async function main() {
  for (let n = 1; n <= count; n++) {
    const png = await one(n)
    // what the page uses: 512 pixels square, a small JPEG (it is shown in a circle 112 pixels wide)
    const jpg = await sharp(png).resize(512, 512, { fit: 'cover' }).jpeg({ quality: 88, mozjpeg: true }).toBuffer()
    writeFileSync(path.join(outDir, `expert-${n}.jpg`), jpg)
    console.log(`picture ${n}: scripts/.avatar/expert-${n}.png and .jpg (${Math.round(jpg.length / 1024)} KB)`)
    if (count === 1) {
      writeFileSync(path.join(process.cwd(), 'public', 'assets', 'ai-weekend-expert.jpg'), jpg)
      console.log('saved as public/assets/ai-weekend-expert.jpg')
    }
  }
}

main().catch((e) => { console.error(String(e?.message || e)); process.exit(1) })
