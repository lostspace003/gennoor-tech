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
      subject: "You're subscribed: one email a week from Gennoor Tech",
      unsubscribeUrl: unsubUrl,
      html: emailShell(
        `
        <h3 style="margin:0 0 12px;color:#0f172a;font-size:19px">You're subscribed.</h3>
        <p style="margin:0 0 16px;color:#475569;line-height:1.7;font-size:15px">
          Thank you for signing up. You will get one email a week, on Thursday,
          with the posts we published that week. A week with no new post brings
          no email.
        </p>
        <p style="margin:0 0 16px;color:#475569;line-height:1.7;font-size:15px">
          If it stops being useful, the unsubscribe link at the foot of every
          email works at once.
        </p>
        <p style="margin:0 0 6px;color:#0f172a;font-weight:600;font-size:15px">While you are here</p>
        <p style="margin:0;color:#475569;line-height:1.7;font-size:15px">
          The latest posts are on the
          <a href="https://www.gennoor.com/resources/blog" style="color:#2563EB;text-decoration:none">blog</a>,
          and the preview lessons of every course are on the
          <a href="https://www.gennoor.com/studio" style="color:#2563EB;text-decoration:none">Learning Studio</a>.
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
