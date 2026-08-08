import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email-service'
import { trackEvent, trackException, initAppInsights } from '@/lib/analytics'
import { saveEnquiry } from '@/lib/azure-storage'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import { escapeHtml } from '@/lib/escape-html'
import { emailShell } from '@/lib/crm/email-theme'

/**
 * Contact / proposal form (`/contact` → ContactForm.tsx).
 *
 * This route was MISSING — the form has always POSTed to /api/contact-enquiry
 * but no such route existed in the repo's history, so every submission 404'd
 * and the visitor saw the generic error state. Every other enquiry form had a
 * backing route; this one did not.
 *
 * Payload from ContactForm: { name, email, whatsapp, company, service, message }
 * — only name and email are guaranteed; the rest are optional and must never
 * be dereferenced directly.
 *
 * Behaviour matches the sibling enquiry routes: rate limit → validate → save
 * to Table Storage (`ContactEnquiry`) → confirm to the visitor → notify the
 * team.
 */

export async function POST(request: Request) {
  try {
    const ip = clientIp(request.headers)
    if (!rateLimit(`contact-enquiry:${ip}`, 5, 10 * 60_000)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a few minutes.' },
        { status: 429 }
      )
    }
    initAppInsights()

    const body = await request.json()
    const { name, email, whatsapp, company, service, message, timestamp } = body

    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return NextResponse.json(
        { success: false, message: 'Please provide your name and a valid email address.' },
        { status: 400 }
      )
    }

    const submittedAt = timestamp || new Date().toISOString()

    trackEvent('ContactEnquiry', {
      name: String(name),
      email: String(email),
      company: company ? String(company) : '',
      service: service ? String(service) : '',
    })

    await saveEnquiry('ContactEnquiry', {
      name, email, whatsapp, company, service, message, timestamp: submittedAt,
    })

    const fromAddress = process.env.EMAIL_FROM_ENQUIRY || 'enquiry@gennoor.com'

    // ── Confirmation to the visitor ────────────────────────────────────────
    await sendEmail({
      to: String(email),
      from: fromAddress,
      fromName: 'Gennoor Tech',
      subject: 'We received your message — Gennoor Tech',
      html: emailShell(
        `
        <h3 style="margin:0 0 12px;color:#0f172a">Thank you, ${escapeHtml(name)}.</h3>
        <p style="margin:0 0 16px;color:#475569;line-height:1.7;font-size:15px">
          Your message reached us and a member of the team will reply shortly —
          usually within one business day.
        </p>
        <table role="presentation" style="border-collapse:collapse;font-size:14px;width:100%">
          ${service ? `<tr><td style="padding:6px 10px;border:1px solid #e2e8f0;width:130px;color:#64748b">Interested in</td><td style="padding:6px 10px;border:1px solid #e2e8f0">${escapeHtml(service)}</td></tr>` : ''}
          ${company ? `<tr><td style="padding:6px 10px;border:1px solid #e2e8f0;color:#64748b">Organisation</td><td style="padding:6px 10px;border:1px solid #e2e8f0">${escapeHtml(company)}</td></tr>` : ''}
          ${message ? `<tr><td style="padding:6px 10px;border:1px solid #e2e8f0;color:#64748b">Your message</td><td style="padding:6px 10px;border:1px solid #e2e8f0">${escapeHtml(message)}</td></tr>` : ''}
        </table>
        <p style="margin:16px 0 0;color:#475569;line-height:1.7;font-size:15px">
          In the meantime you're welcome to explore the
          <a href="https://www.gennoor.com/resources" style="color:#2563EB;text-decoration:none">resources library</a>
          or the free <a href="https://www.gennoor.com/academy" style="color:#2563EB;text-decoration:none">AI Academy</a>.
        </p>`,
        { preheader: 'We received your message and will reply shortly.', senderEmail: fromAddress }
      ),
    })

    // ── Notification to the team ───────────────────────────────────────────
    await sendEmail({
      to: process.env.EMAIL_ADMIN || 'admin@gennoor.com',
      cc: process.env.EMAIL_FROM_SALES || 'sales@gennoor.com',
      from: fromAddress,
      fromName: 'Gennoor Tech Website',
      subject: `[CONTACT] ${name}${company ? ` — ${company}` : ''}${service ? ` · ${service}` : ''}`,
      html: emailShell(
        `
        <h3 style="margin:0 0 12px;color:#0f172a">New contact form submission</h3>
        <table role="presentation" style="border-collapse:collapse;font-size:14px;width:100%">
          <tr><td style="padding:6px 10px;border:1px solid #e2e8f0;width:130px;color:#64748b">Name</td><td style="padding:6px 10px;border:1px solid #e2e8f0"><strong>${escapeHtml(name)}</strong></td></tr>
          <tr><td style="padding:6px 10px;border:1px solid #e2e8f0;color:#64748b">Email</td><td style="padding:6px 10px;border:1px solid #e2e8f0"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
          ${whatsapp ? `<tr><td style="padding:6px 10px;border:1px solid #e2e8f0;color:#64748b">WhatsApp</td><td style="padding:6px 10px;border:1px solid #e2e8f0"><a href="https://wa.me/${String(whatsapp).replace(/[^0-9]/g, '')}">${escapeHtml(whatsapp)}</a></td></tr>` : ''}
          ${company ? `<tr><td style="padding:6px 10px;border:1px solid #e2e8f0;color:#64748b">Company</td><td style="padding:6px 10px;border:1px solid #e2e8f0">${escapeHtml(company)}</td></tr>` : ''}
          ${service ? `<tr><td style="padding:6px 10px;border:1px solid #e2e8f0;color:#64748b">Service</td><td style="padding:6px 10px;border:1px solid #e2e8f0">${escapeHtml(service)}</td></tr>` : ''}
          ${message ? `<tr><td style="padding:6px 10px;border:1px solid #e2e8f0;color:#64748b">Message</td><td style="padding:6px 10px;border:1px solid #e2e8f0">${escapeHtml(message)}</td></tr>` : ''}
          <tr><td style="padding:6px 10px;border:1px solid #e2e8f0;color:#64748b">Submitted</td><td style="padding:6px 10px;border:1px solid #e2e8f0">${escapeHtml(submittedAt)}</td></tr>
        </table>
        <p style="margin:16px 0 0"><a href="https://www.gennoor.com/crm/queue" style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;padding:9px 20px;border-radius:8px;font-size:14px">Open the Work Queue →</a></p>`,
        { preheader: `Contact: ${name}`, senderEmail: fromAddress }
      ),
    })

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully. We will be in touch shortly.',
    })
  } catch (error) {
    console.error('Error processing contact enquiry:', error)
    trackException(error instanceof Error ? error : new Error(String(error)), {
      route: 'contact-enquiry',
    })
    return NextResponse.json(
      { success: false, message: 'Failed to send your message. Please try again.' },
      { status: 500 }
    )
  }
}
