import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { getEnquiries, updateEnquiry, deleteEnquiry } from '@/lib/azure-storage'
import { sendEmail } from '@/lib/email-service'
import { trackEvent, initAppInsights } from '@/lib/analytics'
import {
  createBookingAppointment,
  getBookingServices,
  getConfiguredBusinessId,
  type CreateAppointmentPayload,
} from '@/lib/microsoft-graph'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Admin enters the agreed date/time as IST wall-clock. We format those values
// directly (no conversion) and label them IST. date = 'YYYY-MM-DD', time = 'HH:MM'.
function formatWhenIST(date: string, time: string, durationMinutes: number) {
  const start = new Date(`${date}T${time}:00Z`)
  const end = new Date(start.getTime() + durationMinutes * 60000)
  const clock = (d: Date) => {
    let h = d.getUTCHours()
    const m = d.getUTCMinutes()
    const ampm = h < 12 ? 'AM' : 'PM'
    h = h % 12 || 12
    return `${h}:${String(m).padStart(2, '0')} ${ampm}`
  }
  return {
    dateLabel: `${WEEKDAYS[start.getUTCDay()]}, ${start.getUTCDate()} ${MONTHS[start.getUTCMonth()]} ${start.getUTCFullYear()}`,
    timeLabel: `${clock(start)} – ${clock(end)} (IST)`,
    durationLabel: durationMinutes >= 60 ? `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60 ? (durationMinutes % 60) + 'm' : ''}`.trim() : `${durationMinutes} minutes`,
  }
}

// Branded confirmation email (mirrors the calendar "Accept" confirmation).
function buildConfirmationEmail(opts: {
  name: string
  serviceName: string
  when: { dateLabel: string; timeLabel: string; durationLabel: string }
  joinWebUrl?: string
  topic?: string
}) {
  const { name, serviceName, when, joinWebUrl, topic } = opts
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gennoor.com'
  const row = (label: string, value: string) =>
    `<tr>
      <td style="padding:10px 14px;border-bottom:1px solid #eef2f7;font-size:13px;color:#64748b;width:120px;vertical-align:top">${label}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #eef2f7;font-size:14px;color:#0f172a;font-weight:600">${value}</td>
    </tr>`
  return `
    <div style="font-family:'Segoe UI',Arial,sans-serif;background:#f1f5f9;padding:24px 12px;margin:0">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e2e8f0">
        <div style="background:linear-gradient(135deg,#2563eb 0%,#7c3aed 100%);padding:34px 28px;text-align:center">
          <div style="font-size:30px;line-height:1;margin-bottom:8px">✅</div>
          <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700">Your call is confirmed</h1>
          <p style="color:#dbeafe;margin:6px 0 0;font-size:14px">Gennoor Tech · ${esc(serviceName)}</p>
        </div>
        <div style="padding:30px 28px">
          <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 22px">
            Hi <strong>${esc(name)}</strong>, thanks for your interest in Gennoor Tech. Your call with
            <strong>Jalal Khan</strong> is locked in — everything you need is below.
          </p>
          <table style="width:100%;border-collapse:collapse;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin:0 0 24px">
            ${row('Service', esc(serviceName))}
            ${row('Date', when.dateLabel)}
            ${row('Time', when.timeLabel)}
            ${row('Duration', when.durationLabel)}
            ${row('Host', 'Jalal Khan · Founder &amp; Principal AI Consultant, Gennoor Tech')}
            ${row('Format', 'Online · Microsoft Teams (link below)')}
            ${topic ? row('Your note', esc(topic)) : ''}
          </table>
          ${joinWebUrl ? `
            <div style="text-align:center;margin:0 0 26px">
              <a href="${joinWebUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:9px;font-size:15px;font-weight:700">
                Join Microsoft Teams Meeting
              </a>
              <p style="color:#94a3b8;font-size:12px;margin:10px 0 0">A calendar invite with this link has also been emailed to you — save it to your calendar.</p>
            </div>
          ` : ''}
          <div style="border-top:1px solid #e5e7eb;padding-top:18px;margin:0 0 8px">
            <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0">
              Need to reschedule or can't make it? Just reply to this email and we'll sort it out.
            </p>
          </div>
        </div>
        <div style="background:#0f172a;padding:22px 28px;text-align:center">
          <p style="color:#cbd5e1;margin:0;font-size:13px;font-weight:600">Gennoor Tech</p>
          <p style="color:#64748b;margin:5px 0 0;font-size:11px">Enterprise AI Training, Certification &amp; Solutions</p>
          <p style="color:#475569;margin:8px 0 0;font-size:11px">
            <a href="mailto:schedule@gennoor.com" style="color:#94a3b8;text-decoration:none">schedule@gennoor.com</a> ·
            <a href="${siteUrl}" style="color:#94a3b8;text-decoration:none">www.gennoor.com</a>
          </p>
        </div>
      </div>
    </div>`
}

