import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { sendEmail } from '@/lib/email-service'
import { saveEnquiry } from '@/lib/azure-storage'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      fullName,
      email,
      country,
      timeZone,
      role,
      company,
      biggestWorkflow,
    } = body

    if (!fullName || !email || !country || !timeZone) {
      return NextResponse.json(
        { success: false, message: 'Please fill in all required fields.' },
        { status: 400 }
      )
    }

    await saveEnquiry('ClaudeCoworkRegistration', {
      fullName,
      email,
      country,
      timeZone,
      role: role || '',
      company: company || '',
      biggestWorkflow: biggestWorkflow || '',
    })

    const userEmailHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1B2845; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <div style="display: inline-block; background: #FFD23F; color: #1B2845; font-weight: 900; font-size: 14px; padding: 8px 18px; border-radius: 50px; margin-bottom: 16px;">100% FREE</div>
          <h1 style="color: white; margin: 0; font-size: 26px; font-weight: 800;">You're In — Claude Cowork Workshop</h1>
          <p style="color: #FFD23F; margin: 10px 0 0; font-size: 14px; letter-spacing: 2px;">GENNOOR PRESENTS</p>
        </div>

        <div style="padding: 40px 30px; background: #ffffff; border: 1px solid #e0e0e0; border-top: none;">
          <h2 style="color: #1B2845; margin-top: 0; font-size: 22px;">Hi ${fullName.split(' ')[0]},</h2>

          <p style="color: #5C6784; line-height: 1.8; font-size: 16px;">
            You're confirmed for the free <strong>Claude Cowork Workshop</strong>. Here's what to expect:
          </p>

          <div style="background: #FFF8F0; border-left: 4px solid #FF6B35; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
            <table style="width: 100%; color: #1B2845; font-size: 15px;">
              <tr>
                <td style="padding: 8px 0; font-weight: 700;">When:</td>
                <td style="padding: 8px 0;">8 hours in your local time zone (${timeZone}) — schedule details sent separately</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 700;">Where:</td>
                <td style="padding: 8px 0;">Online — joining link will arrive 24 hours before the session</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 700;">What to bring:</td>
                <td style="padding: 8px 0;">Claude desktop app installed, Cowork mode enabled, Chrome browser, your laptop fully charged</td>
              </tr>
            </table>
          </div>

          <p style="color: #5C6784; line-height: 1.8; font-size: 15px;">
            30 minutes before we start, we'll email you the join link, the working folder, and a 5-minute warm-up.
          </p>

          <h3 style="color: #1B2845; margin-top: 30px; font-size: 18px;">What you'll build in 8 hours:</h3>
          <ul style="color: #5C6784; line-height: 2.2; font-size: 15px; padding-left: 20px;">
            <li>A weekly Friday digest that writes itself</li>
            <li>A 1:1 prep packet ready every morning</li>
            <li>Vendor + contract reviews in 10 minutes</li>
            <li>A board-ready stakeholder report on demand</li>
            <li>Your team's personalized rollout playbook</li>
          </ul>

          <div style="background: #FFD23F; border-radius: 10px; padding: 20px; margin: 30px 0; text-align: center;">
            <p style="color: #1B2845; margin: 0; font-size: 16px; font-weight: 700;">
              Two things to do today:
            </p>
            <ol style="color: #1B2845; text-align: left; margin: 12px 0 0; padding-left: 24px; font-size: 15px; line-height: 2;">
              <li>Keep an eye on your inbox for the joining link (arriving 24h before)</li>
              <li>Forward this email to one colleague who could also use a free 5-hours-a-week boost</li>
            </ol>
          </div>

          <p style="color: #5C6784; line-height: 1.8; font-size: 15px;">
            Questions? Reply to this email — we read every one.
          </p>

          <p style="color: #1B2845; font-weight: 700; font-size: 15px; margin-top: 30px;">
            Welcome aboard,<br />
            <span style="font-weight: 400; color: #5C6784;">The Gennoor Team</span><br />
            <a href="https://gennoor.com/claude-cowork" style="color: #FF6B35; text-decoration: none;">gennoor.com/claude-cowork</a>
          </p>
        </div>

        <div style="background: #1B2845; padding: 24px; text-align: center; border-radius: 0 0 10px 10px;">
          <p style="color: #5C6784; margin: 0; font-size: 13px;">
            © ${new Date().getFullYear()} Gennoor Tech. All rights reserved.
          </p>
          <p style="color: #FFD23F; margin: 8px 0 0; font-size: 12px;">
            100% free · No upsell · Open to anyone, anywhere
          </p>
        </div>
      </div>
    `

    let pdfAttachment: { filename: string; content: Buffer; contentType: string } | undefined
    try {
      const pdfPath = path.join(process.cwd(), 'public', 'assets', 'Claude_Cowork_Workshop_Flyer.pdf')
      const pdfBuffer = await readFile(pdfPath)
      pdfAttachment = { filename: 'Claude_Cowork_Workshop_Flyer.pdf', content: pdfBuffer, contentType: 'application/pdf' }
    } catch {
      // PDF not found — send without attachment
    }

    await sendEmail({
      to: email,
      from: process.env.M365_SENDER_EMAIL || 'admin@gennoor.com',
      fromName: 'Gennoor Tech — Claude Cowork',
      subject: "You're in — Claude Cowork Workshop confirmation",
      html: userEmailHtml,
      attachments: pdfAttachment ? [pdfAttachment] : undefined,
    })

    const adminEmailHtml = `
      <h2>New Claude Cowork Registration</h2>
      <table border="1" cellpadding="8" style="border-collapse: collapse; font-family: Arial, sans-serif;">
        <tr style="background: #FFD23F;"><td colspan="2"><strong>Claude Cowork Workshop Registration</strong></td></tr>
        <tr><td><strong>Name:</strong></td><td>${fullName}</td></tr>
        <tr><td><strong>Email:</strong></td><td>${email}</td></tr>
        <tr><td><strong>Country:</strong></td><td>${country}</td></tr>
        <tr><td><strong>Time Zone:</strong></td><td>${timeZone}</td></tr>
        <tr><td><strong>Role/Title:</strong></td><td>${role || 'Not provided'}</td></tr>
        <tr><td><strong>Company:</strong></td><td>${company || 'Not provided'}</td></tr>
        <tr><td><strong>Biggest Workflow:</strong></td><td>${biggestWorkflow || 'Not provided'}</td></tr>
      </table>
    `

    await sendEmail({
      to: process.env.EMAIL_ADMIN || 'admin@gennoor.com',
      from: process.env.M365_SENDER_EMAIL || 'admin@gennoor.com',
      fromName: 'Cowork Registration System',
      subject: `New Claude Cowork Registration — ${fullName}`,
      html: adminEmailHtml,
    })

    return NextResponse.json({
      success: true,
      message: 'Registration successful! Check your email for confirmation.',
    })
  } catch (error) {
    console.error('Error processing Claude Cowork registration:', error)
    return NextResponse.json(
      { success: false, message: 'Registration failed. Please try again or email admin@gennoor.com.' },
      { status: 500 }
    )
  }
}
