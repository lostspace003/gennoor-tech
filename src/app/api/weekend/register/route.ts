import { NextResponse } from 'next/server'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import { sendEmail } from '@/lib/email-service'
import { escapeHtml } from '@/lib/escape-html'
import { emailShell, emailTitle, emailDetails, emailSteps, emailButton, emailContact } from '@/lib/crm/email-theme'
import { WEEKEND, nextCohort, closedNote, timeLabel, weekendFee } from '@/data/ai-weekend'
import { money } from '@/lib/money'
import { mutateRegistrations, newRegistrationId, getSettings, getRegistrations, type WeekendRegistration } from '@/lib/weekend'
import { buildWeekendEmail } from '@/lib/weekend-emails'
import { razorpayConfigured } from '@/lib/razorpay'
import { startPayment, payUrl, markPaid } from '@/lib/weekend-pay'
import { couponAmount, couponProblem, getCoupon, normalCode, redeemCoupon, weekendUse, WEEKEND_SCOPE } from '@/lib/lms-coupons'

export const dynamic = 'force-dynamic'

const ADMIN = process.env.EMAIL_ADMIN || 'admin@gennoor.com'
const FROM = process.env.EMAIL_FROM_WEBINAR || 'webinar@gennoor.com'

/**
 * Public: reserve a seat on the next AI Weekend. Payment is collected separately.
 * A coupon code (`coupon`) lowers the fee; one that takes 100 percent off confirms the seat at once, with no payment.
 */
