import { welcomeEmailHtml, trainingConfirmationHtml } from '@/lib/email-templates'
import { EmailClient, KnownEmailSendStatus } from '@azure/communication-email'
import { readFile } from 'fs/promises'
import path from 'path'
import { createHash, createHmac } from 'crypto'
import { downloadPdfFromBlob, saveEmailLog } from '@/lib/azure-storage'
import { allPrograms } from '@/data/training-programs'
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

// One email goes to a few people at most. A form once passed whatever the browser sent as "to": a list of two
// hundred strangers' addresses went out under our name with the visitor's own words in the subject.
const MAX_RECIPIENTS = 25
const ADDRESS = /^[^\s@<>,;:"()\[\]\\]+@[^\s@<>,;:"()\[\]\\]+\.[^\s@<>,;:"()\[\]\\]+$/

function toAddressList(emails: string | string[]): Array<{ address: string; displayName?: string }> {
  const list = Array.isArray(emails) ? emails : [emails]
  if (list.length > MAX_RECIPIENTS) throw new Error(`An email may go to at most ${MAX_RECIPIENTS} addresses`)
  return list.map((email) => {
    const address = typeof email === 'string' ? email.trim() : ''
    if (address.length > 254 || !ADDRESS.test(address)) throw new Error('Not a valid email address')
    return { address }
  })
}

/** A subject is one short line: no line breaks (they can add headers of their own), no runaway length. */
const cleanSubject = (subject: unknown) => String(subject ?? '').replace(/[\r\n\t\u2028\u2029]+/g, ' ').replace(/\s{2,}/g, ' ').trim().slice(0, 250)

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

/**
 * How often we ask Azure "has it gone yet?" after it accepts an email, and how long
 * we wait between asks.
 *
 * Azure allows the whole account only about 200 of these checks an hour (and about
 * 100 sends). An email with an attachment can stay "in progress" for many minutes;
 * checking until it finished once used up the hour's allowance in five minutes,
 * after which Azure refused every email from the site for an hour. So: a couple of
 * checks, then the email is taken as sent. Azure has accepted it by then and
 * delivers it by itself.
 */
const STATUS_CHECKS = 2
const STATUS_CHECK_GAP_MS = 2000

/** Azure's own words for a refused send, turned into something a person can act on. */
function sendProblem(error: unknown): string {
  const e = error as { statusCode?: number; name?: string; message?: string }
  const text = e?.message || 'Unknown error occurred'
  if (e?.statusCode === 429) {
    const seconds = Number(/after (\d+) seconds/.exec(text)?.[1] || 0)
    const wait = seconds ? `in about ${Math.max(1, Math.ceil(seconds / 60))} minutes` : 'later'
    return `Azure's hourly email limit is used up. Nothing was sent. Try again ${wait}.`
  }
  if (e?.name === 'AbortError' || e?.name === 'TimeoutError') return 'The email service did not answer in time. Nothing was sent. Please try again.'
  return text
}

/**
 * The email service's own number for a send. It is known from the moment the service takes the email, long
 * before the send is finished, in the address the service gives for asking about it. Reading it never touches
 * the send itself; if it cannot be read, the send simply has no number (as before 13 November 2026, when a
 * number was kept only for a send that finished within the first seconds).
 */
function sendNumberOf(poller: { getOperationState(): unknown }): string {
  try {
    const state = poller.getOperationState() as { result?: { id?: string }; config?: { operationLocation?: string } }
    return state?.result?.id || /\/operations\/([0-9a-f-]{32,40})/i.exec(String(state?.config?.operationLocation || ''))?.[1] || ''
  } catch {
    return ''
  }
}

/**
 * What became of an email the service took earlier? One question, read only.
 *   'sent'     the service finished it: it has left for the recipient's mail server
 *   'failed'   the service gave up on it
 *   'running'  still in its queue
 *   'unknown'  the question could not be asked or answered just now (ask again later)
 * Azure allows the whole account about 200 of these an hour, sends included, so the caller asks sparingly
 * (see lib/crm/delivery-sync.ts). The service's key is used to sign the question and goes nowhere else.
 */
export async function emailSendState(sendNumber: string): Promise<{ state: 'sent' | 'failed' | 'running' | 'unknown'; error?: string }> {
  const connection = process.env.AZURE_COMMUNICATION_CONNECTION_STRING || ''
  const endpoint = (/endpoint=([^;]+)/i.exec(connection)?.[1] || '').replace(/\/+$/, '')
  const key = /accesskey=([^;]+)/i.exec(connection)?.[1] || ''
  if (!endpoint || !key || !/^[0-9a-f-]{32,40}$/i.test(sendNumber)) return { state: 'unknown' }
  try {
    const url = new URL(`${endpoint}/emails/operations/${sendNumber}?api-version=2023-03-31`)
    const date = new Date().toUTCString()
    const emptyBody = createHash('sha256').update('').digest('base64')
    const signature = createHmac('sha256', Buffer.from(key, 'base64')).update(`GET\n${url.pathname}${url.search}\n${date};${url.host};${emptyBody}`).digest('base64')
    const res = await fetch(url, {
      headers: { 'x-ms-date': date, 'x-ms-content-sha256': emptyBody, Authorization: `HMAC-SHA256 SignedHeaders=x-ms-date;host;x-ms-content-sha256&Signature=${signature}` },
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) return { state: 'unknown' }
    const body = (await res.json()) as { status?: string; error?: { code?: string; message?: string } }
    const status = String(body.status || '').toLowerCase()
    if (status === 'succeeded') return { state: 'sent' }
    if (status === 'failed' || status === 'canceled') return { state: 'failed', error: String(body.error?.message || body.error?.code || '').slice(0, 300) }
    return status ? { state: 'running' } : { state: 'unknown' }
  } catch {
    return { state: 'unknown' }
  }
}

export async function sendEmail(config: EmailConfig) {
  const connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING

  if (!connectionString) {
    throw new Error('AZURE_COMMUNICATION_CONNECTION_STRING is not configured')
  }

  try {
    // No automatic retries: when Azure says "wait an hour", the library would wait
    // the hour with the request hanging. We would rather hear the refusal at once.
    const client = new EmailClient(connectionString, { retryOptions: { maxRetries: 0 } })

    const message: any = {
      senderAddress: config.from,
      content: {
        subject: cleanSubject(config.subject),
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

    // Returns once Azure has accepted the email (or throws when it refuses it)
    const poller = await client.beginSend(message, { abortSignal: AbortSignal.timeout(30_000) })
    for (let i = 0; i < STATUS_CHECKS && !poller.isDone(); i++) {
      await new Promise((r) => setTimeout(r, STATUS_CHECK_GAP_MS))
      try {
        await poller.poll({ abortSignal: AbortSignal.timeout(10_000) })
      } catch (e) {
        // Azure reported the send as failed: that is a real failure
        if (poller.getOperationState().status === 'failed') throw e
        // The check itself did not go through. The email is already accepted.
        break
      }
    }
    const state = poller.getOperationState()
    // The number is kept whether or not the send has finished, so it can be asked about later
    const result = { status: state.status === 'failed' ? 'Failed' : KnownEmailSendStatus.Succeeded, id: sendNumberOf(poller) }
    // Finished already (the usual case), or taken by the service and still in its queue
    const done = state.status === 'succeeded'

    const recipients = Array.isArray(config.to) ? config.to : [config.to]

    if (result.status === KnownEmailSendStatus.Succeeded) {
      console.log(`Email ${done ? 'sent' : 'taken (not finished yet)'} via Azure Communication Services to:`, recipients.join(', '))
      for (const recipient of recipients) {
        saveEmailLog({ to: recipient, from: config.from, subject: config.subject, status: 'sent', messageId: result.id }).catch((err) => console.error('Email log save failed:', err))
      }
      saveToOutlookSentItems(config).catch((err) =>
        console.error('Outlook Sent Items save failed:', err)
      )
      return {
        success: true,
        messageId: result.id,
        /** False when the service has taken the email and not finished sending it yet. */
        done,
      }
    } else {
      for (const recipient of recipients) {
        saveEmailLog({ to: recipient, from: config.from, subject: config.subject, status: 'failed', error: `Status: ${result.status}` }).catch((err) => console.error('Email log save failed:', err))
      }
      throw new Error(`Email send failed with status: ${result.status}`)
    }
  } catch (error) {
    console.error('Email sending failed:', error)
    const errorMsg = sendProblem(error)
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

// Every brochure and course outline the site offers, by file name, and the folder of the store it is kept in.
// Built from the site's own list (src/data/training-programs.ts): nothing else can ever be attached.
const BROCHURE_FOLDERS: Array<[string, string]> = [['Gennoor-Bootcamp-Brochures', 'bootcamp-brochures'], ['Gennoor-Tech-Course-TOCs', 'course-tocs']]
let offered: Map<string, string> | null = null
function offeredFiles(): Map<string, string> {
  if (offered) return offered
  offered = new Map()
  for (const program of allPrograms) {
    for (const file of [program.pdfFile, program.docFile]) {
      const folder = file && BROCHURE_FOLDERS.find(([name]) => file.includes(`/${name}/`))
      if (file && folder) offered.set(path.posix.basename(file), folder[1])
    }
  }
  return offered
}

/**
 * The brochure or course outline to attach to a training enquiry's email.
 *
 * `requested` comes from the BROWSER, so it is not trusted for anything except to pick one of the files the
 * site itself offers: only its file name is looked at, and it must be on the list above. The file is read from
 * the `pdfs` store and from nowhere else.
 *
 * Until 20 November 2026 a name that was not found in the store was read from the server's own disk, by the path
 * given, and emailed to the address typed in the form. A request for "../../../proc/self/environ" would have
 * emailed every secret of the site to a stranger (docs/SECURITY.md, "Files"). Never read a path that came from
 * a request.
 */
export async function attachPDF(filename: string, requested: string) {
  try {
    const name = String(requested || '').split(/[\\/]/).pop() || ''
    const folder = offeredFiles().get(name)
    if (!folder || !process.env.AZURE_STORAGE_CONNECTION_STRING) return null
    const content = await downloadPdfFromBlob(`${folder}/${name}`)
    return content ? { filename, content, contentType: 'application/pdf' } : null
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
// NOTE: optionalRow does not escape. Every value given to it is escaped by the caller (the `safe` fields, escapeHtml).

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
      ? `My team (${String(data.teamSize).slice(0, 40)} people)`
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
      ${optionalRow('Training for', escapeHtml(trainingForLabel))}
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
