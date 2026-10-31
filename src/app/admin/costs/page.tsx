'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Loader2, RefreshCw } from 'lucide-react'
import InfoTip from '@/components/admin/InfoTip'

interface Bucket { key: string; label: string; start: string; end: string; total: number; byGroup: Record<string, number> }
interface Report { currency: string; usdPerInr: number; cycleDay: number; from: string; to: string; total: number; buckets: Bucket[]; groups: { name: string; total: number }[]; fetchedAt: string }

type Gran = 'day' | 'week' | 'month' | 'cycle' | 'quarter'
const GRANS: { v: Gran; l: string }[] = [{ v: 'day', l: 'Daily' }, { v: 'week', l: 'Weekly' }, { v: 'cycle', l: 'Billing month' }, { v: 'month', l: 'Calendar month' }, { v: 'quarter', l: 'Billing quarter' }]
const GROUPS = [{ v: 'ServiceName', l: 'Service' }, { v: 'ResourceGroupName', l: 'Resource group' }, { v: 'ResourceType', l: 'Resource type' }, { v: 'ResourceLocation', l: 'Region' }]
const PALETTE = ['#1d4ed8', '#334155', '#64748b', '#94a3b8', '#cbd5e1', '#475569', '#7c8da3', '#a8b4c4', '#d5dce5', '#e5e9ef']

const iso = (d: Date) => d.toISOString().slice(0, 10)
const utc = (y: number, m: number, d: number) => new Date(Date.UTC(y, m, d))
const addDays = (d: Date, n: number) => utc(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + n)

function presets(cycleDay: number, today: Date): Record<string, [string, string]> {
  const y = today.getUTCFullYear(), m = today.getUTCMonth(), d = today.getUTCDate()
  const cs = d >= cycleDay ? utc(y, m, cycleDay) : utc(y, m - 1, cycleDay)
  const cm = cs.getUTCMonth()
  const qs = utc(cs.getUTCFullYear(), cm - (cm % 3), cycleDay)
  const t = iso(today)
  return {
    'This billing month': [iso(cs), t],
    'Last billing month': [iso(utc(cs.getUTCFullYear(), cm - 1, cycleDay)), iso(addDays(cs, -1))],
    'This billing quarter': [iso(qs), t],
    'Last billing quarter': [iso(utc(qs.getUTCFullYear(), qs.getUTCMonth() - 3, cycleDay)), iso(addDays(qs, -1))],
    'Last 30 days': [iso(addDays(today, -29)), t],
    'Last 90 days': [iso(addDays(today, -89)), t],
    'Year to date': [`${y}-01-01`, t],
    'Last 12 months': [iso(addDays(today, -364)), t],
  }
}

