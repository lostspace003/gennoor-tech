import { welcomeEmailHtml, trainingConfirmationHtml } from '@/lib/email-templates'
import { EmailClient, KnownEmailSendStatus } from '@azure/communication-email'
import { readFile } from 'fs/promises'
import path from 'path'
import { downloadPdfFromBlob, saveEmailLog } from '@/lib/azure-storage'
import { escapeHtml } from '@/lib/escape-html'
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
  /**
   * Plain-text alternative. Omit and one is derived from `html` — every major
   * spam filter penalises HTML-only mail, and text-only clients/screen readers
   * need it. Pass explicitly when the derived version would read badly.
   */
  text?: string
  /**
   * One-click unsubscribe target for marketing mail. Adds List-Unsubscribe and
   * List-Unsubscribe-Post headers (RFC 8058), which Gmail and Outlook expect
   * from bulk senders. Never set this on transactional mail such as OTP codes
   * or certificates — recipients must not be able to opt out of those.
   */
  unsubscribeUrl?: string
  attachments?: Array<{
    filename: string
    path?: string
    content?: Buffer | string
    contentType?: string
  }>
}

/**
 * Derive a readable plain-text body from an HTML email.
 *
 * Deliberately simple: strips head-ish elements entirely, turns block edges
 * into newlines, keeps link targets alongside their text, then collapses the
 * runs of whitespace that HTML templates inevitably leave behind.
 */
