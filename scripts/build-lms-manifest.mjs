// Builds the LMS manifests (src/data/lms/<slug>.json + <slug>.quizzes.json)
// from a Course Factory "Upload package/course.json" and a flat blob listing of
// the course's Azure container.
//
//   node scripts/build-lms-manifest.mjs <ai-103|ai-500> <course.json> <listing.xml>
//
// <listing.xml> is the container list XML (?restype=container&comp=list) -
// used only to check that every video, caption and resource really exists, so
// the site never links a lecture to a missing blob. No credentials are stored.
import fs from 'node:fs'
import path from 'node:path'

const [, , slug, courseJsonPath, listingPath] = process.argv
if (!slug || !courseJsonPath || !listingPath) {
  console.error('usage: build-lms-manifest.mjs <slug> <course.json> <listing.xml>')
  process.exit(1)
}

const CODE = slug === 'ai-103' ? 'AI103' : 'AI500'
const VIDEO_DIR = `${CODE} Udemy`
const RES_DIR = `${CODE} Udemy - Resources`

const raw = JSON.parse(fs.readFileSync(courseJsonPath, 'utf8').replace(/^﻿/, ''))
const listing = fs.readFileSync(listingPath, 'utf8')
const blobs = new Set([...listing.matchAll(/<Name>([^<]*)<\/Name>/g)].map(m => m[1].replace(/&amp;/g, '&')))
const base = p => String(p).split(/[\\/]/).pop()

const missing = []
const need = name => {
  if (!blobs.has(name)) missing.push(name)
  return name
}

// ---- course-level copy -----------------------------------------------------
let meta
if (slug === 'ai-103') {
  const c = raw.course
  meta = {
    title: c.title,
    subtitle: c.subtitle,
    level: c.level,
    description: c.description_text.split(/\n{2,}|\n(?=[A-Z])/).map(s => s.trim()).filter(Boolean),
    outcomes: c.what_you_will_learn,
    requirements: c.requirements,
    audience: c.who_this_course_is_for,
    instructor: c.instructor_headline,
    topics: c.topics,
  }
} else {
  const text = raw.landing
  const block = (head, next) => {
    const a = text.indexOf(head)
    if (a < 0) return ''
    const rest = text.slice(a + head.length)
    const b = next ? rest.search(next) : -1
    return b < 0 ? rest : rest.slice(0, b)
  }
  const bullets = s => s.split('\n').filter(l => l.startsWith('- ')).map(l => l.slice(2).trim())
  const desc = block('COURSE DESCRIPTION  (headings in bold)', /\nWHAT STUDENTS WILL LEARN/)
  meta = {
    title: 'AI-500: Designing and Implementing Multi-Agent AI Solutions',
    subtitle: 'Build a platform of cooperating AI agents on Microsoft Foundry in Python, and prepare for the AI-500 expert exam',
    level: 'Expert',
    description: desc.replace(/^-+\n/, '').split(/\n{2,}/).map(s => s.trim()).filter(s => s && !s.startsWith('- ') && !/^[-=]+$/.test(s)).map(s => s.replace(/\*\*/g, '').replace(/^[-=\s]+/, '')),
    outcomes: bullets(block('WHAT STUDENTS WILL LEARN', /\nREQUIREMENTS/)),
    requirements: bullets(block('REQUIREMENTS', /\nWHO THIS COURSE IS FOR/)),
    audience: bullets(block('WHO THIS COURSE IS FOR', /\nPREVIEW LECTURES/)),
    instructor: 'Microsoft Certified Trainer | Azure and Conversational AI',
    topics: ['Microsoft AI-500', 'Multi-Agent Systems', 'Microsoft Foundry', 'Agent Framework'],
  }
}

// ---- sections --------------------------------------------------------------
const quizzes = {}
let n = 0
let lectureCount = 0
let quizCount = 0
const sections = raw.sections.map((sec, si) => ({
  title: sec.title.replace(/\s+$/, ''),
  items: sec.items.map(it => {
    n += 1
    const id = `i${String(n).padStart(3, '0')}`
    if (it.type === 'quiz') {
      quizCount += 1
      const qs = it.questions.map(q => ({
        question: q.question,
        answers: q.answers,
        correct: q.correct_index ?? q.correct,
        explanation: q.explanation || '',
      }))
      quizzes[id] = { title: it.title, passPercent: it.pass_percent ?? 70, questions: qs }
      return { id, type: 'quiz', title: it.title, description: it.description || '', questionCount: qs.length, passPercent: it.pass_percent ?? 70 }
    }
    lectureCount += 1
    const videoName = base(typeof it.video === 'string' ? it.video : it.video.path)
    const capName = videoName.replace(/\.mp4$/i, '.vtt')
    const resNames = (it.resources || []).map(r => (typeof r === 'string' ? r : r.name))
    return {
      id,
      type: 'lecture',
      kind: it.kind || (/demo/i.test(it.title) ? 'demo' : 'lecture'),
      title: it.title,
      description: it.description || '',
      preview: !!it.free_preview,
      video: need(`${VIDEO_DIR}/${videoName}`),
      caption: blobs.has(`${VIDEO_DIR}/${capName}`) ? `${VIDEO_DIR}/${capName}` : null,
      resources: resNames.map(name => ({ name, blob: need(`${RES_DIR}/${name}`) })),
    }
  }),
}))

const manifest = {
  slug,
  code: slug.toUpperCase(),
  container: slug,
  ...meta,
  stats: { sections: sections.length, lectures: lectureCount, quizzes: quizCount },
  sections,
}

const outDir = path.join('src', 'data', 'lms')
fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(path.join(outDir, `${slug}.json`), JSON.stringify(manifest, null, 1))
fs.writeFileSync(path.join(outDir, `${slug}.quizzes.json`), JSON.stringify(quizzes))
console.log(`${slug}: ${sections.length} sections, ${lectureCount} lectures, ${quizCount} quizzes`)
if (missing.length) {
  console.error(`MISSING ${missing.length} blobs:`)
  for (const m of [...new Set(missing)].slice(0, 40)) console.error('  ', m)
  process.exitCode = 2
}
