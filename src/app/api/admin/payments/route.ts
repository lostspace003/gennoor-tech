import { NextRequest, NextResponse } from 'next/server'
import { requireCrmUser } from '@/lib/crm/access'
import { coursePriceList, listPurchases, saveOfferSetting, savePriceSetting, DEFAULT_PRICE, PREVIEW_MAX } from '@/lib/lms-access'
import { getRegistrations } from '@/lib/weekend'
import { cohortById, WEEKEND } from '@/data/ai-weekend'
import { razorpayConfigured, razorpayTestMode } from '@/lib/razorpay'
import { getLmsCourse } from '@/lib/lms'

export const dynamic = 'force-dynamic'

/** One row of money received, whatever it was for. */
interface PaymentRow {
  at: string
  kind: 'course' | 'weekend'
  what: string
  name: string
  email: string
  amount: number
  currency: 'USD' | 'INR'
  paymentId: string
  /** The coupon code used, when there was one */
  coupon?: string
  /** For an AI Weekend seat: which weekend, as "2026-11", and its dates in words. The Payments page filters by it. */
  cohort?: string
  cohortLabel?: string
}

/** Staff: every payment received (courses and AI Weekend seats) and the price of each course. */
export async function GET() {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const [purchases, registrations, prices] = await Promise.all([
      listPurchases().catch(() => []),
      getRegistrations().catch(() => []),
      coursePriceList().catch(() => []),
    ])
    const rows: PaymentRow[] = [
      ...purchases.map((p) => ({ at: p.at, kind: 'course' as const, what: p.courseTitle, name: p.name, email: p.email, amount: p.amount, currency: p.currency, paymentId: p.paymentId, coupon: p.coupon })),
      // AI Weekend seats marked Paid. Ones paid online carry a payment reference; ones marked by hand do not.
      ...registrations.filter((r) => r.payment === 'paid').map((r) => ({
        at: r.paidAt || r.at, kind: 'weekend' as const, what: `${WEEKEND.name}, ${cohortById(r.cohort)?.label || r.cohort}`,
        name: r.name, email: r.email, amount: r.fee, currency: r.currency || ('INR' as const), paymentId: r.paymentId || '', cohort: r.cohort, cohortLabel: cohortById(r.cohort)?.label || r.cohort,
      })),
    ].sort((a, b) => b.at.localeCompare(a.at))

    return NextResponse.json({
      payments: rows,
      prices,
      defaultPrice: DEFAULT_PRICE,
      previewMax: PREVIEW_MAX,
      online: razorpayConfigured(),
      testMode: razorpayConfigured() && razorpayTestMode(),
    })
  } catch (e) {
    console.error('payments list failed', e)
    return NextResponse.json({ error: 'Could not load payments' }, { status: 500 })
  }
}

/**
 * Managers: set what a course costs.
 *   { slug, usd, inr }   its own price
 *   { slug, free: true } make it free (sign in and enroll, as before)
 *   { slug, reset: true } back to the standard price
 *   { slug, offer: { on, percent } } show (or stop showing) the course as discounted
 */
export async function PUT(req: NextRequest) {
  const user = await requireCrmUser()
  if (!user?.isManager) return NextResponse.json({ error: 'Only managers can change prices' }, { status: 403 })
  try {
    const b = await req.json()
    const course = await getLmsCourse(String(b.slug || ''))
    if (!course) return NextResponse.json({ error: 'Unknown course' }, { status: 404 })
    if (b.offer) {
      const percent = Math.round(Number(b.offer.percent))
      if (!(percent >= 5 && percent <= 90)) return NextResponse.json({ error: 'Enter an offer between 5 and 90 percent.' }, { status: 400 })
      await saveOfferSetting(course.slug, { on: !!b.offer.on, percent })
    }
    else if (b.reset) await savePriceSetting(course.slug, null)
    else if (b.free) await savePriceSetting(course.slug, { free: true })
    else {
      const usd = Number(b.usd), inr = Number(b.inr)
      if (!(usd >= 1 && usd <= 5000) || !(inr >= 10 && inr <= 500000)) {
        return NextResponse.json({ error: 'Enter a dollar price between 1 and 5,000 and a rupee price between 10 and 5,00,000.' }, { status: 400 })
      }
      await savePriceSetting(course.slug, { usd: Math.round(usd * 100) / 100, inr: Math.round(inr) })
    }
    return NextResponse.json({ success: true, prices: await coursePriceList() })
  } catch (e) {
    console.error('price save failed', e)
    return NextResponse.json({ error: 'Could not save the price' }, { status: 500 })
  }
}
