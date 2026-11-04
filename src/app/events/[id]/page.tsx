'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface Ev { hasImage?: boolean; id: string; kind: string; title: string; description: string; startsAt: string; durationMinutes: number; full: boolean }

export default function EventPage() {
  const { id } = useParams<{ id: string }>()
  const [ev, setEv] = useState<Ev | null | undefined>(undefined)
  const [f, setF] = useState({ name: '', email: '', company: '', website_hp: '' })
  const [state, setState] = useState<'idle' | 'busy' | 'done'>('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/events').then(r => r.json()).then(j => setEv((j.events as Ev[]).find(e => e.id === id) || null)).catch(() => setEv(null))
  }, [id])

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setState('busy'); setError('')
    const r = await fetch('/api/events/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, eventId: id }) })
    const j = await r.json().catch(() => ({}))
    if (!r.ok) { setError(j.error || 'Something went wrong.'); setState('idle') } else setState('done')
  }

  if (ev === undefined) return <main className="max-w-xl mx-auto p-8 text-gray-500">Loading…</main>
  if (!ev) return <main className="max-w-xl mx-auto p-8"><h1 className="text-xl font-semibold">Event not found</h1><p className="text-gray-600 mt-2">It may have ended. <a className="text-blue-600" href="/webinars">See upcoming sessions</a>.</p></main>

  const when = new Date(ev.startsAt).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Asia/Kolkata' })
  const input = 'w-full rounded-md border border-gray-300 px-3 py-2 text-sm'
  return (
    <main className="max-w-xl mx-auto p-6 sm:p-10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {ev.hasImage && <img src={`/api/events/${ev.id}/image`} alt="" className="w-full rounded-xl mb-6 border border-gray-200" />}
      <p className="text-xs uppercase tracking-widest text-gray-500">{ev.kind.replace('-', ' ')} · online on Microsoft Teams</p>
      <h1 className="text-2xl font-semibold mt-1">{ev.title}</h1>
      <p className="text-gray-600 mt-2">{when} IST · {ev.durationMinutes} minutes</p>
      <p className="mt-4 whitespace-pre-line text-gray-800">{ev.description}</p>
      <div className="mt-8 rounded-xl border border-gray-200 p-5">
        {state === 'done' ? (
          <p className="text-emerald-700">You are registered. We have emailed your Teams join link and a calendar invite to {f.email}.</p>
        ) : ev.full ? (
          <p className="text-gray-700">This event is full.</p>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <h2 className="font-medium">Register free</h2>
            <input className={input} placeholder="Full name" required value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />
            <input className={input} type="email" placeholder="Work email" required value={f.email} onChange={e => setF({ ...f, email: e.target.value })} />
            <input className={input} placeholder="Company (optional)" value={f.company} onChange={e => setF({ ...f, company: e.target.value })} />
            <input className="hidden" tabIndex={-1} autoComplete="off" value={f.website_hp} onChange={e => setF({ ...f, website_hp: e.target.value })} />
            {error && <p className="text-sm text-red-700">{error}</p>}
            <button disabled={state === 'busy'} className="w-full rounded-md bg-gray-900 text-white py-2.5 text-sm font-medium disabled:opacity-50">{state === 'busy' ? 'Registering…' : 'Register and get the Teams link'}</button>
          </form>
        )}
      </div>
    </main>
  )
}
