'use client'

import { useState } from 'react'
import { BookOpen, Check, Clock, GraduationCap, Loader2, Send, Users } from 'lucide-react'
import { TIER_LINE } from '@/components/ClaudePartner'
import { UNI_AREAS, UNI_WALKTHROUGH } from '@/lib/crm/universities-types'
import CoursePicker, { type PickerCourse } from '@/components/CoursePicker'

export interface EvaluatePrefill { key: string; institution: string; place: string; department: string }

type Rep = { name: string; title: string; email: string }
const emptyRep: Rep = { name: '', title: '', email: '' }

/** A course's label in the colour of its family, as in the email: certification blue, projects violet, every role green. */
const TILE: Record<string, string> = {
  'Certification Prep': 'border-primary-200 bg-primary-50 text-primary-700',
  Project: 'border-violet-200 bg-violet-50 text-violet-700',
  'Use Case': 'border-green-200 bg-green-50 text-green-700',
}

const field ='w-full rounded-lg border border-gray-300 bg-raised px-3 py-2.5 text-[15px] text-gray-900 placeholder:text-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100'
const label = 'block text-sm font-medium text-gray-900 mb-1.5'

/** The university evaluation form: the page a university's own link opens. Its answer goes to /api/universities/evaluate. */
export default function EvaluateForm({ prefill, courses }: { prefill: EvaluatePrefill | null; courses: PickerCourse[] }) {
  const [institution, setInstitution] = useState(prefill?.institution || '')
  const [place, setPlace] = useState(prefill?.place || '')
  const [department, setDepartment] = useState(prefill?.department || '')
  const [reps, setReps] = useState<Rep[]>([{ ...emptyRep }, { ...emptyRep }])
  const [courses_, setCourses] = useState<string[]>([])
  const [areas, setAreas] = useState<string[]>([])
  const [walkthrough, setWalkthrough] = useState('')
  const [notes, setNotes] = useState('')
  const [website, setWebsite] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState<string[] | null>(null)

  const setRep = (i: number, k: keyof Rep, v: string) => setReps((rs) => rs.map((r, j) => (j === i ? { ...r, [k]: v } : r)))
  const toggle = (list: string[], set: (v: string[]) => void, id: string) => set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!courses_.length) { setError('Please choose at least one course.'); return }
    setBusy(true)
    try {
      const res = await fetch('/api/universities/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: prefill?.key || '', institution, place, department, reps, courses: courses_, areas, walkthrough, notes, website }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setError(data.error || 'Your answer could not be sent. Please try again.'); return }
      setDone(courses_)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setError('Your answer could not be sent. Please check your connection and try again.')
    } finally { setBusy(false) }
  }

  return (
    <div className="min-h-screen bg-surface text-gray-900">
      <div className="mx-auto max-w-[1080px] px-4 sm:px-6 py-6 lg:py-10">
        <a href="https://gennoor.com" className="block overflow-hidden rounded-2xl border border-gray-200 bg-raised">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/email/header.gif" alt="Gennoor Tech: Train. Innovate. Build." width={1200} height={256} className="block w-full h-auto" />
        </a>

        <div className="mt-6 lg:mt-8 grid gap-6 lg:gap-8 lg:grid-cols-[340px_1fr] items-start">
          <aside className="lg:sticky lg:top-8">
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-primary-600">Gennoor Learning Studio</p>
            <h1 className="mt-2 text-[26px] sm:text-[30px] leading-tight font-bold text-gray-900">Complimentary course evaluation for universities</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-gray-600">
              Before any partnership conversation, your faculty can judge our training for themselves. Choose the courses you would like to review and we will give full access.
            </p>
            <ul className="mt-5 space-y-3.5">
              {[
                { icon: BookOpen, title: 'Full access to the courses you choose', body: 'From the Certifications & Projects section of the Learning Studio.' },
                { icon: Users, title: 'For up to two representatives', body: 'Faculty or academic staff of your institution.' },
                { icon: Clock, title: 'Sign-in details within 24 hours', body: 'Sent by email to the address you give.' },
                { icon: GraduationCap, title: 'Microsoft Certified and Claude-certified trainers', body: 'The team behind every course in the Learning Studio.' },
              ].map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary-100 bg-primary-50 text-primary-600"><Icon className="h-[18px] w-[18px]" /></span>
                  <span><span className="block text-sm font-semibold text-gray-900">{title}</span><span className="block text-sm text-gray-600">{body}</span></span>
                </li>
              ))}
            </ul>
            <div className="mt-6 inline-flex flex-wrap items-center gap-3"><span className="shrink-0 rounded-[12px] bg-[#f0eee6] leading-[0]">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/cpn/cpn-certified-horizontal.svg" width={132} alt="Claude Partner Network - Certified" className="h-auto" /></span><span className="max-w-[210px] text-[13.5px] font-medium leading-[1.4] text-gray-600">{TIER_LINE}</span></div>
          </aside>

          <main className="rounded-2xl border border-gray-200 bg-raised p-5 sm:p-7">
            {done ? (
              <div className="py-6 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-green-200 bg-green-50 text-green-700"><Check className="h-6 w-6" /></span>
                <h2 className="mt-4 text-xl font-bold text-gray-900">Thank you. We have your request.</h2>
                <p className="mt-2 text-[15px] text-gray-600 max-w-md mx-auto">Your access codes are on their way to your email, one for each course, with how to use them.</p>
                <ul className="mt-5 inline-block text-left space-y-2">
                  {done.map((id) => <li key={id} className="flex gap-2 text-sm text-gray-900"><Check className="h-4 w-4 mt-0.5 shrink-0 text-green-700" />{courses.find((c) => c.slug === id)?.title || id}</li>)}
                </ul>
                <p className="mt-6 text-sm text-gray-600">In the meantime, the course previews are at <a href="https://gennoor.com/studio" className="font-medium text-primary-600 hover:underline">gennoor.com/studio</a>. Questions: <a href="mailto:admin@gennoor.com" className="font-medium text-primary-600 hover:underline">admin@gennoor.com</a></p>
              </div>
            ) : (
              <form onSubmit={submit} noValidate={false}>
                <Section n={1} title="Your institution" hint={prefill ? 'We have filled in what we know. Please correct anything that is wrong.' : undefined}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2"><label className={label} htmlFor="institution">University or college</label><input id="institution" required maxLength={160} value={institution} onChange={(e) => setInstitution(e.target.value)} className={field} /></div>
                    <div><label className={label} htmlFor="place">Country and city</label><input id="place" required maxLength={120} value={place} onChange={(e) => setPlace(e.target.value)} className={field} /></div>
                    <div><label className={label} htmlFor="department">Department, school or center</label><input id="department" required maxLength={160} value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g. Computer Science" className={field} /></div>
                  </div>
                </Section>

                <Section n={2} title="Who should get access" hint="Access is for up to two representatives. We send the sign-in details to their official email.">
                  {reps.map((r, i) => (
                    <fieldset key={i} className={i ? 'mt-5 pt-5 border-t border-gray-200' : ''}>
                      <legend className="mb-3 text-sm font-semibold text-gray-900">{i ? 'Second representative (optional)' : 'Representative'}</legend>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div><label className={label} htmlFor={`rep${i}-name`}>Full name</label><input id={`rep${i}-name`} required={!i} maxLength={120} value={r.name} onChange={(e) => setRep(i, 'name', e.target.value)} className={field} /></div>
                        <div><label className={label} htmlFor={`rep${i}-title`}>Designation</label><input id={`rep${i}-title`} required={!i} maxLength={120} value={r.title} onChange={(e) => setRep(i, 'title', e.target.value)} placeholder="e.g. Associate Professor" className={field} /></div>
                        <div className="sm:col-span-2"><label className={label} htmlFor={`rep${i}-email`}>Official institutional email</label><input id={`rep${i}-email`} type="email" required={!i} maxLength={254} value={r.email} onChange={(e) => setRep(i, 'email', e.target.value)} className={field} /></div>
                      </div>
                    </fieldset>
                  ))}
                </Section>

                <Section n={3} title="Choose up to two courses" hint="Each gives full access, not a preview. Open a course to look at it first.">
                  <CoursePicker courses={courses} value={courses_} onChange={setCourses} fieldClass={field} />
                </Section>

                <Section n={4} title="What else interests your university" hint="Optional. It helps us prepare the conversation.">
                  <div className="space-y-2">
                    {UNI_AREAS.map((a) => (
                      <label key={a.id} className="flex cursor-pointer items-start gap-3 rounded-lg px-1 py-1.5 text-sm text-gray-900">
                        <input type="checkbox" checked={areas.includes(a.id)} onChange={() => toggle(areas, setAreas, a.id)} className="mt-0.5 h-4 w-4 shrink-0 accent-primary-600" />{a.label}
                      </label>
                    ))}
                  </div>
                  <p className="mt-5 mb-2 text-sm font-semibold text-gray-900">After reviewing, would you like a short walkthrough?</p>
                  <div className="space-y-2">
                    {UNI_WALKTHROUGH.map((w) => (
                      <label key={w.id} className="flex cursor-pointer items-start gap-3 rounded-lg px-1 py-1.5 text-sm text-gray-900">
                        <input type="radio" name="walkthrough" checked={walkthrough === w.id} onChange={() => setWalkthrough(w.id)} className="mt-0.5 h-4 w-4 shrink-0 accent-primary-600" />{w.label}
                      </label>
                    ))}
                  </div>
                  <label className={`${label} mt-5`} htmlFor="notes">Anything we should know? (optional)</label>
                  <textarea id="notes" rows={4} maxLength={2000} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="For example, the size of the cohort or the dates that suit you." className={field} />
                </Section>

                {/* A field people do not see: a machine that fills every field fills this one too */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label htmlFor="website">Website</label><input id="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                </div>

                {error && <p role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
                <div className="mt-6 flex flex-col-reverse sm:flex-row sm:items-center gap-3 sm:justify-between">
                  <p className="text-xs text-gray-600 max-w-sm">We use these details only to set up the access and to write to you about it.</p>
                  <button type="submit" disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-[15px] font-semibold text-white hover:bg-primary-500 disabled:opacity-60">
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}Request access
                  </button>
                </div>
              </form>
            )}
          </main>
        </div>

        <footer className="mt-8 pb-4 text-center text-xs text-gray-600">
          Gennoor Tech Private Limited · Mumbai, India · <a href="mailto:admin@gennoor.com" className="hover:underline">admin@gennoor.com</a> · <a href="https://gennoor.com" className="hover:underline">gennoor.com</a>
        </footer>
      </div>
    </div>
  )
}

function Section({ n, title, hint, children }: { n: number; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className={n > 1 ? 'mt-8 pt-7 border-t border-gray-200' : ''}>
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary-100 bg-primary-50 text-sm font-bold text-primary-600">{n}</span>
        <div>
          <h2 className="text-[17px] font-semibold leading-tight text-gray-900">{title}</h2>
          {hint && <p className="mt-1 text-sm text-gray-600">{hint}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}
