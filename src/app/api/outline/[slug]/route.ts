import { getTocCourse, TOC_CONTAINER } from '@/lib/toc-courses'
import { signBlobUrl } from '@/lib/lms'
import { rateLimit, clientIp } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

/** The course outline page, served from our own address so the storage link and its signature never reach the browser. */
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!rateLimit(`outline-view:${clientIp(request.headers)}`, 60, 10 * 60_000)) {
    return new Response('Too many requests. Please try again in a few minutes.', { status: 429 })
  }
  const c = getTocCourse((await params).slug)
  if (!c) return new Response('Not found', { status: 404 })
  try {
    const res = await fetch(signBlobUrl(TOC_CONTAINER, c.outlineHtml, 5), { cache: 'no-store' })
    if (!res.ok) return new Response('The outline is not available right now. Please try again shortly.', { status: 503 })
    return new Response(await res.text(), {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'private, no-store',
        // scripts may run inside the outline, but it cannot reach our cookies or pages
        'Content-Security-Policy': 'sandbox allow-scripts',
        'X-Robots-Tag': 'noindex',
      },
    })
  } catch (e) {
    console.error('outline view failed', e)
    return new Response('The outline is not available right now. Please try again shortly.', { status: 503 })
  }
}
