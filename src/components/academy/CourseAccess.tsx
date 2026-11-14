'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader2, Maximize, Pause, Play, X } from 'lucide-react'
import { useLearnerAuth } from '@/hooks/useLearnerAuth'
import { useIndia } from '@/hooks/useIndia'
import type { LmsKind } from '@/lib/lms-kind'
import { useBoostedVolume } from '@/hooks/useBoostedVolume'
import VolumeControl from '@/components/media/VolumeControl'
import LearnerAuthModal from './LearnerAuthModal'
import { LessonLine } from './LessonLine'
import { OfferPill } from './Offer'

// Everything a visitor who does not own the course can do on its page:
// watch a preview lesson (no sign-in), or buy the full course (sign-in, then pay).

export interface Price { usd: number; inr: number }
/** A course shown as discounted: the percent off, and the regular price it is taken from. */
export interface Offer { percent: number; regular: Price }
/** A coupon code the buyer has typed in, and what the course costs with it (zero is free). */
export interface AppliedCoupon { code: string; percent: number; price: Price }
const usd = (n: number) => `$${n.toFixed(2)}`
const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`

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

interface BuyApi {
  buy: () => void; busy: boolean; price: Price
  /** The buyer is in India: rupees are shown and charged. Everyone else sees and pays dollars. Never both. */
  india: boolean
  /** False until the browser has said where the buyer is; no amount is drawn before that. */
  ready: boolean
  offer: Offer | null
  coupon: AppliedCoupon | null
  /** Check a code with the server. Returns the reason when it cannot be used. */
  applyCoupon: (code: string) => Promise<string | null>
  clearCoupon: () => void
}
const BuyContext = createContext<BuyApi | null>(null)
export const useBuy = () => useContext(BuyContext)

/**
 * Wraps the course page. Holds the one buying flow, so the big button, the
 * locked lessons and the end of a preview all start the same thing:
 * sign in if needed, then pay, then open the course.
 */
export function CourseBuyProvider({ slug, price, offer = null, children }: { slug: string; price: Price; offer?: Offer | null; children: React.ReactNode }) {
  const router = useRouter()
  const { isLoggedIn, refreshSession } = useLearnerAuth()
  const [authOpen, setAuthOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const where = useIndia()
  const india = where === true
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null)

  const applyCoupon = useCallback(async (code: string) => {
    try {
      const r = await fetch('/api/lms/coupon', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug, code }) })
      const j = await r.json().catch(() => ({}))
      if (!r.ok || !j.code) return j.error || 'We could not check that code. Please try again.'
      setCoupon({ code: j.code, percent: j.percent, price: j.price })
      return null
    } catch {
      return 'We could not reach the server. Check your connection and try again.'
    }
  }, [slug])

  const pay = useCallback(async () => {
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/lms/buy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug, india, coupon: coupon?.code }) })
      if (res.status === 401) { setAuthOpen(true); setBusy(false); return }
      const j = await res.json().catch(() => ({}))
      if (j.owned) { router.push(`/studio/${slug}/learn`); router.refresh(); return }
      if (j.couponRejected) setCoupon(null)
      if (!res.ok || !j.checkout) { setError(j.error || 'We could not start the payment. Please try again.'); setBusy(false); return }
      if (!(await loadRazorpay())) { setError('The payment window could not load. Check your connection and try again.'); setBusy(false); return }

      const c = j.checkout
      const rzp = new (window as any).Razorpay({
        key: c.keyId, order_id: c.orderId, amount: c.amount, currency: c.currency,
        name: 'Gennoor Tech', image: 'https://www.gennoor.com/logos/gennoor-tech-linkedin-profile-400x400.png', description: c.description,
        prefill: { name: c.name, email: c.email },
        theme: { color: '#0071e3' },
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
  }, [slug, india, coupon, router])

  const buy = useCallback(() => (isLoggedIn ? pay() : setAuthOpen(true)), [isLoggedIn, pay])

  return (
    <BuyContext.Provider value={{ buy, busy, price, india, ready: where !== null, offer, coupon, applyCoupon, clearCoupon: () => setCoupon(null) }}>
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

/** The price in the buyer's currency. With an offer or a coupon, the higher price is struck through beside it. */
export function PriceLine({ className = '' }: { className?: string }) {
  const b = useBuy()
  if (!b || !b.ready) return null
  const show = (p: Price) => (b.india ? inr(p.inr) : usd(p.usd))
  const now = b.coupon ? b.coupon.price : b.price
  const was = b.coupon ? b.price : b.offer?.regular
  // With neither an offer nor a code, the button already says the price
  if (!was) return null
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1.5 ${className}`}>
      <span className="text-[30px] font-bold leading-none tracking-tight text-gray-900 tabular-nums">{now.usd === 0 ? 'Free' : show(now)}</span>
      {was && <s className="text-[17px] text-gray-500 tabular-nums">{show(was)}</s>}
      {b.coupon
        ? <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--st-chip)] px-2.5 py-[3px] text-[12.5px] font-semibold text-gray-900"><Check className="w-3.5 h-3.5" strokeWidth={3} />{b.coupon.percent}% off with your code</span>
        : b.offer && <OfferPill percent={b.offer.percent} />}
    </div>
  )
}

