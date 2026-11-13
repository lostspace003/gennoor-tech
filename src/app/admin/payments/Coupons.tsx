'use client'

import { useCallback, useEffect, useState } from 'react'
import { Check, Copy, Loader2, Plus, Trash2 } from 'lucide-react'

interface Coupon { code: string; percent: number; slug: string; expiresAt: string; maxUses: number; uses: number; active: boolean; note: string; createdAt: string }
interface CourseOption { slug: string; title: string }

const btn = 'inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-md border border-gray-200 bg-raised hover:border-gray-400 disabled:opacity-40'
const primary = 'inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium bg-gray-800 text-white rounded-md hover:bg-gray-900 disabled:opacity-40'
const field = 'text-sm border border-gray-200 rounded-md px-2.5 py-2 bg-raised'
const chip = (on: boolean) => `px-3 py-1.5 text-[13px] rounded-full border ${on ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-200 text-gray-700 bg-raised hover:bg-gray-50'}`

const DISCOUNTS = [[100, 'Free (100% off)'], [80, '80% off'], [50, '50% off'], [20, '20% off']] as const
const PERIODS = [['24', '24 hours'], ['72', '3 days'], ['168', '7 days'], ['720', '30 days'], ['2160', '90 days'], ['never', 'No end date'], ['pick', 'Pick a date and time']] as const

const when = (iso: string) => new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })

function status(c: Coupon): { label: string; tone: string } {
  if (!c.active) return { label: 'Switched off', tone: 'bg-gray-100 text-gray-600' }
  if (c.expiresAt && Date.parse(c.expiresAt) <= Date.now()) return { label: 'Expired', tone: 'bg-red-50 text-red-700' }
  if (c.maxUses > 0 && c.uses >= c.maxUses) return { label: 'Used up', tone: 'bg-amber-50 text-amber-800' }
  return { label: 'Working', tone: 'bg-emerald-50 text-emerald-700' }
}

