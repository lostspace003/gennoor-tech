import { NextResponse } from 'next/server'
import { getEvents, publicView } from '@/lib/events'

export const dynamic = 'force-dynamic'

/** Upcoming public events (no join links, no registrant data). */
export async function GET() {
  try {
    const now = Date.now()
    const events = (await getEvents())
      .filter((e) => !e.cancelled && new Date(e.startsAt).getTime() + e.durationMinutes * 60_000 > now)
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    return NextResponse.json({ events: events.map(publicView) })
  } catch {
    return NextResponse.json({ events: [] })
  }
}
