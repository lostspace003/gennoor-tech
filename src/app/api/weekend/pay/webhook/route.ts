import { NextResponse } from 'next/server'
import { markPaid } from '@/lib/weekend-pay'
import { validWebhookSignature } from '@/lib/razorpay'
import { completeCoursePurchase } from '@/lib/lms-pay'

export const dynamic = 'force-dynamic'

/**
 * Razorpay calls this when a payment succeeds. It is the safety net for people
 * who pay and then close the window before the page can report back.
 *
 * In the Razorpay dashboard: Settings > Webhooks > add
 *   URL     https://www.gennoor.com/api/weekend/pay/webhook
 *   Secret  the same value as RAZORPAY_WEBHOOK_SECRET
 *   Events  payment.captured, order.paid
 */
export async function POST(req: Request) {
  const raw = await req.text()
  if (!validWebhookSignature(raw, req.headers.get('x-razorpay-signature') || '')) {
    return NextResponse.json({ error: 'Bad signature' }, { status: 400 })
  }
  try {
    const event = JSON.parse(raw)
    if (event?.event === 'payment.captured' || event?.event === 'order.paid') {
      const payment = event.payload?.payment?.entity
      const orderId = payment?.order_id || event.payload?.order?.entity?.id
      if (orderId && payment?.id) {
        // One webhook serves both things we sell. An AI Weekend seat is tried first; an order
        // it does not know is then tried as a Learning Studio course. Orders for anything
        // else on this account match neither, which is fine.
        const outcome = await markPaid({ orderId }, String(payment.id))
        if (outcome !== 'unknown') return NextResponse.json({ received: true, outcome })
        const purchase = await completeCoursePurchase(String(orderId), String(payment.id))
        return NextResponse.json({ received: true, outcome: purchase ? 'course-paid' : 'not-ours-or-already-done' })
      }
    }
    return NextResponse.json({ received: true })
  } catch (e) {
    // A 500 makes Razorpay try again later, which is what we want if storage was briefly unavailable
    console.error('weekend webhook failed', e)
    return NextResponse.json({ error: 'Could not process' }, { status: 500 })
  }
}
