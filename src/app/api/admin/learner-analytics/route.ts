import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { buildLearnerAnalytics, dayOf } from '@/lib/learner-analytics'

const DAY = /^\d{4}-\d{2}-\d{2}$/

/** Admin > Learner analytics: who is learning what, between two days (India time, both included). */
export async function GET(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const q = req.nextUrl.searchParams
  const today = dayOf(new Date().toISOString())
  const to = DAY.test(q.get('to') || '') ? q.get('to')! : today
  // With no start, the last thirty days
  const from = DAY.test(q.get('from') || '') ? q.get('from')! : dayOf(new Date(Date.now() - 29 * 86_400_000).toISOString())
  if (from > to) return NextResponse.json({ error: 'The first day is after the last day.' }, { status: 400 })
  try {
    return NextResponse.json(await buildLearnerAnalytics({ from, to }), { headers: { 'Cache-Control': 'no-store' } })
  } catch (e) {
    console.error('[learner-analytics]', e)
    return NextResponse.json({ error: 'The learner records could not be read. Try again in a moment.' }, { status: 500 })
  }
}
