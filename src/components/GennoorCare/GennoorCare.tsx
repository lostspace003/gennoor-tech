'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

interface Msg { role: 'user' | 'assistant'; content: string; links?: Array<{ title: string; url: string }> }

// Public GennoorCare — customer-facing assistant grounded in website content
// (RAG via /api/gennoorcare). Journey: greet & name → converse with real
// links → contextual callback capture → skippable feedback on close.
export default function GennoorCare() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [stage, setStage] = useState<'greet' | 'chat'>('greet')
  const [visitorName, setVisitorName] = useState('')
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [offerLead, setOfferLead] = useState(false)
  const [showLead, setShowLead] = useState(false)
  const [lead, setLead] = useState({ name: '', email: '', company: '', phone: '', website_hp: '' })
  const [leadBusy, setLeadBusy] = useState(false)
  const [leadDone, setLeadDone] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackDone, setFeedbackDone] = useState(false)
  const [feedbackNote, setFeedbackNote] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const sessionId = useRef<string>('')

  useEffect(() => {
    let sid = localStorage.getItem('gcare.sid')
    if (!sid) { sid = Math.random().toString(36).slice(2, 12); localStorage.setItem('gcare.sid', sid) }
    sessionId.current = sid
    const savedName = localStorage.getItem('gcare.name')
    if (savedName) { setVisitorName(savedName); setStage('chat') }
  }, [])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, busy, showLead, showFeedback])

  // App surfaces have their own copilot
  if (pathname?.startsWith('/crm') || pathname?.startsWith('/admin')) return null

  const saveName = (raw: string) => {
    const name = raw.trim().replace(/[^a-zA-Z .'-]/g, '').slice(0, 40)
    if (name) {
      setVisitorName(name)
      localStorage.setItem('gcare.name', name)
      setLead((l) => ({ ...l, name }))
    }
    setStage('chat')
  }

  const ask = async (text?: string) => {
    const content = (text ?? input).trim().slice(0, 500)
    if (!content || busy) return
    if (stage === 'greet') { saveName(content); setInput(''); return }
    setInput('')
    const next: Msg[] = [...msgs, { role: 'user', content }]
    setMsgs(next)
    setBusy(true)
    try {
      const res = await fetch('/api/gennoorcare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.map(({ role, content }) => ({ role, content })),
          sessionId: sessionId.current,
          visitorName,
        }),
      })
      const data = await res.json()
      setMsgs([...next, { role: 'assistant', content: data.reply || 'Please try again in a moment.', links: data.links }])
      if (data.offerLead) setOfferLead(true)
      // Contextual capture: after the 3rd visitor question, surface the callback offer once
      if (next.filter((m) => m.role === 'user').length === 3 && !leadDone) setOfferLead(true)
    } catch {
      setMsgs([...next, { role: 'assistant', content: 'Connection hiccup — please try again, or write to admin@gennoor.com.' }])
    } finally { setBusy(false) }
  }

  const submitLead = async () => {
    if (leadBusy) return
    setLeadBusy(true)
    try {
      const interest = msgs.filter((m) => m.role === 'user').slice(-3).map((m) => m.content).join(' | ')
      const res = await fetch('/api/gennoorcare/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...lead, interest, sessionId: sessionId.current }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setLeadDone(true)
      setShowLead(false)
      setMsgs((m) => [...m, { role: 'assistant', content: `Thank you, ${(lead.name || visitorName).split(' ')[0]}! Our team will reach out shortly. 🙌` }])
    } catch (e: any) {
      setMsgs((m) => [...m, { role: 'assistant', content: e.message || 'Could not save that — please email admin@gennoor.com.' }])
    } finally { setLeadBusy(false) }
  }

  const sendFeedback = async (helpful: boolean | null) => {
    setFeedbackDone(true)
    setShowFeedback(false)
    setOpen(false)
    if (helpful === null) return // skipped
    fetch('/api/gennoorcare/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: sessionId.current, helpful, comment: feedbackNote.slice(0, 240) }),
    }).catch(() => {})
  }

  const handleClose = () => {
    // One light, skippable feedback ask — only after a real conversation.
    // Minimize NEVER clears the chat — the session always survives.
    if (msgs.filter((m) => m.role === 'user').length >= 2 && !feedbackDone) setShowFeedback(true)
    else setOpen(false)
  }

  // Link titles arrive HTML-escaped from the bot ("&amp;" etc.) — show them plain
  const decodeEntities = (s: string) =>
    s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'")

  // A suggested link is a duplicate if the reply text already links to it —
  // by full URL, scheme-less URL, or just the path (inline links are often relative)
  const linkInContent = (content: string, url: string) => {
    if (content.includes(url) || content.includes(url.replace(/^https?:\/\/(www\.)?/, ''))) return true
    const path = url.replace(/^https?:\/\/[^/]+/, '')
    return path.length > 1 && content.includes(path)
  }

  // Lightweight markdown rendering: paragraphs, bullets, **bold**,
  // [title](url) links AND bare URLs/domains made clickable.
  const renderInline = (text: string, keyBase: string) => {
    const parts = text.split(/(\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s)]+|(?:www\.)?gennoor\.com[^\s),]*|\*\*[^*]+\*\*|mailto:[^\s)]+|admin@gennoor\.com)/g)
    return parts.filter(Boolean).map((p, i) => {
      const key = `${keyBase}-${i}`
      const md = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (md) {
        const href = md[2].startsWith('http') || md[2].startsWith('/') || md[2].startsWith('mailto:') ? md[2] : `https://${md[2]}`
        return <a key={key} href={href} className="text-blue-600 underline hover:text-blue-800 font-medium" target="_blank" rel="noopener noreferrer">{md[1]}</a>
      }
      if (/^\*\*[^*]+\*\*$/.test(p)) return <strong key={key}>{p.slice(2, -2)}</strong>
      if (/^https?:\/\//.test(p)) return <a key={key} href={p} className="text-blue-600 underline hover:text-blue-800 break-all" target="_blank" rel="noopener noreferrer">{p.replace(/^https?:\/\/(www\.)?/, '')}</a>
      if (/^(www\.)?gennoor\.com/.test(p)) return <a key={key} href={`https://${p.replace(/^www\./, 'www.') === p ? p : p}`} className="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer">{p}</a>
      if (p === 'admin@gennoor.com') return <a key={key} href="mailto:admin@gennoor.com" className="text-blue-600 underline hover:text-blue-800">{p}</a>
      if (/^mailto:/.test(p)) return <a key={key} href={p} className="text-blue-600 underline hover:text-blue-800">{p.slice(7)}</a>
      return <span key={key}>{p}</span>
    })
  }

  const renderText = (text: string) => {
    const lines = text.split('\n')
    return lines.map((line, i) => {
      const t = line.trim()
      if (!t) return <div key={i} className="h-2" />
      const bullet = t.match(/^[-•*]\s+(.*)$/)
      if (bullet) {
        return (
          <div key={i} className="flex gap-2 ml-0.5 my-0.5">
            <span className="text-blue-500 shrink-0 leading-5">•</span>
            <span className="min-w-0">{renderInline(bullet[1], `l${i}`)}</span>
          </div>
        )
      }
      const numbered = t.match(/^(\d+)[.)]\s+(.*)$/)
      if (numbered) {
        return (
          <div key={i} className="flex gap-2 ml-0.5 my-0.5">
            <span className="text-blue-500 font-medium shrink-0 leading-5">{numbered[1]}.</span>
            <span className="min-w-0">{renderInline(numbered[2], `l${i}`)}</span>
          </div>
        )
      }
      return <p key={i} className="my-0.5">{renderInline(t, `l${i}`)}</p>
    })
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          aria-label={msgs.length > 0 ? 'Continue your GennoorCare chat' : 'Chat with GennoorCare'}
          title={msgs.length > 0 ? 'Continue chat' : 'Ask GennoorCare'}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/gennoorbot-avatar.svg" alt="GennoorCare" className="w-14 h-14 drop-shadow-lg" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-0 right-0 sm:bottom-5 sm:right-5 z-50 w-full sm:w-[330px] h-[100dvh] sm:h-[480px] sm:max-h-[78dvh] bg-white sm:rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-3.5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logos/gennoorbot-avatar.svg" alt="" className="w-8 h-8" />
              <div>
                <div className="font-semibold text-sm leading-tight">GennoorCare</div>
                <div className="text-[10px] text-blue-100 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" /> online — courses, training & POCs</div>
              </div>
            </div>
            <button onClick={handleClose} className="px-2.5 py-1 hover:bg-white/15 rounded-lg text-2xl leading-none" aria-label="Minimize — your chat is saved" title="Minimize (chat is saved)">–</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0 bg-gray-50">
            {stage === 'greet' && (
              <div className="space-y-2.5 mt-3">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-3.5 py-2.5 text-sm text-gray-800 max-w-[88%]">
                  Hi there! 👋 I'm GennoorCare — I know everything on gennoor.com: courses, corporate training, POCs and more.
                  <br /><br />May I know your name?
                </div>
                <button onClick={() => setStage('chat')} className="text-[11px] text-gray-400 hover:text-gray-600 ml-1">Skip →</button>
              </div>
            )}
            {stage === 'chat' && msgs.length === 0 && (
              <p className="text-[13px] text-gray-600 text-center px-4 mt-4">
                {visitorName ? `Great to meet you, ${visitorName.split(' ')[0]}! ` : ''}Ask me about courses, corporate training, POCs — anything on gennoor.com.
              </p>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={`max-w-[88%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed break-words ${m.role === 'user' ? 'ml-auto bg-blue-600 text-white rounded-br-md whitespace-pre-line' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'}`}>
                {m.role === 'assistant' ? renderText(m.content) : m.content}
                {/* Only add chips for links the reply text doesn't already contain — no duplicates */}
                {m.links && m.links.filter((l) => !linkInContent(m.content, l.url)).length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {m.links.filter((l) => !linkInContent(m.content, l.url)).map((l) => (
                      <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="block px-3 py-2 rounded-lg bg-blue-50 border border-blue-100 hover:border-blue-300 text-blue-700 text-xs font-medium truncate">
                        {decodeEntities(l.title)} →
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {busy && (
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-3.5 py-2.5 w-16">
                <span className="inline-flex gap-1"><Dot d="0s" /><Dot d="0.15s" /><Dot d="0.3s" /></span>
              </div>
            )}

            {/* Lead form */}
            {showLead && !leadDone && (
              <div className="bg-white border border-blue-200 rounded-xl p-3.5 space-y-2">
                <p className="text-xs font-medium text-gray-700">Leave your details — our team will reach out:</p>
                <input value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} placeholder="Your name *" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                <input value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} placeholder="Work email *" type="email" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                <div className="grid grid-cols-2 gap-2">
                  <input value={lead.company} onChange={(e) => setLead({ ...lead, company: e.target.value })} placeholder="Company" className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                  <input value={lead.phone} onChange={(e) => setLead({ ...lead, phone: e.target.value })} placeholder="Phone" className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <input value={lead.website_hp} onChange={(e) => setLead({ ...lead, website_hp: e.target.value })} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                <div className="flex gap-2">
                  <button onClick={submitLead} disabled={leadBusy || !lead.name || !lead.email} className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50">
                    {leadBusy ? 'Sending...' : 'Request callback'}
                  </button>
                  <button onClick={() => setShowLead(false)} className="px-3 py-2 border border-gray-200 text-sm rounded-lg text-gray-600">Later</button>
                </div>
              </div>
            )}

            {/* Skippable exit feedback */}
            {showFeedback && (
              <div className="bg-white border border-purple-200 rounded-xl p-3.5 space-y-2">
                <p className="text-xs font-medium text-gray-700">Before you go — was this helpful?</p>
                <div className="flex gap-2">
                  <button onClick={() => sendFeedback(true)} className="flex-1 px-3 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700">👍 Yes</button>
                  <button onClick={() => sendFeedback(false)} className="flex-1 px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700">👎 Not really</button>
                </div>
                <input value={feedbackNote} onChange={(e) => setFeedbackNote(e.target.value)} placeholder="One line of feedback (optional)" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs" />
                <button onClick={() => sendFeedback(null)} className="text-[11px] text-gray-400 hover:text-gray-600">Skip & close</button>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Footer */}
          <div className="p-2.5 border-t border-gray-100 bg-white shrink-0 space-y-1.5">
            {!leadDone && stage === 'chat' && (msgs.length > 0 || offerLead) && !showLead && (
              <button onClick={() => setShowLead(true)} className="text-[11px] text-blue-600 hover:underline">📞 Request a callback from our team</button>
            )}
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && ask()}
                placeholder={stage === 'greet' ? 'Type your name...' : 'Ask about courses, training, POCs...'}
                maxLength={500}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-[13px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button onClick={() => ask()} disabled={busy || !input.trim()} className="px-3.5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 text-[13px] font-medium">Send</button>
            </div>
            <p className="text-center text-[9px] text-gray-300">Powered by Gennoor AI · answers come from gennoor.com content</p>
          </div>
        </div>
      )}
    </>
  )
}

function Dot({ d }: { d: string }) {
  return <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block animate-bounce" style={{ animationDelay: d }} />
}
