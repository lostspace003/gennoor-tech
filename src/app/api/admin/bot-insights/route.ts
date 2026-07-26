import { NextRequest, NextResponse } from 'next/server'
import { requireCrmUser } from '@/lib/crm/access'
import { readLogs } from '@/lib/bot/store'
import { aiConfigured, chatCompletion } from '@/lib/crm/ai'
import { sendEmail } from '@/lib/email-service'
import { emailShell, markdownToEmailHtml } from '@/lib/crm/email-theme'

const FROM = process.env.EMAIL_FROM_INFO || 'info@gennoor.com'

function logsDigest(logs: Awaited<ReturnType<typeof readLogs>>): string {
  return logs
    .filter((l) => l.q !== '[lead captured]')
    .slice(0, 300)
    .map((l) => `${l.at.slice(0, 10)} | Q: ${l.q.slice(0, 160)} | A(links): ${l.links.join(' ') || '-'}${l.leadCaptured ? ' | LEAD' : ''}`)
    .join('\n')
}

// GET  → last 7/30 days of raw conversations (managers)
// POST → {action:'report'} weekly business MD document
//        {action:'chat', report, question} interact with the report
//        {action:'email', report, recipients[]} forward it to the team
export async function GET(req: NextRequest) {
  const user = await requireCrmUser()
  if (!user?.isManager) return NextResponse.json({ error: 'Managers only' }, { status: 403 })
  const days = Math.min(Number(req.nextUrl.searchParams.get('days')) || 7, 30)
  const logs = await readLogs(days)
  return NextResponse.json({
    logs: logs.slice(0, 400),
    total: logs.length,
    leads: logs.filter((l) => l.leadCaptured).length,
  })
}

export async function POST(req: NextRequest) {
  const user = await requireCrmUser()
  if (!user?.isManager) return NextResponse.json({ error: 'Managers only' }, { status: 403 })

  try {
    const { action, report, question, recipients, days: rawDays } = await req.json()
    // Range is selectable in the UI: week (7), fortnight (14), month (30)
    const days = Math.min(Math.max(Number(rawDays) || 7, 1), 31)
    const rangeLabel = days <= 7 ? 'Weekly' : days <= 14 ? 'Fortnight' : 'Monthly'

    if (action === 'report') {
      if (!aiConfigured()) return NextResponse.json({ error: 'AI not configured' }, { status: 503 })
      const logs = await readLogs(days)
      if (logs.length === 0) return NextResponse.json({ report: `# GennoorCare — ${rangeLabel} Business Report\n\nNo visitor conversations in the last ${days} days yet. The report fills up as the bot talks to website visitors.` })
      const leads = logs.filter((l) => l.leadCaptured)
      const md = await chatCompletion(
        [
          {
            role: 'system',
            content: `You write a ${rangeLabel.toLowerCase()} BUSINESS report for Gennoor Tech's leadership from their GennoorCare website-bot logs. Output pure Markdown, ready to forward to the team. Structure exactly:

# GennoorCare — ${rangeLabel} Business Report (${new Date(Date.now() - (days - 1) * 864e5).toISOString().slice(0, 10)} to ${new Date().toISOString().slice(0, 10)})

## Headline numbers
(conversations, unique topics, leads captured — one line each)

## What visitors asked for (demand signals)
(grouped themes with counts, most-demanded first — e.g. "Non-technical AI training — 14 asks")

## Buying intent spotted
(specific conversations that smell like money: who/what/which need — anonymised to intent)

## Content & product gaps
(questions the website could not answer — each is a page or offering to build)

## Leads captured in this period
(name/company only if present in the log lines marked LEAD)

## Recommended actions for next week
(3-5 concrete, prioritized actions)

Business tone, concise, numbers first, no fluff. Only facts from the logs — never invent.`,
          },
          { role: 'user', content: `LOGS (${logs.length} conversations, ${leads.length} leads):\n${logsDigest(logs)}` },
        ],
        { maxTokens: 1400 }
      )
      return NextResponse.json({ report: md })
    }

    if (action === 'chat') {
      if (!question || !report) return NextResponse.json({ error: 'question and report required' }, { status: 400 })
      const logs = await readLogs(days)
      const reply = await chatCompletion(
        [
          { role: 'system', content: `You are the analyst behind this weekly bot report. Answer the manager's question using the report and the raw logs. Concise, business tone.\n\nREPORT:\n${String(report).slice(0, 8000)}\n\nRAW LOGS:\n${logsDigest(logs).slice(0, 8000)}` },
          { role: 'user', content: String(question).slice(0, 500) },
        ],
        { maxTokens: 600 }
      )
      return NextResponse.json({ reply })
    }

    if (action === 'email') {
      if (!report || !Array.isArray(recipients) || recipients.length === 0) {
        return NextResponse.json({ error: 'report and recipients required' }, { status: 400 })
      }
      const sentAt = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' })
      const html = emailShell(`
        <p style="color:#64748b;font-size:13px;margin:0 0 16px;border-left:3px solid #2563EB;padding-left:10px">
          ${rangeLabel} GennoorCare business report · forwarded by <strong>${user.email.split('@')[0]}</strong> · ${sentAt} IST
        </p>
        ${markdownToEmailHtml(String(report))}
        <p style="margin:20px 0 0"><a href="https://www.gennoor.com/crm/botlog" style="display:inline-block;background:#2563EB;color:#ffffff;text-decoration:none;padding:10px 22px;border-radius:8px;font-size:14px">Open in CRM →</a></p>`,
        { preheader: `${rangeLabel} GennoorCare business report`, senderEmail: FROM })
      const result = await sendEmail({
        to: recipients.map((r: string) => String(r).trim()).filter(Boolean),
        cc: 'admin@gennoor.com',
        from: FROM,
        fromName: 'Gennoor CRM',
        subject: `GennoorCare ${rangeLabel.toLowerCase()} business report — ${new Date().toISOString().slice(0, 10)}`,
        html,
      })
      return NextResponse.json({ success: result.success, error: result.error })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    console.error('Bot insights error:', error)
    return NextResponse.json({ error: 'Insights failed' }, { status: 500 })
  }
}