// User-supplied text gets interpolated into email HTML — escape it so markup
// can't be injected.
const esc = (s: unknown) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const READINESS_ENDPOINT = process.env.AZURE_OPENAI_READINESS_ENDPOINT || ''
const READINESS_KEY = process.env.AZURE_OPENAI_READINESS_KEY || ''
const DEPLOYMENT_MAIN = process.env.AZURE_OPENAI_READINESS_DEPLOYMENT_MAIN || 'gpt-54'
const DEPLOYMENT_FALLBACK = process.env.AZURE_OPENAI_READINESS_DEPLOYMENT || 'gpt-41-mini'

// ─── GET: list inbound call requests (ExpertCallBooking enquiries) ──────────
export async function GET(request: NextRequest) {
  const { authorized } = await verifyAdmin(request)
  if (!authorized) return unauthorizedResponse()

  try {
    // 2-year window so older requests don't silently disappear from the tab.
    const rows = await getEnquiries('ExpertCallBooking', 730)
    const requests = rows.map(r => ({
      rowKey: r.rowKey,
      name: r.name || '',
      email: r.email || '',
      whatsapp: r.whatsapp || '',
      whatsappCountry: r.whatsappCountry || '',
      company: r.company || '',
      designation: r.designation || '',
      message: r.message || '',
      programTitle: r.programTitle || '',
      timestamp: r.timestamp || r.createdAt || '',
      createdAt: r.createdAt || '',
      replied: r.replied === true || r.replied === 'true',
      repliedAt: r.repliedAt || '',
      lastSubject: r.lastSubject || '',
      scheduled: r.scheduled === true || r.scheduled === 'true',
      scheduledAt: r.scheduledAt || '',
      scheduledDate: r.scheduledDate || '',
      scheduledTime: r.scheduledTime || '',
      scheduledServiceName: r.scheduledServiceName || '',
      joinWebUrl: r.joinWebUrl || '',
    }))
    requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return NextResponse.json({ success: true, requests })
  } catch (error) {
    console.error('Error fetching call requests:', error)
    return NextResponse.json({ success: false, message: 'Failed to fetch call requests' }, { status: 500 })
  }
}

// ─── AI draft via Azure OpenAI (GPT-5.4 main, gpt-4.1-mini fallback) ────────
async function callModel(deployment: string, systemPrompt: string, userMessage: string, useTemperature: boolean) {
  const base = READINESS_ENDPOINT.endsWith('/') ? READINESS_ENDPOINT : READINESS_ENDPOINT + '/'
  const url = `${base}openai/deployments/${deployment}/chat/completions?api-version=2024-12-01-preview`
  const body: any = {
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    max_completion_tokens: 1400,
    response_format: { type: 'json_object' },
  }
  if (useTemperature) body.temperature = 0.6
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': READINESS_KEY },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`${deployment}: HTTP ${res.status} — ${(await res.text()).slice(0, 300)}`)
  const data = await res.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error(`${deployment}: empty response`)
  return JSON.parse(content) as { subject?: string; body?: string }
}

