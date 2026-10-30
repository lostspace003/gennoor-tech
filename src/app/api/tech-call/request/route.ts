import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email-service'
import { saveEnquiry, getEnquiries } from '@/lib/azure-storage'
import { trackEvent, trackException, initAppInsights } from '@/lib/analytics'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import { escapeHtml } from '@/lib/escape-html'
import { isEmailVerified } from '@/lib/otp-store'
import { istInstant, formatInZone, IST } from '@/lib/crm/timezones'
import { COUNTRIES, TECH_CALL_TYPE, heldSlotKeys, isOfferedSlot, slotKey, zoneForCountry } from '@/lib/tech-call'

export const dynamic = 'force-dynamic'

const clip = (v: unknown, n: number) => String(v ?? '').trim().slice(0, n)

/** A visitor asks for a tech call. Their email must already be OTP-verified (checked here, not just in the browser). */
export async function POST(request: Request) {
  try {
    if (!rateLimit(`tech-call-request:${clientIp(request.headers)}`, 5, 10 * 60_000)) {
      return NextResponse.json({ error: 'Too many requests. Please try again in a few minutes.' }, { status: 429 })
    }
    initAppInsights()
    const b = await request.json().catch(() => ({}))
    const email = clip(b.email, 200).toLowerCase()
    const name = clip(b.name, 120)
    const phone = clip(b.phone, 40)
    const country = clip(b.country, 80)
    const slotDate = clip(b.slotDate, 10)
    const slotTime = clip(b.slotTime, 5)
    const audience = b.audience === 'Team' ? 'Team' : 'Individual'
    const teamSize = audience === 'Team' ? Math.max(2, Math.min(100000, Number(b.teamSize) || 0)) : 0
    const org = clip(b.organization, 160)
    const userLocation = clip(b.userLocation, 120)
    const orgLocation = clip(b.orgLocation, 120)
    const note = clip(b.note, 1500)
    const course = clip(b.course, 200)
    const courseSlug = clip(b.courseSlug, 120)

    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !phone || !COUNTRIES.includes(country) || !org || !note) {
      return NextResponse.json({ error: 'Please fill in every required field.' }, { status: 400 })
    }
    if (audience === 'Team' && !teamSize) return NextResponse.json({ error: 'Please enter the team size.' }, { status: 400 })
    if (!isEmailVerified(email)) return NextResponse.json({ error: 'Please verify your email with the code first.' }, { status: 403 })
    if (!isOfferedSlot(slotDate, slotTime)) return NextResponse.json({ error: 'That time is not available. Please pick another.' }, { status: 400 })

    const rows = await getEnquiries(TECH_CALL_TYPE, 60)
    const taken = heldSlotKeys(rows).has(slotKey(slotDate, slotTime))
    if (taken) return NextResponse.json({ error: 'That time was just taken. Please pick another.' }, { status: 409 })

    const tz = zoneForCountry(country)
    const when = istInstant(slotDate, slotTime)
    await saveEnquiry(TECH_CALL_TYPE, {
      name, email, phone, country, timeZone: tz, slotDate, slotTime, slotStartUtc: when.toISOString(),
      audience, teamSize, organization: org, userLocation, orgLocation, note, course, courseSlug, callStatus: 'pending',
    })
    trackEvent('TechCallRequested', { country, audience, course })

    const admin = process.env.EMAIL_ADMIN || 'admin@gennoor.com'
    const from = process.env.EMAIL_FROM_SCHEDULE || admin
    const row = (k: string, v: string) => `<tr><td style="padding:8px 10px;border:1px solid #e8e8ed;font-weight:600;width:34%">${k}</td><td style="padding:8px 10px;border:1px solid #e8e8ed">${v}</td></tr>`
    await sendEmail({
      to: admin,
      from,
      fromName: 'Gennoor Tech Website',
      subject: `[TECH CALL REQUEST] ${name}${org ? ` (${org})` : ''}: ${formatInZone(when, IST)}`,
      html: `<div style="font-family:Segoe UI,Arial,sans-serif;max-width:620px">
        <h2 style="color:#1d1d1f">New tech call request</h2>
        <table role="presentation" style="width:100%;border-collapse:collapse">
          ${row('Course', escapeHtml(course) || 'General')}${row('Name', escapeHtml(name))}${row('Email (verified)', escapeHtml(email))}
          ${row('Phone / WhatsApp', escapeHtml(phone))}${row('Country', escapeHtml(country))}
          ${row('Requested time (IST)', escapeHtml(formatInZone(when, IST)))}${row('Their time', escapeHtml(formatInZone(when, tz)))}
          ${row('Individual or team', audience === 'Team' ? `Team of ${teamSize}` : 'Individual')}${row('Organization', escapeHtml(org))}
          ${row('User location', escapeHtml(userLocation))}${row('Organization location', escapeHtml(orgLocation))}${row('Looking for', escapeHtml(note))}
        </table>
        <p style="margin-top:16px">Approve or decline it in the admin panel: <a href="https://www.gennoor.com/admin/tech-calls">Tech calls</a>. The Teams invite is sent when you approve.</p></div>`,
    })
    await sendEmail({
      to: email,
      from,
      fromName: 'Gennoor Tech',
      subject: 'We received your tech call request | Gennoor Tech',
      html: `<div style="font-family:Segoe UI,Arial,sans-serif;max-width:560px">
        <p>Hi ${escapeHtml(name.split(' ')[0])},</p>
        <p>Thank you. We received your request for a tech call on <strong>${escapeHtml(formatInZone(when, tz))}</strong>.</p>
        <p>Our team will confirm it shortly. Once approved, you will get a confirmation email with the Microsoft Teams meeting invite.</p>
        <p>Gennoor Tech</p></div>`,
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('tech-call request failed', e)
    trackException(e instanceof Error ? e : new Error(String(e)), { route: 'tech-call/request' })
    return NextResponse.json({ error: 'Could not send your request. Please try again.' }, { status: 500 })
  }
}
