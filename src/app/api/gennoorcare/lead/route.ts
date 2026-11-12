import { NextRequest, NextResponse } from 'next/server'
import { mutateLeads } from '@/lib/crm/store'
import { newLead } from '@/lib/crm/types'
import { appendLog } from '@/lib/bot/store'
import { sendEmail } from '@/lib/email-service'
import { emailShell } from '@/lib/crm/email-theme'
import { escapeHtml } from '@/lib/escape-html'

// PUBLIC lead capture from the website bot → straight into the CRM pool.
// Protections: honeypot field, per-IP daily cap, strict validation.
const dayHits = new Map<string, { date: string; n: number }>()

export async function POST(req: NextRequest) {
  try {
    const ip = (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim()
    const today = new Date().toISOString().slice(0, 10)
    const day = dayHits.get(ip)
    if (day?.date === today && day.n >= 3) {
      return NextResponse.json({ success: true }) // silently absorb — no oracle for abusers
    }
    dayHits.set(ip, { date: today, n: (day?.date === today ? day.n : 0) + 1 })

    const body = await req.json()
    if (body.website_hp) return NextResponse.json({ success: true }) // honeypot

    const name = String(body.name || '').trim().slice(0, 80)
    const email = String(body.email || '').trim().toLowerCase().slice(0, 120)
    const company = String(body.company || '').trim().slice(0, 120)
    const phone = String(body.phone || '').trim().slice(0, 30)
    const interest = String(body.interest || '').trim().slice(0, 600)

    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please give us your name and a valid email.' }, { status: 400 })
    }

    const lead = newLead(
      {
        name, email, company, phone,
        source: 'Website Bot',
        notes: `Enquired via GennoorBot on ${new Date().toISOString().slice(0, 10)}.${interest ? ` Interest: ${interest}` : ''}`,
        priority: 'High', // they came to us
      },
      'gennoorbot'
    )
    await mutateLeads((leads) => {
      // Don't duplicate an existing lead — refresh its note instead
      const existing = leads.find((l) => l.email === email)
      if (existing) {
        existing.notes = `${existing.notes ? existing.notes + ' | ' : ''}Re-enquired via GennoorBot ${new Date().toISOString().slice(0, 10)}${interest ? `: ${interest}` : ''}`
        existing.activities.unshift({ at: new Date().toISOString(), by: 'gennoorbot', type: 'note', description: 'Visitor re-enquired via website bot' })
        return
      }
      leads.unshift(lead)
    })
    await appendLog({ at: new Date().toISOString(), sessionId: String(body.sessionId || 'anon').slice(0, 40), q: '[lead captured]', a: `${name} <${email}> ${company}`, links: [], leadCaptured: true })

    // Instant heads-up to the team — a website visitor asked for a callback
    sendEmail({
      to: 'admin@gennoor.com',
      from: process.env.EMAIL_FROM_INFO || 'info@gennoor.com',
      fromName: 'GennoorCare',
      subject: `🟢 Website lead: ${name}${company ? ` — ${company}` : ''}`,
      html: emailShell(`
        <h3 style="margin:0 0 12px;color:#0f172a">New callback request from the website bot</h3>
        <table style="border-collapse:collapse;font-size:14px;width:100%">
          <tr><td style="padding:6px 10px;border:1px solid #e2e8f0;width:110px;color:#64748b">Name</td><td style="padding:6px 10px;border:1px solid #e2e8f0"><strong>${escapeHtml(name)}</strong></td></tr>
          <tr><td style="padding:6px 10px;border:1px solid #e2e8f0;color:#64748b">Email</td><td style="padding:6px 10px;border:1px solid #e2e8f0"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
          ${company ? `<tr><td style="padding:6px 10px;border:1px solid #e2e8f0;color:#64748b">Company</td><td style="padding:6px 10px;border:1px solid #e2e8f0">${escapeHtml(company)}</td></tr>` : ''}
          ${phone ? `<tr><td style="padding:6px 10px;border:1px solid #e2e8f0;color:#64748b">Phone</td><td style="padding:6px 10px;border:1px solid #e2e8f0">${escapeHtml(phone)}</td></tr>` : ''}
          ${interest ? `<tr><td style="padding:6px 10px;border:1px solid #e2e8f0;color:#64748b">They asked</td><td style="padding:6px 10px;border:1px solid #e2e8f0">${escapeHtml(interest)}</td></tr>` : ''}
        </table>
        <p style="margin:16px 0 0"><a href="https://www.gennoor.com/crm/queue" style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;padding:9px 20px;border-radius:8px;font-size:14px">Open the CRM →</a></p>`,
        { preheader: `Website lead: ${name}` }),
    }).catch((e) => console.error('Lead notify email failed:', e))

    return NextResponse.json({ success: true, message: 'Thank you! Our team will reach out shortly.' })
  } catch (error) {
    console.error('Bot lead error:', error)
    return NextResponse.json({ error: 'Something went wrong — email us at admin@gennoor.com.' }, { status: 500 })
  }
}