async function generateDraft(req: any, instructions: string) {
  const systemPrompt = `You draft warm, concise, professional reply emails for Gennoor Tech (enterprise AI training & consulting), delivered by Jalal Ahmed Khan, Microsoft Certified Trainer. The sender is admin@gennoor.com. A prospect has reached out (often via the website "Book a Call" form) and may be asking about offerings, delivery approach, engagement process, budget, or references. Your job is to write a reply that gives a brief, relevant overview and moves them toward a discovery call.

Gennoor Tech offerings (mention ONLY the ones relevant to the prospect's request — do not dump the whole list):
- AI Strategy & Consulting — AI-readiness assessments, roadmaps, ROI modeling, governance.
- Corporate AI Training — executive bootcamps + hands-on technical workshops (Azure AI, Microsoft Copilot Studio, Power Platform); live, customized per team; on-site in India / Saudi Arabia or remote worldwide.
- PoC Development — production-ready prototypes in 2–6 weeks (document intelligence, chatbots, process automation, predictive analytics).
- Agentic AI Solutions — multi-agent systems (Copilot Studio, LangChain, CrewAI, AutoGen).
- Certification Preparation — Microsoft Azure AI, Power BI, Copilot, GitHub.

Useful links (include 1–3 that fit the request): services https://www.gennoor.com/services · case studies https://www.gennoor.com/case-studies · our approach https://www.gennoor.com/the-gennoor-way · book a slot https://www.gennoor.com/resources/calendar

Rules:
- Address the person by their first name.
- Briefly acknowledge their specific request/context (use their message).
- When they ask about offerings, give a tight, relevant overview (a short <ul> of the 2–4 offerings that fit) — not a generic brochure.
- BUDGET: never quote a blind price or invent numbers. If they ask about budget/pricing, explain it scales with scope and ask 2–3 scoping questions (team size & which functions, on-site location vs remote, target timeline) so a meaningful range can be shared on the call.
- Follow the admin's instructions for which day(s) and time windows to offer. If none given, propose two windows on the next suitable weekday (morning 9:00 AM–12:00 PM and afternoon 2:00 PM–5:00 PM, IST / Asia Kolkata).
- Ask them to reply with a preferred time (or use the booking link); mention a Microsoft Teams calendar invite will follow.
- Keep it to a few short paragraphs. No pricing promises.
- Sign off as "Gennoor Tech".

Return ONLY valid JSON: {"subject": "...", "body": "<p>...</p> with simple HTML: <p>, <ul><li>, <strong>, <a href> only. Do NOT include <html>, <head>, <body>, styles, or a signature block with images. Plain content paragraphs only."}`

  const userMessage = `Prospect request:
- Name: ${req.name}
- Email: ${req.email}
- Company: ${req.company || 'N/A'}
- Designation: ${req.designation || 'N/A'}
- WhatsApp: ${req.whatsapp || 'N/A'} (${req.whatsappCountry || 'N/A'})
- Program / interest: ${req.programTitle || 'N/A'}
- Their message: ${req.message || 'N/A'}
- Submitted: ${req.timestamp || req.createdAt}

Admin instructions for this reply: ${instructions || '(none — use the default availability windows)'}

Write the reply email now.`

  try {
    return await callModel(DEPLOYMENT_MAIN, systemPrompt, userMessage, false)
  } catch (mainErr) {
    console.error('Draft MAIN model failed, trying fallback:', (mainErr as Error).message)
    return await callModel(DEPLOYMENT_FALLBACK, systemPrompt, userMessage, true)
  }
}

// Wrap the AI's inner content in the Gennoor branded email shell.
function wrapEmail(innerHtml: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gennoor.com'
  return `
    <div style="font-family:'Segoe UI',Arial,sans-serif;background:#f1f5f9;padding:24px 12px;margin:0">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e2e8f0">
        <div style="background-color:#1d4ed8;background:#1d4ed8 linear-gradient(135deg,#2563eb 0%,#7c3aed 100%);padding:28px;text-align:center">
          <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;mso-line-height-rule:exactly">Gennoor Tech</h1>
          <p style="color:#dbeafe;margin:6px 0 0;font-size:13px">Enterprise AI Training, Certification &amp; Solutions</p>
        </div>
        <div style="padding:30px 28px;color:#374151;font-size:15px;line-height:1.7">
          ${innerHtml}
        </div>
        <div style="background:#0f172a;padding:20px 28px;text-align:center">
          <p style="color:#cbd5e1;margin:0;font-size:13px;font-weight:600">Gennoor Tech</p>
          <p style="color:#64748b;margin:5px 0 0;font-size:11px">
            <a href="mailto:admin@gennoor.com" style="color:#94a3b8;text-decoration:none">admin@gennoor.com</a> ·
            <a href="${siteUrl}" style="color:#94a3b8;text-decoration:none">www.gennoor.com</a>
          </p>
        </div>
      </div>
    </div>`
}

