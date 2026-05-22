import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'

const HOST = 'gennoor.com'
const KEY = '1774b0e00b584216b04f41a75b9de8e2'
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`
const SITEMAP_URL = `https://${HOST}/sitemap.xml`
const BATCH_SIZE = 100

export async function POST(request: NextRequest) {
  const { authorized } = await verifyAdmin(request)
  if (!authorized) return unauthorizedResponse()

  try {
    const sitemapRes = await fetch(SITEMAP_URL, { cache: 'no-store' })
    if (!sitemapRes.ok) {
      return NextResponse.json({ success: false, error: `Sitemap HTTP ${sitemapRes.status}` }, { status: 502 })
    }
    const sitemapXml = await sitemapRes.text()
    const urls = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1])

    let succeeded = 0
    const errors: string[] = []
    for (let i = 0; i < urls.length; i += BATCH_SIZE) {
      const batch = urls.slice(i, i + BATCH_SIZE)
      const res = await fetch('https://api.indexnow.org/IndexNow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: batch }),
      })
      if (res.ok || res.status === 202) succeeded += batch.length
      else errors.push(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: HTTP ${res.status}`)
    }

    return NextResponse.json({
      success: errors.length === 0,
      submitted: succeeded,
      total: urls.length,
      errors,
      submittedAt: new Date().toISOString(),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
