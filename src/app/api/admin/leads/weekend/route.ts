import { NextRequest, NextResponse } from 'next/server'
import { requireCrmUser, canWorkLead } from '@/lib/crm/access'
import { getLeads } from '@/lib/crm/store'
import { isOpen } from '@/lib/crm/sequence'
import { greetingOf } from '@/lib/crm/greeting'
import { needsAnswer, sendRoom, HOURLY_SEND_LIMIT } from '@/lib/crm/replies'
import { campaignOrder, hadIt, noteWeekendEmails } from '@/lib/crm/weekend-outreach'
import { WEEKEND_EMAILS, buildWeekendEmail, closesWords } from '@/lib/weekend-emails'
import { nextCohort } from '@/data/ai-weekend'
import { getRegistrations, getSettings, saveSettings, type CohortSettings } from '@/lib/weekend'
import { getEnquiries } from '@/lib/azure-storage'
import { sendEmail } from '@/lib/email-service'
import type { Lead } from '@/lib/crm/types'

export const dynamic = 'force-dynamic'

const FROM = process.env.EMAIL_FROM_WEBINAR || 'webinar@gennoor.com'
/** The campaign emails that go to people someone chooses. The thank-you goes to people who registered, from the AI Weekend page. */
const OUTREACH = WEEKEND_EMAILS.filter((e) => e.outreach)
const addressesOf = (lead: Pick<Lead, 'email' | 'altEmails'>) => [lead.email, ...(lead.altEmails || [])].map((e) => (e || '').trim().toLowerCase()).filter(Boolean)

/** When this lead last had each campaign email for one weekend: from the lead's own record, or the AI Weekend page's list. */
function hadByKind(lead: Lead, settings: CohortSettings, cohort: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const e of OUTREACH) {
    const fromPage = addressesOf(lead).map((a) => hadIt(settings, e.kind)[a]).filter(Boolean).sort().pop()
    const fromLead = (lead.emailHistory || []).filter((r) => r.weekend?.kind === e.kind && r.weekend.cohort === cohort && r.status === 'sent').map((r) => r.at).sort().pop()
    const at = [fromPage, fromLead].filter(Boolean).sort().pop()
    if (at) out[e.kind] = at
  }
  return out
}

/**
 * The AI Weekend campaign, for one lead's Emails board.
 *   GET ?leadId=          the weekend that is open, the campaign emails in their order, what this lead has had
 *   GET ?leadId=&kind=    that email exactly as this lead would receive it
 */
export async function GET(req: NextRequest) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const lead = (await getLeads()).find((l) => l.id === req.nextUrl.searchParams.get('leadId'))
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    const cohort = nextCohort()
    const all = await getSettings().catch(() => ({} as Record<string, CohortSettings>))
    const settings = all[cohort.id] || {}

    const kind = req.nextUrl.searchParams.get('kind')
    if (kind) {
      const info = OUTREACH.find((e) => e.kind === kind)
      if (!info) return NextResponse.json({ error: 'Unknown email' }, { status: 400 })
      const mail = buildWeekendEmail(info.kind, { name: greetingOf(lead) }, cohort, settings, FROM)
      return NextResponse.json({ kind: info.kind, title: info.title, subject: mail.subject, html: mail.html })
    }

    const mine = addressesOf(lead)
    const registered = (await getRegistrations().catch(() => [])).some((r) => r.cohort === cohort.id && r.payment !== 'refunded' && mine.includes(r.email))
    return NextResponse.json({
      cohort: { id: cohort.id, label: cohort.label, closes: closesWords(cohort).full },
      registered,
      emails: campaignOrder(all).map((k) => OUTREACH.find((e) => e.kind === k)).filter((e): e is (typeof OUTREACH)[number] => !!e).map((e) => ({ kind: e.kind, title: e.title, when: e.when })),
      had: hadByKind(lead, settings, cohort.id),
      // The names of all the campaign's emails, for the cards of what was sent
      titles: Object.fromEntries(WEEKEND_EMAILS.map((e) => [e.kind, e.title])),
    })
  } catch (e) {
    console.error('lead weekend info failed', e)
    return NextResponse.json({ error: 'Could not load the AI Weekend emails' }, { status: 500 })
  }
}

