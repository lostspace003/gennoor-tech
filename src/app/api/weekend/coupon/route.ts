import { NextRequest, NextResponse } from 'next/server'
import { weekendFee } from '@/data/ai-weekend'
import { couponAmount, couponProblem, getCoupon, normalCode, WEEKEND_SCOPE } from '@/lib/lms-coupons'
import { clientIp, rateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

/**
 * Check a coupon code for the AI Weekend: { code, india }. Answers with what the seat would cost with it,
 * in the visitor's own money. Nothing is used up here; the code is checked again, and counted, when the
 * seat is taken.
 */
export async function POST(req: NextRequest) {
  // Few tries per visitor, so codes cannot be guessed by trying many
  if (!rateLimit(`weekend-coupon:${clientIp(req.headers)}`, 10, 10 * 60_000)) {
    return NextResponse.json({ error: 'Too many tries. Please wait a few minutes.' }, { status: 429 })
  }
  try {
    const b = await req.json().catch(() => ({}))
    const code = normalCode(b.code)
    const coupon = await getCoupon(code)
    const problem = couponProblem(coupon, WEEKEND_SCOPE)
    if (problem || !coupon) return NextResponse.json({ error: problem || 'That code is not valid.' }, { status: 400 })
    const charge = weekendFee(b.india !== false)
    return NextResponse.json({ code, percent: coupon.percent, fee: couponAmount(charge.fee, charge.currency, coupon.percent), currency: charge.currency })
  } catch (e) {
    console.error('weekend coupon check failed', e)
    return NextResponse.json({ error: 'We could not check that code. Please try again.' }, { status: 500 })
  }
}
