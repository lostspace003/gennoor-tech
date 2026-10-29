'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

/** "View the outline": opens the outline in a pop-up that scrolls and closes, instead of a new tab. */
export default function OutlineViewer({ slug, title }: { slug: string; title: string }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [open])

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="link-arrow !text-[15px] text-left">View the outline ›</button>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true" aria-label={`${title} course outline`}>
          <div className="fixed inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative z-10 w-full max-w-5xl h-[90vh] bg-white rounded-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-gray-200">
              <p className="font-heading text-[15px] font-semibold text-gray-900 truncate">{title}: course outline</p>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-600" /></button>
            </div>
            <iframe src={`/api/outline/${slug}`} title={`${title} course outline`} sandbox="allow-scripts" className="flex-1 w-full border-0" />
          </div>
        </div>
      )}
    </>
  )
}
