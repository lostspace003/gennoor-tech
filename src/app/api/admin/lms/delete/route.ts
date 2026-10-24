import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { deleteCatalogCourse, isBuiltInCourse, listAllLmsCourses } from '@/lib/lms'
import { deleteCourseIndex, qdrantConfigured } from '@/lib/course-index'

export const maxDuration = 300

/**
 * Delete a course from the LMS: it leaves the catalog, the site and the search
 * index. Its files stay in blob storage (course container, encrypted video, keys),
 * so nothing is lost and it can be imported again. The admin must type the course
 * slug to confirm. Learner accounts, enrollments and certificates are kept.
 * Built-in courses cannot be deleted (unpublish them).
 */
export async function POST(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()

  const { slug, confirm } = await req.json().catch(() => ({}))
  if (typeof slug !== 'string' || !/^[a-z0-9-]+$/.test(slug)) return NextResponse.json({ error: 'Unknown course' }, { status: 404 })
  if (isBuiltInCourse(slug)) return NextResponse.json({ error: 'This course is part of the site and cannot be deleted. Unpublish it instead.' }, { status: 400 })
  if (!(await listAllLmsCourses()).some(c => c.slug === slug)) return NextResponse.json({ error: 'Unknown course' }, { status: 404 })
  if (confirm !== slug) return NextResponse.json({ error: 'Type the course slug to confirm' }, { status: 400 })

  await deleteCatalogCourse(slug)
  if (qdrantConfigured()) await deleteCourseIndex(slug).catch(() => {})
  return NextResponse.json({ ok: true })
}
