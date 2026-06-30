import { NextRequest, NextResponse } from 'next/server'
import { trackPageView, initAppInsights } from '@/lib/analytics'
import { savePageView } from '@/lib/azure-storage'

// Common bot user-agent patterns
const BOT_PATTERNS = [
  /bot\b/i, /crawl/i, /spider/i, /slurp/i, /mediapartners/i,
  /facebookexternalhit/i, /linkedinbot/i, /twitterbot/i, /whatsapp/i,
  /bingpreview/i, /msnbot/i, /yandex/i, /baidu/i, /duckduck/i,
  /sogou/i, /exabot/i, /ia_archiver/i, /semrush/i, /ahrefs/i,
  /dotbot/i, /rogerbot/i, /screaming/i, /uptimerobot/i, /pingdom/i,
  /gtmetrix/i, /pageSpeed/i, /lighthouse/i, /headlesschrome/i,
  /phantomjs/i, /python-requests/i, /curl\//i, /wget\//i, /httpx/i,
  /go-http-client/i, /java\//i, /perl/i, /ruby/i, /axios/i,
  /node-fetch/i, /undici/i, /scrapy/i, /nutch/i, /archive/i,
  /bytespider/i, /gptbot/i, /claudebot/i, /anthropic/i, /ccbot/i,
  /amazonbot/i, /applebot/i,
]

function isBot(userAgent: string): boolean {
  if (!userAgent) return true
  return BOT_PATTERNS.some(pattern => pattern.test(userAgent))
}

export async function POST(request: NextRequest) {
  try {
    initAppInsights()
    const body = await request.json()
    const { page, url, referrer, userAgent, timestamp } = body

    // Skip bot traffic
    if (isBot(userAgent)) {
      return NextResponse.json({ ok: true, skipped: 'bot' })
    }

    // Extract IP and geo from server-side headers (Azure App Service)
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      ''
    const country =
      request.headers.get('x-azure-clientip-country') ||
      ''
    const city =
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
  } catch (error) {
    console.error('PageView API error:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
