import * as XLSX from 'xlsx'
import { escapeHtml } from '@/lib/escape-html'
import { emailShell } from '@/lib/crm/email-theme'
import { stepById, stepNumber } from '@/lib/crm/sequence'
import { STEP_LABELS, type Lead } from '@/lib/crm/types'
import { sendState } from '@/lib/crm/delivery'

/**
 * The evening report: everything that happened today, in one email at 22:15 India time, with an Excel file of
 * the detail, tab by tab (owner, 14 November 2026: "send the report every day to admin in a very nice, proper,
 * easy formatted ... a nice simple HTML with visuals ... and the report in the Excel every day").
 *
 * It replaces the copy of every outreach email that used to go to the admin mailbox.
 *
 * The numbers are counted here, in ordinary code, from the same records the screens read: the same question
 * gives the same answer every day. No model writes or counts anything in it.
 * This file is pure (it is given the records and the day), so scripts/daily-report-check.ts can run it with
 * made-up people. The reading of the real records is in daily-report-live.ts.
 * Email apps do not draw SVG or run scripts, so the "visuals" are tables: tiles and bars made of coloured cells.
 */

const IST_MS = 5.5 * 3_600_000
/** The India day ("2026-11-14") a moment falls on. */
export const istDay = (iso: string | number | Date) => new Date(new Date(iso).getTime() + IST_MS).toISOString().slice(0, 10)
const istTime = (iso: string) => new Date(iso).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' })
const dayWords = (day: string) => new Date(`${day}T00:00:00Z`).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
const short = (email: string) => (email || '').split('@')[0]

export interface ReportInput {
  leads: Lead[]
  registrations: Array<{ name: string; email: string; cohort: string; at: string; payment: string; fee: number; currency?: 'INR' | 'USD'; paidAt?: string; source?: string }>
  purchases: Array<{ name: string; email: string; courseTitle: string; amount: number; currency: 'USD' | 'INR'; at: string; coupon?: string }>
  enquiries: Array<{ type?: string; name?: string; email?: string; createdAt?: string; company?: string }>
  /** The learners' day, already counted (lib/learner-analytics.ts). Null when it could not be read. */
  learners: { active: number; lessons: number; enrolments: number; joined: number; hours: number } | null
  /** Subscribers of the weekly email who confirmed today. */
  newSubscribers: number
}

export interface DailyReport {
  day: string
  subject: string
  html: string
  /** The Excel file, tab by tab. */
  workbook: Buffer
  filename: string
  /** The headline numbers, for the check script and the log. */
  totals: Record<string, number>
}

const STATE_WORD = { sent: 'sent', onItsWay: 'on its way', unconfirmed: 'not confirmed', failed: 'did not go' } as const

