'use client'

import { useEffect, useRef, useState } from 'react'
import { Bot, Send, X, Sparkles } from 'lucide-react'
import { Spinner } from './shared'

interface Message { role: 'user' | 'assistant'; content: string }

const SUGGESTIONS = [
  'Which leads have not been contacted yet?',
  'Summarize this week’s activity',
  'Who is stuck in the diagnose stage?',
  'List GCC leads without research',
]

// GennoorBot for the CRM — answers over all lead data via /api/admin/crm-copilot.
export default function CrmCopilot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, busy])

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
    } catch (e: any) {
      setError(e.message)
      setMessages(messages)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      {/* Launcher */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-105"
          title="GennoorBot — CRM copilot"
        >
          <Bot className="w-6 h-6" />
        </button>
      )}

      {/* Panel */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="px-5 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Bot className="w-5 h-5" />
            <div>
              <div className="font-semibold text-sm">GennoorBot</div>
              <div className="text-xs text-blue-100">CRM copilot — knows all your lead data</div>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="p-2 hover:bg-white/15 rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
          {messages.length === 0 && (
            <div className="mt-6 space-y-3">
              <p className="text-sm text-gray-500 text-center">Ask anything about your pipeline.</p>
              <div className="space-y-2">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => ask(s)} className="w-full text-left text-sm px-3 py-2.5 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-700 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-purple-500 shrink-0" /> {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-sm whitespace-pre-line ${m.role === 'user' ? 'ml-auto bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
              {m.content}
            </div>
          ))}
          {busy && <Spinner label="Analyzing CRM data..." />}
          {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
          <div ref={bottomRef} />
        </div>

        <div className="p-3 border-t border-gray-100 flex gap-2 shrink-0">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && ask()}
            placeholder="Ask about your leads..."
            className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button onClick={() => ask()} disabled={busy || !input.trim()} className="px-3.5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  )
}
