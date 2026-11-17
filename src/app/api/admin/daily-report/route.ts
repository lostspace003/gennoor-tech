import { NextRequest, NextResponse } from 'next/server'
import { getLeads } from '@/lib/crm/store'
import { getRegistrations } from '@/lib/weekend'
import { listPurchases } from '@/lib/lms-access'
import { getEnquiries } from '@/lib/azure-storage'
import { buildLearnerAnalytics } from '@/lib/learner-analytics'
import { sendEmail } from '@/lib/email-service'
import { syncReplies } from '@/lib/crm/reply-sync'
import { buildDailyReport, istDay } from '@/lib/daily-report'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const FROM = process.env.EMAIL_FROM_INFO || 'info@gennoor.com'
/** Who reads the evening report, and who is copied. Changed here, or with the two settings named. */
const TO = (process.env.DAILY_REPORT_TO || 'yusufchaudhary@gennoor.com,jalalkhan@gennoor.com').split(',').map((s) => s.trim()).filter(Boolean)
const CC = (process.env.DAILY_REPORT_CC || process.env.EMAIL_ADMIN || 'admin@gennoor.com').split(',').map((s) => s.trim()).filter(Boolean)

/**
 * The evening report (lib/daily-report.ts). Called by the schedule in .github/workflows/daily-report.yml at
 * 22:15 India time, with the cron secret; never by a browser.
 *   POST            reads the day, sends the email with the Excel file
 *   POST ?dry=1     reads the day and answers with the numbers and the email, sending nothing
 *   POST ?day=YYYY-MM-DD   another day than today (India time)
 */
export async function POST(req: NextRequest) {
  const secret = process.env.CRM_CRON_SECRET
  if (!secret || req.headers.get('x-cron-secret') !== secret) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const wanted = req.nextUrl.searchParams.get('day') || ''
    const day = /^\d{4}-\d{2}-\d{2}$/.test(wanted) ? wanted : istDay(Date.now())
    // The mailboxes are looked at first, so a reply that came in this evening is in the report
    await syncReplies(true).catch(() => null)
    const [leads, registrations, purchases, enquiries, analytics] = await Promise.all([
      getLeads(),
      getRegistrations().catch(() => []),
      listPurchases().catch(() => []),
      getEnquiries(undefined, 3).catch(() => []),
      buildLearnerAnalytics({ from: day, to: day }).catch(() => null),
    ])
    const t = analytics?.totals
    const report = buildDailyReport({
      leads, registrations, purchases, enquiries,
      learners: t ? { active: t.activeInRange, lessons: t.lessonsInRange, enrolments: t.enrolmentsInRange, joined: t.joinedInRange, hours: t.hoursInRange } : null,
      newSubscribers: enquiries.filter((e) => e.type === 'NewsletterSubscription' && e.createdAt && istDay(e.createdAt) === day).length,
    }, day)

    if (req.nextUrl.searchParams.get('dry') === '1') return NextResponse.json({ day, subject: report.subject, totals: report.totals, html: report.html, to: TO.length, cc: CC.length })
    const r = await sendEmail({ to: TO, cc: CC, from: FROM, fromName: 'Gennoor Tech', subject: report.subject, html: report.html, attachments: [{ filename: report.filename, content: report.workbook, contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }] })
    if (!r.success) return NextResponse.json({ error: `The email service did not take the report: ${r.error || 'unknown'}`, totals: report.totals }, { status: 502 })
    return NextResponse.json({ success: true, day, totals: report.totals })
  } catch (e) {
    console.error('daily report failed', e)
    return NextResponse.json({ error: 'The report could not be made' }, { status: 500 })
  }
}
