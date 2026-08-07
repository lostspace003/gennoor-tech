'use client'

import Link from 'next/link'

/**
 * The SMB / Enterprise track selector — a light card and a dark card, per
 * the Home prototype's "Two tracks" section.
 */

export default function DualAudienceSelector() {
  return (
    <section className="bg-white py-16 lg:py-24 px-8">
      <div className="max-w-[1080px] mx-auto">
        <h2 className="display-section text-center mb-14">Two paths. Same rigor.</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* SMB — light card */}
          <div className="bg-[#f5f5f7] rounded-3xl px-8 py-10 lg:px-10 lg:py-11 flex flex-col">
            <div className="kicker !tracking-[0.14em]">For SMB</div>
            <h3 className="text-[28px] font-bold tracking-[-0.02em] leading-[1.15] text-gray-900 mt-3 mb-2.5">
              Your first AI pilot, in six weeks.
            </h3>
            <p className="text-[15px] text-[#6e6e73] leading-normal mb-6">
              Productized offers. Fixed scope, fixed price, built in your
              environment, owned by your team.
            </p>
            <div className="flex flex-col gap-2.5 mb-7 text-sm text-gray-900">
              <div>AI Readiness Kit &nbsp;·&nbsp; from $3k &nbsp;·&nbsp; 1 week</div>
              <div>Copilot Kickstart &nbsp;·&nbsp; from $10k &nbsp;·&nbsp; 4 weeks</div>
              <div>Single Agent Build &nbsp;·&nbsp; from $25k &nbsp;·&nbsp; 6 weeks</div>
            </div>
            <Link href="/solutions/for-smb" className="link-arrow mt-auto">
              Explore SMB solutions ›
            </Link>
          </div>

          {/* Enterprise — dark card */}
          <div className="bg-[#1d1d1f] rounded-3xl px-8 py-10 lg:px-10 lg:py-11 flex flex-col">
            <div className="kicker !tracking-[0.14em]">For Enterprise</div>
            <h3 className="text-[28px] font-bold tracking-[-0.02em] leading-[1.15] text-white mt-3 mb-2.5">
              Programs that survive the org chart.
            </h3>
            <p className="text-[15px] text-[#a1a1a6] leading-normal mb-6">
              Multi-quarter delivery with executive sponsorship, governance, and
              senior engineers in your region. Procurement-ready.
            </p>
            <div className="flex flex-col gap-2.5 mb-7 text-sm text-[#f5f5f7]">
              <div>Strategic Diagnostic &nbsp;·&nbsp; 4 weeks</div>
              <div>Executive &amp; functional bootcamps</div>
              <div>Transformation programs &nbsp;·&nbsp; 9–20 weeks</div>
            </div>
            <Link
              href="/solutions/for-enterprise"
              className="text-[16px] font-medium text-[#2997ff] hover:text-[#52a8ff] transition-colors mt-auto"
            >
              Explore enterprise solutions ›
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
