import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import type { NextResponse } from 'next/server'
import { learnerSecretText } from '@/lib/learner-auth'

/**
 * Proof that THIS browser entered the right emailed code for an address.
 *
 * The code store (otp-store.ts) remembers "this address was verified" for thirty minutes, and it remembers it
 * for everyone: it cannot tell who typed the code. Until 19 November 2026 that was all /api/learner/login-otp
 * asked, so for those thirty minutes ANYONE who sent the same address got signed in as that person (and a form
 * that verifies an address without signing in, like the tech-call form, left the door open the whole time).
 * Now /api/verify-otp also hands the browser that typed the code a signed, short-lived cookie naming the
 * address, and whatever relies on a verified address asks for both: the store AND this cookie.
 * The cookie cannot be read or made by page script (httpOnly, and signed). Its key is the learner sign-in key
 * with ":otp-proof" added, so a proof can never be passed off as a sign-in pass, nor the other way round.
 */
const COOKIE = 'otp-proof'
const TTL_SECONDS = 30 * 60 // as long as otp-store.ts keeps an address verified
const clean = (email: string) => String(email || '').trim().toLowerCase()
const key = () => new TextEncoder().encode(`${learnerSecretText()}:otp-proof`)

export async function setOtpProof(response: NextResponse, email: string): Promise<void> {
  const token = await new SignJWT({ email: clean(email), use: 'otp-proof' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${TTL_SECONDS}s`)
    .sign(key())
  response.cookies.set({ name: COOKIE, value: token, httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: TTL_SECONDS, path: '/' })
}

/** True only when this browser holds the proof for exactly this address. */
export async function hasOtpProof(email: string): Promise<boolean> {
  try {
    const token = (await cookies()).get(COOKIE)?.value
    if (!token || !clean(email)) return false
    const { payload } = await jwtVerify(token, key(), { algorithms: ['HS256'] })
    return payload.use === 'otp-proof' && payload.email === clean(email)
  } catch {
    return false
  }
}

export function clearOtpProof(response: NextResponse): void {
  response.cookies.set({ name: COOKIE, value: '', maxAge: 0, path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' })
}
