import { NextRequest, NextResponse } from 'next/server'
import { findLmsItem, getLmsProgress, saveLmsProgress } from '@/lib/lms'
import { noStore, requireEnrolled } from '@/lib/lms-guard'

export async function GET(req: NextRequest) {
  const gate = await requireEnrolled(req.nextUrl.searchParams.get('slug'))
  if (gate instanceof NextResponse) return gate
  return NextResponse.json({ progress: await getLmsProgress(gate.learner.email, gate.course.slug) }, { headers: noStore })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const gate = await requireEnrolled(body.slug ?? null)
  if (gate instanceof NextResponse) return gate
  const item = findLmsItem(gate.course, String(body.item || ''))
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const patch: { done?: boolean; positionSec?: number } = {}
  // Quizzes are marked done by the grader only.
  if (item.type === 'lecture' && typeof body.done === 'boolean') patch.done = body.done
  if (typeof body.positionSec === 'number' && body.positionSec >= 0) patch.positionSec = Math.floor(body.positionSec)
  await saveLmsProgress(gate.learner.email, gate.course.slug, item.id, patch)
  return NextResponse.json({ ok: true })
}
