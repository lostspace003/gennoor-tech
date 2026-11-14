import { NextRequest, NextResponse } from 'next/server'
import { requireCrmUser } from '@/lib/crm/access'
import { getRegistrations, mutateRegistrations, getSettings, saveSettings, type PaymentState, type CohortSettings } from '@/lib/weekend'
import { WEEKEND, nextCohort, cohortById } from '@/data/ai-weekend'
import { WEEKEND_EMAILS, CAMPAIGN_KINDS, buildWeekendEmail, type WeekendEmailKind } from '@/lib/weekend-emails'
import { sendEmail } from '@/lib/email-service'
import { getLeads } from '@/lib/crm/store'
import { getEnquiries } from '@/lib/azure-storage'
import { razorpayConfigured, razorpayTestMode } from '@/lib/razorpay'
import { payUrl } from '@/lib/weekend-pay'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const FROM = process.env.EMAIL_FROM_WEBINAR || 'webinar@gennoor.com'
/**
 * Most people in one send of a campaign email. It was 200; the email service allows the whole site about 100
 * emails an hour, and the codes that let learners sign in share that, so one send stays well under it.
 */
const INVITE_LIMIT = 50
const isEmail = (s: string) => /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(s)
/** Who has had a campaign email that goes to chosen people: the invitation keeps its own list, the others share one. */
const hadIt = (s: CohortSettings, kind: string): Record<string, string> => (kind === 'invite' ? s.invited : s.sentTo?.[kind]) || {}
const publicSettings = (s: CohortSettings = {}) => ({
  joinUrl: s.joinUrl || '', payment: s.payment || '', kitUrl: s.kitUrl || '', invitedCount: Object.keys(s.invited || {}).length,
  /** How many people each campaign email has gone to, for this weekend. No addresses. */
  sent: Object.fromEntries(WEEKEND_EMAILS.filter((e) => e.outreach).map((e) => [e.kind, Object.keys(hadIt(s, e.kind)).length])),
})

/** The order of the campaign emails is one for all weekends, kept beside the weekends' own settings. */
const ALL = '_all'
function campaignOrder(settings: Record<string, CohortSettings>): WeekendEmailKind[] {
  const saved = (settings[ALL]?.order || []).filter((k): k is WeekendEmailKind => CAMPAIGN_KINDS.includes(k as WeekendEmailKind))
  return [...saved, ...CAMPAIGN_KINDS.filter((k) => !saved.includes(k))]
}

/**
 * Addresses that must not get a campaign email: a lead whose emails were stopped (they asked, or the team
 * stopped them), a lead who replied "stop", and anyone who pressed Unsubscribe in an email of ours.
 */
async function askedToStop(): Promise<Set<string>> {
  const [leads, outs] = await Promise.all([getLeads(), getEnquiries('Unsubscribe', 3650)])
  const set = new Set<string>()
  for (const l of leads) {
    if (!l.sequence?.stopped && l.reply?.kind !== 'stop') continue
    for (const e of [l.email, ...(l.altEmails || [])]) if (e) set.add(e.trim().toLowerCase())
  }
  for (const o of outs) { const e = String(o.email || '').trim().toLowerCase(); if (e) set.add(e) }
  return set
}

/**
 * Staff: the AI Weekend desk.
 *   GET                              everyone registered, the settings, the list of emails
 *   GET ?preview=<kind>&cohort=<id>  one email exactly as it will be received
 */
export async function GET(req: NextRequest) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const settings = await getSettings().catch(() => ({} as Record<string, CohortSettings>))

    const preview = req.nextUrl.searchParams.get('preview') as WeekendEmailKind | null
    if (preview) {
      const cohort = cohortById(req.nextUrl.searchParams.get('cohort') || '')
      if (!cohort || !WEEKEND_EMAILS.some((e) => e.kind === preview)) return NextResponse.json({ error: 'Unknown email' }, { status: 400 })
      const samplePay = preview === 'payment' && razorpayConfigured() ? 'https://www.gennoor.com/ai-weekend' : ''
      return NextResponse.json(buildWeekendEmail(preview, { name: 'Priya Sharma' }, cohort, settings[cohort.id], FROM, samplePay))
    }

    const rows = (await getRegistrations()).sort((a, b) => b.at.localeCompare(a.at))
    const current = nextCohort()
    const ids = [...new Set([current.id, ...rows.map((r) => r.cohort)])].sort().reverse()
    return NextResponse.json({
      current: current.id,
      seats: WEEKEND.seats,
      fee: WEEKEND.fee,
      cohorts: ids.map((id) => ({ id, label: cohortById(id)?.label || id })),
      settings: Object.fromEntries(ids.map((id) => [id, publicSettings(settings[id])])),
      emails: WEEKEND_EMAILS,
      order: campaignOrder(settings),
      inviteLimit: INVITE_LIMIT,
      online: razorpayConfigured(),
      testMode: razorpayConfigured() && razorpayTestMode(),
      registrations: rows,
    })
  } catch (e) {
    console.error('weekend list failed', e)
    return NextResponse.json({ error: 'Could not load the registrations' }, { status: 500 })
  }
}

