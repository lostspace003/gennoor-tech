import { NextResponse } from 'next/server'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import { getEvent, mutateEvents, sendRegistrationEmail } from '@/lib/events'
import { saveEnquiry } from '@/lib/azure-storage'
import { upsertLeads } from '@/lib/crm/store'
import { newLead } from '@/lib/crm/types'
import { sendEmail } from '@/lib/email-service'
import { escapeHtml } from '@/lib/escape-html'

export const dynamic = 'force-dynamic'

/** Public registration: stores the attendee, emails the Teams join link + calendar file, adds them to the CRM. */
export async function POST(req: Request) {
  try {
    if (!rateLimit(`event-register:${clientIp(req.headers)}`, 6, 10 * 60_000)) {
      return NextResponse.json({ error: 'Too many attempts. Please try again in a few minutes.' }, { status: 429 })
    }
    const b = await req.json().catch(() => ({}))
    if (b.website_hp) return NextResponse.json({ success: true }) // honeypot
    const name = String(b.name || '').trim().slice(0, 80)
    const email = String(b.email || '').trim().toLowerCase().slice(0, 120)
    const company = String(b.company || '').trim().slice(0, 120)
    const id = String(b.eventId || '')
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please give us your name and a valid email.' }, { status: 400 })
    }

    const existing = await getEvent(id)
    if (!existing || existing.cancelled) return NextResponse.json({ error: 'This event is not available.' }, { status: 404 })
    if (new Date(existing.startsAt).getTime() + existing.durationMinutes * 60_000 < Date.now()) {
      return NextResponse.json({ error: 'This event has already ended.' }, { status: 410 })
    }

    const reg = { name, email, company, at: new Date().toISOString() }
    const outcome = await mutateEvents((events) => {
      const e = events.find((x) => x.id === id)
      if (!e) return 'missing' as const
      if (e.registrations.some((r) => r.email === email)) return 'dupe' as const
      if (e.capacity && e.registrations.length >= e.capacity) return 'full' as const
      e.registrations.push(reg)
      return 'ok' as const
    })
    if (outcome === 'full') return NextResponse.json({ error: 'Sorry, this event is full.' }, { status: 409 })
    if (outcome === 'missing') return NextResponse.json({ error: 'This event is not available.' }, { status: 404 })

    // A repeat registration gets the link again (they probably lost the email) but is not counted twice.
    await sendRegistrationEmail(existing, reg)
    if (outcome === 'ok') {
      await saveEnquiry('WebinarRegistration', { name, email, company, webinarId: id, webinarTitle: existing.title, webinarDate: existing.startsAt }).catch(() => {})
      await upsertLeads([newLead({ name, email, company, source: `Event: ${existing.title}`, tags: ['event'], notes: `Registered for "${existing.title}" on ${reg.at.slice(0, 10)}.` }, 'event-registration')], 'event-registration').catch(() => {})
      await sendEmail({
        to: process.env.EMAIL_ADMIN || 'admin@gennoor.com',
        from: process.env.EMAIL_FROM_WEBINAR || 'webinar@gennoor.com',
        fromName: 'Event Registration',
        subject: `Event registration: ${existing.title} - ${name}`,
        html: `<p>${escapeHtml(name)} &lt;${escapeHtml(email)}&gt; ${escapeHtml(company)} registered for <strong>${escapeHtml(existing.title)}</strong>.</p>`,
      }).catch(() => {})
    }
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('event register failed', e)
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 })
  }
}
