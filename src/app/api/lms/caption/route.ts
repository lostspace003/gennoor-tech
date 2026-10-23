import { NextRequest, NextResponse } from 'next/server'
import { findLmsItem, readBlobText } from '@/lib/lms'
import { requireEnrolled } from '@/lib/lms-guard'

// Captions are tiny; serving them from here keeps <track> same-origin (no
// storage CORS rules needed).
export async function GET(req: NextRequest) {
  const gate = await requireEnrolled(req.nextUrl.searchParams.get('slug'))
  if (gate instanceof NextResponse) return gate
  const item = findLmsItem(gate.course, req.nextUrl.searchParams.get('item') || '')
  if (!item || item.type !== 'lecture' || !item.caption) return new NextResponse('Not found', { status: 404 })
  try {
    const vtt = await readBlobText(gate.course.container, item.caption)
    return new NextResponse(vtt, { headers: { 'Content-Type': 'text/vtt; charset=utf-8', 'Cache-Control': 'private, max-age=3600' } })
  } catch {
    return new NextResponse('Not found', { status: 404 })
  }
}
