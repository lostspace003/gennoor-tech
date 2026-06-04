/*
 * Re-submit sitemap.xml to Google Search Console.
 *
 * Auth: prefers OAuth refresh token (GSC_OAUTH_CLIENT_ID/SECRET/REFRESH_TOKEN)
 * authenticating as the human owner of the GSC property. Falls back to a
 * service account JWT (GOOGLE_SERVICE_ACCOUNT_KEY) if OAuth not configured.
 *
 * OAuth path is preferred because GSC's "Add User" UI rejects service accounts
 * from personal GCP projects ("user not found").
 */

import { SignJWT, importPKCS8 } from 'jose'

const SITE = 'sc-domain:gennoor.com'
const SITEMAP = 'https://gennoor.com/sitemap.xml'
const SCOPE = 'https://www.googleapis.com/auth/webmasters'

async function getTokenViaOAuth(): Promise<string | null> {
  const { GSC_OAUTH_CLIENT_ID, GSC_OAUTH_CLIENT_SECRET, GSC_OAUTH_REFRESH_TOKEN } = process.env
  if (!GSC_OAUTH_CLIENT_ID || !GSC_OAUTH_CLIENT_SECRET || !GSC_OAUTH_REFRESH_TOKEN) return null

  console.log('Authenticating via OAuth refresh token...')
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
    console.error(`OAuth refresh failed: HTTP ${res.status} ${await res.text()}`)
    process.exit(1)
  }
  return (await res.json() as { access_token: string }).access_token
}

async function getTokenViaServiceAccount(): Promise<string | null> {
  const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  if (!keyJson) return null

  console.log('Authenticating via service account JWT...')
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
    console.error(`Service account token exchange failed: HTTP ${res.status} ${await res.text()}`)
    process.exit(1)
  }
  return (await res.json() as { access_token: string }).access_token
}

async function main() {
  const token = (await getTokenViaOAuth()) || (await getTokenViaServiceAccount())
  if (!token) {
    console.error('No GSC credentials: set GSC_OAUTH_{CLIENT_ID,CLIENT_SECRET,REFRESH_TOKEN} or GOOGLE_SERVICE_ACCOUNT_KEY')
    process.exit(1)
  }
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
