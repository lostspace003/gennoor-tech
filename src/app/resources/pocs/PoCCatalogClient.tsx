'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { pocs, customBuildExamples, type PoCCategory } from '@/data/pocs'

/**
 * PoC catalog in the Apple idiom, per the redesign handoff: display hero,
 * pill filter chips, two-column stat cards on the #f5f5f7 panel. Cards keep
 * their deep links to /resources/pocs/[id]; the Custom Build section and
 * its contact intent link survive, restyled.
 */

const categories: ('All' | PoCCategory)[] = [
  'All',
  'Documents & Knowledge',
  'Agents',
  'Industry-Specific',
  'Analytics & Forecasting',
  'Productivity & Adoption',
]

export default function PoCCatalogClient() {
  const [active, setActive] = useState<'All' | PoCCategory>('All')

  const filtered = useMemo(
    () => (active === 'All' ? pocs : pocs.filter(p => p.category === active)),
    [active]
  )

  return (
    <main className="min-h-screen bg-white">
      {/* ===== Hero ===== */}
      <section className="px-8 pt-20 lg:pt-[110px] pb-16 text-center">
        <div className="kicker mb-5">PoC Catalog</div>
        <h1 className="text-[clamp(40px,4.8vw,64px)] leading-[1.06] tracking-[-0.03em] font-bold text-gray-900 max-w-[760px] mx-auto">
          Proof, not promises.
        </h1>
        <p className="text-[clamp(18px,1.8vw,22px)] leading-[1.45] text-[#6e6e73] max-w-[640px] mx-auto mt-[22px]">
          {pocs.length} production-grade PoCs — each scoped with a timeline, a price
          band, and the exact stack we build it on.
        </p>
      </section>

      {/* ===== Catalog ===== */}
      <section className="bg-[#f5f5f7] px-8 pt-12 pb-24">
        <div className="max-w-[1080px] mx-auto">
          {/* Filter chips */}
          <div className="flex gap-2 flex-wrap justify-center mb-8">
            {categories.map(label => {
              const isActive = active === label
              return (
                <button
                  key={label}
                  onClick={() => setActive(label)}
                  className={`text-[13px] font-medium px-4 py-2 rounded-full border transition-all duration-200 ${
                    isActive
                      ? 'border-primary-600 bg-primary-600 text-white'
                      : 'border-[#d2d2d7] bg-white text-gray-900'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>

          {/* Card grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map(p => (
              <Link
                key={p.id}
                href={`/resources/pocs/${p.id}`}
                className="bg-white border border-[#e8e8ed] hover:border-[#d2d2d7] rounded-[18px] p-7 flex flex-col transition-colors"
              >
                <div className="flex justify-between items-center gap-3 mb-3">
                  <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#86868b]">
                    {p.category}
                  </span>
                  <span className="text-[11px] font-semibold text-primary-600 whitespace-nowrap">
                    {p.phaseTag}
                  </span>
                </div>
                <h3 className="text-[19px] font-bold leading-[1.25] tracking-[-0.01em] text-gray-900 mb-2">
                  {p.title}
                </h3>
                <p className="text-[13.5px] leading-[1.55] text-[#6e6e73] mb-4">{p.problem}</p>
                <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-[#f0f0f2] pt-3.5 mt-auto">
                  <div>
                    <div className="text-[11px] text-[#86868b] mb-0.5">Timeline</div>
                    <div className="text-[13px] font-semibold text-gray-900">{p.timeline}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#86868b] mb-0.5">Price band</div>
                    <div className="text-[13px] font-semibold text-gray-900">
                      {p.priceBand.smb ? `SMB ${p.priceBand.smb} · ` : ''}
                      {p.priceBand.enterprise}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#86868b] mb-0.5">Sustainment</div>
                    <div className="text-[13px] font-semibold text-gray-900">{p.sustainmentBand}</div>
                  </div>
                </div>
                <div className="text-xs text-[#86868b] mt-3">{p.technologies.join(' · ')}</div>
                {p.metrics && p.metrics.length > 0 && (
                  <div className="flex gap-5 bg-[#f5f5f7] rounded-xl px-4 py-3 mt-3.5">
                    {p.metrics.map(m => (
                      <div key={m.label}>
                        <div className="text-[16px] font-bold text-primary-600">{m.value}</div>
                        <div className="text-[10.5px] text-[#86868b]">{m.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/contact?intent=poc" className="pill-primary-sm">
              Scope a PoC for your team
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Custom build ===== */}
      <section id="custom-build" className="px-8 py-16 lg:py-24 scroll-mt-16">
        <div className="max-w-[1080px] mx-auto">
          <div className="text-center max-w-[640px] mx-auto mb-12">
            <div className="kicker !tracking-[0.14em] mb-4">Custom Build</div>
            <h2 className="display-card mb-3">Don&rsquo;t see your use case?</h2>
            <p className="text-[17px] text-[#6e6e73] leading-relaxed">
              Machine learning models. Custom analytics platforms. Forecast
              engines. Bespoke deployments. We curate the approach, build it in
              your environment, transfer the code, and sustain it after go-live.
            </p>
          </div>

          {/* Process — hairline grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-[#e8e8ed] border border-[#e8e8ed] rounded-[18px] overflow-hidden mb-10">
            {[
              'Discovery & scoping call — free, 30 minutes',
              'Written scope, fixed price, fixed timeline — within 5 working days',
              'Build with weekly demos and a live staging environment',
              'Code, documentation, and runbook handover',
              'Optional sustainment retainer — governance, drift checks, refresh',
            ].map((step, i) => (
              <div key={i} className="bg-white px-5 py-6">
                <div className="text-[13px] font-semibold text-[#d2d2d7] tracking-[0.08em] mb-2">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="text-[13px] leading-[1.55] text-gray-900">{step}</div>
              </div>
            ))}
          </div>

          {/* Examples */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {customBuildExamples.map(ex => (
              <div key={ex.title} className="bg-white border border-[#e8e8ed] rounded-[18px] px-6 py-5">
                <h3 className="text-[15.5px] font-bold text-gray-900 mb-1">{ex.title}</h3>
                <p className="text-[13px] leading-[1.55] text-[#6e6e73]">{ex.detail}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/contact?intent=custom-build" className="pill-primary-sm">
              Scope a custom build
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
