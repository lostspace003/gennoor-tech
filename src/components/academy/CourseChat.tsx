'use client'

import { useCallback, useEffect, useRef, useState, FormEvent } from 'react'
import { ChevronDown, Loader2, MessageCircle, Send } from 'lucide-react'

interface Msg { id: string; role: 'learner' | 'assistant' | 'team'; text: string; at: string; attachments?: string[] }

const HEIGHT_KEY = 'gennoor.lms.chatH'
const MIN_H = 180
const MAX_H = 640

/**
 * Course chat under the video. One thread per learner per course; the whole history is kept.
 * Drag the bar on top to make it taller or shorter.
 */
export default function CourseChat({ slug, itemId }: { slug: string; itemId: string }) {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[] | null>(null)
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [h, setH] = useState(300)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try { const v = Number(localStorage.getItem(HEIGHT_KEY)); if (v >= MIN_H && v <= MAX_H) setH(v) } catch { /* ignore */ }
  }, [])

  const load = useCallback(async () => {
    const r = await fetch(`/api/lms/chat?slug=${encodeURIComponent(slug)}`, { cache: 'no-store' })
    if (r.ok) setMsgs((await r.json()).messages)
  }, [slug])

  useEffect(() => { if (open && msgs === null) load() }, [open, msgs, load])
  useEffect(() => { if (open) endRef.current?.scrollIntoView({ block: 'end' }) }, [msgs, open, busy])

  const startResize = (e: React.PointerEvent) => {
    e.preventDefault()
    const startY = e.clientY, startH = h
    const move = (ev: PointerEvent) => setH(Math.min(MAX_H, Math.max(MIN_H, startH + (startY - ev.clientY))))
    const up = () => {
      window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up)
      setH(cur => { try { localStorage.setItem(HEIGHT_KEY, String(cur)) } catch { /* ignore */ } return cur })
    }
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up)
  }

  const send = async (e: FormEvent) => {
    e.preventDefault()
    const q = text.trim()
    if (!q || busy) return
    setBusy(true); setError(''); setText('')
    const temp: Msg = { id: `tmp-${Date.now()}`, role: 'learner', text: q, at: new Date().toISOString() }
    setMsgs(m => [...(m ?? []), temp])
    try {
      const r = await fetch('/api/lms/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, itemId, message: q }),
      })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(d.error || 'Could not send your question.')
      setMsgs(m => [...(m ?? []).filter(x => x.id !== temp.id), ...d.messages])
    } catch (err) {
      setMsgs(m => (m ?? []).filter(x => x.id !== temp.id))
      setText(q)
      setError(err instanceof Error ? err.message : 'Could not send your question.')
    } finally { setBusy(false) }
  }

  return (
    <section className="mt-5 bg-white rounded-2xl border border-[#e2e5ec] overflow-hidden">
      <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open}
        className="w-full flex items-center gap-2.5 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors">
        <MessageCircle className="w-[18px] h-[18px] text-primary-600" />
        <span className="font-semibold text-[14.5px] text-gray-900">Ask about this course</span>
        <span className="text-[12.5px] text-[#86868b] hidden sm:inline">Questions and answers are kept for you</span>
        <ChevronDown className={`ml-auto w-4 h-4 text-[#86868b] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="border-t border-[#e8e8ed]">
          <div onPointerDown={startResize} title="Drag to resize" className="h-2.5 cursor-row-resize flex items-center justify-center hover:bg-gray-50 touch-none">
            <span className="w-10 h-[3px] rounded-full bg-[#d2d2d7]" />
          </div>
          <div style={{ height: h }} className="overflow-y-auto px-4 pb-3 space-y-3">
            {msgs === null && <p className="text-sm text-[#86868b] flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</p>}
            {msgs?.length === 0 && <p className="text-sm text-[#86868b] pt-2">Ask anything about this lesson or the course. If we cannot answer it here, the team will, and you will get it by email too.</p>}
            {msgs?.map(m => (
              <div key={m.id} className={`flex ${m.role === 'learner' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] rounded-2xl px-3.5 py-2 text-[14px] leading-relaxed whitespace-pre-wrap ${m.role === 'learner' ? 'bg-primary-600 text-white' : m.role === 'team' ? 'bg-emerald-50 border border-emerald-200 text-gray-900' : 'bg-[#f5f5f7] text-gray-900'}`}>
                  {m.role === 'team' && <div className="text-[11.5px] font-semibold text-emerald-700 mb-0.5">Gennoor team</div>}
                  {m.text}
                  {m.attachments?.length ? <div className="text-xs text-[#6e6e73] mt-1">Sent to your email: {m.attachments.join(', ')}</div> : null}
                </div>
              </div>
            ))}
            {busy && <p className="text-sm text-[#86868b] flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Looking that up…</p>}
            <div ref={endRef} />
          </div>
          <form onSubmit={send} className="flex items-end gap-2 p-3 border-t border-[#e8e8ed]">
            <textarea
              value={text} onChange={e => setText(e.target.value)} rows={1} maxLength={2000}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(e as unknown as FormEvent) } }}
              placeholder="Type your question" aria-label="Your question"
              className="flex-1 resize-none border border-[#d2d2d7] rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-primary-600 max-h-28"
            />
            <button type="submit" disabled={busy || !text.trim()} aria-label="Send" className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center disabled:opacity-40">
              <Send className="w-4 h-4" />
            </button>
          </form>
          {error && <p className="px-4 pb-3 text-[13px] text-red-600">{error}</p>}
        </div>
      )}
    </section>
  )
}
