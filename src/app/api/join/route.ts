import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email-service'
import { saveEnquiry } from '@/lib/azure-storage'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import { escapeHtml } from '@/lib/escape-html'
import { emailShell } from '@/lib/crm/email-theme'

/**
 * "Work with us" form (/join). Trainers, engineers and others send a short note and a resume.
 * The resume goes to the private `resumes` container and is attached to the mail for hr@.
 */
export const runtime = 'nodejs'

const MAX_BYTES = 5 * 1024 * 1024
const TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}
const ROLES = ['Trainer', 'Automation and software', 'Other']
const ARRANGEMENTS = ['Freelance', 'Full-time', 'Either']

export async function POST(request: Request) {
  try {
    if (!rateLimit(`join:${clientIp(request.headers)}`, 3, 30 * 60_000)) {
      return NextResponse.json({ success: false, message: 'Too many requests. Please try again later.' }, { status: 429 })
    }
    const form = await request.formData()
    const get = (k: string) => String(form.get(k) ?? '').trim().slice(0, 4000)
    const name = get('name'), email = get('email'), phone = get('phone'), linkedin = get('linkedin'), brief = get('brief')
    const role = get('role'), arrangement = get('arrangement')
    const file = form.get('resume')

    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: 'Please give your name and a valid email address.' }, { status: 400 })
    }
    if (!ROLES.includes(role) || !ARRANGEMENTS.includes(arrangement)) {
      return NextResponse.json({ success: false, message: 'Please choose a role and how you want to work with us.' }, { status: 400 })
    }
    if (!brief) {
      return NextResponse.json({ success: false, message: 'Please add a short note about yourself.' }, { status: 400 })
    }
    if (linkedin && !/^https?:\/\//i.test(linkedin)) {
      return NextResponse.json({ success: false, message: 'The LinkedIn link should start with https://' }, { status: 400 })
    }

    let attachment: { filename: string; content: Buffer; contentType: string } | null = null
    let resumePath = ''
    if (file instanceof File && file.size > 0) {
      const ext = (file.name.split('.').pop() || '').toLowerCase()
      if (!TYPES[ext]) return NextResponse.json({ success: false, message: 'The resume must be a PDF or Word file.' }, { status: 400 })
      if (file.size > MAX_BYTES) return NextResponse.json({ success: false, message: 'The resume must be 5 MB or smaller.' }, { status: 400 })
      const buffer = Buffer.from(await file.arrayBuffer())
      const safe = name.replace(/[^a-z0-9]+/gi, '-').toLowerCase().slice(0, 40) || 'applicant'
      const filename = `${safe}-resume.${ext}`
      const conn = process.env.AZURE_STORAGE_CONNECTION_STRING
      if (conn) {
        const { BlobServiceClient } = await import('@azure/storage-blob')
        const container = BlobServiceClient.fromConnectionString(conn).getContainerClient('resumes')
        await container.createIfNotExists()
        resumePath = `join/${Date.now()}-${filename}`
        await container.getBlockBlobClient(resumePath).uploadData(buffer, { blobHTTPHeaders: { blobContentType: TYPES[ext] } })
      }
      attachment = { filename, content: buffer, contentType: TYPES[ext] }
    }

    await saveEnquiry('JoinApplication', { name, email, phone, linkedin, role, arrangement, brief, resumePath })

    const hr = process.env.EMAIL_FROM_HR || 'hr@gennoor.com'
    const e = escapeHtml
    const row = (k: string, v: string) =>
      v ? `<tr><td style="padding:6px 10px;border:1px solid #e2e8f0;width:130px;color:#64748b">${k}</td><td style="padding:6px 10px;border:1px solid #e2e8f0">${e(v)}</td></tr>` : ''

    await sendEmail({
      to: email,
      from: hr,
      fromName: 'Gennoor Tech',
      subject: 'We received your application — Gennoor Tech',
      html: emailShell(
        `<h3 style="margin:0 0 12px;color:#0f172a">Thank you, ${e(name)}.</h3>
         <p style="margin:0;color:#475569;line-height:1.7;font-size:15px">We have your note${attachment ? ' and resume' : ''}. If there is a fit, we will write to you. We read every application.</p>`,
        { preheader: 'We received your application.', senderEmail: hr }
      ),
    })

    await sendEmail({
      to: hr,
      cc: process.env.EMAIL_ADMIN || 'admin@gennoor.com',
      from: hr,
      fromName: 'Gennoor Tech Website',
      subject: `[JOIN] ${name} — ${role}, ${arrangement}`,
      attachments: attachment ? [attachment] : undefined,
      html: emailShell(
        `<h3 style="margin:0 0 12px;color:#0f172a">New application</h3>
         <table role="presentation" style="border-collapse:collapse;font-size:14px;width:100%">
           ${row('Name', name)}${row('Email', email)}${row('Phone', phone)}${row('LinkedIn', linkedin)}${row('Role', role)}${row('Working as', arrangement)}${row('Note', brief)}${row('Resume', attachment ? 'Attached' : 'Not provided')}
         </table>`,
        { preheader: `Application: ${name}`, senderEmail: hr }
      ),
    })

    return NextResponse.json({ success: true, message: 'Application sent.' })
  } catch (error) {
    console.error('Error processing join application:', error)
    return NextResponse.json({ success: false, message: 'Could not send your application. Please try again.' }, { status: 500 })
  }
}
