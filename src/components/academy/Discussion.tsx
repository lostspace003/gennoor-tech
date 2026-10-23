'use client'

import { useCallback, useEffect, useState, FormEvent } from 'react'
import { Loader2, MessageSquare, Trash2 } from 'lucide-react'

interface Post { id: string; title: string; body: string; author: string; isTeam: boolean; createdAt: string; mine?: boolean }
interface Thread extends Post { replies: number; lastAt: string }

const ago = (iso: string) => {
  const s = (Date.now() - new Date(iso).getTime()) / 1000
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)} min ago`
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`
  if (s < 86400 * 30) return `${Math.floor(s / 86400)} d ago`
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

function Author({ p }: { p: Post }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold ${p.isTeam ? 'bg-primary-600 text-white' : 'bg-primary-50 text-primary-700'}`}>{p.author.charAt(0)}</span>
      <span className="text-[13.5px] font-semibold text-gray-900">{p.author}</span>
      {p.isTeam && <span className="text-[11px] font-semibold text-primary-700 bg-primary-50 rounded-full px-2 py-0.5">Team</span>}
      <span className="text-[12.5px] text-[#86868b]">{ago(p.createdAt)}</span>
    </span>
  )
}

/** Discussion for one scope: a course (its slug) or the whole community ("community"). */
export default function Discussion({ scope, emptyText }: { scope: string; emptyText?: string }) {
  const [threads, setThreads] = useState<Thread[] | null>(null)
  const [open, setOpen] = useState<{ thread: Post; replies: Post[] } | null>(null)
  const [composing, setComposing] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [reply, setReply] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const api = `/api/lms/discussion?scope=${encodeURIComponent(scope)}`
  const loadList = useCallback(async () => {
    const r = await fetch(api, { cache: 'no-store' })
    const d = await r.json().catch(() => ({}))
    if (!r.ok) { setError(d.error || 'Could not load the discussion.'); setThreads([]); return }
    setThreads(d.threads)
  }, [api])
  useEffect(() => { loadList() }, [loadList])

  const openThread = async (id: string) => {
    const r = await fetch(`${api}&thread=${encodeURIComponent(id)}`, { cache: 'no-store' })
    if (r.ok) { setOpen(await r.json()); setReply(''); setError('') }
  }

  const post = async (payload: Record<string, string>) => {
    setBusy(true); setError('')
    try {
      const r = await fetch('/api/lms/discussion', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ scope, ...payload }) })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(d.error || 'Could not post.')
      return true
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not post.'); return false } finally { setBusy(false) }
  }

  const newTopic = async (e: FormEvent) => {
    e.preventDefault()
    if (await post({ title, body })) { setTitle(''); setBody(''); setComposing(false); loadList() }
  }
  const sendReply = async (e: FormEvent) => {
    e.preventDefault()
    if (open && (await post({ parentId: open.thread.id, body: reply }))) { setReply(''); openThread(open.thread.id); loadList() }
  }
  const remove = async (id: string, isThread: boolean) => {
    if (!window.confirm(isThread ? 'Delete this topic and its replies?' : 'Delete this reply?')) return
    await fetch(`/api/lms/discussion?scope=${encodeURIComponent(scope)}&id=${encodeURIComponent(id)}`, { method: 'DELETE' })
    if (isThread) { setOpen(null); loadList() } else if (open) openThread(open.thread.id)
  }

  const FIELD = 'w-full border border-[#d2d2d7] rounded-xl px-3.5 py-2.5 text-[14.5px] text-gray-900 focus:outline-none focus:border-primary-600'

  if (open) {
    return (
      <div>
        <button type="button" onClick={() => { setOpen(null); loadList() }} className="text-[14px] text-primary-600 hover:underline">‹ All topics</button>
        <article className="mt-4">
          <h2 className="font-heading text-[24px] font-bold tracking-[-0.02em] text-gray-900">{open.thread.title}</h2>
          <div className="mt-3 flex items-center justify-between"><Author p={open.thread} />{open.thread.mine && <button type="button" aria-label="Delete topic" onClick={() => remove(open.thread.id, true)} className="p-1.5 text-[#86868b] hover:text-red-600"><Trash2 className="w-4 h-4" /></button>}</div>
          <p className="mt-3 text-[15.5px] leading-[1.65] text-[#3a3a3f] whitespace-pre-line">{open.thread.body}</p>
        </article>
        <h3 className="mt-10 mb-2 text-[14px] font-semibold text-gray-900">{open.replies.length} {open.replies.length === 1 ? 'reply' : 'replies'}</h3>
        <ul className="divide-y divide-[#e8e8ed] border-t border-[#e8e8ed]">
          {open.replies.map(p => (
            <li key={p.id} className={`py-4 ${p.isTeam ? 'bg-primary-50/50 -mx-3 px-3 rounded-lg' : ''}`}>
              <div className="flex items-center justify-between"><Author p={p} />{p.mine && <button type="button" aria-label="Delete reply" onClick={() => remove(p.id, false)} className="p-1.5 text-[#86868b] hover:text-red-600"><Trash2 className="w-4 h-4" /></button>}</div>
              <p className="mt-2 text-[15px] leading-[1.6] text-[#3a3a3f] whitespace-pre-line">{p.body}</p>
            </li>
          ))}
        </ul>
        <form onSubmit={sendReply} className="mt-6 space-y-3">
          <textarea value={reply} onChange={e => setReply(e.target.value)} rows={3} maxLength={4000} placeholder="Write a reply" aria-label="Your reply" className={FIELD} />
          {error && <p className="text-[13px] text-red-600">{error}</p>}
          <button type="submit" disabled={busy || !reply.trim()} className="pill-primary inline-flex items-center gap-2 disabled:opacity-50">{busy && <Loader2 className="w-4 h-4 animate-spin" />} Reply</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      {!composing ? (
        <button type="button" onClick={() => setComposing(true)} className="pill-primary">Start a topic</button>
      ) : (
        <form onSubmit={newTopic} className="rounded-2xl bg-[#f5f6f8] p-5 space-y-3 max-w-[640px]">
          <input value={title} onChange={e => setTitle(e.target.value)} maxLength={140} placeholder="Topic title" aria-label="Topic title" className={FIELD} />
          <textarea value={body} onChange={e => setBody(e.target.value)} rows={4} maxLength={4000} placeholder="What would you like to discuss?" aria-label="Your post" className={FIELD} />
          {error && <p className="text-[13px] text-red-600">{error}</p>}
          <div className="flex items-center gap-3">
            <button type="submit" disabled={busy || !title.trim() || !body.trim()} className="pill-primary inline-flex items-center gap-2 disabled:opacity-50">{busy && <Loader2 className="w-4 h-4 animate-spin" />} Post</button>
            <button type="button" onClick={() => { setComposing(false); setError('') }} className="text-[14px] text-[#6e6e73] hover:text-gray-900">Cancel</button>
          </div>
        </form>
      )}

      {threads === null && <p className="mt-8 text-[#86868b] flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</p>}
      {error && !composing && threads?.length === 0 && <p className="mt-6 text-[14px] text-red-600">{error}</p>}
      {threads && threads.length === 0 && !error && <p className="mt-8 text-[#6e6e73]">{emptyText || 'No topics yet. Start the first one.'}</p>}
      {threads && threads.length > 0 && (
        <ul className="mt-8 divide-y divide-[#e8e8ed] border-t border-[#e8e8ed]">
          {threads.map(t => (
            <li key={t.id}>
              <button type="button" onClick={() => openThread(t.id)} className="w-full text-left py-4 hover:bg-[#fafafa] -mx-3 px-3 rounded-lg transition-colors">
                <div className="text-[16px] font-semibold text-gray-900">{t.title}</div>
                <div className="mt-1 flex items-center gap-3 text-[13px] text-[#86868b]">
                  <span>{t.author}{t.isTeam ? ' (team)' : ''}</span>
                  <span className="inline-flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" />{t.replies}</span>
                  <span>{ago(t.lastAt)}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
