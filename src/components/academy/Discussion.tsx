'use client'

import { useCallback, useEffect, useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart3, Check, HelpCircle, Heart, Loader2, Megaphone, MessageSquare, Plus, Trash2, X } from 'lucide-react'
import LearnerAuthModal from './LearnerAuthModal'
import RichEditor, { RichText } from './RichEditor'

type Kind = 'topic' | 'announcement' | 'poll' | 'quiz'
interface Results { counts: number[]; total: number; myVote: number | null; correct?: number; explanation?: string }
interface Post {
  id: string; title: string; body: string; html?: string; kind?: Kind; options?: string[]; closed?: boolean; results?: Results
  author: string; isTeam: boolean; createdAt: string; mine?: boolean; likes?: number; liked?: boolean
}
interface Thread extends Post { replies: number; lastAt: string }

const ago = (iso: string) => {
  const s = (Date.now() - new Date(iso).getTime()) / 1000
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)} min ago`
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`
  if (s < 86400 * 30) return `${Math.floor(s / 86400)} d ago`
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

const KIND_LABEL: Record<Kind, { label: string; Icon: typeof Megaphone; cls: string }> = {
  topic: { label: 'Topic', Icon: MessageSquare, cls: 'bg-[#f5f5f7] text-[#6e6e73]' },
  announcement: { label: 'Announcement', Icon: Megaphone, cls: 'bg-amber-50 text-amber-800' },
  poll: { label: 'Poll', Icon: BarChart3, cls: 'bg-primary-50 text-primary-700' },
  quiz: { label: 'Quiz', Icon: HelpCircle, cls: 'bg-emerald-50 text-emerald-800' },
}

