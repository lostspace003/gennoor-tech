import { getTocCourse, TOC_CONTAINER } from '@/lib/toc-courses'
import { signBlobUrl } from '@/lib/lms'

export const dynamic = 'force-dynamic'

const TTL = 6 * 60 * 60_000
const cache = new Map<string, { at: number; body: Buffer }>()

/** Fetch with a few retries: storage sometimes answers 503 for a moment. */
async function fetchWithRetry(url: string): Promise<Response | null> {
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url, { cache: 'no-store' })
      if (res.ok) return res
      if (res.status < 500 && res.status !== 429) return null
    } catch { /* try again */ }
    await new Promise(r => setTimeout(r, 300 * (i + 1)))
  }
  return null
}

/** Course card image, served from our own address: cached, retried, and no storage link in the page. */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const c = getTocCourse((await params).slug)
  if (!c) return new Response('Not found', { status: 404 })
  const hit = cache.get(c.slug)
  let body = hit && Date.now() - hit.at < TTL ? hit.body : null
  if (!body) {
    try {
      const res = await fetchWithRetry(signBlobUrl(TOC_CONTAINER, c.thumbnail, 5, { contentType: 'image/png' }))
      if (res) { body = Buffer.from(await res.arrayBuffer()); cache.set(c.slug, { at: Date.now(), body }) }
      else if (hit) body = hit.body // storage is down: serve the last good copy
    } catch (e) { console.error('toc-thumb failed', e); if (hit) body = hit.body }
  }
  if (!body) return new Response('The image is not available right now.', { status: 503, headers: { 'Cache-Control': 'no-store' } })
  return new Response(new Uint8Array(body), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' },
  })
}
