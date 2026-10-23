'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Filter, Layers, Play, X } from 'lucide-react'
import type { LmsCourseCard } from '@/lib/lms'
import PreviewModal from './PreviewModal'
import { Stars } from './Stars'
import { ALL_PLATFORMS, DOMAINS, KINDS, LEVELS, PRIMARY_PLATFORMS, TOPICS } from '@/lib/lms-taxonomy'

const KIND_LABEL: Record<string, string> = Object.fromEntries(KINDS.map(k => [k.id, k.label]))

function FilterRow({ label, items, active, onSelect }: { label: string; items: { id: string; label: string; count?: number }[]; active: string; onSelect: (id: string) => void }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-xs font-semibold text-gray-500 w-20 flex-shrink-0">{label}</span>
      <div className="flex flex-wrap gap-2">
        {items.map(item => {
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              aria-pressed={isActive}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                isActive ? 'bg-primary-600 text-white shadow-sm' : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-primary-300 hover:text-primary-700'
              }`}
            >
              {item.label}
              {item.count !== undefined && <span className={`ml-1.5 tabular-nums ${isActive ? 'text-white/80' : item.count === 0 ? 'text-gray-300' : 'text-gray-400'}`}>{item.count}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function LabsCatalog({ courses }: { courses: LmsCourseCard[] }) {
  const [vendor, setVendor] = useState('all')
  const [kind, setKind] = useState('all')
  const [level, setLevel] = useState('all')
  const [topic, setTopic] = useState('all')
  const [domain, setDomain] = useState('all')
  const [more, setMore] = useState(false)

  // /studio?company=Claude (linked from the Claude page) opens with that company selected
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get('company')
    if (c) setVendor(c)
  }, [])
  const [preview, setPreview] = useState<LmsCourseCard | null>(null)

  // Always offer the platforms we are building towards, plus any other platform that has a course.
  const vendors = useMemo(() => [...PRIMARY_PLATFORMS as readonly string[], ...ALL_PLATFORMS.filter(p => !(PRIMARY_PLATFORMS as readonly string[]).includes(p) && courses.some(c => c.vendor === p)), ...Array.from(new Set(courses.map(c => c.vendor))).filter(v => !ALL_PLATFORMS.includes(v))], [courses])
  const levels = useMemo(() => [...LEVELS as readonly string[], ...Array.from(new Set(courses.map(c => c.level))).filter(l => l && !(LEVELS as readonly string[]).includes(l))], [courses])

  const matches = (c: LmsCourseCard, skip?: string) =>
    (skip === 'vendor' || vendor === 'all' || c.vendor === vendor) &&
    (skip === 'kind' || kind === 'all' || c.kind === kind) &&
    (skip === 'level' || level === 'all' || c.level === level) &&
    (skip === 'topic' || topic === 'all' || c.topics.includes(topic)) &&
    (skip === 'domain' || domain === 'all' || c.domains.includes(domain))
  const filtered = courses.filter(c => matches(c))
  // Each chip's count is "how many courses you would see if you picked it", given the other filters.
  const count = (skip: string, test: (c: LmsCourseCard) => boolean) => courses.filter(c => matches(c, skip) && test(c)).length
  const activeCount = [vendor, kind, level, topic, domain].filter(v => v !== 'all').length
  const reset = () => { setVendor('all'); setKind('all'); setLevel('all'); setTopic('all'); setDomain('all') }

  const grouped = useMemo(
    () => vendors.map(v => ({ vendor: v, items: filtered.filter(c => c.vendor === v) })).filter(g => g.items.length > 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [vendors, vendor, kind, level, topic, domain, courses],
  )

  return (
    <section className="section-padding relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900 mb-3">Available Courses</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {courses.length} certification and project courses, taught hands-on. Filter by company, type, level, topic or domain.
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
              <button type="button" onClick={reset} className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                <X className="w-3 h-3" />
                Clear {activeCount} filter{activeCount > 1 ? 's' : ''}
              </button>
            )}
          </div>
          <div className="space-y-3">
            <FilterRow label="Company" items={[{ id: 'all', label: 'All companies', count: count('vendor', () => true) }, ...vendors.map(v => ({ id: v, label: v, count: count('vendor', c => c.vendor === v) }))]} active={vendor} onSelect={setVendor} />
            <FilterRow label="Type" items={[{ id: 'all', label: 'All types', count: count('kind', () => true) }, ...KINDS.map(k => ({ id: k.id as string, label: k.label, count: count('kind', c => c.kind === k.id) }))]} active={kind} onSelect={setKind} />
            <FilterRow label="Level" items={[{ id: 'all', label: 'All levels', count: count('level', () => true) }, ...levels.map(l => ({ id: l, label: l, count: count('level', c => c.level === l) }))]} active={level} onSelect={setLevel} />
            {(more || topic !== 'all' || domain !== 'all') && (
              <>
                <FilterRow label="Topic" items={[{ id: 'all', label: 'All topics', count: count('topic', () => true) }, ...TOPICS.map(t => ({ id: t as string, label: t, count: count('topic', c => c.topics.includes(t)) }))]} active={topic} onSelect={setTopic} />
                <FilterRow label="Domain" items={[{ id: 'all', label: 'All domains', count: count('domain', () => true) }, ...DOMAINS.map(d => ({ id: d as string, label: d, count: count('domain', c => c.domains.includes(d)) }))]} active={domain} onSelect={setDomain} />
              </>
            )}
          </div>
          <button type="button" onClick={() => setMore(m => !m)} className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors">
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${more ? 'rotate-180' : ''}`} />
            {more ? 'Fewer filters' : 'More filters: topic and domain'}
          </button>
        </div>

        <div className="max-w-6xl mx-auto mb-6 text-sm text-gray-500 text-center">
          {filtered.length === courses.length ? `Showing all ${courses.length} courses` : `${filtered.length} of ${courses.length} courses match`}
        </div>

        {filtered.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-16">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Filter className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-700 font-semibold mb-2">
              {vendor !== 'all' && courses.every(c => c.vendor === vendor ? false : true) ? `${vendor} courses are coming soon` : 'No courses match these filters'}
            </p>
            <p className="text-sm text-gray-500 mb-5">Try removing a filter, or show everything.</p>
            <button type="button" onClick={reset} className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors">
              <X className="w-4 h-4" />
              Clear filters
            </button>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-12">
            {grouped.map(group => (
              <div key={group.vendor}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                    <Layers className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-gray-900">{group.vendor}</h3>
                    <p className="text-xs text-gray-500">{group.items.length} course{group.items.length > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.items.map(c => (
                    <div
                      key={c.slug}
                      className="group relative bg-white rounded-2xl overflow-hidden border border-[#e2e5ec] flex flex-col transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(15,24,36,.35)] focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-primary-600"
                    >
                      <div className="relative aspect-video bg-[#0f1824] overflow-hidden">
                        {c.thumbnailUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={c.thumbnailUrl} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/80 text-3xl font-bold tracking-tight">{c.code}</div>
                        )}
                        <span className="absolute left-3 top-3 rounded-full bg-black/55 backdrop-blur px-3 py-1 text-[12px] font-medium text-white">{c.vendor}</span>
                      </div>
                      {c.promoUrl && (
                        <button
                          type="button"
                          onClick={() => setPreview(c)}
                          className="relative z-10 flex items-center justify-center gap-2 py-2.5 border-b border-[#eef0f4] bg-[#f8f9fb] text-[13.5px] font-semibold text-gray-900 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                        >
                          <Play className="w-4 h-4 fill-current" /> Watch preview
                        </button>
                      )}
                      <div className="p-5 flex flex-col flex-1">
                        <p className="text-[12.5px] text-[#6e6e73]">{KIND_LABEL[c.kind] || c.kind}, {c.level.toLowerCase()}</p>
                        <h4 className="font-heading font-bold text-[18px] leading-snug tracking-[-0.01em] text-gray-900 mt-1.5">
                          <Link href={`/studio/${c.slug}`} className="after:absolute after:inset-0 focus:outline-none">{c.title}</Link>
                        </h4>
                        <p className="text-[14px] leading-[1.5] text-[#6e6e73] mt-2 line-clamp-2">{c.subtitle}</p>
                        {c.rating && (
                          <p className="mt-3 flex items-center gap-1.5 text-[13px] text-[#6e6e73]">
                            <span className="font-semibold text-gray-900 tabular-nums">{c.rating.average.toFixed(1)}</span>
                            <Stars value={c.rating.average} size={13} />
                            <span>({c.rating.count})</span>
                          </p>
                        )}
                        <p className="text-[13px] text-[#86868b] mt-auto pt-4 tabular-nums">
                          {c.lectures} lessons{c.hours ? `, ${c.hours} hours` : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {preview?.promoUrl && <PreviewModal title={preview.title} src={preview.promoUrl} poster={preview.thumbnailUrl} onClose={() => setPreview(null)} />}
    </section>
  )
}
