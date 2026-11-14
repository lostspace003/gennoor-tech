import { NextResponse } from 'next/server'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import { applyCouponToSeat, findRegistration, startPayment, validPayToken } from '@/lib/weekend-pay'
import { razorpayConfigured } from '@/lib/razorpay'

export const dynamic = 'force-dynamic'

/**
 * Public: open the payment for a seat that is already reserved. Used by the
 * "pay now" link in emails. { id, t } where t is the signature from that link.
 * With { coupon }, the code is first taken off the seat's fee; one that leaves nothing to pay confirms the seat.
 */
export async function POST(req: Request) {
  try {
    if (!rateLimit(`weekend-pay:${clientIp(req.headers)}`, 12, 10 * 60_000)) {
      return NextResponse.json({ error: 'Too many attempts. Please try again in a few minutes.' }, { status: 429 })
    }
    const { id, t, coupon } = await req.json().catch(() => ({}))
    if (!validPayToken(String(id || ''), String(t || ''))) {
      return NextResponse.json({ error: 'This payment link is not valid. Use the link from your latest email, or register again.' }, { status: 400 })
    }
    let reg = await findRegistration(String(id))
    if (!reg) return NextResponse.json({ error: 'We could not find this registration.' }, { status: 404 })
    if (reg.payment === 'paid') return NextResponse.json({ paid: true, name: reg.name })
    if (reg.payment === 'refunded') return NextResponse.json({ error: 'This registration was cancelled. Please register again.' }, { status: 409 })
    if (coupon) {
      const applied = await applyCouponToSeat(reg, coupon)
      if ('error' in applied) return NextResponse.json({ error: applied.error, couponRejected: true }, { status: 400 })
      if (applied.covered) return NextResponse.json({ paid: true, covered: true, name: reg.name })
      reg = applied.reg
    }
    if (!razorpayConfigured()) return NextResponse.json({ error: 'Online payment is not available right now. Please use the details in your email.' }, { status: 503 })

    const checkout = await startPayment(reg)
    if (!checkout) return NextResponse.json({ error: 'We could not start the payment. Please try again.' }, { status: 500 })
    return NextResponse.json({ checkout })
  } catch (e) {
    console.error('weekend pay start failed', e)
    return NextResponse.json({ error: 'We could not start the payment. Please try again.' }, { status: 500 })
  }
}
