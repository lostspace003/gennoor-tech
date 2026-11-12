'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'

const input = 'w-full rounded-xl border border-gray-300 bg-white px-3.5 py-3 text-[15px] text-gray-900 placeholder:text-gray-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20'

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

export default function RegisterForm({ cohortLabel, fee, full }: { cohortLabel: string; fee: number; full?: boolean }) {
  const [f, setF] = useState({ name: '', email: '', phone: '', company: '', role: '', website_hp: '' })
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState('')
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF((x) => ({ ...x, [k]: e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setState('sending')
    try {
      const r = await fetch('/api/weekend/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, source: sourceOf() }) })
      const j = await r.json().catch(() => ({}))
      if (!r.ok) { setError(j.error || 'Something went wrong. Please try again.'); setState('idle'); return }
      setState('done')
    } catch {
      setError('We could not reach the server. Check your connection and try again.')
      setState('idle')
    }
  }

  if (state === 'done') {
    return (
      <div className="py-8 text-center" role="status">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
        <h3 className="mt-3 text-2xl font-bold">Your seat is reserved</h3>
        <p className="mt-2 text-[15px] text-gray-600">We have emailed {f.email} with the details for {cohortLabel}. The payment details for ₹{fee} follow in a separate email. After the weekend you receive the full kit.</p>
        <p className="mt-3 text-sm text-gray-500">Nothing in your inbox? Check the spam folder, or write to admin@gennoor.com.</p>
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
      <button disabled={state === 'sending'} className="w-full rounded-xl bg-[#0C1426] px-5 py-3.5 text-base font-bold text-white hover:bg-black disabled:opacity-60 inline-flex items-center justify-center gap-2">
        {state === 'sending' ? <><Loader2 className="h-4 w-4 animate-spin" /> Reserving…</> : `Reserve my seat · ₹${fee}`}
      </button>
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
    <div className={`fixed left-1/2 bottom-[76px] sm:bottom-4 z-40 w-[min(92vw,520px)] -translate-x-1/2 rounded-2xl border border-gray-200 bg-white/95 shadow-xl backdrop-blur transition-all duration-300 ${hidden ? 'pointer-events-none translate-y-6 opacity-0' : ''}`}>
      <div className="flex items-center justify-between gap-3 px-4 py-2.5">
        <div className="min-w-0">
          <div className="leading-none"><span className="text-xl font-bold text-[#0C1426]">₹{fee.toLocaleString('en-IN')}</span> <s className="text-sm text-gray-400">₹{regularFee.toLocaleString('en-IN')}</s></div>
          <div className="mt-1 truncate text-xs text-gray-500">{note}</div>
        </div>
        <a href="#register" className="shrink-0 rounded-xl bg-[#0C1426] px-5 py-3 text-sm font-bold text-white hover:bg-black">Reserve my seat</a>
      </div>
    </div>
  )
}
