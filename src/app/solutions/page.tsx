import type { Metadata } from 'next'
import Link from 'next/link'
import { BreadcrumbJsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'AI Solutions — SMB & Enterprise Tracks',
  description:
    'Two tracks, one methodology. Productized AI packages for 10–250 person businesses, custom engagements for the enterprise. Diagnose, train, innovate, build, and sustain — on one contract.',
  keywords: [
    'AI solutions',
    'enterprise AI partner',
    'SMB AI solutions',
    'AI transformation services',
    'Microsoft AI partner',
  ],
  alternates: { canonical: 'https://gennoor.com/solutions' },
  openGraph: {
    title: 'AI Solutions — SMB & Enterprise Tracks',
    description: 'Two tracks, one methodology. From a 6-week pilot to a multi-year transformation.',
    url: 'https://gennoor.com/solutions',
  },
}

/**
 * The Services page from the redesign handoff: display hero, SMB/Enterprise
 * price cards, the four service-area rows, custom builds, and the dark PoC
 * band. Deep links into the SMB/Enterprise package pages are kept alongside
 * the prototype's contact links.
 */

const areas = [
  {
    phase: 'Phase 1 — Diagnose',
    title: 'AI Strategy & Consulting',
    href: '/services/ai-strategy',
    description:
      'Readiness assessment, use-case backlog, ROI modeling, governance charter, and a 12-month roadmap your board can approve.',
  },
  {
    phase: 'Phase 2 — Train',
    title: 'Corporate Training',
    href: '/services/training',
    description:
      'Executive bootcamps and technical workshops on Azure AI, Copilot, and open-source stacks — custom curricula on your data.',
  },
  {
    phase: 'Phase 3 — Innovate',
    title: 'PoC Development',
    href: '/services/poc-development',
    description:
      'Production-grade prototypes for document intelligence, chat, and automation. Fixed scope, fixed price, real evaluation criteria.',
  },
  {
    phase: 'Phase 4 — Build',
    title: 'Agentic AI Solutions',
    href: '/services/agentic-ai',
    description:
      'Multi-agent orchestration with LangGraph, CrewAI, Semantic Kernel, and Copilot Studio — deployed, monitored, and handed over.',
  },
]

const customs = [
  { title: 'Custom ML for credit scoring', detail: 'Built on your data, deployed in your Azure ML workspace, with explainability dashboards and model card.' },
  { title: 'Custom analytics platform', detail: 'Semantic layer, dashboards, and natural-language query over your warehouse — Snowflake, Fabric, or Synapse.' },
  { title: 'Domain forecast engines', detail: 'Cement output, hospitality occupancy, hospital admissions — with what-if scenario planning.' },
  { title: 'Data pipeline + AI layer', detail: 'End-to-end MLOps: ingestion, cleaning, feature store, model serving, monitoring.' },
  { title: 'Custom multi-agent systems', detail: 'Beyond Copilot Studio — LangGraph, Semantic Kernel, or CrewAI with custom tools and memory.' },
  { title: 'Sovereign / on-prem AI', detail: 'For regulated clients who can’t use public cloud LLMs. Private models, air-gapped option.' },
]

