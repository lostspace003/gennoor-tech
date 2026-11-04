import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { IMAGE_TYPES, putAsset, readUpload } from '@/lib/assets'
import { getEvent, mutateEvents } from '@/lib/events'
import { brandImageBuffer } from '@/lib/social/studio'

export const dynamic = 'force-dynamic'

/** Your own cover image for an event: multipart form with `id` and `file` (PNG, JPEG or WebP, up to 8 MB). */
export async function POST(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  try {
    const form = await req.formData()
    const ev = await getEvent(String(form.get('id') || ''))
    if (!ev) return NextResponse.json({ error: 'Event not found.' }, { status: 404 })
    const up = await readUpload(form, 'file', IMAGE_TYPES, 8)
    const out = await brandImageBuffer(up.data)
    await putAsset(`events/${ev.id}`, out.data, out.branded ? 'image/png' : up.type)
    await mutateEvents((events) => { const e = events.find((x) => x.id === ev.id); if (e) { e.hasImage = true } })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Upload failed.' }, { status: 400 })
  }
}
