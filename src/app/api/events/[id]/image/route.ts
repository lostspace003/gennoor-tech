import { NextResponse } from 'next/server'
import { getAsset } from '@/lib/assets'
import { getEvent } from '@/lib/events'

export const dynamic = 'force-dynamic'

/** Public cover image of an event (only events that are not cancelled). */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ev = await getEvent(id)
  if (!ev || ev.cancelled || !ev.hasImage) return new NextResponse(null, { status: 404 })
  const f = await getAsset(`events/${ev.id}`)
  if (!f) return new NextResponse(null, { status: 404 })
  return new NextResponse(new Uint8Array(f.data), { headers: { 'Content-Type': f.contentType, 'Cache-Control': 'public, max-age=300' } })
}
