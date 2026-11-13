'use client'

import { useCallback, useEffect, useState } from 'react'
import { ListToolbar, Pager, useListView } from '@/components/admin/ListControls'
import { Loader2, Plus, Users, Inbox } from 'lucide-react'
import RichEditor, { RichText } from '@/components/academy/RichEditor'

type Kind = 'topic' | 'announcement' | 'poll' | 'quiz'
interface AdminResults { counts: number[]; total: number; correct?: number; explanation?: string; voters: { email: string; option: number }[] }
interface Post {
  id: string; scope: string; parentId: string; title: string; body: string; html: string; kind: Kind; options: string[]; closed: boolean
  author: string; isTeam: boolean; createdAt: string; hidden: boolean; email: string; results?: AdminResults
}
interface Review { id: string; slug: string; email: string; name: string; rating: number; text: string; updatedAt: string; hidden: boolean }
interface Space { scope: string; name: string }

const when = (iso: string) => new Date(iso).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
const spaceName = (scope: string) => (scope === 'community' ? 'Community' : scope.toUpperCase())
const KIND_NAME: Record<Kind, string> = { topic: 'Topic', announcement: 'Announcement', poll: 'Poll', quiz: 'Quiz' }
const KIND_CLS: Record<Kind, string> = { topic: 'bg-gray-100 text-gray-600', announcement: 'bg-amber-100 text-amber-800', poll: 'bg-gray-100 text-gray-700', quiz: 'bg-emerald-100 text-emerald-800' }
const FIELD = 'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary-600'
const PRIMARY = 'px-3 py-1.5 rounded-md bg-gray-800 text-white text-xs font-medium hover:bg-gray-700 disabled:opacity-50'
const CARD = 'border border-gray-200 rounded-xl bg-raised shadow-sm'

