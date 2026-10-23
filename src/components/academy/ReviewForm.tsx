'use client'

import { useState, FormEvent } from 'react'
import { Loader2 } from 'lucide-react'
import { StarInput } from './Stars'

/** Rating plus optional words. Used in the prompt after a module and on the course page. */
export default function ReviewForm({
  slug, initialRating = 0, initialText = '', submitLabel = 'Submit review', onDone, onCancel, cancelLabel = 'Not now',
}: {
  slug: string; initialRating?: number; initialText?: string; submitLabel?: string
  onDone: () => void; onCancel?: () => void; cancelLabel?: string
}) {
  const [rating, setRating] = useState(initialRating)
  const [text, setText] = useState(initialText)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!rating) { setError('Choose a star rating first.'); return }
    setBusy(true); setError('')
    try {
      const r = await fetch('/api/lms/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug, rating, text }) })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(d.error || 'Could not save your review.')
      onDone()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save your review.')
    } finally { setBusy(false) }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <StarInput value={rating} onChange={setRating} />
      <textarea
        value={text} onChange={e => setText(e.target.value)} rows={3} maxLength={2000} aria-label="Your review"
        placeholder="What did you like, or what could be better? (optional)"
        className="w-full border border-[#d2d2d7] rounded-xl px-3.5 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-primary-600"
      />
      {error && <p className="text-[13px] text-red-600">{error}</p>}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={busy} className="pill-primary inline-flex items-center gap-2 disabled:opacity-60">
          {busy && <Loader2 className="w-4 h-4 animate-spin" />} {submitLabel}
        </button>
        {onCancel && <button type="button" onClick={onCancel} className="text-[14px] text-[#6e6e73] hover:text-gray-900">{cancelLabel}</button>}
      </div>
    </form>
  )
}
