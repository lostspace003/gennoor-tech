import { NextRequest, NextResponse } from 'next/server'
import { KEYS_CONTAINER, consumeToken, keyBlob, readBlobBuffer, verifyHlsToken } from '@/lib/lms-hls'
import { rateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

/**
 * Hands out the 16-byte decryption key of one lecture. Only a valid, short-lived
 * key token (issued with the playlist) works, and each learner can fetch a
 * limited number of keys per hour, so the key cannot be harvested in bulk.
 */
export async function GET(req: NextRequest) {
  const claims = await verifyHlsToken(req.nextUrl.searchParams.get('t'), 'key')
  if (!claims || !consumeToken(claims)) return new NextResponse('Link expired', { status: 401, headers: { 'Cache-Control': 'no-store' } })

  // A normal learner fetches one key per lesson. 150 an hour leaves room for skipping around.
  if (!rateLimit(`hlskey:${claims.email}`, 150, 60 * 60 * 1000)) {
    return new NextResponse('Too many requests', { status: 429, headers: { 'Cache-Control': 'no-store', 'Retry-After': '600' } })
  }

  const key = await readBlobBuffer(KEYS_CONTAINER, keyBlob(claims.slug, claims.item))
  if (!key || key.length !== 16) return new NextResponse('Not found', { status: 404, headers: { 'Cache-Control': 'no-store' } })

  return new NextResponse(new Uint8Array(key), {
    headers: { 'Content-Type': 'application/octet-stream', 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' },
  })
}