/** The coupon code field, always in view beside the price (it was a link that had to be found first). It follows the theme, like the panels it sits on. */
export function CouponBox({ className = '' }: { className?: string }) {
  const b = useBuy()
  const [code, setCode] = useState('')
  const [checking, setChecking] = useState(false)
  const [problem, setProblem] = useState('')
  if (!b) return null

  if (b.coupon) {
    return (
      <p className={`text-[13px] text-gray-600 ${className}`}>
        Code <b className="font-semibold text-gray-900">{b.coupon.code}</b> applied: {b.coupon.percent >= 100 ? 'the course is free' : `${b.coupon.percent}% off`}.{' '}
        <button type="button" onClick={() => { b.clearCoupon(); setCode('') }} className="underline underline-offset-2 hover:text-gray-900">Remove</button>
      </p>
    )
  }
  const apply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim() || checking) return
    setChecking(true); setProblem('')
    const why = await b.applyCoupon(code)
    setChecking(false)
    if (why) setProblem(why)
  }
  return (
    <form onSubmit={apply} className={className}>
      <div className="flex items-center gap-2">
        <input
          value={code} onChange={(e) => { setCode(e.target.value.toUpperCase()); setProblem('') }} maxLength={24}
          aria-label="Coupon code" placeholder="Coupon code" autoComplete="off" spellCheck={false}
          className="w-44 rounded-full border border-gray-300 bg-raised px-4 py-2 text-[14px] font-medium tracking-wide text-gray-900 placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-400 focus:border-primary-400 focus:ring-0"
        />
        <button type="submit" disabled={!code.trim() || checking} className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-4 py-2 text-[13.5px] font-semibold text-gray-900 hover:bg-[color:var(--st-chip)] disabled:opacity-50">
          {checking && <Loader2 className="w-3.5 h-3.5 animate-spin" />}Apply
        </button>
      </div>
      {problem && <p role="alert" className="mt-2 text-[13px] text-red-600">{problem}</p>}
    </form>
  )
}

/** The main button: "Buy the full course · $19.99" (or "· ₹849" in India). */
export function BuyButton({ className = '', label }: { className?: string; label?: string }) {
  const b = useBuy()
  if (!b) return null
  const free = b.coupon?.price.usd === 0
  const now = b.coupon ? b.coupon.price : b.price
  const shown = free ? 'Free' : b.india ? inr(now.inr) : usd(now.usd)
  return (
    <button
      type="button"
      onClick={b.buy}
      disabled={b.busy}
      className={`inline-flex items-center justify-center gap-2 px-7 py-3 bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold rounded-full transition-colors disabled:opacity-60 ${className}`}
    >
      {b.busy && <Loader2 className="w-4 h-4 animate-spin" />}
      {free ? 'Get the full course' : label || 'Buy the full course'}{b.ready && <> · {shown}</>}
    </button>
  )
}

// ---------------------------------------------------------------- previews

export interface PreviewItem { id: string; title: string; module: string; minutes?: number }
const PreviewContext = createContext<{ open: (id: string, title: string) => void; all: PreviewItem[] } | null>(null)

/** Wraps the course's lessons. A preview lesson opens in a player on the page; nobody is asked to sign in. */
export function PreviewProvider({ slug, previews, children }: { slug: string; previews: PreviewItem[]; children: React.ReactNode }) {
  const [open, setOpen] = useState<{ id: string; title: string } | null>(null)
  return (
    <PreviewContext.Provider value={{ open: (id, title) => setOpen({ id, title }), all: previews }}>
      {children}
      {open && <PreviewPlayer key={open.id} slug={slug} id={open.id} title={open.title} all={previews} onPick={(p) => setOpen({ id: p.id, title: p.title })} onClose={() => setOpen(null)} />}
    </PreviewContext.Provider>
  )
}

