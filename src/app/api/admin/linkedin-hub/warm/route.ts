import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { liveMin, loadWarm, startWarm, stopWarm, WARM_HOURS } from '@/lib/linkedin-warm'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

/** Whether the LinkedIn connector is being kept awake, and until when. */
export async function GET(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const state = await loadWarm()
  let live: Record<string, number> | null = null
  let detail = ''
  try { live = await liveMin() } catch (e: any) { detail = e?.message || 'Could not read Azure.' }
  return NextResponse.json({ state, live, awake: !!live && Object.values(live).every(n => n >= 1), hours: WARM_HOURS, detail })
}

/** { action: 'start', hours: 2|4|8, startAt?: ISO } | { action: 'stop' } */
export async function POST(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const b = await req.json().catch(() => ({}))
  try {
    if (b.action === 'stop') return NextResponse.json({ state: await stopWarm() })
    if (b.action === 'start') return NextResponse.json({ state: await startWarm(Number(b.hours), typeof b.startAt === 'string' ? b.startAt : undefined) })
    return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Could not change it.' }, { status: 502 })
  }
}
