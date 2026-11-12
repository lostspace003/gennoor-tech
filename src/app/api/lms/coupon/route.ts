import { NextRequest, NextResponse } from 'next/server'
import { getLmsCourse } from '@/lib/lms'
import { priceOf } from '@/lib/lms-access'
import { couponPrice, couponProblem, getCoupon, normalCode } from '@/lib/lms-coupons'
import { clientIp, rateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

/**
 * Check a coupon code for a course: { slug, code }. Answers with what the
 * course would cost with it. Nothing is used up here; the code is checked
 * again, and counted, when the course is bought.
 */
export async function POST(req: NextRequest) {
  // Few tries per visitor, so codes cannot be guessed by trying many
  if (!rateLimit(`lms-coupon:${clientIp(req.headers)}`, 10, 10 * 60_000)) {
    return NextResponse.json({ error: 'Too many tries. Please wait a few minutes.' }, { status: 429 })
  }
  try {
    const b = await req.json().catch(() => ({}))
    const course = await getLmsCourse(String(b.slug || ''))
    if (!course) return NextResponse.json({ error: 'Unknown course' }, { status: 404 })
    const price = await priceOf(course.slug)
    if (!price) return NextResponse.json({ error: 'This course is already free.' }, { status: 400 })
    const code = normalCode(b.code)
    const coupon = await getCoupon(code)
    const problem = couponProblem(coupon, course.slug)
    if (problem || !coupon) return NextResponse.json({ error: problem || 'That code is not valid.' }, { status: 400 })
    return NextResponse.json({ code, percent: coupon.percent, price: couponPrice(price, coupon.percent) })
  } catch (e) {
    console.error('coupon check failed', e)
    return NextResponse.json({ error: 'We could not check that code. Please try again.' }, { status: 500 })
  }
}
