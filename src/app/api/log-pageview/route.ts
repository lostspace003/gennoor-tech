import { NextResponse } from 'next/server'
import { trackPageView, initAppInsights } from '@/lib/analytics'

export async function POST(request: Request) {
  try {
    initAppInsights()
    const body = await request.json()
    const { page, url, referrer, userAgent, ip, country, city, timestamp } = body

    trackPageView(page, url, {
      referrer,
      userAgent,
      ip,
      country,
      city,
      timestamp,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
