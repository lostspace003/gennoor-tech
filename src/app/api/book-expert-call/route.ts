import { NextResponse } from 'next/server'
import { sendEmail, catalogExcelAttachment } from '@/lib/email-service'
import { trackEvent, trackException, initAppInsights } from '@/lib/analytics'
import { saveEnquiry } from '@/lib/azure-storage'

export async function POST(request: Request) {
  try {
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
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Gennoor Tech</h1>
            <p style="color: #bfdbfe; margin: 10px 0 0; font-size: 16px;">Enterprise AI Training & Solutions</p>
          </div>

          <div style="padding: 40px 30px; background: #ffffff; border: 1px solid #e0e0e0; border-top: none;">
            <h2 style="color: #1f2937; margin-top: 0; font-size: 22px;">Dear ${name},</h2>

            <p style="color: #4b5563; line-height: 1.8; font-size: 16px;">
              Thank you for expressing your interest in <strong>${programTitle}</strong>.
              We're excited to connect with you!
            </p>

            <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
              <p style="color: #166534; margin: 0; font-weight: 600; font-size: 16px;">
                Our training specialist team will revert back to you shortly to discuss further and schedule a call.
              </p>
            </div>

            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 25px 0;">
              <h3 style="color: #334155; margin-top: 0; font-size: 16px;">Your Request Summary:</h3>
              <table style="width: 100%; border-collapse: collapse; color: #475569;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; width: 40%;"><strong>Program:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${programTitle}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><strong>Organization:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${company}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><strong>Country:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${whatsappCountry}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Role:</strong></td>
                  <td style="padding: 8px 0;">${designation}</td>
                </tr>
              </table>
            </div>

            <h3 style="color: #1f2937; margin-top: 30px;">What to Expect:</h3>
            <ol style="color: #4b5563; line-height: 2.2; padding-left: 20px;">
              <li>Our expert will reach out to you via phone or WhatsApp</li>
              <li>We'll understand your specific training requirements</li>
              <li>You'll receive a customized training proposal</li>
              <li>We'll finalize the schedule and delivery format</li>
            </ol>

            <div style="border-top: 2px solid #e5e7eb; padding-top: 25px; margin-top: 35px;">
              <h4 style="color: #1f2937; margin-bottom: 15px;">Reach Us Anytime:</h4>
              <table style="width: 100%; color: #4b5563; line-height: 2;">
                <tr>
                  <td style="padding: 3px 0;">Email:</td>
                  <td><a href="mailto:training@gennoor.com" style="color: #2563eb; text-decoration: none;">training@gennoor.com</a></td>
                </tr>
                <tr>
                  <td style="padding: 3px 0;">WhatsApp:</td>
                  <td><a href="https://wa.me/919326352241" style="color: #2563eb; text-decoration: none;">+91 9326352241</a></td>
                </tr>
                <tr>
                  <td style="padding: 3px 0;">Website:</td>
                  <td><a href="https://www.gennoor.com" style="color: #2563eb; text-decoration: none;">www.gennoor.com</a></td>
                </tr>
              </table>
            </div>
          </div>

          <div style="background: #1e293b; padding: 25px; text-align: center; border-radius: 0 0 10px 10px;">
            <p style="color: #94a3b8; margin: 0; font-size: 14px;">© 2026 Gennoor Tech. All rights reserved.</p>
            <p style="color: #64748b; margin: 5px 0 0; font-size: 12px;">Enterprise AI Training & Solutions</p>
          </div>
        </div>
      `
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
      subject: `[CALL REQUEST] ${name} from ${company} (${whatsappCountry}) – ${programTitle}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #1e293b; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">New Expert Call Request</h2>

          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr style="background: #f8fafc;">
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600; width: 35%;">Program</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">${programTitle}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">Name</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">${name}</td>
            </tr>
            <tr style="background: #f8fafc;">
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">Email</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">WhatsApp</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;"><a href="https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}">${whatsapp}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">Country</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">${whatsappCountry}</td>
            </tr>
            <tr style="background: #f8fafc;">
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">Company</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">${company}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">Designation</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">${designation}</td>
            </tr>
            <tr style="background: #f8fafc;">
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">Message</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">${message || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">Submitted</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">${timestamp}</td>
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
