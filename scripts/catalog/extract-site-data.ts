/**
 * Step 1 of the catalogue and the overview deck: read what the website sells today.
 *
 *   npx tsx --env-file=.env.local scripts/catalog/extract-site-data.ts
 *
 * Writes scripts/catalog/catalog-data.json from the same data the pages use
 * (published Learning Studio courses, AI Essentials, the Claude
 * certifications and courses, team training programmes, exam preparation, the AI
 * Weekend, proof-of-concept builds). Typed by hand: the short "What we offer" and
 * "Built for your organization" lists, which follow the Training, Claude and
 * Automation pages and the sales pitch.
 *
 * No prices anywhere, by the owner's decision (November 2026): cost depends on
 * scope and is discussed on a call.
 *
 * Then run:  python scripts/catalog/build-catalog-xlsx.py
 *            python scripts/catalog/build-overview-pptx.py
 */
import { mkdirSync, writeFileSync } from 'fs'
import path from 'path'
import { listLmsCourses, toCard } from '@/lib/lms'
import { previewIds } from '@/lib/lms-access'
import { pocs } from '@/data/pocs'
import { courses as essentials } from '@/config/courses'
import { CLAUDE_CERTS } from '@/data/claude-certifications'
import tocCourses from '@/data/toc-courses.json'
import { getAllPrograms } from '@/data/training-programs'
import { getAllCertifications } from '@/data/certification-prep'
import { WEEKEND, DAYS, INCLUDED, nextCohort, timeLabel } from '@/data/ai-weekend'

const SITE = 'https://www.gennoor.com'
const KIND: Record<string, string> = { certification: 'Certification', project: 'Project', course: 'Use case' }
const sentence = (s: string, max = 220) => {
  const t = String(s || '').replace(/\s+/g, ' ').trim()
  return t.length <= max ? t : `${t.slice(0, max).replace(/\s+\S*$/, '')}…`
}
const sheet = (header: string[], rows: (string | number)[][], widths: Record<string, number> = {}) => ({ header, rows, widths })

