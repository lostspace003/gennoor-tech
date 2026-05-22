/**
 * Generate brochure PDFs for academy courses.
 *
 * Usage:
 *   node scripts/build-academy-pdfs.mjs              # all 26 courses
 *   node scripts/build-academy-pdfs.mjs <courseId>   # one course only (sample)
 *
 * Reads course config from the same source the website uses
 * (src/config/courses.ts). Writes PDFs to
 * public/Gennoor-Academy-Course-PDFs/<slug>.pdf so they can be linked from
 * the course detail page.
 */
import path from 'node:path'
import { register } from 'node:module'
import { pathToFileURL } from 'node:url'
import { buildCoursePdf } from './build-course-pdf.mjs'

// Allow ESM to import TS configs via tsx-style loader (esbuild-register).
// Fall back to a manual parse if the loader is unavailable.
let coursesModule
try {
  // tsx is dev-installed in this repo
  register('tsx', pathToFileURL(path.resolve(process.cwd(), 'package.json')))
  coursesModule = await import(pathToFileURL(path.resolve(process.cwd(), 'src/config/courses.ts')).href)
} catch (err) {
  console.error('Failed to load src/config/courses.ts via tsx loader:', err.message)
  console.error('Make sure to run via: npx tsx scripts/build-academy-pdfs.mjs <args>')
  process.exit(1)
}

const courses = coursesModule.courses || []
const arg = process.argv[2]
const targets = arg ? courses.filter(c => c.id === arg) : courses

if (targets.length === 0) {
  console.error(`No course found matching "${arg}"`)
  process.exit(1)
}

console.log(`→ Generating PDFs for ${targets.length} academy ${targets.length === 1 ? 'course' : 'courses'}\n`)

const OUT_DIR = path.resolve(process.cwd(), 'public', 'Gennoor-Academy-Course-PDFs')

for (const course of targets) {
  const outPath = path.join(OUT_DIR, `${course.id}.pdf`)
  try {
    await buildCoursePdf(course, outPath)
    const stats = (await import('node:fs')).statSync(outPath)
    console.log(`  ✓ ${course.id}.pdf (${(stats.size / 1024).toFixed(1)} KB) — ${course.title}`)
  } catch (err) {
    console.error(`  ✗ ${course.id} — ${err.message}`)
  }
}

console.log(`\n✓ Done. PDFs in ${path.relative(process.cwd(), OUT_DIR)}/`)
