'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react'
import { DateRangeFilter, rangeBounds, rangeLabel, type DateRange } from '@/components/crm/shared'

export interface DraftRow {
  id: string
  title: string
  /** Which filter tab this row belongs to (a row can only be in one). */
  group: string
  badge: { label: string; tone: string }
  /** Small grey facts after the badge, e.g. category and date. */
  meta?: string[]
  /** Right-aligned small text, e.g. cost. */
  right?: string
  /** When it was created or last changed (ISO). Drives the date filter. */
  date?: string
  /** Extra text the search should match. */
  search?: string
}
export interface DraftFilter { key: string; label: string }

/**
 * A list that stays easy to use as it grows: search, status tabs with counts, one tidy row per item and paging,
 * so the page never turns into a long scroll of cards. Shared by the Blog and Social studios.
 */
export default function DraftList({ rows, filters, selectedId, onSelect, pageSize = 8, noun = 'draft' }: {
  rows: DraftRow[]; filters: DraftFilter[]; selectedId: string; onSelect: (id: string) => void; pageSize?: number; noun?: string
}) {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(0)
  const [range, setRange] = useState<DateRange | null>(null) // null = all time

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length }
    for (const r of rows) c[r.group] = (c[r.group] || 0) + 1
    return c
  }, [rows])
  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const b = range ? rangeBounds(range) : null
    return rows.filter(r => {
      if (filter !== 'all' && r.group !== filter) return false
      if (b) { const t = r.date ? Date.parse(r.date) : NaN; if (!(t >= b.fromMs && t <= b.toMs)) return false }
      return !needle || `${r.title} ${r.search || ''} ${(r.meta || []).join(' ')}`.toLowerCase().includes(needle)
    })
  }, [rows, q, filter, range])

  const pages = Math.max(1, Math.ceil(shown.length / pageSize))
  const at = Math.min(page, pages - 1)
  const slice = shown.slice(at * pageSize, at * pageSize + pageSize)
  useEffect(() => { setPage(0) }, [q, filter, range])
  // Opening a draft from a link or a new draft jumps to the page that holds it.
  useEffect(() => { const i = shown.findIndex(r => r.id === selectedId); if (i >= 0) setPage(Math.floor(i / pageSize)) }, [selectedId]) // eslint-disable-line react-hooks/exhaustive-deps

  const tabs = [{ key: 'all', label: 'All' }, ...filters].filter(f => f.key === 'all' || counts[f.key])

  return (
    <div className="rounded-xl border border-gray-200 bg-raised shadow-sm overflow-hidden">
      <div className="p-2 border-b border-gray-100 space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder={`Search ${noun}s`} className="w-full text-[13px] border border-gray-200 rounded-md pl-8 pr-7 py-1.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 bg-raised" />
          {q && <button onClick={() => setQ('')} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"><X className="w-3.5 h-3.5" /></button>}
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <button type="button" onClick={() => setRange(null)} className={`px-2.5 py-1 text-xs rounded-full border ${!range ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>All time</button>
          <DateRangeFilter value={range || { days: -1, from: '', to: '' }} onChange={setRange} />
        </div>
        <div className="flex flex-wrap gap-1">
          {tabs.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} className={`text-xs px-2 py-1 rounded-md border ${filter === f.key ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
              {f.label} <span className={filter === f.key ? 'text-gray-300' : 'text-gray-400'}>{counts[f.key] || 0}</span>
            </button>
          ))}
        </div>
      </div>
      <ul className="divide-y divide-gray-100">
        {slice.length === 0 && <li className="p-3 text-sm text-gray-500">{rows.length === 0 ? `No ${noun}s yet.` : `No ${noun}s match${range ? ` in ${rangeLabel(range)}` : ''}.`}</li>}
        {slice.map(r => (
          <li key={r.id}>
            <button onClick={() => onSelect(r.id)} title={r.title} className={`w-full text-left px-3 py-2 hover:bg-gray-50 border-l-2 ${selectedId === r.id ? 'bg-gray-100 border-gray-800' : 'border-transparent'}`}>
              <div className="text-[13px] font-medium leading-snug line-clamp-2 break-words">{r.title}</div>
              <div className="flex items-center gap-1.5 mt-1 min-w-0">
                <span className={`shrink-0 text-[11px] px-1.5 py-0.5 rounded ${r.badge.tone}`}>{r.badge.label}</span>
                <span className="text-[11px] text-gray-400 truncate">{(r.meta || []).filter(Boolean).join(' · ')}</span>
                {r.right && <span className="text-[11px] text-gray-500 ml-auto shrink-0">{r.right}</span>}
              </div>
            </button>
          </li>
        ))}
      </ul>
      {shown.length > pageSize && (
        <div className="flex items-center justify-between px-2 py-1.5 border-t border-gray-100 text-xs text-gray-500">
          <span>{at * pageSize + 1}–{Math.min(shown.length, at * pageSize + pageSize)} of {shown.length}</span>
          <div className="flex items-center gap-1">
            <button disabled={at === 0} onClick={() => setPage(at - 1)} aria-label="Previous page" className="p-1 rounded border border-gray-200 disabled:opacity-30 hover:border-gray-400"><ChevronLeft className="w-3.5 h-3.5" /></button>
            <span className="px-1">{at + 1}/{pages}</span>
            <button disabled={at >= pages - 1} onClick={() => setPage(at + 1)} aria-label="Next page" className="p-1 rounded border border-gray-200 disabled:opacity-30 hover:border-gray-400"><ChevronRight className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      )}
    </div>
  )
}

/** A small card whose body can fold away, so setup panels do not push the list down the page. */
export function Fold({ title, icon, right, open, onToggle, children, tone = 'border-gray-200 bg-surface' }: {
  title: React.ReactNode; icon?: React.ReactNode; right?: React.ReactNode; open: boolean; onToggle: () => void; children: React.ReactNode; tone?: string
}) {
  return (
    <div className={`rounded-xl border shadow-sm ${tone}`}>
      <div className="flex items-center gap-2 px-3 py-2">
        <button onClick={onToggle} aria-expanded={open} className="flex items-center gap-1.5 text-xs font-semibold flex-1 min-w-0 text-left">
          {icon}<span className="truncate">{title}</span>
          <ChevronRight className={`w-3.5 h-3.5 text-gray-400 ml-auto transition-transform ${open ? 'rotate-90' : ''}`} />
        </button>
        {right}
      </div>
      {open && <div className="px-3 pb-3">{children}</div>}
    </div>
  )
}
