// Tells search engines about new or changed pages, without waiting for the 4-day schedule.
// Reuses what the site already has: IndexNow (same key file as scripts/indexnow-push.ts) and the
// SEO Re-index GitHub workflow (Google Search Console resubmit). Never throws, never blocks.
const HOST = 'gennoor.com'
const KEY = '1774b0e00b584216b04f41a75b9de8e2'

export function pingSearchEngines(paths: string[]) {
  if (process.env.NODE_ENV !== 'production' || process.env.SEO_PING === 'off') return
  const urls = paths.map(p => `https://${HOST}${p}`)
  // The page becomes visible after the catalog cache (60 s) refreshes: wait for it.
  const t = setTimeout(async () => {
    try {
      await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
      })
    } catch {}
    const token = process.env.GH_DISPATCH_TOKEN
    const repo = process.env.GH_DISPATCH_REPO || 'lostspace003/gennoor-tech'
    if (token) {
      try {
        await fetch(`https://api.github.com/repos/${repo}/actions/workflows/seo-reindex.yml/dispatches`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ ref: 'main' }),
        })
      } catch {}
    }
  }, 90_000)
  t.unref?.()
}
