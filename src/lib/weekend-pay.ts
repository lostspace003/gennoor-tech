import { createHmac, timingSafeEqual } from 'crypto'
import { sendEmail } from '@/lib/email-service'
import { WEEKEND, cohortById, weekendFee } from '@/data/ai-weekend'
import { getRegistrations, mutateRegistrations, getSettings, type WeekendRegistration } from '@/lib/weekend'
import { createOrder, razorpayConfigured, razorpayKeyId } from '@/lib/razorpay'
import { buildPaidEmail } from '@/lib/weekend-emails'
import { money } from '@/lib/money'
import { couponAmount, couponProblem, getCoupon, normalCode, redeemCoupon, weekendUse, WEEKEND_SCOPE } from '@/lib/lms-coupons'

// Paying for an AI Weekend seat. One registration has at most one open order;
// the same order is reused if the person comes back to pay later.

const FROM = process.env.EMAIL_FROM_WEBINAR || 'webinar@gennoor.com'
const ADMIN = process.env.EMAIL_ADMIN || 'admin@gennoor.com'
const SITE = 'https://www.gennoor.com'

// ---- The "pay later" link. It carries the registration id plus a signature,
// so a link cannot be guessed or altered to open someone else's payment.
const linkSecret = () => process.env.RAZORPAY_KEY_SECRET || process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || ''
export const payToken = (id: string) => createHmac('sha256', linkSecret()).update(`weekend-pay:${id}`).digest('hex').slice(0, 32)
export function validPayToken(id: string, token: string): boolean {
  if (!linkSecret() || !id || !token) return false
  const a = Buffer.from(payToken(id)), b = Buffer.from(token)
  return a.length === b.length && timingSafeEqual(a, b)
}
export const payUrl = (id: string) => `${SITE}/ai-weekend?pay=${encodeURIComponent(id)}&t=${payToken(id)}#register`

/** What the browser needs to open Razorpay's payment window. Nothing here is secret. */
export interface Checkout {
  registrationId: string
  token: string
  keyId: string
  orderId: string
  /** In the smallest unit, as Razorpay counts: paise, or cents. */
  amount: number
  currency: 'INR' | 'USD'
  name: string
  email: string
  phone: string
  description: string
}

/** Open (or reuse) the order for a registration that has not paid yet. */
export async function startPayment(reg: WeekendRegistration): Promise<Checkout | null> {
  if (!razorpayConfigured() || reg.payment !== 'pending') return null
  let orderId = reg.orderId
  if (!orderId) {
    const order = await createOrder(reg.fee, reg.id, { registration: reg.id, cohort: reg.cohort, email: reg.email }, reg.currency || 'INR')
    orderId = order.id
    await mutateRegistrations((rows) => { const r = rows.find((x) => x.id === reg.id); if (r && !r.orderId) r.orderId = order.id })
  }
  const cohort = cohortById(reg.cohort)
  return {
    registrationId: reg.id,
    token: payToken(reg.id),
    keyId: razorpayKeyId(),
    orderId,
    amount: Math.round(reg.fee * 100),
    currency: reg.currency || 'INR',
    name: reg.name,
    email: reg.email,
    phone: reg.phone,
    description: `${WEEKEND.name}${cohort ? `, ${cohort.label}` : ''}`,
  }
}

/**
 * Record a successful payment. Safe to call twice for the same payment (the
 * browser and the webhook both report it): the second call changes nothing and
 * sends nothing.
 */
export async function markPaid(match: { orderId?: string; registrationId?: string }, paymentId: string): Promise<'paid' | 'already' | 'unknown'> {
  const now = new Date().toISOString()
  const result = await mutateRegistrations((rows): { state: 'paid' | 'already' | 'unknown'; reg?: WeekendRegistration } => {
    const r = rows.find((x) => (match.orderId && x.orderId === match.orderId) || (match.registrationId && x.id === match.registrationId))
    if (!r) return { state: 'unknown' }
    if (r.payment === 'paid') return { state: 'already' }
    r.payment = 'paid'
    r.paymentId = paymentId
    r.paidAt = now
    return { state: 'paid', reg: { ...r } }
  })
  if (result.state !== 'paid' || !result.reg) return result.state

  const reg = result.reg
  // A seat taken with a coupon code counts as one use of it, once (counting the same person again does nothing)
  if (reg.coupon) await redeemCoupon(reg.coupon, reg.email, weekendUse(reg.cohort), false).catch((e) => console.error('weekend coupon count failed', e))
  const covered = !!reg.coupon && reg.fee === 0
  const cohort = cohortById(reg.cohort)
  if (cohort) {
    const settings = (await getSettings().catch(() => ({} as Awaited<ReturnType<typeof getSettings>>)))[cohort.id]
    const mail = buildPaidEmail(reg, cohort, paymentId, settings, FROM)
    await sendEmail({ to: reg.email, from: FROM, fromName: 'Gennoor Tech', subject: mail.subject, html: mail.html }).catch((e) => console.error('weekend receipt email failed', e))
    await sendEmail({
      to: ADMIN, from: FROM, fromName: 'AI Weekend',
      subject: covered ? `AI Weekend seat confirmed with a coupon code: ${reg.name}` : `AI Weekend payment received: ${reg.name} (${money(reg.fee, reg.currency || 'INR')})`,
      html: `<p>${reg.name.replace(/[<>&]/g, '')} ${covered ? `took a seat with the code ${reg.coupon}, nothing to pay,` : `paid ${money(reg.fee, reg.currency || 'INR')}${reg.coupon ? ` with the code ${reg.coupon}` : ''}`} for ${cohort.label}.</p>${paymentId ? `<p>Razorpay payment: ${paymentId.replace(/[^\w]/g, '')}</p>` : ''}<p><a href="${SITE}/admin/weekend">Open the list</a></p>`,
    }).catch(() => {})
  }
  return 'paid'
}

/**
 * Take a coupon code off a seat that is reserved and not yet paid: from the screen someone returns to after
 * closing the payment window, or after the "Pay now" button of an email. The fee becomes the listed fee with
 * the code taken off, in the money the seat was reserved in, and the order opened for the old amount is dropped.
 * A code that leaves nothing to pay confirms the seat here (the use is counted first, so a code that has just
 * run out gives nothing).
 */
export async function applyCouponToSeat(reg: WeekendRegistration, raw: unknown): Promise<{ error: string } | { reg: WeekendRegistration; covered: boolean }> {
  const code = normalCode(raw)
  const coupon = await getCoupon(code)
  const problem = couponProblem(coupon, WEEKEND_SCOPE)
  if (problem || !coupon) return { error: problem || 'That code is not valid.' }
  if (reg.payment !== 'pending') return { error: 'This seat is already settled.' }
  const cur = reg.currency || 'INR'
  const fee = couponAmount(weekendFee(cur === 'INR').fee, cur, coupon.percent)
  if (fee === 0 && !(await redeemCoupon(code, reg.email, weekendUse(reg.cohort), true))) return { error: 'That code has already been used the maximum number of times.' }
  await mutateRegistrations((rows) => { const r = rows.find((x) => x.id === reg.id); if (r && r.payment === 'pending') { r.fee = fee; r.coupon = code; delete r.orderId } })
  const next: WeekendRegistration = { ...reg, fee, coupon: code, orderId: undefined }
  if (fee === 0) { await markPaid({ registrationId: reg.id }, ''); return { reg: { ...next, payment: 'paid' }, covered: true } }
  return { reg: next, covered: false }
}

export const findRegistration = async (id: string) => (await getRegistrations()).find((r) => r.id === id) || null