/**
 * Staff: save what the emails need for one weekend. { cohort, joinUrl?, payment?, kitUrl? }
 * Or the order of the campaign emails, which is the same for every weekend: { order: [kind, ...] }
 */
export async function PUT(req: NextRequest) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const b = await req.json()
    if (Array.isArray(b.order)) {
      const order = [...new Set<string>((b.order as unknown[]).map(String))].filter((k) => CAMPAIGN_KINDS.includes(k as WeekendEmailKind))
      await saveSettings(ALL, { order })
      return NextResponse.json({ success: true, order: campaignOrder({ [ALL]: { order } }) })
    }
    const cohort = cohortById(String(b.cohort || ''))
    if (!cohort) return NextResponse.json({ error: 'Unknown weekend' }, { status: 400 })
    const patch: CohortSettings = {}
    for (const key of ['joinUrl', 'kitUrl'] as const) {
      if (typeof b[key] !== 'string') continue
      const v = b[key].trim()
      if (v && !/^https:\/\/\S+$/.test(v)) return NextResponse.json({ error: 'Links must start with https://' }, { status: 400 })
      patch[key] = v
    }
    if (typeof b.payment === 'string') patch.payment = b.payment.trim().slice(0, 1500)
    return NextResponse.json({ success: true, settings: publicSettings(await saveSettings(cohort.id, patch)) })
  } catch (e) {
    console.error('weekend settings failed', e)
    return NextResponse.json({ error: 'Could not save' }, { status: 500 })
  }
}

/**
 * Staff: send one of the weekend's emails.
 *   { cohort, kind, onlyNew?, recipients? }
 * Each kind has a fixed audience (see WEEKEND_EMAILS). `recipients` is used by the campaign emails that go to
 * chosen people (`outreach`): one address per line, optionally "Name, address". From those, three kinds of
 * people are always left out: anyone already registered for this weekend, anyone who asked us to stop, and
 * (unless `onlyNew` is false) anyone who already had this email.
 */
