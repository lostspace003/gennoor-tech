'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

interface Call {
  id: string; status: 'pending' | 'approved' | 'declined'; createdAt: string; name: string; email: string; phone: string; country: string
  audience: string; teamSize: number; organization: string; userLocation: string; orgLocation: string; note: string; course: string
  whenIst: string; whenTheirs: string; teamsUrl: string
  proposalStatus: '' | 'awaiting' | 'accepted' | 'declined'; proposalMessage: string; proposedIst: string; proposedTheirs: string
}

interface Day { date: string; slots: { time: string; open: boolean }[] }

const BADGE: Record<Call['status'], string> = { pending: 'bg-amber-100 text-amber-800', approved: 'bg-emerald-100 text-emerald-800', declined: 'bg-gray-100 text-gray-600' }

export default function TechCallsPage() {
  const [calls, setCalls] = useState<Call[] | null>(null)
  const [filter, setFilter] = useState<'pending' | 'approved' | 'declined' | 'all'>('pending')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState('')
  const [days, setDays] = useState<Day[]>([])
  const [askId, setAskId] = useState('')
  const [pDate, setPDate] = useState('')
  const [pTime, setPTime] = useState('')
  const [pMsg, setPMsg] = useState('')

  const load = useCallback(async () => {
    const r = await fetch('/api/admin/tech-calls')
    if (!r.ok) { setError(`Could not load (${r.status})`); return }
    setCalls((await r.json()).calls)
  }, [])
  useEffect(() => { load() }, [load])

  const act = async (id: string, action: 'approve' | 'decline') => {
    if (action === 'decline' && !window.confirm('Decline this request? The visitor is emailed.')) return
    setBusy(id); setError('')
    const r = await fetch('/api/admin/tech-calls', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action }) })
    setBusy('')
    if (!r.ok) setError((await r.json().catch(() => ({}))).error || 'Action failed')
    await load()
  }

  const openAsk = async (id: string) => {
    setAskId(id); setPDate(''); setPTime(''); setPMsg(''); setError('')
    const r = await fetch('/api/tech-call/slots')
    if (r.ok) setDays((await r.json()).days)
  }

  const sendAsk = async (id: string) => {
    setBusy(id); setError('')
    const r = await fetch('/api/admin/tech-calls', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action: 'propose', date: pDate, time: pTime, message: pMsg }) })
    setBusy('')
    if (!r.ok) { setError((await r.json().catch(() => ({}))).error || 'Could not send'); return }
    setAskId('')
    await load()
  }

  const shown = (calls || []).filter(c => filter === 'all' || c.status === filter)

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin" className="text-sm text-primary-600">‹ Admin</Link>
          <h1 className="font-heading text-2xl font-bold text-gray-900 mt-1">Tech calls</h1>
          <p className="text-sm text-gray-500">Approving a request creates the Microsoft Teams meeting from admin@gennoor.com and emails the confirmation.</p>
        </div>
      </div>
      <div className="flex gap-1 bg-white rounded-xl p-1 mb-5 border border-gray-200 w-fit">
        {(['pending', 'approved', 'declined', 'all'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 text-sm rounded-lg capitalize ${filter === f ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
            {f}{calls ? ` (${f === 'all' ? calls.length : calls.filter(c => c.status === f).length})` : ''}
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-red-600 mb-4" role="alert">{error}</p>}
      {!calls ? <Loader2 className="w-6 h-6 animate-spin text-primary-600" /> : shown.length === 0 ? (
        <p className="text-gray-500 py-10 text-center">Nothing here.</p>
      ) : (
        <ul className="space-y-4">
          {shown.map(c => (
            <li key={c.id} className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-gray-900">{c.name}</h2>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${BADGE[c.status]}`}>{c.status}</span>
                  </div>
                  <p className="text-sm text-gray-600">{c.organization} · {c.audience === 'Team' ? `Team of ${c.teamSize}` : 'Individual'} · {c.country}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-medium text-gray-900">{c.whenIst}</p>
                  <p className="text-gray-500">Their time: {c.whenTheirs}</p>
                </div>
              </div>
              <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm mt-3 text-gray-700">
                <div><dt className="inline text-gray-500">Email: </dt><dd className="inline">{c.email} (verified)</dd></div>
                <div><dt className="inline text-gray-500">Phone: </dt><dd className="inline">{c.phone}</dd></div>
                <div><dt className="inline text-gray-500">User location: </dt><dd className="inline">{c.userLocation || 'N/A'}</dd></div>
                <div><dt className="inline text-gray-500">Organization location: </dt><dd className="inline">{c.orgLocation || 'N/A'}</dd></div>
                <div className="sm:col-span-2"><dt className="inline text-gray-500">Course: </dt><dd className="inline">{c.course || 'General'}</dd></div>
                <div className="sm:col-span-2"><dt className="inline text-gray-500">Looking for: </dt><dd className="inline">{c.note}</dd></div>
              </dl>
              {c.status === 'approved' && c.teamsUrl && <a href={c.teamsUrl} target="_blank" rel="noopener" className="inline-block mt-3 text-sm text-primary-600">Teams meeting link ›</a>}
              {c.proposalStatus && (
                <p className={`mt-3 text-sm rounded-lg px-3 py-2 ${c.proposalStatus === 'awaiting' ? 'bg-amber-50 text-amber-800' : c.proposalStatus === 'accepted' ? 'bg-emerald-50 text-emerald-800' : 'bg-gray-100 text-gray-700'}`}>
                  {c.proposalStatus === 'awaiting' && `Waiting for the visitor to answer: ${c.proposedIst} (their time ${c.proposedTheirs})`}
                  {c.proposalStatus === 'accepted' && 'The visitor confirmed the new time. The updated invite was sent automatically.'}
                  {c.proposalStatus === 'declined' && `The visitor said no to ${c.proposedIst}. The time above is unchanged.`}
                </p>
              )}
              {(c.status === 'pending' || c.status === 'approved') && askId !== c.id && (
                <button onClick={() => openAsk(c.id)} className="mt-3 text-sm text-primary-600 hover:underline">Ask the visitor for a different time</button>
              )}
              {askId === c.id && (
                <div className="mt-4 border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-3">
                  <p className="text-sm font-medium text-gray-900">Suggest a new date and time (IST, only open slots are listed)</p>
                  <div className="flex flex-wrap gap-3">
                    <select value={pDate} onChange={e => { setPDate(e.target.value); setPTime('') }} className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white" aria-label="New date">
                      <option value="">Date</option>
                      {days.filter(d => d.slots.some(s => s.open)).map(d => <option key={d.date} value={d.date}>{d.date}</option>)}
                    </select>
                    <select value={pTime} onChange={e => setPTime(e.target.value)} disabled={!pDate} className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white" aria-label="New time">
                      <option value="">Time</option>
                      {days.find(d => d.date === pDate)?.slots.filter(s => s.open).map(s => <option key={s.time} value={s.time}>{s.time} IST</option>)}
                    </select>
                  </div>
                  <textarea value={pMsg} onChange={e => setPMsg(e.target.value)} maxLength={1000} rows={3} placeholder="Short message for the visitor (optional)" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white" />
                  <div className="flex gap-3">
                    <button disabled={!pDate || !pTime || busy === c.id} onClick={() => sendAsk(c.id)} className="px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-50">{busy === c.id ? 'Sending…' : 'Send to visitor'}</button>
                    <button onClick={() => setAskId('')} className="px-4 py-2 rounded-xl border border-gray-300 text-sm text-gray-700 hover:bg-white">Cancel</button>
                  </div>
                  <p className="text-xs text-gray-500">The visitor gets Yes / No buttons. If they say yes, the Teams invite is created or updated and sent automatically. You do not need to confirm it.</p>
                </div>
              )}
              {c.status === 'pending' && (
                <div className="flex gap-3 mt-4">
                  <button disabled={busy === c.id} onClick={() => act(c.id, 'approve')} className="px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-50">
                    {busy === c.id ? 'Working…' : 'Approve and send Teams invite'}
                  </button>
                  <button disabled={busy === c.id} onClick={() => act(c.id, 'decline')} className="px-4 py-2 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Decline</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