/**
 * Every preview lesson of the course in one band, at the top of the curriculum. Each lesson
 * has room for its whole name and the module it comes from: nothing is cut short.
 */
export function PreviewList() {
  const ctx = useContext(PreviewContext)
  if (!ctx || ctx.all.length === 0) return null
  return (
    <div id="previews" className="scroll-mt-24 mb-8 st-card st-lit p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
        <div>
          <h3 className="font-heading text-[20px] font-semibold leading-snug tracking-[-0.01em] text-gray-900">Watch {ctx.all.length} preview lessons</h3>
          <p className="text-[14px] text-gray-500 mt-0.5">They play right here. No sign-in needed.</p>
        </div>
      </div>
      <ol className="mt-4 grid sm:grid-cols-2 gap-3">
        {ctx.all.map((p, i) => (
          <li key={p.id} className="min-w-0">
            <button
              type="button"
              onClick={() => ctx.open(p.id, p.title)}
              className="group w-full h-full flex items-start gap-3.5 rounded-2xl bg-raised border border-gray-200 p-4 text-left transition-colors hover:border-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              {/* The play tile is the site's calm tile, not a solid blue square with a glow: six of them are in view at once */}
              <span className="st-ico transition-transform group-hover:scale-105" style={{ ['--s' as string]: '40px' }} aria-hidden="true">
                <Play className="ml-0.5" fill="currentColor" stroke="currentColor" strokeWidth={1.75} />
              </span>
              <span className="min-w-0">
                <span className="block text-[12.5px] font-semibold text-gray-500">Preview {i + 1}{p.minutes ? ` · ${p.minutes} min` : ''}</span>
                <span className="block text-[15.5px] font-semibold leading-snug text-gray-900 mt-0.5">{p.title}</span>
                <span className="block text-[13px] leading-snug text-gray-500 mt-1.5">{p.module}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** A lesson row for someone who does not own the course: a preview plays, anything else offers to buy. */
export function LessonRow({ id, title, kind, minutes, preview }: { id: string; title: string; kind: LmsKind; minutes?: number; preview: boolean }) {
  const openPreview = useContext(PreviewContext)?.open
  const b = useBuy()
  return (
    <button
      type="button"
      onClick={() => (preview ? openPreview?.(id, title) : b?.buy())}
      title={preview ? 'Watch this lesson now' : 'Included in the full course'}
      className="group/line block w-full rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500"
    >
      <LessonLine title={title} kind={kind} minutes={minutes} state={preview ? 'preview' : 'locked'} />
    </button>
  )
}

function PreviewPlayer({ slug, id, title, all, onPick, onClose }: { slug: string; id: string; title: string; all: PreviewItem[]; onPick: (p: PreviewItem) => void; onClose: () => void }) {
  const video = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [caption, setCaption] = useState<string | null>(null)
  const [ended, setEnded] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const loud = useBoostedVolume(video)
  const [time, setTime] = useState(0)
  const [length, setLength] = useState(0)
  // While the slider is being dragged it shows where the finger is, not where the video is
  const [dragTo, setDragTo] = useState<number | null>(null)
  const b = useBuy()
  const clock = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`
  const toggle = () => { const v = video.current; if (!v) return; if (v.paused) v.play().catch(() => {}); else v.pause() }
  const seek = (to: number) => { const v = video.current; if (v && Number.isFinite(to)) { v.currentTime = to; setTime(to); setEnded(false) } }

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
      <div className="w-full max-w-4xl max-h-full overflow-y-auto rounded-2xl bg-[#0f1824] text-white shadow-2xl" style={{ scrollbarColor: "#1a8cf0 transparent", scrollbarWidth: "thin" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <div className="text-[11.5px] font-semibold uppercase tracking-wider text-[#8d9bb0]">Preview</div>
            <div className="text-[15px] font-semibold truncate">{title}</div>
          </div>
          <button onClick={onClose} aria-label="Close the preview" className="p-2 rounded-lg hover:bg-white/10"><X className="w-5 h-5" /></button>
        </div>
        <div className="relative bg-black aspect-video">
          <video
            ref={video} autoPlay playsInline controlsList="nodownload" muted={muted}
            onClick={toggle}
            onContextMenu={(e) => e.preventDefault()}
            onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
            onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setLength(e.currentTarget.duration || 0)}
            onDurationChange={(e) => setLength(e.currentTarget.duration || 0)}
            onEnded={() => setEnded(true)}
            className="w-full h-full cursor-pointer"
          >
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
        {/* Controls: always on screen, with a slider in the site's blue to move through the lesson */}
        <div className="flex items-center gap-3 px-4 pt-3">
          <button type="button" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'} className="p-2 rounded-full bg-white/10 hover:bg-white/20 shrink-0">
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <span className="text-[12.5px] tabular-nums text-[#aab6c8] shrink-0 w-10 text-right">{clock(dragTo ?? time)}</span>
          <input
            type="range" min={0} max={length || 0} step={0.1} value={dragTo ?? time} disabled={!length}
            aria-label="Move through the lesson"
            onChange={(e) => setDragTo(Number(e.target.value))}
            onPointerUp={() => { if (dragTo !== null) { seek(dragTo); setDragTo(null) } }}
            onKeyUp={() => { if (dragTo !== null) { seek(dragTo); setDragTo(null) } }}
            onBlur={() => { if (dragTo !== null) { seek(dragTo); setDragTo(null) } }}
            className="preview-seek flex-1 min-w-0"
            style={{ ['--done' as string]: `${length ? ((dragTo ?? time) / length) * 100 : 0}%` }}
          />
          <span className="text-[12.5px] tabular-nums text-[#aab6c8] shrink-0 w-10">{clock(length)}</span>
          <VolumeControl
            level={loud.level} max={loud.max} muted={muted}
            onLevel={loud.setLevel}
            onMuted={(off) => { setMuted(off); if (!off) loud.prime() }}
            align="right" className="shrink-0"
            buttonClassName="p-2 rounded-full hover:bg-white/10" iconClassName="w-4 h-4"
          />
          <button type="button" onClick={() => video.current?.requestFullscreen?.().catch(() => {})} aria-label="Full screen" className="p-2 rounded-full hover:bg-white/10 shrink-0">
            <Maximize className="w-4 h-4" />
          </button>
        </div>
        <style>{`
          input[type="range"].preview-seek { -webkit-appearance: none; appearance: none; height: 22px; background: transparent; cursor: pointer; }
          input[type="range"].preview-seek::-webkit-slider-runnable-track { height: 6px; border-radius: 999px; background: linear-gradient(to right, #1a8cf0 var(--done), rgba(255,255,255,.28) var(--done)); }
          input[type="range"].preview-seek::-moz-range-track { height: 6px; border-radius: 999px; background: rgba(255,255,255,.28); }
          input[type="range"].preview-seek::-moz-range-progress { height: 6px; border-radius: 999px; background: #1a8cf0; }
          input[type="range"].preview-seek::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height: 18px; margin-top: -6px; border-radius: 50%; background: #1a8cf0; border: 2px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,.5); }
          input[type="range"].preview-seek::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%; background: #1a8cf0; border: 2px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,.5); }
          input[type="range"].preview-seek:focus-visible { outline: 2px solid #7dbcf7; outline-offset: 4px; border-radius: 999px; }
          input[type="range"].preview-seek:disabled { opacity: .5; cursor: default; }
        `}</style>
        {b && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <p className="text-[13.5px] text-[#aab6c8]">You are watching a preview lesson. No sign-in needed.</p>
            <div className="flex items-center gap-3">
              {b.offer && !b.coupon && <OfferPill percent={b.offer.percent} />}
              <BuyButton className="!px-5 !py-2" />
            </div>
          </div>
        )}
        {/* The other previews, so they can all be watched from here */}
        {all.length > 1 && (
          <div className="px-4 pb-4">
            <div className="text-[12.5px] font-semibold text-[#8d9bb0] mb-2">All preview lessons</div>
            <ol className="grid sm:grid-cols-2 gap-1.5">
              {all.map((p, i) => (
                <li key={p.id} className="min-w-0">
                  <button
                    type="button"
                    onClick={() => p.id !== id && onPick(p)}
                    aria-current={p.id === id ? 'true' : undefined}
                    className={`w-full flex items-start gap-2.5 rounded-lg px-3 py-2 text-left text-[13.5px] leading-snug transition-colors ${p.id === id ? 'bg-white/15 text-white' : 'text-[#c9d2e0] hover:bg-white/10'}`}
                  >
                    <span className={`shrink-0 tabular-nums ${p.id === id ? 'text-primary-300' : 'text-[#8d9bb0]'}`}>{i + 1}</span>
                    <span className="min-w-0 flex-1">{p.title}</span>
                    {p.id === id && <span className="shrink-0 text-[11px] font-semibold text-primary-300">Playing</span>}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  )
}
