/*
 * Re-submit sitemap.xml to Google Search Console via Webmasters API.
 *
 * Auth: OAuth refresh token (GSC_OAUTH_CLIENT_ID/SECRET/REFRESH_TOKEN).
 * No deps required — uses only built-in fetch.
 *
 * (Service account JWT auth is supported in the runtime lib at src/lib/gsc-auth.ts
 * for API routes that need the fallback, but kept out of this CLI script so the
 * GitHub Actions workflow doesn't need to install deps before running.)
 */

const SITE = 'sc-domain:gennoor.com'
const SITEMAP = 'https://gennoor.com/sitemap.xml'

async function getAccessToken(): Promise<string> {
  const { GSC_OAUTH_CLIENT_ID, GSC_OAUTH_CLIENT_SECRET, GSC_OAUTH_REFRESH_TOKEN } = process.env
  if (!GSC_OAUTH_CLIENT_ID || !GSC_OAUTH_CLIENT_SECRET || !GSC_OAUTH_REFRESH_TOKEN) {
    console.error('Missing OAuth env vars. Set GSC_OAUTH_CLIENT_ID, GSC_OAUTH_CLIENT_SECRET, GSC_OAUTH_REFRESH_TOKEN.')
    process.exit(1)
  }
  console.log('Refreshing OAuth access token...')
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: GSC_OAUTH_CLIENT_ID,
      client_secret: GSC_OAUTH_CLIENT_SECRET,
      refresh_token: GSC_OAUTH_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  })
  if (!res.ok) {
    console.error(`OAuth token refresh failed: HTTP ${res.status} ${await res.text()}`)
    process.exit(1)
  }
  return (await res.json() as { access_token: string }).access_token
}

async function main() {
  const token = await getAccessToken()
  console.log(`✓ Got access token`)

  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/sitemaps/${encodeURIComponent(SITEMAP)}`
  console.log(`Resubmitting ${SITEMAP} for property ${SITE} ...`)
  const res = await fetch(url, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  })

  if (res.ok || res.status === 204) {
    console.log(`✓ Sitemap resubmitted (HTTP ${res.status})`)
    console.log('Google will re-fetch the sitemap shortly; coverage updates typically appear in Search Console within 24-72 hours.')
  } else {
    const body = await res.text()
    console.error(`✗ HTTP ${res.status}: ${body.slice(0, 500)}`)
    process.exit(1)
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
