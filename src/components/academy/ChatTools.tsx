'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Copy, Download } from 'lucide-react'
import { copyText, downloadPdf, downloadText, formatTranscript, pairText, type ChatLine } from '@/lib/chat-export'

/** Copies this answer together with the question before it, as plain text. */
export function CopyPairButton({ msgs, index }: { msgs: ChatLine[]; index: number }) {
  const [done, setDone] = useState(false)
  const t = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (t.current) clearTimeout(t.current) }, [])
  const copy = async () => {
    if (!(await copyText(pairText(msgs, index)))) return
    setDone(true)
    if (t.current) clearTimeout(t.current)
    t.current = setTimeout(() => setDone(false), 1500)
  }
  return (
    <button type="button" onClick={copy} aria-label="Copy this question and answer" title="Copy question and answer"
      className="mt-1.5 inline-flex items-center gap-1 text-[11.5px] text-[#86868b] hover:text-gray-900 transition-colors">
      {done ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
      <span aria-live="polite">{done ? 'Copied' : 'Copy'}</span>
    </button>
  )
}

/** Export button for the chat header: the whole conversation as a PDF or a text file. */
export function ExportChatMenu({ msgs, courseTitle }: { msgs: ChatLine[]; courseTitle: string }) {
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const empty = msgs.length === 0

  useEffect(() => {
    if (!open) return
    const away = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false) }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', away); document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', away); document.removeEventListener('keydown', esc) }
  }, [open])

  const run = (kind: 'pdf' | 'txt') => {
    const text = formatTranscript(msgs, { courseTitle })
    if (kind === 'pdf') downloadPdf(text, courseTitle); else downloadText(text, courseTitle)
    setOpen(false)
  }

  return (
    <div ref={box} className="relative">
      <button type="button" disabled={empty} onClick={() => setOpen(o => !o)} aria-haspopup="menu" aria-expanded={open}
        aria-label="Export chat" title={empty ? 'Ask a question first' : 'Export chat'}
        className="p-1.5 rounded-lg text-[#6e6e73] hover:bg-gray-100 disabled:opacity-35 disabled:hover:bg-transparent">
        <Download className="w-4 h-4" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-full mt-1 z-50 w-44 rounded-xl border border-[#e2e5ec] bg-white p-1 shadow-lg">
          <p className="px-3 pt-1.5 pb-1 text-[11px] font-semibold uppercase tracking-wide text-[#86868b]">Export chat as</p>
          <button type="button" role="menuitem" onClick={() => run('pdf')} className="w-full text-left rounded-lg px-3 py-2 text-[13.5px] text-gray-900 hover:bg-gray-100">PDF file</button>
          <button type="button" role="menuitem" onClick={() => run('txt')} className="w-full text-left rounded-lg px-3 py-2 text-[13.5px] text-gray-900 hover:bg-gray-100">Text file</button>
        </div>
      )}
    </div>
  )
}
