import { EmailClient, KnownEmailSendStatus } from '@azure/communication-email'
import { readFile } from 'fs/promises'
import path from 'path'
import { downloadPdfFromBlob, saveEmailLog } from '@/lib/azure-storage'
import { ConfidentialClientApplication } from '@azure/msal-node'
import { Client } from '@microsoft/microsoft-graph-client'

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
    contentType?: string
  }>
}

function toAddressList(emails: string | string[]): Array<{ address: string; displayName?: string }> {
  const list = Array.isArray(emails) ? emails : [emails]
  return list.map((email) => ({ address: email.trim() }))
}

async function saveToOutlookSentItems(config: EmailConfig) {
  const tenantId = process.env.MS_GRAPH_TENANT_ID
  const clientId = process.env.MS_GRAPH_CLIENT_ID
  const clientSecret = process.env.MS_GRAPH_CLIENT_SECRET
  const senderMailbox = process.env.OUTLOOK_SENDER_MAILBOX || config.from

  if (!tenantId || !clientId || !clientSecret) return

  try {
    const cca = new ConfidentialClientApplication({
      auth: { clientId, authority: `https://login.microsoftonline.com/${tenantId}`, clientSecret },
    })

    const tokenResponse = await cca.acquireTokenByClientCredential({
      scopes: ['https://graph.microsoft.com/.default'],
    })

    if (!tokenResponse?.accessToken) return

    const graphClient = Client.init({
      authProvider: (done) => done(null, tokenResponse.accessToken),
    })

    const recipients = Array.isArray(config.to) ? config.to : [config.to]
    const toRecipients = recipients.map((email) => ({
      emailAddress: { address: email.trim() },
    }))

    const ccRecipients = config.cc
      ? (Array.isArray(config.cc) ? config.cc : [config.cc]).map((email) => ({
          emailAddress: { address: email.trim() },
        }))
      : []

    const mailMessage: any = {
      subject: config.subject,
      body: { contentType: 'HTML', content: config.html },
      toRecipients,
      ccRecipients,
    }

    if (config.attachments && config.attachments.length > 0) {
      mailMessage.attachments = config.attachments
        .filter((a) => a.content)
        .map((a) => ({
          '@odata.type': '#microsoft.graph.fileAttachment',
          name: a.filename,
          contentType: a.contentType || 'application/octet-stream',
          contentBytes: Buffer.isBuffer(a.content)
            ? a.content.toString('base64')
            : Buffer.from(a.content as string).toString('base64'),
        }))
    }

    await graphClient
      .api(`/users/${senderMailbox}/messages`)
      .post(mailMessage)
      .then(async (draft: any) => {
        await graphClient.api(`/users/${senderMailbox}/messages/${draft.id}/move`).post({
          destinationId: 'SentItems',
        })
      })
  } catch (error) {
    console.error('Failed to save to Outlook Sent Items:', error)
  }
}

export async function sendEmail(config: EmailConfig) {
  const connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING

  if (!connectionString) {
    throw new Error('AZURE_COMMUNICATION_CONNECTION_STRING is not configured')
  }

  try {
    const client = new EmailClient(connectionString)

    const message: any = {
      senderAddress: config.from,
      content: {
        subject: config.subject,
        html: config.html,
      },
      recipients: {
        to: toAddressList(config.to),
      },
    }

    if (config.cc) {
      message.recipients.cc = toAddressList(config.cc)
    }
    if (config.bcc) {
      message.recipients.bcc = toAddressList(config.bcc)
    }

    if (config.attachments && config.attachments.length > 0) {
      message.attachments = config.attachments
        .filter((a) => a.content)
        .map((a) => ({
          name: a.filename,
          contentType: a.contentType || 'application/octet-stream',
          contentInBase64: Buffer.isBuffer(a.content)
            ? a.content.toString('base64')
            : Buffer.from(a.content as string).toString('base64'),
        }))
    }

    const poller = await client.beginSend(message)
    const result = await poller.pollUntilDone()

    const recipients = Array.isArray(config.to) ? config.to : [config.to]

    if (result.status === KnownEmailSendStatus.Succeeded) {
      console.log('Email sent via Azure Communication Services to:', recipients.join(', '))
      for (const recipient of recipients) {
        saveEmailLog({ to: recipient, from: config.from, subject: config.subject, status: 'sent', messageId: result.id }).catch((err) => console.error('Email log save failed:', err))
      }
      saveToOutlookSentItems(config).catch((err) =>
        console.error('Outlook Sent Items save failed:', err)
      )
      return {
        success: true,
        messageId: result.id,
      }
    } else {
      for (const recipient of recipients) {
        saveEmailLog({ to: recipient, from: config.from, subject: config.subject, status: 'failed', error: `Status: ${result.status}` }).catch((err) => console.error('Email log save failed:', err))
      }
      throw new Error(`Email send failed with status: ${result.status}`)
    }
  } catch (error) {
    console.error('Email sending failed:', error)
    const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred'
    const recipients = Array.isArray(config.to) ? config.to : [config.to]
    for (const recipient of recipients) {
      saveEmailLog({ to: recipient, from: config.from, subject: config.subject, status: 'failed', error: errorMsg }).catch((err) => console.error('Email log save failed:', err))
    }
    return {
      success: false,
      error: errorMsg,
    }
  }
}

