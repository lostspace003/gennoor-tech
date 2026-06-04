import { SignJWT, importPKCS8 } from 'jose'

const SCOPE = 'https://www.googleapis.com/auth/webmasters'

let cached: { token: string; expiresAt: number } | null = null

interface ServiceAccountKey {
  client_email: string
  private_key: string
  token_uri: string
}

async function loadKey(): Promise<ServiceAccountKey> {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY)
  }
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const fs = await import('fs/promises')
    const content = await fs.readFile(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf-8')
    return JSON.parse(content)
  }
  throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY env var not set (and no GOOGLE_APPLICATION_CREDENTIALS file)')
}

export async function getGscAccessToken(): Promise<string> {
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token

  const key = await loadKey()
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
    throw new Error(`Google token exchange failed: HTTP ${res.status} ${await res.text()}`)
  }
  const data = await res.json() as { access_token: string; expires_in: number }
  cached = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  }
  return data.access_token
}

export const GSC_SITE = 'sc-domain:gennoor.com'
export const GSC_SITEMAP = 'https://gennoor.com/sitemap.xml'
