import { NextRequest, NextResponse } from 'next/server'
import { verifyLearnerSession } from '@/lib/learner-auth'
import { getOrder } from '@/lib/lms-access'
import { completeCoursePurchase } from '@/lib/lms-pay'
import { validPaymentSignature } from '@/lib/razorpay'

export const dynamic = 'force-dynamic'

/**
 * The browser reports a finished course payment. It is believed only if
 * Razorpay's signature checks out and the order was opened by this learner.
 */
export async function POST(req: NextRequest) {
  const learner = await verifyLearnerSession()
  if (!learner) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  try {
    const b = await req.json().catch(() => ({}))
    const orderId = String(b.razorpay_order_id || ''), paymentId = String(b.razorpay_payment_id || ''), signature = String(b.razorpay_signature || '')
    const order = await getOrder(orderId)
    if (!order || order.email.toLowerCase() !== learner.email.toLowerCase()) {
      return NextResponse.json({ error: 'This payment could not be matched to your account.' }, { status: 400 })
    }
    if (!validPaymentSignature(orderId, paymentId, signature)) {
      console.error('course payment signature mismatch', { orderId })
      return NextResponse.json({ error: 'We could not confirm this payment. If money left your account, write to admin@gennoor.com with the payment reference.' }, { status: 400 })
    }
    await completeCoursePurchase(orderId, paymentId)
    return NextResponse.json({ success: true, slug: order.slug })
  } catch (e) {
    console.error('course verify failed', e)
    return NextResponse.json({ error: 'We could not confirm this payment yet. If money left your account, the course will open within a few minutes.' }, { status: 500 })
  }
}
