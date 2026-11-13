'use client'

import { useEffect, useMemo, useState } from 'react'

interface Row {
  type: string; rowKey: string; createdAt: string; status: string; note: string
  name: string; email: string; phone: string; organization: string; about: string; message: string
  source: string; campaign: string; referrer: string; landing: string; page: string; hasJourney?: boolean
}

// Pages the lead viewed before sending the form, loaded when the row is opened
function Journey({ type, rowKey }: { type: string; rowKey: string }) {
  const [steps, setSteps] = useState<string[] | null>(null)
  useEffect(() => {
    fetch(`/api/admin/enquiries/journey?type=${encodeURIComponent(type)}&rowKey=${encodeURIComponent(rowKey)}`, { cache: 'no-store' })
      .then(r => r.json()).then(d => setSteps(d.steps || [])).catch(() => setSteps([]))
  }, [type, rowKey])
  if (!steps || steps.length === 0) return null
  return <p className="sm:col-span-2"><b>Journey</b> {steps.join(' → ')}</p>
}

const TYPE_LABEL: Record<string, string> = {
  ContactEnquiry: 'Contact form', CustomTraining: 'Custom training', ExpertCallBooking: 'Call booking',
  TrainingEnquiry: 'Training enquiry', CertificationEnquiry: 'Certification enquiry', WebinarRegistration: 'Webinar',
  ClaudeCoworkRegistration: 'Claude workshop', JoinApplication: 'Work with us', NewsletterSubscription: 'Newsletter',
}
const STATUSES = ['New', 'Replied', 'Closed']
const tone: Record<string, string> = { New: 'bg-amber-50 text-amber-700', Replied: 'bg-primary-50 text-primary-700', Closed: 'bg-gray-100 text-gray-500' }

export default function EnquiriesPage() {
  const [rows, setRows] = useState<Row[] | null>(null)
  const [error, setError] = useState('')
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/enquiries?days=180', { cache: 'no-store' })
      .then(async r => { const d = await r.json(); if (!r.ok) throw new Error(d.error || 'Could not load'); setRows(d.rows) })
      .catch(e => setError(e.message))
  }, [])

  const update = async (r: Row, patch: { status?: string; note?: string }) => {
    setRows(rs => rs && rs.map(x => (x.rowKey === r.rowKey && x.type === r.type ? { ...x, ...patch } : x)))
    await fetch('/api/admin/enquiries', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: r.type, rowKey: r.rowKey, ...patch }) })
  }

  const shown = useMemo(() => (rows || []).filter(r =>
    (!type || r.type === type) && (!status || r.status === status) &&
    (!q || `${r.name} ${r.email} ${r.organization} ${r.about} ${r.message} ${r.source} ${r.page}`.toLowerCase().includes(q.toLowerCase()))), [rows, type, status, q])
  const types = useMemo(() => Array.from(new Set((rows || []).map(r => r.type))), [rows])
  const bySource = useMemo(() => {
    const m = new Map<string, number>()
    for (const r of rows || []) { const k = r.source || r.referrer || 'direct'; m.set(k, (m.get(k) || 0) + 1) }
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6)
  }, [rows])

  if (error) return <p className="p-6 text-[14px] text-red-600">{error}</p>
  if (!rows) return <p className="p-6 text-[14px] text-gray-500">Loading…</p>

  return (
    <div className="p-4 sm:p-6 max-w-[1200px]">
      <div className="flex flex-wrap items-center gap-2.5 mb-4">
        <select value={type} onChange={e => setType(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-[13px] bg-raised">
          <option value="">All forms</option>
          {types.map(t => <option key={t} value={t}>{TYPE_LABEL[t] || t}</option>)}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-[13px] bg-raised">
          <option value="">Any status</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, email, page…" className="border border-gray-300 rounded-lg px-3 py-2 text-[13px] bg-raised w-[240px]" />
        <span className="text-[13px] text-gray-500 ml-auto">{shown.length} of {rows.length} · last 180 days</span>
      </div>

      {bySource.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5 text-[12.5px]">
          <span className="text-gray-500 mr-1">Where they came from:</span>
          {bySource.map(([k, n]) => <span key={k} className="px-2.5 py-1 rounded-full bg-gray-50 text-gray-700">{k} <b className="tabular-nums">{n}</b></span>)}
        </div>
      )}

      <div className="bg-raised border border-gray-200 rounded-xl overflow-hidden">
        {shown.length === 0 && <p className="p-6 text-[14px] text-gray-500">No enquiries yet.</p>}
        {shown.map(r => {
          const id = `${r.type}:${r.rowKey}`
          const isOpen = open === id
          return (
            <div key={id} className="border-b border-gray-100 last:border-0">
              <button type="button" onClick={() => setOpen(isOpen ? null : id)} className="w-full text-left px-4 py-3 grid grid-cols-[110px_1fr_auto] sm:grid-cols-[110px_180px_1fr_150px_auto] gap-3 items-center hover:bg-gray-50">
                <span className="text-[12px] text-gray-500 tabular-nums">{new Date(r.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} {new Date(r.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="text-[13.5px] font-medium text-gray-900 truncate">{r.name || r.email}</span>
                <span className="hidden sm:block text-[13px] text-gray-700 truncate">{TYPE_LABEL[r.type] || r.type}{r.about ? ` · ${r.about}` : ''}</span>
                <span className="hidden sm:block text-[12.5px] text-gray-500 truncate">{r.source || r.referrer || 'direct'}</span>
                <span className={`text-[11.5px] font-semibold px-2 py-0.5 rounded-full ${tone[r.status] || tone.New}`}>{r.status}</span>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 grid sm:grid-cols-2 gap-x-8 gap-y-2 text-[13px] text-gray-700">
                  <p><b>Email</b> <a className="text-primary-600" href={`mailto:${r.email}`}>{r.email}</a>{r.phone ? ` · ${r.phone}` : ''}</p>
                  <p><b>Organization</b> {r.organization || '–'}</p>
                  <p className="sm:col-span-2 whitespace-pre-wrap"><b>Message</b> {r.message || '–'}</p>
                  <p><b>Came from</b> {r.source || r.referrer || 'direct'}{r.campaign ? ` · ${r.campaign}` : ''}</p>
                  <p><b>Landed on</b> {r.landing || '–'} · <b>Sent from</b> {r.page || '–'}</p>
                  {r.hasJourney && <Journey type={r.type} rowKey={r.rowKey} />}
                  <div className="sm:col-span-2 flex flex-wrap items-center gap-2 mt-1">
                    {STATUSES.map(s => (
                      <button key={s} type="button" onClick={() => update(r, { status: s })} className={`px-3 py-1 rounded-full border text-[12.5px] ${r.status === s ? 'bg-primary-600 border-primary-600 text-white' : 'border-gray-300 hover:border-gray-400'}`}>{s}</button>
                    ))}
                    <input defaultValue={r.note} onBlur={e => e.target.value !== r.note && update(r, { note: e.target.value })} placeholder="Note" className="flex-1 min-w-[200px] border border-gray-300 rounded-lg px-3 py-1.5 text-[13px]" />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
