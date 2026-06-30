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

/** Best-effort client IP from proxy headers (Azure App Service). */
export function clientIp(headers: { get(name: string): string | null }): string {
  const fwd = headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return headers.get('x-real-ip') || headers.get('x-client-ip') || 'unknown'
}
