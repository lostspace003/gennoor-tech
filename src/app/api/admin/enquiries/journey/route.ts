import { NextResponse } from 'next/server'
import { requireCrmUser } from '@/lib/crm/access'
import { getEnquiry, getVisitorJourney, getVisitorProfile } from '@/lib/azure-storage'

// GET ?type=CertificationEnquiry&rowKey=...
// The pages a lead viewed before submitting, e.g.
//   Organic Google → /guides/ai-103 → /services/poc-development → Form submitted
// Needs the enquiry to carry a visitorId (set when the form was sent from a tracked browser).
const JOURNEY_WINDOW_DAYS = 30

function channelLabel(t: Record<string, any> | null): string {
  if (!t) return 'Direct'
  const src = t.firstSource, medium = t.firstMedium, ref = t.firstReferrer
  if (src) return medium ? `${src} / ${medium}` : String(src)
  if (t.firstGclid) return 'Google Ads'
  if (t.firstFbclid) return 'Meta Ads'
  if (ref) return /google\./i.test(ref) ? 'Organic Google' : String(ref)
  return 'Direct'
}

export async function GET(request: Request) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sp = new URL(request.url).searchParams
  const type = sp.get('type') || '', rowKey = sp.get('rowKey') || ''
  if (!type || !rowKey) return NextResponse.json({ error: 'type and rowKey required' }, { status: 400 })

  const enquiry = await getEnquiry(type, rowKey)
  const visitorId = String(enquiry?.visitorId || '')
  if (!enquiry || !visitorId) return NextResponse.json({ steps: [], note: 'No visitor id on this enquiry (sent before tracking, or from a blocked browser).' })

  const submittedAt = String(enquiry.createdAt || new Date().toISOString())
  const from = new Date(new Date(submittedAt).getTime() - JOURNEY_WINDOW_DAYS * 86_400_000).toISOString()
  const [views, profile] = await Promise.all([getVisitorJourney(visitorId, from, submittedAt), getVisitorProfile(visitorId)])

  const pages: string[] = []
  for (const v of views) if (v.page && pages[pages.length - 1] !== v.page) pages.push(v.page)

  return NextResponse.json({
    firstTouch: channelLabel(profile),
    lastTouch: profile ? channelLabel({ firstSource: profile.lastSource, firstMedium: profile.lastMedium, firstReferrer: profile.lastReferrer, firstGclid: profile.lastGclid, firstFbclid: profile.lastFbclid }) : 'Direct',
    steps: [channelLabel(profile), ...pages.slice(-12), 'Form submitted'],
  })
}
