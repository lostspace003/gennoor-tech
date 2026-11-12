'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Lock, PlayCircle, X } from 'lucide-react'
import { useLearnerAuth } from '@/hooks/useLearnerAuth'
import LearnerAuthModal from './LearnerAuthModal'

// Everything a visitor who does not own the course can do on its page:
// watch a preview lesson (no sign-in), or buy the full course (sign-in, then pay).

export interface Price { usd: number; inr: number }
const usd = (n: number) => `$${n.toFixed(2)}`
const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`

/** A first guess at whether the buyer is in India, from the device's time zone. They can switch. */
const looksLikeIndia = () => {
  try { return /^Asia\/(Kolkata|Calcutta)$/.test(Intl.DateTimeFormat().resolvedOptions().timeZone) } catch { return false }
}

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

// ---------------------------------------------------------------- buying

interface BuyApi { buy: () => void; busy: boolean; price: Price; india: boolean; setIndia: (v: boolean) => void }
const BuyContext = createContext<BuyApi | null>(null)
export const useBuy = () => useContext(BuyContext)

/**
 * Wraps the course page. Holds the one buying flow, so the big button, the
 * locked lessons and the end of a preview all start the same thing:
 * sign in if needed, then pay, then open the course.
 */
export function CourseBuyProvider({ slug, price, children }: { slug: string; price: Price; children: React.ReactNode }) {
  const router = useRouter()
  const { isLoggedIn, refreshSession } = useLearnerAuth()
  const [authOpen, setAuthOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [india, setIndia] = useState(false)
  useEffect(() => setIndia(looksLikeIndia()), [])

  const pay = useCallback(async () => {
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/lms/buy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug, india }) })
      if (res.status === 401) { setAuthOpen(true); setBusy(false); return }
      const j = await res.json().catch(() => ({}))
      if (j.owned) { router.push(`/studio/${slug}/learn`); return }
      if (!res.ok || !j.checkout) { setError(j.error || 'We could not start the payment. Please try again.'); setBusy(false); return }
      if (!(await loadRazorpay())) { setError('The payment window could not load. Check your connection and try again.'); setBusy(false); return }

      const c = j.checkout
      const rzp = new (window as any).Razorpay({
        key: c.keyId, order_id: c.orderId, amount: c.amount, currency: c.currency,
        name: 'Gennoor Tech', description: c.description,
        prefill: { name: c.name, email: c.email },
        theme: { color: '#0f1824' },
        modal: { ondismiss: () => setBusy(false) },
        handler: async (r: Record<string, string>) => {
          try {
            const v = await fetch('/api/lms/buy/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(r) })
            const vj = await v.json().catch(() => ({}))
            if (!v.ok) { setError(vj.error || 'We could not confirm the payment yet.'); setBusy(false); return }
            router.push(`/studio/${slug}/learn`)
            router.refresh()
          } catch {
            setError('Your payment went through, but we could not confirm it on this page. The course will open within a few minutes, and a receipt is on its way.')
            setBusy(false)
          }
        },
      })
      rzp.on('payment.failed', (r: any) => { setError(r?.error?.description || 'The payment did not go through. You can try again.') })
      rzp.open()
    } catch {
      setError('We could not reach the server. Check your connection and try again.')
      setBusy(false)
    }
  }, [slug, india, router])

  const buy = useCallback(() => (isLoggedIn ? pay() : setAuthOpen(true)), [isLoggedIn, pay])

  return (
    <BuyContext.Provider value={{ buy, busy, price, india, setIndia }}>
      {children}
      {error && (
        <div role="alert" className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
          <div className="max-w-xl rounded-xl bg-red-600 text-white text-[14px] px-4 py-3 shadow-lg flex gap-3">
            <span>{error}</span>
            <button onClick={() => setError('')} aria-label="Dismiss" className="shrink-0 opacity-80 hover:opacity-100"><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}
      <LearnerAuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onLoginSuccess={async () => { setAuthOpen(false); await refreshSession(); pay() }}
        title="Sign in to buy this course"
        subtitle="Your course is kept on your account, so you can open it on any device."
      />
    </BuyContext.Provider>
  )
}

/** The line under the buy button that lets a buyer switch between dollars and rupees. */
export function CurrencyNote({ className = '' }: { className?: string }) {
  const b = useBuy()
  if (!b) return null
  return (
    <button type="button" onClick={() => b.setIndia(!b.india)} className={`text-[13px] underline underline-offset-2 ${className}`}>
      {b.india ? `Paying from outside India? Pay ${usd(b.price.usd)}` : `Paying from India? Pay ${inr(b.price.inr)} by UPI, card or net banking`}
    </button>
  )
}

/** The main button: "Buy the full course · $9.99". */
export function BuyButton({ className = '', label }: { className?: string; label?: string }) {
  const b = useBuy()
  if (!b) return null
  const shown = b.india ? inr(b.price.inr) : usd(b.price.usd)
  return (
    <button
      type="button"
      onClick={b.buy}
      disabled={b.busy}
      className={`inline-flex items-center justify-center gap-2 px-7 py-3 bg-primary-600 hover:bg-[#0077ed] text-white text-sm font-semibold rounded-full transition-colors disabled:opacity-60 ${className}`}
    >
      {b.busy && <Loader2 className="w-4 h-4 animate-spin" />}
      {label || 'Buy the full course'} · {shown}
    </button>
  )
}

// ---------------------------------------------------------------- previews

