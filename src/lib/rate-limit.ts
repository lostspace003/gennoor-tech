/**
 * Lightweight in-process sliding-window rate limiter.
 *
 * Effective on the single-instance Azure App Service deployment; if the app
 * is ever scaled out, instances each keep their own window so limits are
 * per-instance — acceptable for the current single-instance setup.
 */

type Window = { count: number; resetAt: number }

const windows = new Map<string, Window>()

// Periodically drop expired windows so the map doesn't grow unbounded.
const SWEEP_INTERVAL_MS = 10 * 60 * 1000
let lastSweep = Date.now()

function sweep(now: number) {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return
  lastSweep = now
  for (const [key, w] of windows) {
    if (w.resetAt <= now) windows.delete(key)
  }
}

/**
 * Returns true if the call identified by `key` is allowed, false if the
 * limit (`max` calls per `windowMs`) has been exceeded.
 */
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  sweep(now)
  const w = windows.get(key)
  if (!w || w.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  w.count += 1
  return w.count <= max
}

/** "203.0.113.5:51234" -> "203.0.113.5", "[2001:db8::1]:443" -> "2001:db8::1". An address with no port is left as it is. */
function withoutPort(address: string): string {
  const a = address.trim()
  const v6 = a.match(/^\[([^\]]+)\](?::\d+)?$/)
  if (v6) return v6[1]
  return /^\d{1,3}(\.\d{1,3}){3}:\d+$/.test(a) ? a.slice(0, a.lastIndexOf(':')) : a
}

/**
 * The caller's address, for limits and for the sign-in log.
 *
 * The site runs directly behind the Azure App Service front end, which ADDS the real caller to the END of
 * X-Forwarded-For ("whatever the caller sent, <real address>:<port>"). So the LAST entry is the one the platform
 * wrote; everything before it is whatever the caller chose to send. Until 19 November 2026 this read the FIRST
 * entry, so a caller could send a new made-up address with every request and no per-address limit ever applied
 * to them (docs/SECURITY.md, "Limits"). Never read the header by hand in a route: call this.
 * If a CDN or another proxy is ever put in front of the site, this must change with it.
 */
export function clientIp(headers: { get(name: string): string | null }): string {
  const entries = (headers.get('x-forwarded-for') || '').split(',').map(s => s.trim()).filter(Boolean)
  const last = entries[entries.length - 1]
  if (last) return withoutPort(last)
  return withoutPort(headers.get('x-client-ip') || headers.get('x-real-ip') || '') || 'unknown'
}
