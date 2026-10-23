'use client'

import { useCallback, useEffect, useRef, useState, FormEvent } from 'react'
import { usePathname } from 'next/navigation'
import { Loader2, Sparkles, X } from 'lucide-react'

/** Any button on the site can open the form with: window.dispatchEvent(new Event('open-custom-training')) */
export const OPEN_EVENT = 'open-custom-training'

const LABEL = 'block text-[12.5px] font-semibold text-gray-900 mb-1.5'
const FIELD =
  'w-full box-border font-[inherit] text-[14px] px-3.5 py-[11px] border border-[#d2d2d7] rounded-xl bg-white text-gray-900 placeholder:text-[#86868b] focus:outline-none focus:border-primary-600'

export function OpenCustomTraining({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>
      {children}
    </button>
  )
}

/** The subtle trigger at the top right, and the side panel with the form. Mounted once in the site shell. */
export default function CustomTraining() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')
  const [error, setError] = useState('')
  const closeRef = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    const onOpen = () => { setStatus(s => (s === 'success' ? 'idle' : s)); setOpen(true) }
    window.addEventListener(OPEN_EVENT, onOpen)
    return () => window.removeEventListener(OPEN_EVENT, onOpen)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [open, close])

  // Keep the lesson screen clear
  const hideTrigger = /^\/studio\/[^/]+\/learn/.test(pathname || '')

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setStatus('submitting')
    const fd = new FormData(e.currentTarget)
    const body = Object.fromEntries(fd.entries())
    try {
      const res = await fetch('/api/custom-training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, page: pathname }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.success) throw new Error(data.message || 'Could not send your request.')
      setStatus('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send your request.')
      setStatus('idle')
    }
  }

  return (
    <>
      {!hideTrigger && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed z-40 top-[calc(var(--portal-topbar-h)+8px)] lg:top-4 right-3 lg:right-5 inline-flex items-center gap-1.5 h-9 pl-3 pr-3.5 rounded-full text-[13px] font-medium text-gray-900 bg-white/90 backdrop-blur border border-[#d2d2d7] shadow-sm hover:border-primary-600 hover:text-primary-700 transition-colors"
          aria-label="Ask for custom training"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary-600" strokeWidth={2} />
          Custom training
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-labelledby="ct-title">
          <div className="absolute inset-0 bg-black/30" onClick={close} />
          <aside className="absolute right-0 top-0 h-full w-full sm:w-[460px] bg-white shadow-2xl flex flex-col">
            <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-[#e8e8ed]">
              <div>
                <h2 id="ct-title" className="font-heading text-[20px] font-bold text-gray-900">Custom training</h2>
                <p className="text-[13.5px] text-[#6e6e73] mt-1">Tell us what your team needs to learn or build. We will write back with a plan.</p>
              </div>
              <button ref={closeRef} type="button" onClick={close} aria-label="Close" className="p-1.5 -mr-1.5 rounded-lg text-gray-500 hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {status === 'success' ? (
                <div className="text-center py-14">
                  <div className="text-[44px] font-bold text-[#1d8348] mb-3">✓</div>
                  <h3 className="text-[20px] font-bold text-gray-900 mb-2">Request sent.</h3>
                  <p className="text-[14.5px] text-[#6e6e73]">We sent a confirmation to your email. We reply within one business day.</p>
                  <button type="button" onClick={close} className="mt-6 text-sm font-medium text-primary-600 hover:underline">Close</button>
                </div>
              ) : (
                <form id="ct-form" onSubmit={submit} className="space-y-3.5">
                  {error && <div className="border border-[#eaa59d] bg-[#fdf4f3] rounded-xl px-4 py-3 text-sm text-[#9b2c21]">{error}</div>}
                  <div><label htmlFor="ct-name" className={LABEL}>Name</label><input id="ct-name" name="name" required className={FIELD} autoComplete="name" /></div>
                  <div><label htmlFor="ct-email" className={LABEL}>Work email</label><input id="ct-email" name="email" type="email" required className={FIELD} autoComplete="email" placeholder="you@company.com" /></div>
                  <div><label htmlFor="ct-org" className={LABEL}>Organization</label><input id="ct-org" name="organization" required className={FIELD} autoComplete="organization" /></div>
                  <div><label htmlFor="ct-topic" className={LABEL}>What should the team learn?</label><input id="ct-topic" name="topic" required className={FIELD} placeholder="For example: Claude for the support team" /></div>
                  <div>
                    <label htmlFor="ct-detail" className={LABEL}>The project or work it is for</label>
                    <textarea id="ct-detail" name="detail" required rows={4} maxLength={2000} className={FIELD} placeholder="What should they be able to do afterwards? Which tools or data do they use?" />
                  </div>
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label htmlFor="ct-size" className={LABEL}>People</label>
                      <select id="ct-size" name="teamSize" defaultValue="" className={FIELD}>
                        <option value="">Not sure</option>
                        <option>1–10</option><option>11–50</option><option>51–200</option><option>200+</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="ct-when" className={LABEL}>When</label>
                      <select id="ct-when" name="timing" defaultValue="" className={FIELD}>
                        <option value="">Not sure</option>
                        <option>This month</option><option>In 1–3 months</option><option>Just exploring</option>
                      </select>
                    </div>
                  </div>
                  <div><label htmlFor="ct-phone" className={LABEL}>Phone or WhatsApp (optional)</label><input id="ct-phone" name="phone" className={FIELD} autoComplete="tel" /></div>
                </form>
              )}
            </div>

            {status !== 'success' && (
              <div className="px-6 py-4 border-t border-[#e8e8ed]">
                <button type="submit" form="ct-form" disabled={status === 'submitting'} className="pill-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-60">
                  {status === 'submitting' && <Loader2 className="w-4 h-4 animate-spin" />} Send request
                </button>
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  )
}
