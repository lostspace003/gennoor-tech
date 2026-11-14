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

// ---- Confirming a sign-up -----------------------------------------------------------------------------------------
//
// Someone types an address into "Get new posts by email". Before that address is put on the list, its owner
// must press a button in an email sent to it: otherwise anyone could sign up anyone. The link carries the
// address inside a signed token (not as a plain part of the address bar), so nothing has to be stored to
// issue one, and a link is good only for the address it was made for. It stops working after two weeks.

const CONFIRM_DAYS = 14

/** The link in the "Confirm your email" message. `source` says which box they used (footer, blog...). */
export function confirmUrl(email: string, source = 'site', now = Date.now()): string {
  const payload = Buffer.from(JSON.stringify({ e: normalise(email), s: String(source).slice(0, 40), t: now })).toString('base64url')
  const signature = createHmac('sha256', secret()).update(`confirm:${payload}`).digest('hex').slice(0, 32)
  return `${siteUrl()}/api/newsletter-confirm?t=${payload}.${signature}`
}

/** Who a confirm link was made for, or null when it is not one of ours, was changed, or is too old. */
export function readConfirmToken(token: string, now = Date.now()): { email: string; source: string } | null {
  const [payload, signature] = String(token || '').split('.')
  if (!payload || !signature) return null
  const expected = createHmac('sha256', secret()).update(`confirm:${payload}`).digest('hex').slice(0, 32)
  try {
    if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return null
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8')) as { e?: string; s?: string; t?: number }
    if (!data.e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.e)) return null
    if (!data.t || now - data.t > CONFIRM_DAYS * 86_400_000 || data.t - now > 86_400_000) return null
    return { email: data.e, source: String(data.s || 'site') }
  } catch {
    return null
  }
}

/** Absolute unsubscribe URL to embed in a marketing email footer. */
export function unsubscribeUrl(email: string): string {
  const e = encodeURIComponent(normalise(email))
  return `${siteUrl()}/api/unsubscribe?email=${e}&token=${unsubscribeToken(email)}`
}
