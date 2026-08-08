/**
 * Learner password hashing — Node's built-in scrypt (no new dependency).
 * Stored format: `s2:<salt-hex>:<hash-hex>`; verify is timing-safe.
 * Passwords are OPTIONAL on top of the passwordless OTP flow — OTP always
 * remains a working sign-in path, so a forgotten password never locks a
 * learner out.
 */

import { randomBytes, scrypt as scryptCb, timingSafeEqual } from 'crypto'
import { promisify } from 'util'

const scrypt = promisify(scryptCb) as (password: string, salt: Buffer, keylen: number) => Promise<Buffer>

const KEY_LENGTH = 64

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16)
  const derived = await scrypt(password, salt, KEY_LENGTH)
  return `s2:${salt.toString('hex')}:${derived.toString('hex')}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  try {
    const [scheme, saltHex, hashHex] = stored.split(':')
    if (scheme !== 's2' || !saltHex || !hashHex) return false
    const salt = Buffer.from(saltHex, 'hex')
    const expected = Buffer.from(hashHex, 'hex')
    const derived = await scrypt(password, salt, expected.length)
    return derived.length === expected.length && timingSafeEqual(derived, expected)
  } catch {
    return false
  }
}

/** Returns an error message, or null when the password is acceptable. */
export function passwordProblem(password: unknown): string | null {
  if (typeof password !== 'string' || password.length < 8) {
    return 'Password must be at least 8 characters.'
  }
  if (password.length > 128) return 'Password is too long.'
  return null
}
