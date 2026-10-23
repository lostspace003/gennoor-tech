import { NextRequest, NextResponse } from 'next/server'
import { BlobServiceClient } from '@azure/storage-blob'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { getLmsQuizzes, listAllLmsCourses, saveCatalogCourse } from '@/lib/lms'

export const maxDuration = 300

/**
 * Attach a promo video or thumbnail to a course. Paste a SAS URL for the single
 * file (read permission); it is copied into the course storage and the course
 * page starts using it. The SAS is used for this request only.
 */
export async function POST(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const conn = process.env.LMS_STORAGE_CONNECTION_STRING || process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!conn) return NextResponse.json({ error: 'LMS_STORAGE_CONNECTION_STRING is not configured on the server' }, { status: 500 })

  const { slug, kind, sasUrl } = await req.json().catch(() => ({}))
  const course = (await listAllLmsCourses()).find(c => c.slug === slug)
  if (!course) return NextResponse.json({ error: 'Unknown course' }, { status: 404 })
  if (kind !== 'promo' && kind !== 'thumbnail') return NextResponse.json({ error: 'kind must be promo or thumbnail' }, { status: 400 })

  let url: URL
  try {
    url = new URL(String(sasUrl).trim())
  } catch {
    return NextResponse.json({ error: 'That is not a valid URL' }, { status: 400 })
  }
  if (url.protocol !== 'https:' || !url.hostname.endsWith('.blob.core.windows.net') || !url.searchParams.get('sig')) {
    return NextResponse.json({ error: 'Use the SAS URL of the file from Azure Storage' }, { status: 400 })
  }
  const ext = (url.pathname.split('.').pop() || '').toLowerCase()
  if (kind === 'promo' && ext !== 'mp4') return NextResponse.json({ error: 'The promo must be an .mp4 file' }, { status: 400 })
  if (kind === 'thumbnail' && !['png', 'jpg', 'jpeg', 'webp'].includes(ext)) return NextResponse.json({ error: 'The thumbnail must be a png, jpg or webp image' }, { status: 400 })

  try {
    const dest = BlobServiceClient.fromConnectionString(conn).getContainerClient(course.container)
    await dest.createIfNotExists()
    const to = kind === 'promo' ? '_public/promo.mp4' : `_public/thumbnail.${ext === 'jpeg' ? 'jpg' : ext}`
    await (await dest.getBlobClient(to).beginCopyFromURL(url.toString())).pollUntilDone()
    await saveCatalogCourse({ ...course, [kind]: to, published: (course as { published?: boolean }).published !== false }, await getLmsQuizzes(course.slug))
    return NextResponse.json({ ok: true, [kind]: to })
  } catch (err: any) {
    const msg = err?.statusCode === 403 || err?.statusCode === 401 || err?.statusCode === 404 ? 'The SAS URL was refused or the file was not found' : err?.message || 'Upload failed'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
