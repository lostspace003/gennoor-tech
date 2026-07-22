'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { X, Download, Maximize, Minimize2, FileText } from 'lucide-react'

interface PdfViewerModalProps {
  /** Title shown in the player toolbar. */
  title: string
  /** Direct PDF URL — also used verbatim by the Download button. */
  pdfUrl: string
  onClose: () => void
}

/**
 * In-page PDF player — opens course PDFs inside the site in a sleek modal with
 * a maximize (true fullscreen) control, instead of dumping the learner into a
 * raw browser tab. The Download button keeps the direct URL untouched.
 */
export default function PdfViewerModal({ title, pdfUrl, onClose }: PdfViewerModalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      containerRef.current.requestFullscreen()
    }
  }, [])

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.fullscreenElement) onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 bg-gray-900/70 backdrop-blur-sm modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — PDF viewer`}
    >
      <div
        ref={containerRef}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-5xl h-full max-h-[92vh] bg-[#0C1426] rounded-2xl overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Toolbar */}
        <div className="flex-shrink-0 h-14 flex items-center gap-3 px-4 text-white">
          <FileText className="w-4 h-4 text-white/60 flex-shrink-0" />
          <span className="flex-1 text-sm font-medium truncate">{title}</span>

          <button
            onClick={toggleFullscreen}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 transition-colors"
            title={isFullscreen ? 'Exit full screen (Esc)' : 'View full screen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Exit' : 'Maximize'}</span>
          </button>

          <a
            href={pdfUrl}
            download
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 transition-colors"
            title="Download PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </a>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title="Close (Esc)"
            aria-label="Close PDF viewer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PDF surface */}
        <iframe
          src={pdfUrl}
          title={title}
          className="flex-1 w-full bg-gray-100 border-0"
        />
      </div>
    </div>
  )
}
