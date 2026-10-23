'use client'

import { useMemo, useState } from 'react'
import { Search, X, Download, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { bootcamps } from '@/data/training-programs'
import { allCoursePdfs, type CoursePdf, type Track } from '@/data/course-pdfs'
import TrainingCard from '@/components/training/TrainingCard'

/**
 * Training page in the Apple idiom, per the redesign handoff:
 * centered display hero, a segmented All/Bootcamps/Courses catalog on the
 * #f5f5f7 panel, hairline Delivery and Certification grids, quiet FAQ, and
 * the "Not sure where to start?" CTA. Every existing feature survives —
 * search, level filter, track chips, curriculum PDF viewer + downloads,
 * content/enquiry modals.
 */

const TRACK_ORDER: Track[] = ['foundations', 'function', 'leadership', 'industry', 'builder']
const TRACK_LABEL: Record<Track, string> = {
  foundations: 'Foundations',
  function: 'By Function',
  leadership: 'Leadership',
  industry: 'By Industry',
  builder: 'Builder',
}

type Tab = 'All' | 'Bootcamps' | 'Courses'

export default function TrainingPage() {
  const [tab, setTab] = useState<Tab>('All')
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState<string>('all')
  const [track, setTrack] = useState<Track | 'all'>('all')

  const filteredBootcamps = useMemo(() => {
    const q = search.trim().toLowerCase()
    return bootcamps.filter(b => {
      if (q && !(b.title.toLowerCase().includes(q) || b.description.toLowerCase().includes(q))) return false
      if (level !== 'all' && b.level !== level) return false
      return true
    })
  }, [search, level])

  const filteredCourses = useMemo(() => {
    const q = search.trim().toLowerCase()
    return allCoursePdfs.filter(c => {
      if (q && !(c.title.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q))) return false
      if (track !== 'all' && c.track !== track) return false
      return true
    })
  }, [search, track])

  const showBootcamps = tab !== 'Courses'
  const showCourses = tab !== 'Bootcamps'
  const shownCount = (showBootcamps ? filteredBootcamps.length : 0) + (showCourses ? filteredCourses.length : 0)
  const hasFilters = search !== '' || level !== 'all' || track !== 'all'

  return (
    <main className="min-h-screen">
      {/* ===== Hero ===== */}
      <section className="bg-white px-8 pt-20 lg:pt-[110px] pb-[72px] text-center">
        <h1 className="text-[clamp(40px,4.8vw,64px)] leading-[1.06] tracking-[-0.03em] font-bold text-gray-900 max-w-[760px] mx-auto">
          Programs we teach.
        </h1>
        <p className="text-[clamp(18px,1.8vw,22px)] leading-[1.45] text-[#6e6e73] max-w-[620px] mx-auto mt-[22px]">
          {bootcamps.length} bootcamps and {allCoursePdfs.length} instructor-led courses, from leaders to engineers.
          Every program is adapted to your team and the work they do.
        </p>
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-[22px] justify-center items-center mt-8">
          <Link href="/contact#book" className="pill-primary-sm">
            Plan a cohort
          </Link>
          <Link href="/studio" className="text-[15px] font-medium text-primary-600 hover:text-[#0077ed]">
            Learning Studio ›
          </Link>
        </div>
      </section>

      {/* ===== Catalog ===== */}
      <section id="catalog" className="bg-[#f5f5f7] px-8 pt-14 pb-24 scroll-mt-24">
        <div className="max-w-[1080px] mx-auto">
          {/* Toolbar — segmented control + count */}
          <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
            <div className="flex bg-[#e8e8ed] rounded-full p-[3px]">
              {(['All', 'Bootcamps', 'Courses'] as Tab[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`text-[13px] font-semibold px-[18px] py-[7px] rounded-full transition-all duration-200 ${
                    tab === t
                      ? 'bg-white text-gray-900 shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                      : 'bg-transparent text-[#6e6e73]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="text-[13px] text-[#86868b]">{shownCount} programs</div>
          </div>

          {/* Quiet filters — search, level (bootcamps), track (courses) */}
          <div className="flex flex-wrap items-center gap-2.5 mb-7">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86868b] w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Search programs…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-[220px] pl-9 pr-4 py-[7px] text-[13px] bg-white border border-[#d2d2d7] rounded-full text-gray-900 placeholder:text-[#86868b] focus:border-primary-600 focus:ring-0"
              />
            </div>
            {showBootcamps && (
              <select
                value={level}
                onChange={e => setLevel(e.target.value)}
                className="pl-4 pr-8 py-[7px] text-[13px] bg-white border border-[#d2d2d7] rounded-full text-[#6e6e73] focus:border-primary-600 focus:ring-0"
                aria-label="Filter bootcamps by level"
              >
                <option value="all">All levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Executive">Executive</option>
              </select>
            )}
            {showCourses && (
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setTrack('all')}
                  className={`px-3.5 py-[7px] text-xs font-semibold rounded-full transition-colors ${
                    track === 'all' ? 'bg-gray-900 text-white' : 'bg-white text-[#6e6e73] border border-[#d2d2d7]'
                  }`}
                >
                  All tracks
                </button>
                {TRACK_ORDER.map(t => (
                  <button
                    key={t}
                    onClick={() => setTrack(t)}
                    className={`px-3.5 py-[7px] text-xs font-semibold rounded-full transition-colors ${
                      track === t ? 'bg-gray-900 text-white' : 'bg-white text-[#6e6e73] border border-[#d2d2d7]'
                    }`}
                  >
                    {TRACK_LABEL[t]}
                  </button>
                ))}
              </div>
            )}
            {hasFilters && (
              <button
                onClick={() => { setSearch(''); setLevel('all'); setTrack('all') }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-[#0077ed]"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>

          {/* Card grid — bootcamps first, then courses (prototype order) */}
          {shownCount > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {showBootcamps &&
                filteredBootcamps.map(program => <TrainingCard key={program.id} program={program} />)}
              {showCourses && filteredCourses.map(c => <CoursePdfCard key={c.slug} course={c} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-[#6e6e73] text-sm">
              No programs match your filters.
            </div>
          )}
        </div>
      </section>

      {/* ===== Delivery ===== */}
      <section className="bg-white px-8 py-16 lg:py-24">
        <div className="max-w-[1080px] mx-auto">
          <h2 className="display-card text-center mb-12">Delivered your way.</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-[#e8e8ed] border border-[#e8e8ed] rounded-[18px] overflow-hidden">
            {[
              {
                title: 'On-site',
                body: 'An instructor at your office, with labs in your own environment.',
              },
              {
                title: 'Live virtual',
                body: 'Live sessions online, with hands-on labs.',
              },
              {
                title: 'Hybrid',
                body: 'Leadership sessions on site, technical sessions online. One curriculum.',
              },
            ].map(cell => (
              <div key={cell.title} className="bg-white px-7 py-8">
                <div className="text-[18px] font-bold text-gray-900 mb-2">{cell.title}</div>
                <div className="text-sm leading-[1.55] text-[#6e6e73]">{cell.body}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-[13px] text-[#86868b] mt-6">
            We are based in Mumbai, India.{' '}
            <Link href="/contact" className="text-primary-600 font-medium hover:text-[#0077ed]">
              Plan a session ›
            </Link>
          </p>
        </div>
      </section>

      {/* ===== Certification prep ===== */}
      <section className="bg-[#f5f5f7] px-8 py-16 lg:py-24">
        <div className="max-w-[1080px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="display-card mb-3">Certification exam preparation.</h2>
            <p className="text-[17px] text-[#6e6e73] max-w-[560px] mx-auto">
              Preparation for Microsoft, Google Cloud, AWS and GitHub exams.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Microsoft', certs: ['AI-901, AI-103, AI-300', 'AB-100, AB-730, AB-731', 'AZ + PL platform series'] },
              { name: 'Google Cloud', certs: ['Cloud Digital Leader', 'ML Engineer', 'Cloud Architect'] },
              { name: 'AWS', certs: ['Cloud Practitioner', 'AI Practitioner', 'ML Engineer + Specialty'] },
              { name: 'GitHub', certs: ['GH-900 Foundations', 'GH-300 Actions', 'GH-200 Copilot'] },
            ].map(p => (
              <div key={p.name} className="bg-white border border-[#e8e8ed] rounded-[18px] px-6 py-6">
                <h3 className="text-[15px] font-bold text-gray-900 mb-2.5">{p.name}</h3>
                <ul className="space-y-1.5 text-[12.5px] text-[#6e6e73]">
                  {p.certs.map(c => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center mt-9">
            <Link href="/services/certifications" className="link-arrow">
              View all certification programs ›
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="bg-white px-8 py-16 lg:py-24">
        <div className="max-w-[720px] mx-auto">
          <h2 className="display-card text-center mb-12">Questions, answered.</h2>
          <div className="border-t border-[#e8e8ed]">
            {[
              { question: 'How does the 2-day curriculum work?', answer: 'Each curriculum is an instructor-led 2-day (16-hour) course delivered on-site or virtual to your team. The PDF is the full curriculum document — outcomes, modules, topic breakdown — that you can review before booking. Customised to your industry, your data, your tools.' },
              { question: 'What\'s the difference between a 2-day curriculum and a longer bootcamp?', answer: '2-day curriculum courses are focused, single-topic intensives — one core skill mastered across 16 hours. Bootcamps are 3–10 day deep dives that combine multiple skills and include hands-on labs on your live environment. Most teams start with a 2-day course and scale up from there.' },
              { question: 'How are bootcamps customised?', answer: 'Every bootcamp is tailored to your industry, tech stack, and team skill level. We conduct a pre-training assessment to understand your goals and design the curriculum around your specific use cases and data.' },
              { question: 'What is the minimum batch size?', answer: 'Five participants minimum. Max 15–20 for personalised attention. For larger groups we run parallel batches.' },
              { question: 'Do you include certification preparation?', answer: 'Yes, many bootcamps include preparation for Microsoft, AWS, Google Cloud and GitHub exams.' },
              { question: 'Can the training be built around our work?', answer: 'Yes. We start from what your people do every day and use your own examples wherever you allow it.' },
            ].map(faq => (
              <details key={faq.question} className="group border-b border-[#e8e8ed] py-5">
                <summary className="relative cursor-pointer list-none pr-8 text-[16px] font-semibold text-gray-900">
                  {faq.question}
                </summary>
                <p className="text-sm text-[#6e6e73] mt-3 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-[#f5f5f7] px-8 py-[90px] text-center">
        <h2 className="display-card">Not sure where to start?</h2>
        <p className="text-[18px] text-[#6e6e73] mt-3 mb-7 max-w-[480px] mx-auto">
          Tell us what your team needs to be able to do. We will suggest a program and a format.
        </p>
        <Link href="/contact" className="pill-primary-sm">
          Talk to us
        </Link>
      </section>
    </main>
  )
}

// =====================================================================
// COURSE-PDF CARD — the prototype program card, Course flavour.
// Keeps the curriculum viewer link and the direct PDF download.
// =====================================================================

function CoursePdfCard({ course }: { course: CoursePdf }) {
  const viewerUrl = `/services/training/curriculum/${course.slug}`
  const pdfUrl = `/api/content/courses/pdfs/${course.slug}.pdf`
  return (
    <div className="bg-white border border-[#e8e8ed] hover:border-[#d2d2d7] rounded-[18px] px-6 py-[26px] flex flex-col transition-colors">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#86868b]">Course</span>
        <span className="text-[11px] font-semibold text-primary-600">{course.trackLabel}</span>
      </div>
      <h3 className="text-[17px] font-bold leading-[1.25] text-gray-900 mb-1.5">{course.title}</h3>
      <div className="text-[12.5px] text-[#86868b] mb-2.5">
        {course.duration} · {course.modules.length} modules · Instructor-led
      </div>
      <p className="text-[13px] leading-normal text-[#6e6e73] mb-3.5">{course.subtitle}</p>
      <div className="border-t border-[#f0f0f2] pt-3 mt-auto flex items-center justify-between">
        <Link
          href={viewerUrl}
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary-600 hover:text-[#0077ed]"
        >
          View curriculum
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <a
          href={pdfUrl}
          download={`${course.slug}.pdf`}
          className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#6e6e73] hover:text-gray-900 transition-colors"
          title="Download PDF"
          aria-label="Download PDF"
        >
          <Download className="w-3.5 h-3.5" />
          PDF
        </a>
      </div>
    </div>
  )
}
