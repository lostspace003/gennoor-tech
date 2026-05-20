'use client'

import { useMemo, useState } from 'react'
import { Award, Users, Clock, Globe, BookOpen, Rocket, Search, X, ChevronRight, Download, GraduationCap, ArrowRight, Layers } from 'lucide-react'
import Link from 'next/link'
import { bootcamps } from '@/data/training-programs'
import { allCoursePdfs, type CoursePdf, type Track } from '@/data/course-pdfs'
import TrainingCard from '@/components/training/TrainingCard'

const TRACK_ORDER: Track[] = ['foundations', 'function', 'leadership', 'industry', 'builder']
const TRACK_LABEL: Record<Track, string> = {
  foundations: 'Foundations',
  function: 'By Function',
  leadership: 'Leadership',
  industry: 'By Industry',
  builder: 'Builder',
}
const TRACK_BLURB: Record<Track, string> = {
  foundations: 'AI literacy for everyone — what every business person should know.',
  function: 'AI applied to the work you actually do — by department.',
  leadership: 'For the C-suite and boards. Strategy, governance, ROI.',
  industry: 'Vertical-specific AI — BFSI, Healthcare, Manufacturing, Government, Education.',
  builder: 'For technical practitioners — prompt engineering, agents, ML, MCP.',
}

