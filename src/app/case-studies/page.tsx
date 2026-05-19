import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock, Users, Building2 } from 'lucide-react'
import { caseStudies } from '@/data/case-studies'
import { BreadcrumbJsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Case Studies — Real AI Engagements Across BFSI, Government, Professional Services',
  description:
    'Senior-led AI engagements delivered for Fortune 500 and government clients across GCC, Africa, and South Asia. Outcomes, technologies, and the framework behind each one.',
  keywords: [
    'AI case studies',
    'enterprise AI implementations',
    'AI consulting case studies',
    'Microsoft AI partner case studies',
  ],
  alternates: { canonical: 'https://gennoor.com/case-studies' },
  openGraph: {
    title: 'Case Studies — Gennoor Tech',
    description: 'Real AI engagements. Outcomes, technologies, and the framework behind each.',
    url: 'https://gennoor.com/case-studies',
  },
}

export default function CaseStudiesIndexPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://gennoor.com' },
          { name: 'Case Studies', url: 'https://gennoor.com/case-studies' },
        ]}
      />
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0C1426] via-[#0F1B33] to-[#1A2547] text-white">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-primary-500/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-[35rem] h-[35rem] bg-secondary-400/20 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-6xl mx-auto px-6 py-24 lg:py-32 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs tracking-widest text-secondary-300 mb-6">
              CASE STUDIES
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Real engagements.
              <span className="block text-secondary-300 mt-2">Not vendor-deck screenshots.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
              Senior-led AI work delivered for Fortune 500 and government clients across GCC, Africa, and South Asia —
              with the outcomes, technologies, and the framework behind each one.
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-6">
            {caseStudies.map(cs => (
              <Link
                key={cs.id}
                href={`/portfolio/case-studies/${cs.id}`}
                className="group bg-white rounded-2xl border border-gray-200 hover:border-primary-300 hover:shadow-xl transition-all duration-300 p-7 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-primary-700 bg-primary-50 px-2 py-1 rounded">
                    {cs.industry}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 group-hover:text-primary-700 transition-colors mb-2">
                  {cs.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                  <span className="inline-flex items-center gap-1"><Building2 className="w-3 h-3" /> {cs.client}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {cs.duration}</span>
                  {cs.participants && <span className="inline-flex items-center gap-1"><Users className="w-3 h-3" /> {cs.participants}</span>}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">{cs.challenge}</p>
                {cs.outcomes.length > 0 && (
                  <ul className="text-xs text-gray-500 space-y-1 mb-4">
                    {cs.outcomes.slice(0, 2).map((o, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-secondary-600 flex-shrink-0">→</span>
                        <span className="line-clamp-1">{o}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-primary-700 group-hover:gap-2 transition-all">
                  Read the case study <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-20">
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Want to be the next one?</h2>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              We run the journey from diagnostic to deployed agents — and we stay for sustainment. Book a 30-minute call.
            </p>
            <Link
              href="/contact?intent=diagnostic"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 font-bold rounded-xl hover:shadow-lg transition-all"
            >
              Book a call <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
