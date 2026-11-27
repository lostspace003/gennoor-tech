import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import { escapeHtml } from '@/lib/escape-html'
import { emailDetails, emailShell } from '@/lib/crm/email-theme'
import { graphConfigured, sendFromOutlook } from '@/lib/crm/graph'
import { mutateUniversities, note } from '@/lib/crm/universities-store'
import {
  CAMPAIGN_CC, CAMPAIGN_FROM, FORM_KEY, UNI_AREAS, UNI_COURSES, UNI_WALKTHROUGH,
  applyFormAnswer, cleanFormAnswer, oneLineText, type UniFormAnswer,
} from '@/lib/crm/universities-types'

// The university evaluation form (/evaluate). Anyone may call it: it is a public form. What stops abuse: five answers
// per visitor in half an hour, a cap on the size of what is sent, every field rebuilt by `cleanFormAnswer`, and the
// university decided only by the key in its own link (never by the name typed). Two emails go from admin@ through
// Outlook: the answer to the team, and a fixed thank-you to the first representative, which names only our courses.

const MAX_BODY = 20_000
const MAX_UNMATCHED = 200

export async function POST(request: Request) {
  if (!rateLimit(`uni-evaluate:${clientIp(request.headers)}`, 5, 30 * 60_000)) {
    return NextResponse.json({ error: 'Too many answers from here. Please try again in a little while.' }, { status: 429 })
  }
  try {
    const raw = await request.text()
    if (raw.length > MAX_BODY) return NextResponse.json({ error: 'That is too long to send.' }, { status: 413 })
    let body: Record<string, unknown>
    try { body = JSON.parse(raw) } catch { return NextResponse.json({ error: 'The form could not be read.' }, { status: 400 }) }
    const clean = cleanFormAnswer(body)
    if (!clean.ok) return NextResponse.json({ error: clean.error }, { status: 400 })
    // A machine filled the hidden field: it is told all went well, and nothing is kept or sent.
    if (clean.machine) return NextResponse.json({ success: true })

    const key = typeof body.key === 'string' && FORM_KEY.test(body.key) ? body.key : ''
    const now = new Date().toISOString()
    const answer: UniFormAnswer = { id: randomBytes(8).toString('hex'), at: now, uni: '', ...clean.answer }

    const uni = await mutateUniversities((doc) => {
      const u = key ? doc.universities.find((x) => x.formKey === key) : undefined
      if (!u) {
        doc.unmatched = [answer, ...doc.unmatched].slice(0, MAX_UNMATCHED)
        return null
      }
      answer.uni = u.id
      applyFormAnswer(u, answer)
      note(u, 'form', 'form', `${answer.reps[0].name} answered the evaluation form: ${answer.courses.length} course${answer.courses.length === 1 ? '' : 's'}`, now)
      return { id: u.id, name: u.name }
    })

    if (graphConfigured()) {
      await Promise.all([tellTheTeam(answer, uni), thankThem(answer)].map((p) => p.catch((e) => console.error('Evaluation form email failed:', String(e?.message || e).slice(0, 160)))))
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Evaluation form error:', error)
    return NextResponse.json({ error: 'Your answer could not be saved. Please try again, or write to admin@gennoor.com.' }, { status: 500 })
  }
}

const courseTitle = (id: string) => UNI_COURSES.find((c) => c.id === id)?.title || id

function tellTheTeam(a: UniFormAnswer, uni: { id: string; name: string } | null) {
  const crm = uni ? `https://www.gennoor.com/crm/universities/${uni.id}` : 'https://www.gennoor.com/crm/universities'
  const html = emailShell(
    `<h2 style="margin:0 0 8px;font-size:20px;color:#0f172a">${uni ? `${escapeHtml(uni.name)} answered the evaluation form` : 'An answer came through the general form link'}</h2>
     <p style="margin:0 0 4px;color:#475569">${uni ? 'It is on the university\'s page in the CRM, and its courses are on the evaluation.' : 'It is in the CRM under Universities, Setup, waiting to be put on its university.'} <a href="${crm}" style="color:#2563EB">Open the CRM</a></p>
     ${emailDetails('The answer', [
       ['University', a.institution], ['Country and city', a.place], ['Department', a.department],
       ['Representative', `${a.reps[0].name}, ${a.reps[0].title} (${a.reps[0].email})`],
       ['Second representative', a.reps[1] ? `${a.reps[1].name}${a.reps[1].title ? `, ${a.reps[1].title}` : ''} (${a.reps[1].email})` : ''],
       ['Courses', a.courses.map(courseTitle).join('; ')],
       ['Interested in', a.areas.map((id) => UNI_AREAS.find((x) => x.id === id)?.label || id).join('; ')],
       ['Walkthrough', UNI_WALKTHROUGH.find((w) => w.id === a.walkthrough)?.label || ''],
       ['Notes', a.notes],
     ])}`,
    { preheader: `Evaluation form: ${a.institution}` }
  )
  return sendFromOutlook({ from: CAMPAIGN_FROM, to: [CAMPAIGN_FROM], cc: CAMPAIGN_CC, subject: oneLineText(`Evaluation form: ${a.institution}`, 200), html })
}

function thankThem(a: UniFormAnswer) {
  const rep = a.reps[0]
  const list = a.courses.map((id) => `<li style="margin:0 0 6px">${escapeHtml(courseTitle(id))}</li>`).join('')
  const html = emailShell(
    `<p style="margin:0 0 14px">Dear ${escapeHtml(rep.name)},</p>
     <p style="margin:0 0 14px">Thank you for requesting complimentary evaluation access to the Gennoor Learning Studio. We have your choice of course${a.courses.length === 1 ? '' : 's'}:</p>
     <ul style="margin:0 0 14px;padding-left:20px">${list}</ul>
     <p style="margin:0 0 14px">Our team will set up full access and email the sign-in details to you within 24 hours. You can look at the course previews in the meantime at <a href="https://gennoor.com/studio" style="color:#2563EB">gennoor.com/studio</a>.</p>
     <p style="margin:0 0 14px">If anything is unclear, simply reply to this email.</p>
     <p style="margin:0">Warm regards,<br/>Jalal Khan<br/>Founder, Gennoor Tech</p>`,
    { preheader: 'We have your course selection.', signature: { name: 'Jalal Khan', email: 'jalalkhan@gennoor.com' } }
  )
  return sendFromOutlook({ from: CAMPAIGN_FROM, to: [rep.email], cc: [], subject: 'Your Gennoor Learning Studio evaluation request', html })
}
