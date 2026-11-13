/**
 * Step 1 of the catalogue and the presentation: read what the website sells today.
 *
 *   npx tsx --env-file=.env.local scripts/catalog/extract-site-data.ts
 *
 * Writes scripts/catalog/catalog-data.json from the same data the pages use
 * (published Learning Studio courses, AI Essentials, the Claude certifications,
 * the Claude automation courses, the AI Weekend). Typed by hand: the short
 * "What we offer" and "Built for your organization" lists, which follow the film
 * "What we do" and the Training, Claude and Automation pages.
 *
 * The catalogue lists ONLY what we really offer (owner, 13 November 2026: "I would like
 * to have reality in the catalog ... whatever we have in the video, that is the same value").
 * So there is no list of team programmes, exam preparation or prototype blueprints, and of
 * Microsoft's courses only the AI, data, AI-for-business and Copilot titles, as "coming soon
 * to the Learning Studio" (see import-title-plan.py).
 *
 * No prices anywhere, by the owner's decision (November 2026): cost depends on
 * scope and is discussed on a call.
 *
 * Then run:  python scripts/catalog/build-catalog-xlsx.py      (the catalogue workbook)
 *            node scripts/show/build.mjs deck overview && python scripts/show/deck.py overview      (the presentation)
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { listLmsCourses, toCard } from '@/lib/lms'
import { previewIds } from '@/lib/lms-access'
import { courses as essentials } from '@/config/courses'
import { CLAUDE_CERTS } from '@/data/claude-certifications'
import tocCourses from '@/data/toc-courses.json'
import { WEEKEND, DAYS, DEMO_WORD, INCLUDED, nextCohort, timeLabel } from '@/data/ai-weekend'

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
  // Microsoft's official courses, from the title plan Microsoft sends to trainers (see import-title-plan.py)
  const msFile = path.join(process.cwd(), 'scripts', 'catalog', 'microsoft-courses.json')
  const planned: Array<Record<string, any>> = existsSync(msFile) ? JSON.parse(readFileSync(msFile, 'utf-8')).courses : []
  // A Microsoft course that is already a Learning Studio course is live, not "coming soon"
  const live = new Set(studio.map((c) => String(c.code).toUpperCase()))
  const microsoft = planned.filter((c) => !live.has(String(c.code).replace(/T\d+$/i, '').toUpperCase()))
  const domains = [...new Set((tocCourses as Array<Record<string, any>>).map((c) => c.domain))]

  const data = {
    meta: {
      generatedOn: new Date().toISOString().slice(0, 10),
      walkthrough: `${SITE}/studio`,
      counts: {
        studio: studioRows.length, essentials: essentials.length, claudeCerts: CLAUDE_CERTS.length,
        claudeCourses: tocCourses.length, comingSoon: microsoft.length,
      },
      studioHours: Math.round(studioRows.reduce((n, r) => n + r.card.hours, 0)),
      studioLessons: studioRows.reduce((n, r) => n + r.card.lectures, 0),
      weekend: { name: WEEKEND.name, tagline: WEEKEND.tagline, dates: cohort.label, time: timeLabel(), included: INCLUDED },
      featured: studioRows.slice(0, 4).map((r) => ({ code: r.c.code, title: r.c.title, kind: KIND[r.card.kind] || r.card.kind, lessons: r.card.lectures, hours: r.card.hours, slug: r.c.slug })),
    },

    'What we offer': sheet(['#', 'What we offer', 'What it is', 'Best for', 'Link'], [
      [1, 'Learning Studio video courses', `${studioRows.length} video courses with labs, a quiz in every module and a certificate: preparation for a certification, or one real project from start to finish. Preview lessons of every course play without signing in.`, 'People and teams who want to learn at their own pace', `${SITE}/studio`],
      [2, 'AI Essentials', `${essentials.length} short interactive courses with animated slides, narration and a quiz. One useful skill in about an hour. Open on the website.`, 'Every role, including people who do not code', `${SITE}/ai-academy`],
      [3, 'Claude certification preparation', `A guide and a practice exam for each of the ${CLAUDE_CERTS.length} Claude certifications, with a storyline and short videos. Open on the website.`, 'Anyone preparing for a Claude certification', `${SITE}/claude/certifications`],
      [4, 'Claude automation courses for teams', `${tocCourses.length} instructor-led courses, each built around one job a team does: ${domains.join(' and ')}. Every course has its outline on the website.`, 'Teams that want to automate a real process with Claude', `${SITE}/claude`],
      [5, 'Training built on your work', 'We learn what your people do, build the course around it, and teach it live, online or at your office. The examples and exercises come from your own work.', 'A team whose work a ready-made course does not cover', `${SITE}/training`],
      [6, 'Automation training', 'One process your team runs every week, and a course built on it with their own examples and files. Taught live and hands-on, so they automate it themselves, and a person still checks the result.', 'A team with a task it repeats every week', `${SITE}/training`],
      [7, 'A learning platform for your company', 'We build and set up a learning platform (LMS) for your organization: your courses, your people, your name on it. In the cloud or on your premises.', 'An organization with a regular training need', `${SITE}/contact`],
      [8, 'A prototype first', 'One use case built as a working prototype, with the scope agreed in writing before we start and tested on your own examples. People stay in charge of checking.', 'A team that wants to see it work before it commits', `${SITE}/automation`],
      [9, WEEKEND.name, `${WEEKEND.tagline}. Two live sessions on the last weekend of every month, Saturday and Sunday: ${DEMO_WORD} working demos, and the complete kit afterwards.`, 'People who want to see it built live', `${SITE}/ai-weekend`],
      [10, 'Coming soon to the Learning Studio', `${microsoft.length} Microsoft courses on AI, AI for business, Copilot and data are on their way to the Learning Studio, in the same form as the courses there now: video lessons, labs, quizzes and a certificate.`, 'People and teams following a Microsoft learning path', `${SITE}/studio`],
    ], { B: 38, C: 78, D: 44, E: 34 }),

    'Built for you': sheet(['What we build', 'What it includes', 'How it is delivered'], [
      ['A custom training course', 'Lessons written around your own tools, processes and examples. Hands-on labs, a quiz in every module and a certificate.', 'On the Learning Studio, or on your own platform'],
      ['A learning platform (LMS) for your company', 'Your courses and your people only, under your name. Video lessons with captions and saved progress, quizzes, labs, certificates, an assistant that answers questions inside the lesson, and a question board answered by a trainer.', 'In the cloud or on your premises, built and set up by us'],
      ['Automation training built on your process', 'We take one process your team runs every week and build the course on it, with their own examples and files. In the sessions they automate it themselves, with Claude and other AI tools, and a person still checks the result.', 'Live and hands-on, online or at your office'],
      ['Live training built on your work', 'We learn what your people do, build the examples and exercises from it, and teach it hands-on.', 'Online or at your office'],
      ['Less time in the classroom', 'People learn the concepts with short video lessons and practise with labs first. Trainer time is kept for questions and the hard parts. Our aim is about 60% less classroom time than a usual 3 to 5 day course; how much depends on the course and the team.', 'Self-paced first, then live with a trainer'],
      ['Support after the training', 'A doubt desk for your organization: learners post a question, a trainer answers, and the answer stays for the next person. The course stays open to go back to.', 'On the platform'],
      ['A prototype first', 'One use case built as a working prototype, with the scope agreed in writing before work starts, tested on your own examples, with people kept in charge of checking. One process at a time.', 'Built with you, on your examples'],
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

    // Microsoft's courses that are on their way to the Learning Studio: AI, AI for business, Copilot and data only
    'Coming soon': sheet(['#', 'Code', 'Title', 'Family', "Microsoft's course length", 'Leads to', 'Status', "Microsoft's page"],
      microsoft.map((c, i) => [i + 1, String(c.code).replace(/T\d+$/i, ''), c.title, c.family, c.duration, c.leadsTo, 'Coming soon', c.url]),
      { B: 11, C: 62, D: 18, E: 16, F: 26, G: 14, H: 52 }),

    'AI Weekend': sheet(['#', 'Day', 'Part', 'What is built live', 'What you leave with'],
      DAYS.flatMap((d) => d.projects.map((p, n) => [d.label.replace('·', '-'), d.agenda[n] || '', p.name, p.result])).map((r, i) => [i + 1, ...r]),
      { B: 20, C: 42, D: 36, E: 84 }),
  }

  // Course pictures for the presentation and the films (a working folder, not committed)
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
