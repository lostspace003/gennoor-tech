import { sendState } from '@/lib/crm/delivery'
import { waitingForAnswer, whyNotReady, type University, type UniStage } from '@/lib/crm/universities-types'

// Small things the list, the dashboard and the workspace of a university all draw the same way.

export const STAGE_DOT: Record<UniStage, string> = {
  new: 'bg-gray-400', emailed: 'bg-primary-500', replied: 'bg-red-500', evaluating: 'bg-amber-500', call: 'bg-violet-500', partner: 'bg-green-600', closed: 'bg-gray-300',
}
export const STAGE_PILL: Record<UniStage, string> = {
  new: 'bg-gray-100 text-gray-700', emailed: 'bg-primary-50 text-primary-700', replied: 'bg-red-50 text-red-700', evaluating: 'bg-amber-50 text-amber-700',
  call: 'bg-violet-50 text-violet-700', partner: 'bg-green-50 text-green-700', closed: 'bg-gray-100 text-gray-500',
}
export const VERIFY_PILL: Record<string, string> = { 'Verified Direct': 'bg-green-50 text-green-700', 'Office / Dept Email': 'bg-amber-50 text-amber-700', 'Needs Verification': 'bg-red-50 text-red-700' }

/** A link from the data is shown as a link only when it really is a web address. */
export function webHref(v: string): string {
  try { const u = new URL(v); return u.protocol === 'https:' || u.protocol === 'http:' ? u.href : '' } catch { return '' }
}
export const splitList = (v: string) => v.split(/[,;\s]+/).map((s) => s.trim()).filter(Boolean)

/** The one word for where a university's first email stands. */
export function emailWord(u: University): { word: string; tone: string } {
  const lastSent = u.emails.find((e) => e.status === 'sent')
  if (waitingForAnswer(u)) return { word: 'Replied', tone: 'bg-red-50 text-red-700' }
  if (lastSent) {
    const s = sendState(lastSent)
    return s === 'onItsWay' ? { word: 'On its way', tone: 'bg-amber-50 text-amber-700' } : s === 'unconfirmed' ? { word: 'Not confirmed', tone: 'bg-amber-50 text-amber-700' } : { word: 'Sent', tone: 'bg-green-50 text-green-700' }
  }
  if (u.emails[0]?.status === 'failed') return { word: 'Did not go', tone: 'bg-red-50 text-red-700' }
  return whyNotReady(u) ? { word: 'To finish', tone: 'bg-gray-100 text-gray-600' } : { word: 'Ready', tone: 'bg-primary-50 text-primary-700' }
}

