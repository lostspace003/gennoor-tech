// Index course lessons into Qdrant so the course Ask bots answer from what is taught.
//
//   npx tsx scripts/index-course.ts ai-103            one video course (slug)
//   npx tsx scripts/index-course.ts ia-ab-100         one interactive course (ia-<id>)
//   npx tsx scripts/index-course.ts --all             everything
//   npx tsx scripts/index-course.ts --new             only courses with no points yet
//   add --dry-run to chunk and count without calling Qdrant or the embedding service
//
// Needs QDRANT_URL and QDRANT_API_KEY (and, for captions and chapters, the storage connection string
// and the Foundry key) in the environment or in .env.local. Re-running is safe: points have fixed ids.
import fs from 'fs'
import path from 'path'

function loadEnv(file: string) {
  if (!fs.existsSync(file)) return
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}
loadEnv(path.join(process.cwd(), '.env.local'))

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const target = args.find(a => !a.startsWith('--'))
  const all = args.includes('--all')
  const onlyNew = args.includes('--new')
  if (!target && !all && !onlyNew) {
    console.log('Usage: npx tsx scripts/index-course.ts <slug|ia-id|--all|--new> [--dry-run]')
    process.exit(1)
  }

  const { listAllLmsCourses } = await import('../src/lib/lms')
  const { courses: interactive } = await import('../src/config/courses')
  const idx = await import('../src/lib/course-index')

  if (!dryRun && !idx.qdrantConfigured()) {
    console.error('QDRANT_URL and QDRANT_API_KEY are not set. Use --dry-run to test without them.')
    process.exit(1)
  }

  const jobs: Array<{ slug: string; run: () => Promise<import('../src/lib/course-index').IndexStats> }> = []
  for (const c of await listAllLmsCourses()) jobs.push({ slug: c.slug, run: () => idx.indexLmsCourse(c, { dryRun }) })
  for (const c of interactive) jobs.push({ slug: `ia-${c.id}`, run: () => idx.indexInteractiveCourse(c, { dryRun }) })

  const picked = jobs.filter(j => (target ? j.slug === target : true))
  if (target && !picked.length) { console.error(`Unknown course: ${target}`); process.exit(1) }

  let tokens = 0
  let chunks = 0
  for (const j of picked) {
    if (onlyNew && !dryRun && (await idx.courseIndexedCount(j.slug)) > 0) { console.log(`${j.slug}: already indexed, skipped`); continue }
    try {
      const s = await j.run()
      tokens += s.tokens; chunks += s.chunks
      console.log(`${s.slug} [${s.kind}] lessons ${s.lessonsWithText}/${s.lessons}, chunks ${s.chunks}, ~${s.tokens.toLocaleString()} tokens, text from ${s.source}${s.written ? ', written' : ', dry run'}${s.skipped.length ? `, skipped ${s.skipped.length}` : ''}`)
    } catch (e) {
      console.error(`${j.slug}: failed - ${e instanceof Error ? e.message : e}`)
    }
  }
  // text-embedding-3-small is about $0.02 per million tokens
  console.log(`Total: ${chunks} chunks, ~${tokens.toLocaleString()} tokens, embedding cost about $${((tokens / 1e6) * 0.02).toFixed(4)}`)
}

main().catch(e => { console.error(e); process.exit(1) })
