/**
 * Generate brochure PDFs for academy courses.
 *
 * Usage:
 *   npx tsx scripts/build-academy-pdfs.ts              # all 26 courses
 *   npx tsx scripts/build-academy-pdfs.ts <courseId>   # one course only (sample)
 *
 * Reads course config from src/config/courses.ts. Writes PDFs to
 * public/Gennoor-Academy-Course-PDFs/<slug>.pdf so they can be linked from
 * the course detail page.
 */
import path from 'node:path'
import fs from 'node:fs'
// @ts-expect-error — sibling ESM script, no .d.ts
import { buildCoursePdf } from './build-course-pdf.mjs'
import { courses } from '../src/config/courses'

const arg = process.argv[2]
const targets = arg ? courses.filter(c => c.id === arg) : courses

if (targets.length === 0) {
  console.error(`No course found matching "${arg}"`)
  process.exit(1)
}

console.log(`→ Generating PDFs for ${targets.length} academy ${targets.length === 1 ? 'course' : 'courses'}\n`)

const OUT_DIR = path.resolve(process.cwd(), 'public', 'Gennoor-Academy-Course-PDFs')

async function main() {
  for (const course of targets) {
    const outPath = path.join(OUT_DIR, `${course.id}.pdf`)
    try {
      await buildCoursePdf(course, outPath)
      const stats = fs.statSync(outPath)
      console.log(`  ✓ ${course.id}.pdf (${(stats.size / 1024).toFixed(1)} KB) — ${course.title}`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`  ✗ ${course.id} — ${msg}`)
    }
  }
  console.log(`\n✓ Done. PDFs in ${path.relative(process.cwd(), OUT_DIR)}/`)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
