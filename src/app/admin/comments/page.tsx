'use client'

import { useState, useEffect, useCallback } from 'react'
import { ListToolbar, Pager, useListView } from '@/components/admin/ListControls'
import { MessageSquare, RefreshCw, Search, Loader2, Inbox, Eye, EyeOff } from 'lucide-react'

interface Comment {
  partitionKey: string
  rowKey: string
  parentId: string
  authorName: string
  authorEmail: string
  content: string
  isAuthorReply: boolean
  status: string
  timestamp: string
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'all' | 'approved' | 'hidden'>('all')
  const [searchSlug, setSearchSlug] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Auth comes from the admin session cookie — the /admin middleware already
  // requires Entra sign-in before this page is reachable.
  const fetchComments = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/comments')
      if (!res.ok) {
        if (res.status === 401) throw new Error('Session expired — sign in again at /admin/login')
        throw new Error('Failed to load comments')
      }
      const data = await res.json()
      setComments(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const toggleStatus = async (comment: Comment) => {
    const newStatus = comment.status === 'approved' ? 'hidden' : 'approved'
    setActionLoading(comment.rowKey)
    try {
      const res = await fetch('/api/admin/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: comment.partitionKey,
          rowKey: comment.rowKey,
          status: newStatus,
        }),
      })
      if (!res.ok) throw new Error('Failed to update')
      setComments(prev =>
        prev.map(c => c.rowKey === comment.rowKey ? { ...c, status: newStatus } : c)
      )
    } catch {
      setError('Failed to update comment status')
    } finally {
      setActionLoading(null)
    }
  }

  const filtered = comments.filter(c => {
    if (filter !== 'all' && c.status !== filter) return false
    if (searchSlug && !c.partitionKey.toLowerCase().includes(searchSlug.toLowerCase())) return false
    return true
  })

  const v = useListView(filtered, { date: c => c.timestamp, text: c => `${c.authorName} ${c.authorEmail} ${c.content}`, pageSize: 25 })
  const slugGroups = v.rows.reduce<Record<string, Comment[]>>((acc, c) => {
    if (!acc[c.partitionKey]) acc[c.partitionKey] = []
    acc[c.partitionKey].push(c)
    return acc
  }, {})

  const timeAgo = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    return `${days}d ago`
  }

  const count = (st: string) => comments.filter(c => c.status === st).length

  return (
    <div className="w-full p-4 lg:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight text-gray-900 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-primary-600" />Comments</h1>
          <p className="text-xs text-gray-500 mt-0.5">{comments.length} total · {count('approved')} approved · {count('hidden')} hidden</p>
        </div>
        <button onClick={() => fetchComments()} disabled={loading} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-300 bg-raised text-gray-700 text-xs font-medium hover:bg-gray-50 disabled:opacity-50">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />Refresh
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by blog slug..."
            value={searchSlug}
            onChange={e => setSearchSlug(e.target.value)}
            className="w-64 max-w-full border border-gray-300 rounded-md pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-primary-600"
          />
        </div>
        {(['all', 'approved', 'hidden'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium border ${filter === f ? 'bg-gray-800 text-white border-gray-800' : 'bg-raised text-gray-700 border-gray-300 hover:bg-gray-50'}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="mt-3"><ListToolbar v={v} noun="comment" /></div>
      {error && <div className="mt-3 rounded-md bg-red-100 text-red-800 px-3 py-2 text-xs break-words">{error}</div>}

      <div className="mt-4 space-y-4">
        {Object.keys(slugGroups).length === 0 ? (
          <div className="border border-gray-200 rounded-xl bg-raised shadow-sm p-8 text-center text-sm text-gray-500">
            {loading ? (
              <span className="inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Loading...</span>
            ) : (
              <span className="inline-flex flex-col items-center gap-2"><Inbox className="w-6 h-6 text-gray-400" />No comments found</span>
            )}
          </div>
        ) : (
          Object.entries(slugGroups).map(([slug, slugComments]) => (
            <section key={slug} className="border border-gray-200 rounded-xl bg-raised shadow-sm">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-800 break-all">{slug}</h2>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{slugComments.length}</span>
              </div>
              <ul className="divide-y divide-gray-100 max-h-[28rem] overflow-y-auto">
                {slugComments.map(c => (
                  <li key={c.rowKey} className={`p-4 flex flex-wrap items-start justify-between gap-3 ${c.status === 'hidden' ? 'bg-red-100/30 opacity-70' : ''}`}>
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-sm font-semibold text-gray-900 break-words">{c.authorName}</span>
                        {c.isAuthorReply && <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">Author</span>}
                        {c.parentId && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Reply</span>}
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{c.status}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 break-all">{c.authorEmail} · {timeAgo(c.timestamp)}</p>
                      <p className="text-sm text-gray-700 mt-1.5 whitespace-pre-wrap break-words leading-relaxed">{c.content}</p>
                    </div>
                    <button
                      onClick={() => toggleStatus(c)}
                      disabled={actionLoading === c.rowKey}
                      className={`shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium disabled:opacity-50 ${c.status === 'approved' ? 'bg-raised border border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
                    >
                      {actionLoading === c.rowKey ? '...' : c.status === 'approved' ? (<><EyeOff className="w-3.5 h-3.5" />Hide</>) : (<><Eye className="w-3.5 h-3.5" />Restore</>)}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  )
}
