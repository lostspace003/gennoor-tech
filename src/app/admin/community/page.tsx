'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

interface Post { id: string; scope: string; parentId: string; title: string; body: string; author: string; isTeam: boolean; createdAt: string; hidden: boolean; email: string }
interface Review { id: string; slug: string; email: string; name: string; rating: number; text: string; updatedAt: string; hidden: boolean }

const when = (iso: string) => new Date(iso).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
const spaceName = (scope: string) => (scope === 'community' ? 'Community' : scope.toUpperCase())

export default function CommunityAdminPage() {
  const [tab, setTab] = useState<'discussion' | 'reviews'>('discussion')
  const [posts, setPosts] = useState<Post[] | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [error, setError] = useState('')
  const [replying, setReplying] = useState<string | null>(null)
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    const r = await fetch('/api/admin/community')
    if (!r.ok) { setError(`Could not load (${r.status})`); return }
    const d = await r.json()
    setPosts(d.posts); setReviews(d.reviews)
  }, [])
  useEffect(() => { load() }, [load])

  const act = async (payload: Record<string, string>) => {
    setBusy(true)
    const r = await fetch('/api/admin/community', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    setBusy(false)
    if (!r.ok) { setError((await r.json().catch(() => ({}))).error || 'Action failed'); return false }
    setError(''); await load(); return true
  }

  const threads = (posts ?? []).filter(p => !p.parentId)
  const repliesOf = (id: string) => (posts ?? []).filter(p => p.parentId === id).sort((a, b) => a.id.localeCompare(b.id))

  return (
    <main className="max-w-[960px] mx-auto px-5 py-10">
      <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-900">‹ Admin</Link>
      <h1 className="text-2xl font-bold text-gray-900 mt-3">Discussion and reviews</h1>
      <p className="text-gray-600 mt-1">Everything learners have written. Reply as the team, hide what should not be shown, or delete it.</p>

      <div className="mt-6 inline-flex rounded-lg bg-gray-100 p-0.5 text-sm">
        {(['discussion', 'reviews'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 rounded-md font-medium capitalize ${tab === t ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>{t}</button>
        ))}
      </div>
      {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
      {!posts && !error && <p className="mt-6 text-gray-500 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</p>}

      {posts && tab === 'discussion' && (
        <div className="mt-5 space-y-4">
          {threads.length === 0 && <p className="text-sm text-gray-500">No topics yet.</p>}
          {threads.map(t => (
            <article key={t.id} className={`border rounded-xl bg-white p-5 ${t.hidden ? 'border-amber-300 bg-amber-50/40' : 'border-gray-200'}`}>
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <span className="font-semibold text-gray-700">{spaceName(t.scope)}</span><span>·</span><span>{t.author}</span><span>·</span><span>{when(t.createdAt)}</span>
                {t.hidden && <span className="text-amber-700 font-medium">Hidden</span>}
              </div>
              <h2 className="font-semibold text-gray-900 mt-1">{t.title}</h2>
              <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">{t.body}</p>
              <div className="mt-3 flex gap-4 text-sm">
                <button disabled={busy} onClick={() => { setReplying(replying === t.id ? null : t.id); setText('') }} className="text-primary-700 hover:underline">Reply as team</button>
                <button disabled={busy} onClick={() => act({ action: t.hidden ? 'show' : 'hide', scope: t.scope, id: t.id })} className="text-gray-600 hover:text-gray-900">{t.hidden ? 'Show' : 'Hide'}</button>
                <button disabled={busy} onClick={() => { if (window.confirm('Delete this topic and its replies for good?')) act({ action: 'delete', scope: t.scope, id: t.id }) }} className="text-red-600 hover:underline">Delete</button>
              </div>
              {repliesOf(t.id).length > 0 && (
                <ul className="mt-4 space-y-2 border-l-2 border-gray-100 pl-4">
                  {repliesOf(t.id).map(r => (
                    <li key={r.id} className={`text-sm ${r.hidden ? 'opacity-60' : ''}`}>
                      <span className="font-medium text-gray-800">{r.author}{r.isTeam ? ' (team)' : ''}</span> <span className="text-xs text-gray-400">{when(r.createdAt)}{r.hidden ? ' · hidden' : ''}</span>
                      <p className="text-gray-700 whitespace-pre-line">{r.body}</p>
                      <span className="text-xs">
                        <button disabled={busy} onClick={() => act({ action: r.hidden ? 'show' : 'hide', scope: r.scope, id: r.id })} className="text-gray-500 hover:text-gray-900 mr-3">{r.hidden ? 'Show' : 'Hide'}</button>
                        <button disabled={busy} onClick={() => { if (window.confirm('Delete this reply for good?')) act({ action: 'delete', scope: r.scope, id: r.id }) }} className="text-red-600 hover:underline">Delete</button>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {replying === t.id && (
                <form onSubmit={async e => { e.preventDefault(); if (text.trim() && (await act({ action: 'reply', scope: t.scope, id: t.id, body: text }))) { setReplying(null); setText('') } }} className="mt-4 space-y-2">
                  <textarea value={text} onChange={e => setText(e.target.value)} rows={3} placeholder="Your reply, shown as Gennoor team" className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-600" />
                  <button type="submit" disabled={busy || !text.trim()} className="px-4 py-2 rounded-full bg-primary-600 text-white text-sm font-medium disabled:opacity-50">Send reply</button>
                </form>
              )}
            </article>
          ))}
        </div>
      )}

      {posts && tab === 'reviews' && (
        <div className="mt-5 border border-gray-200 rounded-xl bg-white divide-y divide-gray-100">
          {reviews.length === 0 && <p className="p-5 text-sm text-gray-500">No reviews yet.</p>}
          {reviews.map(r => (
            <div key={r.slug + r.id} className={`p-4 ${r.hidden ? 'bg-amber-50/40' : ''}`}>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-semibold text-gray-900">{'★'.repeat(r.rating)}<span className="text-gray-300">{'★'.repeat(5 - r.rating)}</span></span>
                <span className="text-gray-700">{r.name}</span>
                <span className="text-xs text-gray-400">{r.email} · {r.slug.toUpperCase()} · {when(r.updatedAt)}</span>
                {r.hidden && <span className="text-xs text-amber-700 font-medium">Hidden</span>}
                <button disabled={busy} onClick={() => act({ action: r.hidden ? 'showReview' : 'hideReview', scope: r.slug, id: r.id })} className="ml-auto text-sm text-gray-600 hover:text-gray-900">{r.hidden ? 'Show' : 'Hide'}</button>
              </div>
              {r.text && <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">{r.text}</p>}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
