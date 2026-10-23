import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { saveCatalogCourse } from '@/lib/lms'
import { buildCourseFromContainer, copyCourseBlobs } from '@/lib/lms-import'

export const maxDuration = 300

/**
 * Import a Course Factory course from a container SAS URL: build the manifest,
 * start server-side copies of every blob into LMS storage, save the course as
 * an unpublished draft. The SAS is used for this request only and never stored.
 */
export async function POST(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()

  const conn = process.env.LMS_STORAGE_CONNECTION_STRING || process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!conn) return NextResponse.json({ error: 'LMS_STORAGE_CONNECTION_STRING is not configured on the server' }, { status: 500 })

  const { sasUrl, slug, vendor, kind, topics, domains } = await req.json().catch(() => ({}))
  if (!sasUrl || typeof sasUrl !== 'string') return NextResponse.json({ error: 'Paste the container SAS URL' }, { status: 400 })

  try {
    const built = await buildCourseFromContainer(sasUrl, typeof slug === 'string' ? slug : undefined, { vendor, kind, topics: Array.isArray(topics) ? topics : undefined, domains: Array.isArray(domains) ? domains : undefined })
    const copy = await copyCourseBlobs({
      connectionString: conn,
      slug: built.course.slug,
      sourceUrl: built.sourceUrl,
      source: built.source,
      blobs: built.blobs,
      renamed: built.renamed,
    })
    await saveCatalogCourse(built.course, built.quizzes)
    return NextResponse.json({
      slug: built.course.slug,
      title: built.course.title,
      stats: built.course.stats,
      files: built.blobs.length,
      copy,
    })
  } catch (err: any) {
    const msg = err?.statusCode === 403 || err?.statusCode === 401 ? 'The SAS URL was refused - it may have expired or lack read + list permission' : err?.message || 'Import failed'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
