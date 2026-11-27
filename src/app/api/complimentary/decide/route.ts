import { NextResponse } from 'next/server'
import { escapeHtml } from '@/lib/escape-html'
import { emailShell } from '@/lib/crm/email-theme'
import { sendFromOutlook } from '@/lib/crm/graph'
import { CAMPAIGN_CC, CAMPAIGN_FROM } from '@/lib/crm/universities-types'
import { COMPLIMENTARY_NOTE, accessRows, codesFor, courseChoices, mutateRequests, verifyDecision } from '@/lib/complimentary'

// Approve or Reject a complimentary-access request: the button on /complimentary-access/decide, reached from the signed
// link in the team's email. Who may call it: whoever holds that signed link (one request, one action, seven days);
// the signature is checked here. A request is decided once. Approve makes one code per course and emails them.

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null)
  const get = (k: string) => String(form?.get(k) ?? '')
  const id = get('r'), action = get('a')
  const back = (msg: string) => NextResponse.redirect(new URL(`/complimentary-access/decide?done=${encodeURIComponent(msg)}`, 'https://www.gennoor.com'), 303)
  const ok = verifyDecision(id, action, get('e'), get('t'))
  if (!ok.ok) return back(ok.why)
  try {
    const req = await mutateRequests((rows) => {
      const r = rows.find((x) => x.id === id)
      if (!r || r.status !== 'pending') return null
      r.status = ok.action === 'approve' ? 'approved' : 'rejected'
      r.decidedAt = new Date().toISOString()
      return { ...r }
    })
    if (!req) return back('This request was already decided.')
    if (ok.action === 'reject') return back(`Rejected. Nothing was sent to ${req.email}.`)

    const live = await courseChoices()
    const codes = await codesFor(req.courses, 1, `${COMPLIMENTARY_NOTE} · ${req.org.slice(0, 80)} · ${req.email}`)
    await mutateRequests((rows) => { const r = rows.find((x) => x.id === id); if (r) r.codes = codes })
    const html = emailShell(`<p style="margin:0 0 14px">Dear ${escapeHtml(req.name)},</p>
      <p style="margin:0 0 14px">Your complimentary access to the Gennoor Learning Studio is ready.</p>
      ${accessRows(codes, live)}
      <p style="margin:0 0 6px;font-weight:700;color:#1b2540">How to use a code</p>
      <ol style="margin:0 0 16px;padding-left:20px;line-height:1.7"><li>Open the course above and sign in, or create your account.</li><li>Press Enrol and type the code shown beside that course.</li><li>The course is yours, with nothing to pay.</li></ol>
      <p style="margin:0 0 14px">The codes work for 90 days. If anything is unclear, simply reply to this email.</p>
      <p style="margin:0">Warm regards,<br/>Gennoor Tech</p>`, { preheader: 'Your course codes are inside.' })
    await sendFromOutlook({ from: CAMPAIGN_FROM, to: [req.email], cc: CAMPAIGN_CC, subject: 'Your complimentary Learning Studio access', html })
    return back(`Approved. ${Object.keys(codes).length} code${Object.keys(codes).length === 1 ? '' : 's'} sent to ${req.email}.`)
  } catch (error) {
    console.error('Complimentary decision error:', error)
    return back('Something went wrong. Nothing more was sent; look in the admin mailbox before trying again.')
  }
}
