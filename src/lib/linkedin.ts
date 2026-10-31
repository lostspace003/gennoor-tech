import { BlobServiceClient } from '@azure/storage-blob'

// LinkedIn connection state lives as one small JSON blob next to the CRM data,
// same pattern as the rest of the site. Tokens last ~60 days and LinkedIn does
// not hand out refresh tokens to this app, so the admin re-authorizes then.
const CONTAINER = 'crm-data'
const BLOB = 'linkedin.json'
const API_VERSION = '202609'

export const MEMBER_SCOPES = 'openid profile w_member_social'
export const PAGE_APP_SCOPES = 'openid profile w_member_social rw_events r_events w_organization_social rw_organization_admin'
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
  /** Token from the company-page app (Community Management API); separate from the member token. */
  orgAccessToken?: string
  orgExpiresAt?: string
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

/** Company-page posting runs on its own LinkedIn app (Community Management API must be the only product on its app). */
export function pageAppConfigured() {
  return !!(process.env.LINKEDIN_PAGE_CLIENT_ID && process.env.LINKEDIN_PAGE_CLIENT_SECRET)
}

const creds = (page: boolean) => page && pageAppConfigured()
  ? { id: process.env.LINKEDIN_PAGE_CLIENT_ID!, secret: process.env.LINKEDIN_PAGE_CLIENT_SECRET! }
  : { id: process.env.LINKEDIN_CLIENT_ID || '', secret: process.env.LINKEDIN_CLIENT_SECRET || '' }

/** Public origin for the OAuth round trip: the host the admin is signed in on (both are registered on the LinkedIn app), else the configured site URL. */
export function oauthOrigin(req: { headers: { get(name: string): string | null } }, fallback: string): string {
  const host = (req.headers.get('x-forwarded-host') || req.headers.get('host') || '').split(',')[0].trim().toLowerCase()
  return host === 'www.gennoor.com' || host === 'gennoor.com' ? `https://${host}` : fallback
}

export const redirectUri = (origin: string) => `${origin}/api/linkedin/callback`

export function authorizeUrl(origin: string, state: string, withOrg: boolean) {
  const q = new URLSearchParams({
    response_type: 'code',
    client_id: creds(withOrg).id,
    redirect_uri: redirectUri(origin),
    state,
    // The page app only asks for scopes it has been granted; asking for an unapproved scope fails the whole login.
    scope: withOrg ? (pageAppConfigured() ? (process.env.LINKEDIN_PAGE_SCOPES || PAGE_APP_SCOPES) : `${MEMBER_SCOPES} ${ORG_SCOPES}`) : MEMBER_SCOPES,
  })
  return `https://www.linkedin.com/oauth/v2/authorization?${q}`
}