/**
 * Send one campaign email of the AI Weekend to one lead: { leadId, kind, again? }.
 * The same people are protected as on the AI Weekend page: nobody whose emails were stopped, nobody who pressed
 * Unsubscribe, nobody already registered for that weekend, and (unless `again`) nobody who already had this email.
 */
export async function POST(req: NextRequest) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const b = await req.json()
    const info = OUTREACH.find((e) => e.kind === b.kind)
    if (!info) return NextResponse.json({ error: 'Unknown email' }, { status: 400 })
    const leads = await getLeads()
    const lead = leads.find((l) => l.id === b.leadId)
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    const refuse = (error: string, status = 409) => NextResponse.json({ error }, { status })
    if (!canWorkLead(lead, user)) return refuse(`This lead is held by ${lead.owner.split('@')[0]}.`, 403)
    if (!isOpen(lead)) return refuse('This lead is archived or closed.')
    if (!lead.email) return refuse('This lead has no email address.')
    if (lead.sequence?.stopped || lead.reply?.kind === 'stop') return refuse('The emails for this lead were stopped. Nothing was sent.')
    if (needsAnswer(lead)) return refuse('They replied and are waiting for an answer. Answer first; nothing was sent.')
    const mine = addressesOf(lead)
    // If this cannot be read, nothing is sent: better no email than one to someone who asked for none
    const outs = await getEnquiries('Unsubscribe', 3650).catch(() => null)
    if (!outs) return refuse('Could not check who has asked us to stop. Nothing was sent. Please try again in a minute.', 503)
    if (outs.some((o) => mine.includes(String(o.email || '').trim().toLowerCase()))) return refuse('This person pressed Unsubscribe in one of our emails. Nothing was sent.')

    const cohort = nextCohort()
    const settings = (await getSettings())[cohort.id] || {}
    if ((await getRegistrations()).some((r) => r.cohort === cohort.id && r.payment !== 'refunded' && mine.includes(r.email))) {
      return refuse(`They are already registered for the weekend of ${cohort.label}. Nothing was sent.`)
    }
    const before = hadByKind(lead, settings, cohort.id)[info.kind]
    if (before && b.again !== true) return NextResponse.json({ error: `They already had this email for this weekend (${new Date(before).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' })}).`, already: true }, { status: 409 })
    if (sendRoom(leads) === 0) return refuse(`${HOURLY_SEND_LIMIT} emails have gone in the last hour, which is all the email service safely allows. Try again a little later.`, 429)

    const mail = buildWeekendEmail(info.kind, { name: greetingOf(lead) }, cohort, settings, FROM)
    const r = await sendEmail({ to: lead.email, from: FROM, fromName: 'Gennoor Tech', subject: mail.subject, html: mail.html })
    if (!r.success) return refuse(`The email service did not take it${r.error ? `: ${r.error.slice(0, 200)}` : ''}. Nothing was sent.`, 502)

    const now = new Date().toISOString()
    const address = lead.email.trim().toLowerCase()
    const had = { ...hadIt(settings, info.kind), [address]: now }
    await saveSettings(cohort.id, info.kind === 'invite' ? { invited: had } : { sentTo: { ...(settings.sentTo || {}), [info.kind]: had } })
    await noteWeekendEmails([{ email: lead.email, subject: mail.subject, html: mail.html, op: r.messageId, done: r.done }], info.kind, cohort.id, user.email, { claim: true, now })
    return NextResponse.json({ success: true, onItsWay: !r.done, title: info.title })
  } catch (e) {
    console.error('lead weekend send failed', e)
    return NextResponse.json({ error: 'Could not send the email' }, { status: 500 })
  }
}
