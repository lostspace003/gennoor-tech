import { NextRequest, NextResponse } from 'next/server'
import { findLmsItem, signBlobUrl } from '@/lib/lms'
import { noStore, requireEnrolled } from '@/lib/lms-guard'

/**
 * Hands the player a short-lived link to the lecture video. The browser then
 * streams straight from Azure Storage - the web app serves only this JSON.
 */
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  const gate = await requireEnrolled(slug)
  if (gate instanceof NextResponse) return gate
  const { course } = gate

  const item = findLmsItem(course, req.nextUrl.searchParams.get('item') || '')
  if (!item || item.type !== 'lecture') return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(
    {
      videoUrl: signBlobUrl(course.container, item.video, 20, { contentType: 'video/mp4' }),
      expiresInSec: 20 * 60,
      captionUrl: item.caption ? `/api/lms/caption?slug=${course.slug}&item=${item.id}` : null,
    },
    { headers: noStore },
  )
}
