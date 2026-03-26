'use client'

import { useState, useEffect, useCallback } from 'react'
import EmailOTP from '@/components/EmailOTP'

interface Comment {
  partitionKey: string
  rowKey: string
  parentId: string
  authorName: string
  content: string
  isAuthorReply: boolean
  status: string
  timestamp: string
}

function relativeTime(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = now - then
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (seconds < 60) return 'just now'
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`
  if (weeks < 5) return `${weeks} week${weeks === 1 ? '' : 's'} ago`
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`
  return `${years} year${years === 1 ? '' : 's'} ago`
}

function CommentForm({
  slug,
  parentId,
  onSubmitted,
  onCancel,
}: {
  slug: string
  parentId?: string
  onSubmitted: (comment: Comment) => void
  onCancel?: () => void
}) {
  const [authorName, setAuthorName] = useState('')
  const [authorEmail, setAuthorEmail] = useState('')
  const [content, setContent] = useState('')
  const [emailVerified, setEmailVerified] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setEmailVerified(false)
  }, [authorEmail])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailVerified || !authorName.trim() || !content.trim()) return

    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/blog-comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          parentId: parentId || '',
          authorName: authorName.trim(),
          authorEmail: authorEmail.trim(),
          content: content.trim(),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to post comment')
        return
      }

      const comment = await res.json()
      onSubmitted(comment)
      setAuthorName('')
      setAuthorEmail('')
      setContent('')
      setEmailVerified(false)
    } catch {
      setError('Failed to post comment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: '#374151' }}>
            Name
          </label>
          <input
            type="text"
            required
            maxLength={100}
            value={authorName}
            onChange={e => setAuthorName(e.target.value)}
            placeholder="Your name"
            className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            style={{ border: '1px solid #d1d5db', color: '#1f2937', backgroundColor: '#ffffff' }}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: '#374151' }}>
            Email
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              required
              value={authorEmail}
              onChange={e => setAuthorEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              style={{ border: '1px solid #d1d5db', color: '#1f2937', backgroundColor: '#ffffff' }}
            />
            <EmailOTP
              email={authorEmail}
              onVerified={() => setEmailVerified(true)}
              verified={emailVerified}
              compact
            />
          </div>
          <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>
            Your email will not be displayed publicly.
          </p>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: '#374151' }}>
          Comment
        </label>
        <textarea
          required
          maxLength={2000}
          rows={parentId ? 3 : 4}
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder={parentId ? 'Write a reply...' : 'Share your thoughts...'}
          className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          style={{ border: '1px solid #d1d5db', color: '#1f2937', backgroundColor: '#ffffff' }}
        />
        <div className="flex justify-end">
          <span className="text-xs" style={{ color: content.length > 1800 ? '#ef4444' : '#9ca3af' }}>
            {content.length}/2000
          </span>
        </div>
      </div>

      {error && (
        <p className="text-sm" style={{ color: '#ef4444' }}>{error}</p>
      )}

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={!emailVerified || !authorName.trim() || !content.trim() || submitting}
          className="px-4 py-2 text-sm font-semibold rounded-lg transition-colors"
          style={{
            backgroundColor: '#4f46e5',
            color: '#ffffff',
            opacity: (!emailVerified || !authorName.trim() || !content.trim() || submitting) ? 0.5 : 1,
            cursor: (!emailVerified || !authorName.trim() || !content.trim() || submitting) ? 'not-allowed' : 'pointer',
          }}
        >
          {submitting ? 'Posting...' : parentId ? 'Post Reply' : 'Post Comment'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
            style={{ color: '#6b7280', backgroundColor: '#f3f4f6' }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

function CommentItem({
  comment,
  replies,
  slug,
  onReplySubmitted,
}: {
  comment: Comment
  replies: Comment[]
  slug: string
  onReplySubmitted: (comment: Comment) => void
}) {
  const [showReplyForm, setShowReplyForm] = useState(false)

  const initials = comment.authorName
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div>
      <div
        className="p-4 rounded-lg"
        style={{
          backgroundColor: comment.isAuthorReply ? '#f0f7ff' : '#f9fafb',
          borderLeft: comment.isAuthorReply ? '3px solid #4f46e5' : '3px solid transparent',
        }}
      >
        <div className="flex items-center gap-2.5 mb-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{
              backgroundColor: comment.isAuthorReply ? '#4f46e5' : '#d1d5db',
              color: comment.isAuthorReply ? '#ffffff' : '#374151',
            }}
          >
            {initials}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold" style={{ color: '#1f2937' }}>
              {comment.authorName}
            </span>
            {comment.isAuthorReply && (
              <span
                className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded"
                style={{ backgroundColor: '#4f46e5', color: '#ffffff' }}
              >
                Author
              </span>
            )}
            <span className="text-xs" style={{ color: '#9ca3af' }}>
              {relativeTime(comment.timestamp)}
            </span>
          </div>
        </div>
        <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#374151' }}>
          {comment.content}
        </p>
        {!comment.parentId && (
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="mt-2 text-xs font-medium transition-colors"
            style={{ color: '#6b7280' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#4f46e5')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
          >
            Reply
          </button>
        )}
      </div>

      {/* Nested replies */}
      {replies.length > 0 && (
        <div className="ml-6 mt-2 space-y-2" style={{ borderLeft: '2px solid #e5e7eb', paddingLeft: '12px' }}>
          {replies.map(reply => {
            const replyInitials = reply.authorName
              .split(' ')
              .map(w => w[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)

            return (
              <div
                key={reply.rowKey}
                className="p-3 rounded-lg"
                style={{
                  backgroundColor: reply.isAuthorReply ? '#f0f7ff' : '#f9fafb',
                  borderLeft: reply.isAuthorReply ? '3px solid #4f46e5' : '3px solid transparent',
                }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{
                      backgroundColor: reply.isAuthorReply ? '#4f46e5' : '#d1d5db',
                      color: reply.isAuthorReply ? '#ffffff' : '#374151',
                    }}
                  >
                    {replyInitials}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold" style={{ color: '#1f2937' }}>
                      {reply.authorName}
                    </span>
                    {reply.isAuthorReply && (
                      <span
                        className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded"
                        style={{ backgroundColor: '#4f46e5', color: '#ffffff' }}
                      >
                        Author
                      </span>
                    )}
                    <span className="text-xs" style={{ color: '#9ca3af' }}>
                      {relativeTime(reply.timestamp)}
                    </span>
                  </div>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#374151' }}>
                  {reply.content}
                </p>
              </div>
            )
          })}
        </div>
      )}

      {/* Inline reply form */}
      {showReplyForm && (
        <div className="ml-6 mt-2" style={{ borderLeft: '2px solid #e5e7eb', paddingLeft: '12px' }}>
          <CommentForm
            slug={slug}
            parentId={comment.rowKey}
            onSubmitted={(newReply) => {
              onReplySubmitted(newReply)
              setShowReplyForm(false)
            }}
            onCancel={() => setShowReplyForm(false)}
          />
        </div>
      )}
    </div>
  )
}

export default function BlogComments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/blog-comments?slug=${encodeURIComponent(slug)}`)
      if (res.ok) {
        const data = await res.json()
        setComments(data)
      }
    } catch {
      // Silent fail on load
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const handleNewComment = (comment: Comment) => {
    setComments(prev => [comment, ...prev])
  }

  const handleReplySubmitted = (reply: Comment) => {
    setComments(prev => [...prev, reply])
  }

  // Separate top-level and replies
  const topLevel = comments.filter(c => !c.parentId)
  const repliesMap = new Map<string, Comment[]>()
  comments
    .filter(c => c.parentId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .forEach(c => {
      const existing = repliesMap.get(c.parentId) || []
      existing.push(c)
      repliesMap.set(c.parentId, existing)
    })

  const commentCount = comments.length

  return (
    <div
      className="mt-8 rounded-2xl shadow-lg overflow-hidden"
      style={{ backgroundColor: '#ffffff', border: '1px solid rgba(229,231,235,0.6)' }}
    >
      <div className="px-6 sm:px-10 py-8">
        {/* Header */}
        <h3 className="text-lg font-bold mb-1" style={{ color: '#111827' }}>
          Discussion
        </h3>
        <p className="text-sm mb-6" style={{ color: '#6b7280' }}>
          {loading
            ? 'Loading comments...'
            : commentCount === 0
              ? 'Be the first to share your thoughts.'
              : `${commentCount} comment${commentCount === 1 ? '' : 's'}`}
        </p>

        {/* New comment form */}
        <div className="mb-8 p-4 rounded-xl" style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}>
          <CommentForm slug={slug} onSubmitted={handleNewComment} />
        </div>

        {/* Comment list */}
        {!loading && topLevel.length > 0 && (
          <div className="space-y-4">
            {topLevel.map(comment => (
              <CommentItem
                key={comment.rowKey}
                comment={comment}
                replies={repliesMap.get(comment.rowKey) || []}
                slug={slug}
                onReplySubmitted={handleReplySubmitted}
              />
            ))}
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-8">
            <div
              className="w-6 h-6 rounded-full animate-spin"
              style={{ border: '2px solid #e5e7eb', borderTopColor: '#4f46e5' }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
