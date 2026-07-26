'use client'

import { useEffect, useRef, useState } from 'react'
import { Bot, Send, X, Sparkles, Minus, Maximize2, Minimize2 } from 'lucide-react'
import { Spinner } from './shared'

interface Message { role: 'user' | 'assistant'; content: string }

const SUGGESTIONS = [
  'Which leads have not been contacted yet?',
  'Summarize this week’s activity',
  'Who is stuck in the diagnose stage?',
  'List GCC leads without research',
]

// GennoorBot — CRM copilot over all lead data. Renders as a compact floater
// in the top bar with a pulsing presence light; the panel can be minimized
// back to the floater (chat is kept) or maximized for focused work.
export default function CrmCopilot() {
  const [open, setOpen] = useState(false)
  const [maximized, setMaximized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [unseen, setUnseen] = useState(false)
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
        body: JSON.stringify({ messages: next }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Copilot failed')
      setMessages([...next, { role: 'assistant', content: data.reply }])
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
      {/* Top floater with presence light */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-medium shadow-sm hover:shadow-md transition-all"
        title="GennoorBot — CRM copilot"
      >
        <Bot className="w-4 h-4" />
        <span className="hidden sm:inline">GennoorBot</span>
        {/* Signal light: green pulse = online; amber = new reply while minimized */}
        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${unseen ? 'bg-amber-400' : 'bg-green-400'}`} />
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${unseen ? 'bg-amber-400' : 'bg-green-500'}`} />
        </span>
      </button>

      {/* Panel */}
      {open && (
        <div
          className={`fixed z-[60] bg-white shadow-2xl border border-gray-200 flex flex-col transition-all duration-200 ${
            maximized
              ? 'inset-2 sm:inset-6 rounded-xl'
              : 'top-12 right-0 bottom-0 w-full sm:w-[400px] sm:rounded-tl-xl border-r-0'
          }`}
        >
          <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-between shrink-0 rounded-t-[inherit]">
            <div className="flex items-center gap-2.5">
              <span className="relative flex">
                <Bot className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-400 border border-white/50" />
              </span>
              <div>
                <div className="font-semibold text-sm leading-tight">GennoorBot</div>
                <div className="text-[10px] text-blue-100">CRM copilot · online · knows all your lead data</div>
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
                  <button key={s} onClick={() => ask(s)} className="w-full text-left text-xs px-3 py-2.5 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-700 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-purple-500 shrink-0" /> {s}
                  </button>
                ))}
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`max-w-[88%] rounded-xl px-3 py-2 text-sm whitespace-pre-line ${m.role === 'user' ? 'ml-auto bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                {m.content}
              </div>
            ))}
            {busy && <Spinner label="Analyzing CRM data..." />}
            {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
            <div ref={bottomRef} />
          </div>

          <div className="p-2.5 border-t border-gray-100 flex gap-2 shrink-0">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && ask()}
              placeholder="Ask about your leads..."
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button onClick={() => ask()} disabled={busy || !input.trim()} className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
