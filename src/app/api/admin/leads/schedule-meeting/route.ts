import { NextRequest, NextResponse } from 'next/server'
import { requireCrmUser, canWorkLead, CrmSessionUser } from '@/lib/crm/access'
import { mutateLeads, getLead, getLeads, touch } from '@/lib/crm/store'
import { sendLeadConversion } from '@/lib/linkedin-ads'
import { graphConfigured, createTeamsMeeting, listUpcomingMeetings, getMeeting, updateMeeting, cancelMeeting } from '@/lib/crm/graph'
import { formatIstCstFull } from '@/lib/format-time'

// GET → upcoming meetings (the scheduler view)
export async function GET() {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!graphConfigured()) {
    return NextResponse.json({ configured: false, meetings: [] })
  }
  try {
    const meetings = await listUpcomingMeetings(30)
    return NextResponse.json({ configured: true, meetings })
  } catch (error: any) {
    console.error('List meetings error:', error)
    const detail = String(error?.message || '')
    const permissionIssue = /Access.*denied|Authorization|Forbidden|ErrorAccessDenied/i.test(detail)
    return NextResponse.json({
      configured: true,
      meetings: [],
      error: permissionIssue
        ? 'Graph app lacks Calendars.ReadWrite permission. Grant it (application) in Entra ID.'
        : 'Failed to list meetings.',
    })
  }
}

// POST → schedule a Teams meeting with the lead (+ optional extra attendees)
export async function POST(req: NextRequest) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!graphConfigured()) {
    return NextResponse.json({ error: 'Microsoft Graph is not configured — cannot schedule meetings.' }, { status: 503 })
  }

  try {
    const { leadId, subject, start, durationMinutes, agenda, extraAttendees } = await req.json()
    if (!leadId || !subject || !start) {
      return NextResponse.json({ error: 'leadId, subject and start are required' }, { status: 400 })
    }

    const lead = await getLead(leadId)
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    if (!canWorkLead(lead, user)) {
      return NextResponse.json({ error: `Lead is owned by ${lead.owner.split('@')[0]} — claim it or ask them/a manager.` }, { status: 403 })
    }
    if (!lead.email) return NextResponse.json({ error: 'Lead has no email address' }, { status: 400 })

    const attendees = [
      { email: lead.email, name: lead.name },
      ...(Array.isArray(extraAttendees) ? extraAttendees.filter(Boolean).map((e: string) => ({ email: e })) : []),
    ]

    const meeting = await createTeamsMeeting({
      subject,
      attendees,
      start,
      durationMinutes: Number(durationMinutes) || 30,
      agenda,
    })

    await mutateLeads((leads) => {
      const l = leads.find((x) => x.id === leadId)
      if (!l) return
      touch(l, {
        at: new Date().toISOString(),
        by: user.email,
        type: 'followup',
        description: `Teams meeting scheduled: ${subject} (${formatIstCstFull(start)})`,
      })
    })

    await sendLeadConversion(lead, 'call_booked')
    return NextResponse.json({ success: true, meeting })
  } catch (error: any) {
    console.error('Schedule meeting error:', error)
    const detail = String(error?.message || '')
    const permissionIssue = /Access.*denied|Authorization|Forbidden|ErrorAccessDenied/i.test(detail)
    return NextResponse.json(
      {
        error: permissionIssue
          ? 'Graph app lacks Calendars.ReadWrite permission. Grant it (application) in Entra ID, then retry.'
          : 'Failed to schedule meeting.',
      },
      { status: 500 }
    )
  }
}

// Change/cancel rule: managers (admin, jalal, yusuf) always; everyone else only
// for meetings whose attendees include a lead they own. Returns the matched
// leads so the change is logged on their timelines.
async function authorizeMeeting(user: CrmSessionUser, meetingId: string) {
  const meeting = await getMeeting(meetingId)
  if (!meeting) return { error: 'Meeting not found (it may already be cancelled).', status: 404 as const }
  const attendeeSet = new Set(meeting.attendees.map((a) => a.toLowerCase()))
  const leads = await getLeads()
  const matched = leads.filter((l) => [l.email, ...(l.altEmails || [])].some((e) => e && attendeeSet.has(e.toLowerCase())))
  if (!user.isManager && !matched.some((l) => (l.owner || '').toLowerCase() === user.email)) {
    return { error: 'Only the lead\'s owner or a manager can change this meeting.', status: 403 as const }
  }
  return { meeting, matched }
}

const logOnLeads = (leadIds: string[], by: string, description: string) =>
  mutateLeads((leads) => {
    for (const l of leads) {
      if (leadIds.includes(l.id)) touch(l, { at: new Date().toISOString(), by, type: 'followup', description })
    }
  })

// PATCH → reschedule / edit a meeting (new time, optional comment). Attendees
// get the updated invite by email, so it shows up in the lead's thread too.
export async function PATCH(req: NextRequest) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!graphConfigured()) return NextResponse.json({ error: 'Microsoft Graph is not configured.' }, { status: 503 })

  try {
    const { meetingId, start, durationMinutes, comment, subject } = await req.json()
    if (!meetingId) return NextResponse.json({ error: 'meetingId required' }, { status: 400 })
    const authz = await authorizeMeeting(user, meetingId)
    if ('error' in authz) return NextResponse.json({ error: authz.error }, { status: authz.status })

    await updateMeeting(meetingId, { start, durationMinutes: Number(durationMinutes) || 30, subject, comment })
    const when = start ? ` to ${formatIstCstFull(start)}` : ''
    await logOnLeads(authz.matched.map((l) => l.id), user.email, `Meeting rescheduled${when}: ${authz.meeting.subject}${comment ? ` — "${String(comment).slice(0, 140)}"` : ''}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update meeting error:', error)
    return NextResponse.json({ error: 'Failed to update meeting.' }, { status: 500 })
  }
}

// DELETE → cancel a meeting (optional comment); attendees get the cancellation.
export async function DELETE(req: NextRequest) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!graphConfigured()) return NextResponse.json({ error: 'Microsoft Graph is not configured.' }, { status: 503 })

  try {
    const meetingId = req.nextUrl.searchParams.get('meetingId')
    const comment = req.nextUrl.searchParams.get('comment') || undefined
    if (!meetingId) return NextResponse.json({ error: 'meetingId required' }, { status: 400 })
    const authz = await authorizeMeeting(user, meetingId)
    if ('error' in authz) return NextResponse.json({ error: authz.error }, { status: authz.status })

    await cancelMeeting(meetingId, comment)
    await logOnLeads(authz.matched.map((l) => l.id), user.email, `Meeting cancelled: ${authz.meeting.subject}${comment ? ` — "${comment.slice(0, 140)}"` : ''}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cancel meeting error:', error)
    return NextResponse.json({ error: 'Failed to cancel meeting.' }, { status: 500 })
  }
}
