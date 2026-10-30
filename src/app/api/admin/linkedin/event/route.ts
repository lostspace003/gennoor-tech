import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { createExternalEvent, getLinkedInState } from '@/lib/linkedin'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/** Creates a LinkedIn Event on the Gennoor page for a webinar hosted on our own site. */
export async function POST(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const b = await req.json().catch(() => ({}))
  const title = String(b.title || '').trim()
  const startsAt = Date.parse(String(b.startsAt || ''))
  const endsAt = Date.parse(String(b.endsAt || ''))
  const url = String(b.url || '').trim()
  if (!title || !url.startsWith('http')) return NextResponse.json({ error: 'Title and a registration link are required.' }, { status: 400 })
  if (!Number.isFinite(startsAt) || !Number.isFinite(endsAt) || endsAt <= startsAt || startsAt < Date.now()) {
    return NextResponse.json({ error: 'Choose a start in the future and an end after it.' }, { status: 400 })
  }

  const s = await getLinkedInState()
  const token = s.orgAccessToken && s.orgExpiresAt && new Date(s.orgExpiresAt) > new Date() ? s.orgAccessToken : ''
  if (!token || !s.orgUrn) {
    return NextResponse.json({ error: 'Connect the company page first (LinkedIn page, "Connect + company page").' }, { status: 409 })
  }
  try {
    const r = await createExternalEvent({
      token, organizer: s.orgUrn, name: title.slice(0, 120), description: String(b.description || '').slice(0, 2000) || undefined,
      startsAt, endsAt, url, privacyPolicyUrl: 'https://www.gennoor.com/privacy',
    })
    return NextResponse.json({ ok: true, ...r })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Event creation failed' }, { status: 502 })
  }
}
