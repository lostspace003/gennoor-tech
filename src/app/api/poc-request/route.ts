import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email-service'
import { saveEnquiry } from '@/lib/azure-storage'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import { escapeHtml } from '@/lib/escape-html'
import { emailShell } from '@/lib/crm/email-theme'

/**
 * A request for a proof of concept (the form on /automation and on each proof-of-concept page).
 * Saved with the other enquiries (type PocRequest, so it becomes a CRM lead by itself), then two
 * emails: a confirmation to the visitor from enquiry@, and the request to admin@ with sales@ copied.
 */
export async function POST(request: Request) {
  try {
    if (!rateLimit(`poc-request:${clientIp(request.headers)}`, 4, 30 * 60_000)) {
      return NextResponse.json({ success: false, message: 'Too many requests. Please try again later.' }, { status: 429 })
    }
    const b = await request.json().catch(() => ({}))
    const get = (k: string, max = 2000) => String(b?.[k] ?? '').trim().slice(0, max)
    const name = get('name', 200), email = get('email', 200), organization = get('organization', 200)
    const topic = get('topic', 300), detail = get('detail'), systems = get('systems', 500), timing = get('timing', 40)
    const phone = get('phone', 60), page = get('page', 200), example = get('example', 120)

    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: 'Please give your name and a valid email address.' }, { status: 400 })
    }
    if (!organization || !topic || !detail) {
      return NextResponse.json({ success: false, message: 'Please fill in the organization, the process and what it should do.' }, { status: 400 })
    }

    await saveEnquiry('PocRequest', { name, email, organization, topic, detail, systems, timing, phone, page, example })

    const from = process.env.EMAIL_FROM_ENQUIRY || 'enquiry@gennoor.com'
    const admin = process.env.EMAIL_ADMIN || 'admin@gennoor.com'
    const sales = process.env.EMAIL_FROM_SALES || 'sales@gennoor.com'
    const e = escapeHtml
    const row = (k: string, v: string) =>
      v ? `<tr><td style="padding:6px 10px;border:1px solid #e2e8f0;width:130px;color:#64748b">${k}</td><td style="padding:6px 10px;border:1px solid #e2e8f0">${e(v)}</td></tr>` : ''

    await sendEmail({
      to: email,
      from,
      fromName: 'Gennoor Tech',
      subject: 'We received your proof of concept request — Gennoor Tech',
      html: emailShell(
        `<h3 style="margin:0 0 12px;color:#0f172a">Thank you, ${e(name)}.</h3>
         <p style="margin:0 0 16px;color:#475569;line-height:1.7;font-size:15px">We have your request for a proof of concept: <strong>${e(topic)}</strong>. We will read it and write back within one business day, with questions or a short plan of what we would build and how we would check it.</p>
         <table role="presentation" style="border-collapse:collapse;font-size:14px;width:100%">${row('Organization', organization)}${row('What it should do', detail)}${row('Systems', systems)}</table>`,
        { preheader: 'We received your proof of concept request.', senderEmail: from }
      ),
    })

    await sendEmail({
      to: admin,
      cc: [sales],
      from,
      fromName: 'Gennoor Tech Website',
      subject: `[PROOF OF CONCEPT] ${organization} — ${topic}`,
      html: emailShell(
        `<h3 style="margin:0 0 12px;color:#0f172a">New proof of concept request</h3>
         <table role="presentation" style="border-collapse:collapse;font-size:14px;width:100%">
           ${row('Name', name)}${row('Email', email)}${row('Phone', phone)}${row('Organization', organization)}${row('Process', topic)}${row('What it should do', detail)}${row('Systems', systems)}${row('When', timing)}${row('Seen example', example)}${row('Sent from', page)}
         </table>`,
        { preheader: `Proof of concept: ${organization}`, senderEmail: from }
      ),
    })

    return NextResponse.json({ success: true, message: 'Request sent.' })
  } catch (error) {
    console.error('Error processing proof of concept request:', error)
    return NextResponse.json({ success: false, message: 'Could not send your request. Please try again.' }, { status: 500 })
  }
}
