import { NextResponse } from 'next/server'
import { requireCampaignUser } from '@/lib/crm/universities-access'
import { listCoupons, listCouponUses } from '@/lib/lms-coupons'
import { getLmsProgress } from '@/lib/lms'
import { EVALUATION_NOTE } from '@/lib/crm/universities-types'
import { COMPLIMENTARY_NOTE, courseChoices } from '@/lib/complimentary'

// The evaluation codes the form made (owner, 27 November 2026: "track the coupon and the users in a single panel ...
// how many users have completed which course"). For each code: who used it, for which course, and how far they got.
// Everyone who works in the CRM may look; nothing is changed.


export async function GET() {
  const user = await requireCampaignUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const live = await courseChoices().catch(() => [])
    const codes = (await listCoupons()).filter((c) => c.note.startsWith(EVALUATION_NOTE) || c.note.startsWith(COMPLIMENTARY_NOTE)).slice(0, 300)
    const rows = await Promise.all(codes.map(async (c) => {
      const [, institution = '', uni = ''] = c.note.split(' · ')
      const uses = await listCouponUses(c.code)
      const learners = await Promise.all(uses.map(async (u) => {
        const progress = await getLmsProgress(u.email, u.slug).catch(() => ({}))
        const done = Object.values(progress).filter((p) => p.done).length
        const course = live.find((x) => x.slug === u.slug)
        const total = course?.lessons || 0
        return { email: u.email, course: course?.title || u.slug, since: u.at, done, total, percent: total ? Math.min(100, Math.round((done / total) * 100)) : 0 }
      }))
      return { code: c.code, institution: c.note.startsWith(COMPLIMENTARY_NOTE) ? `${institution} (website)` : institution, uni: /^GEN-\d{3}$/.test(uni) ? uni : '', createdAt: c.createdAt, expiresAt: c.expiresAt, active: c.active, learners }
    }))
    const learners = rows.flatMap((r) => r.learners)
    return NextResponse.json({
      codes: rows,
      totals: {
        issued: rows.length,
        used: rows.filter((r) => r.learners.length).length,
        enrolments: learners.length,
        started: learners.filter((l) => l.done > 0).length,
        completed: learners.filter((l) => l.percent >= 100).length,
      },
    })
  } catch (error) {
    console.error('Evaluation codes read error:', error)
    return NextResponse.json({ error: 'The codes could not be read' }, { status: 500 })
  }
}
