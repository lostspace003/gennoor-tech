import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { getGscAccessToken, GSC_SITE } from '@/lib/gsc-auth'
import { groupByPage, toKeywordRows, type GscRow } from '@/lib/gsc-keywords-core'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

const day = (offset: number) => new Date(Date.now() - offset * 86_400_000).toISOString().slice(0, 10)

async function query(token: string, days: number, pageContains?: string): Promise<GscRow[]> {
  const body: Record<string, unknown> = { startDate: day(days), endDate: day(1), dimensions: ['query', 'page'], rowLimit: 5000 }
  if (pageContains) body.dimensionFilterGroups = [{ filters: [{ dimension: 'page', operator: 'contains', expression: pageContains }] }]
  const res = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE)}/searchAnalytics/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Search Console HTTP ${res.status}`)
  return ((await res.json()) as { rows?: GscRow[] }).rows || []
}

/** Top real queries per page (28 and 90 days), with striking-distance ones flagged. Admin only. */
export async function POST(request: NextRequest) {
  const { authorized } = await verifyAdmin(request)
  if (!authorized) return unauthorizedResponse()
  const body = await request.json().catch(() => ({}))
  const pageContains = typeof body.page === 'string' && body.page ? body.page : undefined
  try {
    const token = await getGscAccessToken()
    const [r28, r90] = await Promise.all([query(token, 28, pageContains), query(token, 90, pageContains)])
    const k28 = toKeywordRows(r28)
    const k90 = toKeywordRows(r90)
    return NextResponse.json({
      configured: true,
      d28: { pages: groupByPage(k28).slice(0, 25), striking: k28.filter(k => k.strikingDistance).sort((a, b) => b.impressions - a.impressions).slice(0, 40) },
      d90: { pages: groupByPage(k90).slice(0, 25), striking: k90.filter(k => k.strikingDistance).sort((a, b) => b.impressions - a.impressions).slice(0, 40) },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Search Console unavailable'
    // Never echo credentials: only the short reason.
    return NextResponse.json({ configured: false, reason: message.replace(/client_secret=[^&\s]+/gi, '').slice(0, 200) })
  }
}
