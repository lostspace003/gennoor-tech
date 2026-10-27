import { NextResponse } from 'next/server'
import { requireCrmUser } from '@/lib/crm/access'
import { getEnquiries, updateEnquiry } from '@/lib/azure-storage'

// Every form on the site lands in one list: who sent it, what for, and where it came from.
// GET ?days=90        the list, newest first
// PATCH               { type, rowKey, status?, note? }  status: New | Replied | Closed
const STATUSES = ['New', 'Replied', 'Closed']
const HIDDEN = new Set(['Unsubscribe'])

export async function GET(request: Request) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const days = Math.min(Math.max(Number(new URL(request.url).searchParams.get('days')) || 90, 1), 365)
  try {
    const rows = (await getEnquiries(undefined, days))
      .filter((r) => !HIDDEN.has(String(r.type)))
      .map((r) => ({
        type: r.type,
        rowKey: r.rowKey,
        createdAt: r.createdAt,
        status: r.status || 'New',
        note: r.note || '',
        name: r.name || '',
        email: r.email || '',
        phone: r.phone || r.whatsapp || '',
        organization: r.organization || r.company || '',
        about: r.topic || r.service || r.role || r.programTitle || r.webinarTitle || r.serviceName || '',
        message: r.detail || r.message || r.brief || '',
        source: r.srcTag || '',
        campaign: r.srcCampaign || '',
        referrer: r.srcReferrer || '',
        landing: r.srcLanding || '',
        page: r.srcPage || r.page || '',
        hasJourney: !!r.visitorId,
      }))
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    return NextResponse.json({ rows })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Could not load the enquiries' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const b = await request.json().catch(() => ({}))
  const type = String(b.type || ''), rowKey = String(b.rowKey || '')
  if (!type || !rowKey) return NextResponse.json({ error: 'type and rowKey required' }, { status: 400 })
  const updates: Record<string, string> = { handledBy: user.email, handledAt: new Date().toISOString() }
  if (b.status !== undefined) {
    if (!STATUSES.includes(b.status)) return NextResponse.json({ error: 'Unknown status' }, { status: 400 })
    updates.status = b.status
  }
  if (b.note !== undefined) updates.note = String(b.note).slice(0, 1000)
  await updateEnquiry(type, rowKey, updates)
  return NextResponse.json({ ok: true })
}
