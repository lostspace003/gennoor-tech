import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { getLmsQuizzes, listAllLmsCourses, saveCatalogCourse } from '@/lib/lms'
import { TRACKS, mergedOptions } from '@/lib/lms-taxonomy'
import { getCustomTaxonomy } from '@/lib/lms-taxonomy-store'

// Change how a course is classified: company, type, level, topics, domains.
export async function POST(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()

  const body = await req.json().catch(() => ({}))
  const course = (await listAllLmsCourses()).find(c => c.slug === body.slug)
  if (!course) return NextResponse.json({ error: 'Unknown course' }, { status: 404 })

  const opts = mergedOptions(await getCustomTaxonomy(true))
  const pick = (v: unknown, allowed: readonly string[]) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && allowed.includes(x)) : undefined)
  const next = { ...course, published: (course as { published?: boolean }).published !== false }
  if (typeof body.vendor === 'string' && opts.vendors.includes(body.vendor)) next.vendor = body.vendor
  if (opts.kinds.some(k => k.id === body.kind)) next.kind = body.kind
  if (typeof body.level === 'string' && opts.levels.includes(body.level)) next.level = body.level
  const topics = pick(body.topics, opts.topics)
  if (topics) next.topics_tags = topics
  const domains = pick(body.domains, opts.domains)
  if (domains) next.domains = domains
  if (typeof body.track === 'string' && (body.track === '' || TRACKS.some(t => t.id === body.track))) next.track = body.track

  await saveCatalogCourse(next, await getLmsQuizzes(course.slug))
  return NextResponse.json({ ok: true })
}
