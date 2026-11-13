'use client'

import { useCallback, useState } from 'react'
import { FilterBar, type SortKey } from './CatalogControls'
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
  sort,
  desc,
  onSort,
  onDirection,
  dateSort,
}: {
  filters: CatalogFilters
  showing: number
  total: number
  className?: string
  sort?: SortKey
  desc?: boolean
  onSort?: (s: SortKey) => void
  onDirection?: () => void
  dateSort?: boolean
}) {
  const toOpts = (labels: Record<string, string>) => Object.entries(labels).map(([id, label]) => ({ id, label }))
  return (
    <div className={className}>
      <FilterBar
        quickKey="track"
        activeCount={filters.activeCount}
        onReset={filters.reset}
        sort={sort}
        desc={desc}
        onSort={onSort}
        onDirection={onDirection}
        dateSort={dateSort}
        groups={[
          { key: 'track', label: 'Track', allLabel: 'All tracks', value: filters.track, onChange: v => filters.setTrack(v as Track | 'all'), options: tracks.map(t => ({ id: t.id, label: t.label })) },
          { key: 'level', label: 'Level', allLabel: 'All levels', value: filters.level, onChange: v => filters.setLevel(v as Level | 'all'), options: levels.map(l => ({ id: l.id, label: l.label })) },
          { key: 'audience', label: 'Audience', allLabel: 'All audiences', value: filters.audience, onChange: v => filters.setAudience(v as Audience | 'all'), options: toOpts(audienceLabels) },
          { key: 'func', label: 'Function', allLabel: 'All functions', value: filters.func, onChange: v => filters.setFunc(v as Func | 'all'), options: toOpts(functionLabels) },
          { key: 'industry', label: 'Industry', allLabel: 'All industries', value: filters.industry, onChange: v => filters.setIndustry(v as Industry | 'all'), options: toOpts(industryLabels) },
          { key: 'stack', label: 'Stack', allLabel: 'All stacks', value: filters.stack, onChange: v => filters.setStack(v as Stack | 'all'), options: toOpts(stackLabels) },
        ]}
      />
      <p className="text-sm text-gray-500 -mt-4 mb-4 max-w-6xl mx-auto">
        Showing <strong className="text-gray-900">{showing}</strong> of {total} courses
      </p>
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
        className="w-full text-[13px] rounded-full px-3.5 py-2 bg-raised border border-gray-300 text-gray-900 focus:outline-none focus:ring-0 focus:border-primary-600 cursor-pointer"
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
