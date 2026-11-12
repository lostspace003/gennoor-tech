import { NextRequest, NextResponse } from 'next/server'
import { verifyLearnerSession } from '@/lib/learner-auth'
import { getLmsCourse } from '@/lib/lms'
import { hasPurchased, priceOf, saveOrder } from '@/lib/lms-access'
import { createOrder, razorpayConfigured, razorpayKeyId } from '@/lib/razorpay'
import { couponPrice, couponProblem, getCoupon, normalCode } from '@/lib/lms-coupons'
import { grantCourseByCoupon } from '@/lib/lms-pay'
import { rateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

/**
 * Start buying a course: { slug, india, coupon? }.
 * The buyer must be signed in, so the purchase belongs to an account.
 * `india` picks the currency: rupees for buyers in India (UPI and net banking
 * only work in rupees), US dollars for everyone else. Both are our own prices,
 * taken from the server, so the browser cannot choose an amount.
 * A coupon code lowers the amount; one that takes 100 percent off opens the
 * course at once, with no payment.
 */
export async function POST(req: NextRequest) {
  const learner = await verifyLearnerSession()
  if (!learner) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  if (!rateLimit(`lms-buy:${learner.email}`, 12, 10 * 60_000)) {
    return NextResponse.json({ error: 'Too many attempts. Please try again in a few minutes.' }, { status: 429 })
  }
  try {
    const b = await req.json().catch(() => ({}))
    const course = await getLmsCourse(String(b.slug || ''))
    if (!course) return NextResponse.json({ error: 'Unknown course' }, { status: 404 })
    const price = await priceOf(course.slug)
    if (!price) return NextResponse.json({ error: 'This course is free. Enroll to start.' }, { status: 400 })
    if (await hasPurchased(learner.email, course.slug)) return NextResponse.json({ owned: true })

    const currency = b.india ? 'INR' : 'USD'
    const code = normalCode(b.coupon)
    let toPay = price
    if (code) {
      const coupon = await getCoupon(code)
      const problem = couponProblem(coupon, course.slug)
      if (problem || !coupon) return NextResponse.json({ error: problem || 'That code is not valid.', couponRejected: true }, { status: 400 })
      if (coupon.percent >= 100) {
        const given = await grantCourseByCoupon(learner, course, code, currency)
        if (!given) return NextResponse.json({ error: 'That code has already been used the maximum number of times.', couponRejected: true }, { status: 400 })
        return NextResponse.json({ owned: true, free: true })
      }
      toPay = couponPrice(price, coupon.percent)
    }
    if (!razorpayConfigured()) return NextResponse.json({ error: 'Payment is not available right now. Please write to admin@gennoor.com.' }, { status: 503 })

    const amount = currency === 'INR' ? toPay.inr : toPay.usd
    const order = await createOrder(amount, `course-${course.slug}`.slice(0, 40), { kind: 'course', slug: course.slug, email: learner.email, ...(code ? { coupon: code } : {}) }, currency)
    await saveOrder({ orderId: order.id, email: learner.email, name: learner.name || '', slug: course.slug, amount, currency, status: 'open', at: new Date().toISOString(), ...(code ? { coupon: code } : {}) })

    return NextResponse.json({
      checkout: {
        keyId: razorpayKeyId(),
        orderId: order.id,
        amount: Math.round(amount * 100),
        currency,
        name: learner.name || '',
        email: learner.email,
        description: course.title,
      },
    })
  } catch (e) {
    console.error('course buy failed', e)
    return NextResponse.json({ error: 'We could not start the payment. Please try again.' }, { status: 500 })
  }
}
