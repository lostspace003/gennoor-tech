import { createHmac, timingSafeEqual } from 'crypto'
import type { EmailAction } from './engine'

// One-click buttons in autopilot emails. Each link is signed for one slot, one action and an expiry time, so it
// cannot be edited to act on another post. Opening the link only shows a confirmation page; the action runs when the
// button on that page is pressed (a POST). Mail scanners that open every link therefore never approve anything.
// No secret configured = no buttons (never fall back to a guessable key).

const TTL_MS = 36 * 3_600_000

function secret(): string | null {
  return process.env.AUTOPILOT_ACTION_SECRET || process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || null
}

const site = () => (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gennoor.com').replace(/\/$/, '')

function sign(key: string, slotId: string, action: string, exp: number) {
  return createHmac('sha256', key).update(`autopilot|${slotId}|${action}|${exp}`).digest('hex').slice(0, 40)
}

export const EMAIL_ACTIONS: EmailAction[] = ['approve', 'release', 'skip']

export function verifyAction(slotId: string, action: string, exp: string, token: string): { ok: true; action: EmailAction } | { ok: false; why: string } {
  const key = secret()
  if (!key) return { ok: false, why: 'Email actions are not configured.' }
  if (!EMAIL_ACTIONS.includes(action as EmailAction)) return { ok: false, why: 'Unknown action.' }
  const e = Number(exp)
  if (!Number.isFinite(e) || e < Date.now()) return { ok: false, why: 'This link has expired. Open the Autopilot page instead.' }
  const expected = sign(key, slotId, action, e)
  const given = String(token || '')
  if (given.length !== expected.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(given))) return { ok: false, why: 'This link is not valid.' }
  return { ok: true, action: action as EmailAction }
}

export function actionUrl(slotId: string, action: EmailAction, now = Date.now()): string | null {
  const key = secret()
  if (!key) return null
  const exp = now + TTL_MS
  const q = new URLSearchParams({ s: slotId, a: action, e: String(exp), t: sign(key, slotId, action, exp) })
  return `${site()}/api/autopilot-action?${q}`
}

const LABEL: Record<EmailAction, { text: string; bg: string }> = {
  approve: { text: 'Approve', bg: '#0f7b3f' },
  release: { text: 'Approve and post', bg: '#0f7b3f' },
  skip: { text: 'Skip', bg: '#8a1c1c' },
}
export const actionLabel = (a: EmailAction) => LABEL[a].text

/** Email-safe button row (table-free inline links work in Outlook, Gmail and mobile clients). */
export function linksHtml(slotId: string, actions: EmailAction[]): string {
  const btns = actions.map(a => {
    const url = actionUrl(slotId, a)
    return url ? `<a href="${url}" style="display:inline-block;margin:6px 8px 0 0;padding:8px 16px;border-radius:6px;background:${LABEL[a].bg};color:#ffffff;text-decoration:none;font-weight:600;font-size:13px">${LABEL[a].text}</a>` : ''
  }).join('')
  return btns ? `<div style="margin:8px 0 4px">${btns}</div>` : ''
}
