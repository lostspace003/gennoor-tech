'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react'
import { DateRangeFilter, rangeBounds, rangeLabel, type DateRange } from '@/components/crm/shared'

/**
 * One way to search, date-filter and page any admin list, so every section behaves the same and stays usable as it grows.
 *   const v = useListView(items, { date: x => x.createdAt, text: x => `${x.name} ${x.email}`, pageSize: 10 })
 *   <ListToolbar v={v} />  ...render v.rows...  <Pager v={v} />
 */
export function useListView<T>(items: T[], o: { date?: (x: T) => string | undefined; text?: (x: T) => string; pageSize?: number }) {
  const [q, setQ] = useState('')
  const [range, setRange] = useState<DateRange | null>(null) // null = all time
  const [page, setPage] = useState(0)
  const size = o.pageSize ?? 10
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const b = range ? rangeBounds(range) : null
    return items.filter(x => {
      if (b && o.date) { const t = Date.parse(o.date(x) || ''); if (!(t >= b.fromMs && t <= b.toMs)) return false }
      return !needle || !o.text || o.text(x).toLowerCase().includes(needle)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, q, range])
  useEffect(() => { setPage(0) }, [q, range, items.length])
  const pages = Math.max(1, Math.ceil(filtered.length / size))
  const at = Math.min(page, pages - 1)
  return { q, setQ, range, setRange, page: at, setPage, pages, size, total: items.length, filtered, rows: filtered.slice(at * size, at * size + size), hasDate: !!o.date, hasText: !!o.text }
}
export type ListView<T> = ReturnType<typeof useListView<T>>

export function ListToolbar<T>({ v, noun = 'item', children }: { v: ListView<T>; noun?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-3">
      {v.hasText && (
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input value={v.q} onChange={e => v.setQ(e.target.value)} placeholder={`Search ${noun}s`} className="text-[13px] border border-gray-200 rounded-md pl-8 pr-7 py-1.5 w-52 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200" />
          {v.q && <button onClick={() => v.setQ('')} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"><X className="w-3.5 h-3.5" /></button>}
        </div>
      )}
      {v.hasDate && (
        <span className="inline-flex flex-wrap items-center gap-1">
          <button type="button" onClick={() => v.setRange(null)} className={`px-2.5 py-1 text-xs rounded-full border ${!v.range ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>All time</button>
          <DateRangeFilter value={v.range || { days: -1, from: '', to: '' }} onChange={v.setRange} />
        </span>
      )}
      {children}
      <span className="text-xs text-gray-400 ml-auto">{v.filtered.length === v.total ? `${v.total} ${noun}${v.total === 1 ? '' : 's'}` : `${v.filtered.length} of ${v.total}${v.range ? ` · ${rangeLabel(v.range)}` : ''}`}</span>
    </div>
  )
}

export function Pager<T>({ v }: { v: ListView<T> }) {
  if (v.filtered.length <= v.size) return null
  return (
    <div className="flex items-center justify-between pt-3 text-xs text-gray-500">
      <span>{v.page * v.size + 1}–{Math.min(v.filtered.length, v.page * v.size + v.size)} of {v.filtered.length}</span>
      <div className="flex items-center gap-1">
        <button disabled={v.page === 0} onClick={() => v.setPage(v.page - 1)} aria-label="Previous page" className="p-1.5 rounded border border-gray-200 bg-white disabled:opacity-30 hover:border-gray-400"><ChevronLeft className="w-3.5 h-3.5" /></button>
        <span className="px-1.5">{v.page + 1}/{v.pages}</span>
        <button disabled={v.page >= v.pages - 1} onClick={() => v.setPage(v.page + 1)} aria-label="Next page" className="p-1.5 rounded border border-gray-200 bg-white disabled:opacity-30 hover:border-gray-400"><ChevronRight className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  )
}
