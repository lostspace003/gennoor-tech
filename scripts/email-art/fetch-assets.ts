/**
 * Step 1 of the email pictures: fetch what the pictures are made from.
 *
 *   npx tsx --env-file=.env.local scripts/email-art/fetch-assets.ts
 *
 * Saves the course thumbnails and a few seconds of the AI-103 promo (as still
 * frames) into scripts/email-art/.work/, which is not committed. Then run
 * build.mjs to draw the pictures.
 */
import { execFileSync } from 'child_process'
import { mkdirSync, writeFileSync } from 'fs'
import path from 'path'
import { listLmsCourses, promoUrl, toCard } from '@/lib/lms'

const WORK = path.join(process.cwd(), 'scripts', 'email-art', '.work')
// Where in the promo the preview clip starts, and how long it runs
const CLIP_START = Number(process.env.CLIP_START || 6)
const CLIP_SECONDS = 4
const CLIP_FPS = 8

async function main() {
  mkdirSync(path.join(WORK, 'clip'), { recursive: true })
  const courses = await listLmsCourses()
  for (const slug of ['ai-103', 'ai-500']) {
    const course = courses.find((c) => c.slug === slug)
    if (!course) { console.log('missing course', slug); continue }
    const card = toCard(course)
    if (card.thumbnailUrl) {
      const res = await fetch(card.thumbnailUrl)
      const file = path.join(WORK, `thumb-${slug}.jpg`)
      writeFileSync(file, Buffer.from(await res.arrayBuffer()))
      console.log('saved', file)
    }
    if (slug === 'ai-103') {
      const promo = promoUrl(course)
      if (!promo) { console.log('no promo for', slug); continue }
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', String(CLIP_START), '-t', String(CLIP_SECONDS), '-i', promo, '-vf', `fps=${CLIP_FPS},scale=720:-2`, '-q:v', '3', path.join(WORK, 'clip', 'f%03d.jpg')])
      console.log('saved clip frames')
    }
  }
}
main().catch((e) => { console.error(e); process.exit(1) })
