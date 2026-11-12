import { sendEmail } from '@/lib/email-service'
import { escapeHtml } from '@/lib/escape-html'
import { emailShell, emailTitle, emailDetails, emailButton, emailContact } from '@/lib/crm/email-theme'
import { enroll } from '@/lib/lms'
import { formatInr, formatUsd, recordPurchase, settleOrder, type Purchase } from '@/lib/lms-access'
import { redeemCoupon } from '@/lib/lms-coupons'

// What happens once a course becomes someone's: the purchase is recorded, the
// learner is enrolled, and a receipt goes out. A paid order arrives here from the
// browser's confirmation and from the webhook (only the first call does anything);
// a course given free by a coupon code arrives from the buy request itself.

const FROM = process.env.EMAIL_FROM_INFO || 'info@gennoor.com'
const ADMIN = process.env.EMAIL_ADMIN || 'admin@gennoor.com'
const SITE = 'https://www.gennoor.com'

export const money = (p: Pick<Purchase, 'amount' | 'currency'>) => (p.currency === 'INR' ? formatInr(p.amount) : formatUsd(p.amount))

export async function completeCoursePurchase(orderId: string, paymentId: string): Promise<Purchase | null> {
  const purchase = await settleOrder(orderId, paymentId)
  if (!purchase) return null
  if (purchase.coupon) {
    await redeemCoupon(purchase.coupon, purchase.email, purchase.slug, false).catch((e) => console.error('coupon count after purchase failed', e))
  }
  await welcome(purchase)
  return purchase
}

/**
 * Give a course free with a coupon code. The use is counted first, so a code
 * that has just run out gives nothing: null is returned and nothing is recorded.
 */
export async function grantCourseByCoupon(learner: { email: string; name?: string }, course: { slug: string; title: string }, code: string, currency: 'USD' | 'INR'): Promise<Purchase | null> {
  if (!(await redeemCoupon(code, learner.email, course.slug, true))) return null
  const purchase: Purchase = {
    email: learner.email.trim().toLowerCase(), name: learner.name || '', slug: course.slug, courseTitle: course.title,
    amount: 0, currency, orderId: '', paymentId: '', at: new Date().toISOString(), coupon: code,
  }
  await recordPurchase(purchase)
  await welcome(purchase)
  return purchase
}

async function welcome(purchase: Purchase): Promise<void> {
  await enroll(purchase.email, purchase.name, purchase.slug).catch((e) => console.error('enroll after purchase failed', e))

  const free = purchase.amount === 0
  const paid = free ? `Free with code ${purchase.coupon}` : purchase.coupon ? `${money(purchase)} with code ${purchase.coupon}` : money(purchase)
  const first = escapeHtml((purchase.name || '').trim().split(/\s+/)[0] || '')
  await sendEmail({
    to: purchase.email,
    from: FROM,
    fromName: 'Gennoor Tech',
    subject: `Your course is ready: ${purchase.courseTitle}`,
    html: emailShell(
      emailTitle(first ? `Thank you, ${first}.` : 'Thank you.', `${free ? 'Your code is accepted' : 'Your payment is received'} and the full course is open: every lesson, lab and quiz.`) +
        emailDetails(free ? 'Your course' : 'Your receipt', [
          ['Course', purchase.courseTitle],
          ['Paid', paid],
          ...(free ? [] : [['Payment reference', purchase.paymentId] as [string, string]]),
          ['Date', new Date(purchase.at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' })],
        ]) +
        emailButton('Start the course', `${SITE}/studio/${purchase.slug}/learn`) +
        `<p style="margin:18px 0 0;font-size:14px;line-height:1.6;color:#64748b">Sign in with ${escapeHtml(purchase.email)} to open it on any device. Your progress is saved as you go.</p>` +
        emailContact({ email: 'admin@gennoor.com' }),
      { preheader: `${free ? 'Your code is accepted' : `${money(purchase)} received`}. ${purchase.courseTitle} is open.`, senderEmail: FROM }
    ),
  }).catch((e) => console.error('course receipt email failed', e))

  await sendEmail({
    to: ADMIN,
    from: FROM,
    fromName: 'Learning Studio',
    subject: free ? `Course given by coupon: ${purchase.courseTitle} (${purchase.coupon})` : `Course sold: ${purchase.courseTitle} (${money(purchase)})`,
    html: `<p>${escapeHtml(purchase.name || purchase.email)} &lt;${escapeHtml(purchase.email)}&gt; ${free ? 'got' : 'bought'} <strong>${escapeHtml(purchase.courseTitle)}</strong> ${free ? 'free' : `for ${money(purchase)}`}${purchase.coupon ? ` with coupon code ${escapeHtml(purchase.coupon)}` : ''}.</p>${free ? '' : `<p>Razorpay payment: ${escapeHtml(purchase.paymentId)}</p>`}<p><a href="${SITE}/admin/payments">Open payments</a></p>`,
  }).catch(() => {})
}
