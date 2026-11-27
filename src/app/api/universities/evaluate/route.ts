import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import { escapeHtml } from '@/lib/escape-html'
import { emailDetails, emailShell } from '@/lib/crm/email-theme'
import { graphConfigured, sendFromOutlook } from '@/lib/crm/graph'
import { mutateUniversities, note } from '@/lib/crm/universities-store'
import { accessRows, codesFor, courseChoices } from '@/lib/complimentary'
import {
  CAMPAIGN_CC, CAMPAIGN_FROM, FORM_KEY, UNI_AREAS, UNI_COURSES, UNI_WALKTHROUGH,
  EVALUATION_NOTE, applyFormAnswer, cleanFormAnswer, oneLineText, type UniFormAnswer,
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
    const live = await courseChoices().catch(() => [])
    const clean = cleanFormAnswer(body, live.length ? live.map((c) => c.slug) : undefined)
    if (!clean.ok) return NextResponse.json({ error: clean.error }, { status: 400 })
    // A machine filled the hidden field: it is told all went well, and nothing is kept or sent.
    if (clean.machine) return NextResponse.json({ success: true })

    const key = typeof body.key === 'string' && FORM_KEY.test(body.key) ? body.key : ''
    const now = new Date().toISOString()
    const answer: UniFormAnswer = { id: randomBytes(8).toString('hex'), at: now, uni: '', ...clean.answer }

    // Two evaluation codes, made before the answer is kept, so the answer names them (owner, 27 November 2026)
    answer.coupons = await codesFor(answer.courses, answer.reps.length, `${EVALUATION_NOTE} · ${answer.institution.slice(0, 80)} · ${key ? 'own link' : 'general link'}`).catch((e) => { console.error('Evaluation codes failed:', String(e?.message || e).slice(0, 160)); return {} })

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
      await tellTheTeam(answer, uni).catch((e) => console.error('Evaluation form email failed:', String(e?.message || e).slice(0, 160)))
      const sent = await accessIsReady(answer, live).then(() => true).catch((e) => { console.error('Access email failed:', String(e?.message || e).slice(0, 160)); return false })
      if (uni) await mutateUniversities((doc) => {
        const u = doc.universities.find((x) => x.id === uni.id)
        if (!u) return
        const at = new Date().toISOString()
        u.emails.unshift({ at, by: 'form', to: answer.reps.map((r) => r.email).join(', '), cc: CAMPAIGN_CC, subject: ACCESS_SUBJECT, status: sent ? 'sent' : 'failed', kind: 'again', body: `Access codes: ${Object.entries(answer.coupons || {}).map(([c, k]) => `${c} ${k}`).join(', ')}`, ...(sent ? { confirmedAt: at, confirmedBy: 'outlook' as const } : { error: 'The access email could not be sent' }) })
        if (sent && Object.keys(answer.coupons || {}).length && u.evaluation && !u.evaluation.grantedAt) {
          u.evaluation.grantedAt = at.slice(0, 10)
          if (u.stage === 'new' || u.stage === 'emailed' || u.stage === 'replied') u.stage = 'evaluating'
        }
        note(u, 'form', 'email', sent ? `Access is ready, sent with codes ${Object.values(answer.coupons || {}).join(' and ')}` : 'The access email could not be sent: send it from the Email tab', at)
      })
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

const ACCESS_SUBJECT = 'Your Gennoor Learning Studio access is ready'

/** The courses, the two codes and how to use them, to the representatives, from admin@ through Outlook. */
function accessIsReady(a: UniFormAnswer, live: Array<{ slug: string; title: string }>) {
  const codes = a.coupons || {}
  if (!Object.keys(codes).length) throw new Error('no codes')
  const rows = accessRows(codes, live)
  const P = 'margin:0 0 14px;font-size:15px;line-height:1.7;color:#334155'
  const html = emailShell(
    `<p style="${P}">Dear ${escapeHtml(a.reps.map((r) => r.name).join(' and '))},</p>
     <p style="${P}">Thank you for choosing the courses to evaluate. Full access is ready for:</p>
     ${rows}
     <p style="margin:0 0 6px;font-size:15px;font-weight:700;color:#1b2540">How to use a code</p>
     <ol style="margin:0 0 16px;padding-left:20px;font-size:15px;line-height:1.7;color:#334155"><li>Open a course above and sign in, or create your account.</li><li>Press Enrol, and type your code where it asks for one.</li><li>Use the code shown beside that course. Each code works for up to two people from your team, with nothing to pay.</li></ol>
     <p style="${P}">The codes work for 90 days. In about a week, I would welcome a 20-minute call to hear what your faculty think. If anything is unclear, simply reply to this email.</p>
     <p style="margin:0">Warm regards,<br/>Jalal Khan<br/>Founder, Gennoor Tech</p>`,
    { preheader: 'Your course access codes are inside.', signature: { name: 'Jalal Khan', email: 'jalalkhan@gennoor.com' } }
  )
  return sendFromOutlook({ from: CAMPAIGN_FROM, to: [...new Set(a.reps.map((r) => r.email))], cc: CAMPAIGN_CC, subject: ACCESS_SUBJECT, html })
}
