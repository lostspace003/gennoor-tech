/**
 * Learner usernames — a second, memorable handle for an account.
 *
 * Why they exist: a learner who has forgotten which email address they signed
 * up with can still identify themselves. The username never replaces the email
 * as the account key (the OTP still goes to the mailbox); it only resolves TO
 * an email, so recovery always ends up back at the address on file.
 */

const MIN = 3
const MAX = 24

/** Lower-cased, trimmed. Storage and lookups always use this form. */
export function normalizeUsername(value: unknown): string {
  return String(value ?? '').trim().toLowerCase()
}

/**
 * Returns an error message, or null when the username is acceptable.
 * Letters, digits, dot, underscore and hyphen only — the character set that
 * survives an Azure Table rowKey without escaping, and that people can
 * actually dictate over a phone call.
 */
export function usernameProblem(value: unknown): string | null {
  const u = normalizeUsername(value)
  if (!u) return 'Please choose a username.'
  if (u.length < MIN) return `Username must be at least ${MIN} characters.`
  if (u.length > MAX) return `Username must be ${MAX} characters or fewer.`
  if (!/^[a-z0-9._-]+$/.test(u)) {
    return 'Username can use letters, numbers, dots, underscores and hyphens only.'
  }
  if (!/^[a-z0-9]/.test(u)) return 'Username must start with a letter or number.'
  // An address-looking username would be indistinguishable from an email at
  // the sign-in box, where one field accepts either.
  if (u.includes('@')) return 'Username cannot contain @.'
  return null
}

/** A sensible default drawn from the email's local part, e.g. kjkhan11. */
export function suggestUsername(email: string): string {
  const local = String(email || '').split('@')[0] || ''
  const cleaned = normalizeUsername(local).replace(/[^a-z0-9._-]/g, '').replace(/^[^a-z0-9]+/, '')
  if (cleaned.length >= MIN) return cleaned.slice(0, MAX)
  return (cleaned + 'learner').slice(0, MAX)
}

/** True when the value looks like an email rather than a username. */
export function looksLikeEmail(value: unknown): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? '').trim())
}

/** j••••@gmail.com — enough for a learner to recognise their own address. */
export function maskEmail(email: string): string {
  const [local = '', domain = ''] = String(email || '').split('@')
  if (!domain) return ''
  const head = local.slice(0, 1)
  const tail = local.length > 4 ? local.slice(-1) : ''
  return `${head}${'•'.repeat(Math.max(2, Math.min(6, local.length - 2)))}${tail}@${domain}`
}
