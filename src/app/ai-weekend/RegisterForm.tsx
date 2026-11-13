'use client'

import { useCallback, useEffect, useState } from 'react'
import { CheckCircle2, Loader2, ShieldCheck } from 'lucide-react'

const input = 'w-full rounded-xl border border-gray-300 bg-raised px-3.5 py-3 text-[15px] text-gray-900 placeholder:text-gray-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20'
const bigButton = 'st-pill st-gold w-full disabled:opacity-60'

/** What the server sends so Razorpay's payment window can open. Nothing in it is secret. */
interface Checkout { registrationId: string; token: string; keyId: string; orderId: string; amount: number; name: string; email: string; phone: string; description: string }
type Stage = 'form' | 'sending' | 'paying' | 'confirming' | 'reserved' | 'paid'

/** Where the visitor came from: the campaign tag if the link carried one, else the site that sent them. */
function sourceOf(): string {
  try {
    const p = new URLSearchParams(window.location.search)
    const tag = [p.get('utm_source'), p.get('utm_medium'), p.get('utm_campaign')].filter(Boolean).join(' / ')
    if (tag) return tag
    const ref = document.referrer ? new URL(document.referrer).hostname : ''
    return ref && ref !== window.location.hostname ? ref : 'direct'
  } catch { return 'direct' }
}

/** Razorpay's payment window is their script; it is loaded only when someone is about to pay. */
function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) return resolve(true)
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => resolve(true)
    s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })
}

