import nodemailer from 'nodemailer'
import { readFile } from 'fs/promises'
import path from 'path'

// Email configuration interface
interface EmailConfig {
  to: string | string[]
  cc?: string | string[]
  bcc?: string | string[]
  from: string
  fromName?: string
  subject: string
  html: string
  attachments?: Array<{
    filename: string
    path?: string
    content?: Buffer | string
  }>
}

// Create reusable transporter
const createTransporter = () => {
  // Option 1: Using Hostinger SMTP
  if (process.env.SMTP_HOST) {
    const port = parseInt(process.env.SMTP_PORT || '587')
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: port,
      secure: port === 465, // true for 465 (SSL), false for 587 (STARTTLS)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false
      }
    })
  }

  // Option 2: Using SendGrid SMTP (if you prefer SendGrid)
  if (process.env.SENDGRID_API_KEY) {
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    })
  }

  throw new Error('No email service configured. Please set SMTP or SendGrid credentials.')
}

// Send email function
export async function sendEmail(config: EmailConfig) {
  try {
    const transporter = createTransporter()

    // Prepare email options
    const mailOptions = {
      from: config.fromName
        ? `"${config.fromName}" <${config.from}>`
        : config.from,
      to: Array.isArray(config.to) ? config.to.join(', ') : config.to,
      cc: config.cc ? (Array.isArray(config.cc) ? config.cc.join(', ') : config.cc) : undefined,
      bcc: config.bcc ? (Array.isArray(config.bcc) ? config.bcc.join(', ') : config.bcc) : undefined,
      subject: config.subject,
      html: config.html,
      attachments: config.attachments,
    }

    // Send email
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent:', info.messageId)

    return {
      success: true,
      messageId: info.messageId,
    }
  } catch (error) {
    console.error('Email sending failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

// Helper function to attach PDF
export async function attachPDF(filename: string, filepath: string) {
  try {
    const fullPath = path.join(process.cwd(), filepath)
    const content = await readFile(fullPath)

    return {
      filename,
      content,
      contentType: 'application/pdf',
    }
  } catch (error) {
    console.error(`Failed to attach PDF ${filename}:`, error)
    return null
  }
}

// Send training enquiry email
export async function sendTrainingEnquiryEmail(data: {
  name: string
  email: string
  phone: string
  company: string
  designation: string
  trainingFor: string
  teamSize?: string
  timeline: string
  message?: string
  programTitle: string
  programType: string
  requestedFile: string
}) {
  // Determine lead score
  const leadScore = data.timeline === 'immediate' || data.timeline === '1-month'
    ? 'HOT'
    : data.timeline === '2-months'
    ? 'WARM'
    : 'COLD'

  // Prepare attachment (PDF file)
  const attachmentFilename = `${data.programTitle.replace(/[^a-z0-9]/gi, '_')}_Details.pdf`
  const attachment = await attachPDF(
    attachmentFilename,
    data.requestedFile // Already a PDF path
  )

  // Send email to user
  const userEmailHtml = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Gennoor Tech</h1>
        <p style="color: white; margin: 10px 0 0; font-size: 16px;">AI Training & Consulting Excellence</p>
      </div>

      <div style="padding: 40px 30px; background: #ffffff; border: 1px solid #e0e0e0; border-top: none;">
        <h2 style="color: #333; margin-top: 0; font-size: 24px;">Dear ${data.name},</h2>

        <p style="color: #555; line-height: 1.8; font-size: 16px;">
          Thank you for your interest in our <strong>${data.programTitle}</strong> ${data.programType}.
        </p>

        <div style="background: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 25px 0; border-radius: 5px;">
          <p style="color: #555; margin: 0; line-height: 1.8;">
            We've attached the detailed ${data.programType} PDF including curriculum,
            learning objectives, and delivery format. This comprehensive outline will help you understand
            how our training can accelerate your team's AI journey.
          </p>
        </div>

        <h3 style="color: #333; margin-top: 30px;">What's Included:</h3>
        <ul style="color: #555; line-height: 2;">
          <li>Complete curriculum breakdown</li>
          <li>Learning objectives and outcomes</li>
          <li>Hands-on labs and projects</li>
          <li>Certification preparation (if applicable)</li>
          <li>Post-training support details</li>
        </ul>

        <h3 style="color: #333; margin-top: 30px;">Your Training Requirements:</h3>
        <div style="background: #ffffff; border: 1px solid #e0e0e0; padding: 20px; border-radius: 5px;">
          <table style="width: 100%; color: #555;">
            <tr><td style="padding: 5px 0;"><strong>Organization:</strong></td><td>${data.company}</td></tr>
            <tr><td style="padding: 5px 0;"><strong>Training For:</strong></td><td>${data.trainingFor === 'team' ? `Team (${data.teamSize} members)` : data.trainingFor}</td></tr>
            <tr><td style="padding: 5px 0;"><strong>Timeline:</strong></td><td>${data.timeline}</td></tr>
            ${data.message ? `<tr><td style="padding: 5px 0; vertical-align: top;"><strong>Special Requirements:</strong></td><td>${data.message}</td></tr>` : ''}
          </table>
        </div>

        <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 20px; margin: 30px 0;">
          <p style="color: #856404; margin: 0; font-size: 16px;">
            <strong>🎯 Special Offer:</strong> Book your training early and receive:
          </p>
          <ul style="color: #856404; margin: 10px 0 0; padding-left: 20px;">
            <li>Early bird discount</li>
            <li>Free certification voucher for one participant</li>
            <li>Extended post-training support</li>
          </ul>
        </div>

        <h3 style="color: #333; margin-top: 30px;">Next Steps:</h3>
        <ol style="color: #555; line-height: 2;">
          <li>Review the attached ${data.programType} details</li>
          <li>Our training specialist will contact you soon</li>
          <li>Schedule a free consultation call to discuss customization</li>
          <li>Receive a tailored proposal with pricing options</li>
        </ol>

        <div style="text-align: center; margin: 40px 0;">
          <a href="mailto:training@gennoor.com?subject=Schedule%20Consultation%20-%20${encodeURIComponent(data.programTitle)}"
             style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px;">
            Schedule Free Consultation
          </a>
        </div>

        <div style="border-top: 2px solid #e0e0e0; padding-top: 30px; margin-top: 40px;">
          <h4 style="color: #333; margin-bottom: 15px;">Get in Touch:</h4>
          <table style="width: 100%; color: #555; line-height: 1.8;">
            <tr>
              <td style="padding: 5px 0;">📧 Email:</td>
              <td><a href="mailto:training@gennoor.com" style="color: #667eea;">training@gennoor.com</a></td>
            </tr>
            <tr>
              <td style="padding: 5px 0;">📱 Phone:</td>
              <td><a href="tel:+919819358703" style="color: #667eea;">+91 9819358703</a></td>
            </tr>
            <tr>
              <td style="padding: 5px 0;">💬 WhatsApp:</td>
              <td><a href="https://wa.me/919819358703" style="color: #667eea;">+91 9819358703</a></td>
            </tr>
            <tr>
              <td style="padding: 5px 0;">🌐 Website:</td>
              <td><a href="https://www.gennoor.com" style="color: #667eea;">www.gennoor.com</a></td>
            </tr>
          </table>
        </div>
      </div>

      <div style="background: #2c3e50; padding: 30px; text-align: center; border-radius: 0 0 10px 10px;">
        <p style="color: #ecf0f1; margin: 0; font-size: 14px;">
          © 2024 Gennoor Tech. All rights reserved.
        </p>
        <p style="color: #95a5a6; margin: 10px 0 0; font-size: 13px;">
          Empowering Organizations with AI Excellence
        </p>
        <div style="margin-top: 20px;">
          <a href="https://linkedin.com/company/gennoor-tech" style="color: #3498db; margin: 0 10px;">LinkedIn</a>
          <a href="https://twitter.com/gennoor_tech" style="color: #3498db; margin: 0 10px;">Twitter</a>
          <a href="https://youtube.com/@gennoor-tech" style="color: #3498db; margin: 0 10px;">YouTube</a>
        </div>
      </div>
    </div>
  `

  await sendEmail({
    to: data.email,
    cc: process.env.CC_SALES_ON_TRAINING === 'true' ? [process.env.EMAIL_FROM_SALES || 'sales@gennoor.com'] : undefined,
    from: process.env.SMTP_USER || 'jalalkhan@gennoor.com', // Use authenticated SMTP user as sender
    fromName: 'Gennoor Tech Training',
    subject: `${data.programType === 'bootcamp' ? '🚀 Bootcamp' : '📚 Course'} Details: ${data.programTitle} | Gennoor Tech`,
    html: userEmailHtml,
    attachments: attachment ? [attachment] : undefined,
  })

  // Send admin notification
  const adminEmailHtml = `
    <h2>[${leadScore}] New Training Enquiry - ${data.programTitle}</h2>
    <table border="1" cellpadding="8" style="border-collapse: collapse;">
      <tr style="background: ${leadScore === 'HOT' ? '#ffcccc' : leadScore === 'WARM' ? '#ffffcc' : '#cccccc'};">
        <td colspan="2"><strong>Lead Score: ${leadScore}</strong></td>
      </tr>
      <tr><td><strong>Program:</strong></td><td>${data.programTitle} (${data.programType})</td></tr>
      <tr><td><strong>Name:</strong></td><td>${data.name}</td></tr>
      <tr><td><strong>Email:</strong></td><td>${data.email}</td></tr>
      <tr><td><strong>Phone:</strong></td><td>${data.phone}</td></tr>
      <tr><td><strong>Company:</strong></td><td>${data.company}</td></tr>
      <tr><td><strong>Designation:</strong></td><td>${data.designation}</td></tr>
      <tr><td><strong>Training For:</strong></td><td>${data.trainingFor}${data.teamSize ? ` (${data.teamSize})` : ''}</td></tr>
      <tr><td><strong>Timeline:</strong></td><td>${data.timeline}</td></tr>
      <tr><td><strong>Message:</strong></td><td>${data.message || 'None'}</td></tr>
    </table>
    <h3>Recommended Actions:</h3>
    <ol>
      <li>${leadScore === 'HOT' ? 'Priority follow-up - high conversion probability' : leadScore === 'WARM' ? 'Schedule follow-up call' : 'Add to nurture campaign'}</li>
      <li>Send calendar invite for consultation</li>
      <li>Prepare customized proposal</li>
      <li>${data.trainingFor === 'organization' ? 'Schedule team assessment call' : 'Send individual learning path'}</li>
    </ol>
  `

  await sendEmail({
    to: process.env.EMAIL_ADMIN || 'admin@gennoor.com',
    cc: [process.env.EMAIL_FROM_SALES || 'sales@gennoor.com', process.env.EMAIL_FROM_TRAINING || 'training@gennoor.com'],
    from: process.env.SMTP_USER || 'jalalkhan@gennoor.com', // Use authenticated SMTP user
    fromName: 'Training System',
    subject: `[${leadScore}] New Training Enquiry - ${data.programTitle}`,
    html: adminEmailHtml,
  })
}

// Send certification enquiry email
export async function sendCertificationEnquiryEmail(data: {
  name: string
  email: string
  phone: string
  company?: string
  designation?: string
  certifications: string[]
  currentLevel: string
  targetDate: string
  trainingMode: string
  message?: string
  selectedCertification: string
}) {
  // Determine lead score
  const leadScore = data.targetDate === '1-month'
    ? 'HOT'
    : data.targetDate === '2-months'
    ? 'WARM'
    : 'COLD'

  // User email content (similar structure to training email)
  // ... (implement certification specific email template)

  // Admin notification
  // ... (implement admin notification)
}