'use client'

import { ExternalLink } from 'lucide-react'

export interface PickerCourse { slug: string; title: string; code: string; level: string; lessons: number }

/**
 * Up to two courses, each from a dropdown of every published Learning Studio course (a new course appears by itself),
 * with a link that opens the chosen course in a new tab so a visitor can look before choosing (owner, 27 November 2026).
 */
export default function CoursePicker({ courses, value, onChange, fieldClass }: { courses: PickerCourse[]; value: string[]; onChange: (v: string[]) => void; fieldClass: string }) {
  const set = (i: number, slug: string) => {
    const next = [value[0] || '', value[1] || '']
    next[i] = slug
    onChange([...new Set(next.filter(Boolean))])
  }
  return (
    <div className="grid gap-4">
      {[0, 1].map((i) => {
        const chosen = value[i] || ''
        const c = courses.find((x) => x.slug === chosen)
        return (
          <div key={i}>
            <label htmlFor={`course-${i}`} className="block text-sm font-medium text-gray-900 mb-1.5">{i ? 'Second course (optional)' : 'Course'}</label>
            <select id={`course-${i}`} value={chosen} onChange={(e) => set(i, e.target.value)} required={!i} className={fieldClass}>
              <option value="">{i ? 'No second course' : 'Choose a course'}</option>
              {courses.filter((x) => x.slug !== value[i ? 0 : 1]).map((x) => <option key={x.slug} value={x.slug}>{x.title}</option>)}
            </select>
            {c && (
              <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600">
                <span>{[c.level, `${c.lessons} lessons`].filter(Boolean).join(' · ')}</span>
                <a href={`/studio/${encodeURIComponent(c.slug)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary-600 hover:underline">Explore the course <ExternalLink className="w-3 h-3" /></a>
              </p>
            )}
          </div>
        )
      })}
      <a href="/studio" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:underline">See every course in the Learning Studio <ExternalLink className="w-3.5 h-3.5" /></a>
    </div>
  )
}
