'use client'

import { useCallback, useMemo, useState } from 'react'
import { Filter, X } from 'lucide-react'
import type { Course, Track, Level, Audience, Func, Industry, Stack } from '@/data/academy/types'
import {
  tracks,
  levels,
  audienceLabels,
  functionLabels,
  industryLabels,
  stackLabels,
} from '@/data/academy/taxonomy'

/**
 * The six-facet catalog filter, shared by the public /academy catalog and the
 * learner dashboard's browse mode so both stay in step as the taxonomy grows.
 * `matches` is the single definition of what a facet selection means, so the
 * two surfaces can never drift on, say, whether audience is any-of or all-of.
 */

export interface CatalogFilters {
  track: Track | 'all'
  level: Level | 'all'
  audience: Audience | 'all'
  func: Func | 'all'
  industry: Industry | 'all'
  stack: Stack | 'all'
  setTrack: (v: Track | 'all') => void
  setLevel: (v: Level | 'all') => void
  setAudience: (v: Audience | 'all') => void
  setFunc: (v: Func | 'all') => void
  setIndustry: (v: Industry | 'all') => void
  setStack: (v: Stack | 'all') => void
  activeCount: number
  reset: () => void
  /**
   * Courses that carry no catalog metadata (dashboard-only entries) pass while
   * nothing is selected and drop out as soon as a facet is chosen — there is no
   * honest way to claim they match a track or an industry.
   */
  matches: (course: Course | undefined) => boolean
}

export function useCatalogFilters(): CatalogFilters {
  const [track, setTrack] = useState<Track | 'all'>('all')
  const [level, setLevel] = useState<Level | 'all'>('all')
  const [audience, setAudience] = useState<Audience | 'all'>('all')
  const [func, setFunc] = useState<Func | 'all'>('all')
  const [industry, setIndustry] = useState<Industry | 'all'>('all')
  const [stack, setStack] = useState<Stack | 'all'>('all')

  const activeCount = [track, level, audience, func, industry, stack].filter(v => v !== 'all').length

  const reset = useCallback(() => {
    setTrack('all')
    setLevel('all')
    setAudience('all')
    setFunc('all')
    setIndustry('all')
    setStack('all')
  }, [])

  const matches = useCallback(
    (course: Course | undefined) => {
      if (activeCount === 0) return true
      if (!course) return false
      if (track !== 'all' && course.track !== track) return false
      if (level !== 'all' && course.level !== level) return false
      if (audience !== 'all' && !course.audience.includes(audience)) return false
      if (func !== 'all' && !course.functions?.includes(func)) return false
      if (industry !== 'all' && !course.industries?.includes(industry)) return false
      if (stack !== 'all' && !course.stack.includes(stack)) return false
      return true
    },
    [activeCount, track, level, audience, func, industry, stack],
  )

  return {
    track, level, audience, func, industry, stack,
    setTrack, setLevel, setAudience, setFunc, setIndustry, setStack,
    activeCount, reset, matches,
  }
}

export function CatalogFilterBar({
  filters,
  showing,
  total,
  className = '',
}: {
  filters: CatalogFilters
  showing: number
  total: number
  className?: string
}) {
  const options = useMemo(
    () => ({
      audience: Object.entries(audienceLabels).map(([value, label]) => ({ value, label })),
      func: Object.entries(functionLabels).map(([value, label]) => ({ value, label })),
      industry: Object.entries(industryLabels).map(([value, label]) => ({ value, label })),
      stack: Object.entries(stackLabels).map(([value, label]) => ({ value, label })),
    }),
    [],
  )

  return (
    <div className={className}>
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-5">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-bold tracking-widest text-gray-400 uppercase">
            Filter the catalog
          </h2>
          {filters.activeCount > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-primary-50 text-primary-600">
              {filters.activeCount} active
            </span>
          )}
        </div>
        {filters.activeCount > 0 && (
          <button
            onClick={filters.reset}
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary-600 transition-colors self-start"
          >
            <X className="w-3 h-3" />
            Clear filters
          </button>
        )}
        <div className="lg:ml-auto text-sm text-gray-500">
          Showing <strong className="text-gray-900">{showing}</strong> of {total} courses
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <FilterSelect
          label="Track"
          value={filters.track}
          onChange={v => filters.setTrack(v as Track | 'all')}
          options={[{ value: 'all', label: 'All tracks' }, ...tracks.map(t => ({ value: t.id, label: t.label }))]}
        />
        <FilterSelect
          label="Level"
          value={filters.level}
          onChange={v => filters.setLevel(v as Level | 'all')}
          options={[{ value: 'all', label: 'All levels' }, ...levels.map(l => ({ value: l.id, label: l.label }))]}
        />
        <FilterSelect
          label="Audience"
          value={filters.audience}
          onChange={v => filters.setAudience(v as Audience | 'all')}
          options={[{ value: 'all', label: 'All audiences' }, ...options.audience]}
        />
        <FilterSelect
          label="Function"
          value={filters.func}
          onChange={v => filters.setFunc(v as Func | 'all')}
          options={[{ value: 'all', label: 'All functions' }, ...options.func]}
        />
        <FilterSelect
          label="Industry"
          value={filters.industry}
          onChange={v => filters.setIndustry(v as Industry | 'all')}
          options={[{ value: 'all', label: 'All industries' }, ...options.industry]}
        />
        <FilterSelect
          label="Stack"
          value={filters.stack}
          onChange={v => filters.setStack(v as Stack | 'all')}
          options={[{ value: 'all', label: 'All stacks' }, ...options.stack]}
        />
      </div>
    </div>
  )
}

export function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-gray-500 mb-1">{label}</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full text-[13px] rounded-full px-3.5 py-2 bg-white border border-[#d2d2d7] text-gray-900 focus:outline-none focus:ring-0 focus:border-primary-600 cursor-pointer"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  )
}
