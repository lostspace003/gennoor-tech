import { NextResponse } from 'next/server'
import { campaignByKey, campaignOfId, type CampaignKey } from '@/data/partnership-campaigns'
import { requireCampaignUser } from '@/lib/crm/universities-access'
import { getUniversities, mutateUniversities, note, sentThisHour } from '@/lib/crm/universities-store'
import { CAMPAIGN_CC, CAMPAIGN_FROM, formLinkOf, oneLineText, whyNotReady, withForm, type UniEmail } from '@/lib/crm/universities-types'
import { campaignEmailHtml } from '@/lib/crm/universities-email'
import { sendState } from '@/lib/crm/delivery'
import { graphConfigured, sendFromOutlook } from '@/lib/crm/graph'
import { teamMember } from '@/lib/crm/team'

// One email to one university, from the admin mailbox, with Jalal and Yusuf in copy (owner, 27 November 2026).
// What goes out is what is SAVED on the university, read here: the browser sends only which university. Every
// address and every line was checked when it was saved (`cleanUniPatch`) and the email is checked again here.

const SIGNER = 'jalalkhan@gennoor.com'
const SENDING_HOLD_MS = 2 * 60_000

export async function POST(request: Request) {
  const user = await requireCampaignUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id, again } = await request.json()
    const campaign = campaignOfId(id)
    if (!campaign) return NextResponse.json({ error: 'Which one?' }, { status: 400 })

    const doc = await getUniversities(campaign.key)
    const u = doc.universities.find((x) => x.id === id)
    if (!u) return NextResponse.json({ error: 'That university is not in the list' }, { status: 404 })

    const problem = whyNotReady(u)
    if (problem) return NextResponse.json({ error: problem }, { status: 400 })

    // An email that has gone, or is on its way, is never sent twice by accident (docs/CRM.md, section 6).
    const gone = u.emails.find((e) => e.status === 'sent' && sendState(e) !== 'unconfirmed')
    if (gone && again !== true) {
      return NextResponse.json({ error: 'An email to this university has already gone. Use "Send another" if you mean to write again.', already: true }, { status: 409 })
    }
    const hour = await sentThisHour(doc.universities, campaign.key)
    if (hour.used >= hour.limit) return NextResponse.json({ error: `The limit of ${hour.limit} emails an hour has been reached for the CRM. Try again a little later.` }, { status: 429 })

    // Hold this university while the email is being sent, so a second press cannot send it again.
    const held = await mutateUniversities((d) => {
      const x = d.universities.find((y) => y.id === id)
      if (!x) return false
      if (x.sendingSince && Date.now() - Date.parse(x.sendingSince) < SENDING_HOLD_MS) return false
      x.sendingSince = new Date().toISOString()
      return true
    }, campaign.key)
    if (!held) return NextResponse.json({ error: 'This email is already being sent. Wait a moment and look again.' }, { status: 409 })

    const to = u.draft.to
    const cc = [...new Set([...CAMPAIGN_CC, ...u.draft.cc])].filter((e) => !to.includes(e))
    const formUrl = formLinkOf(u)
    const subject = oneLineText(withForm(u.draft.subject, formUrl), 200)
    const text = withForm(u.draft.body, formUrl)
    const signer = teamMember(SIGNER)
    const html = campaignEmailHtml(text, { name: signer.name, email: signer.email, phones: signer.phones }, formUrl, campaign.audience)

    // Through Outlook (owner, 27 November 2026): the email sits in admin@'s Sent Items and a reply threads under it.
    let result: { success: true } | { success: false; error: string }
    try {
      if (!graphConfigured()) throw new Error('Outlook is not connected on this server, so nothing was sent')
      await sendFromOutlook({ from: CAMPAIGN_FROM, to, cc, subject, html })
      result = { success: true }
    } catch (e: any) {
      const refused = e?.statusCode === 429 ? 'Outlook asked us to wait. Nothing was sent. Try again in a few minutes.' : String(e?.message || 'The email could not be sent')
      result = { success: false, error: refused.slice(0, 300) }
    }

    const now = new Date().toISOString()
    await mutateUniversities((d) => {
      const x = d.universities.find((y) => y.id === id)
      if (!x) return
      const ok = result.success === true
      const record: UniEmail = {
        at: now, by: user.email, to: to.join(', '), cc, subject, body: text.slice(0, 12000),
        status: ok ? 'sent' : 'failed',
        kind: gone ? 'again' : 'first',
        ...(ok ? { confirmedAt: now, confirmedBy: 'outlook' as const } : {}),
        ...(!result.success ? { error: result.error } : {}),
      }
      x.emails.unshift(record)
      if (ok && x.stage === 'new') x.stage = 'emailed'
      x.sendingSince = undefined
      note(x, user.email, 'email', ok ? `Email sent: ${subject}` : `Email FAILED: ${subject}`, now)
    }, campaign.key)

    if (!result.success) return NextResponse.json({ error: result.error }, { status: 502 })
    return NextResponse.json({ success: true, done: true, message: `Sent from Outlook (${CAMPAIGN_FROM}) to ${to.join(', ')}, with ${cc.join(' and ')} in copy` })
  } catch (error) {
    console.error('University email error:', error)
    return NextResponse.json({ error: 'The email could not be sent' }, { status: 500 })
  }
}
