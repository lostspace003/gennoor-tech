import { expertCallHtml } from '@/lib/email-templates'
import { NextResponse } from 'next/server'
import { sendEmail, catalogExcelAttachment } from '@/lib/email-service'
import { trackEvent, trackException, initAppInsights } from '@/lib/analytics'
import { saveEnquiry } from '@/lib/azure-storage'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import { escapeHtml } from '@/lib/escape-html'
import { formatIstCst } from '@/lib/format-time'

export async function POST(request: Request) {
  try {
    const ip = clientIp(request.headers)
    if (!rateLimit(`book-expert-call:${ip}`, 5, 10 * 60_000)) {
      return NextResponse.json({ error: 'Too many requests. Please try again in a few minutes.' }, { status: 429 })
    }
    initAppInsights()
    const body = await request.json()
    const {
      name,
      email,
      whatsapp,
      whatsappCountry,
      company,
      designation,
      message,
      programTitle,
      timestamp
    } = body

    // Newsletter signups (footer + blog) post only name/email/programTitle —
    // every other field is optional and must never be dereferenced directly.
    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return NextResponse.json(
        { success: false, message: 'A name and a valid email are required.' },
        { status: 400 }
      )
    }

    console.log('Expert Call Booking Received:', {
      name, email, whatsapp, whatsappCountry, company, designation, message, programTitle, timestamp
    })

    trackEvent('ExpertCallBooking', {
      name, email, company: company || '', designation: designation || '',
      whatsappCountry: whatsappCountry || '', programTitle: programTitle || '',
    })

    // Save to Azure Table Storage
    await saveEnquiry('ExpertCallBooking', {
      name, email, whatsapp, whatsappCountry, company, designation,
      message, programTitle, timestamp,
    })

    // Send confirmation email to user
    const catalog = await catalogExcelAttachment()
    await sendEmail({
      to: email,
      from: process.env.EMAIL_FROM_INFO || 'info@gennoor.com',
      fromName: 'Gennoor Tech',
      subject: `Thank You for Your Interest – ${programTitle} | Gennoor Tech`,
      attachments: catalog ? [catalog] : undefined,
      html: expertCallHtml({ name, programTitle, company, country: whatsappCountry, role: designation }),
    })

    // Send notification email to admin
    await sendEmail({
      to: process.env.EMAIL_ADMIN || 'admin@gennoor.com',
      cc: [
        process.env.EMAIL_FROM_TRAINING || 'training@gennoor.com',
        process.env.EMAIL_FROM_SALES || 'sales@gennoor.com'
      ],
      from: process.env.EMAIL_FROM_INFO || 'info@gennoor.com',
      fromName: 'Gennoor Tech Website',
      subject: `[CALL REQUEST] ${name}${company ? ` from ${company}` : ''}${whatsappCountry ? ` (${whatsappCountry})` : ''} – ${programTitle || 'General enquiry'}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #1e293b; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">New Expert Call Request</h2>

          <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr style="background: #f8fafc;">
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600; width: 35%;">Program</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">${escapeHtml(programTitle)}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">Name</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">${escapeHtml(name)}</td>
            </tr>
            <tr style="background: #f8fafc;">
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">Email</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">WhatsApp</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">${
                whatsapp
                  ? `<a href="https://wa.me/${String(whatsapp).replace(/[^0-9]/g, '')}">${escapeHtml(whatsapp)}</a>`
                  : 'N/A'
              }</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">Country</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">${escapeHtml(whatsappCountry)}</td>
            </tr>
            <tr style="background: #f8fafc;">
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">Company</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">${escapeHtml(company)}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">Designation</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">${escapeHtml(designation)}</td>
            </tr>
            <tr style="background: #f8fafc;">
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">Message</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">${escapeHtml(message) || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">Submitted</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">${escapeHtml(formatIstCst(timestamp) || formatIstCst(new Date()))}</td>
            </tr>
          </table>

          <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin-top: 20px;">
            <p style="color: #92400e; margin: 0; font-weight: 600;">
              Action Required: Please follow up within 24 hours. Connect via WhatsApp to share program details.
            </p>
          </div>
        </div>
      `
    })

    return NextResponse.json({
      success: true,
      message: 'Call request submitted successfully. Confirmation email sent.'
    })

  } catch (error) {
    console.error('Error processing call booking:', error)
    trackException(error instanceof Error ? error : new Error(String(error)), { route: 'book-expert-call' })
    return NextResponse.json(
      { success: false, message: 'Failed to process request. Please try again.' },
      { status: 500 }
    )
  }
}
