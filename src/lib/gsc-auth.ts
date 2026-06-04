import { SignJWT, importPKCS8 } from 'jose'

const SCOPE = 'https://www.googleapis.com/auth/webmasters'

let cached: { token: string; expiresAt: number } | null = null

interface ServiceAccountKey {
  client_email: string
  private_key: string
  token_uri: string
}

interface OAuthRefreshCreds {
  client_id: string
  client_secret: string
  refresh_token: string
}

function getOauthCreds(): OAuthRefreshCreds | null {
  const { GSC_OAUTH_CLIENT_ID, GSC_OAUTH_CLIENT_SECRET, GSC_OAUTH_REFRESH_TOKEN } = process.env
  if (GSC_OAUTH_CLIENT_ID && GSC_OAUTH_CLIENT_SECRET && GSC_OAUTH_REFRESH_TOKEN) {
    return {
      client_id: GSC_OAUTH_CLIENT_ID,
      client_secret: GSC_OAUTH_CLIENT_SECRET,
      refresh_token: GSC_OAUTH_REFRESH_TOKEN,
    }
  }
  return null
}

async function getServiceAccountKey(): Promise<ServiceAccountKey | null> {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY)
  }
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const fs = await import('fs/promises')
    const content = await fs.readFile(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf-8')
    return JSON.parse(content)
  }
  return null
}

export async function getGscAccessToken(): Promise<string> {
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token

  const oauth = getOauthCreds()
  if (oauth) {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: oauth.client_id,
        client_secret: oauth.client_secret,
        refresh_token: oauth.refresh_token,
        grant_type: 'refresh_token',
      }),
    })
    if (!res.ok) {
      throw new Error(`OAuth token refresh failed: HTTP ${res.status} ${await res.text()}`)
    }
    const data = await res.json() as { access_token: string; expires_in: number }
    cached = { token: data.access_token, expiresAt: Date.now() + (data.expires_in - 60) * 1000 }
    return data.access_token
  }

  const sa = await getServiceAccountKey()
  if (!sa) {
    throw new Error('No GSC credentials: set GSC_OAUTH_{CLIENT_ID,CLIENT_SECRET,REFRESH_TOKEN} or GOOGLE_SERVICE_ACCOUNT_KEY')
  }

  const now = Math.floor(Date.now() / 1000)
  const privateKey = await importPKCS8(sa.private_key, 'RS256')
  const jwt = await new SignJWT({ scope: SCOPE })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuer(sa.client_email)
    .setAudience(sa.token_uri)
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(privateKey)

  const res = await fetch(sa.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })
  if (!res.ok) {
    throw new Error(`Service account token exchange failed: HTTP ${res.status} ${await res.text()}`)
  }
  const data = await res.json() as { access_token: string; expires_in: number }
  cached = { token: data.access_token, expiresAt: Date.now() + (data.expires_in - 60) * 1000 }
  return data.access_token
}

export const GSC_SITE = 'sc-domain:gennoor.com'
export const GSC_SITEMAP = 'https://gennoor.com/sitemap.xml'
