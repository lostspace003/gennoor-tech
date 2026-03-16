import { NextResponse } from 'next/server'
import { trackPageView, initAppInsights } from '@/lib/analytics'
import { savePageView } from '@/lib/azure-storage'

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

    // Save to Azure Table Storage
    await savePageView({ page, url, referrer, userAgent, ip, country, city })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
