import { NextRequest, NextResponse } from 'next/server'
import { trackPageView, initAppInsights } from '@/lib/analytics'
import { savePageView, cleanTouch } from '@/lib/azure-storage'
import { auth } from '@/lib/auth'
import { clientIp } from '@/lib/rate-limit'

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

const ID_RE = /^[a-zA-Z0-9-]{8,64}$/

/** Developer / admin traffic: dev hosts, /admin and /studio paths, or a signed-in admin session. Never counted publicly. */
async function isInternalRequest(request: NextRequest, page: string, url: string): Promise<boolean> {
  const host = (request.headers.get('host') || '').split(':')[0]
  let urlHost = ''
  try { urlHost = new URL(url).hostname } catch { /* no url */ }
  if ([host, urlHost].some((h) => h === 'localhost' || h === '127.0.0.1' || h === '[::1]')) return true
  if (page.startsWith('/admin') || page.startsWith('/studio')) return true
  try {
    return !!(await auth())?.user?.email
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    initAppInsights()
    // sendBeacon posts the JSON as a Blob; request.json() reads that fine
    const body = await request.json()
    const page = String(body.page ?? '').slice(0, 300)
    const url = String(body.url ?? '').slice(0, 500)
    const referrer = String(body.referrer ?? '').slice(0, 500)
    const userAgent = String(body.userAgent ?? '')
    const timestamp = body.timestamp
    const visitorId = ID_RE.test(String(body.visitorId)) ? String(body.visitorId) : ''
    const sessionId = ID_RE.test(String(body.sessionId)) ? String(body.sessionId) : ''

    // Skip bot traffic
    if (isBot(userAgent)) {
      return NextResponse.json({ ok: true, skipped: 'bot' })
    }

    const isInternal = await isInternalRequest(request, page, url)

    // Extract IP and geo from server-side headers (Azure App Service)
    const seen = clientIp(request.headers)
    const ip = seen === 'unknown' ? '' : seen
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
    await savePageView({
      page, url, referrer, userAgent, ip, country, city,
      visitorId, sessionId, isInternal,
      firstTouch: cleanTouch(body.firstTouch),
      lastTouch: cleanTouch(body.lastTouch),
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('PageView API error:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
