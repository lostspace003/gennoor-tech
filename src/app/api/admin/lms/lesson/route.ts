import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { getLmsQuizzes, listAllLmsCourses, saveCatalogCourse } from '@/lib/lms'

// Rename one lesson (or quiz) of a course: { slug, itemId, title }.
export async function POST(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const body = await req.json().catch(() => ({}))
  const title = typeof body.title === 'string' ? body.title.replace(/\s+/g, ' ').trim() : ''
  if (title.length < 2 || title.length > 140 || /[<>]/.test(title)) return NextResponse.json({ error: 'Title must be 2 to 140 characters, without < or >.' }, { status: 400 })
  const course = (await listAllLmsCourses()).find(c => c.slug === body.slug)
  if (!course) return NextResponse.json({ error: 'Unknown course' }, { status: 404 })
  let found = false
  const next = {
    ...course,
    published: (course as { published?: boolean }).published !== false,
    sections: course.sections.map(s => ({
      ...s,
      items: s.items.map(i => {
        if (i.id !== body.itemId) return i
        found = true
        return { ...i, title }
      }),
    })),
  }
  if (!found) return NextResponse.json({ error: 'Unknown lesson' }, { status: 404 })
  await saveCatalogCourse(next, await getLmsQuizzes(course.slug))
  return NextResponse.json({ ok: true, title })
}
