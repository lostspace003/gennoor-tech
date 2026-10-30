import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { getEnquiries, getEnquiry, updateEnquiry } from '@/lib/azure-storage'
import { sendEmail } from '@/lib/email-service'
import { createTeamsMeeting } from '@/lib/crm/graph'
import { formatInZone, IST } from '@/lib/crm/timezones'
import { escapeHtml } from '@/lib/escape-html'
import { randomBytes } from 'crypto'
import { SLOT_MINUTES, TECH_CALL_TYPE, heldSlotKeys, isOfferedSlot, slotKey } from '@/lib/tech-call'
import { confirmedEmailHtml, proposalEmailHtml, siteUrl } from '@/lib/tech-call-mail'
import { istInstant } from '@/lib/crm/timezones'

export const dynamic = 'force-dynamic'

/** All tech call requests, newest first, with the time in IST and in the visitor's zone. */
export async function GET(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const rows = await getEnquiries(TECH_CALL_TYPE, 365)
  const calls = rows
    .map(r => {
      const start = new Date(String(r.slotStartUtc))
      return {
        id: r.rowKey, status: r.callStatus || 'pending', createdAt: r.createdAt,
        name: r.name, email: r.email, phone: r.phone, country: r.country,
        audience: r.audience, teamSize: r.teamSize, organization: r.organization,
        userLocation: r.userLocation, orgLocation: r.orgLocation, note: r.note, course: r.course,
        whenIst: formatInZone(start, IST), whenTheirs: formatInZone(start, String(r.timeZone || IST)),
        teamsUrl: r.teamsUrl || '',
        proposalStatus: r.proposalStatus || '', proposalMessage: r.proposalMessage || '',
        proposedIst: r.proposedStartUtc ? formatInZone(new Date(String(r.proposedStartUtc)), IST) : '',
        proposedTheirs: r.proposedStartUtc ? formatInZone(new Date(String(r.proposedStartUtc)), String(r.timeZone || IST)) : '',
      }
    })
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
  return NextResponse.json({ calls })
}

/** Approve (creates the Teams meeting from the admin mailbox and emails the invite) or decline. */
export async function POST(req: NextRequest) {
  const { authorized, email: by } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const b = await req.json().catch(() => ({}))
  const id = String(b.id || '')
  const action = String(b.action || '')
  const r = id ? await getEnquiry(TECH_CALL_TYPE, id) : null
  if (!r) return NextResponse.json({ error: 'Request not found.' }, { status: 404 })
  const status = r.callStatus || 'pending'
  if (status === 'declined') return NextResponse.json({ error: 'Already declined.' }, { status: 409 })
  if (action !== 'propose' && status !== 'pending') return NextResponse.json({ error: `Already ${status}.` }, { status: 409 })

  const admin = process.env.EMAIL_ADMIN || 'admin@gennoor.com'
  const from = process.env.EMAIL_FROM_SCHEDULE || admin
  const start = new Date(String(r.slotStartUtc))
  const theirs = formatInZone(start, String(r.timeZone || IST))
  const rawFirst = String(r.name || '').split(' ')[0]
  const first = escapeHtml(rawFirst)

  if (action === 'approve') {
    let meeting: { joinUrl?: string; id: string }
    try {
      meeting = await createTeamsMeeting({
        subject: `Gennoor Tech: tech call with ${r.name}${r.course ? ` (${r.course})` : ''}`,
        attendees: [{ email: String(r.email), name: String(r.name) }],
        start: start.toISOString(),
        durationMinutes: SLOT_MINUTES,
        agenda: `<p>${escapeHtml(r.note)}</p>`,
      })
    } catch (e) {
      console.error('Teams meeting failed', e)
      return NextResponse.json({ error: 'Could not create the Teams meeting. Nothing was sent. Check the Graph permissions (Calendars.ReadWrite).' }, { status: 502 })
    }
    await updateEnquiry(TECH_CALL_TYPE, id, { callStatus: 'approved', approvedBy: by || '', approvedAt: new Date().toISOString(), teamsUrl: meeting.joinUrl || '', teamsEventId: meeting.id })
    await sendEmail({
      to: String(r.email), from, fromName: 'Gennoor Tech',
      subject: 'Your tech call is confirmed | Gennoor Tech',
      html: confirmedEmailHtml({ first: rawFirst, theirs, joinUrl: meeting.joinUrl }),
    })
    return NextResponse.json({ success: true, teamsUrl: meeting.joinUrl || '' })
  }

  if (action === 'propose') {
    const date = String(b.date || ''), time = String(b.time || '')
    const message = String(b.message || '').trim().slice(0, 1000)
    if (!isOfferedSlot(date, time)) return NextResponse.json({ error: 'That time is not one we offer, or it is less than 2 hours away.' }, { status: 400 })
    if (slotKey(date, time) === slotKey(String(r.slotDate), String(r.slotTime))) return NextResponse.json({ error: 'That is already the current time.' }, { status: 400 })
    const rows = await getEnquiries(TECH_CALL_TYPE, 60)
    if (heldSlotKeys(rows, id).has(slotKey(date, time))) return NextResponse.json({ error: 'That time is held by another request. Pick another.' }, { status: 409 })

    const proposed = istInstant(date, time)
    const token = randomBytes(16).toString('hex')
    const base = `${siteUrl()}/tech-call/respond?id=${encodeURIComponent(id)}&t=${token}`
    await updateEnquiry(TECH_CALL_TYPE, id, {
      proposalStatus: 'awaiting', proposedDate: date, proposedTime: time, proposedStartUtc: proposed.toISOString(),
      proposalMessage: message, proposalToken: token, proposalBy: by || '', proposalAt: new Date().toISOString(),
    })
    const sent = await sendEmail({
      to: String(r.email), from, fromName: 'Gennoor Tech',
      subject: 'Can we move your tech call? | Gennoor Tech',
      html: proposalEmailHtml({
        first: rawFirst, current: theirs, confirmed: status === 'approved', proposed: formatInZone(proposed, String(r.timeZone || IST)),
        message, yesUrl: `${base}&a=yes`, noUrl: `${base}&a=no`,
      }),
    })
    if (!sent.success) return NextResponse.json({ error: 'Saved, but the email could not be sent. Try again.' }, { status: 502 })
    return NextResponse.json({ success: true })
  }

  if (action === 'decline') {
    await updateEnquiry(TECH_CALL_TYPE, id, { callStatus: 'declined', approvedBy: by || '', approvedAt: new Date().toISOString() })
    await sendEmail({
      to: String(r.email), from, fromName: 'Gennoor Tech',
      subject: 'About your tech call request | Gennoor Tech',
      html: `<div style="font-family:Segoe UI,Arial,sans-serif;max-width:560px">
        <p>Hi ${first},</p>
        <p>Thank you for your interest. We cannot take the call at <strong>${escapeHtml(theirs)}</strong>. Please send a new request for another time and we will confirm it.</p>
        <p>Gennoor Tech</p></div>`,
    })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
}
