'use client'

import { useState, useCallback } from 'react'

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
  const [secret, setSecret] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'all' | 'approved' | 'hidden'>('all')
  const [searchSlug, setSearchSlug] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchComments = useCallback(async (adminSecret: string) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/comments?secret=${encodeURIComponent(adminSecret)}`)
      if (!res.ok) {
        if (res.status === 401) throw new Error('Invalid admin secret')
        throw new Error('Failed to load comments')
      }
      const data = await res.json()
      setComments(data)
      setAuthenticated(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!secret.trim()) return
    fetchComments(secret)
  }

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
          secret,
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

  const slugGroups = filtered.reduce<Record<string, Comment[]>>((acc, c) => {
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

  // Login screen
  if (!authenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
        <form onSubmit={handleLogin} style={{
          background: '#fff', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          width: '100%', maxWidth: '400px',
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px', color: '#111827' }}>Comment Admin</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>Enter your admin secret to continue</p>
          {error && (
            <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px' }}>
              {error}
            </div>
          )}
          <input
            type="password"
            value={secret}
            onChange={e => setSecret(e.target.value)}
            placeholder="Admin secret"
            style={{
              width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px',
              fontSize: '14px', marginBottom: '16px', outline: 'none', boxSizing: 'border-box',
            }}
            autoFocus
          />
          <button
            type="submit"
            disabled={loading || !secret.trim()}
            style={{
              width: '100%', padding: '12px', background: loading ? '#93c5fd' : '#2563eb', color: '#fff',
              border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: loading ? 'wait' : 'pointer',
            }}
          >
            {loading ? 'Verifying...' : 'Login'}
          </button>
        </form>
      </div>
    )
  }

  // Admin dashboard
  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: 0 }}>Comment Admin</h1>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0' }}>
            {comments.length} total &middot; {comments.filter(c => c.status === 'approved').length} approved &middot; {comments.filter(c => c.status === 'hidden').length} hidden
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => fetchComments(secret)} style={{ padding: '8px 16px', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
            Refresh
          </button>
          <button onClick={() => { setAuthenticated(false); setSecret(''); setComments([]) }} style={{ padding: '8px 16px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ padding: '16px 24px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search by blog slug..."
          value={searchSlug}
          onChange={e => setSearchSlug(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', width: '260px', outline: 'none' }}
        />
        {(['all', 'approved', 'hidden'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
              border: filter === f ? 'none' : '1px solid #d1d5db',
              background: filter === f ? (f === 'hidden' ? '#dc2626' : f === 'approved' ? '#16a34a' : '#2563eb') : '#fff',
              color: filter === f ? '#fff' : '#374151',
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ margin: '0 24px 16px', background: '#fef2f2', color: '#dc2626', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      {/* Comments grouped by blog post */}
      <div style={{ padding: '0 24px 40px' }}>
        {Object.keys(slugGroups).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>
            {loading ? 'Loading...' : 'No comments found'}
          </div>
        ) : (
          Object.entries(slugGroups).map(([slug, slugComments]) => (
            <div key={slug} style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#374151', margin: 0 }}>{slug}</h2>
                <span style={{ fontSize: '12px', color: '#9ca3af', background: '#f3f4f6', padding: '2px 8px', borderRadius: '10px' }}>
                  {slugComments.length}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {slugComments.map(c => (
                  <div
                    key={c.rowKey}
                    style={{
                      background: '#fff', borderRadius: '12px', padding: '16px',
                      border: `1px solid ${c.status === 'hidden' ? '#fecaca' : '#e5e7eb'}`,
                      opacity: c.status === 'hidden' ? 0.6 : 1,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>{c.authorName}</span>
                          {c.isAuthorReply && (
                            <span style={{ fontSize: '11px', background: '#dbeafe', color: '#2563eb', padding: '2px 8px', borderRadius: '10px', fontWeight: 500 }}>Author</span>
                          )}
                          {c.parentId && (
                            <span style={{ fontSize: '11px', background: '#f3f4f6', color: '#6b7280', padding: '2px 8px', borderRadius: '10px' }}>Reply</span>
                          )}
                          <span style={{
                            fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '10px',
                            background: c.status === 'approved' ? '#dcfce7' : '#fef2f2',
                            color: c.status === 'approved' ? '#16a34a' : '#dc2626',
                          }}>
                            {c.status}
                          </span>
                        </div>
                        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 8px' }}>
                          {c.authorEmail} &middot; {timeAgo(c.timestamp)}
                        </p>
                        <p style={{ fontSize: '14px', color: '#374151', margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                          {c.content}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleStatus(c)}
                        disabled={actionLoading === c.rowKey}
                        style={{
                          padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                          border: 'none', flexShrink: 0,
                          background: c.status === 'approved' ? '#fef2f2' : '#dcfce7',
                          color: c.status === 'approved' ? '#dc2626' : '#16a34a',
                          opacity: actionLoading === c.rowKey ? 0.5 : 1,
                        }}
                      >
                        {actionLoading === c.rowKey ? '...' : c.status === 'approved' ? 'Hide' : 'Restore'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
