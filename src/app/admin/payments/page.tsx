'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import * as XLSX from 'xlsx'
import { Download, Loader2, RefreshCw, Receipt, Tag, Ticket } from 'lucide-react'
import Coupons from './Coupons'

interface Payment { at: string; kind: 'course' | 'weekend'; what: string; name: string; email: string; amount: number; currency: 'USD' | 'INR'; paymentId: string; coupon?: string }
interface PriceRow { slug: string; code: string; title: string; kind: string; price: { usd: number; inr: number } | null; custom: boolean; previews: number; offer: { on: boolean; percent: number }; regular: { usd: number; inr: number } | null }
interface Data { payments: Payment[]; prices: PriceRow[]; defaultPrice: { usd: number; inr: number }; previewMax: number; online: boolean; testMode: boolean }

const btn = 'inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium rounded-md border border-gray-200 bg-raised hover:border-gray-400 disabled:opacity-40'
const primary = 'inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium bg-gray-800 text-white rounded-md hover:bg-gray-900 disabled:opacity-40'
const money = (amount: number, currency: string) => (currency === 'INR' ? `₹${Math.round(amount).toLocaleString('en-IN')}` : `$${amount.toFixed(2)}`)

const OFFER_PERCENTS = [10, 20, 30, 40, 50, 60, 70]

