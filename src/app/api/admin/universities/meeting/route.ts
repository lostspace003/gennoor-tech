import { NextResponse } from 'next/server'
import { requireCampaignUser } from '@/lib/crm/universities-access'
import { getUniversities, mutateUniversities, note } from '@/lib/crm/universities-store'
import { CAMPAIGN_CC, cleanEmails, oneLineText, UNI_STAGE_LABELS } from '@/lib/crm/universities-types'
import { createTeamsMeeting, graphConfigured } from '@/lib/crm/graph'

// Books the call with a university: a Teams meeting on the admin mailbox's calendar, with the people chosen in the CRM
// and Jalal and Yusuf invited. Microsoft sends the invitations. The browser sends which university, when, how long and
// whom; every address is checked again here, and the university's own stage and date are set by this address only.

const idOk = (v: unknown): v is string => typeof v === 'string' && /^GEN-\d{3}$/.test(v)
const DAY_MS = 86_400_000

/** A Teams link is kept only when it is one: read as a link, https, on Microsoft's Teams host. */
function teamsLink(v: unknown): string {
  try {
    const url = new URL(String(v || ''))
    return url.protocol === 'https:' && url.hostname === 'teams.microsoft.com' ? url.href : ''
  } catch { return '' }
}

export async function POST(request: Request) {
  const user = await requireCampaignUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!graphConfigured()) return NextResponse.json({ error: 'Outlook is not connected on this server, so no meeting was made.' }, { status: 503 })
  try {
    const { id, start, day, minutes, attendees } = await request.json()
    if (!idOk(id)) return NextResponse.json({ error: 'Which university?' }, { status: 400 })
    const at = Date.parse(String(start || ''))
    if (Number.isNaN(at) || at < Date.now() - 60_000 || at > Date.now() + 180 * DAY_MS) return NextResponse.json({ error: 'Choose a time from now to six months ahead.' }, { status: 400 })
    if (typeof day !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(day)) return NextResponse.json({ error: 'The day of the call is not a date.' }, { status: 400 })
    const length = [20, 30, 45, 60].includes(Number(minutes)) ? Number(minutes) : 30
    const people = cleanEmails(attendees, 8)
    if (!people || !people.length) return NextResponse.json({ error: 'Choose at least one person at the university to invite.' }, { status: 400 })

    const doc = await getUniversities()
    const u = doc.universities.find((x) => x.id === id)
    if (!u) return NextResponse.json({ error: 'That university is not in the list' }, { status: 404 })

    const short = u.name.replace(/\s*\([^)]*\)\s*$/, '')
    const meeting = await createTeamsMeeting({
      subject: oneLineText(`${short} and Gennoor Tech: course evaluation debrief`, 200),
      attendees: [...new Set([...people, ...CAMPAIGN_CC])].map((email) => ({ email })),
      start: new Date(at).toISOString(),
      durationMinutes: length,
      agenda: '<p>A short call to hear what your faculty thought of the courses, and to talk about what would suit your students.</p><p>Jalal Khan, Gennoor Tech</p>',
    })
    const link = teamsLink(meeting.joinUrl)

    const saved = await mutateUniversities((d) => {
      const x = d.universities.find((y) => y.id === id)
      if (!x) return null
      x.callOn = day
      if (link) x.callLink = link
      if (x.stage !== 'call' && x.stage !== 'partner' && x.stage !== 'closed') {
        note(x, user.email, 'stage', `Moved from ${UNI_STAGE_LABELS[x.stage]} to ${UNI_STAGE_LABELS.call}`)
        x.stage = 'call'
      }
      note(x, user.email, 'call', `Teams call booked for ${day}, ${length} minutes, with ${people.join(', ')}`)
      return x
    })
    return NextResponse.json({ university: saved, message: `The Teams call is booked for ${day}. Invitations went to ${people.join(', ')} and to Jalal and Yusuf.` })
  } catch (error: any) {
    console.error('University meeting error:', String(error?.message || error).slice(0, 200))
    return NextResponse.json({ error: 'The meeting could not be booked. Look at the admin calendar in Outlook before trying again, in case it was made.' }, { status: 502 })
  }
}
