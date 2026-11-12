import { NextRequest, NextResponse } from 'next/server'
import { findLmsItem, signBlobUrl } from '@/lib/lms'
import { signHlsToken } from '@/lib/lms-hls'
import { noStore, requireLesson } from '@/lib/lms-guard'
import { rateLimit, clientIp } from '@/lib/rate-limit'

/**
 * Hands the player a short-lived link to the lecture video. The browser then
 * streams straight from Azure Storage - the web app serves only this JSON.
 *
 * Preview lessons are open to everyone. Every other lesson needs a signed-in
 * learner who owns the course.
 */
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  const itemId = req.nextUrl.searchParams.get('item') || ''
  const gate = await requireLesson(slug, itemId)
  if (gate instanceof NextResponse) return gate
  const { course, learner } = gate

  const item = findLmsItem(course, itemId)
  if (!item || item.type !== 'lecture') return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Someone watching a preview without signing in is known only by their address:
  // enough to stop one visitor asking for links in bulk.
  const ip = clientIp(req.headers)
  if (!learner && !rateLimit(`lms-preview:${ip}`, 40, 60 * 60_000)) {
    return NextResponse.json({ error: 'Too many previews. Please try again later.' }, { status: 429 })
  }
  const who = learner?.email || `preview:${ip}`

  const captionUrl = item.caption ? `/api/lms/caption?slug=${course.slug}&item=${item.id}` : null

  if (course.protected) {
    // hls.js asks for the playlist once. The browser's own HLS player (older iPhones) may ask several times.
    const native = req.nextUrl.searchParams.get('native') === '1'
    const token = await signHlsToken({ slug: course.slug, item: item.id, email: who }, 'playlist', 20 * 60, native ? 6 : 1)
    return NextResponse.json({ hlsUrl: `/api/lms/hls/playlist?t=${token}`, captionUrl }, { headers: noStore })
  }

  return NextResponse.json(
    {
      videoUrl: signBlobUrl(course.container, item.video, 20, { contentType: 'video/mp4' }),
      expiresInSec: 20 * 60,
      captionUrl,
    },
    { headers: noStore },
  )
}
