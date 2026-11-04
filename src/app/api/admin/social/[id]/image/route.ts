import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { brandImageBuffer, generateImage, getImage, mutateDraft, writeBlob } from '@/lib/social/studio'
import { IMAGE_TYPES, readUpload } from '@/lib/assets'

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

/** Your own picture for this post (PNG, JPEG or WebP, up to 8 MB). The Gennoor logo and website strip is added under it. */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  try {
    const { id } = await params
    const up = await readUpload(await req.formData(), 'file', IMAGE_TYPES, 8)
    const out = await brandImageBuffer(up.data)
    await writeBlob(`social/${id}.png`, out.data, out.branded ? 'image/png' : up.type)
    const d = await mutateDraft(id, x => { x.hasImage = true })
    return d ? NextResponse.json({ draft: d }) : NextResponse.json({ error: 'Not found.' }, { status: 404 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Upload failed' }, { status: 400 })
  }
}
