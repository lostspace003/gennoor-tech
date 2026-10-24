'use client'

import { useCallback, useEffect, useRef, useState, FormEvent } from 'react'
import { Loader2, MessageCircle, Send, X } from 'lucide-react'
import ChatMarkdown from './ChatMarkdown'
import { CopyPairButton, ExportChatMenu } from './ChatTools'

interface Msg { id: string; role: 'learner' | 'assistant'; text: string; at: string }

/**
 * Ask for the interactive courses: course questions only, answered for the chapter the learner
 * is on. Same look as the Ask in the video-course player. No discussion here.
 */
export function useAcademyAsk(courseId: string, chapterId?: string) {
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const send = useCallback(async (q: string): Promise<boolean> => {
    q = q.trim()
    if (!q || busy) return false
    setBusy(true); setError('')
    const temp: Msg = { id: `tmp-${Date.now()}`, role: 'learner', text: q, at: new Date().toISOString() }
    setMsgs(m => [...m, temp])
    try {
      const r = await fetch('/api/academy/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, chapterId, message: q }),
      })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(d.error || 'Could not send your question.')
      const now = new Date().toISOString()
      setMsgs(m => [...m.filter(x => x.id !== temp.id), ...(d.messages as Msg[]).map(x => ({ ...x, at: x.at || now }))])
      return true
    } catch (err) {
      setMsgs(m => m.filter(x => x.id !== temp.id))
      setError(err instanceof Error ? err.message : 'Could not send your question.')
      return false
    } finally { setBusy(false) }
  }, [courseId, chapterId, busy])

  return { msgs, busy, error, send }
}

type Ask = ReturnType<typeof useAcademyAsk>

const SUGGESTIONS = ['What is this course about?', 'Explain the key idea simply', 'Give me a real example']

/** Messages, suggestion chips and the input. Fills the height it is given. */
function AskBody({ ask, autoFocus, suggestions = SUGGESTIONS }: { ask: Ask; autoFocus?: boolean; suggestions?: string[] }) {
  const [text, setText] = useState('')
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }) }, [ask.msgs, ask.busy])
  useEffect(() => { if (autoFocus) setTimeout(() => inputRef.current?.focus(), 60) }, [autoFocus])

  const submit = async (e?: FormEvent) => {
    e?.preventDefault()
    const q = text
    setText('')
    if (!(await ask.send(q))) setText(q)
  }

  return (
    <>
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-4">
        {ask.msgs.length === 0 && !ask.busy && (
          <div className="space-y-3">
            <p className="text-[14px] leading-relaxed text-[#6e6e73]">Ask about the lesson you are on or the topics this course teaches.</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map(s => (
                <button key={s} type="button" onClick={() => ask.send(s)}
                  className="text-[13px] text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-full px-3 py-1.5 transition-colors text-left">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {ask.msgs.map((m, i) => (
          m.role === 'learner' ? (
            <div key={m.id} className="flex justify-end">
              <div className="max-w-[88%] rounded-2xl rounded-br-md bg-primary-600 text-white px-3.5 py-2 text-[14px] leading-relaxed whitespace-pre-wrap break-words">{m.text}</div>
            </div>
          ) : (
            <div key={m.id} className="flex">
              <div className="max-w-full rounded-2xl rounded-bl-md px-3.5 py-2.5 text-[14px] leading-relaxed break-words bg-[#f5f5f7] text-gray-900">
                <ChatMarkdown text={m.text} />
                <div><CopyPairButton msgs={ask.msgs} index={i} /></div>
              </div>
            </div>
          )
        ))}
        {ask.busy && <p className="text-[13px] text-[#86868b] flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Looking that up…</p>}
        <div ref={endRef} />
      </div>

      <form onSubmit={submit} className="flex items-end gap-2 p-3 border-t border-[#e8e8ed] shrink-0 bg-white">
        <textarea
          ref={inputRef} value={text} onChange={e => setText(e.target.value)} rows={1} maxLength={2000}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() } }}
          placeholder="Type your question" aria-label="Your question"
          className="flex-1 resize-none border border-[#d2d2d7] rounded-xl px-3.5 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-primary-600 max-h-28"
        />
        <button type="submit" disabled={ask.busy || !text.trim()} aria-label="Send"
          className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center disabled:opacity-40"><Send className="w-4 h-4" /></button>
      </form>
      {ask.error && <p className="px-4 pb-3 text-[13px] text-red-600 bg-white">{ask.error}</p>}
    </>
  )
}

function AskHeader({ subtitle, onClose, msgs, courseTitle }: { subtitle: string; onClose?: () => void; msgs: Msg[]; courseTitle: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-[#e8e8ed] shrink-0 bg-white">
      <MessageCircle className="w-[18px] h-[18px] text-primary-600" />
      <div className="min-w-0">
        <div className="font-semibold text-[14.5px] text-gray-900 leading-tight">Ask about this course</div>
        <div className="text-[11.5px] text-[#86868b] truncate">{subtitle}</div>
      </div>
      <div className="ml-auto flex items-center gap-0.5">
        <ExportChatMenu msgs={msgs} courseTitle={courseTitle} />
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Close" title="Close" className="p-1.5 rounded-lg text-[#6e6e73] hover:bg-gray-100"><X className="w-4 h-4" /></button>
        )}
      </div>
    </div>
  )
}

/** The left-edge tab that opens the Ask panel in the player. */
export function AskTab({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label="Ask about this course"
      className="absolute z-20 left-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 bg-[#0f1824] text-white pl-2 pr-2.5 py-3.5 rounded-r-2xl shadow-lg hover:bg-[#1b2a3f] transition-colors">
      <MessageCircle className="w-5 h-5" />
      <span className="text-[11px] font-semibold [writing-mode:vertical-rl] rotate-180">Ask</span>
    </button>
  )
}

/** Ask panel beside the lesson: docked on wide screens (the lesson makes room), a bottom sheet on phones. */
export function AskDock({ ask, chapterTitle, courseTitle, onClose }: { ask: Ask; chapterTitle: string; courseTitle?: string; onClose: () => void }) {
  return (
    <aside role="dialog" aria-label="Ask about this course"
      className="z-30 flex flex-col bg-white border-[#e2e5ec] absolute inset-x-0 bottom-0 h-[62%] rounded-t-2xl border-t shadow-[0_-12px_30px_-12px_rgba(0,0,0,.4)] lg:static lg:h-auto lg:w-[360px] lg:shrink-0 lg:rounded-none lg:border-t-0 lg:border-r lg:shadow-none">
      <AskHeader subtitle={`You are on: ${chapterTitle}`} onClose={onClose} msgs={ask.msgs} courseTitle={courseTitle || chapterTitle} />
      <AskBody ask={ask} autoFocus />
    </aside>
  )
}

/** Ask card for the course page: sits in the free space of the hero. */
export function AskCard({ courseId, title }: { courseId: string; title: string }) {
  const ask = useAcademyAsk(courseId)
  return (
    <section aria-label="Ask about this course"
      className="flex flex-col rounded-2xl bg-white text-gray-900 shadow-[0_20px_50px_-20px_rgba(0,0,0,.6)] overflow-hidden h-[400px] lg:h-[420px]">
      <AskHeader subtitle={title} msgs={ask.msgs} courseTitle={title} />
      <AskBody ask={ask} suggestions={['What will I learn?', 'Who is this course for?', 'Where should I start?']} />
    </section>
  )
}
