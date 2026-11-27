'use client'

import { useState } from 'react'
import { Check, Loader2, Send } from 'lucide-react'
import CoursePicker, { type PickerCourse } from '@/components/CoursePicker'

const field = 'w-full rounded-lg border border-gray-300 bg-raised px-3 py-2.5 text-[15px] text-gray-900 placeholder:text-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100'
const label = 'block text-sm font-medium text-gray-900 mb-1.5'

/** The request for complimentary access: who, where, up to two courses. Sent to /api/complimentary. */
export default function ComplimentaryForm({ courses }: { courses: PickerCourse[] }) {
  const [f, setF] = useState({ name: '', title: '', email: '', org: '', place: '', notes: '', website: '' })
  const [chosen, setChosen] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF((x) => ({ ...x, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('')
    if (!chosen.length) { setError('Please choose at least one course.'); return }
    setBusy(true)
    try {
      const res = await fetch('/api/complimentary', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, courses: chosen }) })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setError(data.error || 'Your request could not be sent. Please try again.'); return }
      setDone(true)
    } catch { setError('Your request could not be sent. Please check your connection and try again.') } finally { setBusy(false) }
  }

  if (done) return (
    <div className="rounded-2xl border border-gray-200 bg-raised p-6 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-green-200 bg-green-50 text-green-700"><Check className="h-6 w-6" /></span>
      <h2 className="mt-4 text-xl font-bold text-gray-900">Thank you. We have your request.</h2>
      <p className="mt-2 text-[15px] text-gray-600">Our team will reply by email, usually within one working day, with a code for each course.</p>
    </div>
  )

  return (
    <form onSubmit={submit} className="rounded-2xl border border-gray-200 bg-raised p-5 sm:p-7 grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={label} htmlFor="ca-name">Full name</label><input id="ca-name" required maxLength={120} value={f.name} onChange={set('name')} className={field} /></div>
        <div><label className={label} htmlFor="ca-title">Designation</label><input id="ca-title" maxLength={120} value={f.title} onChange={set('title')} className={field} /></div>
        <div><label className={label} htmlFor="ca-email">Work email</label><input id="ca-email" type="email" required maxLength={254} value={f.email} onChange={set('email')} className={field} /></div>
        <div><label className={label} htmlFor="ca-org">Organisation or university</label><input id="ca-org" required maxLength={160} value={f.org} onChange={set('org')} className={field} /></div>
        <div className="sm:col-span-2"><label className={label} htmlFor="ca-place">Country and city</label><input id="ca-place" maxLength={120} value={f.place} onChange={set('place')} className={field} /></div>
      </div>
      <CoursePicker courses={courses} value={chosen} onChange={setChosen} fieldClass={field} />
      <div><label className={label} htmlFor="ca-notes">Anything we should know? (optional)</label><textarea id="ca-notes" rows={3} maxLength={1500} value={f.notes} onChange={set('notes')} className={field} /></div>
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden"><label htmlFor="ca-website">Website</label><input id="ca-website" tabIndex={-1} autoComplete="off" value={f.website} onChange={set('website')} /></div>
      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-3 sm:justify-between">
        <p className="text-xs text-gray-600 max-w-sm">We use these details only to give you the access and to write to you about it.</p>
        <button type="submit" disabled={busy} className="st-pill inline-flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-60">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}Request access</button>
      </div>
    </form>
  )
}
