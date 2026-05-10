import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, Clock, Users, Monitor, Star, BarChart3, Trophy, MessageCircle, ArrowRight, Award, Sparkles, Play } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Claude for Productivity — Workshop Recap | Gennoor Tech',
  description:
    'Recap of the free hands-on Claude for Productivity workshop. 73 registered, 32 attended, 8 modules covered, 4.9★ Trustpilot rating. See what was taught and what participants said.',
  keywords: [
    'Claude workshop',
    'Claude Cowork',
    'Claude for Productivity',
    'AI workshop',
    'free AI training',
    'Gennoor Tech',
    'Claude tutorial',
    'AI productivity',
    'hands-on AI workshop',
  ],
  openGraph: {
    title: 'Claude for Productivity — Workshop Recap',
    description:
      '73 registered, 32 attended, 8 hands-on modules, 4.9★ Trustpilot rating. See what participants learned and what they said.',
    url: 'https://gennoor.com/workshops/claude-cowork',
    siteName: 'Gennoor Tech',
    type: 'website',
  },
}

const modules = [
  {
    number: '01',
    title: 'Understanding Claude Cowork',
    description:
      'Chat vs Cowork — when to use what. Watched Claude organize a messy 25-file folder in under 90 seconds with real-time renaming, sorting, and folder creation.',
  },
  {
    number: '02',
    title: 'Files & Document Synthesis',
    description:
      'Uploaded 65+ files — postmortems, OKRs, customer notes, screenshots, duplicates — and let Claude organize, deduplicate, and synthesize them into structured project folders.',
  },
  {
    number: '03',
    title: 'Extract Data to Excel',
    description:
      'Turned 13 unstructured resumes (PDFs, DOCXs) into a clean Excel spreadsheet. Also processed receipts, contracts, and vendor documents into structured data.',
  },
  {
    number: '04',
    title: 'Interactive HTML Pages',
    description:
      'Built interactive dashboards, reports, and data-driven pages from raw data — no coding required. Visual outputs ready to share.',
  },
  {
    number: '05',
    title: 'Real Project Workflow',
    description:
      'End-to-end hiring scenario: job description refinement, interview rubric creation, budget analysis, and candidate pipeline evaluation — all with Claude.',
  },
  {
    number: '06',
    title: 'Claude in Excel',
    description:
      'Processed workshop registration CSVs, generated formulas, built analysis, and automated bulk data transformations directly in spreadsheets.',
  },
  {
    number: '07',
    title: 'Claude in PowerPoint',
    description:
      'Created polished presentations from raw notes and data. Demonstrated content hierarchy, slide generation, and consistent formatting.',
  },
  {
    number: '08',
    title: 'Claude in Chrome',
    description:
      'Used Claude in the browser to research, summarize, and act on webpages. Built a complete 6-video social media marketing kit with posting schedules.',
  },
]

const reviews = [
  {
    name: 'Adnan Shaikh',
    rating: 5,
    text: 'Flow of this training was structured in a great way. Gennoor is doing a great work in helping people adapt to the new job role changes happening because of AI developments.',
  },
  {
    name: 'Ameer',
    rating: 5,
    text: 'The session was very useful. I was able to clear most of my doubts after attending it. Thank you to the instructor for the informative and helpful session.',
  },
  {
    name: 'Saema Asif',
    rating: 5,
    text: 'Exceptional session on Claude workshop, Gennoor!',
  },
  {
    name: 'Farhan Khan',
    rating: 5,
    text: 'Insightful training on Claude.',
  },
  {
    name: 'Syed Zishan Ali',
    rating: 5,
    text: 'Keep organizing these events, good going.',
  },
  {
    name: 'Prat V',
    rating: 5,
    text: 'Thank you sir for providing such a wonderful session!!',
  },
  {
    name: 'Kazim Salman',
    rating: 4,
    text: 'I had a very good experience with this company. The service was smooth, professional, and easy to use. Everything worked as expected.',
  },
]

const eventStats = [
  { icon: Users, label: 'Registered', value: '73' },
  { icon: CheckCircle, label: 'Attended', value: '32' },
  { icon: Clock, label: 'Duration', value: '4h 17m' },
  { icon: Monitor, label: 'Modules', value: '8' },
  { icon: Star, label: 'Avg Rating', value: '4.9★' },
  { icon: MessageCircle, label: 'Reviews', value: '7' },
]

export default function ClaudeCoworkRecapPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-14 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 bg-gradient-mesh" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
            <Link href="/workshops" className="hover:text-primary-600 transition-colors">
              Workshops
            </Link>
            <span className="text-primary-300">/</span>
            <span className="text-primary-700 font-medium">Claude for Productivity</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left — Title + Instructor */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="text-3xl md:text-4xl font-black leading-tight text-gray-900">
                  Claude for Productivity
                </h1>
                <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                  <CheckCircle className="w-3 h-3" />
                  Completed
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-5 leading-relaxed max-w-lg">
                Free 4-hour hands-on workshop — 73 registered, 32 attended, 8 modules from Cowork basics to Excel, PowerPoint &amp; Chrome integrations.
              </p>

              <div className="flex items-center gap-5 mb-5">
                <div className="relative shrink-0">
                  <div className="absolute -inset-1 bg-gradient-to-br from-primary-400 via-secondary-400 to-accent-400 rounded-xl opacity-30 blur-sm" />
                  <Image
                    src="/media/workshops/jalal-hd.png"
                    alt="Jalal Khan — Microsoft Certified Trainer"
                    width={240}
                    height={240}
                    className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-xl object-cover ring-2 ring-white shadow-lg"
                  />
                </div>
                <div>
                  <p className="text-gray-900 font-bold text-lg">Jalal Khan</p>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Image src="/media/workshops/mct.png" alt="MCT" width={16} height={16} className="rounded-full" />
                    <p className="text-primary-700 text-sm font-medium">Microsoft Certified Trainer</p>
                  </div>
                  <p className="text-gray-500 text-xs">14+ years · Trained in 6 countries</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  { icon: Clock, text: '4h 17m live', color: 'bg-primary-50 text-primary-700 border-primary-200' },
                  { icon: Monitor, text: '8 modules', color: 'bg-accent-50 text-accent-700 border-accent-200' },
                  { icon: Users, text: '32 attended', color: 'bg-primary-50 text-primary-700 border-primary-200' },
                  { icon: Star, text: '4.9★ Trustpilot', color: 'bg-secondary-50 text-secondary-700 border-secondary-200' },
                  { icon: Award, text: 'MCT-Led', color: 'bg-accent-50 text-accent-700 border-accent-200' },
                ].map((item) => (
                  <span key={item.text} className={`flex items-center gap-1.5 border px-3 py-1.5 rounded-full ${item.color}`}>
                    <item.icon className="w-3.5 h-3.5" />
                    {item.text}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — YouTube Video */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-primary-400 via-secondary-300 to-accent-400 rounded-2xl opacity-20 blur-sm" />
              <div className="relative rounded-xl overflow-hidden shadow-xl ring-1 ring-primary-200 aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/LTOjD3kr71U?rel=0"
                  title="Claude for Productivity — Full Workshop Recording"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {eventStats.map((stat) => (
              <div
                key={stat.label}
                className="glass-card p-4 text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <stat.icon className="w-4 h-4 mx-auto mb-1.5 text-primary-600" />
                <p className="text-xl font-black text-gray-900">{stat.value}</p>
                <p className="text-gray-500 text-[11px] font-medium mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* What Was Covered */}
      <section className="py-10 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">What Was Covered</h2>
          <p className="text-gray-600 mb-6">
            Eight hands-on modules — from Cowork fundamentals to Excel, PowerPoint &amp; Chrome integrations.
          </p>

          <div className="grid sm:grid-cols-2 gap-3">
            {modules.map((mod) => (
              <div
                key={mod.number}
                className="glass-card p-4 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-primary-50 text-primary-700 rounded-lg px-2.5 py-0.5 font-bold text-xs shrink-0 mt-0.5">
                    {mod.number}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{mod.title}</h3>
                    <p className="text-gray-600 text-xs leading-relaxed">{mod.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Materials Link */}
          <div className="mt-6 bg-primary-50 border border-primary-100 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="bg-primary-100 rounded-lg p-2">
              <Sparkles className="w-5 h-5 text-primary-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm mb-0.5">Workshop Materials</h3>
              <p className="text-gray-600 text-xs">
                All lab files, templates, and exercises — available for free.
              </p>
            </div>
            <a
              href="https://drive.google.com/file/d/18wl79ZheYRci7gpZAAX14hBs0RepAT95/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-xl font-semibold text-sm hover:shadow-glow-blue transition-all duration-300 shrink-0"
            >
              Download Materials
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Engagement Highlights */}
      <section className="py-10 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-bold text-gray-900">Engagement Highlights</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              {[
                { label: 'Avg Attendance', value: '2h 30m' },
                { label: 'Total Reactions', value: '150+' },
                { label: 'Raised Hands', value: '5' },
                { label: 'Camera Sessions', value: '6' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-xl font-black text-gray-900">{stat.value}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <p className="text-gray-700 text-sm font-semibold">Most Engaged Participants</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Farhan Khan — 21 reactions', 'Adnan Shaikh — 19 reactions', 'Kazim Salmani — 16 reactions', 'Ameer Sheikh — 15 reactions'].map((name) => (
                  <span key={name} className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Trustpilot Reviews */}
      <section className="py-10 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">What Participants Said</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 text-[#00b67a] fill-[#00b67a]" />
                  ))}
                </div>
                <p className="text-gray-500 text-sm">4.9/5 — 7 reviews</p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200 self-start">
              <Star className="w-3 h-3 fill-current" />
              Trustpilot Verified
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {reviews.map((review, i) => (
              <div
                key={i}
                className="glass-card p-4 hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                <div className="flex items-center gap-0.5 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3 h-3 ${s <= review.rating ? 'text-[#00b67a] fill-[#00b67a]' : 'text-gray-200'}`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 text-xs leading-relaxed flex-1 mb-3">
                  &ldquo;{review.text}&rdquo;
                </p>
                <p className="text-gray-900 font-semibold text-xs">{review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* CTA */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Want to Attend the Next One?</h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            We run free workshops regularly on AI tools and workflows. Be the first to know when the next session drops.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/workshops"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-glow-blue transition-all duration-300"
            >
              Browse All Workshops
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 border-2 border-primary-600 text-primary-700 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
