import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { getLmsQuizzes, listAllLmsCourses, saveCatalogCourse } from '@/lib/lms'
import { indexLmsCourseInBackground } from '@/lib/course-index'

export async function POST(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const { slug, published } = await req.json().catch(() => ({}))
  const course = (await listAllLmsCourses()).find(c => c.slug === slug)
  if (!course) return NextResponse.json({ error: 'Unknown course' }, { status: 404 })
  // Saving the course (built-in ones included) writes it to the catalog with the flag.
  await saveCatalogCourse({ ...course, published: !!published }, await getLmsQuizzes(course.slug))
  // a published course is complete: make its lessons searchable for the Ask bot (no-op without Qdrant)
  if (published) indexLmsCourseInBackground(course)
  return NextResponse.json({ ok: true, published: !!published })
}