// ─── POST: action = 'draft' | 'send' ───────────────────────────────────────
export async function POST(request: NextRequest) {
  const { authorized } = await verifyAdmin(request)
  if (!authorized) return unauthorizedResponse()

  try {
    initAppInsights()
    const body = await request.json()
    const { action, rowKey, instructions, subject, bodyHtml } = body

    if (action === 'draft') {
      if (!rowKey) return NextResponse.json({ success: false, message: 'rowKey is required' }, { status: 400 })
      if (!READINESS_ENDPOINT || !READINESS_KEY) {
        return NextResponse.json({ success: false, message: 'AI service not configured' }, { status: 500 })
      }
      const rows = await getEnquiries('ExpertCallBooking', 730)
      const req = rows.find(r => r.rowKey === rowKey)
      if (!req) return NextResponse.json({ success: false, message: 'Request not found' }, { status: 404 })

      const draft = await generateDraft(req, instructions || '')
      const firstName = String(req.name || '').trim().split(/\s+/)[0] || 'there'
      return NextResponse.json({
        success: true,
        subject: draft.subject || `Discovery Call with Gennoor Tech — ${firstName}`,
        bodyHtml: draft.body || '',
      })
    }

    // ─── Schedule a real Microsoft Teams meeting for this call request ───────
    if (action === 'schedule') {
      const { date, time, serviceId, durationMinutes: durOverride } = body
      if (!rowKey || !date || !time) {
        return NextResponse.json({ success: false, message: 'rowKey, date and time are required' }, { status: 400 })
      }
      const rows = await getEnquiries('ExpertCallBooking', 730)
      const req = rows.find(r => r.rowKey === rowKey)
      if (!req) return NextResponse.json({ success: false, message: 'Request not found' }, { status: 404 })
      if (!req.email) return NextResponse.json({ success: false, message: 'This request has no email address to invite.' }, { status: 400 })

      const businessId = getConfiguredBusinessId()
      const services = await getBookingServices(businessId)
      if (!services.length) {
        return NextResponse.json({ success: false, message: 'No bookable services are configured in Microsoft Bookings.' }, { status: 502 })
      }
      const service =
        services.find(s => s.id === serviceId) ||
        services.find(s => /discovery/i.test(s.displayName)) ||
        services[0]

      const durationMatch = service?.defaultDuration?.match(/PT(\d+)H?(\d+)?M?/)
      const durationMinutes = Number(durOverride) || (durationMatch
        ? (parseInt(durationMatch[1] || '0') * 60) + parseInt(durationMatch[2] || '0')
        : 30)

      // Admin entered IST wall-clock. Send IST local datetimes to Graph with the
      // India Standard Time zone so Bookings stores the correct instant.
      const startInstant = new Date(`${date}T${time}:00Z`)
      const endInstant = new Date(startInstant.getTime() + durationMinutes * 60000)
      const startLocal = `${date}T${time}:00`
      const endLocal = endInstant.toISOString().split('.')[0]

      const appointment: CreateAppointmentPayload = {
        serviceId: service.id,
        serviceName: service.displayName,
        startDateTime: { dateTime: startLocal, timeZone: 'India Standard Time' },
        endDateTime: { dateTime: endLocal, timeZone: 'India Standard Time' },
        isLocationOnline: true,
        staffMemberIds: service.staffMemberIds?.length ? service.staffMemberIds : undefined,
        customers: [{
          '@odata.type': '#microsoft.graph.bookingCustomerInformation',
          name: req.name || '',
          emailAddress: req.email,
          phone: req.whatsapp || '',
          notes: req.message || '',
          timeZone: 'India Standard Time',
        }],
        customerNotes: [
          req.programTitle ? `Program: ${req.programTitle}` : '',
          req.company ? `Company: ${req.company}` : '',
          req.whatsapp ? `WhatsApp: ${req.whatsapp}` : '',
        ].filter(Boolean).join(' | '),
        optOutOfCustomerEmail: true,
      }

      const result = await createBookingAppointment(businessId, appointment)

      const when = formatWhenIST(date, time, durationMinutes)
      const emailRes = await sendEmail({
        to: req.email,
        cc: process.env.EMAIL_ADMIN || 'admin@gennoor.com',
        from: process.env.EMAIL_FROM_SCHEDULE || 'schedule@gennoor.com',
        fromName: 'Gennoor Tech',
        subject: `Confirmed: ${service.displayName} with Jalal Khan — ${when.dateLabel}`,
        html: buildConfirmationEmail({
          name: req.name || 'there',
          serviceName: service.displayName,
          when,
          joinWebUrl: result.joinWebUrl,
          topic: req.message,
        }),
      }).catch(e => ({ success: false, error: (e as Error).message }))

      await updateEnquiry('ExpertCallBooking', rowKey, {
        scheduled: true,
        scheduledAt: new Date().toISOString(),
        scheduledDate: date,
        scheduledTime: time,
        scheduledServiceName: service.displayName,
        graphAppointmentId: result.id || '',
        joinWebUrl: result.joinWebUrl || '',
        replied: true,
        repliedAt: new Date().toISOString(),
      }).catch(() => {})

      trackEvent('CallRequestScheduled', { name: req.name, email: req.email, service: service.displayName })
      return NextResponse.json({
        success: true,
        message: emailRes.success === false
          ? 'Meeting scheduled, but the confirmation email failed to send.'
          : 'Meeting scheduled. Customer notified with the Teams link.',
        joinWebUrl: result.joinWebUrl,
        emailSent: emailRes.success !== false,
      })
    }

    if (action === 'send') {
      if (!rowKey || !bodyHtml) {
        return NextResponse.json({ success: false, message: 'rowKey and bodyHtml are required' }, { status: 400 })
      }
      const rows = await getEnquiries('ExpertCallBooking', 730)
      const req = rows.find(r => r.rowKey === rowKey)
      if (!req) return NextResponse.json({ success: false, message: 'Request not found' }, { status: 404 })

      const result = await sendEmail({
        to: req.email,
        cc: process.env.EMAIL_ADMIN || 'admin@gennoor.com',
        from: process.env.EMAIL_ADMIN || 'admin@gennoor.com',
        fromName: 'Gennoor Tech',
        subject: subject || `Discovery Call with Gennoor Tech`,
        html: wrapEmail(bodyHtml),
      })

      if (!result.success) {
        return NextResponse.json({ success: false, message: result.error || 'Send failed' }, { status: 502 })
      }

      await updateEnquiry('ExpertCallBooking', rowKey, {
        replied: true,
        repliedAt: new Date().toISOString(),
        lastSubject: (subject || '').slice(0, 200),
      }).catch(() => {})

      trackEvent('CallRequestReplied', { name: req.name, email: req.email })
      return NextResponse.json({ success: true, message: 'Reply sent.', messageId: result.messageId })
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Call-request action error:', error)
    return NextResponse.json({ success: false, message: (error as Error).message || 'Action failed' }, { status: 500 })
  }
}

// ─── DELETE: remove one or more call requests ───────────────────────────────
export async function DELETE(request: NextRequest) {
  const { authorized } = await verifyAdmin(request)
  if (!authorized) return unauthorizedResponse()

  try {
    const { rowKeys } = await request.json()
    if (!Array.isArray(rowKeys) || rowKeys.length === 0) {
      return NextResponse.json({ success: false, message: 'rowKeys array is required' }, { status: 400 })
    }
    const results = await Promise.allSettled(
      rowKeys.map((key: string) => deleteEnquiry('ExpertCallBooking', key)),
    )
    const deleted = results.filter(r => r.status === 'fulfilled').length
    return NextResponse.json({ success: true, message: `${deleted} request(s) deleted.`, deleted })
  } catch (error) {
    console.error('Error deleting call requests:', error)
    return NextResponse.json({ success: false, message: 'Failed to delete' }, { status: 500 })
  }
}
