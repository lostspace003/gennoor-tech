import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { costReport, GROUPS, type Granularity, type GroupBy } from '@/lib/azure-costs'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const GRAN: Granularity[] = ['day', 'week', 'month', 'cycle', 'quarter']
const DATE = /^\d{4}-\d{2}-\d{2}$/

/** Whole-subscription Azure cost for the admin Cost centre, bucketed by billing cycle / quarter / week / day. */
export async function GET(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const q = req.nextUrl.searchParams
  const from = q.get('from') || '', to = q.get('to') || ''
  const g = (q.get('granularity') || 'cycle') as Granularity
  const by = (q.get('groupBy') || 'ServiceName') as GroupBy
  if (!DATE.test(from) || !DATE.test(to) || !GRAN.includes(g) || !GROUPS.includes(by)) return NextResponse.json({ error: 'Invalid range or filter.' }, { status: 400 })
  try {
    return NextResponse.json(await costReport(from, to, g, by))
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Could not read Azure costs.' }, { status: 502 })
  }
}
