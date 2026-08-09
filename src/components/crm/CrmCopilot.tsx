'use client'

import { useEffect, useRef, useState } from 'react'
import { Bot, Send, X, Sparkles, Minus, Maximize2, Minimize2, Globe } from 'lucide-react'
import { Spinner, CopyMsg } from './shared'

interface Message { role: 'user' | 'assistant'; content: string; usedWeb?: boolean; note?: string }

const SUGGESTIONS = [
  'Which leads have not been contacted yet?',
  'Summarize this week’s activity',
  'Who is stuck in the diagnose stage?',
  'List GCC leads without research',
]

// GennoorBot — CRM copilot over all lead data. Lives as a floating action
// button in the bottom-left of the workspace (never over the sidebar: the
// parent positions it inside the content column), with a pulsing presence
// light. The panel rises from the button, can be minimized back to it (chat
// is kept) or maximized for focused work.
export default function CrmCopilot() {
  const [open, setOpen] = useState(false)
  const [maximized, setMaximized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [unseen, setUnseen] = useState(false)
  const [webSearch, setWebSearch] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      setUnseen(false)
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, busy, open])

  const ask = async (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || busy) return
    setInput('')
    setError('')
    const next = [...messages, { role: 'user' as const, content }]
    setMessages(next)
    setBusy(true)
    try {
      const res = await fetch('/api/admin/crm-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, web: webSearch }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Copilot failed')
      setMessages([...next, { role: 'assistant', content: data.reply, usedWeb: data.usedWeb, note: data.webNote }])
      if (!open) setUnseen(true)
    } catch (e: any) {
      setError(e.message)
      setMessages(messages)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      {/* Bottom-left floater: avatar, live presence ring, hover label */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="group absolute bottom-5 left-5 z-[55] flex items-center gap-2.5 rounded-full bg-white pl-1.5 pr-1.5 py-1.5 shadow-[0_6px_24px_rgba(15,23,42,0.18)] border border-[#e8e8ed] hover:pr-4 hover:shadow-[0_10px_30px_rgba(15,23,42,0.22)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
        title="GennoorBot — CRM copilot"
        aria-label="Open GennoorBot"
        aria-expanded={open}
      >
        <span className="relative flex">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/gennoorbot-avatar.svg" alt="" className="w-10 h-10 transition-transform duration-200 group-hover:scale-105" />
          {/* presence: green when idle, amber ping when a reply is waiting */}
          <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
            {unseen && <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-amber-400" />}
            <span className={`relative inline-flex rounded-full h-3 w-3 border-2 border-white ${unseen ? 'bg-amber-400' : 'bg-green-500'}`} />
          </span>
        </span>
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-[13px] font-semibold text-gray-900 opacity-0 transition-all duration-200 group-hover:max-w-[9rem] group-hover:opacity-100">
          {open ? 'Hide GennoorBot' : 'Ask GennoorBot'}
        </span>
      </button>

      {/* Panel — rises from the floater, or takes the screen when maximized */}
      {open && (
        <div
          className={`z-[60] bg-white shadow-2xl border border-gray-200 flex flex-col transition-all duration-200 rounded-xl ${
            maximized
              ? 'fixed inset-2 sm:inset-6'
              : 'absolute left-3 right-3 bottom-[5.5rem] h-[min(34rem,calc(100%-8rem))] sm:left-5 sm:right-auto sm:w-[400px]'
          }`}
        >
          <div className="px-4 py-3 bg-primary-600 text-white flex items-center justify-between shrink-0 rounded-t-[inherit]">
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logos/gennoorbot-avatar.svg" alt="GennoorBot" className="w-8 h-8" />
              <div>
                <div className="font-semibold text-sm leading-tight">GennoorBot</div>
                <div className="text-[10px] text-primary-100">CRM copilot · online · knows all your lead data</div>
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              <button onClick={() => setMaximized((m) => !m)} className="p-1.5 hover:bg-white/15 rounded-lg" title={maximized ? 'Restore' : 'Maximize'}>
                {maximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-white/15 rounded-lg" title="Minimize (chat is kept)">
                <Minus className="w-4 h-4" />
              </button>
              <button onClick={() => { setOpen(false); setMessages([]); setError('') }} className="p-1.5 hover:bg-white/15 rounded-lg" title="Close & clear chat">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 min-h-0">
            {messages.length === 0 && (
              <div className="mt-4 space-y-2.5">
                <p className="text-sm text-gray-500 text-center">Ask anything about your pipeline.</p>
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => ask(s)} className="w-full text-left text-xs px-3 py-2.5 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-gray-500 shrink-0" /> {s}
                  </button>
                ))}
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`max-w-[88%] rounded-xl px-3 py-2 text-sm whitespace-pre-line break-words ${m.role === 'user' ? 'ml-auto bg-primary-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                {m.content}
                <CopyMsg text={m.content} light={m.role === 'user'} />
                {m.usedWeb && <div className="mt-1.5 text-[10px] text-green-600 flex items-center gap-1"><Globe className="w-3 h-3" /> answered with live web search</div>}
                {m.note && <div className="mt-1.5 text-[10px] text-amber-600">{m.note}</div>}
              </div>
            ))}
            {busy && <Spinner label="Analyzing CRM data..." />}
            {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
            <div ref={bottomRef} />
          </div>

          <div className="p-2.5 border-t border-gray-100 space-y-1.5 shrink-0">
            <button
              onClick={() => setWebSearch((w) => !w)}
              className={`flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-full border transition-colors ${webSearch ? 'bg-green-600 text-white border-green-600' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
              title="When on, GennoorBot also searches the live web (Foundry). Slower; falls back to CRM-only if the model is busy."
            >
              <Globe className="w-3 h-3" /> Web search {webSearch ? 'ON' : 'off'}
            </button>
            <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && ask()}
              placeholder={webSearch ? 'Ask — CRM data + live web...' : 'Ask about your leads...'}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
            <button onClick={() => ask()} disabled={busy || !input.trim()} className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50">
              <Send className="w-4 h-4" />
            </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
