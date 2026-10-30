import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { generateImage, getImage } from '@/lib/social/studio'

export const dynamic = 'force-dynamic'
export const maxDuration = 180

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const img = await getImage((await params).id)
  if (!img) return new NextResponse(null, { status: 404 })
  return new NextResponse(new Uint8Array(img), { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'private, no-store' } })
}

/** Image agent: (re)generates the picture from the draft's current image prompt. */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  try {
    const d = await generateImage((await params).id)
    return d ? NextResponse.json({ draft: d }) : NextResponse.json({ error: 'Not found.' }, { status: 404 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Image generation failed' }, { status: 502 })
  }
}
