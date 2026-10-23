import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email-service'
import { saveEnquiry } from '@/lib/azure-storage'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import { escapeHtml } from '@/lib/escape-html'
import { emailShell } from '@/lib/crm/email-theme'

/**
 * Custom training request (the "Custom training" panel, available on every page).
 * Confirmation to the visitor comes from training@. The request goes to training@,
 * with admin@ and sales@ copied so it also reaches the CRM mailbox sweep.
 */
export async function POST(request: Request) {
  try {
    if (!rateLimit(`custom-training:${clientIp(request.headers)}`, 4, 30 * 60_000)) {
      return NextResponse.json({ success: false, message: 'Too many requests. Please try again later.' }, { status: 429 })
    }
    const b = await request.json().catch(() => ({}))
    const get = (k: string, max = 2000) => String(b?.[k] ?? '').trim().slice(0, max)
    const name = get('name', 200), email = get('email', 200), organization = get('organization', 200)
    const topic = get('topic', 300), detail = get('detail'), teamSize = get('teamSize', 40), timing = get('timing', 40)
    const phone = get('phone', 60), page = get('page', 200)

    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: 'Please give your name and a valid email address.' }, { status: 400 })
    }
    if (!organization || !topic || !detail) {
      return NextResponse.json({ success: false, message: 'Please fill in the organization, the topic and the project.' }, { status: 400 })
    }

    await saveEnquiry('CustomTraining', { name, email, organization, topic, detail, teamSize, timing, phone, page })

    const training = process.env.EMAIL_FROM_TRAINING || 'training@gennoor.com'
    const admin = process.env.EMAIL_ADMIN || 'admin@gennoor.com'
    const sales = process.env.EMAIL_FROM_SALES || 'sales@gennoor.com'
    const e = escapeHtml
    const row = (k: string, v: string) =>
      v ? `<tr><td style="padding:6px 10px;border:1px solid #e2e8f0;width:130px;color:#64748b">${k}</td><td style="padding:6px 10px;border:1px solid #e2e8f0">${e(v)}</td></tr>` : ''

    await sendEmail({
      to: email,
      from: training,
      fromName: 'Gennoor Tech',
      subject: 'We received your custom training request — Gennoor Tech',
      html: emailShell(
        `<h3 style="margin:0 0 12px;color:#0f172a">Thank you, ${e(name)}.</h3>
         <p style="margin:0 0 16px;color:#475569;line-height:1.7;font-size:15px">We have your request for <strong>${e(topic)}</strong>. Someone from the training team will write back within one business day.</p>
         <table role="presentation" style="border-collapse:collapse;font-size:14px;width:100%">${row('Organization', organization)}${row('Project', detail)}</table>`,
        { preheader: 'We received your custom training request.', senderEmail: training }
      ),
    })

    await sendEmail({
      to: training,
      cc: [admin, sales],
      from: training,
      fromName: 'Gennoor Tech Website',
      subject: `[CUSTOM TRAINING] ${organization} — ${topic}`,
      html: emailShell(
        `<h3 style="margin:0 0 12px;color:#0f172a">New custom training request</h3>
         <table role="presentation" style="border-collapse:collapse;font-size:14px;width:100%">
           ${row('Name', name)}${row('Email', email)}${row('Phone', phone)}${row('Organization', organization)}${row('Topic', topic)}${row('Project', detail)}${row('People', teamSize)}${row('When', timing)}${row('Sent from', page)}
         </table>`,
        { preheader: `Custom training: ${organization}`, senderEmail: training }
      ),
    })

    return NextResponse.json({ success: true, message: 'Request sent.' })
  } catch (error) {
    console.error('Error processing custom training request:', error)
    return NextResponse.json({ success: false, message: 'Could not send your request. Please try again.' }, { status: 500 })
  }
}
