import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { getGscAccessToken, GSC_SITE } from '@/lib/gsc-auth'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

interface SitemapInfo {
  path: string
  lastSubmitted?: string
  lastDownloaded?: string
  isPending?: boolean
  isSitemapsIndex?: boolean
  contents?: Array<{ type: string; submitted?: string; indexed?: string }>
  errors?: string
  warnings?: string
}

export async function POST(request: NextRequest) {
  const { authorized } = await verifyAdmin(request)
  if (!authorized) return unauthorizedResponse()

  try {
    const token = await getGscAccessToken()

    const headers = { Authorization: `Bearer ${token}` }
    const siteEnc = encodeURIComponent(GSC_SITE)

    const sitemapsRes = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${siteEnc}/sitemaps`,
      { headers, cache: 'no-store' }
    )

    if (sitemapsRes.status === 403) {
      return NextResponse.json({
        configured: false,
        reason: 'Service account is not added as a user on the GSC property. Add gennoor-indexing@gennoor-youtube-api-project.iam.gserviceaccount.com as Owner in Search Console → Settings → Users and permissions.',
      })
    }

    const sitemapsData = sitemapsRes.ok ? await sitemapsRes.json() : { sitemap: [] }

    const endDate = new Date().toISOString().slice(0, 10)
    const start90 = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    const start28 = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

    const indexedRes = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${siteEnc}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate: start90,
          endDate,
          dimensions: ['page'],
          rowLimit: 25000,
        }),
        cache: 'no-store',
      }
    )
    const indexedData = indexedRes.ok ? await indexedRes.json() : { rows: [] }
    const indexedCount = (indexedData.rows || []).length

    const topRes = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${siteEnc}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate: start28,
          endDate,
          dimensions: ['page'],
          rowLimit: 10,
        }),
        cache: 'no-store',
      }
    )
    const topData = topRes.ok ? await topRes.json() : { rows: [] }

    const summaryRes = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${siteEnc}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate: start28,
          endDate,
          rowLimit: 1,
        }),
        cache: 'no-store',
      }
    )
    const summaryData = summaryRes.ok ? await summaryRes.json() : { rows: [] }
    const summary = (summaryData.rows && summaryData.rows[0]) || { clicks: 0, impressions: 0, ctr: 0, position: 0 }

    const sitemaps: SitemapInfo[] = (sitemapsData.sitemap || []).map((s: SitemapInfo) => ({
      path: s.path,
      lastSubmitted: s.lastSubmitted,
      lastDownloaded: s.lastDownloaded,
      isPending: s.isPending,
      isSitemapsIndex: s.isSitemapsIndex,
      contents: s.contents,
      errors: s.errors,
      warnings: s.warnings,
    }))

    return NextResponse.json({
      configured: true,
      site: GSC_SITE,
      indexedCount,
      sitemaps,
      summary28d: {
        clicks: summary.clicks || 0,
        impressions: summary.impressions || 0,
        ctr: summary.ctr || 0,
        position: summary.position || 0,
      },
      topPages: (topData.rows || []).map((r: { keys: string[]; clicks: number; impressions: number; ctr: number; position: number }) => ({
        page: r.keys[0],
        clicks: r.clicks,
        impressions: r.impressions,
        ctr: r.ctr,
        position: r.position,
      })),
      checkedAt: new Date().toISOString(),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ configured: false, error: message }, { status: 500 })
  }
}