export default function CostCentrePage() {
  const today = useMemo(() => new Date(), [])
  const [cycleDay, setCycleDay] = useState(13)
  const [preset, setPreset] = useState('Last 12 months')
  const [range, setRange] = useState<[string, string]>(() => presets(13, new Date())['Last 12 months'])
  const [gran, setGran] = useState<Gran>('cycle')
  const [groupBy, setGroupBy] = useState('ServiceName')
  // Filters are only a draft until Apply is pressed; `applied` is what the report is actually showing.
  const [applied, setApplied] = useState<{ range: [string, string]; gran: Gran; groupBy: string }>({ range: presets(13, new Date())['Last 12 months'], gran: 'cycle', groupBy: 'ServiceName' })
  const [usd, setUsd] = useState(false)
  const [data, setData] = useState<Report | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true); setError('')
    const q = new URLSearchParams({ from: applied.range[0], to: applied.range[1], granularity: applied.gran, groupBy: applied.groupBy })
    const r = await fetch(`/api/admin/costs?${q}`)
    const j = await r.json().catch(() => ({}))
    setLoading(false)
    if (!r.ok) { setError(j.error || `Failed (${r.status})`); return }
    setData(j)
    if (j.cycleDay && j.cycleDay !== cycleDay) setCycleDay(j.cycleDay)
  }, [applied, cycleDay])
  useEffect(() => { load() }, [load])

  function pick(name: string) {
    setPreset(name)
    if (name !== 'Custom') setRange(presets(cycleDay, today)[name])
  }

  const money = (n: number) => {
    const cur = data?.currency || 'INR'
    const v = usd && cur === 'INR' ? n * (data?.usdPerInr || 0) : n
    const sym = usd && cur === 'INR' ? '$' : cur === 'INR' ? '₹' : `${cur} `
    return `${sym}${v.toLocaleString(undefined, { maximumFractionDigits: v < 10 ? 2 : 0 })}`
  }

  const colors = useMemo(() => {
    const m: Record<string, string> = {}
    ;(data?.groups || []).forEach((g, i) => { m[g.name] = PALETTE[Math.min(i, PALETTE.length - 1)] })
    return m
  }, [data])

  const max = Math.max(1, ...(data?.buckets || []).map(b => b.total))
  const days = data ? Math.max(1, Math.round((Date.parse(data.to) - Date.parse(data.from)) / 86_400_000) + 1) : 1
  const top = data?.buckets.reduce((a, b) => (b.total > (a?.total ?? -1) ? b : a), undefined as Bucket | undefined)
  const sel = 'text-sm border border-gray-200 rounded-md px-2.5 py-2 bg-white focus:outline-none focus:border-gray-500 min-w-[180px]'
  const dirty = range[0] !== applied.range[0] || range[1] !== applied.range[1] || gran !== applied.gran || groupBy !== applied.groupBy
  const apply = () => setApplied({ range, gran, groupBy })
  const reset = () => { setRange(applied.range); setGran(applied.gran); setGroupBy(applied.groupBy); setPreset(Object.entries(presets(cycleDay, today)).find(([, v]) => v[0] === applied.range[0] && v[1] === applied.range[1])?.[0] || 'Custom') }

  return (
    <div className="w-full p-4 lg:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h1 className="text-lg font-semibold">Cost centre<InfoTip text={`Azure spend for the whole subscription: website, admin, CRM, AI, email, storage and everything else. Months and quarters follow your Visual Studio billing cycle (starts on day ${cycleDay}), so they match the invoice.`} /></h1>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {data && <span>Updated {new Date(data.fetchedAt).toLocaleTimeString()}</span>}
          <button onClick={load} disabled={loading} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-gray-200 bg-white hover:border-gray-400 disabled:opacity-40"><RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />Refresh</button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-3 mb-4 flex flex-wrap items-end gap-3">
        <label className="text-xs text-gray-500">Period<select value={preset} onChange={e => pick(e.target.value)} className={`${sel} block mt-0.5`}>
          {[...Object.keys(presets(cycleDay, today)), 'Custom'].map(p => <option key={p}>{p}</option>)}
        </select></label>
        {preset === 'Custom' && <>
          <label className="text-xs text-gray-500">From<input type="date" value={range[0]} onChange={e => setRange([e.target.value, range[1]])} className={`${sel} block mt-0.5`} /></label>
          <label className="text-xs text-gray-500">To<input type="date" value={range[1]} onChange={e => setRange([range[0], e.target.value])} className={`${sel} block mt-0.5`} /></label>
        </>}
        <label className="text-xs text-gray-500">View by<select value={gran} onChange={e => setGran(e.target.value as Gran)} className={`${sel} block mt-0.5`}>{GRANS.map(g => <option key={g.v} value={g.v}>{g.l}</option>)}</select></label>
        <label className="text-xs text-gray-500">Split by<select value={groupBy} onChange={e => setGroupBy(e.target.value)} className={`${sel} block mt-0.5`}>{GROUPS.map(g => <option key={g.v} value={g.v}>{g.l}</option>)}</select></label>
        <div className="flex items-center gap-2">
          <button onClick={apply} disabled={!dirty || loading} className="inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium bg-gray-800 text-white rounded-md hover:bg-gray-900 disabled:opacity-40">{loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}Apply</button>
          {dirty && <button onClick={reset} className="px-3 py-2 text-[13px] rounded-md border border-gray-200 bg-white hover:border-gray-400">Reset</button>}
          {dirty && <span className="text-xs text-amber-700">Filters changed. Press Apply to update.</span>}
        </div>
        {data?.currency === 'INR' && (
          <div className="ml-auto flex rounded-md border border-gray-200 overflow-hidden text-xs">
            <button onClick={() => setUsd(false)} className={`px-3 py-1.5 ${!usd ? 'bg-gray-800 text-white' : 'bg-white'}`}>₹ INR</button>
            <button onClick={() => setUsd(true)} className={`px-3 py-1.5 ${usd ? 'bg-gray-800 text-white' : 'bg-white'}`}>$ USD</button>
          </div>
        )}
      </div>

      {error && <div className="mb-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm px-3 py-2">{error}</div>}
      {loading && !data && <Loader2 className="w-5 h-5 animate-spin text-gray-400" />}

      {data && (
        <div className={loading ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {[
              { l: 'Total', v: money(data.total), s: `${data.from} to ${data.to}` },
              { l: 'Average per day', v: money(data.total / days), s: `${days} days` },
              { l: 'Highest period', v: top ? money(top.total) : '—', s: top?.label || '' },
              { l: 'Biggest cost', v: data.groups[0]?.name || '—', s: data.groups[0] ? `${money(data.groups[0].total)} · ${Math.round((data.groups[0].total / Math.max(1, data.total)) * 100)}%` : '' },
            ].map(c => (
              <div key={c.l} className="rounded-xl border border-gray-200 bg-white shadow-sm p-3 min-w-0">
                <div className="text-xs text-gray-500">{c.l}</div>
                <div className="text-lg font-semibold truncate" title={c.v}>{c.v}</div>
                <div className="text-xs text-gray-400 truncate">{c.s}</div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 mb-4">
            <div className="flex items-end gap-1.5 h-52 overflow-x-auto pb-1">
              {data.buckets.length === 0 && <div className="text-sm text-gray-400 m-auto">No cost in this period.</div>}
              {data.buckets.map(b => (
                <div key={b.key} className="flex-1 min-w-[28px] max-w-24 h-full flex flex-col justify-end group relative" title={`${b.label}: ${money(b.total)}`}>
                  <div className="text-xs text-gray-500 text-center mb-0.5 truncate">{money(b.total)}</div>
                  <div className="flex flex-col-reverse rounded-t overflow-hidden" style={{ height: `${(b.total / max) * 100}%`, minHeight: 2 }}>
                    {Object.entries(b.byGroup).sort((a, c) => c[1] - a[1]).map(([g, v]) => <div key={g} style={{ height: `${(v / Math.max(b.total, 0.0001)) * 100}%`, background: colors[g] }} />)}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-1.5 mt-1 overflow-x-auto">
              {data.buckets.map(b => <div key={b.key} className="flex-1 min-w-[28px] max-w-24 text-xs text-gray-500 text-center leading-tight break-words">{gran === 'day' ? b.label : b.label.split(' – ')[0]}</div>)}
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 text-xs text-gray-600">
              {data.groups.slice(0, 10).map(g => <span key={g.name} className="inline-flex items-center gap-1"><i className="w-2 h-2 rounded-sm inline-block" style={{ background: colors[g.name] }} />{g.name}</span>)}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="px-3 py-2 text-xs font-semibold border-b border-gray-100">By period</div>
              <div className="max-h-96 overflow-auto">
                <table className="w-full text-[13px]">
                  <thead className="sticky top-0 bg-gray-50 text-gray-500 text-xs"><tr><th className="text-left px-3 py-1.5 font-medium">Period</th><th className="text-right px-3 py-1.5 font-medium">Cost</th><th className="text-right px-3 py-1.5 font-medium">vs previous</th></tr></thead>
                  <tbody>
                    {[...data.buckets].reverse().map((b, i, arr) => {
                      const prev = arr[i + 1]
                      const delta = prev && prev.total > 0 ? ((b.total - prev.total) / prev.total) * 100 : null
                      return (
                        <tr key={b.key} className="border-t border-gray-100 hover:bg-gray-50">
                          <td className="px-3 py-1.5">{b.label}</td>
                          <td className="px-3 py-1.5 text-right font-medium">{money(b.total)}</td>
                          <td className={`px-3 py-1.5 text-right text-xs ${delta == null ? 'text-gray-300' : delta > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{delta == null ? '—' : `${delta > 0 ? '+' : ''}${delta.toFixed(0)}%`}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="px-3 py-2 text-xs font-semibold border-b border-gray-100">By {GROUPS.find(g => g.v === groupBy)?.l.toLowerCase()}</div>
              <ul className="max-h-96 overflow-auto divide-y divide-gray-100">
                {data.groups.filter(g => g.total > 0.005).map(g => (
                  <li key={g.name} className="px-3 py-1.5">
                    <div className="flex justify-between gap-2 text-[13px]"><span className="truncate" title={g.name}>{g.name}</span><span className="font-medium shrink-0">{money(g.total)}</span></div>
                    <div className="h-1 rounded bg-gray-100 mt-1"><div className="h-1 rounded" style={{ width: `${(g.total / Math.max(1, data.total)) * 100}%`, background: colors[g.name] }} /></div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">Source: Azure Cost Management (actual cost, subscription-wide). Billing months run from day {data.cycleDay} to day {data.cycleDay - 1}. Recent days can lag by up to a day. USD uses a fixed rate of {(1 / data.usdPerInr).toFixed(0)} ₹/$ unless you set AZURE_COST_USD_INR.</p>
        </div>
      )}
    </div>
  )
}
