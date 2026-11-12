import { NextRequest, NextResponse } from 'next/server'
import { verifyLearnerSession } from '@/lib/learner-auth'
import { getLmsCourse } from '@/lib/lms'
import { hasPurchased, priceOf, saveOrder } from '@/lib/lms-access'
import { createOrder, razorpayConfigured, razorpayKeyId } from '@/lib/razorpay'
import { rateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

/**
 * Start buying a course: { slug, india }.
 * The buyer must be signed in, so the purchase belongs to an account.
 * `india` picks the currency: rupees for buyers in India (UPI and net banking
 * only work in rupees), US dollars for everyone else. Both are our own prices,
 * taken from the server, so the browser cannot choose an amount.
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
    if (!razorpayConfigured()) return NextResponse.json({ error: 'Payment is not available right now. Please write to admin@gennoor.com.' }, { status: 503 })

    const currency = b.india ? 'INR' : 'USD'
    const amount = currency === 'INR' ? price.inr : price.usd
    const order = await createOrder(amount, `course-${course.slug}`.slice(0, 40), { kind: 'course', slug: course.slug, email: learner.email }, currency)
    await saveOrder({ orderId: order.id, email: learner.email, name: learner.name || '', slug: course.slug, amount, currency, status: 'open', at: new Date().toISOString() })

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
