'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import PromoPlayer from './PromoPlayer'

/** Course preview in a pop-up: plays at once with sound, full screen from the player, closes with the cross or Esc. */
export default function PreviewModal({ title, src, poster, onClose }: { title: string; src: string; poster?: string | null; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Esc first leaves full screen (the browser does that itself); a second Esc closes the pop-up.
      if (e.key === 'Escape' && !document.fullscreenElement) onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Preview: ${title}`}
      className="fixed inset-0 z-[120] bg-black/85 flex flex-col items-center justify-center p-4 sm:p-8"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <button type="button" onClick={onClose} aria-label="Close preview" className="absolute right-4 top-4 sm:right-6 sm:top-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
        <X className="w-6 h-6" />
      </button>
      <div className="w-full max-w-5xl">
        <PromoPlayer src={src} poster={poster} startMuted={false} />
        <p className="mt-4 text-center text-[15px] text-white/80">{title}</p>
      </div>
    </div>
  )
}
