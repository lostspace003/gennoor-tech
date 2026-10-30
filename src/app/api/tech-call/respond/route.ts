import { NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { getEnquiries, getEnquiry, updateEnquiry } from '@/lib/azure-storage'
import { sendEmail } from '@/lib/email-service'
import { createTeamsMeeting, updateMeeting } from '@/lib/crm/graph'
import { formatInZone, IST } from '@/lib/crm/timezones'
import { escapeHtml } from '@/lib/escape-html'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import { SLOT_MINUTES, TECH_CALL_TYPE, heldSlotKeys, isOfferedSlot, slotKey } from '@/lib/tech-call'
import { confirmedEmailHtml } from '@/lib/tech-call-mail'

export const dynamic = 'force-dynamic'

const sameToken = (a: unknown, b: unknown) => {
  const x = Buffer.from(String(a || '')), y = Buffer.from(String(b || ''))
  return x.length > 0 && x.length === y.length && timingSafeEqual(x, y)
}

/** Loads the request when the id + token from the email link match. Never returns the token itself. */
async function load(id: string, token: string) {
  const r = id ? await getEnquiry(TECH_CALL_TYPE, id) : null
  return r && sameToken(r.proposalToken, token) ? r : null
}

/** What the reply page shows. Read-only: opening the link (or an email scanner fetching it) changes nothing. */
export async function GET(request: Request) {
  if (!rateLimit(`tech-call-respond-get:${clientIp(request.headers)}`, 40, 10 * 60_000)) return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })
  const u = new URL(request.url)
  const r = await load(u.searchParams.get('id') || '', u.searchParams.get('t') || '')
  if (!r) return NextResponse.json({ error: 'This link is not valid.' }, { status: 404 })
  const tz = String(r.timeZone || IST)
  return NextResponse.json({
    name: String(r.name || '').split(' ')[0],
    state: r.callStatus === 'declined' ? 'closed' : r.proposalStatus || 'closed',
    confirmed: r.callStatus === 'approved',
    current: formatInZone(new Date(String(r.slotStartUtc)), tz),
    proposed: r.proposedStartUtc ? formatInZone(new Date(String(r.proposedStartUtc)), tz) : '',
    message: r.proposalMessage || '',
    teamsUrl: r.proposalStatus === 'accepted' ? r.teamsUrl || '' : '',
  })
}

/** The visitor answers yes or no. Yes moves the call and sends the updated invite without any admin step. */
export async function POST(request: Request) {
  if (!rateLimit(`tech-call-respond:${clientIp(request.headers)}`, 10, 10 * 60_000)) return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })
  const b = await request.json().catch(() => ({}))
  const id = String(b.id || '')
  const r = await load(id, String(b.token || ''))
  if (!r) return NextResponse.json({ error: 'This link is not valid.' }, { status: 404 })
  if (r.callStatus === 'declined' || r.proposalStatus !== 'awaiting') return NextResponse.json({ error: 'This suggestion has already been answered or withdrawn.' }, { status: 409 })

  const admin = process.env.EMAIL_ADMIN || 'admin@gennoor.com'
  const from = process.env.EMAIL_FROM_SCHEDULE || admin
  const tz = String(r.timeZone || IST)
  const first = String(r.name || '').split(' ')[0]
  const oldWhen = formatInZone(new Date(String(r.slotStartUtc)), tz)
  const newStart = new Date(String(r.proposedStartUtc))
  const newWhen = formatInZone(newStart, tz)

  if (b.action === 'no') {
    await updateEnquiry(TECH_CALL_TYPE, id, { proposalStatus: 'declined', proposalAnsweredAt: new Date().toISOString() })
    await sendEmail({
      to: admin, from, fromName: 'Gennoor Tech Website',
      subject: `[TECH CALL] ${r.name} said NO to the new time`,
      html: `<p>${escapeHtml(r.name)} (${escapeHtml(r.email)}) cannot do <strong>${escapeHtml(formatInZone(newStart, IST))} IST</strong>.</p>
        <p>The ${r.callStatus === 'approved' ? 'confirmed' : 'requested'} time is unchanged: ${escapeHtml(formatInZone(new Date(String(r.slotStartUtc)), IST))} IST.</p>
        <p>Suggest another time in <a href="https://www.gennoor.com/admin/tech-calls">Tech calls</a>.</p>`,
    })
    return NextResponse.json({ success: true, state: 'declined' })
  }
  if (b.action !== 'yes') return NextResponse.json({ error: 'Unknown answer.' }, { status: 400 })

  // The offer may have gone stale since the email went out.
  if (!isOfferedSlot(String(r.proposedDate), String(r.proposedTime))) return NextResponse.json({ error: 'That time has passed or is no longer offered. We will send you a new suggestion.' }, { status: 410 })
  const rows = await getEnquiries(TECH_CALL_TYPE, 60)
  if (heldSlotKeys(rows.filter(x => x.rowKey !== id)).has(slotKey(String(r.proposedDate), String(r.proposedTime)))) {
    return NextResponse.json({ error: 'That time was just taken. We will send you a new suggestion.' }, { status: 409 })
  }

  let eventId = String(r.teamsEventId || '')
  let joinUrl = String(r.teamsUrl || '')
  try {
    if (eventId) {
      await updateMeeting(eventId, { start: newStart.toISOString(), durationMinutes: SLOT_MINUTES, comment: 'The visitor confirmed the new time.' })
    } else {
      const m = await createTeamsMeeting({
        subject: `Gennoor Tech: tech call with ${r.name}${r.course ? ` (${r.course})` : ''}`,
        attendees: [{ email: String(r.email), name: String(r.name) }],
        start: newStart.toISOString(), durationMinutes: SLOT_MINUTES, agenda: `<p>${escapeHtml(r.note)}</p>`,
      })
      eventId = m.id; joinUrl = m.joinUrl || ''
    }
  } catch (e) {
    console.error('Teams update on visitor confirm failed', e)
    return NextResponse.json({ error: 'We could not update the meeting just now. Nothing has changed. Please try again in a few minutes.' }, { status: 502 })
  }

  await updateEnquiry(TECH_CALL_TYPE, id, {
    callStatus: 'approved', slotDate: r.proposedDate, slotTime: r.proposedTime, slotStartUtc: newStart.toISOString(),
    teamsEventId: eventId, teamsUrl: joinUrl, approvedBy: r.approvedBy || r.proposalBy || '', approvedAt: r.approvedAt || new Date().toISOString(),
    proposalStatus: 'accepted', proposalAnsweredAt: new Date().toISOString(),
  })
  await sendEmail({ to: String(r.email), from, fromName: 'Gennoor Tech', subject: 'Your tech call is confirmed | Gennoor Tech', html: confirmedEmailHtml({ first, theirs: newWhen, joinUrl, changed: true }) })
  await sendEmail({
    to: admin, from, fromName: 'Gennoor Tech Website',
    subject: `[TECH CALL] ${r.name} confirmed the new time`,
    html: `<p>${escapeHtml(r.name)} confirmed <strong>${escapeHtml(formatInZone(newStart, IST))} IST</strong> (was ${escapeHtml(oldWhen)} their time). The Teams invite${r.teamsEventId ? ' was updated' : ' was created'} and sent automatically.</p>`,
  })
  return NextResponse.json({ success: true, state: 'accepted', when: newWhen, teamsUrl: joinUrl })
}
