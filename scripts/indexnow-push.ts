/*
 * One-shot IndexNow submission.
 *
 * Fetches the live sitemap.xml from gennoor.com, extracts every <loc>, and
 * batches them to the IndexNow API. IndexNow notifies Bing, Yandex, Naver,
 * Seznam, and (any participating engine) immediately — they typically crawl
 * within hours instead of days.
 *
 * Google does NOT participate in IndexNow. For Google, the user must submit
 * the sitemap manually in Google Search Console (or rely on auto-discovery
 * via robots.txt, which is already configured).
 *
 * Usage:
 *   node --experimental-strip-types scripts/indexnow-push.ts
 */

const HOST = 'gennoor.com'
const KEY = '1774b0e00b584216b04f41a75b9de8e2'
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`
const SITEMAP_URL = `https://${HOST}/sitemap.xml`
const BATCH_SIZE = 100 // IndexNow recommends batching for large lists

const TRIES = 6 // the site can answer 502 for a minute or two while a new version starts
const WAIT_MS = 30_000

/**
 * The sitemap, asked for again if the site is not ready. This job runs just after a deploy, and on
 * 13 November 2026 one run failed on a single "HTTP 502" that was gone a minute later.
 */
async function fetchSitemap(): Promise<string> {
  let last = ''
  for (let attempt = 1; attempt <= TRIES; attempt++) {
    try {
      const res = await fetch(SITEMAP_URL, { cache: 'no-store' })
      if (res.ok) {
        const xml = await res.text()
        if (xml.includes('<loc>')) return xml
        last = 'the answer held no page addresses'
      } else last = `HTTP ${res.status}`
    } catch (e) {
      last = String((e as Error)?.message || e)
    }
    if (attempt < TRIES) {
      console.log(`  not ready (${last}); trying again in ${WAIT_MS / 1000} seconds (${attempt} of ${TRIES})`)
      await new Promise(r => setTimeout(r, WAIT_MS))
    }
  }
  throw new Error(`Failed to fetch sitemap after ${TRIES} tries: ${last}`)
}

async function main() {
  console.log(`Fetching sitemap from ${SITEMAP_URL} ...`)
  const sitemapXml = await fetchSitemap()
  const urls = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1])
  console.log(`Found ${urls.length} URLs in sitemap`)

  const batches: string[][] = []
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    batches.push(urls.slice(i, i + BATCH_SIZE))
  }

  let totalSucceeded = 0
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i]
    process.stdout.write(`Batch ${i + 1}/${batches.length} (${batch.length} URLs) ... `)
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: HOST,
        key: KEY,
        keyLocation: KEY_LOCATION,
        urlList: batch,
      }),
    })
    if (res.ok || res.status === 200 || res.status === 202) {
      console.log(`✓ ${res.status}`)
      totalSucceeded += batch.length
    } else {
      const body = await res.text().catch(() => '')
      console.log(`✗ HTTP ${res.status} ${body.slice(0, 200)}`)
    }
  }

  console.log('')
  console.log(`Submitted ${totalSucceeded}/${urls.length} URLs to IndexNow`)
  console.log('Bing / Yandex / Naver / Seznam will crawl shortly (hours, not days).')
  console.log('')
  console.log('Google does NOT participate in IndexNow. For Google:')
  console.log(`  1. Open https://search.google.com/search-console`)
  console.log(`  2. Pick property: ${HOST}`)
  console.log(`  3. Sitemaps → submit: https://${HOST}/sitemap.xml`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
