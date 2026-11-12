import { NextResponse } from 'next/server'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import { findRegistration, markPaid, validPayToken } from '@/lib/weekend-pay'
import { validPaymentSignature } from '@/lib/razorpay'

export const dynamic = 'force-dynamic'

/**
 * Public: the browser reports a finished payment. Nothing it says is trusted:
 * the seat is marked paid only if Razorpay's signature over the order and the
 * payment checks out, and the order is the one we opened for this registration.
 */
export async function POST(req: Request) {
  try {
    if (!rateLimit(`weekend-verify:${clientIp(req.headers)}`, 12, 10 * 60_000)) {
      return NextResponse.json({ error: 'Too many attempts. Please try again in a few minutes.' }, { status: 429 })
    }
    const b = await req.json().catch(() => ({}))
    const id = String(b.id || ''), orderId = String(b.razorpay_order_id || ''), paymentId = String(b.razorpay_payment_id || ''), signature = String(b.razorpay_signature || '')
    if (!validPayToken(id, String(b.t || ''))) return NextResponse.json({ error: 'This payment could not be matched to a registration.' }, { status: 400 })

    const reg = await findRegistration(id)
    if (!reg || reg.orderId !== orderId) return NextResponse.json({ error: 'This payment could not be matched to a registration.' }, { status: 400 })
    if (!validPaymentSignature(orderId, paymentId, signature)) {
      console.error('weekend payment signature mismatch', { id, orderId })
      return NextResponse.json({ error: 'We could not confirm this payment. If money left your account, write to admin@gennoor.com with the payment reference and we will sort it out.' }, { status: 400 })
    }
    await markPaid({ orderId }, paymentId)
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('weekend pay verify failed', e)
    return NextResponse.json({ error: 'We could not confirm this payment yet. If money left your account, it will be matched automatically within a few minutes.' }, { status: 500 })
  }
}
