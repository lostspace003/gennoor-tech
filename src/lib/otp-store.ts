/**
 * In-memory OTP store with automatic expiry.
 * Fine for single-instance deployments (Azure App Service B1).
 */

import { randomInt } from 'crypto'

interface OTPEntry {
  code: string
  expiresAt: number
  verified: boolean
  attempts: number
}

const store = new Map<string, OTPEntry>()

const OTP_EXPIRY_MS = 5 * 60 * 1000 // 5 minutes
const VERIFIED_EXPIRY_MS = 30 * 60 * 1000 // 30 minutes post-verification
const OTP_LENGTH = 6
// A code dies after this many wrong guesses — prevents brute-forcing the
// 6-digit space within the 5-minute window.
const MAX_ATTEMPTS = 5

/** Generate a cryptographically random numeric OTP */
export function generateOTP(): string {
  let otp = ''
  for (let i = 0; i < OTP_LENGTH; i++) {
    otp += String(randomInt(0, 10))
  }
  return otp
}

/** Store an OTP for an email address */
export function storeOTP(email: string, code: string): void {
  const key = email.toLowerCase().trim()
  store.set(key, {
    code,
    expiresAt: Date.now() + OTP_EXPIRY_MS,
    verified: false,
    attempts: 0,
  })

  // Auto-cleanup after expiry
  setTimeout(() => {
    const entry = store.get(key)
    if (entry && entry.code === code) {
      store.delete(key)
    }
  }, OTP_EXPIRY_MS + 1000)
}

/** Verify an OTP for an email address. Returns true if valid. */
export function verifyOTP(email: string, code: string): boolean {
  const key = email.toLowerCase().trim()
  const entry = store.get(key)

  if (!entry) return false
  if (Date.now() > entry.expiresAt) {
    store.delete(key)
    return false
  }
  if (entry.code !== code) {
    entry.attempts += 1
    if (entry.attempts >= MAX_ATTEMPTS) store.delete(key)
    return false
  }

  // Mark as verified and extend expiry so user has time to complete assessment
  entry.verified = true
  entry.expiresAt = Date.now() + VERIFIED_EXPIRY_MS
  store.set(key, entry)
  return true
}

/** Check if an email has been verified (OTP was correct) */
export function isEmailVerified(email: string): boolean {
  const key = email.toLowerCase().trim()
  const entry = store.get(key)
  if (!entry) return false
  if (Date.now() > entry.expiresAt) {
    store.delete(key)
    return false
  }
  return entry.verified
}

/** Clear verification for an email (after form submission) */
export function clearVerification(email: string): void {
  const key = email.toLowerCase().trim()
  store.delete(key)
}
