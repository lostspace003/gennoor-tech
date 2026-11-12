'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Filter, Layers, Play, X } from 'lucide-react'
import { FilterBar, Pagination, usePage, type SortKey } from './CatalogControls'
import type { LmsCourseCard } from '@/lib/lms'
import PromoPlayer from './PromoPlayer'
import { Stars } from './Stars'
import { EMPTY_CUSTOM, TRACKS, mergedOptions, type CustomTaxonomy } from '@/lib/lms-taxonomy'

export default function LabsCatalog({ courses, custom = EMPTY_CUSTOM }: { courses: LmsCourseCard[]; custom?: CustomTaxonomy }) {
  // built-in options plus the ones the admin created
  const opt = useMemo(() => mergedOptions(custom), [custom])
  const KINDS = opt.kinds
  const KIND_LABEL: Record<string, string> = Object.fromEntries(KINDS.map(k => [k.id, k.label]))
  const [vendor, setVendor] = useState('all')
  const [kind, setKind] = useState('all')
  const [area, setArea] = useState('all')
  const [level, setLevel] = useState('all')
  const [topic, setTopic] = useState('all')
  const [domain, setDomain] = useState('all')
  const [sort, setSort] = useState<SortKey>('default')
  const [desc, setDesc] = useState(false)
  // Slug of the card playing its preview in place. One at a time.
  const [preview, setPreview] = useState<string | null>(null)

  // /studio?company=Claude (linked from the Claude page) opens with that company selected
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get('company')
    if (c) setVendor(c)
  }, [])

  // Only offer what exists: a chip never leads to an empty page.
  const inOrder = (order: readonly string[], have: string[]) => [...order.filter(o => have.includes(o)), ...have.filter(h => h && !order.includes(h))]
  const uniq = (xs: string[]) => Array.from(new Set(xs))
  const vendors = useMemo(() => inOrder(opt.vendors, uniq(courses.map(c => c.vendor))), [courses, opt])
  const levels = useMemo(() => inOrder(opt.levels, uniq(courses.map(c => c.level))), [courses, opt])
  const topics = useMemo(() => opt.topics.filter(t => courses.some(c => c.topics.includes(t))), [courses, opt])
  const domains = useMemo(() => opt.domains.filter(d => courses.some(c => c.domains.includes(d))), [courses, opt])
  const kinds = useMemo(() => KINDS.filter(k => courses.some(c => c.kind === k.id)), [courses, KINDS])
  const areas = useMemo(() => TRACKS.filter(t => courses.some(c => c.track === t.id)), [courses])

  const filtered = courses.filter(c =>
    (vendor === 'all' || c.vendor === vendor) &&
    (kind === 'all' || c.kind === kind) &&
    (area === 'all' || c.track === area) &&
    (level === 'all' || c.level === level) &&
    (topic === 'all' || c.topics.includes(topic)) &&
    (domain === 'all' || c.domains.includes(domain)),
  )
  const activeCount = [vendor, kind, area, level, topic, domain].filter(v => v !== 'all').length
  const reset = () => { setVendor('all'); setKind('all'); setArea('all'); setLevel('all'); setTopic('all'); setDomain('all') }

  // Default order: certification prep, then projects, then use cases. Alphabetical / date sorts run across all types.
  const ordered = useMemo(() => {
    const list = sort === 'default' ? KINDS.flatMap(k => filtered.filter(c => c.kind === k.id)) : [...filtered]
    if (sort === 'alpha') list.sort((x, y) => x.title.localeCompare(y.title))
    if (sort === 'date') list.sort((x, y) => (x.updatedAt || '').localeCompare(y.updatedAt || ''))
    if (sort !== 'default' && desc) list.reverse()
    return list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendor, kind, area, level, topic, domain, courses, sort, desc, KINDS])
  const pg = usePage(`${vendor}|${kind}|${area}|${level}|${topic}|${domain}|${sort}|${desc}`, ordered.length, 9)
  const pageItems = ordered.slice(pg.start, pg.end)
  // A preview stops when its card leaves the page, so it never comes back playing with sound.
  const previewShown = pageItems.some(c => c.slug === preview)
  useEffect(() => { if (preview && !previewShown) setPreview(null) }, [preview, previewShown])
  const grouped = useMemo(
    () => KINDS.map(k => ({ id: k.id as string, label: k.label as string, items: pageItems.filter(c => c.kind === k.id) })).filter(g => g.items.length > 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ordered, pg.page],
  )
  const KIND_LINE: Record<string, string> = {
    certification: 'Prepare for the exam and build the real thing',
    project: 'Build one real project from start to finish',
    course: 'One business problem, taught end to end',
  }

  return (
    <section className="section-padding relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900 mb-3">Available Courses</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {courses.length} video courses: certification prep, projects and use cases. Filter by type, company, level or topic.
          </p>
        </div>

        <div id="catalog-top" />
        <FilterBar
          quickKey="kind"
          activeCount={activeCount}
          onReset={reset}
          sort={sort}
          desc={desc}
          onSort={s => { setSort(s); setDesc(s === 'date') }}
          onDirection={() => setDesc(d => !d)}
          groups={[
            { key: 'kind', label: 'Type', allLabel: 'All types', value: kind, onChange: setKind, options: kinds.map(k => ({ id: k.id, label: k.label })) },
            ...(areas.length > 0 ? [{ key: 'area', label: 'Area', allLabel: 'All areas', value: area, onChange: setArea, options: areas.map(t => ({ id: t.id as string, label: t.label as string })) }] : []),
            ...(vendors.length > 1 ? [{ key: 'vendor', label: 'Company', allLabel: 'All companies', value: vendor, onChange: setVendor, options: vendors.map(v => ({ id: v, label: v })) }] : []),
            ...(levels.length > 1 ? [{ key: 'level', label: 'Level', allLabel: 'All levels', value: level, onChange: setLevel, options: levels.map(l => ({ id: l, label: l })) }] : []),
            ...(topics.length > 0 ? [{ key: 'topic', label: 'Topic', allLabel: 'All topics', value: topic, onChange: setTopic, options: topics.map(t => ({ id: t as string, label: t as string })) }] : []),
            ...(domains.length > 0 ? [{ key: 'domain', label: 'Industry', allLabel: 'All industries', value: domain, onChange: setDomain, options: domains.map(d => ({ id: d as string, label: d as string })) }] : []),
          ]}
        />

        <div className="max-w-6xl mx-auto mb-6 text-sm text-gray-500 text-center">
          {filtered.length === courses.length ? `${courses.length} courses` : `${filtered.length} of ${courses.length} courses match`}{ordered.length > 9 ? `, showing ${pg.start + 1}-${Math.min(pg.end, ordered.length)}` : ''}
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
              <div key={group.id}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                    <Layers className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-gray-900">{group.label}</h3>
                    <p className="text-xs text-gray-500">{KIND_LINE[group.id]} · {group.items.length} course{group.items.length > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.items.map(c => (
                    <div
                      key={c.slug}
                      className="group relative bg-white rounded-2xl overflow-hidden border border-[#e2e5ec] flex flex-col transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(15,24,36,.35)] focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-primary-600"
                    >
                      <div className="relative aspect-video bg-[#0f1824] overflow-hidden">
                        {preview === c.slug && c.promoUrl ? (
                          // Above the card's stretched link, so clicks reach the player
                          <div className="relative z-10">
                            <PromoPlayer src={c.promoUrl} poster={c.thumbnailUrl} startMuted={false} framed={false} />
                          </div>
                        ) : (
                          <>
                            {c.thumbnailUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={c.thumbnailUrl} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white/80 text-3xl font-bold tracking-tight">{c.code}</div>
                            )}
                            <span className="absolute left-3 top-3 rounded-full bg-black/55 backdrop-blur px-3 py-1 text-[12px] font-medium text-white">{c.vendor}</span>
                          </>
                        )}
                      </div>
                      {c.promoUrl && (
                        <button
                          type="button"
                          onClick={() => setPreview(preview === c.slug ? null : c.slug)}
                          className="relative z-10 flex items-center justify-center gap-2 py-2.5 border-b border-[#eef0f4] bg-[#f8f9fb] text-[13.5px] font-semibold text-gray-900 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                        >
                          {preview === c.slug ? <><X className="w-4 h-4" /> Close preview</> : <><Play className="w-4 h-4 fill-current" /> Watch preview</>}
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
                          {c.lectures} lessons{c.hours ? `, ${c.hours} hours` : ''}{c.priceUsd ? ` · $${c.priceUsd.toFixed(2)}, free previews` : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <Pagination page={pg.page} pages={pg.pages} onPage={pg.setPage} />
          </div>
        )}
      </div>
    </section>
  )
}
