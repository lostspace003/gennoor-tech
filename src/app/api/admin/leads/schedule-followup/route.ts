import { NextResponse } from 'next/server'
import { requireCrmUser, canWorkLead } from '@/lib/crm/access'
import { mutateLeads, getLead, getLeads, touch } from '@/lib/crm/store'
import { downloadDocument } from '@/lib/crm/documents'
import { sendEmail } from '@/lib/email-service'
import { escapeHtml } from '@/lib/escape-html'
import { emailShell } from '@/lib/crm/email-theme'
import { FollowUp } from '@/lib/crm/types'
import { IST, istInstant, leadTimeZone, formatInZone } from '@/lib/crm/timezones'

const ADMIN_CC = process.env.EMAIL_ADMIN || 'admin@gennoor.com'
// Outreach ALWAYS goes out as sales@gennoor.com (user rule, 2026-07-28)
const FROM = process.env.EMAIL_FROM_SALES || 'sales@gennoor.com'

// Follow-up sequence per the outreach playbook:
//   1st follow-up → free 2-hour webinar tailored to their needs
//   2nd follow-up → free 1-day online training
// Poster (uploaded to the document library) is attached when provided.
export async function POST(request: Request) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { leadId, type, title, date, time, notes, posterBlob } = await request.json()
    if (!leadId || !['webinar', 'training'].includes(type) || !title || !date || !time) {
      return NextResponse.json({ error: 'leadId, type (webinar|training), title, date and time are required' }, { status: 400 })
    }

    const lead = await getLead(leadId)
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    if (!canWorkLead(lead, user)) {
      return NextResponse.json({ error: `Lead is owned by ${lead.owner.split('@')[0]} — claim it or ask them/a manager.` }, { status: 403 })
    }
    if (!lead.email) return NextResponse.json({ error: 'Lead has no email address' }, { status: 400 })

    const isWebinar = type === 'webinar'
    const followUp: FollowUp = {
      id: `FU-${Date.now()}`,
      type,
      title,
      date,
      time,
      notes,
      posterBlob,
      createdBy: user.email,
      createdAt: new Date().toISOString(),
    }

    const attachments: Array<{ filename: string; content: Buffer; contentType: string }> = []
    if (posterBlob) {
      const poster = await downloadDocument(posterBlob)
      if (poster) {
        attachments.push({
          filename: posterBlob.split('/').pop() || 'poster',
          content: poster.content,
          contentType: poster.contentType,
        })
      }
    }

    const first = (lead.name || 'there').split(/\s+/)[0]
    // The picked time is IST wall-clock; anchoring with +05:30 keeps the
    // instant correct even though the server runs in UTC. When we know the
    // lead's time zone (from country/city) the invite leads with THEIR time.
    const startAt = istInstant(date, time)
    const istLabel = formatInZone(startAt, IST)
    const leadTz = leadTimeZone(lead.country, lead.city)
    const leadLabel = leadTz && leadTz !== IST ? formatInZone(startAt, leadTz) : null

    const html = emailShell(`
      <p style="margin:0 0 14px">Dear ${escapeHtml(first)},</p>
      <p style="margin:0 0 14px">
        ${isWebinar
          ? `We'd love to invite ${escapeHtml(lead.company || 'your team')} to a <strong>free 2-hour webinar</strong>, tailored to your team's needs. This is a relationship-building session — no cost, no obligation.`
          : `As promised, we'd like to offer ${escapeHtml(lead.company || 'your team')} a <strong>free 1-day online training</strong> for your people. It's completely free — our way of building the relationship.`}
      </p>
      <div style="background:#f8fafc;border-left:4px solid #2563EB;padding:16px 18px;border-radius:0 8px 8px 0;margin:0 0 18px">
        <p style="margin:0 0 4px;font-size:16px"><strong>${escapeHtml(title)}</strong></p>
        ${leadLabel
          ? `<p style="margin:0;color:#0f172a"><strong>${leadLabel}</strong>${lead.country ? ` (${escapeHtml(lead.country)} time)` : ''}</p>
        <p style="margin:2px 0 0;color:#64748b;font-size:13px">${istLabel} · Online (${isWebinar ? '2 hours' : 'full day'})</p>`
          : `<p style="margin:0;color:#475569">${istLabel} · Online (${isWebinar ? '2 hours' : 'full day'})</p>`}
      </div>
      ${notes ? `<p style="margin:0 0 14px;white-space:pre-line">${escapeHtml(notes)}</p>` : ''}
      <p style="margin:0 0 14px">Reply to this email to confirm and we'll send the joining link.</p>
      <p style="margin:0">Best regards,<br/><strong>Team Gennoor Tech</strong></p>`, { senderEmail: FROM })

    const result = await sendEmail({
      to: lead.email,
      // admin@ + the sender always on CC so replies reach both mailboxes
      cc: [...new Set([ADMIN_CC, user.email])],
      from: FROM,
      fromName: 'Gennoor Tech',
      subject: isWebinar
        ? `Invitation: Free 2-hour webinar for ${lead.company || 'your team'} — ${title}`
        : `Invitation: Free 1-day online training — ${title}`,
      html,
      attachments: attachments.length ? attachments : undefined,
    })

    if (!result.success) {
      return NextResponse.json({ error: `Invite email failed: ${result.error}` }, { status: 500 })
    }

    followUp.sentAt = new Date().toISOString()
    await mutateLeads((leads) => {
      const l = leads.find((x) => x.id === leadId)
      if (!l) return
      l.followUps.unshift(followUp)
      l.emailHistory.unshift({
        at: followUp.sentAt!,
        by: user.email,
        to: lead.email,
        subject: `${isWebinar ? 'Webinar' : 'Training'} invite: ${title}`,
        status: 'sent',
      })
      if (l.status === 'new') l.status = 'contacted'
      touch(l, {
        at: followUp.sentAt!,
        by: user.email,
        type: 'followup',
        description: `${isWebinar ? 'Free webinar' : 'Free 1-day training'} invite sent: ${title} (${date} ${time})`,
      })
    })

    return NextResponse.json({ success: true, followUp })
  } catch (error) {
    console.error('Schedule follow-up error:', error)
    return NextResponse.json({ error: 'Failed to schedule follow-up' }, { status: 500 })
  }
}

export async function GET() {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const leads = await getLeads()
    const followUps = leads.flatMap((l) =>
      l.followUps.map((f) => ({ ...f, leadId: l.id, leadName: l.name, leadCompany: l.company }))
    )
    followUps.sort((a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`))
    return NextResponse.json({ followUps })
  } catch (error) {
    console.error('Get follow-ups error:', error)
    return NextResponse.json({ error: 'Failed to fetch follow-ups' }, { status: 500 })
  }
}
