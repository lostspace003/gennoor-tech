import { certificationHtml } from '@/lib/email-templates'
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
    if (!rateLimit(`certification-enquiry:${ip}`, 5, 10 * 60_000)) {
      return NextResponse.json({ error: 'Too many requests. Please try again in a few minutes.' }, { status: 429 })
    }
    initAppInsights()
    const body = await request.json()
    const {
      name,
      email,
      phone,
      company,
      designation,
      certifications,
      currentLevel,
      targetDate,
      trainingMode,
      message,
      selectedCertification,
      timestamp
    } = body

    // Without this the route accepted an empty body and emailed the team a
    // notification reading "Certification Enquiry - undefined".
    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return NextResponse.json(
        { success: false, message: 'Please provide your name and a valid email address.' },
        { status: 400 }
      )
    }

    console.log('Certification Enquiry Received:', {
      name, email, phone, company, designation, certifications, currentLevel,
      targetDate, trainingMode, message, selectedCertification, timestamp
    })

    const leadScore = targetDate === '1-month' ? 'HOT' : targetDate === '2-months' ? 'WARM' : 'COLD'

    trackEvent('CertificationEnquiry', {
      name, email, company: company || '', designation: designation || '',
      selectedCertification: selectedCertification || '',
      currentLevel: currentLevel || '', targetDate: targetDate || '',
      trainingMode: trainingMode || '', leadScore,
    })

    // Save to Azure Table Storage
    await saveEnquiry('CertificationEnquiry', {
      name, email, phone, company, designation, certifications,
      selectedCertification, currentLevel, targetDate, trainingMode,
      message, leadScore, timestamp,
    })

    // Send confirmation email to user
    const catalog = await catalogExcelAttachment()
    await sendEmail({
      to: email,
      cc: process.env.CC_ENQUIRY_ON_CERTIFICATION === 'true'
        ? [process.env.EMAIL_FROM_ENQUIRY || 'enquiry@gennoor.com']
        : undefined,
      from: process.env.EMAIL_FROM_ENQUIRY || 'enquiry@gennoor.com',
      fromName: 'Gennoor Tech Certification Team',
      subject: `Certification Preparation Guide: ${selectedCertification} | Gennoor Tech`,
      attachments: catalog ? [catalog] : undefined,
      html: certificationHtml({ name, certification: selectedCertification, level: currentLevel, targetDate, mode: trainingMode }),
    })

    // Send admin notification
    await sendEmail({
      to: process.env.EMAIL_ADMIN || 'admin@gennoor.com',
      cc: [
        process.env.EMAIL_FROM_TRAINING || 'training@gennoor.com',
        process.env.EMAIL_FROM_ENQUIRY || 'enquiry@gennoor.com'
      ],
      from: process.env.EMAIL_FROM_ENQUIRY || 'enquiry@gennoor.com',
      fromName: 'Certification System',
      subject: `[${leadScore}] Certification Enquiry - ${selectedCertification}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif;">
          <h2 style="color: #1e293b; border-bottom: 2px solid #7c3aed; padding-bottom: 10px;">New Certification Enquiry</h2>

          <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr style="background: ${leadScore === 'HOT' ? '#fee2e2' : leadScore === 'WARM' ? '#fef3c7' : '#f1f5f9'};">
              <td colspan="2" style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">Lead Score: ${leadScore}</td>
            </tr>
            <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600;">Name</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${escapeHtml(name)}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600;">Email</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${escapeHtml(email)}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600;">Phone</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${escapeHtml(phone)}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600;">Company</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${escapeHtml(company) || 'Not provided'}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600;">Designation</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${escapeHtml(designation) || 'Not provided'}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600;">Certification</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${escapeHtml(selectedCertification)}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600;">Other Interests</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${escapeHtml(certifications?.join(', ')) || 'None'}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600;">Current Level</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${escapeHtml(currentLevel)}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600;">Target Date</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${escapeHtml(targetDate)}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600;">Training Mode</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${escapeHtml(trainingMode)}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600;">Message</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${escapeHtml(message) || 'N/A'}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600;">Submitted</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${escapeHtml(formatIstCst(timestamp) || formatIstCst(new Date()))}</td></tr>
          </table>

          <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin-top: 20px;">
            <p style="color: #92400e; margin: 0; font-weight: 600;">
              Action Required: Review requirements, prepare customized plan, and follow up promptly.
            </p>
          </div>
        </div>
      `
    })

    return NextResponse.json({
      success: true,
      message: 'Certification enquiry submitted successfully. We will contact you with detailed information.'
    })

  } catch (error) {
    console.error('Error processing certification enquiry:', error)
    trackException(error instanceof Error ? error : new Error(String(error)), { route: 'certification-enquiry' })
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process enquiry. Please try again.'
      },
      { status: 500 }
    )
  }
}
