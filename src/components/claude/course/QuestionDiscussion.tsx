'use client'

/** Discussion thread under one practice-exam question. Reading is open; posting needs the site sign-in. */
import { useCallback, useEffect, useState } from 'react'
import { MessagesSquare, Send, LogIn, Loader2 } from 'lucide-react'
import type { Auth } from './types'

interface Comment { rowKey: string; authorName: string; content: string; createdAt: string }

interface Props {
  topic: string
  auth: Auth
  onSignIn: () => void
}

function when(iso: string) {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  const s = (Date.now() - d.getTime()) / 1000
  if (s < 3600) return `${Math.max(1, Math.floor(s / 60))} min ago`
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`
  if (s < 86400 * 30) return `${Math.floor(s / 86400)} d ago`
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function QuestionDiscussion({ topic, auth, onSignIn }: Props) {
  const [items, setItems] = useState<Comment[] | null>(null)
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const load = useCallback(async () => {
    try {
      const r = await fetch('/api/cert-comments?topic=' + encodeURIComponent(topic), { cache: 'no-store' })
      setItems(r.ok ? await r.json() : [])
    } catch {
      setItems([])
    }
  }, [topic])

  useEffect(() => { setItems(null); setText(''); setErr(''); load() }, [load])

  const post = async () => {
    const t = text.trim()
    if (!t || busy) return
    setBusy(true); setErr('')
    try {
      const r = await fetch('/api/cert-comments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic, content: t }) })
      const j = await r.json().catch(() => ({}))
      if (r.status === 401) { onSignIn(); return }
      if (!r.ok) { setErr(j.error || 'Could not post the comment.'); return }
      setText('')
      await load()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="cc-disc">
      <div className="cc-disc-h"><MessagesSquare /> Discussion <small>{items ? `· ${items.length} comment${items.length === 1 ? '' : 's'}` : ''}</small></div>
      {items === null ? (
        <div className="cc-disc-empty">Loading…</div>
      ) : items.length === 0 ? (
        <div className="cc-disc-empty">No comments yet. Ask about this question or share how you reasoned it out.</div>
      ) : (
        <div>
          {items.map(c => (
            <div key={c.rowKey} className="cc-cmt">
              <span className="av">{(c.authorName || '?').charAt(0).toUpperCase()}</span>
              <div className="bd">
                <div className="who">{c.authorName}<time>{when(c.createdAt)}</time></div>
                <p>{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {auth ? (
        <div className="cc-disc-form">
          <textarea
            value={text}
            maxLength={2000}
            placeholder="Add a comment…"
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') post() }}
            aria-label="Your comment"
          />
          <button type="button" className="cc-btn pri sm" disabled={!text.trim() || busy} onClick={post}>
            {busy ? <Loader2 className="animate-spin" /> : <Send />} Post
          </button>
        </div>
      ) : auth === false ? (
        <div style={{ marginTop: 8 }}>
          <button type="button" className="cc-btn sm" onClick={onSignIn}><LogIn /> Sign in to comment</button>
        </div>
      ) : null}
      {err && <div style={{ color: 'var(--cc-bad)', fontSize: 12.5, marginTop: 6 }}>{err}</div>}
    </div>
  )
}
