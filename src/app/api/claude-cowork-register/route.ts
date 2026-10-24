import { coworkHtml } from '@/lib/email-templates'
import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { sendEmail } from '@/lib/email-service'
import { saveEnquiry } from '@/lib/azure-storage'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import { escapeHtml } from '@/lib/escape-html'

export async function POST(request: Request) {
  try {
    const ip = clientIp(request.headers)
    if (!rateLimit(`claude-cowork-register:${ip}`, 5, 10 * 60_000)) {
      return NextResponse.json({ error: 'Too many requests. Please try again in a few minutes.' }, { status: 429 })
    }
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

    const userEmailHtml = coworkHtml({ name: fullName, timeZone })

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
      from: process.env.EMAIL_FROM_INFO || 'info@gennoor.com',
      fromName: 'Gennoor Tech — Claude Cowork',
      subject: "You're in — Claude Cowork Workshop confirmation",
      html: userEmailHtml,
      attachments: pdfAttachment ? [pdfAttachment] : undefined,
    })

    const adminEmailHtml = `
      <h2>New Claude Cowork Registration</h2>
      <table role="presentation" border="1" cellpadding="8" style="border-collapse: collapse; font-family: Arial, sans-serif;">
        <tr style="background: #FFD23F;"><td colspan="2"><strong>Claude Cowork Workshop Registration</strong></td></tr>
        <tr><td><strong>Name:</strong></td><td>${escapeHtml(fullName)}</td></tr>
        <tr><td><strong>Email:</strong></td><td>${escapeHtml(email)}</td></tr>
        <tr><td><strong>Country:</strong></td><td>${escapeHtml(country)}</td></tr>
        <tr><td><strong>Time Zone:</strong></td><td>${escapeHtml(timeZone)}</td></tr>
        <tr><td><strong>Role/Title:</strong></td><td>${escapeHtml(role) || 'Not provided'}</td></tr>
        <tr><td><strong>Company:</strong></td><td>${escapeHtml(company) || 'Not provided'}</td></tr>
        <tr><td><strong>Biggest Workflow:</strong></td><td>${escapeHtml(biggestWorkflow) || 'Not provided'}</td></tr>
      </table>
    `

    await sendEmail({
      to: process.env.EMAIL_ADMIN || 'admin@gennoor.com',
      from: process.env.EMAIL_FROM_INFO || 'info@gennoor.com',
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
