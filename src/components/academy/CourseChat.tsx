'use client'

import { useCallback, useEffect, useRef, useState, FormEvent } from 'react'
import { Loader2, Maximize2, MessageCircle, Minimize2, Minus, Send, X } from 'lucide-react'
import ChatMarkdown from './ChatMarkdown'
import { CopyPairButton, ExportChatMenu } from './ChatTools'

interface Msg { id: string; role: 'learner' | 'assistant' | 'team'; text: string; at: string; attachments?: string[] }
type Mode = 'closed' | 'open' | 'min' | 'max'

/**
 * Course chat, docked on the left of the lesson screen. Minimise keeps the conversation,
 * maximise gives it room, close ends it, and the next opening starts fresh. Every message is
 * still recorded for the team. Replies from the team that you have not seen yet are shown
 * when the chat opens.
 */
export default function CourseChat({ slug, itemId, courseTitle }: { slug: string; itemId: string; courseTitle?: string }) {
  const [mode, setMode] = useState<Mode>('closed')
  const [w, setW] = useState(380)
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [unread, setUnread] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const seenKey = `gennoor.lms.teamSeen.${slug}`

  // Opening a fresh chat: bring in team replies you have not seen yet
  const loadUnseen = useCallback(async () => {
    try {
      const r = await fetch(`/api/lms/chat?slug=${encodeURIComponent(slug)}`, { cache: 'no-store' })
      if (!r.ok) return
      const all: Msg[] = (await r.json()).messages
      const lastSeen = localStorage.getItem(seenKey) || ''
      const fresh = all.filter(m => m.role === 'team' && m.id > lastSeen)
      if (fresh.length) {
        setMsgs(m => [...fresh, ...m])
        localStorage.setItem(seenKey, fresh[fresh.length - 1].id)
      }
      const newest = all.filter(m => m.role === 'team').pop()
      if (newest && !lastSeen) localStorage.setItem(seenKey, newest.id)
    } catch { /* the chat still works without it */ }
  }, [slug, seenKey])

  // A quiet dot on the launcher when the team has replied since you last looked
  useEffect(() => {
    let live = true
    fetch(`/api/lms/chat?slug=${encodeURIComponent(slug)}`, { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        if (!live || !d) return
        const lastSeen = localStorage.getItem(seenKey) || ''
        setUnread(d.messages.some((m: Msg) => m.role === 'team' && m.id > lastSeen))
      })
      .catch(() => {})
    return () => { live = false }
  }, [slug, seenKey])

  const openChat = () => {
    setUnread(false)
    window.dispatchEvent(new Event('gennoor:chat-open'))
    if (mode === 'closed') loadUnseen()
    setMode(m => (m === 'min' ? 'open' : m === 'closed' ? 'open' : m))
    setTimeout(() => inputRef.current?.focus(), 50)
  }
  const closeChat = () => { setMode('closed'); setMsgs([]); setText(''); setError('') }

  useEffect(() => {
    try { const v = Number(localStorage.getItem('gnr-chat-w')); if (v >= 300) setW(v) } catch { /* private mode */ }
  }, [])

  // While the chat is docked, tell the page how much room it takes so the video moves over and resizes.
  const docked = mode === 'open' || mode === 'max'
  const shown = mode === 'max' ? Math.max(w, 640) : w
  useEffect(() => {
    const root = document.documentElement
    if (docked) root.style.setProperty('--chat-w', `${shown}px`)
    else root.style.removeProperty('--chat-w')
    return () => { root.style.removeProperty('--chat-w') }
  }, [docked, shown])

  const startResize = (e: React.PointerEvent) => {
    e.preventDefault()
    const startX = e.clientX
    const startW = shown
    const move = (ev: PointerEvent) => setW(Math.max(300, Math.min(startW + (ev.clientX - startX), Math.min(900, window.innerWidth - 460))))
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      document.body.style.userSelect = ''
      setMode('open')
      setW(x => { try { localStorage.setItem('gnr-chat-w', String(x)) } catch { /* ignore */ } return x })
    }
    document.body.style.userSelect = 'none'
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }) }, [msgs, busy, mode])

  const send = async (e: FormEvent) => {
    e.preventDefault()
    const q = text.trim()
    if (!q || busy) return
    setBusy(true); setError(''); setText('')
    const temp: Msg = { id: `tmp-${Date.now()}`, role: 'learner', text: q, at: new Date().toISOString() }
    setMsgs(m => [...m, temp])
    try {
      const r = await fetch('/api/lms/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, itemId, message: q }),
      })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(d.error || 'Could not send your question.')
      const now = new Date().toISOString()
      setMsgs(m => [...m.filter(x => x.id !== temp.id), ...(d.messages as Msg[]).map(x => ({ ...x, at: x.at || now }))])
    } catch (err) {
      setMsgs(m => m.filter(x => x.id !== temp.id))
      setText(q)
      setError(err instanceof Error ? err.message : 'Could not send your question.')
    } finally { setBusy(false) }
  }

  if (mode === 'closed') {
    return (
      <button type="button" onClick={openChat} aria-label="Ask about this course"
        className="fixed z-40 left-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 bg-[#0f1824] text-white pl-2 pr-2.5 py-3.5 rounded-r-2xl shadow-lg hover:bg-[#1b2a3f] transition-colors">
        <span className="relative">
          <MessageCircle className="w-5 h-5" />
          {unread && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#f5a524] ring-2 ring-[#0f1824]" />}
        </span>
        <span className="text-[11px] font-semibold [writing-mode:vertical-rl] rotate-180">Ask</span>
      </button>
    )
  }

  if (mode === 'min') {
    return (
      <button type="button" onClick={openChat} aria-label="Open the chat"
        className="fixed z-40 left-4 bottom-4 flex items-center gap-2 bg-[#0f1824] text-white text-[13.5px] font-semibold pl-3.5 pr-4 py-2.5 rounded-full shadow-lg hover:bg-[#1b2a3f] transition-colors">
        <MessageCircle className="w-4 h-4" /> Ask about this course
        {msgs.length > 0 && <span className="ml-1 text-[11px] bg-white/20 rounded-full px-1.5">{msgs.length}</span>}
      </button>
    )
  }

  const wide = mode === 'max'
  return (
    <aside
      role="dialog" aria-label="Ask about this course"
      style={{ width: `min(${shown}px, 100vw)` }}
      className="fixed z-40 left-0 top-12 bottom-0 flex flex-col bg-surface shadow-[8px_0_30px_-12px_rgba(0,0,0,.35)] border-r border-gray-200"
    >
      <div onPointerDown={startResize} title="Drag to resize" className="hidden lg:block absolute right-0 top-0 bottom-0 w-1.5 z-10 cursor-col-resize hover:bg-primary-400/40 active:bg-primary-500/50 transition-colors" />
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 shrink-0">
        <MessageCircle className="w-[18px] h-[18px] text-primary-600" />
        <div className="min-w-0">
          <div className="font-semibold text-[14.5px] text-gray-900 leading-tight">Ask about this course</div>
          <div className="text-[11.5px] text-gray-400">Course questions only. Lab problems go to the discussion.</div>
        </div>
        <div className="ml-auto flex items-center gap-0.5">
          <ExportChatMenu msgs={msgs} courseTitle={courseTitle || slug} />
          <button type="button" onClick={() => setMode('min')} aria-label="Minimise" title="Minimise" className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"><Minus className="w-4 h-4" /></button>
          <button type="button" onClick={() => setMode(wide ? 'open' : 'max')} aria-label={wide ? 'Make smaller' : 'Make bigger'} title={wide ? 'Make smaller' : 'Make bigger'} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100">
            {wide ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button type="button" onClick={closeChat} aria-label="Close" title="Close (starts fresh next time)" className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"><X className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {msgs.length === 0 && !busy && (
          <p className="text-[14px] leading-relaxed text-gray-500">Ask about this lesson or the topics this course teaches. For lab problems or code, the discussion is the best place: other learners and the team can help.</p>
        )}
        {msgs.map((m, i) => (
          m.role === 'learner' ? (
            <div key={m.id} className="flex justify-end">
              <div className="max-w-[88%] rounded-2xl rounded-br-md bg-primary-600 text-white px-3.5 py-2 text-[14px] leading-relaxed whitespace-pre-wrap break-words">{m.text}</div>
            </div>
          ) : (
            <div key={m.id} className="flex">
              <div className={`max-w-full rounded-2xl rounded-bl-md px-3.5 py-2.5 text-[14px] leading-relaxed break-words ${m.role === 'team' ? 'bg-emerald-50 border border-emerald-200 text-gray-900' : 'bg-gray-50 text-gray-900'}`}>
                {m.role === 'team' && <div className="text-[11.5px] font-semibold text-emerald-700 mb-1">Reply from the Gennoor team</div>}
                <ChatMarkdown text={m.text} />
                {m.attachments?.length ? <div className="text-xs text-gray-500 mt-2">Files sent to your email: {m.attachments.join(', ')}</div> : null}
                <div><CopyPairButton msgs={msgs} index={i} /></div>
              </div>
            </div>
          )
        ))}
        {busy && <p className="text-[13px] text-gray-400 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Looking that up…</p>}
        <div ref={endRef} />
      </div>

      <form onSubmit={send} className="flex items-end gap-2 p-3 border-t border-gray-200 shrink-0">
        <textarea
          ref={inputRef} value={text} onChange={e => setText(e.target.value)} rows={1} maxLength={2000}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(e as unknown as FormEvent) } }}
          placeholder="Type your question" aria-label="Your question"
          className="flex-1 resize-none border border-gray-300 rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-primary-600 max-h-28"
        />
        <button type="submit" disabled={busy || !text.trim()} aria-label="Send" className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center disabled:opacity-40"><Send className="w-4 h-4" /></button>
      </form>
      {error && <p className="px-4 pb-3 text-[13px] text-red-600">{error}</p>}
    </aside>
  )
}
