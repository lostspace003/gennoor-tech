import { NextRequest, NextResponse } from 'next/server'
import { mutateLeads } from '@/lib/crm/store'
import { newLead } from '@/lib/crm/types'
import { appendLog } from '@/lib/bot/store'

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

    return NextResponse.json({ success: true, message: 'Thank you! Our team will reach out shortly.' })
  } catch (error) {
    console.error('Bot lead error:', error)
    return NextResponse.json({ error: 'Something went wrong — email us at admin@gennoor.com.' }, { status: 500 })
  }
}
