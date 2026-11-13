'use client'

import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter, X } from 'lucide-react'

export interface FilterGroup {
  key: string
  label: string
  allLabel: string
  value: string
  options: { id: string; label: string }[]
  onChange: (id: string) => void
}

export type SortKey = 'default' | 'alpha' | 'date'
export const SORT_LABEL: Record<SortKey, string> = { default: 'Featured', alpha: 'Alphabetical', date: 'Date added' }

/**
 * Quick filters (one-tap chips for the most useful facet) plus a collapsible
 * panel of compact dropdowns for the rest, so the filter never owns the page.
 */
export function FilterBar({
  groups,
  quickKey,
  activeCount,
  onReset,
  sort = 'default',
  desc = false,
  onSort,
  onDirection,
  dateSort = true,
}: {
  groups: FilterGroup[]
  quickKey: string
  activeCount: number
  onReset: () => void
  sort?: SortKey
  desc?: boolean
  onSort?: (s: SortKey) => void
  onDirection?: () => void
  dateSort?: boolean
}) {
  const [open, setOpen] = useState(false)
  const quick = groups.find(g => g.key === quickKey)
  const rest = groups.filter(g => g.key !== quickKey)
  const restActive = rest.filter(g => g.value !== 'all').length
  const sorts: SortKey[] = dateSort ? ['default', 'alpha', 'date'] : ['default', 'alpha']

  return (
    <div className="max-w-6xl mx-auto mb-8">
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="w-4 h-4 text-gray-400 mr-1" />
        {quick && (
          <div className="flex flex-wrap gap-2">
            {[{ id: 'all', label: quick.allLabel }, ...quick.options].map(o => (
              <button
                key={o.id}
                type="button"
                onClick={() => quick.onChange(o.id)}
                aria-pressed={quick.value === o.id}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                  quick.value === o.id ? 'bg-primary-600 text-white shadow-sm' : 'bg-raised text-gray-600 ring-1 ring-gray-200 hover:ring-primary-300 hover:text-primary-700'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {rest.length > 0 && (
            <button
              type="button"
              onClick={() => setOpen(o => !o)}
              aria-expanded={open}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-raised text-gray-700 ring-1 ring-gray-200 hover:ring-primary-300"
            >
              More filters
              {restActive > 0 && <span className="px-1.5 rounded-full bg-primary-600 text-white text-[10px] leading-4">{restActive}</span>}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
          )}
          {onSort && <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500">
            Sort
            <select
              value={sort}
              onChange={e => onSort(e.target.value as SortKey)}
              className="text-xs rounded-full px-3 py-1.5 bg-raised ring-1 ring-gray-200 text-gray-800 focus:outline-none focus:ring-primary-600 cursor-pointer border-0"
            >
              {sorts.map(s => <option key={s} value={s}>{SORT_LABEL[s]}</option>)}
            </select>
          </label>}
          {onDirection && sort !== 'default' && (
            <button
              type="button"
              onClick={onDirection}
              aria-label={desc ? 'Descending, switch to ascending' : 'Ascending, switch to descending'}
              title={desc ? 'Descending' : 'Ascending'}
              className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-raised ring-1 ring-gray-200 text-gray-700 hover:ring-primary-300 hover:text-primary-700"
            >
              {desc ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
            </button>
          )}
          {activeCount > 0 && (
            <button type="button" onClick={onReset} className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700">
              <X className="w-3 h-3" /> Clear {activeCount}
            </button>
          )}
        </div>
      </div>

      {open && rest.length > 0 && (
        <div className="mt-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 rounded-2xl bg-raised ring-1 ring-gray-200 p-4">
          {rest.map(g => (
            <label key={g.key} className="block">
              <span className="block text-xs font-semibold text-gray-500 mb-1">{g.label}</span>
              <select
                value={g.value}
                onChange={e => g.onChange(e.target.value)}
                className="w-full text-[13px] rounded-full px-3.5 py-2 bg-raised border border-gray-300 text-gray-900 focus:outline-none focus:border-primary-600 cursor-pointer"
              >
                <option value="all">{g.allLabel}</option>
                {g.options.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

/** First, previous, 1 … window … last, next, last — two pages shown each side of the current one. */
function pageList(page: number, pages: number): (number | 'gap')[] {
  const out: (number | 'gap')[] = []
  const from = Math.max(1, page - 2)
  const to = Math.min(pages, page + 2)
  if (from > 1) out.push(1)
  if (from > 2) out.push('gap')
  for (let p = from; p <= to; p++) if (p !== 1 || out.length === 0) out.push(p)
  if (to < pages - 1) out.push('gap')
  if (to < pages) out.push(pages)
  return out
}

export function Pagination({ page, pages, onPage }: { page: number; pages: number; onPage: (p: number) => void }) {
  if (pages <= 1) return null
  const btn = 'min-w-9 h-9 px-2 inline-flex items-center justify-center rounded-full text-sm font-semibold transition-colors'
  const idle = 'bg-surface text-gray-700 ring-1 ring-gray-200 hover:ring-primary-300 hover:text-primary-700'
  const off = 'opacity-40 pointer-events-none'
  return (
    <nav aria-label="Pages" className="flex flex-wrap items-center justify-center gap-1.5 mt-10">
      <button type="button" aria-label="First page" onClick={() => onPage(1)} className={`${btn} ${idle} ${page === 1 ? off : ''}`}><ChevronsLeft className="w-4 h-4" /></button>
      <button type="button" aria-label="Previous page" onClick={() => onPage(page - 1)} className={`${btn} ${idle} ${page === 1 ? off : ''}`}><ChevronLeft className="w-4 h-4" /></button>
      {pageList(page, pages).map((p, i) =>
        p === 'gap' ? (
          <span key={`g${i}`} className="px-1 text-gray-400">…</span>
        ) : (
          <button key={p} type="button" aria-current={p === page ? 'page' : undefined} onClick={() => onPage(p)} className={`${btn} ${p === page ? 'bg-primary-600 text-white shadow-sm' : idle}`}>{p}</button>
        ),
      )}
      <button type="button" aria-label="Next page" onClick={() => onPage(page + 1)} className={`${btn} ${idle} ${page === pages ? off : ''}`}><ChevronRight className="w-4 h-4" /></button>
      <button type="button" aria-label="Last page" onClick={() => onPage(pages)} className={`${btn} ${idle} ${page === pages ? off : ''}`}><ChevronsRight className="w-4 h-4" /></button>
    </nav>
  )
}

/** Page state that snaps back to 1 whenever the filter/sort inputs change. */
export function usePage(resetKey: string, total: number, size: number) {
  const [page, setPage] = useState(1)
  useEffect(() => setPage(1), [resetKey])
  const pages = Math.max(1, Math.ceil(total / size))
  const safe = Math.min(page, pages)
  return { page: safe, pages, setPage: (p: number) => { setPage(Math.min(Math.max(1, p), pages)); window.scrollTo({ top: document.getElementById('catalog-top')?.offsetTop ?? 0, behavior: 'smooth' }) }, start: (safe - 1) * size, end: safe * size }
}
