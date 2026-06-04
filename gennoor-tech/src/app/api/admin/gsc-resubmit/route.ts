import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { getGscAccessToken, GSC_SITE, GSC_SITEMAP } from '@/lib/gsc-auth'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function POST(request: NextRequest) {
  const { authorized } = await verifyAdmin(request)
  if (!authorized) return unauthorizedResponse()

  try {
    const token = await getGscAccessToken()
    const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE)}/sitemaps/${encodeURIComponent(GSC_SITEMAP)}`
    const res = await fetch(url, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok || res.status === 204) {
      return NextResponse.json({ success: true, message: `Resubmitted (HTTP ${res.status})`, submittedAt: new Date().toISOString() })
    }
    const body = await res.text()
    return NextResponse.json({ success: false, error: `HTTP ${res.status}: ${body.slice(0, 300)}` }, { status: 502 })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