export default function SolutionsHubPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Home', url: 'https://gennoor.com' }, { name: 'Solutions', url: 'https://gennoor.com/solutions' }]} />
      <main className="min-h-screen bg-white">
        {/* ===== Hero ===== */}
        <section className="px-8 pt-20 lg:pt-[110px] pb-[72px] text-center">
          <div className="kicker mb-5">Build &amp; Consulting</div>
          <h1 className="text-[clamp(40px,4.8vw,64px)] leading-[1.06] tracking-[-0.03em] font-bold text-gray-900 max-w-[760px] mx-auto">
            Working software, not slideware.
          </h1>
          <p className="text-[clamp(18px,1.8vw,22px)] leading-[1.45] text-[#6e6e73] max-w-[620px] mx-auto mt-[22px]">
            Strategy, PoCs, and production agents — fixed scope, fixed price,
            senior engineers on every engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-[22px] justify-center items-center mt-8">
            <Link href="/contact" className="pill-primary-sm">
              Talk to our team
            </Link>
            <Link href="/resources/pocs" className="text-[15px] font-medium text-primary-600 hover:text-[#0077ed]">
              Browse the PoC catalog ›
            </Link>
          </div>
        </section>

        {/* ===== Two tracks ===== */}
        <section className="bg-[#f5f5f7] px-8 py-20">
          <div className="max-w-[1080px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* SMB — white card */}
            <div className="bg-white rounded-3xl px-8 py-10 lg:px-10 lg:py-11 flex flex-col">
              <div className="kicker !tracking-[0.14em]">For SMB</div>
              <h2 className="text-[26px] font-bold tracking-[-0.02em] leading-[1.15] text-gray-900 mt-3 mb-2.5">
                Productized. Priced. Six weeks.
              </h2>
              <p className="text-[15px] text-[#6e6e73] leading-normal mb-6">
                Start small, own everything. Built in your environment, handed to
                your team.
              </p>
              <div className="flex flex-col text-sm">
                {[
                  ['AI Readiness Kit', 'from $3k · 1 week'],
                  ['Copilot Kickstart', 'from $10k · 4 weeks'],
                  ['Single Agent Build', 'from $25k · 6 weeks'],
                ].map(([name, price], i, arr) => (
                  <div
                    key={name}
                    className={`flex justify-between py-3 border-t border-[#f0f0f2] ${
                      i === arr.length - 1 ? 'border-b' : ''
                    }`}
                  >
                    <span className="font-semibold text-gray-900">{name}</span>
                    <span className="text-[#6e6e73]">{price}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                <Link href="/contact" className="text-[15px] font-medium text-primary-600 hover:text-[#0077ed]">
                  Start an SMB engagement ›
                </Link>
                <Link href="/solutions/for-smb" className="text-[13px] font-medium text-[#6e6e73] hover:text-gray-900">
                  See all 5 SMB packages ›
                </Link>
              </div>
            </div>

            {/* Enterprise — dark card */}
            <div className="bg-[#1d1d1f] rounded-3xl px-8 py-10 lg:px-10 lg:py-11 flex flex-col">
              <div className="kicker !tracking-[0.14em]">For Enterprise</div>
              <h2 className="text-[26px] font-bold tracking-[-0.02em] leading-[1.15] text-white mt-3 mb-2.5">
                Governed. Sponsored. Procurement-ready.
              </h2>
              <p className="text-[15px] text-[#a1a1a6] leading-normal mb-6">
                Multi-quarter programs with executive sponsorship and senior
                delivery in your region.
              </p>
              <div className="flex flex-col text-sm">
                {[
                  ['Strategic Diagnostic', '4 weeks'],
                  ['Executive & Functional Bootcamps', '2–8 weeks'],
                  ['Transformation Programs', '9–20 weeks'],
                ].map(([name, dur], i, arr) => (
                  <div
                    key={name}
                    className={`flex justify-between py-3 border-t border-[#3a3a3c] ${
                      i === arr.length - 1 ? 'border-b' : ''
                    }`}
                  >
                    <span className="font-semibold text-[#f5f5f7]">{name}</span>
                    <span className="text-[#86868b]">{dur}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                <Link href="/contact" className="text-[15px] font-medium text-[#2997ff] hover:text-[#52a8ff]">
                  Start an enterprise program ›
                </Link>
                <Link href="/solutions/for-enterprise" className="text-[13px] font-medium text-[#86868b] hover:text-[#f5f5f7]">
                  See all 6 enterprise models ›
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Service areas ===== */}
        <section className="px-8 py-16 lg:py-24">
          <div className="max-w-[1080px] mx-auto">
            <h2 className="display-section text-center mb-3">Four ways we work.</h2>
            <p className="text-[18px] text-[#6e6e73] text-center mb-14">
              Every engagement maps to a phase of the Gennoor Way.
            </p>
            <div className="flex flex-col">
              {areas.map(area => (
                <div
                  key={area.title}
                  className="grid grid-cols-1 md:grid-cols-[200px_1fr_auto] gap-4 md:gap-8 md:items-center px-2 py-8 border-t border-[#e8e8ed]"
                >
                  <div>
                    <div className="text-xs font-semibold text-primary-600 mb-1">{area.phase}</div>
                    <Link
                      href={area.href}
                      className="text-[20px] font-bold tracking-[-0.01em] text-gray-900 hover:text-primary-600 transition-colors"
                    >
                      {area.title}
                    </Link>
                  </div>
                  <p className="text-[14.5px] leading-[1.55] text-[#6e6e73]">{area.description}</p>
                  <Link
                    href="/contact"
                    className="text-sm font-semibold text-primary-600 hover:text-[#0077ed] whitespace-nowrap"
                  >
                    Enquire ›
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Custom builds ===== */}
        <section className="bg-[#f5f5f7] px-8 py-16 lg:py-24">
          <div className="max-w-[1080px] mx-auto">
            <h2 className="display-section text-center mb-3">Beyond the catalog.</h2>
            <p className="text-[18px] text-[#6e6e73] text-center mb-12">
              Custom builds we&rsquo;ve scoped and shipped.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customs.map(c => (
                <div key={c.title} className="bg-white border border-[#e8e8ed] rounded-[18px] px-6 py-[26px]">
                  <div className="text-[15.5px] font-bold leading-[1.3] text-gray-900 mb-2">{c.title}</div>
                  <div className="text-[13px] leading-[1.55] text-[#6e6e73]">{c.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PoC band ===== */}
        <section className="bg-[#1d1d1f] px-8 py-[90px] text-center">
          <h2 className="display-section !text-white">18 PoCs. Scoped and priced.</h2>
          <p className="text-[18px] text-[#a1a1a6] mt-3 mb-7 max-w-[520px] mx-auto">
            Documents, agents, forecasting, industry builds — each with a
            timeline and a price band.
          </p>
          <Link href="/resources/pocs" className="pill-primary-sm">
            Browse the catalog
          </Link>
        </section>
      </main>
    </>
  )
}