/** Coupon codes: make one, see how often each was used, switch one off. */
export default function Coupons({ courses }: { courses: CourseOption[] }) {
  const [coupons, setCoupons] = useState<Coupon[] | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState('')
  const [copied, setCopied] = useState('')

  const [percent, setPercent] = useState('100')
  const [other, setOther] = useState(false)
  const [period, setPeriod] = useState<string>('168')
  const [until, setUntil] = useState('')
  const [maxUses, setMaxUses] = useState('')
  const [slug, setSlug] = useState('')
  const [code, setCode] = useState('')
  const [note, setNote] = useState('')

  const call = useCallback(async (method: string, body?: unknown) => {
    const r = await fetch('/api/admin/coupons', { method, ...(body ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}) }).catch(() => null)
    const j = r ? await r.json().catch(() => ({})) : {}
    if (!r?.ok) { setError(j.error || `Could not reach the server (${r?.status ?? 'offline'})`); return null }
    setCoupons(j.coupons)
    return j
  }, [])
  useEffect(() => { call('GET') }, [call])

  async function create(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setNotice('')
    let expiresAt = ''
    if (period === 'pick') {
      if (!until) { setError('Pick the date and time the code stops working.'); return }
      expiresAt = new Date(until).toISOString()
    } else if (period !== 'never') {
      expiresAt = new Date(Date.now() + Number(period) * 3_600_000).toISOString()
    }
    setBusy('create')
    const j = await call('POST', { code, percent, expiresAt, maxUses, slug, note })
    setBusy('')
    if (!j) return
    setNotice(`Code ${j.code} is ready to share.`)
    setCode(''); setNote('')
  }

  async function change(method: 'PATCH' | 'DELETE', body: { code: string; active?: boolean }) {
    setError(''); setNotice(''); setBusy(body.code)
    await call(method, body)
    setBusy('')
  }

  const copy = (c: string) => navigator.clipboard?.writeText(c).then(() => { setCopied(c); setTimeout(() => setCopied(''), 1500) }).catch(() => {})
  const title = (s: string) => courses.find((c) => c.slug === s)?.title || s

  return (
    <>
      {error && <div className="mb-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm px-3 py-2">{error}</div>}
      {notice && <div className="mb-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-3 py-2">{notice}</div>}

      <form onSubmit={create} className="rounded-xl border border-gray-200 bg-raised p-4 mb-4 space-y-4">
        <div className="text-sm font-semibold text-gray-900">Make a coupon code</div>

        <div>
          <div className="text-xs text-gray-500 mb-1.5">What the code gives</div>
          <div className="flex flex-wrap items-center gap-1.5">
            {DISCOUNTS.map(([p, label]) => (
              <button type="button" key={p} onClick={() => { setPercent(String(p)); setOther(false) }} className={chip(!other && percent === String(p))}>{label}</button>
            ))}
            <button type="button" onClick={() => setOther(true)} className={chip(other)}>Other</button>
            {other && <label className="text-sm text-gray-600"><input value={percent} onChange={(e) => setPercent(e.target.value)} inputMode="numeric" aria-label="Percent off" className={`${field} w-20 mr-1`} />% off</label>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <label className="block">
            <span className="block text-xs text-gray-500 mb-1.5">Works for</span>
            <select value={period} onChange={(e) => setPeriod(e.target.value)} className={`${field} w-full`}>
              {PERIODS.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
            </select>
            {period === 'pick' && <input type="datetime-local" value={until} onChange={(e) => setUntil(e.target.value)} aria-label="Stops working at" className={`${field} w-full mt-1.5`} />}
          </label>
          <label className="block">
            <span className="block text-xs text-gray-500 mb-1.5">How many people can use it</span>
            <input value={maxUses} onChange={(e) => setMaxUses(e.target.value.replace(/\D/g, ''))} inputMode="numeric" placeholder="No limit" className={`${field} w-full`} />
          </label>
          <label className="block">
            <span className="block text-xs text-gray-500 mb-1.5">Course</span>
            <select value={slug} onChange={(e) => setSlug(e.target.value)} className={`${field} w-full`}>
              <option value="">Every course</option>
              {courses.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="block text-xs text-gray-500 mb-1.5">Code</span>
            <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ''))} maxLength={24} placeholder="Made for you if left empty" className={`${field} w-full`} />
          </label>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <label className="block flex-1 min-w-[220px]">
            <span className="block text-xs text-gray-500 mb-1.5">Note for the team (buyers do not see it)</span>
            <input value={note} onChange={(e) => setNote(e.target.value)} maxLength={200} placeholder="For example: Diwali offer, LinkedIn post" className={`${field} w-full`} />
          </label>
          <button type="submit" disabled={busy === 'create'} className={primary}>
            {busy === 'create' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}Make the code
          </button>
        </div>
      </form>

      {!coupons ? <Loader2 className="w-5 h-5 animate-spin text-gray-400" /> : (
        <div className="rounded-xl border border-gray-200 bg-raised overflow-auto">
          <table className="w-full text-[13px] min-w-[820px]">
            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>{['Code', 'Gives', 'Course', 'Used', 'Works until', 'Status', ''].map((h) => <th key={h} className="text-left px-3 py-2 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {coupons.map((c) => {
                const s = status(c)
                return (
                  <tr key={c.code} className="border-t border-gray-100 align-top">
                    <td className="px-3 py-2.5">
                      <button type="button" onClick={() => copy(c.code)} title="Copy the code" className="inline-flex items-center gap-1.5 font-mono font-semibold text-gray-900 hover:text-blue-700">
                        {c.code}{copied === c.code ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                      </button>
                      {c.note && <div className="text-xs text-gray-400 mt-0.5">{c.note}</div>}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap font-medium">{c.percent >= 100 ? 'Free' : `${c.percent}% off`}</td>
                    <td className="px-3 py-2.5 text-gray-600">{c.slug ? title(c.slug) : 'Every course'}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap tabular-nums">{c.uses}{c.maxUses > 0 ? ` of ${c.maxUses}` : ''} <span className="text-gray-400">{c.maxUses > 0 ? '' : 'people, no limit'}</span></td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-gray-600">{c.expiresAt ? when(c.expiresAt) : 'No end date'}</td>
                    <td className="px-3 py-2.5"><span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${s.tone}`}>{s.label}</span></td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => change('PATCH', { code: c.code, active: !c.active })} disabled={busy === c.code} className={btn}>{c.active ? 'Switch off' : 'Switch on'}</button>
                        <button onClick={() => { if (confirm(`Delete the code ${c.code}? People who already used it keep their course.`)) change('DELETE', { code: c.code }) }} disabled={busy === c.code} aria-label={`Delete ${c.code}`} className={btn}><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {coupons.length === 0 && <div className="p-8 text-sm text-gray-500 text-center">No coupon codes yet. Make the first one above.</div>}
        </div>
      )}
      <p className="text-xs text-gray-400 mt-3">A buyer types the code on the course page. Each person counts once per course, when the course becomes theirs. A code is taken off the price the buyer pays. Only managers can make or change codes.</p>
    </>
  )
}
