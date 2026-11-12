import { getEnquiries } from '@/lib/azure-storage'
import { listCertificatesByWorkshop } from '@/lib/certificates'
import { listLmsCourses } from '@/lib/lms'
import { listPurchases } from '@/lib/lms-access'
import { listAllReviewsForAdmin } from '@/lib/lms-community'
import { readBlob, writeBlob } from '@/lib/social/studio'
import { mutateLeads } from './store'
import { newLead, type AutoSource, type Lead } from './types'

/**
 * People who came to us become leads without anyone typing them in.
 *
 * Four things make someone a lead: they sent a form on the website, they bought
 * a course, they finished a course, or they reviewed one. Each adds the person
 * with only what the lead sheet holds (name, email, phone, organization) and ONE
 * short line saying what they did. Someone who is already a lead just gets that
 * line added to their history.
 *
 * It runs by itself when the CRM lead list is opened, at most every ten minutes.
 * Every event is remembered once handled, so a lead that was archived or deleted
 * is not added again and no line is written twice.
 *
 * Not included, on purpose: AI Weekend sign-ups (they have their own page),
 * job applications and newsletter sign-ups.
 */

interface Signal {
  /** Unique per event, so it is only ever handled once */
  key: string
  email: string
  name: string
  phone?: string
  company?: string
  designation?: string
  country?: string
  source: AutoSource
  /** The one line that goes on the lead */
  line: string
  at: string
}

const SEEN_BLOB = 'auto-leads-seen.json'
const BY = 'website'
const FORM_LABEL: Record<string, string> = {
  ContactEnquiry: 'Contact form', CustomTraining: 'Custom training request', ExpertCallBooking: 'Call booking',
  TrainingEnquiry: 'Training enquiry', CertificationEnquiry: 'Certification enquiry', WebinarRegistration: 'Webinar sign-up',
  ClaudeCoworkRegistration: 'Claude workshop sign-up',
}
const clean = (v: unknown, max = 120) => {
  const text = String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max)
  // What people type into a box they wanted to leave empty
  return /^(na|n\/a|nil|none|no|-+|\.+)$/i.test(text) ? '' : text
}
const emailOf = (v: unknown) => clean(v, 200).toLowerCase()
const day = (iso: string) => {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '' : ` on ${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })}`
}
/** A name to show when the person gave none: the part of the email before the @. */
const nameFor = (name: unknown, email: string) => clean(name) || email.split('@')[0]

/** Everything that has happened so far, oldest first. Reads only; nothing is written. */
export async function collectSignals(): Promise<Signal[]> {
  const out: Signal[] = []
  const [enquiries, purchases, reviews, courses] = await Promise.all([
    getEnquiries(undefined, 365).catch(() => []),
    listPurchases().catch(() => []),
    listAllReviewsForAdmin().catch(() => []),
    listLmsCourses().catch(() => []),
  ])
  const title = (slug: string) => courses.find((c) => c.slug === slug)?.code || slug

  for (const r of enquiries) {
    const label = FORM_LABEL[String(r.type)]
    const email = emailOf(r.email)
    if (!label || !email) continue
    const about = clean(r.topic || r.service || r.programTitle || r.webinarTitle || r.serviceName, 80)
    out.push({
      key: `form:${r.type}:${r.rowKey}`, email, name: nameFor(r.name || r.fullName, email), phone: clean(r.phone || r.whatsapp, 40), company: clean(r.organization || r.company, 100),
      designation: clean(r.designation || r.role, 80), country: clean(r.country, 60),
      source: 'Website enquiry', line: `${label}${about ? `: ${about}` : ''}${day(String(r.createdAt || ''))}`, at: String(r.createdAt || ''),
    })
  }
  for (const p of purchases) {
    const email = emailOf(p.email)
    if (!email) continue
    out.push({ key: `bought:${email}:${p.slug}`, email, name: nameFor(p.name, email), source: 'Bought a course', line: `Bought ${title(p.slug)}${day(p.at)}`, at: p.at })
  }
  for (const c of courses) {
    for (const cert of await listCertificatesByWorkshop(c.slug).catch(() => [])) {
      const email = emailOf(cert.recipientEmail)
      if (!email || cert.status === 'revoked') continue
      out.push({ key: `completed:${email}:${c.slug}`, email, name: nameFor(cert.recipientName, email), source: 'Completed a course', line: `Completed ${c.code || c.slug}${day(cert.issueDate)}`, at: cert.issueDate })
    }
  }
  for (const r of reviews) {
    const email = emailOf(r.email)
    if (!email || !email.includes('@')) continue
    out.push({ key: `reviewed:${email}:${r.slug}`, email, name: nameFor(r.name, email), source: 'Reviewed a course', line: `Rated ${title(r.slug)} ${r.rating} out of 5${day(r.createdAt)}`, at: r.createdAt })
  }
  // Our own addresses are tests, not leads
  return out.filter((s) => !s.email.endsWith('@gennoor.com')).sort((a, b) => a.at.localeCompare(b.at))
}

/** Add every new event to the leads. Returns how many leads were added and how many existing ones got a line. */
export async function syncAutoLeads(): Promise<{ added: number; noted: number }> {
  const signals = await collectSignals()
  let seen = new Set<string>()
  try {
    const raw = await readBlob(SEEN_BLOB)
    if (raw) seen = new Set(JSON.parse(raw.toString('utf-8')) as string[])
  } catch {
    // unreadable list: treat everything as new; existing leads are still matched by email, so nobody is added twice
  }
  const fresh = signals.filter((s) => !seen.has(s.key))
  if (fresh.length === 0) return { added: 0, noted: 0 }

  const result = await mutateLeads((leads) => {
    let added = 0, noted = 0
    const byEmail = new Map<string, Lead>()
    for (const l of leads) for (const e of [l.email, ...(l.altEmails || [])]) if (e) byEmail.set(e.toLowerCase(), l)
    for (const s of fresh) {
      const at = s.at || new Date().toISOString()
      const existing = byEmail.get(s.email)
      if (existing) {
        if (existing.activities.some((a) => a.description === s.line)) continue
        if (!existing.phone && s.phone) existing.phone = s.phone
        if (!existing.company && s.company) existing.company = s.company
        if (!existing.designation && s.designation) existing.designation = s.designation
        if (!existing.country && s.country) existing.country = s.country
        // Recorded with the date it happened, without pushing an old lead to the top of the list
        existing.activities.unshift({ at, by: BY, type: 'note', description: s.line })
        noted++
      } else {
        const lead = newLead({ name: s.name, email: s.email, phone: s.phone, company: s.company, designation: s.designation, country: s.country, source: s.source, notes: s.line, createdAt: at, activities: [{ at, by: BY, type: 'created', description: s.line }] }, BY)
        leads.unshift(lead)
        byEmail.set(s.email, lead)
        added++
      }
    }
    return { added, noted }
  })

  for (const s of fresh) seen.add(s.key)
  await writeBlob(SEEN_BLOB, JSON.stringify([...seen]), 'application/json')
  return result
}

let lastRun = 0
/** Run the sync if it has not run in the last ten minutes. Never throws: the lead list must still load. */
export async function syncAutoLeadsIfDue(): Promise<void> {
  if (Date.now() - lastRun < 10 * 60_000) return
  lastRun = Date.now()
  try {
    const r = await syncAutoLeads()
    if (r.added || r.noted) console.log(`Auto leads: ${r.added} added, ${r.noted} existing leads noted`)
  } catch (e) {
    console.error('Auto leads sync failed', e)
  }
}
