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
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Gennoor Tech</h1>
            <p style="color: #c4b5fd; margin: 10px 0 0; font-size: 16px;">Certification Training Excellence</p>
          </div>

          <div style="padding: 40px 30px; background: #ffffff; border: 1px solid #e0e0e0; border-top: none;">
            <h2 style="color: #1f2937; margin-top: 0;">Dear ${name},</h2>

            <p style="color: #4b5563; line-height: 1.8; font-size: 16px;">
              Thank you for your interest in certification preparation with Gennoor Tech.
            </p>

            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 25px 0;">
              <h3 style="color: #334155; margin-top: 0;">Your Enquiry Details:</h3>
              <ul style="color: #4b5563; line-height: 2; padding-left: 20px;">
                <li><strong>Selected Certification:</strong> ${selectedCertification}</li>
                <li><strong>Current Level:</strong> ${currentLevel}</li>
                <li><strong>Target Date:</strong> ${targetDate}</li>
                <li><strong>Preferred Mode:</strong> ${trainingMode}</li>
              </ul>
            </div>

            <h3 style="color: #1f2937;">What's Next?</h3>
            <ol style="color: #4b5563; line-height: 2.2; padding-left: 20px;">
              <li>Our certification expert will review your requirements</li>
              <li>You'll receive a detailed preparation plan</li>
              <li>We'll schedule a free consultation call</li>
              <li>Get access to sample questions and study materials</li>
            </ol>

            <h3 style="color: #1f2937; margin-top: 30px;">Why Choose Gennoor Tech?</h3>
            <ul style="color: #4b5563; line-height: 2; padding-left: 20px;">
              <li>Expert trainer with 16+ active Microsoft certifications</li>
              <li>Official curriculum and practice tests</li>
              <li>Hands-on labs and real-world scenarios</li>
              <li>Post-training support</li>
              <li>Free retake session if needed</li>
            </ul>

            <div style="border-top: 2px solid #e5e7eb; padding-top: 25px; margin-top: 35px;">
              <h4 style="color: #1f2937; margin-bottom: 15px;">Get in Touch:</h4>
              <table style="width: 100%; color: #4b5563; line-height: 2;">
                <tr>
                  <td>Email:</td>
                  <td><a href="mailto:training@gennoor.com" style="color: #2563eb;">training@gennoor.com</a></td>
                </tr>
                <tr>
                  <td>Phone:</td>
                  <td><a href="tel:+919326352241" style="color: #2563eb;">+91 9326352241</a></td>
                </tr>
                <tr>
                  <td>WhatsApp:</td>
                  <td><a href="https://wa.me/919326352241" style="color: #2563eb;">+91 9326352241</a></td>
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

          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr style="background: ${leadScore === 'HOT' ? '#fee2e2' : leadScore === 'WARM' ? '#fef3c7' : '#f1f5f9'};">
              <td colspan="2" style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">Lead Score: ${leadScore}</td>
            </tr>
            <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600;">Name</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${name}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600;">Email</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${email}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600;">Phone</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${phone}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600;">Company</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${company || 'Not provided'}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600;">Designation</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${designation || 'Not provided'}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600;">Certification</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${selectedCertification}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600;">Other Interests</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${certifications?.join(', ') || 'None'}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600;">Current Level</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${currentLevel}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600;">Target Date</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${targetDate}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600;">Training Mode</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${trainingMode}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600;">Message</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${message || 'N/A'}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600;">Timestamp</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${timestamp}</td></tr>
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
