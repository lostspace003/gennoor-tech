import { NextResponse } from 'next/server'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import { sendEmail } from '@/lib/email-service'
import { escapeHtml } from '@/lib/escape-html'
import { emailShell, emailTitle, emailDetails, emailSteps, emailContact } from '@/lib/crm/email-theme'
import { WEEKEND, nextCohort, timeLabel } from '@/data/ai-weekend'
import { mutateRegistrations, newRegistrationId, getSettings, type WeekendRegistration } from '@/lib/weekend'
import { buildWeekendEmail } from '@/lib/weekend-emails'

export const dynamic = 'force-dynamic'

const ADMIN = process.env.EMAIL_ADMIN || 'admin@gennoor.com'
const FROM = process.env.EMAIL_FROM_WEBINAR || 'webinar@gennoor.com'

/** Public: reserve a seat on the next AI Weekend. Payment is collected separately. */
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
      fee: WEEKEND.fee,
      source: clean(b.source, 160),
    }

    const outcome = await mutateRegistrations((rows) => {
      const mine = rows.filter((r) => r.cohort === cohort.id && r.payment !== 'refunded')
      if (mine.some((r) => r.email === email)) return 'again' as const
      if (mine.length >= WEEKEND.seats) return 'full' as const
      rows.push(reg)
      return 'new' as const
    })
    if (outcome === 'full') {
      return NextResponse.json({ error: 'This cohort is now full. Registration for next month opens when this weekend begins.' }, { status: 409 })
    }
    const fresh = outcome === 'new'

    // The person always gets the confirmation (a repeat usually means they lost the first one)
    await sendEmail({
      to: email,
      from: FROM,
      fromName: 'Gennoor Tech',
      subject: `Your seat is reserved: ${WEEKEND.name}, ${cohort.label}`,
      html: emailShell(
        emailTitle(`You are in, ${escapeHtml(name.split(/\s+/)[0])}.`, `Your seat on the ${WEEKEND.name} is reserved. Here is what happens next.`) +
          emailDetails('Your weekend', [
            ['Dates', cohort.label],
            ['Time', `${timeLabel()}, both days`],
            ['Where', WEEKEND.mode],
            ['Fee', `₹${WEEKEND.fee} (regular price ₹${WEEKEND.regularFee.toLocaleString('en-IN')})`],
          ]) +
          emailSteps(
            [
              { title: 'Pay the fee', body: `We will email you the payment details for ₹${WEEKEND.fee}. Your seat is confirmed once it is received.` },
              { title: 'Get set up', body: 'A few days before, we send the joining link and short setup steps.' },
              { title: 'Watch it built live', body: 'Each demo is built step by step on Saturday and Sunday. Ask questions as it happens.' },
              { title: 'Receive the full kit', body: 'After the weekend we send the notes, prompts, files and guides, so you can repeat every demo yourself.' },
            ],
            'What happens next'
          ) +
          emailContact({ email: 'admin@gennoor.com' }),
        { preheader: `${cohort.label}, ${timeLabel()}. Payment details follow by email.`, senderEmail: FROM }
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

    // If staff have already saved how to pay for this weekend, the payment email follows at once,
    // so nobody waits for a person to press Send.
    if (fresh) {
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

    return NextResponse.json({ success: true, cohort: cohort.label })
  } catch (e) {
    console.error('weekend register failed', e)
    return NextResponse.json({ error: 'We could not save your registration. Please try again.' }, { status: 500 })
  }
}
