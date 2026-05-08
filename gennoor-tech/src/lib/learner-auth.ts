import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'learner-session'
const JWT_SECRET = new TextEncoder().encode(process.env.LEARNER_JWT_SECRET || process.env.AUTH_SECRET || 'gennoor-academy-fallback-secret')
const JWT_EXPIRY = '30d'

export interface LearnerPayload {
  email: string
  name: string
  provider: 'otp' | 'google' | 'microsoft'
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

export function learnerCookieOptions(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  }
}

export const LEARNER_COOKIE_NAME = COOKIE_NAME
