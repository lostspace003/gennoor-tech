'use client'

import { useCallback, useEffect, useState } from 'react'
import { Stars } from './Stars'
import ReviewForm from './ReviewForm'

interface Review { name: string; rating: number; text: string; updatedAt: string; mine?: boolean }
interface Data { summary: { average: number; count: number; counts: Record<string, number> }; reviews: Review[]; mine: { rating: number; text: string } | null }

/** Rating summary and reviews on the course page. Enrolled learners can write or edit theirs. */
export default function CourseReviews({ slug, enrolled }: { slug: string; enrolled: boolean }) {
  const [data, setData] = useState<Data | null>(null)
  const [editing, setEditing] = useState(false)

  const load = useCallback(async () => {
    const r = await fetch(`/api/lms/reviews?slug=${encodeURIComponent(slug)}`, { cache: 'no-store' })
    if (r.ok) setData(await r.json())
  }, [slug])
  useEffect(() => { load() }, [load])

  if (!data) return null
  const { summary, reviews, mine } = data

  return (
    <section id="reviews">
      <h2 className="font-heading text-[28px] font-bold tracking-[-0.02em] text-gray-900 mb-6">Reviews</h2>

      {summary.count > 0 ? (
        <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
          <div>
            <div className="text-[44px] font-bold tracking-tight text-gray-900 tabular-nums leading-none">{summary.average.toFixed(1)}</div>
            <Stars value={summary.average} size={18} className="mt-2" />
            <div className="text-[13px] text-gray-500 mt-1.5">{summary.count} {summary.count === 1 ? 'rating' : 'ratings'}</div>
          </div>
          <ul className="flex-1 min-w-[220px] max-w-[360px] space-y-1.5">
            {[5, 4, 3, 2, 1].map(n => (
              <li key={n} className="flex items-center gap-2.5 text-[13px] text-gray-500">
                <span className="w-3 tabular-nums">{n}</span>
                <span className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden"><span className="block h-full bg-[#f5a524]" style={{ width: `${(summary.counts[n] / summary.count) * 100}%` }} /></span>
                <span className="w-6 text-right tabular-nums">{summary.counts[n]}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-500">No reviews yet.{enrolled ? ' Be the first to rate this course.' : ''}</p>
      )}

      {enrolled && (
        <div className="mt-8">
          {editing || !mine ? (
            <div className="rounded-2xl bg-gray-50 p-6 max-w-[560px]">
              <h3 className="font-semibold text-gray-900 mb-3">{mine ? 'Edit your review' : 'Rate this course'}</h3>
              <ReviewForm slug={slug} initialRating={mine?.rating ?? 0} initialText={mine?.text ?? ''} submitLabel={mine ? 'Save' : 'Submit review'}
                onDone={() => { setEditing(false); load() }} onCancel={mine ? () => setEditing(false) : undefined} cancelLabel="Cancel" />
            </div>
          ) : (
            <p className="text-[14px] text-gray-500">You rated this course {mine.rating} of 5. <button type="button" onClick={() => setEditing(true)} className="text-primary-600 hover:underline">Edit</button></p>
          )}
        </div>
      )}

      {reviews.length > 0 && (
        <ul className="mt-10 divide-y divide-gray-200 border-t border-gray-200">
          {reviews.map((r, i) => (
            <li key={i} className="py-5">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-primary-50 text-primary-700 font-semibold flex items-center justify-center text-[14px]">{r.name.charAt(0)}</span>
                <div>
                  <div className="text-[14.5px] font-semibold text-gray-900">{r.name}{r.mine ? <span className="ml-2 text-[12px] font-normal text-gray-400">You</span> : null}</div>
                  <div className="flex items-center gap-2"><Stars value={r.rating} size={13} /><span className="text-[12px] text-gray-400">{new Date(r.updatedAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span></div>
                </div>
              </div>
              <p className="mt-3 text-[15px] leading-[1.6] text-gray-700 whitespace-pre-line max-w-[68ch]">{r.text}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
