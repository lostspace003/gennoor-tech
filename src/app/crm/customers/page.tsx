'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { BadgeCheck, GraduationCap, CalendarDays, Wallet, Search } from 'lucide-react'
import type { Customer } from '@/lib/crm/customers'

const day = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const money = (inr: number, usd: number) => [inr ? `₹${Math.round(inr).toLocaleString('en-IN')}` : '', usd ? `$${usd.toFixed(2)}` : ''].filter(Boolean).join(' + ') || '0'

type Kind = 'all' | 'Course' | 'AI Weekend'

/** Everyone who has paid, in one place. The two promotional emails are not sent to them (lib/crm/customers.ts). */
export default function CustomersPage() {
  const [rows, setRows] = useState<Customer[] | null>(null)
  const [error, setError] = useState('')
  const [kind, setKind] = useState<Kind>('all')
  const [q, setQ] = useState('')

  useEffect(() => {
    fetch('/api/admin/customers', { cache: 'no-store' })
      .then(async (r) => { const d = await r.json(); if (!r.ok) throw new Error(d.error || 'Could not load'); setRows(d.customers) })
      .catch((e) => setError(e.message))
  }, [])

  const all = rows || []
  const count = (k: Kind) => all.filter((c) => k === 'all' || c.payments.some((p) => p.type === k)).length
  const shown = useMemo(() => {
    const text = q.trim().toLowerCase()
    return all.filter((c) => (kind === 'all' || c.payments.some((p) => p.type === kind))
      && (!text || `${c.name} ${c.email} ${c.company || ''} ${c.payments.map((p) => p.what).join(' ')}`.toLowerCase().includes(text)))
  }, [all, kind, q])

  const tiles: Array<{ k: Kind; label: string; value: string | number; Icon: typeof BadgeCheck }> = [
    { k: 'all', label: 'paid customers', value: count('all'), Icon: BadgeCheck },
    { k: 'Course', label: 'bought a course', value: count('Course'), Icon: GraduationCap },
    { k: 'AI Weekend', label: 'paid for an AI Weekend', value: count('AI Weekend'), Icon: CalendarDays },
  ]

  return (
    <div className="max-w-6xl">
      <h1 className="text-xl font-bold text-gray-900">Paid customers</h1>
      <p className="mt-1 text-sm text-gray-600 max-w-2xl">Everyone who has paid for a course or an AI Weekend. The email series and the AI Weekend campaign are not sent to them. The emails about what they bought still go.</p>

      {error && <p className="mt-4 rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2">{error}</p>}
      {!rows && !error && <p className="mt-6 text-sm text-gray-500">Reading the payments…</p>}

      {rows && (
        <>
          <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {tiles.map(({ k, label, value, Icon }) => (
              <button key={k} type="button" onClick={() => setKind(k)} aria-pressed={kind === k}
                className={`text-left rounded-xl border px-4 py-3 bg-surface transition ${kind === k ? 'border-primary-500 ring-2 ring-primary-100' : 'border-gray-200 hover:border-gray-300'}`}>
                <Icon className="w-4 h-4 text-primary-600" />
                <div className="mt-1.5 text-2xl font-bold text-gray-900">{value}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </button>
            ))}
            <div className="rounded-xl border border-gray-200 px-4 py-3 bg-surface">
              <Wallet className="w-4 h-4 text-primary-600" />
              <div className="mt-1.5 text-lg font-bold text-gray-900 leading-8">{money(all.reduce((n, c) => n + c.inr, 0), all.reduce((n, c) => n + c.usd, 0))}</div>
              <div className="text-xs text-gray-500">received in all</div>
            </div>
          </div>

          <label className="mt-4 flex items-center gap-2 rounded-lg border border-gray-200 bg-surface px-3 py-2 max-w-sm">
            <Search className="w-4 h-4 text-gray-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, email, course" aria-label="Search paid customers" className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400" />
          </label>

          <div className="mt-3 overflow-x-auto rounded-xl border border-gray-200 bg-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-200">
                  <th className="px-4 py-2.5 font-medium">Person</th>
                  <th className="px-4 py-2.5 font-medium">What they paid for</th>
                  <th className="px-4 py-2.5 font-medium">Paid</th>
                  <th className="px-4 py-2.5 font-medium">Latest payment</th>
                  <th className="px-4 py-2.5 font-medium">In the CRM</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((c) => (
                  <tr key={c.email} className="border-b border-gray-100 last:border-0 align-top">
                    <td className="px-4 py-2.5 max-w-[240px]">
                      <div className="font-medium text-gray-900 truncate">{c.name}</div>
                      <div className="text-xs text-gray-500 truncate">{c.email}</div>
                      {c.company && <div className="text-xs text-gray-500 truncate">{c.company}</div>}
                    </td>
                    <td className="px-4 py-2.5">
                      {c.payments.map((p, i) => (
                        <div key={i} className="text-gray-700">
                          <span className={`mr-1.5 text-[10.5px] font-semibold rounded-full px-1.5 py-0.5 ${p.type === 'Course' ? 'bg-primary-50 text-primary-700' : 'bg-amber-50 text-amber-700'}`}>{p.type}</span>
                          {p.what}
                        </div>
                      ))}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap font-medium text-gray-900">{money(c.inr, c.usd)}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-gray-600">{day(c.last)}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      {c.leadId ? <Link href={`/crm/leads/${c.leadId}`} className="text-primary-700 font-medium hover:underline">Open the lead</Link> : <span className="text-gray-400">not a lead yet</span>}
                    </td>
                  </tr>
                ))}
                {!shown.length && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">{all.length ? 'Nobody matches.' : 'Nobody has paid yet.'}</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
