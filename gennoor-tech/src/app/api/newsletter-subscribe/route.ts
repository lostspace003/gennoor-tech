import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email-service'
import { trackEvent, trackException, initAppInsights } from '@/lib/analytics'
import { saveEnquiry } from '@/lib/azure-storage'

async function pushToBeehiiv(email: string, source: string) {
  const apiKey = process.env.BEEHIIV_API_KEY
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID
  if (!apiKey || !publicationId) {
    return { ok: false, skipped: true, reason: 'BEEHIIV_API_KEY or BEEHIIV_PUBLICATION_ID not configured' }
  }

  const res = await fetch(`https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      reactivate_existing: true,
      send_welcome_email: false,
      utm_source: source || 'gennoor.com',
      utm_medium: 'website',
      utm_campaign: 'blog_newsletter',
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    return { ok: false, status: res.status, error: text }
  }
  const data = await res.json().catch(() => ({}))
  return { ok: true, data }
}

export async function POST(request: Request) {
  try {
    initAppInsights()
    const body = await request.json()
    const { email, source } = body as { email?: string; source?: string }

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ success: false, message: 'Valid email is required.' }, { status: 400 })
    }

    const timestamp = new Date().toISOString()

    // 1. Save to Azure Table Storage (private, always succeeds even if Beehiiv is offline)
    await saveEnquiry('NewsletterSubscriber', {
      name: 'Newsletter Subscriber',
      email,
      source: source || 'blog',
      message: 'Subscribed to weekly AI newsletter',
      timestamp,
    })

    // 2. Push to Beehiiv (best-effort; failure here should not break the user flow)
    const beehiivResult = await pushToBeehiiv(email, source || 'blog').catch((err) => ({
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    }))

    trackEvent('NewsletterSubscribe', {
      email,
      source: source || 'blog',
      beehiivOk: beehiivResult.ok ? 'true' : 'false',
    })

    // 3. Send welcome email (Gennoor-branded confirmation)
    await sendEmail({
      to: email,
      from: process.env.SMTP_USER || 'jalalkhan@gennoor.com',
      fromName: 'Gennoor Tech',
      subject: 'Welcome to the Gennoor AI Newsletter',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #0d9488 100%); padding: 36px 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #ffffff; margin: 0; font-size: 26px;">You're in.</h1>
            <p style="color: #dbeafe; margin: 10px 0 0; font-size: 15px;">Practitioner insights on enterprise AI — weekly.</p>
          </div>

          <div style="padding: 32px 30px; background: #ffffff; border: 1px solid #e5e7eb; border-top: none;">
            <p style="color: #374151; line-height: 1.7; font-size: 15px; margin-top: 0;">
              Thank you for subscribing to the <strong>Gennoor Tech</strong> AI newsletter. Each week we send a single, signal-rich email covering what shipped, what matters, and what to do about it.
            </p>

            <p style="color: #374151; line-height: 1.7; font-size: 15px;">
              You'll hear from us within the week. While you wait, three pieces worth reading:
            </p>

            <ul style="color: #374151; line-height: 1.9; font-size: 15px; padding-left: 20px;">
              <li><a href="https://gennoor.com/resources/blog/meta-incognito-chat-whatsapp-private-ai" style="color: #2563eb; text-decoration: none;">Meta's Incognito Chat — and what it means for procurement</a></li>
              <li><a href="https://gennoor.com/resources/blog/openai-daybreak-google-ai-zero-day" style="color: #2563eb; text-decoration: none;">OpenAI Daybreak and the first AI-built zero-day</a></li>
              <li><a href="https://gennoor.com/resources/blog/agentic-ai-production-lessons" style="color: #2563eb; text-decoration: none;">5 hard-won lessons from agentic AI in production</a></li>
            </ul>

            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin-top: 28px; border-top: 1px solid #f3f4f6; padding-top: 18px;">
              You can unsubscribe any time using the link at the bottom of every issue. Questions? Reply to this email — it goes to a real person.
            </p>
          </div>

          <div style="background: #1e293b; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
            <p style="color: #94a3b8; margin: 0; font-size: 13px;">Gennoor Tech · Enterprise AI Training & Solutions</p>
            <p style="color: #64748b; margin: 4px 0 0; font-size: 11px;">© 2026 Gennoor Tech. All rights reserved.</p>
          </div>
        </div>
      `,
    })

    // 4. Admin notification (lightweight)
    if (process.env.EMAIL_ADMIN) {
      await sendEmail({
        to: process.env.EMAIL_ADMIN,
        from: process.env.SMTP_USER || 'jalalkhan@gennoor.com',
        fromName: 'Gennoor Tech Website',
        subject: `[NEWSLETTER] New subscriber: ${email}`,
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif;">
            <h3 style="color: #1f2937;">New newsletter subscriber</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Source:</strong> ${source || 'blog'}</p>
            <p><strong>Time:</strong> ${timestamp}</p>
            <p><strong>Beehiiv sync:</strong> ${beehiivResult.ok ? 'OK' : `failed (${('error' in beehiivResult && beehiivResult.error) || ('reason' in beehiivResult && beehiivResult.reason) || 'unknown'})`}</p>
          </div>
        `,
      }).catch(() => { /* admin notification is best-effort */ })
    }

    return NextResponse.json({
      success: true,
      message: 'Subscribed. Check your inbox for a welcome email.',
      beehiivOk: beehiivResult.ok,
    })
  } catch (error) {
    console.error('Error processing newsletter subscribe:', error)
    trackException(error instanceof Error ? error : new Error(String(error)), { route: 'newsletter-subscribe' })
    return NextResponse.json(
      { success: false, message: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    )
  }
}
