import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import { verifyLearnerSession } from '@/lib/learner-auth'
import { listLmsCourses } from '@/lib/lms'
import { courses as interactiveCourses } from '@/config/courses'
import { searchAllCourses, qdrantConfigured, type CourseHit } from '@/lib/course-index'

export const dynamic = 'force-dynamic'

/**
 * Lessons for the website search box. Returns { lessons: [] } (never an error) when the course
 * index is not set up or is down, so the normal page results are never affected.
 * Signed-in learners get a direct lesson link and a short snippet; visitors get the course page
 * and titles only (lessons need an account, and the transcript text stays private).
 */

const MIN_SCORE = 0.3
const MAX_RESULTS = 6
const SNIPPET = 120

interface Raw { slug: string; kind: 'lms' | 'interactive'; lessonId: string; lessonTitle: string; text: string; score: number }

const cache = new Map<string, { at: number; raw: Raw[] }>()
const CACHE_MS = 5 * 60_000

function snippet(text: string): string {
  const t = text.replace(/\s+/g, ' ').trim()
  if (t.length <= SNIPPET) return t
  const cut = t.slice(0, SNIPPET)
  const at = cut.lastIndexOf(' ')
  return cut.slice(0, at > 60 ? at : SNIPPET).trim() + '…'
}

function dedupe(hits: CourseHit[]): Raw[] {
  const best = new Map<string, Raw>()
  for (const h of hits) {
    if (h.score < MIN_SCORE) continue
    const key = `${h.courseSlug}:${h.lessonId}`
    const prev = best.get(key)
    if (!prev || h.score > prev.score) {
      best.set(key, { slug: h.courseSlug, kind: h.courseKind, lessonId: h.lessonId, lessonTitle: h.lessonTitle, text: h.text, score: h.score })
    }
  }
  return [...best.values()].sort((a, b) => b.score - a.score).slice(0, MAX_RESULTS)
}

export async function GET(req: NextRequest) {
  const empty = NextResponse.json({ lessons: [] })
  const q = (req.nextUrl.searchParams.get('q') || '').trim().replace(/\s+/g, ' ').slice(0, 120)
  if (q.length < 3 || !qdrantConfigured()) return empty

  const ip = clientIp(req.headers)
  if (!rateLimit(`site-lessons:${ip}`, 30, 60_000)) return empty

  const key = q.toLowerCase()
  let hit = cache.get(key)
  if (!hit || Date.now() - hit.at > CACHE_MS) {
    const raw = dedupe(await searchAllCourses(q))
    hit = { at: Date.now(), raw }
    if (cache.size > 200) cache.delete(cache.keys().next().value as string)
    cache.set(key, hit)
  }
  if (!hit.raw.length) return empty

  const learner = await verifyLearnerSession().catch(() => null)
  const lms = new Map((await listLmsCourses().catch(() => [])).map(c => [c.slug, c]))
  const lessons = hit.raw.flatMap(r => {
    if (r.kind === 'lms') {
      const c = lms.get(r.slug)
      if (!c) return []
      return [{
        courseTitle: c.title,
        lessonTitle: r.lessonTitle,
        href: learner ? `/studio/${r.slug}/learn?item=${encodeURIComponent(r.lessonId)}` : `/studio/${r.slug}`,
        snippet: learner ? snippet(r.text) : '',
      }]
    }
    const c = interactiveCourses.find(x => `ia-${x.id}` === r.slug)
    const ch = c?.chapters.find(x => x.id === r.lessonId)
    if (!c || !ch) return []
    return [{
      courseTitle: c.title,
      lessonTitle: r.lessonTitle,
      href: learner ? `/ai-academy/${c.id}/${ch.slug}` : `/ai-academy/${c.id}`,
      snippet: learner ? snippet(r.text) : '',
    }]
  })
  return NextResponse.json({ lessons }, { headers: { 'Cache-Control': 'private, no-store' } })
}