export async function POST(req: Request) {
  try {
    if (!rateLimit(`weekend-register:${clientIp(req.headers)}`, 6, 10 * 60_000)) {
      return NextResponse.json({ error: 'Too many attempts. Please try again in a few minutes.' }, { status: 429 })
    }
    const b = await req.json().catch(() => ({}))
    if (b.website_hp) return NextResponse.json({ success: true }) // honeypot: bots fill this, people never see it

    const clean = (v: unknown, max: number) => String(v || '').trim().slice(0, max)
    const name = clean(b.name, 80)
    const email = clean(b.email, 120).toLowerCase()
    const phone = clean(b.phone, 24)
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please give us your name and a valid email address.' }, { status: 400 })
    }
    if (phone.replace(/\D/g, '').length < 8) {
      return NextResponse.json({ error: 'Please give us a phone number we can reach you on.' }, { status: 400 })
    }

    const cohort = nextCohort()
    // Rupees in India, dollars everywhere else. The page says which (from the visitor's device); the amount
    // itself is always decided here. A page that does not say is an older copy of the form: rupees, as before.
    const charge = weekendFee(b.india !== false)
    // A coupon code is checked before anything is saved, so a wrong one can be corrected in the form
    const code = normalCode(b.coupon)
    const coupon = code ? await getCoupon(code) : null
    if (code) {
      const problem = couponProblem(coupon, WEEKEND_SCOPE)
      if (problem || !coupon) return NextResponse.json({ error: problem || 'That code is not valid.', couponRejected: true }, { status: 400 })
    }
    const reg: WeekendRegistration = {
      id: newRegistrationId(),
      cohort: cohort.id,
      name,
      email,
      phone,
      company: clean(b.company, 120),
      role: clean(b.role, 80),
      at: new Date().toISOString(),
      payment: 'pending',
      fee: coupon ? couponAmount(charge.fee, charge.currency, coupon.percent) : charge.fee,
      currency: charge.currency,
      source: clean(b.source, 160),
      ...(coupon ? { coupon: code } : {}),
    }

    const outcome = await mutateRegistrations((rows) => {
      const mine = rows.filter((r) => r.cohort === cohort.id && r.payment !== 'refunded')
      if (mine.some((r) => r.email === email)) return 'again' as const
      if (mine.length >= WEEKEND.seats) return 'full' as const
      rows.push(reg)
      return 'new' as const
    })
    if (outcome === 'full') {
      return NextResponse.json({ error: 'This cohort is now full. Registration for next month opens the day before this weekend.' }, { status: 409 })
    }
    const fresh = outcome === 'new'

    // Someone registering again with the same email: carry on with the seat they already hold
    let seat = fresh ? reg : (await getRegistrations()).find((r) => r.cohort === cohort.id && r.email === email && r.payment !== 'refunded') || reg
    if (seat.payment === 'paid') return NextResponse.json({ success: true, cohort: cohort.label, paid: true })

    // Someone who reserved earlier and comes back with a code: the code is taken off the fee of the seat they
    // hold, in the money it was reserved in. The order opened for the old amount is dropped; a new one follows.
    if (coupon && !fresh && seat.coupon !== code) {
      const cur = seat.currency || 'INR'
      const fee = couponAmount(weekendFee(cur === 'INR').fee, cur, coupon.percent)
      const id = seat.id
      await mutateRegistrations((rows) => { const r = rows.find((x) => x.id === id); if (r && r.payment === 'pending') { r.fee = fee; r.coupon = code; delete r.orderId } })
      seat = { ...seat, fee, coupon: code, orderId: undefined }
    }

    // A code that takes the whole fee off: the seat is confirmed here and now, and nothing is paid.
    // The use is counted first, so a code that has just run out gives nothing.
    if (coupon && seat.fee === 0) {
      if (!(await redeemCoupon(code, email, weekendUse(cohort.id), true))) {
        const id = seat.id, cur = seat.currency || 'INR'
        await mutateRegistrations((rows) => { const r = rows.find((x) => x.id === id); if (r && r.payment === 'pending') { r.fee = weekendFee(cur === 'INR').fee; delete r.coupon } })
        return NextResponse.json({ error: 'That code has already been used the maximum number of times. Your seat is still reserved: press the button again to pay, or try another code.', couponRejected: true }, { status: 400 })
      }
      // markPaid sends the person their confirmation and tells the admin mailbox
      await markPaid({ registrationId: seat.id }, '')
      return NextResponse.json({ success: true, cohort: cohort.label, paid: true, covered: true })
    }

    // With online payment switched on, the payment window opens straight after the form
    const online = razorpayConfigured()
    const checkout = online ? await startPayment(seat).catch((e) => { console.error('weekend order failed', e); return null }) : null
    const payLink = online ? payUrl(seat.id) : ''
    // The payment window is pre-filled with what was just typed, never with details stored earlier:
    // typing someone else's email must not reveal their name or phone number.
    if (checkout) { checkout.name = name; checkout.phone = phone }
    // What this person pays, in the money their seat was reserved in (someone coming back keeps their first one)
    const inIndia = (seat.currency || 'INR') === 'INR'
    const due = money(seat.fee, seat.currency || 'INR')
    const regular = money(weekendFee(inIndia).regular, seat.currency || 'INR')
    const ways = inIndia ? 'UPI, card or net banking' : 'card'

    // The person always gets the confirmation (a repeat usually means they lost the first one)
    await sendEmail({
      to: email,
      from: FROM,
      fromName: 'Gennoor Tech',
      subject: `Your seat is reserved: ${WEEKEND.name}, ${cohort.label}`,
      html: emailShell(
        emailTitle(`You are in, ${escapeHtml(name.split(/\s+/)[0])}.`, `Your seat on the ${WEEKEND.name} is reserved. Here is what happens next.`) +
          // On the days when this month's weekend has closed: say so, so nobody expects to join tomorrow
          (closedNote() ? `<p style="margin:0 0 18px;padding:12px 14px;border:1px solid #fde68a;border-radius:10px;background:#fffbeb;font-size:15px;line-height:1.6;color:#0f172a">${escapeHtml(closedNote())}</p>` : '') +
          emailDetails('Your weekend', [
            ['Dates', cohort.label],
            ['Time', `${timeLabel()}, both days`],
            ['Where', WEEKEND.mode],
            ['Fee', `${due}${seat.coupon ? ` with code ${seat.coupon}` : ''} (regular price ${regular})`],
          ]) +
          (payLink ? emailButton(`Pay ${due} now`, payLink) : '') +
          emailSteps(
            [
              payLink
                ? { title: 'Pay the fee', body: `If you have not paid yet, use the button above (${ways}). Your seat is confirmed the moment the payment goes through.` }
                : { title: 'Pay the fee', body: `We will email you the payment details for ${due}. Your seat is confirmed once it is received.` },
              { title: 'Get set up', body: 'A few days before, we send the joining link and short setup steps.' },
              { title: 'Watch it built live', body: 'Each demo is built step by step on Saturday and Sunday. Ask questions as it happens.' },
              { title: 'Receive the full kit', body: 'After the weekend we send the notes, prompts, files and guides, so you can repeat every demo yourself.' },
            ],
            'What happens next'
          ) +
          emailContact({ email: 'admin@gennoor.com' }),
        { preheader: payLink ? `${cohort.label}, ${timeLabel()}. Pay ${due} to confirm your seat.` : `${cohort.label}, ${timeLabel()}. Payment details follow by email.`, senderEmail: FROM }
      ),
    }).catch((e) => console.error('weekend confirmation email failed', e))

    if (fresh) {
      await sendEmail({
        to: ADMIN,
        from: FROM,
        fromName: 'AI Weekend',
        subject: `AI Weekend registration (${cohort.monthName}): ${name}`,
        html: emailShell(
          emailTitle('New AI Weekend registration') +
            emailDetails('Details', [
              ['Name', name], ['Email', email], ['Phone', phone], ['Company', reg.company], ['Role', reg.role],
              ['Weekend', cohort.label], ['Came from', reg.source],
            ]) +
            `<p style="margin:16px 0 0"><a href="https://www.gennoor.com/admin/weekend" style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;padding:9px 20px;border-radius:8px;font-size:14px">Open the list</a></p>`
        ),
      }).catch((e) => console.error('weekend admin email failed', e))
    }

    // Without online payment: if staff have already saved how to pay for this weekend, the payment
    // email follows at once, so nobody waits for a person to press Send.
    if (fresh && !online) {
      const settings = (await getSettings().catch(() => ({} as Awaited<ReturnType<typeof getSettings>>)))[cohort.id]
      if (settings?.payment) {
        const mail = buildWeekendEmail('payment', reg, cohort, settings, FROM)
        const r = await sendEmail({ to: email, from: FROM, fromName: 'Gennoor Tech', subject: mail.subject, html: mail.html }).catch(() => ({ success: false }))
        if (r.success) {
          const now = new Date().toISOString()
          await mutateRegistrations((rows) => { const row = rows.find((x) => x.id === reg.id); if (row) row.emails = { ...(row.emails || {}), payment: now } }).catch(() => {})
        }
      }
    }

    return NextResponse.json({ success: true, cohort: cohort.label, checkout })
  } catch (e) {
    console.error('weekend register failed', e)
    return NextResponse.json({ error: 'We could not save your registration. Please try again.' }, { status: 500 })
  }
}
