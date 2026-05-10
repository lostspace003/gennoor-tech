import { NextResponse } from 'next/server'

const INDEXNOW_KEY = '1774b0e00b584216b04f41a75b9de8e2'
const HOST = 'gennoor.com'

export async function POST(request: Request) {
  const adminSecret = request.headers.get('x-admin-secret')
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sitemapRes = await fetch(`https://${HOST}/sitemap.xml`)
  const sitemapXml = await sitemapRes.text()
  const urls = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1])

  const batches: string[][] = []
  for (let i = 0; i < urls.length; i += 100) {
    batches.push(urls.slice(i, i + 100))
  }

  const results: { batch: number; status: number; count: number }[] = []

  for (let i = 0; i < batches.length; i++) {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
        urlList: batches[i],
      }),
    })
    results.push({ batch: i + 1, status: res.status, count: batches[i].length })
  }

  return NextResponse.json({ totalUrls: urls.length, batches: results })
}
