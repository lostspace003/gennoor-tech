'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Clock, Layers, X, Filter } from 'lucide-react'
import type {
  Course,
  Track,
  Level,
  Audience,
  Func,
  Industry,
  Stack,
} from '@/data/academy/types'
import {
  tracks,
  levels,
  audienceLabels,
  functionLabels,
  industryLabels,
  stackLabels,
} from '@/data/academy/taxonomy'

interface AcademyCatalogProps {
  allCourses: Course[]
}

export default function AcademyCatalog({ allCourses }: AcademyCatalogProps) {
  const [selectedTrack, setSelectedTrack] = useState<Track | 'all'>('all')
  const [selectedLevel, setSelectedLevel] = useState<Level | 'all'>('all')
  const [selectedAudience, setSelectedAudience] = useState<Audience | 'all'>('all')
  const [selectedFunc, setSelectedFunc] = useState<Func | 'all'>('all')
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | 'all'>('all')
  const [selectedStack, setSelectedStack] = useState<Stack | 'all'>('all')

  const activeFilters = useMemo(
    () =>
      [
        selectedTrack !== 'all',
        selectedLevel !== 'all',
        selectedAudience !== 'all',
        selectedFunc !== 'all',
        selectedIndustry !== 'all',
        selectedStack !== 'all',
      ].filter(Boolean).length,
    [selectedTrack, selectedLevel, selectedAudience, selectedFunc, selectedIndustry, selectedStack],
  )

  const filtered = useMemo(() => {
    return allCourses.filter((course) => {
      if (selectedTrack !== 'all' && course.track !== selectedTrack) return false
      if (selectedLevel !== 'all' && course.level !== selectedLevel) return false
      if (selectedAudience !== 'all' && !course.audience.includes(selectedAudience)) return false
      if (selectedFunc !== 'all' && !course.functions?.includes(selectedFunc)) return false
      if (selectedIndustry !== 'all' && !course.industries?.includes(selectedIndustry)) return false
      if (selectedStack !== 'all' && !course.stack.includes(selectedStack)) return false
      return true
    })
  }, [allCourses, selectedTrack, selectedLevel, selectedAudience, selectedFunc, selectedIndustry, selectedStack])

  const reset = () => {
    setSelectedTrack('all')
    setSelectedLevel('all')
    setSelectedAudience('all')
    setSelectedFunc('all')
    setSelectedIndustry('all')
    setSelectedStack('all')
  }

  return (
    <>
      {/* Filter bar */}
      <section className="py-8 lg:py-10 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-5">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <h2 className="text-sm font-bold tracking-widest text-gray-400 uppercase">
                  Filter the catalog
                </h2>
                {activeFilters > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-primary-50 text-primary-600">
                    {activeFilters} active
                  </span>
                )}
              </div>
              {activeFilters > 0 && (
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                  Clear filters
                </button>
              )}
              <div className="lg:ml-auto text-sm text-gray-500">
                Showing <strong className="text-gray-900">{filtered.length}</strong> of{' '}
                {allCourses.length} courses
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <FilterSelect
                label="Track"
                value={selectedTrack}
                onChange={(v) => setSelectedTrack(v as Track | 'all')}
                options={[
                  { value: 'all', label: 'All tracks' },
                  ...tracks.map((t) => ({ value: t.id, label: t.label })),
                ]}
              />
              <FilterSelect
                label="Level"
                value={selectedLevel}
                onChange={(v) => setSelectedLevel(v as Level | 'all')}
                options={[
                  { value: 'all', label: 'All levels' },
                  ...levels.map((l) => ({ value: l.id, label: l.label })),
                ]}
              />
              <FilterSelect
                label="Audience"
                value={selectedAudience}
                onChange={(v) => setSelectedAudience(v as Audience | 'all')}
                options={[
                  { value: 'all', label: 'All audiences' },
                  ...Object.entries(audienceLabels).map(([v, l]) => ({ value: v, label: l })),
                ]}
              />
              <FilterSelect
                label="Function"
                value={selectedFunc}
                onChange={(v) => setSelectedFunc(v as Func | 'all')}
                options={[
                  { value: 'all', label: 'All functions' },
                  ...Object.entries(functionLabels).map(([v, l]) => ({ value: v, label: l })),
                ]}
              />
              <FilterSelect
                label="Industry"
                value={selectedIndustry}
                onChange={(v) => setSelectedIndustry(v as Industry | 'all')}
                options={[
                  { value: 'all', label: 'All industries' },
                  ...Object.entries(industryLabels).map(([v, l]) => ({ value: v, label: l })),
                ]}
              />
              <FilterSelect
                label="Stack"
                value={selectedStack}
                onChange={(v) => setSelectedStack(v as Stack | 'all')}
                options={[
                  { value: 'all', label: 'All stacks' },
                  ...Object.entries(stackLabels).map(([v, l]) => ({ value: v, label: l })),
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Course grid */}
      <section className="py-8 lg:py-12 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {filtered.length === 0 ? (
              <div className="rounded-2xl p-10 glass-card text-center">
                <p className="text-base text-gray-600 mb-4">
                  No courses match those filters yet.
                </p>
                <p className="text-sm text-gray-500 mb-5">
                  More courses are shipping throughout 2026. Or — if your specific need
                  isn&apos;t here, we build custom courses for client engagements.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <button
                    onClick={reset}
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-semibold rounded-xl text-gray-700 glass-card hover:border-primary-200 transition-all"
                  >
                    Clear filters
                  </button>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-semibold rounded-xl text-white bg-primary-600 transition-all"
                  >
                    Talk to us about a custom course
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((course) => (
                  <CourseCard key={course.slug} course={course} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

function FilterSelect({
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
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-[13px] rounded-full px-3.5 py-2 bg-white border border-[#d2d2d7] text-gray-900 focus:outline-none focus:ring-0 focus:border-primary-600 cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function CourseCard({ course }: { course: Course }) {
  const trackInfo = tracks.find((t) => t.id === course.track)
  const levelInfo = levels.find((l) => l.id === course.level)
  const isAvailable = course.status === 'available'

  return (
    <Link
      href={`/academy/courses/${course.slug}`}
      className="group rounded-[18px] px-6 py-[26px] bg-white border border-[#e8e8ed] hover:border-[#d2d2d7] transition-colors duration-200 flex flex-col h-full"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-primary-600">
          {trackInfo?.label ?? course.track}
          <span className="text-[#86868b]"> · {levelInfo?.label ?? course.level}</span>
          {course.interactiveUrl && <span className="text-[#1d8348]"> · Interactive</span>}
        </span>
        {!isAvailable && (
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#9a6700] flex-shrink-0">
            {course.status === 'coming-soon' ? 'Coming soon' : 'In development'}
          </span>
        )}
      </div>
      <h3 className="text-[17px] font-bold tracking-[-0.01em] text-gray-900 mb-2 leading-[1.25]">
        {course.title}
      </h3>
      <p className="text-[13px] text-[#6e6e73] leading-normal mb-4 flex-grow">
        {course.hookSentence}
      </p>
      <div className="flex items-center justify-between text-xs text-[#86868b] pt-3 border-t border-[#f0f0f2]">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="w-3 h-3" /> {course.duration}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Layers className="w-3 h-3" /> {course.chapterCount} chapters
        </span>
        <span className="text-primary-600 font-semibold">View ›</span>
      </div>
    </Link>
  )
}

