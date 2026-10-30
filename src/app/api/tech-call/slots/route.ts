import { NextResponse } from 'next/server'
import { getEnquiries } from '@/lib/azure-storage'
import { SLOT_STARTS, TECH_CALL_TYPE, heldSlotKeys, isOfferedSlot, offeredDates, slotKey } from '@/lib/tech-call'
import { rateLimit, clientIp } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

/** Which of the 6-9 pm IST slots are still open, per date. A slot is held by any pending or approved request. */
export async function GET(request: Request) {
  if (!rateLimit(`tech-call-slots:${clientIp(request.headers)}`, 60, 10 * 60_000)) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })
  }
  const rows = await getEnquiries(TECH_CALL_TYPE, 60).catch(() => [])
  const held = heldSlotKeys(rows)
  const days = offeredDates().map(date => ({
    date,
    slots: SLOT_STARTS.filter(t => isOfferedSlot(date, t)).map(time => ({ time, open: !held.has(slotKey(date, time)) })),
  })).filter(d => d.slots.length)
  return NextResponse.json({ days })
}