export default function CommunityAdminPage() {
  const [tab, setTab] = useState<'discussion' | 'publish' | 'reviews'>('discussion')
  const [posts, setPosts] = useState<Post[] | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [spaces, setSpaces] = useState<Space[]>([{ scope: 'community', name: 'Community' }])
  const [error, setError] = useState('')
  const [note, setNote] = useState('')
  const [replying, setReplying] = useState<string | null>(null)
  const [replyHtml, setReplyHtml] = useState('')
  const [busy, setBusy] = useState(false)

  // the publish form
  const [kind, setKind] = useState<Exclude<Kind, 'topic'>>('announcement')
  const [scope, setScope] = useState('community')
  const [title, setTitle] = useState('')
  const [html, setHtml] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [answer, setAnswer] = useState(0)
  const [explanation, setExplanation] = useState('')

  const load = useCallback(async () => {
    const r = await fetch('/api/admin/community')
    if (!r.ok) { setError(`Could not load (${r.status})`); return }
    const d = await r.json()
    setPosts(d.posts); setReviews(d.reviews); if (d.spaces) setSpaces(d.spaces)
  }, [])
  useEffect(() => { load() }, [load])

  const act = async (payload: Record<string, unknown>) => {
    setBusy(true)
    const r = await fetch('/api/admin/community', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    setBusy(false)
    if (!r.ok) { setError((await r.json().catch(() => ({}))).error || 'Action failed'); return false }
    setError(''); await load(); return true
  }

  const publish = async () => {
    const ok = await act({ action: 'create', kind, scope, title, html, options, answer, explanation })
    if (ok) {
      setTitle(''); setHtml(''); setOptions(['', '']); setAnswer(0); setExplanation('')
      setNote(`${KIND_NAME[kind]} published in ${spaceName(scope)}.`); setTab('discussion')
    }
  }

  const threads = (posts ?? []).filter(p => !p.parentId)
  const vt = useListView(threads, { date: t => t.createdAt, text: t => `${t.title} ${t.body} ${t.author} ${t.scope}`, pageSize: 10 })
  const vr = useListView(reviews, { date: r => r.updatedAt, text: r => `${r.name} ${r.email} ${r.slug} ${r.text}`, pageSize: 15 })
  const repliesOf = (id: string) => (posts ?? []).filter(p => p.parentId === id).sort((a, b) => a.id.localeCompare(b.id))
  const Body = ({ p }: { p: Post }) => (p.html ? <RichText html={p.html} className="text-sm text-gray-700 mt-1" /> : <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">{p.body}</p>)

  return (
    <div className="w-full p-4 lg:p-5">
      <h1 className="text-xl font-semibold tracking-tight text-gray-900 flex items-center gap-2"><Users className="w-5 h-5 text-primary-600" />Community, announcements and polls</h1>
      <p className="text-xs text-gray-500 mt-0.5 break-words">Publish announcements, polls and quizzes, answer learners as the team, see every result, and hide or delete anything that should not be shown.</p>

      <div className="mt-3 inline-flex rounded-md bg-gray-100 p-0.5 text-xs">
        {([['discussion', 'Discussion'], ['publish', 'Publish'], ['reviews', 'Reviews']] as const).map(([t, label]) => (
          <button key={t} onClick={() => { setTab(t); setNote('') }} className={`px-3 py-1.5 rounded-md font-medium ${tab === t ? 'bg-raised shadow-sm text-gray-900' : 'text-gray-500'}`}>{label}</button>
        ))}
      </div>
      {error && <p className="mt-3 rounded-md bg-red-100 text-red-800 px-3 py-2 text-xs break-words">{error}</p>}
      {note && <p className="mt-3 rounded-md bg-emerald-100 text-emerald-800 px-3 py-2 text-xs">{note}</p>}
      {!posts && !error && <p className="mt-4 text-xs text-gray-500 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</p>}

      {tab === 'publish' && (
        <div className={`mt-4 ${CARD} p-4 space-y-3 max-w-2xl`}>
          <div className="flex flex-wrap gap-2">
            {(['announcement', 'poll', 'quiz'] as const).map(k => (
              <button key={k} type="button" onClick={() => setKind(k)} className={`px-3 py-1.5 rounded-md text-xs font-medium border ${kind === k ? 'bg-gray-800 text-white border-gray-800' : 'bg-raised border-gray-300 text-gray-700 hover:bg-gray-50'}`}>{KIND_NAME[k]}</button>
            ))}
          </div>
          <label className="block text-sm text-gray-700">Where to post it
            <select value={scope} onChange={e => setScope(e.target.value)} className={`${FIELD} mt-1`}>
              {spaces.map(s => <option key={s.scope} value={s.scope}>{s.name}</option>)}
            </select>
          </label>
          <input value={title} onChange={e => setTitle(e.target.value)} maxLength={140} placeholder={kind === 'announcement' ? 'Announcement title' : 'Your question'} aria-label="Title" className={FIELD} />
          <RichEditor value={html} onChange={setHtml} placeholder={kind === 'announcement' ? 'Write the announcement' : 'Add some context (optional)'} minHeight={kind === 'announcement' ? 150 : 80} />
          {kind !== 'announcement' && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-800">Choices{kind === 'quiz' ? ' (select the correct one)' : ''}</p>
              {options.map((o, i) => (
                <div key={i} className="flex items-center gap-2">
                  {kind === 'quiz' && <input type="radio" name="correct" checked={answer === i} onChange={() => setAnswer(i)} aria-label={`Choice ${i + 1} is correct`} />}
                  <input value={o} onChange={e => setOptions(p => p.map((x, j) => (j === i ? e.target.value : x)))} maxLength={120} placeholder={`Choice ${i + 1}`} aria-label={`Choice ${i + 1}`} className={FIELD} />
                </div>
              ))}
              {options.length < 8 && <button type="button" onClick={() => setOptions(p => [...p, ''])} className="inline-flex items-center gap-1 text-sm text-primary-700 hover:underline"><Plus className="w-3.5 h-3.5" />Add a choice</button>}
              {kind === 'quiz' && <textarea value={explanation} onChange={e => setExplanation(e.target.value)} rows={2} maxLength={600} placeholder="Why that answer is right (shown after learners answer)" className={FIELD} />}
            </div>
          )}
          <button type="button" disabled={busy || !title.trim()} onClick={publish} className={PRIMARY}>Publish {KIND_NAME[kind].toLowerCase()}</button>
        </div>
      )}

      {posts && tab === 'discussion' && (
        <div className="mt-4 space-y-3">
          <ListToolbar v={vt} noun="thread" />
          {threads.length === 0 && <div className={`${CARD} p-8 text-center text-sm text-gray-500 flex flex-col items-center gap-2`}><Inbox className="w-6 h-6 text-gray-400" />Nothing here yet.</div>}
          {vt.rows.map(t => (
            <article key={t.id} className={`border rounded-xl bg-raised shadow-sm p-4 ${t.hidden ? 'border-amber-300 bg-amber-100/30' : 'border-gray-200'}`}>
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <span className={`px-2 py-0.5 rounded-full font-semibold ${KIND_CLS[t.kind]}`}>{KIND_NAME[t.kind]}</span>
                <span className="font-semibold text-gray-700">{spaceName(t.scope)}</span><span>·</span><span>{t.author}</span><span>·</span><span>{when(t.createdAt)}</span>
                {t.closed && <span className="text-gray-700 font-medium">Closed</span>}
                {t.hidden && <span className="text-amber-700 font-medium">Hidden</span>}
              </div>
              <h2 className="text-sm font-semibold text-gray-900 mt-1 break-words">{t.title}</h2>
              <Body p={t} />
              {t.results && (
                <div className="mt-3 space-y-1.5 max-w-[520px]">
                  {t.options.map((o, i) => {
                    const pct = t.results!.total ? Math.round((t.results!.counts[i] / t.results!.total) * 100) : 0
                    return (
                      <div key={i} className="relative border border-gray-200 rounded-lg px-3 py-1.5 text-sm overflow-hidden">
                        <span className="absolute inset-y-0 left-0 bg-primary-100/70" style={{ width: `${pct}%` }} aria-hidden />
                        <span className="relative flex justify-between gap-3"><span>{o}{t.kind === 'quiz' && t.results!.correct === i ? ' ✓' : ''}</span><span className="text-gray-500">{t.results!.counts[i]} · {pct}%</span></span>
                      </div>
                    )
                  })}
                  <details className="text-xs text-gray-500">
                    <summary className="cursor-pointer">{t.results.total} {t.results.total === 1 ? 'answer' : 'answers'}, see who answered</summary>
                    <ul className="mt-1 space-y-0.5 max-h-40 overflow-y-auto break-all">{t.results.voters.map(v => <li key={v.email}>{v.email}: {t.options[v.option]}</li>)}</ul>
                  </details>
                </div>
              )}
              <div className="mt-3 flex flex-wrap gap-4 text-sm">
                <button disabled={busy} onClick={() => { setReplying(replying === t.id ? null : t.id); setReplyHtml('') }} className="text-primary-700 hover:underline">Reply as team</button>
                {t.results && <button disabled={busy} onClick={() => act({ action: t.closed ? 'reopen' : 'close', scope: t.scope, id: t.id })} className="text-gray-600 hover:text-gray-900">{t.closed ? 'Reopen' : 'Close'}</button>}
                <button disabled={busy} onClick={() => act({ action: t.hidden ? 'show' : 'hide', scope: t.scope, id: t.id })} className="text-gray-600 hover:text-gray-900">{t.hidden ? 'Show' : 'Hide'}</button>
                <button disabled={busy} onClick={() => { if (window.confirm('Delete this for good, with its replies?')) act({ action: 'delete', scope: t.scope, id: t.id }) }} className="text-red-600 hover:underline">Delete</button>
              </div>
              {repliesOf(t.id).length > 0 && (
                <ul className="mt-4 space-y-2 border-l-2 border-gray-100 pl-4">
                  {repliesOf(t.id).map(r => (
                    <li key={r.id} className={`text-sm ${r.hidden ? 'opacity-60' : ''}`}>
                      <span className="font-medium text-gray-800">{r.author}{r.isTeam ? ' (team)' : ''}</span> <span className="text-xs text-gray-400">{when(r.createdAt)}{r.hidden ? ' · hidden' : ''}</span>
                      <Body p={r} />
                      <span className="text-xs">
                        <button disabled={busy} onClick={() => act({ action: r.hidden ? 'show' : 'hide', scope: r.scope, id: r.id })} className="text-gray-500 hover:text-gray-900 mr-3">{r.hidden ? 'Show' : 'Hide'}</button>
                        <button disabled={busy} onClick={() => { if (window.confirm('Delete this reply for good?')) act({ action: 'delete', scope: r.scope, id: r.id }) }} className="text-red-600 hover:underline">Delete</button>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {replying === t.id && (
                <div className="mt-4 space-y-2">
                  <RichEditor value={replyHtml} onChange={setReplyHtml} placeholder="Your reply, shown as Gennoor team" minHeight={80} />
                  <button type="button" disabled={busy || !replyHtml.replace(/<[^>]*>/g, '').trim()} onClick={async () => { if (await act({ action: 'reply', scope: t.scope, id: t.id, html: replyHtml })) { setReplying(null); setReplyHtml('') } }} className={PRIMARY}>Send reply</button>
                </div>
              )}
            </article>
          ))}
          <Pager v={vt} />
        </div>
      )}

      {posts && tab === 'reviews' && (
        <div className="mt-4"><ListToolbar v={vr} noun="review" />
        <div className={`${CARD} divide-y divide-gray-100`}>
          {reviews.length === 0 && <div className="p-8 text-center text-sm text-gray-500 flex flex-col items-center gap-2"><Inbox className="w-6 h-6 text-gray-400" />No reviews yet.</div>}
          {vr.rows.map(r => (
            <div key={r.slug + r.id} className={`p-4 ${r.hidden ? 'bg-amber-100/30' : ''}`}>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-semibold text-gray-900">{'★'.repeat(r.rating)}<span className="text-gray-300">{'★'.repeat(5 - r.rating)}</span></span>
                <span className="text-gray-700">{r.name}</span>
                <span className="text-xs text-gray-400 break-all">{r.email} · {r.slug.toUpperCase()} · {when(r.updatedAt)}</span>
                {r.hidden && <span className="text-xs text-amber-700 font-medium">Hidden</span>}
                <button disabled={busy} onClick={() => act({ action: r.hidden ? 'showReview' : 'hideReview', scope: r.slug, id: r.id })} className="ml-auto text-sm text-gray-600 hover:text-gray-900">{r.hidden ? 'Show' : 'Hide'}</button>
              </div>
              {r.text && <p className="text-sm text-gray-700 mt-1 whitespace-pre-line break-words">{r.text}</p>}
            </div>
          ))}
        </div>
        <Pager v={vr} />
        </div>
      )}
    </div>
  )
}
