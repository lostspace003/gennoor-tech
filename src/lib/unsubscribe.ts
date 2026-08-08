import { createHmac, timingSafeEqual } from 'crypto'

/**
 * Unsubscribe links for marketing email.
 *
 * The token is an HMAC of the lowercased address, so a link is valid only for
 * the address it was issued to — nobody can unsubscribe someone else by
 * editing the query string, and no server-side state is needed to issue one.
 *
 * Transactional mail (OTP codes, certificates, booking confirmations) must NOT
 * carry an unsubscribe link: recipients cannot opt out of a code they asked
 * for, and offering it there would be misleading.
 */

function secret(): string {
  return (
    process.env.UNSUBSCRIBE_SECRET ||
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    // Last-resort constant so links still work in an unconfigured dev sandbox.
    'gennoor-unsubscribe-dev-secret'
  )
}

function normalise(email: string): string {
  return String(email).trim().toLowerCase()
}

export function unsubscribeToken(email: string): string {
  return createHmac('sha256', secret()).update(normalise(email)).digest('hex').slice(0, 32)
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expected = unsubscribeToken(email)
  const given = String(token || '')
  if (given.length !== expected.length) return false
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(given))
  } catch {
    return false
  }
}

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gennoor.com').replace(/\/$/, '')
}

/** Absolute unsubscribe URL to embed in a marketing email footer. */
export function unsubscribeUrl(email: string): string {
  const e = encodeURIComponent(normalise(email))
  return `${siteUrl()}/api/unsubscribe?email=${e}&token=${unsubscribeToken(email)}`
}
