import { NextResponse } from 'next/server'
import { campaignByKey, campaignOfId, type CampaignKey } from '@/data/partnership-campaigns'
import * as XLSX from 'xlsx'
import { requireCampaignUser } from '@/lib/crm/universities-access'
import { getUniversities } from '@/lib/crm/universities-store'
import { UNI_COURSES, UNI_STAGE_LABELS } from '@/lib/crm/universities-types'

// The campaign as an Excel file: one tab for the universities, one for the contacts, one for the emails sent.
// A cell that starts with = + - or @ is written as text with a quote in front: what a reply or a note holds is a
// stranger's words, and Excel would run it as a formula.

const safe = (v: unknown): string => {
  const t = String(v ?? '')
  return /^[=+\-@\t\r]/.test(t) ? `'${t}` : t
}
const day = (iso: string) => (iso ? iso.slice(0, 10) : '')

export async function GET(request: Request) {
  const user = await requireCampaignUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const campaign = campaignByKey(new URL(request.url).searchParams.get('c') || 'universities')
    if (!campaign) return NextResponse.json({ error: 'Which campaign?' }, { status: 400 })
    const { universities } = await getUniversities(campaign.key)
    const courseName = (id: string) => UNI_COURSES.find((c) => c.id === id)?.title || id

    const unis = [
      ['ID', 'University', 'Country', 'City', 'Region', 'Priority', 'Wave', 'Stage', 'Main contact', 'Designation', 'Send to', 'First email sent', 'Emails sent', 'Replies', 'Evaluation courses', 'Access given', 'Call on', 'Notes'],
      ...universities.map((u) => [
        u.id, u.name, u.country, u.city, u.region, u.priority, u.wave, UNI_STAGE_LABELS[u.stage], u.decisionMaker, u.designation, u.draft.to.join(', '),
        day([...u.emails].filter((e) => e.status === 'sent').map((e) => e.at).sort()[0] || ''),
        u.emails.filter((e) => e.status === 'sent').length, u.replies.length,
        (u.evaluation?.courses || []).map(courseName).join('; '), u.evaluation?.grantedAt || '', u.callOn, u.notes,
      ]),
    ]
    const contacts = [
      ['University', 'Contact ID', 'Order', 'Name', 'Designation', 'Email', 'Email status', 'LinkedIn', 'Phone', 'Department', 'Source'],
      ...universities.flatMap((u) => u.contacts.map((c) => [u.name, c.id, c.order, c.name, c.designation, c.email || c.emailNote, c.status, c.linkedin, c.phone, c.department, c.source])),
    ]
    const emails = [
      ['University', 'Sent', 'By', 'To', 'Cc', 'Subject', 'State', 'Kind'],
      ...universities.flatMap((u) => u.emails.map((e) => [u.name, e.at, e.by, e.to, (e.cc || []).join(', '), e.subject, e.status === 'failed' ? 'did not go' : e.confirmedAt ? 'sent' : 'on its way', e.kind])),
    ]

    const book = XLSX.utils.book_new()
    const add = (name: string, rows: unknown[][]) => XLSX.utils.book_append_sheet(book, XLSX.utils.aoa_to_sheet(rows.map((r) => r.map((c) => (typeof c === 'number' ? c : safe(c))))), name)
    add('Universities', unis)
    add('Contacts', contacts)
    add('Emails', emails)
    const buffer: Buffer = XLSX.write(book, { type: 'buffer', bookType: 'xlsx' })
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="gennoor-${campaign.key}-partnership-${new Date().toISOString().slice(0, 10)}.xlsx"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('University export error:', error)
    return NextResponse.json({ error: 'The file could not be made' }, { status: 500 })
  }
}
