import { sendEmail } from '@/lib/email-service'
import { escapeHtml } from '@/lib/escape-html'
import { emailShell, emailTitle, emailDetails, emailButton, emailContact } from '@/lib/crm/email-theme'
import { enroll } from '@/lib/lms'
import { formatInr, formatUsd, settleOrder, type Purchase } from '@/lib/lms-access'

// What happens once Razorpay confirms a course payment: the purchase is
// recorded, the learner is enrolled, and a receipt goes out. Called by the
// browser's confirmation and by the webhook; only the first call does anything.

const FROM = process.env.EMAIL_FROM_INFO || 'info@gennoor.com'
const ADMIN = process.env.EMAIL_ADMIN || 'admin@gennoor.com'
const SITE = 'https://www.gennoor.com'

export const money = (p: Pick<Purchase, 'amount' | 'currency'>) => (p.currency === 'INR' ? formatInr(p.amount) : formatUsd(p.amount))

export async function completeCoursePurchase(orderId: string, paymentId: string): Promise<Purchase | null> {
  const purchase = await settleOrder(orderId, paymentId)
  if (!purchase) return null

  await enroll(purchase.email, purchase.name, purchase.slug).catch((e) => console.error('enroll after purchase failed', e))

  const first = escapeHtml((purchase.name || '').trim().split(/\s+/)[0] || '')
  await sendEmail({
    to: purchase.email,
    from: FROM,
    fromName: 'Gennoor Tech',
    subject: `Your course is ready: ${purchase.courseTitle}`,
    html: emailShell(
      emailTitle(first ? `Thank you, ${first}.` : 'Thank you.', `Your payment is received and the full course is open: every lesson, lab and quiz.`) +
        emailDetails('Your receipt', [
          ['Course', purchase.courseTitle],
          ['Paid', money(purchase)],
          ['Payment reference', purchase.paymentId],
          ['Date', new Date(purchase.at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' })],
        ]) +
        emailButton('Start the course', `${SITE}/studio/${purchase.slug}/learn`) +
        `<p style="margin:18px 0 0;font-size:14px;line-height:1.6;color:#64748b">Sign in with ${escapeHtml(purchase.email)} to open it on any device. Your progress is saved as you go.</p>` +
        emailContact({ email: 'admin@gennoor.com' }),
      { preheader: `${money(purchase)} received. ${purchase.courseTitle} is open.`, senderEmail: FROM }
    ),
  }).catch((e) => console.error('course receipt email failed', e))

  await sendEmail({
    to: ADMIN,
    from: FROM,
    fromName: 'Learning Studio',
    subject: `Course sold: ${purchase.courseTitle} (${money(purchase)})`,
    html: `<p>${escapeHtml(purchase.name || purchase.email)} &lt;${escapeHtml(purchase.email)}&gt; bought <strong>${escapeHtml(purchase.courseTitle)}</strong> for ${money(purchase)}.</p><p>Razorpay payment: ${escapeHtml(purchase.paymentId)}</p><p><a href="${SITE}/admin/payments">Open payments</a></p>`,
  }).catch(() => {})

  return purchase
}
