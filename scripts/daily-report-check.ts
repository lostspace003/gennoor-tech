/**
 * The evening report, made from made-up people. Nothing is read from the real records and nothing is sent.
 *   npx tsx scripts/daily-report-check.ts <folder>
 * Checks the numbers, and writes report.html and the Excel file into the folder, to look at.
 */
import fs from 'node:fs'
import path from 'node:path'
import * as XLSX from 'xlsx'
import { buildDailyReport, istDay } from '../src/lib/daily-report'
import type { Lead } from '../src/lib/crm/types'

const day = '2026-11-14'
const at = (hhmm: string, d = day) => new Date(`${d}T${hhmm}:00+05:30`).toISOString()
const now = Date.parse(at('22:15'))

const lead = (n: number, over: Record<string, unknown>): Lead => ({
  id: `l${n}`, name: `Person ${n}`, email: `person${n}@example.com`, company: `Company ${n}`, country: 'India', source: 'website',
  status: 'new', owner: 'yusufchaudhary@gennoor.com', createdAt: at('09:00', '2026-11-01'), emailHistory: [], ...over,
} as unknown as Lead)

const sent = (hhmm: string, by: string, extra: Record<string, unknown> = {}) => ({ at: at(hhmm), to: 'x@example.com', subject: 'A subject', status: 'sent', by, done: true, ...extra })

const leads: Lead[] = [
  lead(1, { emailHistory: [sent('10:00', 'yusufchaudhary@gennoor.com'), sent('09:00', 'yusufchaudhary@gennoor.com', { at: at('09:00', '2026-11-13') })] }),
  lead(2, { emailHistory: [sent('11:00', 'jalalkhan@gennoor.com'), sent('11:30', 'jalalkhan@gennoor.com', { status: 'failed', done: undefined })] }),
  lead(3, { emailHistory: [sent('23:30', 'yusufchaudhary@gennoor.com', { weekend: { kind: 'invite', cohort: '2026-11' } })], reply: { at: at('15:00'), preview: 'Yes, please send the details.', kind: 'reply' } }),
  lead(4, { createdAt: at('00:20'), owner: '' }),
  lead(5, { createdAt: at('23:50', '2026-11-13') }),
  lead(6, { createdAt: at('18:00'), dumped: true }),
]

const r = buildDailyReport({
  leads,
  registrations: [
    { name: 'Reg One', email: 'r1@example.com', cohort: '2026-11', at: at('12:00'), payment: 'paid', fee: 499, currency: 'INR', paidAt: at('12:05') },
    { name: 'Reg Two', email: 'r2@example.com', cohort: '2026-12', at: at('13:00', '2026-11-13'), payment: 'paid', fee: 9.99, currency: 'USD', paidAt: at('08:00') },
  ],
  purchases: [{ name: 'Buyer', email: 'b@example.com', courseTitle: 'A course', amount: 849, currency: 'INR', at: at('14:00') }],
  enquiries: [
    { type: 'TrainingEnquiry', name: 'Asker', email: 'a@example.com', createdAt: at('16:00') },
    { type: 'Unsubscribe', email: 'u@example.com', createdAt: at('16:10') },
    { type: 'TrainingEnquiry', name: 'Old', email: 'o@example.com', createdAt: at('16:00', '2026-11-12') },
  ],
  learners: { active: 7, lessons: 23, enrolments: 2, joined: 1, hours: 5 },
  newSubscribers: 2,
}, day, now)

let bad = 0
const is = (what: string, got: unknown, want: unknown) => {
  const ok = JSON.stringify(got) === JSON.stringify(want)
  if (!ok) bad++
  console.log(`${ok ? 'ok  ' : 'BAD '} ${what}${ok ? '' : `: got ${JSON.stringify(got)}, wanted ${JSON.stringify(want)}`}`)
}

is('the India day of 00:20 India time', istDay(at('00:20')), day)
is('the India day of 23:50 the evening before', istDay(at('23:50', '2026-11-13')), '2026-11-13')
is('emails sent today (yesterday\'s and the failed one are left out)', r.totals.emailsSent, 3)
is('emails that did not go', r.totals.emailsFailed, 1)
is('replies', r.totals.replies, 1)
is('new leads (the one before midnight is yesterday\'s)', r.totals.newLeads, 2)
is('registrations made today', r.totals.registrations, 1)
is('payments today (a course, and two weekends paid today)', r.totals.payments, 3)
is('enquiries (no unsubscribe, no other day)', r.totals.enquiries, 1)
const wb = XLSX.read(r.workbook, { type: 'buffer' })
is('the tabs of the Excel file', wb.SheetNames, ['Summary', 'Emails sent', 'Replies', 'New leads', 'AI Weekend', 'Payments', 'Enquiries'])
is('rows on the "Emails sent" tab', XLSX.utils.sheet_to_json(wb.Sheets['Emails sent']).length, 4)
is('the money is in both currencies, apart', r.html.includes('₹1,348 + $9.99'), true)
is('the subject', r.subject, 'Today in the admin centre: 3 emails sent, 1 reply, 2 new leads')
const empty = buildDailyReport({ leads: [], registrations: [], purchases: [], enquiries: [], learners: null, newSubscribers: 0 }, day, now)
is('a day with nothing says so', empty.subject.includes('a quiet day'), true)

const out = process.argv[2]
if (out) {
  fs.mkdirSync(out, { recursive: true })
  fs.writeFileSync(path.join(out, 'report.html'), r.html)
  fs.writeFileSync(path.join(out, r.filename), r.workbook)
  fs.writeFileSync(path.join(out, 'quiet.html'), empty.html)
  console.log(`written to ${out}`)
}
console.log(bad ? `${bad} wrong` : 'all right')
process.exit(bad ? 1 : 0)