function KindBadge({ kind }: { kind?: Kind }) {
  if (!kind || kind === 'topic') return null
  const { label, Icon, cls } = KIND_LABEL[kind]
  return <span className={`inline-flex items-center gap-1 text-[11.5px] font-semibold rounded-full px-2 py-0.5 ${cls}`}><Icon className="w-3 h-3" />{label}</span>
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

/** A poll or a quiz: choose an answer, then see how everyone answered. */
function Choices({ p, canVote, onVote }: { p: Post; canVote: boolean; onVote: (option: number) => void }) {
  const r = p.results
  const options = p.options ?? []
  if (!r || options.length === 0) return null
  const quiz = p.kind === 'quiz'
  const answered = r.myVote !== null
  const showBars = answered || p.closed || (!quiz && r.total > 0 && !canVote)
  return (
    <div className="mt-4 max-w-[560px] space-y-2">
      {options.map((o, i) => {
        const pct = r.total ? Math.round((r.counts[i] / r.total) * 100) : 0
        const mine = r.myVote === i
        const right = quiz && r.correct === i
        const wrong = quiz && mine && r.correct !== i
        return (
          <button
            key={i} type="button" disabled={!canVote || (quiz && answered) || p.closed} onClick={() => onVote(i)}
            className={`relative w-full text-left rounded-xl border px-4 py-2.5 text-[14.5px] overflow-hidden transition-colors ${
              right ? 'border-emerald-500 bg-emerald-50' : wrong ? 'border-red-400 bg-red-50' : mine ? 'border-primary-600 bg-primary-50' : 'border-[#d2d2d7] bg-white hover:border-primary-600'} disabled:cursor-default`}
          >
            {showBars && !quiz && <span className="absolute inset-y-0 left-0 bg-primary-100/70" style={{ width: `${pct}%` }} aria-hidden />}
            <span className="relative flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-gray-900">
                {right && <Check className="w-4 h-4 text-emerald-600" />}{wrong && <X className="w-4 h-4 text-red-500" />}{o}
              </span>
              {showBars && <span className="text-[12.5px] text-[#6e6e73]">{pct}%</span>}
            </span>
          </button>
        )
      })}
      <p className="text-[12.5px] text-[#86868b]">
        {r.total} {r.total === 1 ? 'answer' : 'answers'}{p.closed ? ' · closed' : quiz && !answered ? ' · pick one to see the answer' : !quiz && answered ? ' · you can change your vote' : ''}
      </p>
      {quiz && answered && r.explanation && <p className="text-[14px] text-[#3a3a3f] bg-[#f5f6f8] rounded-xl px-4 py-3">{r.explanation}</p>}
    </div>
  )
}

/** Discussion for one scope: a course (its slug) or the whole community ("community"). */
export default function Discussion({ scope, emptyText, signedIn = true }: { scope: string; emptyText?: string; signedIn?: boolean }) {
  const router = useRouter()
  const [authOpen, setAuthOpen] = useState(false)
  const [threads, setThreads] = useState<Thread[] | null>(null)
  const [open, setOpen] = useState<{ thread: Post; replies: Post[] } | null>(null)
  const [composing, setComposing] = useState<'topic' | 'poll' | null>(null)
  const [title, setTitle] = useState('')
  const [html, setHtml] = useState('')
  const [pollOptions, setPollOptions] = useState(['', ''])
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

  const post = async (payload: Record<string, unknown>) => {
    setBusy(true); setError('')
    try {
      const r = await fetch('/api/lms/discussion', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ scope, ...payload }) })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(d.error || 'Could not post.')
      return true
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not post.'); return false } finally { setBusy(false) }
  }

  const resetComposer = () => { setTitle(''); setHtml(''); setPollOptions(['', '']); setComposing(null); setError('') }
  const newTopic = async (e: FormEvent) => {
    e.preventDefault()
    const ok = composing === 'poll'
      ? await post({ kind: 'poll', title, html, options: pollOptions })
      : await post({ title, html })
    if (ok) { resetComposer(); loadList() }
  }
  const sendReply = async (e: FormEvent) => {
    e.preventDefault()
    if (open && (await post({ parentId: open.thread.id, html: reply }))) { setReply(''); openThread(open.thread.id); loadList() }
  }
  const remove = async (id: string, isThread: boolean) => {
    if (!window.confirm(isThread ? 'Delete this topic and its replies?' : 'Delete this reply?')) return
    await fetch(`/api/lms/discussion?scope=${encodeURIComponent(scope)}&id=${encodeURIComponent(id)}`, { method: 'DELETE' })
    if (isThread) { setOpen(null); loadList() } else if (open) openThread(open.thread.id)
  }

  // Liking and voting need a sign-in; signed-out visitors are asked to sign in.
  const like = async (id: string) => {
    if (!signedIn) { setAuthOpen(true); return }
    const r = await fetch('/api/lms/discussion', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ scope, id }) })
    const d = await r.json().catch(() => ({}))
    if (!r.ok) { setError(d.error || 'Could not like that.'); return }
    setThreads(ts => (ts ?? []).map(t => (t.id === id ? { ...t, likes: d.likes, liked: d.liked } : t)))
    setOpen(o => o && ({
      thread: o.thread.id === id ? { ...o.thread, likes: d.likes, liked: d.liked } : o.thread,
      replies: o.replies.map(x => (x.id === id ? { ...x, likes: d.likes, liked: d.liked } : x)),
    }))
  }
  const vote = async (id: string, option: number) => {
    if (!signedIn) { setAuthOpen(true); return }
    const r = await fetch('/api/lms/discussion', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ scope, id, option }) })
    const d = await r.json().catch(() => ({}))
    if (!r.ok) { setError(d.error || 'Could not save your answer.'); return }
    setOpen(o => o && ({ ...o, thread: o.thread.id === id ? { ...o.thread, results: d.results } : o.thread }))
    setError('')
  }
  const Like = ({ p }: { p: Post }) => (
    <button type="button" onClick={e => { e.stopPropagation(); like(p.id) }} aria-pressed={!!p.liked} aria-label={p.liked ? 'Unlike' : 'Like'}
      className={`inline-flex items-center gap-1 text-[13px] ${p.liked ? 'text-rose-600' : 'text-[#86868b] hover:text-gray-900'}`}>
      <Heart className="w-4 h-4" fill={p.liked ? 'currentColor' : 'none'} strokeWidth={1.8} />{p.likes ? p.likes : ''}
    </button>
  )
  const SignInButton = ({ label }: { label: string }) => (
    <button type="button" onClick={() => setAuthOpen(true)} className="pill-primary">{label}</button>
  )
  // Posts written before the editor existed have plain text only.
  const Body = ({ p, big }: { p: Post; big?: boolean }) => p.html
    ? <RichText html={p.html} className={`${big ? 'text-[15.5px] leading-[1.65]' : 'text-[15px] leading-[1.6]'} text-[#3a3a3f]`} />
    : <p className={`${big ? 'text-[15.5px] leading-[1.65]' : 'text-[15px] leading-[1.6]'} text-[#3a3a3f] whitespace-pre-line`}>{p.body}</p>

  const FIELD = 'w-full border border-[#d2d2d7] rounded-xl px-3.5 py-2.5 text-[14.5px] text-gray-900 focus:outline-none focus:border-primary-600'

  const authModal = (
    <LearnerAuthModal
      isOpen={authOpen}
      onClose={() => setAuthOpen(false)}
      onLoginSuccess={() => { setAuthOpen(false); router.refresh() }}
      title="Sign in to Learning Studio"
      subtitle="One account for every course and the community."
    />
  )

  if (open) {
    const t = open.thread
    return (
      <div>
        <button type="button" onClick={() => { setOpen(null); loadList() }} className="text-[14px] text-primary-600 hover:underline">‹ All topics</button>
        <article className="mt-4">
          <div className="flex items-center gap-2"><KindBadge kind={t.kind} /></div>
          <h2 className="font-heading text-[24px] font-bold tracking-[-0.02em] text-gray-900 mt-1">{t.title}</h2>
          <div className="mt-3 flex items-center justify-between"><Author p={t} /><span className="inline-flex items-center gap-2"><Like p={t} />{t.mine && <button type="button" aria-label="Delete topic" onClick={() => remove(t.id, true)} className="p-1.5 text-[#86868b] hover:text-red-600"><Trash2 className="w-4 h-4" /></button>}</span></div>
          <div className="mt-3"><Body p={t} big /></div>
          <Choices p={t} canVote={signedIn} onVote={o => vote(t.id, o)} />
          {!signedIn && (t.kind === 'poll' || t.kind === 'quiz') && <p className="mt-2 text-[13px] text-[#6e6e73]">Sign in to answer.</p>}
          {error && <p className="mt-3 text-[13px] text-red-600">{error}</p>}
        </article>
        <h3 className="mt-10 mb-2 text-[14px] font-semibold text-gray-900">{open.replies.length} {open.replies.length === 1 ? 'reply' : 'replies'}</h3>
        <ul className="divide-y divide-[#e8e8ed] border-t border-[#e8e8ed]">
          {open.replies.map(p => (
            <li key={p.id} className={`py-4 ${p.isTeam ? 'bg-primary-50/50 -mx-3 px-3 rounded-lg' : ''}`}>
              <div className="flex items-center justify-between"><Author p={p} /><span className="inline-flex items-center gap-2"><Like p={p} />{p.mine && <button type="button" aria-label="Delete reply" onClick={() => remove(p.id, false)} className="p-1.5 text-[#86868b] hover:text-red-600"><Trash2 className="w-4 h-4" /></button>}</span></div>
              <div className="mt-2"><Body p={p} /></div>
            </li>
          ))}
        </ul>
        {!signedIn ? (
          <div className="mt-6 rounded-2xl bg-[#f5f6f8] p-5 flex flex-wrap items-center gap-4">
            <p className="text-[14.5px] text-gray-900">Sign in to Learning Studio to reply or like.</p>
            <SignInButton label="Sign in" />
          </div>
        ) : (
        <form onSubmit={sendReply} className="mt-6 space-y-3 max-w-[640px]">
          <RichEditor value={reply} onChange={setReply} placeholder="Write a reply" label="Your reply" minHeight={90} />
          <button type="submit" disabled={busy || !reply.replace(/<[^>]*>/g, '').trim()} className="pill-primary inline-flex items-center gap-2 disabled:opacity-50">{busy && <Loader2 className="w-4 h-4 animate-spin" />} Reply</button>
        </form>
        )}
        {authModal}
      </div>
    )
  }

  const canPost = composing === 'poll'
    ? !!title.trim() && pollOptions.filter(o => o.trim()).length >= 2
    : !!title.trim() && !!html.replace(/<[^>]*>/g, '').trim()

  return (
    <div>
      {!signedIn ? (
        <div className="rounded-2xl bg-[#f5f6f8] p-5 flex flex-wrap items-center gap-4 max-w-[640px]">
          <SignInButton label="Sign in to join" />
        </div>
      ) : !composing ? (
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => setComposing('topic')} className="pill-primary">Start a topic</button>
          <button type="button" onClick={() => setComposing('poll')} className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#d2d2d7] text-[14.5px] font-medium text-gray-900 hover:border-primary-600"><BarChart3 className="w-4 h-4" />Create a poll</button>
        </div>
      ) : (
        <form onSubmit={newTopic} className="rounded-2xl bg-[#f5f6f8] p-5 space-y-3 max-w-[680px]">
          <input value={title} onChange={e => setTitle(e.target.value)} maxLength={140} placeholder={composing === 'poll' ? 'Your question' : 'Topic title'} aria-label="Title" className={FIELD} />
          <RichEditor value={html} onChange={setHtml} placeholder={composing === 'poll' ? 'Add some context (optional)' : 'What would you like to discuss?'} minHeight={composing === 'poll' ? 70 : 130} />
          {composing === 'poll' && (
            <div className="space-y-2">
              {pollOptions.map((o, i) => (
                <input key={i} value={o} onChange={e => setPollOptions(p => p.map((x, j) => (j === i ? e.target.value : x)))} maxLength={120} placeholder={`Choice ${i + 1}`} aria-label={`Choice ${i + 1}`} className={FIELD} />
              ))}
              {pollOptions.length < 6 && <button type="button" onClick={() => setPollOptions(p => [...p, ''])} className="inline-flex items-center gap-1 text-[13.5px] text-primary-600 hover:underline"><Plus className="w-3.5 h-3.5" />Add a choice</button>}
            </div>
          )}
          {error && <p className="text-[13px] text-red-600">{error}</p>}
          <div className="flex items-center gap-3">
            <button type="submit" disabled={busy || !canPost} className="pill-primary inline-flex items-center gap-2 disabled:opacity-50">{busy && <Loader2 className="w-4 h-4 animate-spin" />} Post</button>
            <button type="button" onClick={resetComposer} className="text-[14px] text-[#6e6e73] hover:text-gray-900">Cancel</button>
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
              <button type="button" onClick={() => openThread(t.id)} className={`w-full text-left py-4 hover:bg-[#fafafa] -mx-3 px-3 rounded-lg transition-colors ${t.kind === 'announcement' ? 'bg-amber-50/40' : ''}`}>
                <div className="flex items-center gap-2"><KindBadge kind={t.kind} /><span className="text-[16px] font-semibold text-gray-900">{t.title}</span></div>
                <div className="mt-1 flex items-center gap-3 text-[13px] text-[#86868b]">
                  <span>{t.author}{t.isTeam ? ' (team)' : ''}</span>
                  <span className="inline-flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" />{t.replies}</span>
                  <span className="inline-flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{t.likes ?? 0}</span>
                  {t.results && <span>{t.results.total} {t.results.total === 1 ? 'answer' : 'answers'}</span>}
                  <span>{ago(t.lastAt)}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
      {authModal}
    </div>
  )
}
