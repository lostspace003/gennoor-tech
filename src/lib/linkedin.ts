import { BlobServiceClient } from '@azure/storage-blob'

// LinkedIn connection state lives as one small JSON blob next to the CRM data,
// same pattern as the rest of the site. Tokens last ~60 days and LinkedIn does
// not hand out refresh tokens to this app, so the admin re-authorizes then.
const CONTAINER = 'crm-data'
const BLOB = 'linkedin.json'
const API_VERSION = '202510'

export const MEMBER_SCOPES = 'openid profile w_member_social'
export const ORG_SCOPES = 'w_organization_social rw_organization_admin'

export interface LinkedInShare { urn: string; as: 'member' | 'organization'; at: string; by: string }

export interface LinkedInState {
  accessToken?: string
  expiresAt?: string
  scope?: string
  memberUrn?: string
  memberName?: string
  orgUrn?: string
  orgName?: string
  connectedAt?: string
  /** blog slug -> where it was shared */
  shares?: Record<string, LinkedInShare[]>
}

function blobClient() {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!conn) throw new Error('AZURE_STORAGE_CONNECTION_STRING not configured')
  return BlobServiceClient.fromConnectionString(conn).getContainerClient(CONTAINER).getBlockBlobClient(BLOB)
}

export async function getLinkedInState(): Promise<LinkedInState> {
  try {
    const download = await blobClient().download()
    const chunks: Buffer[] = []
    for await (const chunk of download.readableStreamBody as AsyncIterable<Buffer>) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf-8')) as LinkedInState
  } catch (error: any) {
    if (error?.statusCode === 404) return {}
    throw error
  }
}

export async function saveLinkedInState(state: LinkedInState) {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!conn) throw new Error('AZURE_STORAGE_CONNECTION_STRING not configured')
  await BlobServiceClient.fromConnectionString(conn).getContainerClient(CONTAINER).createIfNotExists()
  const body = JSON.stringify(state)
  await blobClient().upload(body, Buffer.byteLength(body), { blobHTTPHeaders: { blobContentType: 'application/json' } })
}

export function linkedInConfigured() {
  return !!(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET)
}

export const redirectUri = (origin: string) => `${origin}/api/linkedin/callback`

export function authorizeUrl(origin: string, state: string, withOrg: boolean) {
  const q = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.LINKEDIN_CLIENT_ID || '',
    redirect_uri: redirectUri(origin),
    state,
    scope: withOrg ? `${MEMBER_SCOPES} ${ORG_SCOPES}` : MEMBER_SCOPES,
  })
  return `https://www.linkedin.com/oauth/v2/authorization?${q}`
}

export async function exchangeCode(code: string, origin: string): Promise<{ access_token: string; expires_in: number; scope?: string }> {
  const res = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri(origin),
      client_id: process.env.LINKEDIN_CLIENT_ID || '',
      client_secret: process.env.LINKEDIN_CLIENT_SECRET || '',
    }),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || !json.access_token) throw new Error(json.error_description || `Token exchange failed (${res.status})`)
  return json
}

const restHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  'Linkedin-Version': API_VERSION,
  'X-Restli-Protocol-Version': '2.0.0',
  'Content-Type': 'application/json',
})

export async function fetchMember(token: string): Promise<{ urn: string; name: string }> {
  const res = await fetch('https://api.linkedin.com/v2/userinfo', { headers: { Authorization: `Bearer ${token}` } })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || !json.sub) throw new Error(`Could not read LinkedIn profile (${res.status})`)
  return { urn: `urn:li:person:${json.sub}`, name: json.name || '' }
}

/** First company page the member administers, or null when the org scopes were not granted. */
export async function fetchAdminOrg(token: string): Promise<{ urn: string; name: string } | null> {
  const fromEnv = process.env.LINKEDIN_ORG_ID
  try {
    let id = fromEnv
    if (!id) {
      const acl = await fetch('https://api.linkedin.com/rest/organizationAcls?q=roleAssignee&role=ADMINISTRATOR&state=APPROVED', { headers: restHeaders(token) })
      if (!acl.ok) return null
      const first = (await acl.json()).elements?.[0]?.organization as string | undefined
      id = first?.split(':').pop()
    }
    if (!id) return null
    let name = 'Company page'
    const org = await fetch(`https://api.linkedin.com/rest/organizations/${id}`, { headers: restHeaders(token) })
    if (org.ok) name = (await org.json()).localizedName || name
    return { urn: `urn:li:organization:${id}`, name }
  } catch {
    return null
  }
}

export type PollDuration = 'ONE_DAY' | 'THREE_DAYS' | 'SEVEN_DAYS' | 'FOURTEEN_DAYS'
export interface PollInput { question: string; options: string[]; duration: PollDuration }

type PostContent = { poll: { question: string; options: { text: string }[]; settings: { duration: PollDuration } } } | { article: { source: string; title: string; description: string } } | { media: { id: string; altText?: string } }

async function createPost(token: string, author: string, commentary: string, content?: PostContent): Promise<string> {
  const res = await fetch('https://api.linkedin.com/rest/posts', {
    method: 'POST',
    headers: restHeaders(token),
    body: JSON.stringify({
      author,
      commentary,
      visibility: 'PUBLIC',
      distribution: { feedDistribution: 'MAIN_FEED', targetEntities: [], thirdPartyDistributionChannels: [] },
      ...(content ? { content } : {}),
      lifecycleState: 'PUBLISHED',
      isReshareDisabledByAuthor: false,
    }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || `LinkedIn rejected the post (${res.status})`)
  }
  return res.headers.get('x-restli-id') || ''
}

export function publishArticle(opts: {
  token: string; author: string; commentary: string; url: string; title: string; description: string
}): Promise<string> {
  return createPost(opts.token, opts.author, opts.commentary, { article: { source: opts.url, title: opts.title, description: opts.description } })
}

/** Uploads the image to LinkedIn, then posts it. Text-only when no image is given. */
export async function publishPost(opts: {
  token: string; author: string; commentary: string; image?: Buffer; altText?: string; poll?: PollInput
}): Promise<string> {
  if (opts.poll) {
    return createPost(opts.token, opts.author, opts.commentary, {
      poll: { question: opts.poll.question, options: opts.poll.options.map(text => ({ text })), settings: { duration: opts.poll.duration } },
    })
  }
  if (!opts.image) return createPost(opts.token, opts.author, opts.commentary)
  const init = await fetch('https://api.linkedin.com/rest/images?action=initializeUpload', {
    method: 'POST',
    headers: restHeaders(opts.token),
    body: JSON.stringify({ initializeUploadRequest: { owner: opts.author } }),
  })
  const initJson = await init.json().catch(() => ({}))
  if (!init.ok || !initJson.value?.uploadUrl) throw new Error(initJson.message || `LinkedIn image upload init failed (${init.status})`)
  const put = await fetch(initJson.value.uploadUrl, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${opts.token}`, 'Content-Type': 'application/octet-stream' },
    body: new Uint8Array(opts.image),
  })
  if (!put.ok) throw new Error(`LinkedIn image upload failed (${put.status})`)
  return createPost(opts.token, opts.author, opts.commentary, { media: { id: initJson.value.image, altText: opts.altText } })
}
