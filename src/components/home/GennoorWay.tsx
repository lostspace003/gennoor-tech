'use client'

import Link from 'next/link'

/**
 * The five-phase methodology as a single segmented panel — five white cells
 * separated by 1px #d2d2d7 gaps inside an 18px-radius container, exactly as
 * in the Home prototype.
 */

const phases = [
  {
    number: '01',
    name: 'Diagnose',
    description: 'Readiness score, use-case backlog, 12-month roadmap.',
    duration: '1–4 weeks',
  },
  {
    number: '02',
    name: 'Train',
    description: 'C-suite, functional and technical cohorts on your data.',
    duration: '2–8 weeks',
  },
  {
    number: '03',
    name: 'Innovate',
    description: 'A working PoC in your environment. Fixed scope and price.',
    duration: '4–8 weeks',
  },
  {
    number: '04',
    name: 'Build',
    description: 'Production deployment, MLOps, knowledge transfer.',
    duration: '8–20 weeks',
  },
  {
    number: '05',
    name: 'Sustain',
    description: 'Health checks, cost audits, continuous L&D, expansion.',
    duration: 'Ongoing',
  },
]

export default function GennoorWay() {
  return (
    <section className="bg-[#f5f5f7] py-16 lg:py-24 px-8">
      <div className="max-w-[1080px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="display-section">One partner. Five phases.</h2>
          <p className="lede mt-3.5 max-w-[560px] mx-auto">
            The Gennoor Way runs end to end — start at any phase.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-[#d2d2d7] border border-[#d2d2d7] rounded-[18px] overflow-hidden">
          {phases.map(phase => (
            <div key={phase.number} className="bg-white px-[22px] py-7">
              <div className="text-[13px] font-semibold text-[#d2d2d7] tracking-[0.08em]">
                {phase.number}
              </div>
              <div className="text-[19px] font-bold text-gray-900 mt-2.5 mb-2">{phase.name}</div>
              <div className="text-[13px] leading-normal text-[#6e6e73]">{phase.description}</div>
              <div className="text-xs font-semibold text-primary-600 mt-3.5">{phase.duration}</div>
            </div>
          ))}
        </div>

        <div className="text-center mt-9">
          <Link href="/the-gennoor-way" className="link-arrow">
            Read the full methodology ›
          </Link>
        </div>
      </div>
    </section>
  )
}
