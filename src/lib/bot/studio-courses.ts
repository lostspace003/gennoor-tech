import { listLmsCourses } from '@/lib/lms'

/**
 * Learning Studio (Certifications & Projects) courses for the site assistant.
 *
 * The website index only holds marketing and curriculum pages, so the live
 * Studio courses (AI-103, AI-500, ...) were never in front of the model and a
 * visitor asking "how do I build agents on Azure" got a generic answer with no
 * course link. This module gives the assistant the live list, and a
 * deterministic matcher so the right course link is attached even when the
 * model forgets it.
 */
export interface StudioCourse {
  slug: string
  code: string
  title: string
  subtitle: string
  level: string
  vendor: string
  lessons: number
  topics: string[]
  url: string
}

let cache: { at: number; courses: StudioCourse[] } | null = null

export async function getStudioCourses(): Promise<StudioCourse[]> {
  if (cache && Date.now() - cache.at < 10 * 60_000) return cache.courses
  let courses: StudioCourse[] = []
  try {
    courses = (await listLmsCourses()).map((c) => ({
      slug: c.slug,
      code: c.code || '',
      title: c.title,
      subtitle: c.subtitle || '',
      level: c.level || '',
      vendor: c.vendor || '',
      lessons: c.stats?.lectures || 0,
      topics: [...(c.topics_tags || []), ...(c.domains || [])],
      url: `/studio/${c.slug}`,
    }))
  } catch {
    courses = []
  }
  if (courses.length) cache = { at: Date.now(), courses }
  return courses
}

/** Prompt block listing every Studio course with its link. */
export function studioBlock(courses: StudioCourse[]): string {
  if (!courses.length) return ''
  const lines = courses.map(
    (c) => `- ${c.title} — ${[c.vendor, c.level, c.lessons ? `${c.lessons} lessons` : ''].filter(Boolean).join(', ')}. ${c.subtitle} [${c.url}]`
  )
  return `LEARNING STUDIO — CERTIFICATIONS & PROJECTS (hands-on video courses with labs, quizzes and certificates; browse all at /studio):
${lines.join('\n')}
When someone wants to learn, build or prepare for an exam in a topic one of these covers (agents, Foundry, Azure AI, certification prep), recommend the best-matching course BY NAME with its link, written as a markdown link like [${courses[0].title}](${courses[0].url}). When one of these courses fits what they ask, it is THE link of your answer: name it and link it instead of a workshop or another page. Never describe a course's content beyond what is listed here. Send complete beginners to the free AI Essentials courses at /ai-academy. Claude courses by domain are being prepared and will appear in the Learning Studio: for Claude questions link [Claude at Gennoor](/claude) and mention live Claude training for teams.`
}

const STOP = new Set(['the', 'and', 'for', 'with', 'how', 'can', 'you', 'have', 'does', 'what', 'which', 'want', 'build', 'building', 'learn', 'course', 'courses', 'about', 'your', 'that', 'this', 'from', 'into', 'will', 'need', 'some', 'any', 'are', 'there', 'please', 'tell', 'show', 'make', 'using', 'use', 'help', 'get'])

function words(s: string): string[] {
  return (s.toLowerCase().match(/[a-z0-9][a-z0-9+#.-]*/g) || []).filter((w) => w.length > 2 && !STOP.has(w))
}

/**
 * Courses that clearly fit the question. Explicit codes win outright;
 * otherwise a course needs at least two distinct matching words, or one strong
 * topic word (agent, foundry, azure ai), so "hi" and "what is AI" match nothing.
 */
export function matchStudioCourses(question: string, courses: StudioCourse[]): StudioCourse[] {
  const q = question.toLowerCase()
  if (!q.trim() || !courses.length) return []
  const qw = new Set(words(q))

  const explicit = courses.filter((c) => {
    const code = (c.code || c.slug).toLowerCase()
    return code && new RegExp(`(^|[^a-z0-9])${code.replace(/[^a-z0-9]/g, '[- ]?')}([^a-z0-9]|$)`, 'i').test(q)
  })
  if (explicit.length) return explicit.slice(0, 2)

  const multi = /multi[- ]?agent|orchestrat|solution design|architect|enterprise agent|agent platform|cooperating/.test(q)
  const strong = /\bagent|agentic|foundry|azure ai|ai[- ]?foundry|responses api|mcp\b|rag\b|exam prep|certification prep|microsoft cert/.test(q)

  const scored = courses.map((c) => {
    const text = `${c.title} ${c.subtitle} ${c.topics.join(' ')} ${c.vendor}`
    const cw = new Set(words(text))
    let score = 0
    qw.forEach((w) => { if (cw.has(w)) score += 1 })
    const isMulti = /ai-?500|multi[- ]?agent|solution/i.test(`${c.code} ${c.slug} ${c.title}`)
    if (strong && /agent|foundry|azure/i.test(text)) score += 2
    if (multi && isMulti) score += 3
    if (multi && !isMulti) score -= 1
    if (!multi && isMulti) score -= 2
    return { c, score }
  })
  const hits = scored.filter((s) => s.score >= 2).sort((a, b) => b.score - a.score)
  if (!hits.length) return []
  // One clear winner, or two when they are close
  const best = hits[0].score
  return hits.filter((h) => h.score >= best - 1).slice(0, 2).map((h) => h.c)
}

/** Make sure the reply carries the link to each matched course. */
export function ensureStudioLinks(
  reply: string,
  matches: StudioCourse[]
): { reply: string; links: Array<{ title: string; url: string }> } {
  const links = matches.map((m) => ({ title: m.title, url: m.url }))
  const missing = matches.filter((m) => !reply.includes(m.url) && !reply.includes(`gennoor.com${m.url}`))
  if (!missing.length) return { reply, links }
  const tail = missing.map((m) => `[${m.title}](${m.url})`).join(' · ')
  return { reply: `${reply.trim()}\n\n▸ ${tail}`, links }
}
