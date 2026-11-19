import { randomUUID } from 'node:crypto'
import { SignJWT, jwtVerify } from 'jose'
import { BlobServiceClient, ContainerSASPermissions, StorageSharedKeyCredential, generateBlobSASQueryParameters } from '@azure/storage-blob'
import { getStorage } from '@/lib/lms'
import { learnerSecretText } from '@/lib/learner-auth'

/**
 * Protected video: each lecture is stored as encrypted HLS (AES-128 segments)
 * in "<slug>-hls", and its key lives in the private "lms-keys" container. The
 * browser only ever sees:
 *   - a playlist from us (short-lived signed link),
 *   - segment links to Azure Storage (useless without the key),
 *   - the key, handed out by us to an enrolled, signed-in learner's session.
 * There is no plain MP4 link for a protected course.
 */

export const KEYS_CONTAINER = 'lms-keys'
export const hlsContainer = (slug: string) => `${slug}-hls`
export const keyBlob = (slug: string, item: string) => `${slug}/${item}.key`

// The same secret as the learner sign-in, and like it with no built-in value on the live site (learner-auth.ts)
const secret = () => new TextEncoder().encode(`${learnerSecretText()}:hls`)

export type HlsUse = 'playlist' | 'key'
export interface HlsClaims { slug: string; item: string; email: string }
export interface VerifiedHlsClaims extends HlsClaims { jti: string; max: number; exp: number }

/**
 * `maxUses` is how many times this exact link may be fetched. The player uses
 * each link once, so a download helper that notices the link and asks for it
 * again is refused (a fresh link needs a signed-in session).
 */
export async function signHlsToken(c: HlsClaims, use: HlsUse, ttlSeconds: number, maxUses = 1): Promise<string> {
  return new SignJWT({ ...c, use, max: maxUses })
    .setJti(randomUUID())
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${ttlSeconds}s`)
    .sign(secret())
}

export async function verifyHlsToken(token: string | null, use: HlsUse): Promise<VerifiedHlsClaims | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret())
    if (payload.use !== use || typeof payload.slug !== 'string' || typeof payload.item !== 'string') return null
    // ids come from our own manifests: keep them to a safe shape
    if (!/^[a-z0-9-]{1,40}$/.test(payload.slug) || !/^[a-z0-9_-]{1,40}$/i.test(payload.item)) return null
    if (typeof payload.jti !== 'string' || typeof payload.exp !== 'number') return null
    return { slug: payload.slug, item: payload.item, email: String(payload.email || ''), jti: payload.jti, max: Number(payload.max) || 1, exp: payload.exp }
  } catch {
    return null
  }
}

// How often each link has been used. One App Service instance serves the site, so memory is enough;
// entries disappear when the link itself would have expired.
const uses = new Map<string, { n: number; exp: number }>()

/** True while the link still has uses left (and counts this one). */
export function consumeToken(c: { jti: string; max: number; exp: number }): boolean {
  const now = Math.floor(Date.now() / 1000)
  if (uses.size > 5000) for (const [k, v] of uses) if (v.exp < now) uses.delete(k)
  const u = uses.get(c.jti) ?? { n: 0, exp: c.exp }
  u.n += 1
  uses.set(c.jti, u)
  return u.n <= c.max
}

function service() {
  return BlobServiceClient.fromConnectionString(getStorage().conn)
}

export async function readBlobBuffer(container: string, name: string): Promise<Buffer | null> {
  try {
    return await service().getContainerClient(container).getBlobClient(name).downloadToBuffer()
  } catch (err: any) {
    if (err?.statusCode === 404) return null
    throw err
  }
}

/** Read-only token for the encrypted segments of one course (a few hours; the segments mean nothing without the key). */
export function segmentSas(slug: string, hours = 4): { baseUrl: string; sas: string } {
  const { account, key, suffix } = getStorage()
  const container = hlsContainer(slug)
  const now = Date.now()
  const sas = generateBlobSASQueryParameters(
    {
      containerName: container,
      permissions: ContainerSASPermissions.parse('r'),
      startsOn: new Date(now - 5 * 60_000),
      expiresOn: new Date(now + hours * 3_600_000),
      cacheControl: 'private, max-age=3600',
    },
    new StorageSharedKeyCredential(account, key),
  ).toString()
  return { baseUrl: `https://${account}.blob.${suffix}/${container}`, sas }
}

/** Point the playlist at our key endpoint and at the segments in storage. */
export function rewritePlaylist(m3u8: string, item: string, o: { baseUrl: string; sas: string; keyUrl: string }): string {
  return m3u8
    .split(/\r?\n/)
    .map(line => {
      if (line.startsWith('#EXT-X-KEY')) return line.replace(/URI="[^"]*"/, `URI="${o.keyUrl}"`)
      if (!line || line.startsWith('#')) return line
      return `${o.baseUrl}/${encodeURIComponent(item)}/${line.split('/').map(encodeURIComponent).join('/')}?${o.sas}`
    })
    .join('\n')
}
