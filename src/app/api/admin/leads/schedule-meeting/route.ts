import { NextRequest, NextResponse } from 'next/server'
import { requireCrmUser, canWorkLead } from '@/lib/crm/access'
import { mutateLeads, getLead, touch } from '@/lib/crm/store'
import { graphConfigured, createTeamsMeeting, listUpcomingMeetings } from '@/lib/crm/graph'

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
        description: `Teams meeting scheduled: ${subject} (${new Date(start).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST)`,
      })
    })

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
