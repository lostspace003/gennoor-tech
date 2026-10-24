'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Clock, Layers } from 'lucide-react'
import type { Course } from '@/data/academy/types'
import { tracks, levels } from '@/data/academy/taxonomy'
import { CatalogFilterBar, useCatalogFilters } from './CatalogFilters'
import { Pagination, usePage, type SortKey } from './CatalogControls'

interface AcademyCatalogProps {
  allCourses: Course[]
}

export default function AcademyCatalog({ allCourses }: AcademyCatalogProps) {
  const filters = useCatalogFilters()
  const { matches, reset } = filters

  const [sort, setSort] = useState<SortKey>('default')
  const [desc, setDesc] = useState(false)

  const filtered = useMemo(() => {
    const list = allCourses.filter(matches)
    if (sort === 'alpha') list.sort((a, b) => a.title.localeCompare(b.title))
    if (sort === 'date') list.sort((a, b) => a.lastUpdated.localeCompare(b.lastUpdated))
    if (sort !== 'default' && desc) list.reverse()
    return list
  }, [allCourses, matches, sort, desc])

  const pg = usePage(`${filters.activeCount}|${filters.track}|${filters.level}|${filters.audience}|${filters.func}|${filters.industry}|${filters.stack}|${sort}|${desc}`, filtered.length, 9)

  return (
    <>
      {/* Filter bar */}
      <section className="py-8 lg:py-10 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div id="catalog-top" />
            <CatalogFilterBar
              filters={filters}
              showing={filtered.length}
              total={allCourses.length}
              sort={sort}
              desc={desc}
              onSort={s => { setSort(s); setDesc(s === 'date') }}
              onDirection={() => setDesc(d => !d)}
            />
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
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.slice(pg.start, pg.end).map((course) => (
                    <CourseCard key={course.slug} course={course} />
                  ))}
                </div>
                <Pagination page={pg.page} pages={pg.pages} onPage={pg.setPage} />
              </>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

function CourseCard({ course }: { course: Course }) {
  const trackInfo = tracks.find((t) => t.id === course.track)
  const levelInfo = levels.find((l) => l.id === course.level)
  const isAvailable = course.status === 'available'

  return (
    <Link
      // Interactive courses open straight into the course - no extra detail page in between.
      href={course.interactiveUrl ?? `/academy/courses/${course.slug}`}
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
        <span className="text-primary-600 font-semibold">{course.interactiveUrl ? 'Start ›' : 'View ›'}</span>
      </div>
    </Link>
  )
}

