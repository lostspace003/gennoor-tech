import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import type { NextResponse } from 'next/server'

const COOKIE_NAME = 'learner-session'
if (!process.env.LEARNER_JWT_SECRET && !process.env.AUTH_SECRET) {
  // Follow-up (docs/FOLLOW-UPS.md): hard-fail in production instead of falling back.
  console.error('[learner-auth] SECURITY: no LEARNER_JWT_SECRET or AUTH_SECRET set — using insecure dev fallback secret')
}
const JWT_SECRET = new TextEncoder().encode(process.env.LEARNER_JWT_SECRET || process.env.AUTH_SECRET || 'gennoor-academy-fallback-secret')
const JWT_EXPIRY = '30d'

export interface LearnerPayload {
  email: string
  name: string
  provider: 'otp' | 'google' | 'microsoft' | 'password'
  /** Entra tenant id from the Microsoft sign-in, when there was one. */
  tid?: string
}

export async function createLearnerToken(payload: LearnerPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(JWT_SECRET)
}

export async function verifyLearnerSession(): Promise<LearnerPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return null
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as LearnerPayload
  } catch {
    return null
  }
}

/**
 * gennoor.com and www.gennoor.com both serve the site, and a cookie is normally kept only for the exact host
 * it was set on, so signing in on one address looked signed out on the other. On the site's own hosts the
 * sign-in cookie is set for the whole domain. On any other host (the azurewebsites address, localhost) nothing
 * changes: the cookie stays on that host.
 */
function siteDomain(request?: { headers: Headers }): string | undefined {
  const raw = request?.headers.get('x-forwarded-host') || request?.headers.get('host') || ''
  const host = raw.split(',')[0].trim().toLowerCase().replace(/:\d+$/, '')
  return host === 'gennoor.com' || host.endsWith('.gennoor.com') ? 'gennoor.com' : undefined
}

export function learnerCookieOptions(token: string, request?: { headers: Headers }) {
  const domain = siteDomain(request)
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
    ...(domain ? { domain } : {}),
  }
}

/** Sign out: remove the cookie for the exact host (older sign-ins) and for the whole domain (current ones). */
export function clearLearnerCookies(response: NextResponse) {
  response.cookies.delete(COOKIE_NAME)
  response.cookies.set({ name: COOKIE_NAME, value: '', maxAge: 0, path: '/', domain: 'gennoor.com', secure: process.env.NODE_ENV === 'production', httpOnly: true, sameSite: 'lax' })
}

export const LEARNER_COOKIE_NAME = COOKIE_NAME

/**
 * Learning Studio admins. An admin is the owner's Microsoft (Entra ID) work account, and only when the
 * session came from "Continue with Microsoft". The same address signing in by email code, Google or
 * password is refused (see isReservedAdminEmail), so nobody can become admin by typing the address.
 * STUDIO_ADMIN_EMAILS: comma separated, default admin@gennoor.com, jalalkhan@gennoor.com, yusufchaudhary@gennoor.com.
 * STUDIO_ADMIN_TENANT_ID (optional): also require the Entra tenant to match.
 */
const adminEmails = (): string[] =>
  (process.env.STUDIO_ADMIN_EMAILS || 'admin@gennoor.com,jalalkhan@gennoor.com,yusufchaudhary@gennoor.com').split(',').map(e => e.trim().toLowerCase()).filter(Boolean)

export function isReservedAdminEmail(email: string | undefined | null): boolean {
  return !!email && adminEmails().includes(email.trim().toLowerCase())
}

export function isStudioAdmin(learner: LearnerPayload | null | undefined): boolean {
  if (!learner || learner.provider !== 'microsoft' || !isReservedAdminEmail(learner.email)) return false
  const tenant = (process.env.STUDIO_ADMIN_TENANT_ID || '').trim().toLowerCase()
  return !tenant || (learner.tid || '').toLowerCase() === tenant
}
