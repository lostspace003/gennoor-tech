'use client'

import { useMemo, useState } from 'react'
import { X, Filter, Layers } from 'lucide-react'
import CourseCard from './CourseCard'
import type { Course as ConfigCourse } from '@/config/courses'
import type { Course as AcademyCourse } from '@/data/academy/types'
import type { Audience, Industry, Level } from '@/data/academy/types'
import { tracks, levels, audienceLabels, industryLabels } from '@/data/academy/taxonomy'

export interface EnrichedCourse {
  config: ConfigCourse
  meta: AcademyCourse | undefined
}

interface Props {
  courses: EnrichedCourse[]
}

const TRACK_ORDER = ['foundations', 'function', 'leadership', 'industry', 'builder', 'applied'] as const

export default function InteractiveCoursesCatalog({ courses }: Props) {
  const [level, setLevel] = useState<Level | 'all'>('all')
  const [audience, setAudience] = useState<Audience | 'all'>('all')
  const [industry, setIndustry] = useState<Industry | 'all'>('all')

  // Which filters are available based on what courses actually exist
  const availableLevels = useMemo(() => {
    const seen = new Set<Level>()
    courses.forEach(c => { if (c.meta?.level) seen.add(c.meta.level) })
    return levels.filter(l => seen.has(l.id))
  }, [courses])

  const availableAudiences = useMemo(() => {
    const seen = new Set<Audience>()
    courses.forEach(c => c.meta?.audience.forEach(a => seen.add(a)))
    return (Object.keys(audienceLabels) as Audience[]).filter(a => seen.has(a))
  }, [courses])

  const availableIndustries = useMemo(() => {
    const seen = new Set<Industry>()
    courses.forEach(c => c.meta?.industries?.forEach(i => seen.add(i)))
    return (Object.keys(industryLabels) as Industry[]).filter(i => seen.has(i))
  }, [courses])

  const filtered = useMemo(() => {
    return courses.filter(c => {
      if (!c.meta) return false
      if (level !== 'all' && c.meta.level !== level) return false
      if (audience !== 'all' && !c.meta.audience.includes(audience)) return false
      if (industry !== 'all' && !c.meta.industries?.includes(industry)) return false
      return true
    })
  }, [courses, level, audience, industry])

  // Group by track
  const grouped = useMemo(() => {
    const map = new Map<string, EnrichedCourse[]>()
    filtered.forEach(c => {
      const track = c.meta?.track ?? 'other'
      const arr = map.get(track) ?? []
      arr.push(c)
      map.set(track, arr)
    })
    return TRACK_ORDER
      .filter(t => map.has(t))
      .map(t => ({
        trackId: t,
        info: tracks.find(x => x.id === t)!,
        items: map.get(t) ?? [],
      }))
  }, [filtered])

  const activeCount = [level !== 'all', audience !== 'all', industry !== 'all'].filter(Boolean).length

  const reset = () => {
    setLevel('all')
    setAudience('all')
    setIndustry('all')
  }

  return (
    <section id="courses" className="section-padding relative">
      <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl font-bold text-gray-900 mb-3">Available Interactive Courses</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {courses.length} fully interactive courses with slides, audio narration, and progress tracking.
            Filter by level, audience, or industry — or browse by track below.
          </p>
        </div>

        {/* Filter bar */}
        <div className="max-w-6xl mx-auto mb-10">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-bold tracking-widest text-gray-400 uppercase">Filter</span>
            </div>
            {activeCount > 0 && (
              <button
                onClick={reset}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                <X className="w-3 h-3" />
                Clear {activeCount} filter{activeCount > 1 ? 's' : ''}
              </button>
            )}
          </div>

          <div className="space-y-3">
            <FilterRow label="Level" items={[{ id: 'all' as const, label: 'All levels' }, ...availableLevels.map(l => ({ id: l.id, label: l.label }))]} active={level} onSelect={(id) => setLevel(id as Level | 'all')} />
            <FilterRow label="Audience" items={[{ id: 'all' as const, label: 'All audiences' }, ...availableAudiences.map(a => ({ id: a, label: audienceLabels[a] }))]} active={audience} onSelect={(id) => setAudience(id as Audience | 'all')} />
            <FilterRow label="Industry" items={[{ id: 'all' as const, label: 'All industries' }, ...availableIndustries.map(i => ({ id: i, label: industryLabels[i] }))]} active={industry} onSelect={(id) => setIndustry(id as Industry | 'all')} />
          </div>
        </div>

        {/* Result count */}
        <div className="max-w-6xl mx-auto mb-6 text-sm text-gray-500 text-center">
          {filtered.length === courses.length
            ? `Showing all ${courses.length} interactive courses`
            : `${filtered.length} of ${courses.length} courses match`}
        </div>

        {/* Grouped grid */}
        {filtered.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-16">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Filter className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-700 font-semibold mb-2">No courses match these filters</p>
            <p className="text-sm text-gray-500 mb-5">Try removing one filter, or reset.</p>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors"
            >
              <X className="w-4 h-4" />
              Clear filters
            </button>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-12">
            {grouped.map(group => (
              <div key={group.trackId}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                    <Layers className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-gray-900">{group.info.label}</h3>
                    <p className="text-xs text-gray-500">{group.info.tagline} · {group.items.length} course{group.items.length > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.items.map(c => (
                    <CourseCard key={c.config.id} course={c.config} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

interface FilterRowProps {
  label: string
  items: Array<{ id: string; label: string }>
  active: string
  onSelect: (id: string) => void
}

function FilterRow({ label, items, active, onSelect }: FilterRowProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-xs font-semibold text-gray-500 w-20 flex-shrink-0">{label}</span>
      <div className="flex flex-wrap gap-2">
        {items.map(item => {
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                isActive
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-primary-300 hover:text-primary-700'
              }`}
            >
              {item.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
