import { NextResponse } from 'next/server'
import { requireCampaignUser } from '@/lib/crm/universities-access'
import { getUniversities, mutateUniversities, note } from '@/lib/crm/universities-store'
import { replyOwner, type UniReply } from '@/lib/crm/universities-types'
import { graphConfigured, listRecentReceived } from '@/lib/crm/graph'
import { emailSendState } from '@/lib/email-service'

// Looks for two things, on request (when the page opens, and when "Check now" is pressed): whether the emails of
// the campaign have really gone (the email service, by the number it gave each send), and whether anyone wrote back
// (the team's mailboxes). It reads who and the first lines, never stores a whole message. Nothing is sent.

const MAX_ASKS = 6 // Azure allows the whole site about 200 questions an hour (docs/CRM.md, section 6)

export async function POST() {
  const user = await requireCampaignUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const doc = await getUniversities()
    const anySent = doc.universities.some((u) => u.emails.some((e) => e.status === 'sent'))
    if (!anySent) return NextResponse.json({ confirmed: 0, failed: 0, replies: 0, note: '' })

    // 1. Has it gone? Oldest waiting first, a few at a time.
    const waiting = doc.universities
      .flatMap((u) => u.emails.filter((e) => e.status === 'sent' && !e.confirmedAt && e.op).map((e) => ({ id: u.id, at: e.at, op: e.op as string })))
      .sort((a, b) => a.at.localeCompare(b.at))
      .slice(0, MAX_ASKS)
    const answers = await Promise.all(waiting.map(async (w) => ({ ...w, answer: await emailSendState(w.op) })))

    // 2. Did they write back?
    let unread = 0
    const found: Array<{ uni: string; reply: UniReply }> = []
    if (graphConfigured()) {
      try {
        const mail = await listRecentReceived(30, 250)
        unread = mail.unread
        for (const m of mail.messages) {
          const owner = replyOwner({ from: m.from, subject: m.subject, receivedAt: m.receivedAt }, doc.universities)
          if (owner) found.push({ uni: owner.id, reply: { id: m.id, at: m.receivedAt, from: m.from, fromName: m.fromName, subject: m.subject.slice(0, 200), preview: m.preview.slice(0, 300) } })
        }
      } catch (e: any) {
        console.error('University reply check failed:', String(e?.message || e).slice(0, 120))
        unread = 1
      }
    }

    const now = new Date().toISOString()
    const result = await mutateUniversities((d) => {
      let confirmed = 0, failed = 0, replies = 0
      for (const a of answers) {
        const u = d.universities.find((x) => x.id === a.id)
        const e = u?.emails.find((x) => x.at === a.at && x.op === a.op)
        if (!u || !e) continue
        if (a.answer.state === 'sent') { e.confirmedAt = now; e.confirmedBy = 'service'; confirmed++ }
        else if (a.answer.state === 'failed') {
          e.status = 'failed'
          e.error = (a.answer.error || 'The email service gave up on it').slice(0, 300)
          failed++
          note(u, 'system', 'email', `Email did not go: ${e.subject}`, now)
        }
      }
      for (const f of found) {
        const u = d.universities.find((x) => x.id === f.uni)
        if (!u || u.replies.some((r) => r.id === f.reply.id)) continue
        u.replies.unshift(f.reply)
        if (u.replies.length > 50) u.replies.length = 50
        // A reply moves a new or emailed university to Replied. A machine never moves it further or closes it.
        if (u.stage === 'new' || u.stage === 'emailed') u.stage = 'replied'
        note(u, 'system', 'reply', `${f.reply.fromName || f.reply.from} replied: ${f.reply.subject}`, now)
        replies++
      }
      return { confirmed, failed, replies }
    })
    return NextResponse.json({ ...result, note: unread ? 'Some mailboxes could not be read just now, so a reply may be missing. Check again in a few minutes.' : '' })
  } catch (error) {
    console.error('University check error:', error)
    return NextResponse.json({ error: 'The check could not be made' }, { status: 500 })
  }
}
