import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { getLmsQuizzes, listAllLmsCourses, saveCatalogCourse } from '@/lib/lms'
import { ALL_PLATFORMS, DOMAINS, KINDS, LEVELS, TOPICS, TRACKS } from '@/lib/lms-taxonomy'

// Change how a course is classified: company, type, level, topics, domains.
export async function POST(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()

  const body = await req.json().catch(() => ({}))
  const course = (await listAllLmsCourses()).find(c => c.slug === body.slug)
  if (!course) return NextResponse.json({ error: 'Unknown course' }, { status: 404 })

  const pick = (v: unknown, allowed: readonly string[]) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && allowed.includes(x)) : undefined)
  const next = { ...course, published: (course as { published?: boolean }).published !== false }
  if (typeof body.vendor === 'string' && ALL_PLATFORMS.includes(body.vendor)) next.vendor = body.vendor
  if (KINDS.some(k => k.id === body.kind)) next.kind = body.kind
  if (typeof body.level === 'string' && (LEVELS as readonly string[]).includes(body.level)) next.level = body.level
  const topics = pick(body.topics, TOPICS)
  if (topics) next.topics_tags = topics
  const domains = pick(body.domains, DOMAINS)
  if (domains) next.domains = domains
  if (typeof body.track === 'string' && (body.track === '' || TRACKS.some(t => t.id === body.track))) next.track = body.track

  await saveCatalogCourse(next, await getLmsQuizzes(course.slug))
  return NextResponse.json({ ok: true })
}