export async function attachPDF(filename: string, filepath: string) {
  try {
    if (process.env.AZURE_STORAGE_CONNECTION_STRING) {
      let blobPath = filepath
      if (filepath.includes('Gennoor-Bootcamp-Brochures')) {
        blobPath = `bootcamp-brochures/${path.basename(filepath)}`
      } else if (filepath.includes('Gennoor-Tech-Course-TOCs')) {
        blobPath = `course-tocs/${path.basename(filepath)}`
      } else if (filepath.includes('certificates')) {
        blobPath = `certificates/${path.basename(filepath)}`
      }

      const content = await downloadPdfFromBlob(blobPath)
      if (content) {
        return { filename, content, contentType: 'application/pdf' }
      }
    }

    const fullPath = path.join(process.cwd(), filepath)
    const content = await readFile(fullPath)
    return { filename, content, contentType: 'application/pdf' }
  } catch (error) {
    console.error(`Failed to attach PDF ${filename}:`, error)
    return null
  }
}

// The master catalog workbook, attached to enquiry confirmations and the academy
// welcome email. Lives in public/ so it ships with the deployment.
export async function catalogExcelAttachment() {
  try {
    const fullPath = path.join(process.cwd(), 'public', 'Gennoor-Tech-Catalog', 'Gennoor-Tech-Catalog.xlsx')
    const content = await readFile(fullPath)
    return {
      filename: 'Gennoor-Tech-Catalog.xlsx',
      content,
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }
  } catch (error) {
    console.error('Failed to attach catalog Excel:', error)
    return null
  }
}