async function main() {
  const studio = await listLmsCourses()
  const studioRows = await Promise.all(studio.map(async (c) => {
    const card = toCard(c)
    return { c, card, previews: previewIds(c).length }
  }))
  const order = ['certification', 'project', 'course']
  studioRows.sort((a, b) => order.indexOf(a.card.kind) - order.indexOf(b.card.kind) || a.c.title.localeCompare(b.c.title))

  const cohort = nextCohort()
  const programs = getAllPrograms()
  const exams = getAllCertifications()

  const data = {
    meta: {
      generatedOn: new Date().toISOString().slice(0, 10),
      walkthrough: `${SITE}/studio`,
      counts: {
        studio: studioRows.length, essentials: essentials.length, claudeCerts: CLAUDE_CERTS.length,
        claudeCourses: tocCourses.length, programs: programs.length, exams: exams.length, pocs: pocs.length,
      },
      studioHours: Math.round(studioRows.reduce((n, r) => n + r.card.hours, 0)),
      studioLessons: studioRows.reduce((n, r) => n + r.card.lectures, 0),
      weekend: { name: WEEKEND.name, tagline: WEEKEND.tagline, dates: cohort.label, time: timeLabel(), included: INCLUDED },
      featured: studioRows.slice(0, 4).map((r) => ({ code: r.c.code, title: r.c.title, kind: KIND[r.card.kind] || r.card.kind, lessons: r.card.lectures, hours: r.card.hours, slug: r.c.slug })),
    },

    'What we offer': sheet(['#', 'Offering', 'What it includes', 'Best for', 'Link'], [
      [1, 'Learning Studio', `${studioRows.length} video courses with labs, quizzes and a certificate: certification preparation and real projects. Preview lessons of every course play without signing in.`, 'People and teams who want to learn at their own pace', `${SITE}/studio`],
      [2, 'AI Essentials', `${essentials.length} short interactive courses with animated slides, narration and a quiz, each about an hour.`, 'Every role, including people who do not code', `${SITE}/ai-academy`],
      [3, 'Claude certification preparation', `A guide for each of the ${CLAUDE_CERTS.length} Claude certifications, with a storyline, short videos and a practice exam.`, 'Anyone preparing for a Claude certification', `${SITE}/claude/certifications`],
      [4, 'Claude training for teams', 'Live sessions on Claude for everyday work, Claude Cowork and Claude Code, built around what your team does.', 'Teams starting with Claude or wanting to use it well', `${SITE}/claude`],
      [5, 'Training for your team', 'Live training, online or at your office: Claude, Microsoft AI and automation courses, plus preparation for certification exams.', 'Smaller teams and larger organizations', `${SITE}/training`],
      [6, 'Custom training courses', 'A course written around your own tools, processes and examples, with video lessons, labs, quizzes and a certificate.', 'Teams whose work a standard course does not cover', `${SITE}/training`],
      [7, 'A learning platform for your company', 'We build and set up a learning platform (LMS) for your organization: your courses, your people, your name on it. On our platform or built for you, in the cloud or on your premises.', 'Organizations with a regular training need', `${SITE}/contact`],
      [8, 'Proof-of-concept builds', `A working prototype of one AI use case, with a fixed scope. ${pocs.length} ready blueprints to start from.`, 'Teams that want to see it work before they commit', `${SITE}/contact`],
      [9, 'Automation', 'One process at a time: scoped in writing first, built with Claude, and tested on your own examples.', 'A process that eats hours every week', `${SITE}/automation`],
      [10, WEEKEND.name, `${WEEKEND.tagline}. Two live sessions every month, six working demos, and the complete kit afterwards.`, 'People who want to see it built live', `${SITE}/ai-weekend`],
    ], { C: 70, D: 44, E: 34 }),

    'Built for you': sheet(['What we build', 'What it includes', 'How it is delivered'], [
      ['A custom training course', 'Lessons written around your own tools, processes and examples. Hands-on labs, a quiz in every module and a certificate. Narration in a voice you choose, with a digital presenter on screen if you want one.', 'On the Learning Studio, or on your own platform'],
      ['A learning platform (LMS) for your company', 'Your courses and your people only, under your name. Video lessons with captions and saved progress, quizzes, labs, certificates, an assistant that answers questions inside the lesson, and a question board answered by a trainer. Other features on request.', 'On our platform or built for you, in the cloud or on your premises'],
      ['Live training built on your work', 'We learn what your people do, build the examples and exercises from it, and teach it hands-on.', 'Online or at your office'],
      ['Less time in the classroom', 'People learn the concepts with short video lessons and practise with labs first. Trainer time is kept for questions and the hard parts. Our aim is about 60% less classroom time than a usual 3 to 5 day course; how much depends on the course and the team.', 'Self-paced first, then live with a trainer'],
      ['Support after the training', 'A doubt desk for your organization: learners post a question, a trainer answers, and the answer stays for the next person. The course stays open to go back to.', 'On the platform, online or on your premises'],
      ['A proof of concept', 'One AI use case built as a working prototype, with the scope agreed before work starts. See the blueprints sheet.', 'Built in your environment, tested on your examples'],
      ['Automation of one process', 'Scoped in writing first, built with Claude, tested on real cases from your work, with people kept in charge of checking.', 'One process at a time'],
    ], { A: 36, B: 96, C: 44 }),

    'Learning Studio': sheet(
      ['#', 'Code', 'Title', 'Type', 'Company', 'Level', 'Lessons', 'Hours', 'Quizzes', 'Preview lessons', 'Link'],
      studioRows.map((r, i) => [i + 1, r.c.code, r.c.title, KIND[r.card.kind] || r.card.kind, r.card.vendor, r.card.level, r.card.lectures, r.card.hours || '', r.c.stats.quizzes, r.previews, `${SITE}/studio/${r.c.slug}`]),
      { B: 12, C: 54, D: 16, E: 14, F: 16, K: 36 }),

    'AI Essentials': sheet(['#', 'Title', 'Level', 'Duration', 'Chapters', 'Description', 'Link'],
      essentials.map((c, i) => [i + 1, c.title, c.level, c.duration, c.totalChapters, sentence(c.description), `${SITE}/ai-academy/${c.id}`]),
      { B: 46, C: 16, F: 70, G: 40 }),

    'Claude certifications': sheet(['#', 'Code', 'Title', 'Level', 'Audience', 'Description', 'Link'],
      CLAUDE_CERTS.map((c, i) => [i + 1, c.code, c.name.replace('–', '-'), c.level, c.audience, sentence(c.tagline.replace(' — ', ', ')), `${SITE}/claude/certifications/${c.slug}`]),
      { B: 12, C: 44, E: 44, F: 60, G: 48 }),

    'Claude courses': sheet(['#', 'Title', 'Domain', 'Level', 'Duration', 'Audience', 'Description', 'Link'],
      (tocCourses as Array<Record<string, any>>).map((c, i) => [i + 1, c.title, c.domain, c.level, `${c.days} days, ${c.hours} hours`, sentence(c.audience, 120), sentence(c.tagline), `${SITE}/claude/courses/${c.slug}`]),
      { B: 46, C: 26, E: 20, F: 40, G: 70, H: 44 }),

    'Team training': sheet(['#', 'Title', 'Type', 'Level', 'Duration', 'Audience', 'Technology', 'Description', 'Link'],
      programs.map((p, i) => [i + 1, p.title, p.category === 'bootcamp' ? 'Bootcamp' : 'Course', p.level, p.duration, p.audience, p.technology, sentence(p.description), `${SITE}/services/training/${p.slug}`]),
      { B: 46, F: 34, G: 18, H: 70, I: 44 }),

    'Exam preparation': sheet(['#', 'Code', 'Title', 'Provider', 'Level', 'Link'],
      exams.map((e, i) => [i + 1, e.code, e.title, e.provider, e.level, `${SITE}/services/certifications/${e.slug}`]),
      { B: 14, C: 60, D: 16, E: 18, F: 50 }),

    'PoC blueprints': sheet(['#', 'Title', 'Category', 'Problem it solves', 'What we build', 'Timeline', 'Industries'],
      pocs.map((p, i) => [i + 1, p.title, p.category, sentence(p.problem.replace(/ — /g, ', '), 200), sentence(p.build.join('. '), 260), p.timeline, p.industries.join(', ')]),
      { B: 38, C: 24, D: 56, E: 70, F: 12, G: 34 }),

    'AI Weekend': sheet(['Day', 'What you build', 'What you leave with'],
      DAYS.flatMap((d) => d.projects.map((p) => [d.label.replace('·', '-'), p.name, p.result])),
      { A: 22, B: 34, C: 90 }),
  }

  // Course pictures for the overview deck (a working folder, not committed)
  const work = path.join(process.cwd(), 'scripts', 'catalog', '.work')
  mkdirSync(work, { recursive: true })
  for (const r of studioRows.slice(0, 4)) {
    if (!r.card.thumbnailUrl) continue
    const res = await fetch(r.card.thumbnailUrl)
    if (res.ok) writeFileSync(path.join(work, `thumb-${r.c.slug}.jpg`), Buffer.from(await res.arrayBuffer()))
  }

  const dest = path.join(process.cwd(), 'scripts', 'catalog', 'catalog-data.json')
  writeFileSync(dest, JSON.stringify(data, null, 1), 'utf-8')
  console.log('wrote', dest, JSON.stringify(data.meta.counts), 'studio hours', data.meta.studioHours, 'weekend', cohort.label)
}
main().catch((e) => { console.error(e); process.exit(1) })
