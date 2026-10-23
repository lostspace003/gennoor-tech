'use client'

import { useCallback, useEffect, useState, FormEvent } from 'react'
import Link from 'next/link'
import { Loader2, Paperclip, X } from 'lucide-react'

interface Query {
  id: string; email: string; name: string; slug: string; courseTitle: string
  itemTitle: string; question: string; status: 'open' | 'resolved'; createdAt: string
}
interface Msg { id: string; role: 'learner' | 'assistant' | 'team'; text: string; at: string; itemTitle?: string; attachments?: string[] }

const when = (iso: string) => new Date(iso).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

export default function QueriesPage() {
  const [list, setList] = useState<Query[] | null>(null)
  const [filter, setFilter] = useState<'open' | 'resolved'>('open')
  const [sel, setSel] = useState<Query | null>(null)
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [reply, setReply] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    const r = await fetch('/api/admin/lms/queries')
    if (r.ok) setList((await r.json()).queries)
    else setError(`Could not load (${r.status})`)
  }, [])
  useEffect(() => { load() }, [load])

  const open = async (q: Query) => {
    setSel(q); setReply(''); setFiles([]); setError('')
    const r = await fetch(`/api/admin/lms/queries?id=${encodeURIComponent(q.id)}`)
    if (r.ok) setMsgs((await r.json()).messages)
  }

  const send = async (e: FormEvent, resolveOnly = false) => {
    e.preventDefault()
    if (!sel) return
    if (!resolveOnly && !reply.trim()) { setError('Write a reply first.'); return }
    setBusy(true); setError('')
    const fd = new FormData()
    fd.set('id', sel.id)
    if (!resolveOnly) { fd.set('reply', reply); files.forEach(f => fd.append('files', f)) }
    fd.set('resolve', '1')
    const r = await fetch('/api/admin/lms/queries', { method: 'POST', body: fd })
    const d = await r.json().catch(() => ({}))
    setBusy(false)
    if (!r.ok) { setError(d.error || 'Could not send.'); return }
    setMsgs(d.messages); setSel(d.query); setReply(''); setFiles([])
    load()
  }

  const shown = (list ?? []).filter(q => q.status === filter)
  const openCount = (list ?? []).filter(q => q.status === 'open').length

  return (
    <main className="max-w-[1100px] mx-auto px-5 py-10">
      <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-900">‹ Admin</Link>
      <h1 className="text-2xl font-bold text-gray-900 mt-3">Learner queries</h1>
      <p className="text-gray-600 mt-1">Questions from the course chat that the assistant could not answer. Reply and the learner is emailed.</p>

      <div className="mt-6 inline-flex rounded-lg bg-gray-100 p-0.5 text-sm">
        {(['open', 'resolved'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-md font-medium ${filter === f ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>
            {f === 'open' ? `Open${openCount ? ` (${openCount})` : ''}` : 'Resolved'}
          </button>
        ))}
      </div>

      {error && !sel && <p className="mt-4 text-red-600">{error}</p>}
      {!list && !error && <p className="mt-6 text-gray-500 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</p>}

      {list && (
        <div className="mt-5 grid lg:grid-cols-[340px_1fr] gap-5 items-start">
          <div className="border border-gray-200 rounded-xl bg-white divide-y divide-gray-100 overflow-hidden">
            {shown.length === 0 && <p className="p-5 text-sm text-gray-500">{filter === 'open' ? 'No open queries.' : 'Nothing resolved yet.'}</p>}
            {shown.map(q => (
              <button key={q.id} onClick={() => open(q)} className={`w-full text-left p-4 hover:bg-gray-50 ${sel?.id === q.id ? 'bg-primary-50' : ''}`}>
                <div className="text-sm font-medium text-gray-900 line-clamp-2">{q.question}</div>
                <div className="text-xs text-gray-500 mt-1">{q.name || q.email} · {q.courseTitle.split(':')[0]} · {when(q.createdAt)}</div>
              </button>
            ))}
          </div>

          <div className="border border-gray-200 rounded-xl bg-white min-h-[320px]">
            {!sel ? (
              <p className="p-6 text-sm text-gray-500">Choose a query to see the conversation and reply.</p>
            ) : (
              <div className="flex flex-col">
                <div className="px-5 py-4 border-b border-gray-100">
                  <div className="font-semibold text-gray-900">{sel.name || sel.email}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{sel.email} · {sel.courseTitle}{sel.itemTitle ? ` · ${sel.itemTitle}` : ''}</div>
                </div>
                <div className="px-5 py-4 space-y-3 max-h-[380px] overflow-y-auto bg-gray-50/60">
                  {msgs.map(m => (
                    <div key={m.id} className={`flex ${m.role === 'learner' ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-[13.5px] leading-relaxed whitespace-pre-wrap ${m.role === 'learner' ? 'bg-white border border-gray-200 text-gray-900' : m.role === 'team' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                        {m.text}
                        {m.attachments?.length ? <div className="text-xs opacity-80 mt-1">Attached: {m.attachments.join(', ')}</div> : null}
                        <div className="text-[11px] opacity-60 mt-1">{m.role === 'team' ? 'Gennoor' : m.role === 'assistant' ? 'Assistant' : 'Learner'} · {when(m.at)}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {sel.status === 'open' ? (
                  <form onSubmit={send} className="p-5 border-t border-gray-100 space-y-3">
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <textarea value={reply} onChange={e => setReply(e.target.value)} rows={4} placeholder="Write your reply" className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-600" />
                    {files.length > 0 && (
                      <ul className="flex flex-wrap gap-2">
                        {files.map((f, i) => (
                          <li key={i} className="inline-flex items-center gap-1.5 text-xs bg-gray-100 rounded-full pl-3 pr-1.5 py-1">
                            {f.name}
                            <button type="button" aria-label="Remove file" onClick={() => setFiles(files.filter((_, j) => j !== i))} className="p-0.5 hover:bg-gray-200 rounded-full"><X className="w-3 h-3" /></button>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="inline-flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                        <Paperclip className="w-4 h-4" /> Attach files
                        <input type="file" multiple className="hidden" onChange={e => { setFiles([...files, ...Array.from(e.target.files ?? [])].slice(0, 5)); e.target.value = '' }} />
                      </label>
                      <span className="text-xs text-gray-400">Up to 5 files, 10 MB each</span>
                      <button type="button" disabled={busy} onClick={e => send(e as unknown as FormEvent, true)} className="ml-auto text-sm text-gray-600 hover:text-gray-900">Mark resolved</button>
                      <button type="submit" disabled={busy} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-600 text-white text-sm font-medium disabled:opacity-60">
                        {busy && <Loader2 className="w-4 h-4 animate-spin" />} Send reply
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className="p-5 border-t border-gray-100 text-sm text-gray-500">Resolved{sel.email ? '' : ''}.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
