import { NextRequest, NextResponse } from 'next/server'
import { trackPageView, initAppInsights } from '@/lib/analytics'
import { savePageView } from '@/lib/azure-storage'

export async function POST(request: NextRequest) {
  try {
    initAppInsights()
    const body = await request.json()
    const { page, url, referrer, userAgent, timestamp } = body

    // Extract IP and geo from server-side headers (works on both Azure and Vercel)
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      ''
    const country =
      request.headers.get('x-vercel-ip-country') ||
      request.headers.get('x-azure-clientip-country') ||
      ''
    const city =
      request.headers.get('x-vercel-ip-city') ||
      request.headers.get('x-azure-clientip-city') ||
      ''

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
