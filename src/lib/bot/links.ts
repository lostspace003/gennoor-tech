// Which links GennoorCare may show, and which opening questions may share one saved answer.
//
// This file has no server-only parts on purpose: the SAME test runs on the server before an answer leaves
// (src/app/api/gennoorcare/route.ts) and in the widget before a link is drawn (src/components/GennoorCare).
// Two tests that differ are how a link gets through: until 20 November 2026 the server let through anything that
// merely CONTAINED ".gennoor.com", began with "/" (so "//another-site.example/pay" passed) or pointed at any
// WhatsApp number, and the widget then drew "https://gennoor.com.another-site.example/login" as one of our own
// pages (docs/SECURITY.md, "The chatbot").

/** The one WhatsApp number and phone the site gives out. */
const OUR_NUMBERS = new Set(['919326352241', '9326352241'])

/** gennoor.com itself, or a name under it. Tested against the host a URL parser read, never against raw text. */
const isOurHost = (host: string) => /(^|\.)gennoor\.com$/.test(host)

export interface BotLink {
  /** The address to put in the link, tidied (always https for our own site). */
  href: string
  /** A page of this website: it opens in the same tab. */
  internal: boolean
}

/**
 * The link to draw for an address the model wrote, or null when it is not one of ours: then the words are shown
 * and nothing is clickable.
 *
 * Ours means: a path on this site ("/training"), a page on gennoor.com, an @gennoor.com mail address, and the
 * one WhatsApp number or phone the site gives out. Nothing else, whatever it looks like.
 */
export function botLink(raw: unknown): BotLink | null {
  const text = String(raw ?? '').trim()
  // No spaces, control characters or backslashes: browsers read "\" as "/" and "/\host" as another site
  if (!text || text.length > 600 || /[\u0000- \u007f\\]/.test(text)) return null

  // A path on this site. "//host/…" is NOT a path: it is another site with the scheme left off.
  if (text.startsWith('/')) return text.startsWith('//') ? null : { href: text, internal: true }

  if (/^mailto:/i.test(text)) {
    const address = text.slice(7).split('?')[0].toLowerCase()
    return /^[a-z0-9._-]+@gennoor\.com$/.test(address) ? { href: `mailto:${address}`, internal: false } : null
  }
  if (/^tel:/i.test(text)) {
    const digits = text.replace(/\D/g, '')
    return OUR_NUMBERS.has(digits) ? { href: `tel:+${digits.length === 10 ? '91' + digits : digits}`, internal: false } : null
  }

  let url: URL
  try {
    // "gennoor.com/training" is written without a scheme often enough; anything else with a scheme keeps it
    url = new URL(/^[a-z][a-z0-9+.-]*:/i.test(text) ? text : `https://${text}`)
  } catch {
    return null
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null   // never javascript:, data:, …
  if (url.username || url.password) return null                            // "https://gennoor.com@another.site"
  const host = url.hostname.toLowerCase().replace(/\.$/, '')

  if (isOurHost(host)) {
    url.protocol = 'https:'
    return { href: url.toString(), internal: host === 'gennoor.com' || host === 'www.gennoor.com' }
  }
  if (host === 'wa.me') {
    const digits = url.pathname.replace(/\D/g, '')
    return OUR_NUMBERS.has(digits) && url.protocol === 'https:' ? { href: url.toString(), internal: false } : null
  }
  return null
}

/**
 * May the answer to this opening question be saved and given to the next visitor who asks the same?
 *
 * Only when the saved answer can depend on nothing but the words of the key. The key (questionKey in store.ts)
 * keeps letters, digits and spaces and drops everything else, so a question may be shared only if it HAS nothing
 * else worth dropping: plain words, an apostrophe or hyphen inside a word, a comma after one, and up to three
 * closing marks. Hidden characters, symbols, brackets and runs of dots or dashes reach the model but not the key,
 * so they could carry an instruction that changes the answer every later visitor is given.
 */
export function isPlainQuestion(question: unknown): boolean {
  const q = String(question ?? '').normalize('NFKC').trim()
  if (q.length < 12 || q.length > 300) return false
  const word = "[\\p{L}\\p{N}]+(?:['’-][\\p{L}\\p{N}]+)*"
  if (!new RegExp(`^${word}(?:,? ${word})*[?.!]{0,3}$`, 'u').test(q)) return false
  return q.split(' ').length >= 3
}

/** The visitor's first name as the model may be told it: one word of letters, or nothing. */
export function botFirstName(name: unknown): string {
  const first = String(name ?? '').normalize('NFKC').trim().split(/\s+/)[0] || ''
  return /^[\p{L}][\p{L}'’-]{0,23}$/u.test(first) ? first : ''
}
