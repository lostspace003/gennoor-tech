import { NextResponse } from 'next/server'
import { EmailClient } from '@azure/communication-email'
import { auth } from '@/lib/auth'
import { PDFGenerator } from '@/lib/pdf-generator'

// Use existing Azure Communication Services
const connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING || ''

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Initialize email client inside the function to avoid build-time errors
    const emailClient = connectionString ? new EmailClient(connectionString) : null

    if (!emailClient) {
      console.error('Azure Communication Services not configured')
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
    }

    const { leadIds, content, subject, attachPDF, pdfType } = await request.json()

    // Generate PDF attachment if requested
    let attachments = []
    if (attachPDF && pdfType) {
      const generator = new PDFGenerator()
      const pdfBlob = await generator.generateDeck(pdfType, {
        company: 'Your Organization',
        name: 'Valued Client'
      })

      // Convert to base64 for attachment
      const buffer = await pdfBlob.arrayBuffer()
      attachments.push({
        name: `gennoor-${pdfType}-solutions.pdf`,
        contentType: 'application/pdf',
        contentInBase64: Buffer.from(buffer).toString('base64')
      })
    }

    // Prepare email message
    const emailMessage = {
      senderAddress: 'DoNotReply@gennoor.com', // Your verified domain
      recipients: {
        to: leadIds.map((email: string) => ({ address: email })),
        cc: [{ address: 'admin@gennoor.com' }] // Always CC admin
      },
      content: {
        subject: subject || 'Gennoor Tech - AI Solutions for Your Business',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">Gennoor Tech</h1>
              <p style="color: white; margin: 5px 0;">TRAIN. INNOVATE. BUILD.</p>
            </div>
            <div style="padding: 30px; background: white;">
              ${content || `
                <p>Dear Valued Client,</p>
                <p>Thank you for your interest in Gennoor Tech's AI solutions. Please find attached our customized proposal for your organization.</p>
                <p>We look forward to partnering with you on your AI transformation journey.</p>
                <p>Best regards,<br/>Team Gennoor</p>
              `}
            </div>
            <div style="background: #f8f9fa; padding: 20px; text-align: center;">
              <p style="margin: 5px; color: #666;">Gennoor Tech | AI Transformation Partner</p>
              <p style="margin: 5px; color: #666;">contact@gennoor.com | +91 9326352241</p>
            </div>
          </div>
        `
      },
      attachments: attachments
    }

    // Send email
    const poller = await emailClient.beginSend(emailMessage)
    const result = await poller.pollUntilDone()

    // Log success
    console.log('Email sent successfully:', {
      messageId: result.id,
      status: result.status,
      recipients: leadIds.length,
      hasAttachment: attachments.length > 0
    })

    return NextResponse.json({
      success: true,
      message: `Email sent to ${leadIds.length} leads with CC to admin@gennoor.com`,
      messageId: result.id,
      status: result.status
    })

  } catch (error) {
    console.error('Email send error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}