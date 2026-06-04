/*
 * Re-submit sitemap.xml to Google Search Console via the Webmasters API.
 *
 * Authenticates as a service account (gennoor-indexing@…iam.gserviceaccount.com)
 * which must be an Owner / Full user on the gennoor.com GSC property.
 *
 * The PUT to /sitemaps/{feedpath} nudges Google to re-fetch the sitemap. It does
 * NOT force indexing of individual URLs — Google still decides what to crawl
 * and when. But it shortens the discovery-to-crawl window for new content.
 *
 * Usage:
 *   GOOGLE_SERVICE_ACCOUNT_KEY="$(cat .secrets/gsc-key.json)" \
 *     node --experimental-strip-types scripts/gsc-resubmit.ts
 */

import { SignJWT, importPKCS8 } from 'jose'

const SITE = 'sc-domain:gennoor.com'
const SITEMAP = 'https://gennoor.com/sitemap.xml'
const SCOPE = 'https://www.googleapis.com/auth/webmasters'

async function getToken(): Promise<string> {
  const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  if (!keyJson) {
    console.error('GOOGLE_SERVICE_ACCOUNT_KEY env var not set')
    process.exit(1)
  }
  const key = JSON.parse(keyJson) as { client_email: string; private_key: string; token_uri: string }

  const now = Math.floor(Date.now() / 1000)
  const privateKey = await importPKCS8(key.private_key, 'RS256')
  const jwt = await new SignJWT({ scope: SCOPE })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuer(key.client_email)
    .setAudience(key.token_uri)
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(privateKey)

  const res = await fetch(key.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })
  if (!res.ok) {
    console.error(`Token exchange failed: HTTP ${res.status} ${await res.text()}`)
    process.exit(1)
  }
  return (await res.json() as { access_token: string }).access_token
}

async function main() {
  console.log(`Authenticating to Google as service account...`)
  const token = await getToken()
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
    if (res.status === 403) {
      console.error('')
      console.error('HINT: 403 usually means the service account is not added as a user on the GSC property.')
      console.error('  1. Open https://search.google.com/search-console')
      console.error('  2. Pick property: gennoor.com')
      console.error('  3. Settings → Users and permissions → Add user')
      console.error('  4. Paste: gennoor-indexing@gennoor-youtube-api-project.iam.gserviceaccount.com')
      console.error('  5. Permission: Owner (Full required for sitemap submission)')
    }
    process.exit(1)
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