export async function exchangeCode(code: string, origin: string, page = false): Promise<{ access_token: string; expires_in: number; scope?: string }> {
  const res = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri(origin),
      client_id: creds(page).id,
      client_secret: creds(page).secret,
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

/** Edits the text of a live post. LinkedIn only allows the commentary to change; media and polls are fixed. */
export async function updatePostText(token: string, postUrn: string, commentary: string): Promise<void> {
  const res = await fetch(`https://api.linkedin.com/rest/posts/${encodeURIComponent(postUrn)}`, {
    method: 'POST',
    headers: { ...restHeaders(token), 'X-RestLi-Method': 'PARTIAL_UPDATE' },
    body: JSON.stringify({ patch: { $set: { commentary } } }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || `LinkedIn rejected the edit (${res.status})`)
  }
}

export type PollDuration = 'ONE_DAY' | 'THREE_DAYS' | 'SEVEN_DAYS' | 'FOURTEEN_DAYS'
export interface PollInput { question: string; options: string[]; duration: PollDuration }

type PostContent = { media: { id: string; altText?: string; title?: string } } | { poll: { question: string; options: { text: string }[]; settings: { duration: PollDuration } } } | { article: { source: string; title: string; description: string } } | { media: { id: string; altText?: string } }

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

/** Uploads an MP4 through LinkedIn's Videos API (multipart), waits until it is processed, then posts it. */
export async function publishVideoPost(opts: { token: string; author: string; commentary: string; video: Buffer; title?: string }): Promise<string> {
  const init = await fetch('https://api.linkedin.com/rest/videos?action=initializeUpload', {
    method: 'POST', headers: restHeaders(opts.token),
    body: JSON.stringify({ initializeUploadRequest: { owner: opts.author, fileSizeBytes: opts.video.length, uploadCaptions: false, uploadThumbnail: false } }),
  })
  const initJson = await init.json().catch(() => ({}))
  const v = initJson.value
  if (!init.ok || !v?.video || !v.uploadInstructions?.length) throw new Error(initJson.message || `LinkedIn video upload init failed (${init.status})`)
  const etags: string[] = []
  for (const part of v.uploadInstructions as { uploadUrl: string; firstByte: number; lastByte: number }[]) {
    const put = await fetch(part.uploadUrl, { method: 'PUT', headers: { 'Content-Type': 'application/octet-stream' }, body: new Uint8Array(opts.video.subarray(part.firstByte, part.lastByte + 1)) })
    if (!put.ok) throw new Error(`LinkedIn video upload failed (${put.status})`)
    const etag = put.headers.get('etag')
    if (!etag) throw new Error('LinkedIn did not return an upload receipt for the video.')
    etags.push(etag.replace(/"/g, ''))
  }
  const fin = await fetch('https://api.linkedin.com/rest/videos?action=finalizeUpload', {
    method: 'POST', headers: restHeaders(opts.token),
    body: JSON.stringify({ finalizeUploadRequest: { video: v.video, uploadToken: v.uploadToken || '', uploadedPartIds: etags } }),
  })
  if (!fin.ok) throw new Error((await fin.json().catch(() => ({}))).message || `LinkedIn video finalize failed (${fin.status})`)
  // Processing is asynchronous; a post can only reference the video once it is AVAILABLE.
  for (let i = 0; i < 24; i++) {
    const st = await fetch(`https://api.linkedin.com/rest/videos/${encodeURIComponent(v.video)}`, { headers: restHeaders(opts.token) })
    const status = (await st.json().catch(() => ({}))).status
    if (status === 'AVAILABLE') break
    if (status === 'PROCESSING_FAILED') throw new Error('LinkedIn could not process the video.')
    if (i === 23) throw new Error('LinkedIn is still processing the video. Try again in a minute.')
    await new Promise(r => setTimeout(r, 5000))
  }
  return createPost(opts.token, opts.author, opts.commentary, { media: { id: v.video, title: opts.title } })
}

/**
 * Creates an external (hosted on our own site) online LinkedIn Event for the organization, then posts it so it
 * becomes visible. Needs the rw_events scope and a token from a member who administers the page.
 * Returns the event id.
 */
export async function createExternalEvent(opts: {
  token: string; organizer: string; name: string; description?: string
  startsAt: number; endsAt: number; url: string; privacyPolicyUrl: string
}): Promise<{ eventId: string; postUrn: string }> {
  const res = await fetch('https://api.linkedin.com/rest/events', {
    method: 'POST',
    headers: { ...restHeaders(opts.token), 'X-RestLi-Method': 'create' },
    body: JSON.stringify({
      name: { localized: { en_US: opts.name } },
      ...(opts.description ? { description: { localized: { en_US: opts.description } } } : {}),
      type: { online: { format: { external: { endsAt: opts.endsAt, url: opts.url } } } },
      organizer: opts.organizer,
      leadGenFormSpec: { privacyPolicyUrl: opts.privacyPolicyUrl },
      startsAt: opts.startsAt,
    }),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.message || `LinkedIn rejected the event (${res.status})`)
  const eventId = String(body.id || res.headers.get('x-restli-id') || '')
  if (!eventId) throw new Error('LinkedIn created the event but returned no id.')

  // An event only becomes visible, fetchable and editable once it is posted.
  const post = await fetch('https://api.linkedin.com/rest/posts', {
    method: 'POST',
    headers: restHeaders(opts.token),
    body: JSON.stringify({
      author: opts.organizer,
      commentary: opts.name,
      visibility: 'PUBLIC',
      distribution: { feedDistribution: 'MAIN_FEED', targetEntities: [], thirdPartyDistributionChannels: [] },
      content: { reference: { id: `urn:li:event:${eventId}` } },
      lifecycleState: 'PUBLISHED',
      isReshareDisabledByAuthor: false,
    }),
  })
  if (!post.ok) {
    const pb = await post.json().catch(() => ({}))
    throw new Error(`Event ${eventId} was created but could not be posted: ${pb.message || post.status}`)
  }
  return { eventId, postUrn: post.headers.get('x-restli-id') || '' }
}

/** Reshares an existing post (LinkedIn's "repost with your thoughts"): the original shows inside, `commentary` is the short text on top. */
export async function resharePost(opts: { token: string; author: string; parentUrn: string; commentary: string }): Promise<string> {
  const res = await fetch('https://api.linkedin.com/rest/posts', {
    method: 'POST',
    headers: restHeaders(opts.token),
    body: JSON.stringify({
      author: opts.author,
      commentary: opts.commentary,
      visibility: 'PUBLIC',
      distribution: { feedDistribution: 'MAIN_FEED', targetEntities: [], thirdPartyDistributionChannels: [] },
      lifecycleState: 'PUBLISHED',
      isReshareDisabledByAuthor: false,
      reshareContext: { parent: opts.parentUrn },
    }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || `LinkedIn rejected the repost (${res.status})`)
  }
  return res.headers.get('x-restli-id') || ''
}

/** Adds a comment to a post as `actor` (the member or the company page). Returns the comment id when LinkedIn gives one. */
export async function commentOnPost(opts: { token: string; actor: string; postUrn: string; text: string }): Promise<string> {
  const res = await fetch(`https://api.linkedin.com/rest/socialActions/${encodeURIComponent(opts.postUrn)}/comments`, {
    method: 'POST',
    headers: restHeaders(opts.token),
    body: JSON.stringify({ actor: opts.actor, object: opts.postUrn, message: { text: opts.text } }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || `LinkedIn rejected the comment (${res.status})`)
  }
  const j = await res.json().catch(() => ({}))
  return String(j.id || j.$URN || res.headers.get('x-restli-id') || '')
}
