// Browser-side identity + sender for the first-party analytics (see /api/log-pageview and /api/track-event).
// Everything here is best-effort: private mode or blocked storage must never break a page.

const VISITOR_KEY = 'gnr-vid'
const SESSION_KEY = 'gnr-sid'
const FIRST_TOUCH_KEY = 'gnr-first-touch'
const SESSION_IDLE_MS = 30 * 60 * 1000
const YEAR_S = 365 * 24 * 60 * 60

const UTM_FIELDS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'] as const
export type Touch = Partial<Record<(typeof UTM_FIELDS)[number], string>> & { referrer?: string; landing?: string }

function uuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

function readCookie(name: string): string {
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return m ? decodeURIComponent(m[1]) : ''
}

function writeCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`
}

/** Persistent visitor id (localStorage, mirrored to a 1-year first-party cookie). `isNew` is true only on the call that mints it. */
export function getVisitor(): { id: string; isNew: boolean } {
  let id = ''
  try { id = localStorage.getItem(VISITOR_KEY) || '' } catch { /* blocked */ }
  if (!id) { try { id = readCookie(VISITOR_KEY) } catch { /* blocked */ } }
  const isNew = !id
  if (!id) id = uuid()
  try { localStorage.setItem(VISITOR_KEY, id) } catch { /* blocked */ }
  try { writeCookie(VISITOR_KEY, id, YEAR_S) } catch { /* blocked */ }
  return { id, isNew }
}

/** Session id with a 30-minute rolling inactivity window; each call counts as activity. */
export function getSession(): { id: string; isNew: boolean } {
  const now = Date.now()
  let id = '', isNew = true
  try {
    const raw = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null') as { id: string; at: number } | null
    if (raw && now - raw.at < SESSION_IDLE_MS) { id = raw.id; isNew = false }
  } catch { /* blocked */ }
  if (!id) id = uuid()
  try { localStorage.setItem(SESSION_KEY, JSON.stringify({ id, at: now })) } catch { /* blocked */ }
  return { id, isNew }
}

function currentTouch(): Touch | null {
  const q = new URLSearchParams(location.search)
  const t: Touch = {}
  let any = false
  for (const f of UTM_FIELDS) {
    const v = q.get(f)
    if (v) { t[f] = v.slice(0, 200); any = true }
  }
  return any ? t : null
}

/** First touch is written once per visitor; last touch is whatever tagged landing happened most recently (or the stored one). */
export function getAttribution(): { first: Touch; last: Touch } {
  let first: Touch = {}
  try { first = JSON.parse(localStorage.getItem(FIRST_TOUCH_KEY) || '{}') } catch { /* blocked */ }
  const fresh = currentTouch()
  let ref = ''
  try { ref = document.referrer ? new URL(document.referrer).hostname : '' } catch { /* ignore */ }
  if (ref === location.hostname) ref = ''
  if (!first.landing) {
    first = { ...(fresh || {}), referrer: ref, landing: location.pathname }
    try { localStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(first)) } catch { /* blocked */ }
  }
  return { first, last: fresh ? { ...fresh, referrer: ref, landing: location.pathname } : first }
}

/** Dev / admin / preview traffic is never sent. The server re-checks the admin session as well. */
export function isInternalClient(): boolean {
  const h = location.hostname
  if (h === 'localhost' || h === '127.0.0.1' || h === '[::1]') return true
  const p = location.pathname
  return p.startsWith('/admin') || p.startsWith('/studio')
}

/** Fire-and-forget; sendBeacon survives page unload (used by abandonment + scroll). */
export function send(endpoint: string, payload: Record<string, unknown>) {
  try {
    const body = JSON.stringify(payload)
    if (navigator.sendBeacon && navigator.sendBeacon(endpoint, new Blob([body], { type: 'application/json' }))) return
    fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {})
  } catch { /* analytics must never throw */ }
}
