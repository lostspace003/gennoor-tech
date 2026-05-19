'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Clock,
  Sparkles,
  Layers,
  Bot,
  Building2,
  LineChart,
  Zap,
  Hammer,
} from 'lucide-react'
import { pocs, customBuildExamples, type PoCCategory } from '@/data/pocs'

const categories: { label: 'All' | PoCCategory; icon: typeof Layers }[] = [
  { label: 'All', icon: Sparkles },
  { label: 'Documents & Knowledge', icon: Layers },
  { label: 'Agents', icon: Bot },
  { label: 'Industry-Specific', icon: Building2 },
  { label: 'Analytics & Forecasting', icon: LineChart },
  { label: 'Productivity & Adoption', icon: Zap },
]

export default function PoCCatalogClient() {
  const [active, setActive] = useState<'All' | PoCCategory>('All')

  const filtered = useMemo(
    () => (active === 'All' ? pocs : pocs.filter(p => p.category === active)),
    [active]
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0C1426] via-[#0F1B33] to-[#1A2547] text-white">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-primary-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[35rem] h-[35rem] bg-secondary-400/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-24 lg:py-32">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs tracking-widest text-secondary-300 mb-6">
            <Sparkles className="w-3.5 h-3.5" /> POC CATALOG
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            18 production-ready PoC blueprints.
            <span className="block text-secondary-300 mt-2">Pick one. We deliver it in 4–8 weeks.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl">
            Fixed scope. Fixed price. Code transferred to your environment. The catalog below is what
            we ship most often — if your use case isn’t here, jump to{' '}
            <Link href="#custom-build" className="text-secondary-300 underline underline-offset-2 hover:text-secondary-200">
              Custom Build
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex gap-2 overflow-x-auto">
          {categories.map(({ label, icon: Icon }) => {
            const isActive = active === label
            return (
              <button
                key={label}
                onClick={() => setActive(label)}
                className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            )
          })}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map(p => (
            <Link
              key={p.id}
              href={`/resources/pocs/${p.id}`}
              className="group relative bg-white rounded-2xl border border-gray-200 hover:border-primary-300 hover:shadow-xl transition-all duration-300 p-6 flex flex-col"
            >
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-[10px] font-bold tracking-widest uppercase text-primary-700 bg-primary-50 px-2 py-1 rounded">
                  {p.category}
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-secondary-700 bg-secondary-50 px-2 py-1 rounded">
                  {p.phaseTag}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-700 transition-colors mb-2">
                {p.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{p.problem}</p>
              <div className="mt-auto grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-gray-400 uppercase tracking-wider text-[10px] mb-0.5">Timeline</div>
                  <div className="font-semibold text-gray-700 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {p.timeline}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 uppercase tracking-wider text-[10px] mb-0.5">Sustainment</div>
                  <div className="font-semibold text-gray-700">{p.sustainmentBand}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-gray-400 uppercase tracking-wider text-[10px] mb-0.5">Price band</div>
                  <div className="font-semibold text-gray-700">
                    {p.priceBand.smb ? `SMB ${p.priceBand.smb} · ` : ''}Enterprise {p.priceBand.enterprise}
                  </div>
                </div>
              </div>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-700 group-hover:gap-2 transition-all">
                See full PoC <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="custom-build" className="bg-gradient-to-br from-secondary-50 via-white to-primary-50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-100 text-secondary-700 text-xs tracking-widest font-bold mb-4">
              <Hammer className="w-3.5 h-3.5" /> CUSTOM BUILD
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Don’t see your use case? We build custom too.
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Machine learning models. Custom analytics platforms. Forecast engines. Bespoke deployments.
              Anything in the AI, ML, analytics or data space — we curate the approach, build it in your
              environment, transfer the code, and sustain it after Go-Live.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-10">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">How a custom build works</h3>
            <ol className="space-y-3 text-gray-700">
              {[
                'Discovery & scoping call (free, 30 minutes)',
                'Written scope, fixed price, fixed timeline — within 5 working days',
                'Build with weekly demos and live access to a staging environment',
                'Code, documentation, and runbook handover',
                'Optional sustainment retainer for governance, drift checks, and refresh cycles',
              ].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-100 text-primary-700 font-bold text-sm flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-10">
            {customBuildExamples.map(ex => (
              <div key={ex.title} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <h4 className="font-bold text-gray-900 mb-1">{ex.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{ex.detail}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/contact?intent=custom-build"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 hover:shadow-xl transition-all"
            >
              Scope a custom build <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
