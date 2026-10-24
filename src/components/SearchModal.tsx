'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import Fuse, { type IFuseOptions } from 'fuse.js'
import {
  searchablePages,
  SEARCH_CATEGORY_ORDER,
  type SearchablePage,
} from '@/lib/search-index'


interface LessonHit { courseTitle: string; lessonTitle: string; href: string; snippet: string }

const fuseOptions: IFuseOptions<SearchablePage> = {
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'keywords', weight: 0.3 },
    { name: 'description', weight: 0.2 },
    { name: 'category', weight: 0.1 },
  ],
  threshold: 0.4,
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 2,
}

export default function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [lessons, setLessons] = useState<LessonHit[]>([])

  const fuse = useMemo(() => new Fuse(searchablePages, fuseOptions), [])

  const filtered = query.trim()
    ? fuse.search(query).map(r => r.item)
    : searchablePages

  const grouped = SEARCH_CATEGORY_ORDER
    .map(cat => ({ category: cat, items: filtered.filter(p => p.category === cat) }))
    .filter(g => g.items.length > 0)

  const pageItems = grouped.flatMap(g => g.items)
  const lessonItems = query.trim().length >= 3 ? lessons : []
  const flatItems: Array<{ href: string }> = [...pageItems, ...lessonItems]

  const navigate = useCallback((href: string) => {
    onClose()
    setQuery('')
    router.push(href)
  }, [onClose, router])

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Lessons from the course content, once typing pauses. A failure just means no Lessons section.
  useEffect(() => {
    const term = query.trim()
    if (!open || term.length < 3) { setLessons([]); return }
    const ctl = new AbortController()
    const timer = setTimeout(() => {
      fetch(`/api/search/lessons?q=${encodeURIComponent(term)}`, { signal: ctl.signal })
        .then(r => (r.ok ? r.json() : { lessons: [] }))
        .then(d => setLessons(Array.isArray(d.lessons) ? d.lessons : []))
        .catch(() => {})
    }, 350)
    return () => { clearTimeout(timer); ctl.abort() }
  }, [query, open])

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, flatItems.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, 0))
      } else if (e.key === 'Enter' && flatItems[selectedIndex]) {
        e.preventDefault()
        navigate(flatItems[selectedIndex].href)
      } else if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, flatItems, selectedIndex, navigate, onClose])

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center pt-[15vh] p-4" onClick={onClose}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        className="relative z-10 w-full max-w-xl bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search pages, programs, services..."
            className="flex-1 text-sm text-gray-900 placeholder-gray-400 outline-none bg-transparent"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono text-gray-400 bg-gray-100 rounded border border-gray-200">
            ESC
          </kbd>
        </div>

        <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-2">
          {flatItems.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            grouped.map(group => (
              <div key={group.category}>
                <div className="px-4 pt-3 pb-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  {group.category}
                </div>
                {group.items.map(item => {
                  const idx = pageItems.indexOf(item)
                  return (
                    <button
                      key={item.href}
                      data-index={idx}
                      onClick={() => navigate(item.href)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                        idx === selectedIndex
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{item.title}</div>
                        <div className="text-xs text-gray-400 truncate">{item.description}</div>
                      </div>
                      <ArrowRight className={cn(
                        'w-4 h-4 shrink-0 transition-opacity',
                        idx === selectedIndex ? 'opacity-100' : 'opacity-0'
                      )} />
                    </button>
                  )
                })}
              </div>
            ))
          )}

          {lessonItems.length > 0 && (
            <div>
              <div className="px-4 pt-3 pb-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Lessons</div>
              {lessonItems.map((item, i) => {
                const idx = pageItems.length + i
                return (
                  <button
                    key={`${item.href}-${i}`}
                    data-index={idx}
                    onClick={() => navigate(item.href)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                      idx === selectedIndex ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{item.lessonTitle}</div>
                      <div className="text-xs text-gray-400 truncate">{item.courseTitle}{item.snippet ? ` · ${item.snippet}` : ''}</div>
                    </div>
                    <ArrowRight className={cn('w-4 h-4 shrink-0 transition-opacity', idx === selectedIndex ? 'opacity-100' : 'opacity-0')} />
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-t border-gray-100 flex items-center gap-4 text-[11px] text-gray-400">
          <span><kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px] font-mono border border-gray-200">&uarr;&darr;</kbd> navigate</span>
          <span><kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px] font-mono border border-gray-200">&crarr;</kbd> open</span>
          <span><kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px] font-mono border border-gray-200">esc</kbd> close</span>
        </div>
      </div>
    </div>
  )
}