export function buildDailyReport(input: ReportInput, day: string, now = Date.now()): DailyReport {
  const today = (iso?: string) => !!iso && istDay(iso) === day

  // ---- emails we sent
  const emails = input.leads.flatMap((l) => (l.emailHistory || []).filter((e) => today(e.at)).map((e) => ({
    Time: istTime(e.at),
    Lead: l.name || l.email,
    Organization: l.company || '',
    To: e.to,
    Email: e.step ? `Series ${stepNumber(e.step)}: ${stepById(e.step)?.title || ''}` : e.weekend ? `AI Weekend: ${e.weekend.kind}` : 'Written by hand',
    Subject: e.subject,
    'What became of it': STATE_WORD[sendState(e, now)],
    'Sent by': short(e.by),
    at: e.at,
  }))).sort((a, b) => a.at.localeCompare(b.at))
  const went = emails.filter((e) => e['What became of it'] !== 'did not go')
  const failed = emails.filter((e) => e['What became of it'] === 'did not go')
  const byPerson = new Map<string, number>()
  for (const e of went) byPerson.set(e['Sent by'], (byPerson.get(e['Sent by']) || 0) + 1)
  const byKind = [['Email series', went.filter((e) => e.Email.startsWith('Series')).length], ['AI Weekend', went.filter((e) => e.Email.startsWith('AI Weekend')).length], ['Written by hand', went.filter((e) => e.Email === 'Written by hand').length]] as Array<[string, number]>

  // ---- replies, new leads, where every lead stands
  const replies = input.leads.filter((l) => today(l.reply?.at)).map((l) => ({ Time: istTime(l.reply!.at), Lead: l.name || l.email, Organization: l.company || '', 'They wrote': l.reply!.preview || '', Kind: l.reply!.kind === 'stop' ? 'asked us to stop' : 'reply', Answered: l.reply!.handledAt ? 'yes' : 'not yet', Owner: short(l.owner) }))
  const newLeads = input.leads.filter((l) => today(l.createdAt)).map((l) => ({ Lead: l.name || l.email, Organization: l.company || '', Email: l.email, Country: l.country || '', 'Came from': l.source || '', Step: STEP_LABELS[l.status], Owner: short(l.owner) || 'unassigned' }))
  const open = input.leads.filter((l) => !l.dumped)
  // Two old step names can share one label: they are one bar
  const stepCount = new Map<string, number>()
  for (const s of Object.keys(STEP_LABELS) as Array<keyof typeof STEP_LABELS>) stepCount.set(STEP_LABELS[s], (stepCount.get(STEP_LABELS[s]) || 0) + open.filter((l) => l.status === s).length)
  const steps = [...stepCount.entries()]

  // ---- AI Weekend, payments, enquiries
  const regs = input.registrations.filter((r) => today(r.at)).map((r) => ({ Time: istTime(r.at), Name: r.name, Email: r.email, Weekend: r.cohort, Payment: r.payment, 'Came from': r.source || '' }))
  const pay = [
    ...input.purchases.filter((p) => today(p.at)).map((p) => ({ Time: istTime(p.at), For: p.courseTitle, Type: 'Course', Name: p.name, Email: p.email, Amount: p.amount, Currency: p.currency, Coupon: p.coupon || '' })),
    ...input.registrations.filter((r) => r.payment === 'paid' && today(r.paidAt)).map((r) => ({ Time: istTime(r.paidAt!), For: `AI Weekend ${r.cohort}`, Type: 'AI Weekend', Name: r.name, Email: r.email, Amount: r.fee, Currency: r.currency || 'INR', Coupon: '' })),
  ]
  const sum = (c: string) => pay.filter((p) => p.Currency === c).reduce((n, p) => n + p.Amount, 0)
  const money = [sum('INR') ? `₹${Math.round(sum('INR')).toLocaleString('en-IN')}` : '', sum('USD') ? `$${sum('USD').toFixed(2)}` : ''].filter(Boolean).join(' + ') || '0'
  const enq = input.enquiries.filter((e) => today(e.createdAt) && e.type !== 'Unsubscribe' && e.type !== 'NewsletterSubscription').map((e) => ({ Time: istTime(e.createdAt!), Form: (e.type || '').replace(/([a-z])([A-Z])/g, '$1 $2'), Name: e.name || '', Email: e.email || '', Organization: e.company || '' }))

  const totals: Record<string, number> = {
    emailsSent: went.length, emailsFailed: failed.length, replies: replies.length, newLeads: newLeads.length,
    registrations: regs.length, payments: pay.length, enquiries: enq.length, newSubscribers: input.newSubscribers,
    learnersActive: input.learners?.active ?? 0, lessons: input.learners?.lessons ?? 0,
  }

  // ---- the Excel file
  const wb = XLSX.utils.book_new()
  const sheet = (name: string, rows: Array<Record<string, unknown>>, empty: string) => XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows.length ? rows : [{ Note: empty }]), name)
  sheet('Summary', [
    { What: 'Day (India time)', Value: dayWords(day) },
    { What: 'Emails sent', Value: went.length }, { What: 'Emails that did not go', Value: failed.length },
    { What: 'Replies from leads', Value: replies.length }, { What: 'New leads', Value: newLeads.length },
    { What: 'AI Weekend registrations', Value: regs.length }, { What: 'Payments', Value: pay.length }, { What: 'Money received', Value: money },
    { What: 'Website enquiries', Value: enq.length }, { What: 'New weekly-email subscribers', Value: input.newSubscribers },
    ...(input.learners ? [{ What: 'Learners active', Value: input.learners.active }, { What: 'Lessons finished', Value: input.learners.lessons }, { What: 'New enrolments', Value: input.learners.enrolments }, { What: 'New learner accounts', Value: input.learners.joined }, { What: 'Hours of learning', Value: input.learners.hours }] : [{ What: 'Learners', Value: 'could not be read today' }]),
    ...steps.map(([label, n]) => ({ What: `Leads at "${label}" tonight`, Value: n })),
  ], '')
  sheet('Emails sent', emails.map(({ at: _at, ...row }) => row), 'No email was sent today.')
  sheet('Replies', replies, 'No lead wrote back today.')
  sheet('New leads', newLeads, 'No new lead today.')
  sheet('AI Weekend', regs, 'Nobody registered today.')
  sheet('Payments', pay, 'No payment today.')
  sheet('Enquiries', enq, 'No form was sent from the website today.')
  const workbook = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer

  // ---- the email
  const tile = (value: string | number, label: string, tone = '#0f172a') => `<td width="25%" valign="top" style="padding:4px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f7fd" style="background:#f4f7fd;border:1px solid #dbe6ff;border-radius:12px"><tr><td style="padding:12px 14px;font-family:'Segoe UI',Arial,sans-serif"><div style="font-size:${String(value).length > 7 ? 15 : 24}px;line-height:1.2;font-weight:800;color:${tone}">${value}</div><div style="font-size:12px;line-height:1.35;color:#64748b;margin-top:3px">${label}</div></td></tr></table></td>`
  const tiles = (cells: string[]) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 -4px 6px"><tr>${cells.join('')}</tr></table>`
  const heading = (text: string) => `<p style="margin:24px 0 10px;font-size:12px;font-weight:700;letter-spacing:1.6px;color:#64748b;text-transform:uppercase">${text}</p>`
  const bars = (rows: Array<[string, number]>, colour = '#2563EB') => {
    const most = Math.max(1, ...rows.map((r) => r[1]))
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows.map(([label, n]) => `<tr>
      <td width="34%" style="padding:4px 8px 4px 0;font-size:13.5px;color:#334155;font-family:'Segoe UI',Arial,sans-serif">${escapeHtml(label)}</td>
      <td style="padding:4px 0"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="${Math.max(2, Math.round((n / most) * 100))}%"><tr><td height="12" bgcolor="${n ? colour : '#e2e8f0'}" style="background:${n ? colour : '#e2e8f0'};border-radius:6px;font-size:1px;line-height:12px">&nbsp;</td></tr></table></td>
      <td width="12%" align="right" style="padding:4px 0 4px 8px;font-size:13.5px;font-weight:700;color:#0f172a;font-family:'Segoe UI',Arial,sans-serif">${n}</td></tr>`).join('')}</table>`
  }
  const list = (rows: string[], none: string) => (rows.length ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows.map((r) => `<tr><td style="padding:8px 0;border-top:1px solid #e2e8f0;font-size:14px;line-height:1.5;color:#334155;font-family:'Segoe UI',Arial,sans-serif">${r}</td></tr>`).join('')}</table>` : `<p style="margin:0;font-size:14px;color:#94a3b8">${none}</p>`)
  const b = (s: string) => `<strong style="color:#0f172a">${escapeHtml(s)}</strong>`
  const more = (n: number, shown: number) => (n > shown ? `<p style="margin:8px 0 0;font-size:12.5px;color:#64748b">and ${n - shown} more, in the Excel file.</p>` : '')

  const body = `
    <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:1.6px;color:#b45309;text-transform:uppercase">The day in the admin centre</p>
    <h1 style="margin:0 0 6px;font-size:24px;line-height:1.25;color:#0f172a;font-weight:800">${dayWords(day)}</h1>
    <p style="margin:0 0 18px;font-size:14.5px;line-height:1.6;color:#475569">Everything that happened today, counted at 10:15 pm India time. The detail is in the Excel file attached, one tab for each part.</p>
    ${tiles([tile(went.length, 'emails sent'), tile(replies.length, 'replies from leads', replies.length ? '#15803d' : '#0f172a'), tile(newLeads.length, 'new leads'), tile(money, 'money received')])}
    ${tiles([tile(regs.length, 'AI Weekend registrations'), tile(enq.length, 'website enquiries'), tile(input.learners ? input.learners.active : '–', 'learners active'), tile(failed.length, 'emails that did not go', failed.length ? '#b91c1c' : '#0f172a')])}

    ${heading('Emails sent, by kind')}${bars(byKind)}
    ${byPerson.size ? `${heading('Emails sent, by person')}${bars([...byPerson.entries()].sort((a, c) => c[1] - a[1]))}` : ''}
    ${failed.length ? `${heading('Did not go: to send again')}${list(failed.slice(0, 8).map((e) => `${b(e.Lead)} · ${escapeHtml(e.Email)}`), '')}${more(failed.length, 8)}` : ''}

    ${heading('Replies from leads')}${list(replies.slice(0, 6).map((r) => `${b(r.Lead)}${r.Organization ? ` · ${escapeHtml(r.Organization)}` : ''}${r.Kind !== 'reply' ? ' · <span style="color:#b45309">asked us to stop</span>' : ''}<br/><span style="color:#64748b">“${escapeHtml(String(r['They wrote']).slice(0, 160))}”</span> · ${r.Answered === 'yes' ? 'answered' : '<span style="color:#b91c1c">not answered yet</span>'}`), 'No lead wrote back today.')}${more(replies.length, 6)}

    ${heading('New leads')}${list(newLeads.slice(0, 8).map((l) => `${b(l.Lead)}${l.Organization ? ` · ${escapeHtml(l.Organization)}` : ''} <span style="color:#64748b">· ${escapeHtml(l['Came from'] || 'not recorded')} · ${escapeHtml(l.Owner)}</span>`), 'No new lead today.')}${more(newLeads.length, 8)}

    ${heading('Where every lead stands tonight')}${bars(steps, '#0f766e')}

    ${heading('Money and registrations')}${list([...pay.slice(0, 6).map((p) => `${b(p.Name || p.Email)} paid ${p.Currency === 'INR' ? `₹${Math.round(p.Amount).toLocaleString('en-IN')}` : `$${p.Amount.toFixed(2)}`} <span style="color:#64748b">· ${escapeHtml(p.For)}</span>`), ...regs.slice(0, 6).map((r) => `${b(r.Name)} registered for the AI Weekend <span style="color:#64748b">· ${escapeHtml(r.Weekend)} · ${escapeHtml(r.Payment)}</span>`)], 'No payment and no registration today.')}

    ${input.learners ? `${heading('Learners')}${bars([['Active learners', input.learners.active], ['Lessons finished', input.learners.lessons], ['New enrolments', input.learners.enrolments], ['New accounts', input.learners.joined]], '#7c3aed')}` : `${heading('Learners')}<p style="margin:0;font-size:14px;color:#94a3b8">The learners' figures could not be read today.</p>`}
    ${input.newSubscribers ? `<p style="margin:18px 0 0;font-size:14px;color:#334155">${input.newSubscribers} new subscriber${input.newSubscribers === 1 ? '' : 's'} to the weekly email.</p>` : ''}
    <p style="margin:22px 0 0;padding-top:14px;border-top:1px solid #e2e8f0;font-size:12.5px;line-height:1.6;color:#94a3b8">Counted by the site from its own records. "Sent" means the email service has confirmed it; "on its way" emails are counted as sent here and may still fail.</p>`

  const quiet = went.length + replies.length + newLeads.length + pay.length + regs.length + enq.length === 0
  return {
    day,
    subject: quiet ? `Today in the admin centre: a quiet day (${dayWords(day)})` : `Today in the admin centre: ${went.length} email${went.length === 1 ? '' : 's'} sent, ${replies.length} repl${replies.length === 1 ? 'y' : 'ies'}, ${newLeads.length} new lead${newLeads.length === 1 ? '' : 's'}`,
    html: emailShell(body, { preheader: `${dayWords(day)}: ${went.length} emails sent, ${replies.length} replies, ${newLeads.length} new leads, ${money} received.`, senderEmail: 'info@gennoor.com' }),
    workbook,
    filename: `gennoor-day-${day}.xlsx`,
    totals,
  }
}
