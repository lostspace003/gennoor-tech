import { NextRequest, NextResponse } from 'next/server'
import { BlobServiceClient } from '@azure/storage-blob'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { deleteCatalogCourse, isBuiltInCourse, listAllLmsCourses } from '@/lib/lms'
import { KEYS_CONTAINER, hlsContainer } from '@/lib/lms-hls'
import { deleteCourseIndex, qdrantConfigured } from '@/lib/course-index'

export const maxDuration = 300

/**
 * Delete an imported course for good: its catalog entry, its files in storage
 * (course container, encrypted video, keys) and its search index. The admin must
 * type the course slug to confirm. Learner accounts, enrollments and certificates
 * are kept. Built-in courses cannot be deleted (unpublish them).
 */
export async function POST(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()

  const { slug, confirm } = await req.json().catch(() => ({}))
  if (typeof slug !== 'string' || !/^[a-z0-9-]+$/.test(slug)) return NextResponse.json({ error: 'Unknown course' }, { status: 404 })
  if (isBuiltInCourse(slug)) return NextResponse.json({ error: 'This course is part of the site and cannot be deleted. Unpublish it instead.' }, { status: 400 })
  if (!(await listAllLmsCourses()).some(c => c.slug === slug)) return NextResponse.json({ error: 'Unknown course' }, { status: 404 })
  if (confirm !== slug) return NextResponse.json({ error: 'Type the course slug to confirm' }, { status: 400 })

  const conn = process.env.LMS_STORAGE_CONNECTION_STRING || process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!conn) return NextResponse.json({ error: 'LMS_STORAGE_CONNECTION_STRING is not configured on the server' }, { status: 500 })

  const svc = BlobServiceClient.fromConnectionString(conn)
  // Take it off the site first, so nothing half-deleted is ever shown.
  await deleteCatalogCourse(slug)
  await svc.getContainerClient(slug).deleteIfExists()
  await svc.getContainerClient(hlsContainer(slug)).deleteIfExists()
  const keys = svc.getContainerClient(KEYS_CONTAINER)
  for await (const b of keys.listBlobsFlat({ prefix: `${slug}/` })) await keys.deleteBlob(b.name).catch(() => {})
  if (qdrantConfigured()) await deleteCourseIndex(slug).catch(() => {})
  return NextResponse.json({ ok: true })
}
