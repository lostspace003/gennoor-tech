import { NextRequest, NextResponse } from 'next/server'
import { consumeToken, hlsContainer, readBlobBuffer, rewritePlaylist, segmentSas, signHlsToken, verifyHlsToken } from '@/lib/lms-hls'

export const dynamic = 'force-dynamic'

/**
 * The lecture playlist. The link carries a short-lived signed token (minted by
 * /api/lms/play after the sign-in and enrollment check), so players that do not
 * send cookies on playlist requests (native HLS on iPhones) work too.
 */
export async function GET(req: NextRequest) {
  const claims = await verifyHlsToken(req.nextUrl.searchParams.get('t'), 'playlist')
  if (!claims || !consumeToken(claims)) return new NextResponse('Link expired', { status: 401, headers: { 'Cache-Control': 'no-store' } })

  const raw = await readBlobBuffer(hlsContainer(claims.slug), `${claims.item}/index.m3u8`)
  if (!raw) return new NextResponse('Not found', { status: 404, headers: { 'Cache-Control': 'no-store' } })

  const keyToken = await signHlsToken(claims, 'key', 20 * 60, 2)
  const body = rewritePlaylist(raw.toString('utf8'), claims.item, {
    ...segmentSas(claims.slug),
    keyUrl: `/api/lms/hls/key?t=${keyToken}`,
  })

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'application/vnd.apple.mpegurl',
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
