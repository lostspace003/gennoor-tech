import { createHmac, timingSafeEqual } from 'crypto'

// Razorpay, called directly over HTTPS (no SDK needed for the three things we do:
// create an order, check a payment's signature, check a webhook's signature).
//
// Settings (App Service and .env.local, never committed):
//   RAZORPAY_KEY_ID          rzp_test_… or rzp_live_…  (safe to show in the browser)
//   RAZORPAY_KEY_SECRET      the secret that pairs with it (server only)
//   RAZORPAY_WEBHOOK_SECRET  the secret typed when the webhook was created (server only)
//
// Until the first two are set, payment is simply off and the site says "pay later".

const keyId = () => (process.env.RAZORPAY_KEY_ID || '').trim()
const keySecret = () => (process.env.RAZORPAY_KEY_SECRET || '').trim()

export const razorpayConfigured = () => !!(keyId() && keySecret())
export const razorpayKeyId = keyId
/** True while the keys are Razorpay test keys: no real money moves. */
export const razorpayTestMode = () => keyId().startsWith('rzp_test_')

export interface RazorpayOrder { id: string; amount: number; currency: string; status: string }

/** Create an order for an exact amount. The amount is decided here, on the server, never by the browser. */
export async function createOrder(amountRupees: number, receipt: string, notes: Record<string, string> = {}): Promise<RazorpayOrder> {
  if (!razorpayConfigured()) throw new Error('Razorpay is not configured')
  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`${keyId()}:${keySecret()}`).toString('base64')}`,
    },
    // Razorpay counts in paise
    body: JSON.stringify({ amount: Math.round(amountRupees * 100), currency: 'INR', receipt: receipt.slice(0, 40), notes }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(`Razorpay order failed (${res.status}): ${data?.error?.description || 'unknown error'}`)
  return data as RazorpayOrder
}

function sameHex(a: string, b: string): boolean {
  const x = Buffer.from(a, 'utf8'), y = Buffer.from(b, 'utf8')
  return x.length === y.length && timingSafeEqual(x, y)
}

/** HMAC-SHA256 as lowercase hex. Exported so the checks can be tested with a known secret. */
export const hmacHex = (secret: string, text: string) => createHmac('sha256', secret).update(text).digest('hex')

/** What the browser hands back after a payment: genuine only if the signature matches. */
export function validPaymentSignature(orderId: string, paymentId: string, signature: string, secret = keySecret()): boolean {
  if (!secret || !orderId || !paymentId || !signature) return false
  return sameHex(hmacHex(secret, `${orderId}|${paymentId}`), signature)
}

/** A webhook call is genuine only if Razorpay signed the exact body with our webhook secret. */
export function validWebhookSignature(rawBody: string, signature: string, secret = (process.env.RAZORPAY_WEBHOOK_SECRET || '').trim()): boolean {
  if (!secret || !signature) return false
  return sameHex(hmacHex(secret, rawBody), signature)
}
