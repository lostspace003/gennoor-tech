import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { getEnquiries, getEnquiry, updateEnquiry } from '@/lib/azure-storage'
import { sendEmail } from '@/lib/email-service'
import { createTeamsMeeting } from '@/lib/crm/graph'
import { formatInZone, IST } from '@/lib/crm/timezones'
import { escapeHtml } from '@/lib/escape-html'
import { SLOT_MINUTES, TECH_CALL_TYPE } from '@/lib/tech-call'

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
  if ((r.callStatus || 'pending') !== 'pending') return NextResponse.json({ error: `Already ${r.callStatus}.` }, { status: 409 })

  const admin = process.env.EMAIL_ADMIN || 'admin@gennoor.com'
  const from = process.env.EMAIL_FROM_SCHEDULE || admin
  const start = new Date(String(r.slotStartUtc))
  const theirs = formatInZone(start, String(r.timeZone || IST))
  const first = escapeHtml(String(r.name || '').split(' ')[0])

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
      html: `<div style="font-family:Segoe UI,Arial,sans-serif;max-width:560px">
        <p>Hi ${first},</p>
        <p>Your tech call is confirmed for <strong>${escapeHtml(theirs)}</strong> (${SLOT_MINUTES} minutes).</p>
        ${meeting.joinUrl ? `<p><a href="${escapeHtml(meeting.joinUrl)}" style="background:#0071e3;color:#fff;padding:10px 18px;border-radius:10px;text-decoration:none">Join on Microsoft Teams</a></p>` : ''}
        <p>A calendar invite from admin@gennoor.com is also in your inbox.</p><p>Gennoor Tech</p></div>`,
    })
    return NextResponse.json({ success: true, teamsUrl: meeting.joinUrl || '' })
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
