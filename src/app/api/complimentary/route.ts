import { NextResponse } from 'next/server'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import { escapeHtml } from '@/lib/escape-html'
import { emailDetails, emailShell } from '@/lib/crm/email-theme'
import { graphConfigured, sendFromOutlook } from '@/lib/crm/graph'
import { CAMPAIGN_CC, CAMPAIGN_FROM, oneLineText } from '@/lib/crm/universities-types'
import { cleanRequest, courseChoices, decisionUrl, mutateRequests, newRequestId, type AccessRequest } from '@/lib/complimentary'

// A request for complimentary access to the Learning Studio (/complimentary-access). Anyone may call it: five per visitor
// in half an hour, 10,000 characters at most, every field rebuilt by `cleanRequest`, the courses only from the live list.
// The request is kept; admin@ (Jalal and Yusuf in copy) gets it with Approve and Reject; the person gets a short note.

export async function POST(request: Request) {
  if (!rateLimit(`complimentary:${clientIp(request.headers)}`, 5, 30 * 60_000)) return NextResponse.json({ error: 'Too many requests from here. Please try again in a little while.' }, { status: 429 })
  try {
    const raw = await request.text()
    if (raw.length > 10_000) return NextResponse.json({ error: 'That is too long to send.' }, { status: 413 })
    let body: unknown
    try { body = JSON.parse(raw) } catch { return NextResponse.json({ error: 'The form could not be read.' }, { status: 400 }) }
    const live = await courseChoices()
    const clean = cleanRequest(body, live.map((c) => c.slug))
    if (!clean.ok) return NextResponse.json({ error: clean.error }, { status: 400 })
    if (clean.machine) return NextResponse.json({ success: true })
    const req: AccessRequest = { id: newRequestId(), at: new Date().toISOString(), status: 'pending', ...clean.req }
    await mutateRequests((rows) => { rows.push(req) })

    if (graphConfigured()) {
      const titles = req.courses.map((s) => live.find((c) => c.slug === s)?.title || s)
      const buttons = (['approve', 'reject'] as const).map((a) => {
        const url = decisionUrl(req.id, a)
        return url ? `<a href="${url}" style="display:inline-block;margin:6px 10px 0 0;padding:11px 22px;border-radius:9px;background:${a === 'approve' ? '#0f7b3f' : '#8a1c1c'};color:#ffffff;text-decoration:none;font-weight:700;font-size:14px">${a === 'approve' ? 'Approve and send the codes' : 'Reject'}</a>` : ''
      }).join('')
      const team = emailShell(`<h2 style="margin:0 0 8px;font-size:20px;color:#0f172a">A request for complimentary access</h2>
        ${emailDetails('The request', [['Name', req.name], ['Designation', req.title], ['Email', req.email], ['Organisation', req.org], ['Country and city', req.place], ['Courses', titles.join('; ')], ['Notes', req.notes]])}
        <p style="margin:0 0 4px;color:#475569">Approve makes one code for each course and emails them to ${escapeHtml(req.email)}.</p>${buttons}`, { preheader: `Complimentary access: ${req.org}` })
      const thanks = emailShell(`<p style="margin:0 0 14px">Dear ${escapeHtml(req.name)},</p>
        <p style="margin:0 0 14px">Thank you for asking for complimentary access to the Gennoor Learning Studio. We have your request, and our team will reply by email, usually within one working day.</p>
        <p style="margin:0">Warm regards,<br/>Gennoor Tech</p>`, { preheader: 'We have your request.' })
      await Promise.all([
        sendFromOutlook({ from: CAMPAIGN_FROM, to: [CAMPAIGN_FROM], cc: CAMPAIGN_CC, subject: oneLineText(`Complimentary access request: ${req.org}`, 200), html: team }),
        sendFromOutlook({ from: CAMPAIGN_FROM, to: [req.email], cc: [], subject: 'Your request for complimentary access', html: thanks }),
      ].map((p) => p.catch((e) => console.error('Complimentary email failed:', String(e?.message || e).slice(0, 160)))))
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Complimentary request error:', error)
    return NextResponse.json({ error: 'Your request could not be saved. Please try again, or write to admin@gennoor.com.' }, { status: 500 })
  }
}
