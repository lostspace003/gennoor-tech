'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

interface Call {
  id: string; status: 'pending' | 'approved' | 'declined'; createdAt: string; name: string; email: string; phone: string; country: string
  audience: string; teamSize: number; organization: string; userLocation: string; orgLocation: string; note: string; course: string
  whenIst: string; whenTheirs: string; teamsUrl: string
}

const BADGE: Record<Call['status'], string> = { pending: 'bg-amber-100 text-amber-800', approved: 'bg-emerald-100 text-emerald-800', declined: 'bg-gray-100 text-gray-600' }

export default function TechCallsPage() {
  const [calls, setCalls] = useState<Call[] | null>(null)
  const [filter, setFilter] = useState<'pending' | 'approved' | 'declined' | 'all'>('pending')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState('')

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
