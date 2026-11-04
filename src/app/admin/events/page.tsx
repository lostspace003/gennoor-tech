'use client'

import { useCallback, useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import InfoTip from '@/components/admin/InfoTip'

interface Kind { id: string; label: string; hint: string }
interface Ev {
  id: string; kind: string; title: string; description: string; startsAt: string; durationMinutes: number; capacity?: number
  teamsJoinUrl?: string; linkedinEventId?: string; hasImage?: boolean; cancelled?: boolean; url: string; registrations: { name: string; email: string; company?: string; at: string }[]
}

const field = 'w-full rounded-md border border-gray-200 px-3 py-2 text-sm'
const btn = 'px-3 py-1.5 text-[13px] rounded-md border border-gray-200 bg-white disabled:opacity-40 hover:border-gray-400 whitespace-nowrap'

export default function EventsPage() {
  const [events, setEvents] = useState<Ev[] | null>(null)
  const [kinds, setKinds] = useState<Kind[]>([])
  const [graph, setGraph] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState('')
  const [open, setOpen] = useState('')
  const [at, setAt] = useState('')
  const [cover, setCover] = useState<File | null>(null)
  async function uploadCover(id: string, file: File) {
    const fd = new FormData(); fd.append('id', id); fd.append('file', file)
    const r = await fetch('/api/admin/events/image', { method: 'POST', body: fd })
    const j = await r.json().catch(() => ({}))
    if (!r.ok) { setError(j.error || 'Image upload failed.'); return false }
    return true
  }
  const when = () => (at ? { at: new Date(at).toISOString() } : {})
  const [f, setF] = useState({ kind: 'webinar', idea: '', title: '', description: '', startsAt: '', durationMinutes: 60, capacity: '' })

  const load = useCallback(async () => {
    const r = await fetch('/api/admin/events').catch(() => null)
    if (!r?.ok) { setError(`Could not load (${r?.status ?? 'offline'})`); return }
    const j = await r.json()
    setEvents(j.events); setKinds(j.kinds); setGraph(j.graph)
  }, [])
  useEffect(() => { load() }, [load])

  async function call(action: string, extra: Record<string, unknown> = {}, label = action) {
    setBusy(label); setError(''); setNotice('')
    const r = await fetch('/api/admin/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, ...extra }) })
    const j = await r.json().catch(() => ({}))
    setBusy('')
    if (!r.ok) { setError(j.error || 'Failed'); return null }
    return j
  }

  async function draft() {
    const j = await call('draft', { idea: f.idea, kind: f.kind })
    if (j) setF({ ...f, title: j.title, description: j.description })
  }
  async function create() {
    const j = await call('create', { ...f, startsAt: f.startsAt ? new Date(f.startsAt).toISOString() : '', capacity: f.capacity ? Number(f.capacity) : undefined })
    if (j && cover) { const ok = await uploadCover(j.event.id, cover); if (!ok) setNotice('Event created, but the cover image did not upload. Add it from Details.') }
    if (j) { setCover(null); if (!cover) setNotice(j.note || 'Event created with a Teams link. Publish it to LinkedIn next.'); setF({ ...f, idea: '', title: '', description: '' }); load() }
  }

  return (
    <div className="max-w-3xl p-4">
      <h1 className="text-xl font-semibold tracking-tight mb-3">Events<InfoTip text="Create a webinar or workshop with a Microsoft Teams link. Visitors register on a public page and get the link by email. Then publish it as a LinkedIn Event and announce it." /></h1>
      {error && <div className="mb-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm px-3 py-2">{error}</div>}
      {notice && <div className="mb-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-3 py-2">{notice}</div>}
      {!graph && <div className="mb-3 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-sm px-3 py-2">Microsoft Graph is not configured, so Teams links cannot be created.</div>}

      <div className="rounded-lg border border-gray-200 bg-white p-3 mb-4 space-y-2">
        <div className="font-medium text-sm">New event</div>
        <div className="flex flex-wrap gap-2">
          {kinds.map(k => (
            <button key={k.id} type="button" title={k.hint} onClick={() => setF({ ...f, kind: k.id })}
              className={`px-3 py-1.5 text-[13px] rounded-md border ${f.kind === k.id ? 'bg-gray-800 text-white border-gray-800' : 'bg-white border-gray-200'}`}>{k.label}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <input className={field} placeholder="Describe the event in a line, e.g. hands-on Copilot Studio agents for HR teams" value={f.idea} onChange={e => setF({ ...f, idea: e.target.value })} />
          <button disabled={!!busy || !f.idea} onClick={draft} className={btn}>{busy === 'draft' ? '…' : 'Agent: write it'}</button>
        </div>
        <input className={field} placeholder="Title" value={f.title} onChange={e => setF({ ...f, title: e.target.value })} />
        <textarea className={field} rows={5} placeholder="Description" value={f.description} onChange={e => setF({ ...f, description: e.target.value })} />
        <div className="flex flex-wrap gap-2">
          <input type="datetime-local" className={`${field} !w-auto`} value={f.startsAt} onChange={e => setF({ ...f, startsAt: e.target.value })} />
          <input type="number" min={15} className={`${field} !w-28`} value={f.durationMinutes} onChange={e => setF({ ...f, durationMinutes: Number(e.target.value) })} title="Minutes" />
          <input type="number" min={1} className={`${field} !w-32`} placeholder="Seats (optional)" value={f.capacity} onChange={e => setF({ ...f, capacity: e.target.value })} />
        </div>
        <label className={`${btn} cursor-pointer inline-block`}>{cover ? `Cover image: ${cover.name}` : 'Add your own cover image (optional)'}<input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={e => setCover(e.target.files?.[0] || null)} /></label>
        <button disabled={!!busy || !f.title || !f.startsAt} onClick={create} className="px-3.5 py-2 text-[13px] font-medium bg-gray-800 text-white rounded-md disabled:opacity-40">{busy === 'create' ? 'Creating…' : 'Create event + Teams link'}</button>
      </div>

      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-gray-600">Schedule the LinkedIn buttons for<input type="datetime-local" className={`${field} !w-auto`} value={at} onChange={e => setAt(e.target.value)} />{at && <button className="underline" onClick={() => setAt('')}>post now instead</button>}</div>
      {!events ? <Loader2 className="w-5 h-5 animate-spin text-gray-400" /> : (
        <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
          {events.length === 0 && <li className="px-3 py-4 text-sm text-gray-500">No events yet.</li>}
          {events.map(e => (
            <li key={e.id} className="px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium truncate">{e.title}{e.cancelled && <span className="ml-2 text-red-700">cancelled</span>}</div>
                  <div className="text-xs text-gray-500">{new Date(e.startsAt).toLocaleString()} · {e.kind} · {e.registrations.length}{e.capacity ? `/${e.capacity}` : ''} registered{e.teamsJoinUrl ? ' · Teams link ✓' : ''}{e.hasImage ? ' · image ✓' : ''}{e.linkedinEventId ? ' · on LinkedIn ✓' : ''}</div>
                </div>
                <button className={btn} disabled={!!busy || !!e.linkedinEventId || e.cancelled} onClick={async () => { if (await call('linkedin', { id: e.id, ...when() }, `li-${e.id}`)) { setNotice(at ? 'Scheduled. It goes out at that time.' : 'Published as a LinkedIn Event.'); load() } }}>{busy === `li-${e.id}` ? '…' : 'LinkedIn event'}</button>
                <button className={btn} disabled={!!busy || e.cancelled} onClick={async () => { const j = await call('announce', { id: e.id, as: 'organization', ...when() }, `an-${e.id}`); if (j) setNotice(at ? 'Announcement scheduled.' : 'Announcement posted to the page.') }}>{busy === `an-${e.id}` ? '…' : 'Announce'}</button>
                <button className={btn} onClick={() => setOpen(open === e.id ? '' : e.id)}>{open === e.id ? 'Hide' : 'Details'}</button>
              </div>
              {open === e.id && (
                <div className="mt-2 text-xs space-y-1 text-gray-700">
                  <div>Registration page: <a className="text-blue-600" href={e.url} target="_blank" rel="noreferrer">{e.url}</a></div>
                  {e.teamsJoinUrl && <div>Teams link: <a className="text-blue-600" href={e.teamsJoinUrl} target="_blank" rel="noreferrer">open</a></div>}
                  <div className="max-h-40 overflow-auto">{e.registrations.map(r => <div key={r.email}>{r.name} · {r.email}{r.company ? ` · ${r.company}` : ''}</div>)}</div>
                  <div className="flex gap-2 pt-1">
                    <label className={`${btn} cursor-pointer`}>{e.hasImage ? 'Replace image' : 'Upload image'}<input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={async ev => { const f2 = ev.target.files?.[0]; ev.target.value = ''; if (f2 && await uploadCover(e.id, f2)) { setNotice('Cover image saved. It is used on the registration page and in LinkedIn posts you publish from now on.'); load() } }} /></label>
                    {!e.cancelled && <button className={btn} onClick={async () => { if (await call('cancel', { id: e.id })) load() }}>Cancel event</button>}
                    <button className={btn} onClick={async () => { if (confirm('Delete this event and its registrations?') && await call('delete', { id: e.id })) load() }}>Delete</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