const PreviewContext = createContext<((id: string, title: string) => void) | null>(null)

/** Wraps the outline. A preview lesson opens in a player on the page; nobody is asked to sign in. */
export function PreviewProvider({ slug, children }: { slug: string; children: React.ReactNode }) {
  const [open, setOpen] = useState<{ id: string; title: string } | null>(null)
  return (
    <PreviewContext.Provider value={(id, title) => setOpen({ id, title })}>
      {children}
      {open && <PreviewPlayer slug={slug} id={open.id} title={open.title} onClose={() => setOpen(null)} />}
    </PreviewContext.Provider>
  )
}

/** A lesson row for someone who does not own the course: a preview plays, anything else offers to buy. */
export function LessonRow({ id, title, color, preview }: { id: string; title: string; color: string; preview: boolean }) {
  const openPreview = useContext(PreviewContext)
  const b = useBuy()
  return (
    <button
      type="button"
      onClick={() => (preview ? openPreview?.(id, title) : b?.buy())}
      title={preview ? 'Watch this lesson now' : 'Included in the full course'}
      className={`w-full flex items-start gap-3 py-1.5 text-left text-[14.5px] leading-snug transition-colors ${preview ? 'text-[#1d1d1f] hover:text-primary-600' : 'text-[#6e6e73] hover:text-[#424245]'}`}
    >
      <span className="w-1.5 h-4 rounded-[1px] mt-0.5 shrink-0" style={{ background: color, opacity: preview ? 1 : 0.45 }} />
      <span className="flex-1">{title}</span>
      {preview ? (
        <span className="shrink-0 inline-flex items-center gap-1 text-[12.5px] font-semibold text-primary-600"><PlayCircle className="w-4 h-4" /> Preview</span>
      ) : (
        <Lock className="w-3.5 h-3.5 mt-1 shrink-0 text-[#a1a1a6]" aria-label="In the full course" />
      )}
    </button>
  )
}

function PreviewPlayer({ slug, id, title, onClose }: { slug: string; id: string; title: string; onClose: () => void }) {
  const video = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [caption, setCaption] = useState<string | null>(null)
  const [ended, setEnded] = useState(false)
  const b = useBuy()

  useEffect(() => {
    let hls: { destroy: () => void } | null = null
    let cancelled = false
    ;(async () => {
      try {
        const v = video.current
        if (!v) return
        const nativeHls = !!v.canPlayType('application/vnd.apple.mpegurl')
        const res = await fetch(`/api/lms/play?slug=${slug}&item=${id}`, { cache: 'no-store' })
        const d = await res.json().catch(() => ({}))
        if (cancelled) return
        if (!res.ok) { setError(d.error || 'This preview could not be loaded.'); setLoading(false); return }
        setCaption(d.captionUrl || null)
        if (d.hlsUrl) {
          const { default: Hls } = await import('hls.js')
          if (Hls.isSupported()) {
            const h = new Hls({ maxBufferLength: 30, enableWorker: true })
            hls = h
            h.on(Hls.Events.ERROR, (_e, data) => { if (data.fatal) setError('The preview stopped loading. Close it and try again.') })
            h.loadSource(d.hlsUrl)
            h.attachMedia(v)
          } else if (nativeHls) {
            // The browser's own player may ask for the playlist more than once, so it gets a link that allows it
            const r = await fetch(`/api/lms/play?slug=${slug}&item=${id}&native=1`, { cache: 'no-store' })
            v.src = r.ok ? (await r.json()).hlsUrl : d.hlsUrl
          } else {
            setError('This browser cannot play the preview.')
          }
        } else if (d.videoUrl) {
          v.src = d.videoUrl
        }
        setLoading(false)
      } catch {
        if (!cancelled) { setError('This preview could not be loaded.'); setLoading(false) }
      }
    })()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => { cancelled = true; hls?.destroy(); window.removeEventListener('keydown', onKey) }
  }, [slug, id, onClose])

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true" aria-label={`Preview: ${title}`} onClick={onClose}>
      <div className="w-full max-w-4xl rounded-2xl overflow-hidden bg-[#0f1824] text-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <div className="text-[11.5px] font-semibold uppercase tracking-wider text-[#8d9bb0]">Preview</div>
            <div className="text-[15px] font-semibold truncate">{title}</div>
          </div>
          <button onClick={onClose} aria-label="Close the preview" className="p-2 rounded-lg hover:bg-white/10"><X className="w-5 h-5" /></button>
        </div>
        <div className="relative bg-black aspect-video">
          <video ref={video} controls autoPlay playsInline controlsList="nodownload" onContextMenu={(e) => e.preventDefault()} onEnded={() => setEnded(true)} className="w-full h-full">
            {caption && <track kind="captions" src={caption} srcLang="en" label="English" />}
          </video>
          {loading && !error && <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-white/70" /></div>}
          {error && <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-[15px] text-white/90">{error}</div>}
          {ended && b && (
            <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-4 p-6 text-center">
              <p className="text-lg font-semibold">That was a preview.</p>
              <p className="text-[14.5px] text-[#aab6c8] max-w-md">The full course has every lesson, the labs, the quizzes and a certificate.</p>
              <BuyButton />
            </div>
          )}
        </div>
        {b && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <p className="text-[13.5px] text-[#aab6c8]">You are watching a free preview. No sign-in needed.</p>
            <BuyButton className="!px-5 !py-2" />
          </div>
        )}
      </div>
    </div>
  )
}
