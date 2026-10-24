import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { pingSearchEngines } from '@/lib/seo-ping'
import { getLmsQuizzes, listAllLmsCourses, saveCatalogCourse } from '@/lib/lms'

export async function POST(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const { slug, published } = await req.json().catch(() => ({}))
  const course = (await listAllLmsCourses()).find(c => c.slug === slug)
  if (!course) return NextResponse.json({ error: 'Unknown course' }, { status: 404 })
  // Saving the course (built-in ones included) writes it to the catalog with the flag.
  await saveCatalogCourse({ ...course, published: !!published }, await getLmsQuizzes(course.slug))
  // Tell search engines about the new course (IndexNow now, Google through the re-index workflow when a token is set).
  if (published) pingSearchEngines([`/studio/${course.slug}`, '/studio', '/sitemap.xml'])
  return NextResponse.json({ ok: true, published: !!published })
}
