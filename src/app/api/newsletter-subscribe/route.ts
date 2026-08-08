import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email-service'
import { trackEvent, trackException, initAppInsights } from '@/lib/analytics'
import { saveEnquiry } from '@/lib/azure-storage'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import { escapeHtml } from '@/lib/escape-html'
import { emailShell } from '@/lib/crm/email-theme'
import { unsubscribeUrl } from '@/lib/unsubscribe'

/**
 * Newsletter subscription (site footer + blog).
 *
 * These signups used to POST to /api/book-expert-call, so a person who typed
 * an email address into the footer received a training-sales email promising
 * that a specialist would "reach out via phone or WhatsApp" and send a
 * "customized training proposal" — none of which was true, and for which no
 * phone number had ever been given. It also leaked the internal form label
 * ("Newsletter Subscription (Footer)"), rendered three blank summary rows, and
 * attached the catalogue spreadsheet to an opt-in.
 *
 * This route sends what a subscriber actually signed up for: a short
 * confirmation, an honest description of what will arrive, and an unsubscribe
 * link. No attachment, no call promise, no internal labels.
 */

export async function POST(request: Request) {
  try {
    const ip = clientIp(request.headers)
    if (!rateLimit(`newsletter:${ip}`, 5, 10 * 60_000)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a few minutes.' },
        { status: 429 }
      )
    }
    initAppInsights()

    const body = await request.json()
    const email = String(body.email || '').trim().toLowerCase()
    const source = String(body.source || 'site').trim().slice(0, 60)

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      )
    }

    trackEvent('NewsletterSubscribe', { email, source })

    await saveEnquiry('NewsletterSubscription', {
      email,
      source,
      subscribedAt: new Date().toISOString(),
    })

    const fromAddress = process.env.EMAIL_FROM_INFO || 'info@gennoor.com'
    const unsubUrl = unsubscribeUrl(email)

    await sendEmail({
      to: email,
      from: fromAddress,
      fromName: 'Gennoor Tech',
      subject: "You're subscribed — Gennoor Tech",
      unsubscribeUrl: unsubUrl,
      html: emailShell(
        `
        <h3 style="margin:0 0 12px;color:#0f172a;font-size:19px">You're subscribed.</h3>
        <p style="margin:0 0 16px;color:#475569;line-height:1.7;font-size:15px">
          Thanks for signing up. You'll get an occasional email when we publish
          something worth your time — field notes on enterprise AI, new guides,
          and dates for free webinars and workshops.
        </p>
        <p style="margin:0 0 16px;color:#475569;line-height:1.7;font-size:15px">
          No fixed schedule, and nothing sold to you. If it stops being useful,
          the unsubscribe link at the bottom of every email works immediately.
        </p>
        <p style="margin:0 0 6px;color:#0f172a;font-weight:600;font-size:15px">While you're here</p>
        <p style="margin:0;color:#475569;line-height:1.7;font-size:15px">
          The <a href="https://www.gennoor.com/academy" style="color:#2563EB;text-decoration:none">AI Academy</a>
          is free and self-paced, and the
          <a href="https://www.gennoor.com/resources" style="color:#2563EB;text-decoration:none">resources library</a>
          collects every guide, video and calculator we've published.
        </p>`,
        {
          preheader: "You're subscribed to the Gennoor Tech newsletter.",
          senderEmail: fromAddress,
          unsubscribeUrl: unsubUrl,
        }
      ),
    })

    return NextResponse.json({ success: true, message: 'Subscribed.' })
  } catch (error) {
    console.error('Newsletter subscribe error:', error)
    trackException(error instanceof Error ? error : new Error(String(error)), {
      route: 'newsletter-subscribe',
    })
    return NextResponse.json(
      { success: false, message: 'Could not complete the subscription. Please try again.' },
      { status: 500 }
    )
  }
}