export async function POST(req: NextRequest) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const b = await req.json()
    const cohort = cohortById(String(b.cohort || ''))
    if (!cohort) return NextResponse.json({ error: 'Unknown weekend' }, { status: 400 })
    const info = WEEKEND_EMAILS.find((e) => e.kind === b.kind)
    if (!info) return NextResponse.json({ error: 'Unknown email' }, { status: 400 })
    const onlyNew = b.onlyNew !== false
    const settings = (await getSettings())[cohort.id] || {}
    const online = razorpayConfigured()
    if (info.needs && !settings[info.needs] && !(info.kind === 'payment' && online)) return NextResponse.json({ error: `Add ${info.needsLabel} first, then save.` }, { status: 400 })

    const registered = (await getRegistrations()).filter((r) => r.cohort === cohort.id && r.payment !== 'refunded')

    // Who gets it
    let people: Array<{ id?: string; name: string; email: string }>
    let skipped = 0
    let stopped = 0
    if (info.outreach) {
      // If this cannot be read, nothing is sent: better no email than one to someone who asked for none
      const never = await askedToStop().catch(() => null)
      if (!never) return NextResponse.json({ error: 'Could not check who has asked us to stop. Nothing was sent. Please try again in a minute.' }, { status: 503 })
      const already = new Set([...registered.map((r) => r.email), ...(onlyNew ? Object.keys(hadIt(settings, info.kind)) : [])])
      const seen = new Set<string>()
      people = []
      for (const line of String(b.recipients || '').split(/[\n;]+/)) {
        const parts = line.split(/[,\t<>]+/).map((s) => s.trim()).filter(Boolean)
        const email = (parts.find(isEmail) || '').toLowerCase()
        if (!email) continue
        if (never.has(email)) { stopped++; continue }
        if (already.has(email) || seen.has(email)) { skipped++; continue }
        seen.add(email)
        people.push({ email, name: parts.find((x) => !isEmail(x)) || '' })
      }
      if (people.length > INVITE_LIMIT) return NextResponse.json({ error: `That is ${people.length} people. Send at most ${INVITE_LIMIT} at a time.` }, { status: 400 })
    } else {
      const audience = info.kind === 'payment' ? registered.filter((r) => r.payment === 'pending')
        : info.kind === 'reminder' || info.kind === 'thanks' ? registered
        : registered.filter((r) => r.payment === 'paid')
      const fresh = onlyNew ? audience.filter((r) => !r.emails?.[info.kind]) : audience
      skipped = audience.length - fresh.length
      people = fresh.map((r) => ({ id: r.id, name: r.name, email: r.email }))
    }
    if (people.length === 0) {
      return NextResponse.json({ error: skipped ? 'Everyone on the list has already had this email, or is already registered.' : stopped ? 'Everyone on the list has asked us to stop writing.' : info.outreach ? 'Choose at least one person, or paste an email address.' : 'Nobody matches yet.' }, { status: 400 })
    }

    const sent: typeof people = []
    const failed: string[] = []
    for (const person of people) {
      const mail = buildWeekendEmail(info.kind, person, cohort, settings, FROM, info.kind === 'payment' && online && person.id ? payUrl(person.id) : '')
      const r = await sendEmail({ to: person.email, from: FROM, fromName: 'Gennoor Tech', subject: mail.subject, html: mail.html }).catch((e) => ({ success: false, error: String(e) }))
      if (r.success) sent.push(person)
      else failed.push(person.email)
    }

    // Remember who had it, so "only people who have not had it" works next time
    const now = new Date().toISOString()
    if (sent.length && info.outreach) {
      const had = { ...hadIt(settings, info.kind), ...Object.fromEntries(sent.map((x) => [x.email, now])) }
      await saveSettings(cohort.id, info.kind === 'invite' ? { invited: had } : { sentTo: { ...(settings.sentTo || {}), [info.kind]: had } })
    } else if (sent.length) {
      const ids = new Set(sent.map((x) => x.id))
      await mutateRegistrations((rows) => { for (const r of rows) if (ids.has(r.id)) r.emails = { ...(r.emails || {}), [info.kind]: now } })
    }
    return NextResponse.json({ success: failed.length === 0, sent: sent.length, skipped, stopped, failed })
  } catch (e) {
    console.error('weekend send failed', e)
    return NextResponse.json({ error: 'Could not send the email' }, { status: 500 })
  }
}

/** Staff: record a payment or a note. { id, payment?, note? } */
export async function PATCH(req: NextRequest) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id, payment, note } = await req.json()
    if (payment !== undefined && !['pending', 'paid', 'refunded'].includes(payment)) {
      return NextResponse.json({ error: 'Unknown payment state' }, { status: 400 })
    }
    const found = await mutateRegistrations((rows) => {
      const r = rows.find((x) => x.id === id)
      if (!r) return false
      if (payment !== undefined) r.payment = payment as PaymentState
      if (typeof note === 'string') r.note = note.slice(0, 500)
      return true
    })
    if (!found) return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('weekend update failed', e)
    return NextResponse.json({ error: 'Could not save the change' }, { status: 500 })
  }
}

/** Managers: remove a registration (a test entry, a duplicate). */
export async function DELETE(req: NextRequest) {
  const user = await requireCrmUser()
  if (!user?.isManager) return NextResponse.json({ error: 'Only managers can remove a registration' }, { status: 403 })
  try {
    const id = req.nextUrl.searchParams.get('id')
    const removed = await mutateRegistrations((rows) => {
      const i = rows.findIndex((r) => r.id === id)
      if (i === -1) return false
      rows.splice(i, 1)
      return true
    })
    if (!removed) return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('weekend delete failed', e)
    return NextResponse.json({ error: 'Could not remove it' }, { status: 500 })
  }
}