/** Money received, what each course costs, and coupon codes. */
export default function PaymentsPage() {
  const [data, setData] = useState<Data | null>(null)
  const [tab, setTab] = useState<'payments' | 'prices' | 'coupons'>('payments')
  const [kind, setKind] = useState<'all' | 'course' | 'weekend'>('all')
  const [q, setQ] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState('')
  const [edit, setEdit] = useState<Record<string, { usd: string; inr: string }>>({})

  const load = useCallback(async () => {
    const r = await fetch('/api/admin/payments').catch(() => null)
    const j = r ? await r.json().catch(() => ({})) : {}
    if (!r?.ok) { setError(j.error || `Could not load (${r?.status ?? 'offline'})`); return }
    setData(j)
  }, [])
  useEffect(() => { load() }, [load])

  const rows = useMemo(() => {
    const n = q.trim().toLowerCase()
    return (data?.payments || []).filter((p) => (kind === 'all' || p.kind === kind) && (!n || `${p.name} ${p.email} ${p.what} ${p.paymentId}`.toLowerCase().includes(n)))
  }, [data, kind, q])
  const total = (currency: string) => rows.filter((p) => p.currency === currency).reduce((s, p) => s + p.amount, 0)

  async function savePrice(slug: string, body: Record<string, unknown>) {
    setBusy(slug); setError(''); setNotice('')
    const r = await fetch('/api/admin/payments', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug, ...body }) }).catch(() => null)
    const j = r ? await r.json().catch(() => ({})) : {}
    setBusy('')
    if (!r?.ok) { setError(j.error || 'Could not save the price'); return }
    setData((d) => (d ? { ...d, prices: j.prices } : d))
    setEdit((e) => { const n = { ...e }; delete n[slug]; return n })
    setNotice('Saved. The course page shows it within a minute.')
  }

  function excel() {
    const sheet = XLSX.utils.json_to_sheet(rows.map((p) => ({
      Date: p.at.slice(0, 10), For: p.what, Type: p.kind === 'course' ? 'Course' : 'AI Weekend', Name: p.name, Email: p.email,
      Amount: p.amount, Currency: p.currency, 'Coupon code': p.coupon || '', 'Payment reference': p.paymentId || (p.coupon ? 'free with coupon' : 'marked by hand'),
    })))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, sheet, 'Payments')
    XLSX.writeFile(wb, `gennoor-payments-${new Date().toISOString().slice(0, 10)}.xlsx`)
  }

  return (
    <div className="w-full p-4 lg:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h1 className="text-xl font-semibold tracking-tight">Payments</h1>
        <button onClick={load} className={btn}><RefreshCw className="w-3.5 h-3.5" />Refresh</button>
      </div>

      {data && (data.online
        ? data.testMode && <div className="mb-3 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-sm px-3 py-2">Razorpay is in <b>test mode</b>. No real money moves.</div>
        : <div className="mb-3 rounded-md bg-gray-50 border border-gray-200 text-gray-700 text-sm px-3 py-2">Online payment is off because the Razorpay keys are not set. Courses cannot be bought until they are.</div>)}
      {error && <div className="mb-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm px-3 py-2">{error}</div>}
      {notice && <div className="mb-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-3 py-2">{notice}</div>}

      {!data ? <Loader2 className="w-5 h-5 animate-spin text-gray-400" /> : (
        <>
          <div className="flex gap-1 border-b border-gray-200 mb-4 text-sm">
            {([['payments', 'Money received', Receipt], ['prices', 'Course prices and offers', Tag], ['coupons', 'Coupon codes', Ticket]] as const).map(([id, label, Icon]) => (
              <button key={id} onClick={() => { setTab(id); setNotice('') }} className={`inline-flex items-center gap-1.5 px-3 py-2 -mb-px border-b-2 ${tab === id ? 'border-gray-800 font-medium' : 'border-transparent text-gray-500 hover:text-gray-800'}`}><Icon className="w-4 h-4" />{label}</button>
            ))}
          </div>

          {tab === 'payments' ? (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-4">
                {[
                  [`${rows.length}`, 'payments shown'],
                  [money(total('USD'), 'USD'), 'received in dollars'],
                  [money(total('INR'), 'INR'), 'received in rupees'],
                  [`${new Set(rows.map((p) => p.email)).size}`, 'different payers'],
                ].map(([big, small]) => (
                  <div key={small} className="rounded-xl border border-gray-200 bg-raised px-4 py-3">
                    <div className="text-2xl font-semibold tracking-tight">{big}</div>
                    <div className="text-xs text-gray-500">{small}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, course, reference" className="text-sm border border-gray-200 rounded-md px-2.5 py-2 w-72" />
                {(['all', 'course', 'weekend'] as const).map((k) => (
                  <button key={k} onClick={() => setKind(k)} className={`px-2.5 py-1 text-xs rounded-full border ${kind === k ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{k === 'all' ? 'Everything' : k === 'course' ? 'Courses' : 'AI Weekend'}</button>
                ))}
                <button onClick={excel} disabled={!rows.length} className={`${btn} ml-auto`}><Download className="w-3.5 h-3.5" />Download Excel</button>
              </div>
              <div className="rounded-xl border border-gray-200 bg-raised overflow-auto">
                <table className="w-full text-[13px] min-w-[760px]">
                  <thead className="bg-gray-50 text-xs text-gray-500">
                    <tr>{['Date', 'Paid for', 'Person', 'Amount', 'Payment reference'].map((h) => <th key={h} className="text-left px-3 py-2 font-medium">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {rows.map((p, i) => (
                      <tr key={`${p.paymentId}-${i}`} className="border-t border-gray-100 align-top">
                        <td className="px-3 py-2 whitespace-nowrap text-gray-500">{new Date(p.at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                        <td className="px-3 py-2"><div className="text-gray-900">{p.what}</div><div className="text-xs text-gray-400">{p.kind === 'course' ? 'Course' : 'AI Weekend'}</div></td>
                        <td className="px-3 py-2"><div className="font-medium text-gray-900">{p.name || 'No name given'}</div><a href={`mailto:${p.email}`} className="text-blue-700 hover:underline break-all">{p.email}</a></td>
                        <td className="px-3 py-2 whitespace-nowrap font-semibold tabular-nums">{money(p.amount, p.currency)}</td>
                        <td className="px-3 py-2 text-gray-600 font-mono text-xs">
                          {p.paymentId || <span className="font-sans text-gray-400">{p.coupon ? 'Free with a coupon code' : 'marked Paid by hand'}</span>}
                          {p.coupon && <div className="font-sans text-gray-500 mt-0.5">Coupon {p.coupon}</div>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {rows.length === 0 && <div className="p-8 text-sm text-gray-500 text-center">{data.payments.length ? 'Nothing matches that search.' : 'No payments yet. They appear here the moment someone pays.'}</div>}
              </div>
              <p className="text-xs text-gray-400 mt-3">Refunds are made in the Razorpay dashboard. Settlement dates and fees are shown there too.</p>
            </>
          ) : tab === 'coupons' ? (
            <Coupons courses={data.prices.filter((c) => c.price).map((c) => ({ slug: c.slug, title: c.title }))} />
          ) : (
            <>
              <p className="text-[13px] text-gray-600 mb-3">
                Every course costs <b>{money(data.defaultPrice.usd, 'USD')}</b> (<b>{money(data.defaultPrice.inr, 'INR')}</b> for buyers in India) unless you give it its own price here.
                Up to {data.previewMax} lessons of each course are free previews; which ones is set when the course is published.
                A course with its <b>offer</b> switched on shows a gold ribbon and a higher regular price struck through; buyers still pay the price in this table.
              </p>
              <div className="rounded-xl border border-gray-200 bg-raised overflow-auto">
                <table className="w-full text-[13px] min-w-[940px]">
                  <thead className="bg-gray-50 text-xs text-gray-500">
                    <tr>{['Course', 'Free previews', 'Price', 'Offer shown', 'Change the price'].map((h) => <th key={h} className="text-left px-3 py-2 font-medium">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {data.prices.map((c) => {
                      const e = edit[c.slug]
                      return (
                        <tr key={c.slug} className="border-t border-gray-100 align-middle">
                          <td className="px-3 py-2.5"><div className="font-medium text-gray-900">{c.title}</div><div className="text-xs text-gray-400">{c.code}</div></td>
                          <td className="px-3 py-2.5 text-gray-600">{c.previews} lessons</td>
                          <td className="px-3 py-2.5 whitespace-nowrap">
                            {c.price ? <><span className="font-semibold">{money(c.price.usd, 'USD')}</span> <span className="text-gray-500">· {money(c.price.inr, 'INR')}</span></> : <span className="font-semibold text-emerald-700">Free</span>}
                            {!c.custom && <span className="ml-2 text-[11px] text-gray-400">standard</span>}
                          </td>
                          <td className="px-3 py-2.5">
                            {c.price ? (
                              <div className="flex items-center gap-2 whitespace-nowrap">
                                <button
                                  type="button" role="switch" aria-checked={c.offer.on} aria-label={`Offer on ${c.title}`} disabled={busy === c.slug}
                                  onClick={() => savePrice(c.slug, { offer: { on: !c.offer.on, percent: c.offer.percent } })}
                                  className={`relative w-9 h-5 rounded-full transition-colors disabled:opacity-50 ${c.offer.on ? 'bg-blue-600' : 'bg-gray-300'}`}
                                >
                                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-raised shadow transition-transform ${c.offer.on ? 'translate-x-4' : ''}`} />
                                </button>
                                <select
                                  value={c.offer.percent} disabled={busy === c.slug} aria-label={`Percent off shown on ${c.title}`}
                                  onChange={(ev) => savePrice(c.slug, { offer: { on: c.offer.on, percent: Number(ev.target.value) } })}
                                  className="text-[13px] border border-gray-200 rounded py-1 pl-2 pr-7"
                                >
                                  {Array.from(new Set([...OFFER_PERCENTS, c.offer.percent])).sort((x, y) => x - y).map((p) => <option key={p} value={p}>{p}% off</option>)}
                                </select>
                                {c.regular ? <span className="text-xs text-gray-500">was <s>{money(c.regular.usd, 'USD')}</s> · <s>{money(c.regular.inr, 'INR')}</s></span> : <span className="text-xs text-gray-400">off</span>}
                              </div>
                            ) : <span className="text-xs text-gray-400">Free course</span>}
                          </td>
                          <td className="px-3 py-2.5">
                            {e ? (
                              <div className="flex flex-wrap items-center gap-1.5">
                                <label className="text-xs text-gray-500">$<input value={e.usd} onChange={(ev) => setEdit({ ...edit, [c.slug]: { ...e, usd: ev.target.value } })} inputMode="decimal" aria-label="Price in dollars" className="ml-1 w-20 border border-gray-200 rounded px-2 py-1 text-sm" /></label>
                                <label className="text-xs text-gray-500">₹<input value={e.inr} onChange={(ev) => setEdit({ ...edit, [c.slug]: { ...e, inr: ev.target.value } })} inputMode="numeric" aria-label="Price in rupees" className="ml-1 w-24 border border-gray-200 rounded px-2 py-1 text-sm" /></label>
                                <button onClick={() => savePrice(c.slug, { usd: e.usd, inr: e.inr })} disabled={busy === c.slug} className={primary}>{busy === c.slug ? 'Saving…' : 'Save'}</button>
                                <button onClick={() => setEdit((x) => { const n = { ...x }; delete n[c.slug]; return n })} className="text-xs text-gray-500 hover:text-gray-800 px-1">Cancel</button>
                              </div>
                            ) : (
                              <div className="flex flex-wrap items-center gap-1.5">
                                <button onClick={() => setEdit({ ...edit, [c.slug]: { usd: String(c.price?.usd ?? data.defaultPrice.usd), inr: String(c.price?.inr ?? data.defaultPrice.inr) } })} className={btn}>Set price</button>
                                {c.price && <button onClick={() => { if (confirm(`Make "${c.title}" free? Anyone who signs in will get the whole course.`)) savePrice(c.slug, { free: true }) }} disabled={busy === c.slug} className={btn}>Make free</button>}
                                {c.custom && <button onClick={() => savePrice(c.slug, { reset: true })} disabled={busy === c.slug} className="text-xs text-gray-500 hover:text-gray-800 px-1">Back to standard</button>}
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-400 mt-3">Buyers in India are charged the rupee price so UPI and net banking work. Everyone else is charged the dollar price by card. Only managers can change prices and offers.</p>
            </>
          )}
        </>
      )}
    </div>
  )
}
