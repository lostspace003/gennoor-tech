import { TableClient } from '@azure/data-tables'

// ── Config ──────────────────────────────────────────────────────────────────

function getConfig() {
  const clientId = process.env.LINKEDIN_CLIENT_ID
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI
  const orgId = process.env.LINKEDIN_ORG_ID

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('LinkedIn env vars not configured (LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, LINKEDIN_REDIRECT_URI)')
  }

  return { clientId, clientSecret, redirectUri, orgId }
}

// ── Table Storage ───────────────────────────────────────────────────────────

function getTableClient(tableName: string): TableClient {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!conn) throw new Error('AZURE_STORAGE_CONNECTION_STRING not set')
  return TableClient.fromConnectionString(conn, tableName)
}

async function ensureTable(tableName: string) {
  const client = getTableClient(tableName)
  try {
    await client.createTable()
  } catch (e: any) {
    if (e.statusCode !== 409) throw e // 409 = table already exists
  }
  return client
}

// ── Token Management ────────────────────────────────────────────────────────

interface TokenRecord {
  partitionKey: string
  rowKey: string
  accessToken: string
  refreshToken: string
  expiresAt: string
  refreshExpiresAt: string
  updatedAt: string
}

export async function getLinkedInTokens(): Promise<TokenRecord | null> {
  try {
    const client = await ensureTable('LinkedInTokens')
    const entity = await client.getEntity('OrgToken', 'current')
    return {
      partitionKey: entity.partitionKey as string,
      rowKey: entity.rowKey as string,
      accessToken: entity.accessToken as string,
      refreshToken: entity.refreshToken as string,
      expiresAt: entity.expiresAt as string,
      refreshExpiresAt: entity.refreshExpiresAt as string,
      updatedAt: entity.updatedAt as string,
    }
  } catch (e: any) {
    if (e.statusCode === 404) return null
    throw e
  }
}

export async function saveLinkedInTokens(tokens: {
  accessToken: string
  refreshToken: string
  expiresIn: number
  refreshTokenExpiresIn?: number
}) {
  const client = await ensureTable('LinkedInTokens')
  const now = new Date()
  const expiresAt = new Date(now.getTime() + tokens.expiresIn * 1000).toISOString()
  const refreshExpiresAt = new Date(
    now.getTime() + (tokens.refreshTokenExpiresIn || 365 * 24 * 60 * 60) * 1000
  ).toISOString()

  await client.upsertEntity({
    partitionKey: 'OrgToken',
    rowKey: 'current',
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresAt,
    refreshExpiresAt,
    updatedAt: now.toISOString(),
  })
}

export async function refreshAccessToken(): Promise<string> {
  const stored = await getLinkedInTokens()
  if (!stored) throw new Error('No LinkedIn tokens stored. Please authorize first.')

  const config = getConfig()

  const res = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: stored.refreshToken,
      client_id: config.clientId,
      client_secret: config.clientSecret,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Failed to refresh LinkedIn token: ${err}`)
  }

  const data = await res.json()
  await saveLinkedInTokens({
    accessToken: data.access_token,
    refreshToken: data.refresh_token || stored.refreshToken,
    expiresIn: data.expires_in,
    refreshTokenExpiresIn: data.refresh_token_expires_in,
  })

  return data.access_token
}

export async function getValidAccessToken(): Promise<string> {
  const stored = await getLinkedInTokens()
  if (!stored) throw new Error('No LinkedIn tokens stored. Visit /api/linkedin/authorize to set up.')

  const now = new Date()
  const expiresAt = new Date(stored.expiresAt)

  // Refresh if token expires within 5 minutes
  if (now.getTime() > expiresAt.getTime() - 5 * 60 * 1000) {
    return await refreshAccessToken()
  }

  return stored.accessToken
}

// ── Post to Company Page ────────────────────────────────────────────────────

export async function postToCompanyPage(params: {
  title: string
  excerpt: string
  url: string
  hashtags: string[]
}): Promise<{ success: boolean; postUrn?: string; error?: string }> {
  const config = getConfig()
  if (!config.orgId) {
    return { success: false, error: 'LINKEDIN_ORG_ID not configured' }
  }

  const accessToken = await getValidAccessToken()

  const commentary = `${params.title}\n\n${params.excerpt}\n\n${params.hashtags.join(' ')}`

  const body = {
    author: `urn:li:organization:${config.orgId}`,
    commentary,
    visibility: 'PUBLIC',
    distribution: {
      feedDistribution: 'MAIN_FEED',
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    content: {
      article: {
        source: params.url,
        title: params.title,
        description: params.excerpt,
      },
    },
    lifecycleState: 'PUBLISHED',
    isReshareDisabledByAuthor: false,
  }

  const res = await fetch('https://api.linkedin.com/rest/posts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'LinkedIn-Version': '202401',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(body),
  })

  if (res.status === 201 || res.status === 200) {
    const postUrn = res.headers.get('x-restli-id') || undefined
    return { success: true, postUrn }
  }

  const errText = await res.text()
  return { success: false, error: `LinkedIn API error (${res.status}): ${errText}` }
}

// ── Duplicate Prevention ────────────────────────────────────────────────────

export async function hasBeenPosted(slug: string): Promise<boolean> {
  try {
    const client = await ensureTable('LinkedInPosts')
    await client.getEntity('post', slug)
    return true
  } catch (e: any) {
    if (e.statusCode === 404) return false
    throw e
  }
}

export async function markAsPosted(slug: string, postUrn?: string) {
  const client = await ensureTable('LinkedInPosts')
  await client.upsertEntity({
    partitionKey: 'post',
    rowKey: slug,
    postUrn: postUrn || '',
    postedAt: new Date().toISOString(),
  })
}

// ── OAuth URL Builder ───────────────────────────────────────────────────────

export function getAuthorizationUrl(state: string): string {
  const config = getConfig()
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    state,
    scope: 'w_organization_social r_organization_social openid profile',
  })
  return `https://www.linkedin.com/oauth/v2/authorization?${params}`
}

export function getTokenExchangeParams(code: string) {
  const config = getConfig()
  return {
    grant_type: 'authorization_code',
    code,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: config.redirectUri,
  }
}
