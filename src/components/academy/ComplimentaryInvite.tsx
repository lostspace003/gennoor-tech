'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { KeyRound, X } from 'lucide-react'
import { Ico } from '@/components/stage/Ico'

// Complimentary access, on every course page (owner, 27 November 2026: on each course page, and a pop-up once a
// browser session when someone closes a preview). The course page is one template, so every course, new ones
// included, has both. The pop-up is shown at most once per browser session (sessionStorage).

const SEEN = 'gennoor.complimentary.popup'
const MESSAGE = 'Want complimentary access to the Learning Studio?'

/** The tile on the course page. */
export function ComplimentaryTile() {
  return (
    <section className="st-card flex flex-col sm:flex-row sm:items-center gap-4 justify-between px-5 py-5" aria-label="Complimentary access">
      <div className="flex gap-3 items-start">
        <Ico icon={KeyRound} tone="blue" size={40} />
        <div>
          <h2 className="text-[17px] font-bold text-gray-900">{MESSAGE}</h2>
          <p className="mt-0.5 text-sm text-gray-600">Choose up to two courses and try them in full. We email you a code for each.</p>
        </div>
      </div>
      <Link href="/complimentary-access" className="st-pill st-ghost st-sm whitespace-nowrap self-start sm:self-center">Click here</Link>
    </section>
  )
}

/** The pop-up after a preview closes: once per browser session. Call `offer()` when the preview closes. */
export function useComplimentaryPopup() {
  const [show, setShow] = useState(false)
  const offer = () => {
    try { if (sessionStorage.getItem(SEEN)) return; sessionStorage.setItem(SEEN, '1') } catch { /* no storage: show it */ }
    setShow(true)
  }
  const popup = show ? <ComplimentaryPopup onClose={() => setShow(false)} /> : null
  return { offer, popup }
}

function ComplimentaryPopup({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Complimentary access" onClick={onClose}>
      <div className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-raised p-6 text-center" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-3 top-3 p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"><X className="w-4 h-4" /></button>
        <div className="flex justify-center"><Ico icon={KeyRound} tone="blue" size={44} /></div>
        <h2 className="mt-3 text-lg font-bold text-gray-900">{MESSAGE}</h2>
        <p className="mt-1.5 text-sm text-gray-600">Choose up to two courses and try them in full, with nothing to pay. We email you a code for each.</p>
        <Link href="/complimentary-access" className="st-pill mt-5 inline-flex" onClick={onClose}>Click here</Link>
      </div>
    </div>
  )
}