// Welcome email sent once, on a learner's first Academy sign-in. Carries the catalog.
export async function sendAcademyWelcomeEmail(data: { name: string; email: string }) {
  const firstName = (data.name || 'there').trim().split(/\s+/)[0] || 'there'
  const catalog = await catalogExcelAttachment()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gennoor.com'
  const html = `
    <div style="font-family:'Segoe UI',Arial,sans-serif;background:#f1f5f9;padding:24px 12px;margin:0">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e2e8f0">
        <div style="background:#0C1426;padding:30px 28px;text-align:center">
          <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:800">Gennoor Tech</h1>
          <p style="color:#93b4ff;margin:6px 0 0;font-size:12px;letter-spacing:2px">TRAIN. INNOVATE. BUILD.</p>
        </div>
        <div style="padding:32px 28px;color:#374151;font-size:15px;line-height:1.7">
          <h2 style="color:#0f172a;margin:0 0 12px;font-size:20px">Welcome to Gennoor AI Academy, ${firstName} 🎓</h2>
          <p style="margin:0 0 16px">You're in. You now have free, self-paced access to our full course library — interactive lessons, videos, and readings across foundations, function, leadership, industry, builder, and applied tracks.</p>
          <div style="background:#f8fafc;border-left:4px solid #2563EB;padding:16px 18px;border-radius:0 8px 8px 0;margin:0 0 20px">
            <p style="margin:0;color:#334155"><strong>Attached:</strong> our full catalog (Excel) — every course, PoC blueprint, and free resource in one place.</p>
          </div>
          <div style="text-align:center;margin:24px 0">
            <a href="${siteUrl}/academy" style="display:inline-block;background:#2563EB;color:#ffffff;text-decoration:none;padding:13px 34px;border-radius:9px;font-size:15px;font-weight:700">Start learning</a>
          </div>
          <p style="margin:0;color:#64748b;font-size:13px">Want something tailored for your team? Reach us at
            <a href="mailto:admin@gennoor.com" style="color:#2563EB">admin@gennoor.com</a> or +91 9326352241.</p>
        </div>
        <div style="background:#0C1426;padding:18px 28px;text-align:center">
          <p style="color:#94a3b8;margin:0;font-size:11px">
            <a href="mailto:admin@gennoor.com" style="color:#93b4ff;text-decoration:none">admin@gennoor.com</a> ·
            <a href="${siteUrl}" style="color:#93b4ff;text-decoration:none">www.gennoor.com</a></p>
        </div>
      </div>
    </div>`
  return sendEmail({
    to: data.email,
    from: process.env.EMAIL_FROM_INFO || 'info@gennoor.com',
    fromName: 'Gennoor AI Academy',
    subject: 'Welcome to Gennoor AI Academy 🎓',
    html,
    attachments: catalog ? [catalog] : undefined,
  })
}

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
  const leadScore = data.timeline === 'immediate' || data.timeline === '1-month'
    ? 'HOT'
    : data.timeline === '2-months'
    ? 'WARM'
    : 'COLD'

  const attachmentFilename = `${data.programTitle.replace(/[^a-z0-9]/gi, '_')}_Details.pdf`
  const attachment = await attachPDF(
    attachmentFilename,
    data.requestedFile
  )

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
            <strong>Special Offer:</strong> Book your training early and receive:
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
              <td style="padding: 5px 0;">Email:</td>
              <td><a href="mailto:training@gennoor.com" style="color: #667eea;">training@gennoor.com</a></td>
            </tr>
            <tr>
              <td style="padding: 5px 0;">WhatsApp:</td>
              <td><a href="https://wa.me/919326352241" style="color: #667eea;">+91 9326352241</a></td>
            </tr>
            <tr>
              <td style="padding: 5px 0;">Website:</td>
              <td><a href="https://www.gennoor.com" style="color: #667eea;">www.gennoor.com</a></td>
            </tr>
          </table>
        </div>
      </div>

      <div style="background: #2c3e50; padding: 30px; text-align: center; border-radius: 0 0 10px 10px;">
        <p style="color: #ecf0f1; margin: 0; font-size: 14px;">
          &copy; ${new Date().getFullYear()} Gennoor Tech. All rights reserved.
        </p>
        <p style="color: #95a5a6; margin: 10px 0 0; font-size: 13px;">
          Empowering Organizations with AI Excellence
        </p>
      </div>
    </div>
  `

  const catalog = await catalogExcelAttachment()
  const trainingAttachments = [attachment, catalog].filter(
    (a): a is { filename: string; content: Buffer; contentType: string } => Boolean(a),
  )
  await sendEmail({
    to: data.email,
    cc: process.env.CC_SALES_ON_TRAINING === 'true' ? [process.env.EMAIL_ADMIN || 'admin@gennoor.com'] : undefined,
    from: process.env.EMAIL_FROM_TRAINING || 'training@gennoor.com',
    fromName: 'Gennoor Tech Training',
    subject: `${data.programType === 'bootcamp' ? 'Bootcamp' : 'Course'} Details: ${data.programTitle} | Gennoor Tech`,
    html: userEmailHtml,
    attachments: trainingAttachments.length ? trainingAttachments : undefined,
  })

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
    cc: [process.env.EMAIL_ADMIN || 'admin@gennoor.com'],
    from: process.env.EMAIL_FROM_TRAINING || 'training@gennoor.com',
    fromName: 'Training System',
    subject: `[${leadScore}] New Training Enquiry - ${data.programTitle}`,
    html: adminEmailHtml,
  })
}

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
  // Placeholder — implement certification-specific email template as needed
}