export function htmlToPlainText(html: string): string {
  return html
    // Drop anything whose text content is not body copy.
    .replace(/<(style|script|head|title)[\s\S]*?<\/\1>/gi, '')
    // Hidden preheader divs would otherwise duplicate the opening line.
    .replace(/<div[^>]*display:\s*none[\s\S]*?<\/div>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|tr|h[1-6]|li|table|section)>/gi, '\n')
    .replace(/<li[^>]*>/gi, '  - ')
    .replace(/<\/td>\s*<td[^>]*>/gi, ': ')
    // Keep the destination of a link, not just its label.
    .replace(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_m, href, label) => {
      const text = String(label).replace(/<[^>]+>/g, '').trim()
      const url = String(href).trim()
      if (!url || url.startsWith('#')) return text
      if (url.startsWith('mailto:')) return text || url.slice(7)
      return text && text !== url ? `${text} (${url})` : url
    })
    .replace(/<[^>]+>/g, '')
    // Entities that survive tag stripping. Named set first, then any numeric
    // entity, so typographic characters (&mdash; &rsquo; &hellip;) don't leak
    // through as literal text.
    .replace(/&nbsp;/g, ' ')
    .replace(/&(mdash|ndash);/g, '—')
    .replace(/&(lsquo|rsquo|apos);/g, "'")
    .replace(/&(ldquo|rdquo);/g, '"')
    .replace(/&hellip;/g, '…')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_m, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_m, code) => String.fromCharCode(parseInt(code, 16)))
    // &amp; last so a double-escaped entity doesn't resurrect as markup.
    .replace(/&amp;/g, '&')
    // A label cell ending in ':' plus the ': ' row separator yields '::'.
    .replace(/:\s*:/g, ':')
    // Whitespace cleanup — templates leave heavy indentation behind.
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
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
        // Always ship multipart — HTML-only mail is a spam signal and is
        // unreadable in text-only clients and screen readers.
        plainText: config.text || htmlToPlainText(config.html),
      },
      recipients: {
        to: toAddressList(config.to),
      },
    }

    // RFC 8058 one-click unsubscribe — bulk senders are expected to honour it.
    if (config.unsubscribeUrl) {
      message.headers = {
        ...(message.headers || {}),
        'List-Unsubscribe': `<${config.unsubscribeUrl}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      }
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
  const catalog = await catalogExcelAttachment()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gennoor.com'
  const html = welcomeEmailHtml(data.name, siteUrl)
  return sendEmail({
    to: data.email,
    from: process.env.EMAIL_FROM_INFO || 'info@gennoor.com',
    fromName: 'Gennoor Learning Studio',
    subject: 'Welcome to the Gennoor Learning Studio',
    html,
    attachments: catalog ? [catalog] : undefined,
  })
}

/**
 * Form values arrive as slugs ('1-month', 'immediate', 'team'). Rendering them
 * raw put strings like "Timeline: 1-month" in front of customers.
 */
const TIMELINE_LABELS: Record<string, string> = {
  immediate: 'As soon as possible',
  '1-month': 'Within 1 month',
  '2-months': 'Within 2 months',
  '3-months': 'Within 3 months',
  '6-months': 'Within 6 months',
  exploring: 'Just exploring for now',
  flexible: 'Flexible',
}

const TRAINING_FOR_LABELS: Record<string, string> = {
  self: 'Myself',
  team: 'My team',
  organization: 'The whole organisation',
  organisation: 'The whole organisation',
}

function humanLabel(map: Record<string, string>, value?: string): string {
  const v = String(value || '').trim()
  if (!v) return ''
  return map[v.toLowerCase()] || v
}

/** A table row that disappears entirely when it has no value. */
function optionalRow(label: string, value: string): string {
  if (!value) return ''
  return `<tr><td style="padding:5px 0;"><strong>${label}:</strong></td><td>${value}</td></tr>`
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

  // 'bootcamp' | 'course' — used mid-sentence, so it must never be empty or
  // the copy reads "the detailed  PDF" / "our Program ." with a stray space.
  const programKind = String(data.programType || '').trim() || 'program'
  const timelineLabel = humanLabel(TIMELINE_LABELS, data.timeline)
  const trainingForLabel =
    String(data.trainingFor || '').toLowerCase() === 'team' && data.teamSize
      ? `My team (${escapeHtml(data.teamSize)} people)`
      : humanLabel(TRAINING_FOR_LABELS, data.trainingFor)

  const attachmentFilename = `${data.programTitle.replace(/[^a-z0-9]/gi, '_')}_Details.pdf`
  const attachment = await attachPDF(
    attachmentFilename,
    data.requestedFile
  )

  // User-supplied fields escaped for safe interpolation into HTML templates.
  const safe = {
    name: escapeHtml(data.name),
    email: escapeHtml(data.email),
    phone: escapeHtml(data.phone),
    company: escapeHtml(data.company),
    designation: escapeHtml(data.designation),
    trainingFor: escapeHtml(data.trainingFor),
    teamSize: escapeHtml(data.teamSize),
    timeline: escapeHtml(data.timeline),
    message: escapeHtml(data.message),
    programTitle: escapeHtml(data.programTitle),
    programType: escapeHtml(data.programType),
  }

  const userEmailHtml = trainingConfirmationHtml({
    name: data.name,
    programTitle: data.programTitle,
    programKind,
    company: data.company,
    trainingForLabel,
    timelineLabel,
    message: data.message,
    // An opt-in commercial commitment: set TRAINING_OFFER_ENABLED=true to run it.
    offerText: process.env.TRAINING_OFFER_ENABLED === 'true'
      ? process.env.TRAINING_OFFER_TEXT || 'Ask your training specialist about current early-booking benefits.'
      : undefined,
  })

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
    <h2>[${leadScore}] New Training Enquiry - ${safe.programTitle}</h2>
    <table role="presentation" border="1" cellpadding="8" style="border-collapse: collapse;">
      <tr style="background: ${leadScore === 'HOT' ? '#ffcccc' : leadScore === 'WARM' ? '#ffffcc' : '#cccccc'};">
        <td colspan="2"><strong>Lead Score: ${leadScore}</strong></td>
      </tr>
      <tr><td><strong>Program:</strong></td><td>${safe.programTitle}${data.programType ? ` (${escapeHtml(programKind)})` : ''}</td></tr>
      <tr><td><strong>Name:</strong></td><td>${safe.name}</td></tr>
      <tr><td><strong>Email:</strong></td><td>${safe.email}</td></tr>
      ${optionalRow('Phone', safe.phone)}
      ${optionalRow('Company', safe.company)}
      ${optionalRow('Designation', safe.designation)}
      ${optionalRow('Training for', trainingForLabel)}
      ${optionalRow('Timeline', escapeHtml(timelineLabel))}
      <tr><td><strong>Message:</strong></td><td>${safe.message || 'None'}</td></tr>
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