export default function TrainingPage() {
  const [pdfTrackFilter, setPdfTrackFilter] = useState<Track | 'all'>('all')
  const [bootcampSearch, setBootcampSearch] = useState('')
  const [bootcampLevel, setBootcampLevel] = useState<string>('all')

  const pdfsByTrack = useMemo(() => {
    const groups: { track: Track; courses: CoursePdf[] }[] = TRACK_ORDER.map(t => ({
      track: t,
      courses: allCoursePdfs.filter(c => c.track === t),
    }))
    if (pdfTrackFilter === 'all') return groups
    return groups.filter(g => g.track === pdfTrackFilter)
  }, [pdfTrackFilter])

  const filteredBootcamps = useMemo(() => {
    const q = bootcampSearch.trim().toLowerCase()
    return bootcamps.filter(b => {
      if (q && !(b.title.toLowerCase().includes(q) || b.description.toLowerCase().includes(q))) return false
      if (bootcampLevel !== 'all' && b.level !== bootcampLevel) return false
      return true
    })
  }, [bootcampSearch, bootcampLevel])

  return (
    <main className="min-h-screen">
      {/* ===== HERO — Train phase of the Gennoor Way ===== */}
      <section className="relative py-14 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 bg-gradient-mesh" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <span className="inline-flex items-center rounded-full px-3 py-1 mb-5 text-xs font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/60">
              <GraduationCap className="w-3 h-3 mr-1.5" />
              Phase 2 of The Gennoor Way · Train
            </span>
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-[1.1]">
              Training that ends in a <span className="gradient-text">shipped system</span>.
            </h1>
            <p className="text-xl text-gray-600 mb-6 leading-relaxed max-w-3xl">
              Free downloadable course catalog. Enterprise bootcamps with hands-on labs on your data.
              Certification prep with 16+ active credentials. Every course pairs with an optional
              4-week pilot to apply what you learned inside your environment.
            </p>

            {/* Gennoor Way mini-strip — visual context for where Training sits */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Diagnose', active: false },
                  { name: 'Train', active: true },
                  { name: 'Innovate', active: false },
                  { name: 'Build', active: false },
                  { name: 'Sustain', active: false },
                ].map((phase, i) => (
                  <div key={phase.name} className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full ${
                        phase.active
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      <span className={phase.active ? 'text-white/70' : 'text-gray-400'}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {phase.name}
                    </span>
                    {i < 4 && <ChevronRight className="w-3 h-3 text-gray-300" />}
                  </div>
                ))}
              </div>
              <Link
                href="/the-gennoor-way"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 mt-2"
              >
                See all five phases
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="#catalog"
                className="inline-flex items-center px-7 py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold rounded-xl hover:shadow-glow-blue transition-all duration-300"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Browse 2-day curriculum ({allCoursePdfs.length} courses)
              </a>
              <a
                href="#bootcamps"
                className="inline-flex items-center px-7 py-3.5 border-2 border-primary-600 text-primary-600 text-sm font-semibold rounded-xl hover:bg-primary-50 transition-all duration-300"
              >
                <Rocket className="w-4 h-4 mr-2" />
                Enterprise bootcamps ({bootcamps.length})
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 2-DAY TRAINING CURRICULUM CATALOG ===== */}
      <section id="catalog" className="relative py-14 lg:py-20 bg-gray-50 scroll-mt-24">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <p className="text-xs font-bold tracking-widest text-primary-600 uppercase mb-3">
              Instructor-led · 2 days · 16 hours
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              2-Day training curriculum catalog.
            </h2>
            <p className="text-base text-gray-500 leading-relaxed">
              {allCoursePdfs.length} 2-day (16-hour) instructor-led training courses across five tracks.
              Each course is a paid engagement — delivered on-site or virtual to your team, customised to your
              industry, your data, and your tools. View the curriculum below, or download for sharing.
            </p>
            <div className="inline-flex items-center gap-2 mt-5 px-4 py-2 bg-primary-50 border border-primary-200 rounded-lg text-xs text-primary-900">
              <BookOpen className="w-4 h-4" />
              Click any course to view the full curriculum PDF in your browser, or download to share.
            </div>
          </div>

          {/* Track filter chips */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setPdfTrackFilter('all')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
                pdfTrackFilter === 'all'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-primary-300 hover:text-primary-700'
              }`}
            >
              All tracks ({allCoursePdfs.length})
            </button>
            {TRACK_ORDER.map(t => {
              const count = allCoursePdfs.filter(c => c.track === t).length
              return (
                <button
                  key={t}
                  onClick={() => setPdfTrackFilter(t)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
                    pdfTrackFilter === t
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-primary-300 hover:text-primary-700'
                  }`}
                >
                  {TRACK_LABEL[t]} ({count})
                </button>
              )
            })}
          </div>

          {/* Grouped by track */}
          <div className="space-y-12 max-w-6xl mx-auto">
            {pdfsByTrack.map(group => (
              <div key={group.track}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                    <Layers className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-gray-900">{TRACK_LABEL[group.track]}</h3>
                    <p className="text-xs text-gray-500">{TRACK_BLURB[group.track]}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.courses.map(c => (
                    <CoursePdfCard key={c.slug} course={c} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ENTERPRISE BOOTCAMPS ===== */}
      <section id="bootcamps" className="relative py-14 lg:py-20 scroll-mt-24">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <p className="text-xs font-bold tracking-widest text-amber-600 uppercase mb-3">
              On-site · Virtual · Hybrid
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Enterprise bootcamps with hands-on labs.
            </h2>
            <p className="text-base text-gray-500 leading-relaxed">
              {bootcamps.length} intensive bootcamps customised to your tech stack and industry context.
              Includes pre-training assessment, hands-on labs on your data, and post-training mentoring.
              Min 5 participants. Delivered across India, GCC, and Africa.
            </p>
          </div>

          {/* Bootcamp search + filter */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search bootcamps…"
                  value={bootcampSearch}
                  onChange={e => setBootcampSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <select
                value={bootcampLevel}
                onChange={e => setBootcampLevel(e.target.value)}
                className="px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white sm:w-44"
              >
                <option value="all">All levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Executive">Executive</option>
              </select>
            </div>
            {(bootcampSearch || bootcampLevel !== 'all') && (
              <div className="mt-3 flex justify-center">
                <button
                  onClick={() => { setBootcampSearch(''); setBootcampLevel('all') }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700"
                >
                  <X className="w-3 h-3" />
                  Clear filters
                </button>
              </div>
            )}
          </div>

          <div className="text-center text-sm text-gray-500 mb-6">
            Showing <span className="font-semibold text-gray-900">{filteredBootcamps.length}</span> of <span className="font-semibold text-gray-900">{bootcamps.length}</span> bootcamps
          </div>

          {filteredBootcamps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {filteredBootcamps.map(program => (
                <TrainingCard key={program.id} program={program} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No bootcamps match your filters.
            </div>
          )}
        </div>
      </section>

      {/* ===== CERTIFICATION PREP — condensed ===== */}
      <section className="relative py-14 lg:py-20 bg-gray-50">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <Award className="w-12 h-12 text-primary-600 mx-auto mb-3" />
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                Certification exam preparation
              </h2>
              <p className="text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
                Trainer with 16+ active certifications across Microsoft · Google Cloud · AWS · GitHub. 98% student pass rate. 2,000+ students certified.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { color: 'bg-blue-600', name: 'Microsoft', certs: ['AI-901, AI-103, AI-300', 'AB-100, AB-730, AB-731', 'AZ + PL platform series'] },
                { color: 'bg-red-600', name: 'Google Cloud', certs: ['Cloud Digital Leader', 'ML Engineer', 'Cloud Architect'] },
                { color: 'bg-orange-600', name: 'AWS', certs: ['Cloud Practitioner', 'AI Practitioner', 'ML Engineer + Specialty'] },
                { color: 'bg-gray-800', name: 'GitHub', certs: ['GH-900 Foundations', 'GH-300 Actions', 'GH-200 Copilot'] },
              ].map(p => (
                <div key={p.name} className="glass-card p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <span className={`w-2 h-5 ${p.color} mr-2 rounded`} />
                    {p.name}
                  </h4>
                  <ul className="space-y-1 text-xs text-gray-600">
                    {p.certs.map(c => <li key={c}>{c}</li>)}
                  </ul>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/services/certifications"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 text-sm font-semibold rounded-xl ring-1 ring-primary-200 hover:ring-primary-400 hover:shadow-md transition-all duration-300"
              >
                View all certification programs
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== GLOBAL DELIVERY ===== */}
      <section className="relative py-14 lg:py-20">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-10 lg:p-12 text-center">
            <Globe className="w-16 h-16 text-white mx-auto mb-5" />
            <h2 className="text-3xl font-bold text-white mb-3">Delivery across GCC, Africa, South Asia</h2>
            <p className="text-lg text-white/90 mb-6 max-w-3xl mx-auto leading-relaxed">
              Senior trainer on-site, in-region. Available for in-person, virtual, and hybrid formats.
              We come to you. India, KSA, UAE, Tanzania, Kenya, Malaysia delivered to date.
            </p>
            <Link
              href="/contact#book"
              className="inline-flex items-center px-7 py-3 bg-white text-primary-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Schedule international training
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="relative py-14 lg:py-20">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">FAQ</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { question: 'How does the 2-day curriculum work?', answer: 'Each curriculum is a paid, instructor-led 2-day (16-hour) course delivered on-site or virtual to your team. The PDF is the full curriculum document — outcomes, modules, topic breakdown — that you can review before booking. Customised to your industry, your data, your tools.' },
              { question: 'What\'s the difference between a 2-day curriculum and a longer bootcamp?', answer: '2-day curriculum courses are focused, single-topic intensives — one core skill mastered across 16 hours. Bootcamps are 3–10 day deep dives that combine multiple skills and include hands-on labs on your live environment. Most teams start with a 2-day course and scale up from there.' },
              { question: 'How are bootcamps customised?', answer: 'Every bootcamp is tailored to your industry, tech stack, and team skill level. We conduct a pre-training assessment to understand your goals and design the curriculum around your specific use cases and data.' },
              { question: 'What is the minimum batch size?', answer: 'Five participants minimum. Max 15–20 for personalised attention. For larger groups we run parallel batches.' },
              { question: 'Do you include certification preparation?', answer: 'Yes, many bootcamps include cert prep for Microsoft, AWS, Google Cloud, GitHub exams. Trainer holds 16+ active certs with 98% student pass rate.' },
              { question: 'Which industries do you serve?', answer: 'BFSI, insurance, healthcare, manufacturing, oil & gas, telecom, government, technology. Clients include Boeing, Saudi Aramco, HDFC Bank, Siemens, EY.' },
            ].map(faq => (
              <details key={faq.question} className="glass-card p-5 group">
                <summary className="cursor-pointer text-base font-semibold text-gray-900 list-none flex items-center justify-between">
                  {faq.question}
                  <ChevronRight className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-90" />
                </summary>
                <p className="text-sm text-gray-600 mt-3 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative py-14 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 bg-gradient-mesh" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready for your team?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Download the catalog. Pick a bootcamp. Or just talk to us about the right mix for your context.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/contact#book"
              className="inline-flex items-center px-7 py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold rounded-xl hover:shadow-glow-blue transition-all duration-300"
            >
              Get training proposal
            </Link>
            <Link
              href="/resources/calendar"
              className="inline-flex items-center px-7 py-3.5 border-2 border-primary-600 text-primary-600 text-sm font-semibold rounded-xl hover:bg-primary-50 transition-all duration-300"
            >
              View training calendar
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

// =====================================================================
// COURSE-PDF CARD
// =====================================================================

function CoursePdfCard({ course }: { course: CoursePdf }) {
  const viewerUrl = `/services/training/curriculum/${course.slug}`
  const pdfUrl = `/api/content/courses/pdfs/${course.slug}.pdf`
  return (
    <Link
      href={viewerUrl}
      className="group bg-white rounded-2xl ring-1 ring-gray-200 hover:ring-primary-300 hover:shadow-lg transition-all duration-300 p-5 flex flex-col"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="inline-flex items-center text-[10px] font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
          2-Day Course · 16h
        </span>
        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
          {course.trackLabel}
        </span>
      </div>
      <h4 className="font-heading text-base font-bold text-gray-900 mb-2 leading-tight">
        {course.title}
      </h4>
      <p className="text-xs text-gray-500 leading-relaxed mb-4 flex-grow">
        {course.subtitle}
      </p>
      <div className="flex items-center justify-between text-[10px] text-gray-400 mb-4">
        <span className="inline-flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {course.duration}
        </span>
        <span className="inline-flex items-center gap-1">
          <BookOpen className="w-3 h-3" />
          {course.modules.length} modules
        </span>
      </div>
      <div className="flex gap-2">
        <span className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-primary-700 bg-primary-50 group-hover:bg-primary-100 rounded-lg transition-colors">
          View curriculum
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>
        <a
          href={pdfUrl}
          download={`${course.slug}.pdf`}
          onClick={e => e.stopPropagation()}
          className="inline-flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          title="Download PDF"
          aria-label="Download PDF"
        >
          <Download className="w-3.5 h-3.5" />
        </a>
      </div>
    </Link>
  )
}