export default function RegisterForm({ cohortLabel, fee, full, online }: { cohortLabel: string; fee: number; full?: boolean; online?: boolean }) {
  const [f, setF] = useState({ name: '', email: '', phone: '', company: '', role: '', website_hp: '' })
  const [stage, setStage] = useState<Stage>('form')
  const [error, setError] = useState('')
  const [checkout, setCheckout] = useState<Checkout | null>(null)
  const [who, setWho] = useState('')
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF((x) => ({ ...x, [k]: e.target.value }))

  /** Open the payment window. Closing it without paying keeps the seat reserved. */
  const pay = useCallback(async (c: Checkout) => {
    setError('')
    setStage('paying')
    if (!(await loadRazorpay())) {
      setError('The payment window could not load. Check your connection, or use the Pay now button in the email we sent you.')
      setStage('reserved')
      return
    }
    const rzp = new (window as any).Razorpay({
      key: c.keyId,
      order_id: c.orderId,
      amount: c.amount,
      currency: 'INR',
      name: 'Gennoor Tech',
      image: 'https://www.gennoor.com/logos/gennoor-tech-linkedin-profile-400x400.png',
      description: c.description,
      prefill: { name: c.name, email: c.email, contact: c.phone },
      theme: { color: '#0071e3' },
      modal: { ondismiss: () => setStage((s) => (s === 'paying' ? 'reserved' : s)) },
      handler: async (res: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
        setStage('confirming')
        try {
          const r = await fetch('/api/weekend/pay/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: c.registrationId, t: c.token, ...res }) })
          const j = await r.json().catch(() => ({}))
          if (!r.ok) { setError(j.error || 'We could not confirm the payment yet.'); setStage('reserved'); return }
          setStage('paid')
        } catch {
          setError('Your payment went through, but we could not confirm it on this page. It will be matched automatically within a few minutes, and you will get an email.')
          setStage('reserved')
        }
      },
    })
    rzp.on('payment.failed', (r: any) => setError(r?.error?.description || 'The payment did not go through. You can try again.'))
    rzp.open()
  }, [])

  // Arriving from the "Pay now" button in an email: /ai-weekend?pay=<id>&t=<signature>
  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    const id = p.get('pay'), t = p.get('t')
    if (!id || !t) return
    setStage('sending')
    fetch('/api/weekend/pay', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, t }) })
      .then(async (r) => ({ ok: r.ok, j: await r.json().catch(() => ({})) }))
      .then(({ ok, j }) => {
        if (j.paid) { setWho(j.name || ''); setStage('paid'); return }
        if (!ok || !j.checkout) { setError(j.error || 'We could not open the payment.'); setStage('form'); return }
        setCheckout(j.checkout)
        setWho(j.checkout.name || '')
        pay(j.checkout)
      })
      .catch(() => { setError('We could not reach the server. Check your connection and try again.'); setStage('form') })
  }, [pay])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setStage('sending')
    try {
      const r = await fetch('/api/weekend/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, source: sourceOf() }) })
      const j = await r.json().catch(() => ({}))
      if (!r.ok) { setError(j.error || 'Something went wrong. Please try again.'); setStage('form'); return }
      setWho(f.name)
      if (j.paid) { setStage('paid'); return }
      if (j.checkout) { setCheckout(j.checkout); pay(j.checkout); return }
      setStage('reserved')
    } catch {
      setError('We could not reach the server. Check your connection and try again.')
      setStage('form')
    }
  }

  if (stage === 'paid') {
    return (
      <div className="py-8 text-center" role="status">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
        <h3 className="mt-3 text-2xl font-bold">Payment received{who ? `, ${who.split(/\s+/)[0]}` : ''}</h3>
        <p className="mt-2 text-[15px] text-gray-600">Your seat for {cohortLabel} is confirmed. A receipt is on its way to your email, and the joining link follows before the weekend.</p>
        <p className="mt-3 text-sm text-gray-500">After the weekend you receive the full kit.</p>
      </div>
    )
  }

  if (stage === 'reserved' || stage === 'paying' || stage === 'confirming') {
    return (
      <div className="py-6 text-center" role="status">
        {stage === 'reserved' ? <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" /> : <Loader2 className="mx-auto h-10 w-10 animate-spin text-gray-400" />}
        <h3 className="mt-3 text-2xl font-bold">{stage === 'confirming' ? 'Confirming your payment…' : stage === 'paying' ? 'Complete your payment' : 'Your seat is reserved'}</h3>
        {stage === 'paying' && <p className="mt-2 text-[15px] text-gray-600">The payment window is open. Pay ₹{fee} by UPI, card or net banking.</p>}
        {stage === 'reserved' && (checkout ? (
          <>
            <p className="mt-2 text-[15px] text-gray-600">One step is left: the fee of ₹{fee}. Your seat is confirmed the moment it is paid.</p>
            <button onClick={() => pay(checkout)} className={`${bigButton} mt-4`}>Pay ₹{fee} now</button>
            <p className="mt-3 text-sm text-gray-500">Prefer to pay later? We have emailed {checkout.email} a Pay now button.</p>
          </>
        ) : (
          <>
            <p className="mt-2 text-[15px] text-gray-600">We have emailed {f.email} with the details for {cohortLabel}. The payment details for ₹{fee} follow in a separate email. After the weekend you receive the full kit.</p>
            <p className="mt-3 text-sm text-gray-500">Nothing in your inbox? Check the spam folder, or write to admin@gennoor.com.</p>
          </>
        ))}
        {error && <p className="mt-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700 text-left" role="alert">{error}</p>}
      </div>
    )
  }

  if (full) {
    return (
      <div className="py-8 text-center">
        <h3 className="text-2xl font-bold">This cohort is full</h3>
        <p className="mt-2 text-[15px] text-gray-600">All the seats for {cohortLabel} are taken. Registration for the next month opens here as soon as this weekend begins.</p>
        <p className="mt-3 text-sm text-gray-500">Want a place held for next month? Write to admin@gennoor.com.</p>
      </div>
    )
  }

  const sending = stage === 'sending'
  return (
    <form onSubmit={submit} className="space-y-3" noValidate={false}>
      <h3 className="text-xl font-bold">Your details</h3>
      <p className="text-sm text-gray-600">You watch every demo built live, then receive the full kit to repeat it yourself.</p>
      <input className={input} required autoComplete="name" placeholder="Full name" value={f.name} onChange={set('name')} aria-label="Full name" />
      <input className={input} required type="email" autoComplete="email" placeholder="Email address" value={f.email} onChange={set('email')} aria-label="Email address" />
      <input className={input} required type="tel" autoComplete="tel" placeholder="Phone or WhatsApp number" value={f.phone} onChange={set('phone')} aria-label="Phone or WhatsApp number" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input className={input} autoComplete="organization" placeholder="Company (optional)" value={f.company} onChange={set('company')} aria-label="Company" />
        <input className={input} autoComplete="organization-title" placeholder="Your role (optional)" value={f.role} onChange={set('role')} aria-label="Your role" />
      </div>
      {/* Hidden from people; bots fill it in and are ignored */}
      <input tabIndex={-1} autoComplete="off" value={f.website_hp} onChange={set('website_hp')} className="hidden" aria-hidden="true" name="website" />
      {error && <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>}
      <button disabled={sending} className={bigButton}>
        {sending ? <><Loader2 className="h-4 w-4 animate-spin" /> One moment…</> : online ? `Continue to payment · ₹${fee}` : `Reserve my seat · ₹${fee}`}
      </button>
      {online && <p className="flex items-center justify-center gap-1.5 text-xs text-gray-500"><ShieldCheck className="h-3.5 w-3.5 text-green-600" /> Secure payment by Razorpay: UPI, cards and net banking</p>}
      <p className="text-xs text-gray-500">We use these details only to run the workshop and to tell you about the next one. See our <a href="/privacy" className="underline">privacy policy</a>.</p>
    </form>
  )
}

/** The bar that stays at the bottom while you read; it steps aside once the form is on screen. */
export function StickyRegister({ fee, regularFee, note }: { fee: number; regularFee: number; note: string }) {
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    const target = document.getElementById('register')
    if (!target || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([e]) => setHidden(e.isIntersecting), { threshold: 0.25 })
    io.observe(target)
    return () => io.disconnect()
  }, [])
  return (
    // A floating card in the middle of the screen, clear of the site menu and the chat buttons in the corners
    <div className={`fixed left-1/2 bottom-[76px] sm:bottom-4 z-40 w-[min(92vw,520px)] -translate-x-1/2 rounded-2xl border border-gray-200 bg-surface/95 shadow-xl backdrop-blur transition-all duration-300 ${hidden ? 'pointer-events-none translate-y-6 opacity-0' : ''}`}>
      <div className="flex items-center justify-between gap-3 px-4 py-2.5">
        <div className="min-w-0">
          <div className="leading-none"><span className="text-xl font-bold text-gray-900">₹{fee.toLocaleString('en-IN')}</span> <s className="text-sm text-gray-400">₹{regularFee.toLocaleString('en-IN')}</s></div>
          <div className="mt-1 truncate text-xs text-gray-500">{note}</div>
        </div>
        <a href="#register" className="st-pill st-gold st-sm shrink-0">Reserve my seat</a>
      </div>
    </div>
  )
}
