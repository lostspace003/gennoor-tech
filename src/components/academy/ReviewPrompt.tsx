'use client'

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import type { LmsCourse, LmsProgressEntry } from '@/lib/lms'
import ReviewForm from './ReviewForm'

/**
 * Asks every learner for a rating at least once, and stops asking once they have given one.
 * It appears (a) when a module is finished, (b) after every 5th finished lesson, and (c) when the whole
 * course is finished. Each moment is asked about only once per browser, so "Not now" is respected until
 * the next moment. A star rating is quick and the words are optional.
 */
export default function ReviewPrompt({ course, progress }: { course: LmsCourse; progress: Record<string, LmsProgressEntry> }) {
  const doneSections = course.sections.map(s => s.items.length > 0 && s.items.every(i => progress[i.id]?.done)).map(Boolean)
  const lessonsDone = course.sections.reduce((n, s) => n + s.items.filter(i => progress[i.id]?.done).length, 0)
  const total = course.sections.reduce((n, s) => n + s.items.length, 0)
  const finished = total > 0 && lessonsDone === total
  // one number that goes up whenever a new "moment" is reached
  const count = doneSections.filter(Boolean).length * 1000 + Math.floor(lessonsDone / 5) + (finished ? 100000 : 0)
  const last = useRef<number | null>(null)
  const reviewed = useRef<boolean | null>(null)
  const [show, setShow] = useState(false)
  const [thanks, setThanks] = useState(false)
  const key = `gennoor.lms.asked.${course.slug}`

  useEffect(() => {
    if (last.current === null) { last.current = count; return } // first render: whatever was already done is not "new"
    if (count <= last.current) { last.current = count; return }
    last.current = count
    const idx = count
    let asked: number[] = []
    try { asked = JSON.parse(localStorage.getItem(key) || '[]') } catch { /* ignore */ }
    if (asked.includes(idx)) return
    ;(async () => {
      if (reviewed.current === null) {
        const r = await fetch(`/api/lms/reviews?slug=${encodeURIComponent(course.slug)}`, { cache: 'no-store' }).catch(() => null)
        reviewed.current = r?.ok ? !!(await r.json()).mine : false
      }
      if (reviewed.current) return
      try { localStorage.setItem(key, JSON.stringify([...asked, idx])) } catch { /* ignore */ }
      setShow(true)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])

  if (!show && !thanks) return null
  return (
    <div role="dialog" aria-label="Rate this course" className="fixed z-50 bottom-5 left-5 right-5 sm:left-auto sm:right-6 sm:w-[400px] bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,.35)] border border-[#e2e5ec] p-5">
      <button type="button" aria-label="Close" onClick={() => { setShow(false); setThanks(false) }} className="absolute top-3 right-3 p-1 rounded-lg text-[#86868b] hover:bg-gray-100"><X className="w-4 h-4" /></button>
      {thanks ? (
        <p className="text-[15px] font-medium text-gray-900 pr-6">Thank you for your review. You can change it any time on the course page.</p>
      ) : (
        <>
          <h3 className="font-heading text-[16px] font-bold text-gray-900 pr-6">{finished ? 'You finished the course. How was it?' : 'How is the course going so far?'}</h3>
          <div className="mt-3">
            <ReviewForm slug={course.slug} onDone={() => { reviewed.current = true; setShow(false); setThanks(true); setTimeout(() => setThanks(false), 5000) }} onCancel={() => setShow(false)} />
          </div>
        </>
      )}
    </div>
  )
}
