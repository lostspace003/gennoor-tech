import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Building2, HeartPulse, Factory, Landmark, Zap, ShoppingBag, GraduationCap } from 'lucide-react'
import { industries } from '@/data/industries'
import { BreadcrumbJsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'AI by Industry — BFSI, Healthcare, Manufacturing, Government, Energy, Retail, Education',
  description:
    'Industry-specific AI solutions from Gennoor Tech: BFSI, Healthcare, Manufacturing, Government, Energy, Retail, Education. Mapped PoCs, regulator-aware deployments, sustainment retainers.',
  keywords: [
    'AI by industry',
    'AI for banking',
    'AI for healthcare',
    'AI for manufacturing',
    'AI for government',
    'AI for retail',
    'AI for education',
  ],
  alternates: { canonical: 'https://gennoor.com/industries' },
  openGraph: {
    title: 'AI by Industry — Gennoor Tech',
    description: 'Industry-specific AI solutions, mapped PoCs, regulator-aware deployments.',
    url: 'https://gennoor.com/industries',
  },
}

const iconBySlug: Record<string, typeof Building2> = {
  bfsi: Building2,
  healthcare: HeartPulse,
  manufacturing: Factory,
  government: Landmark,
  energy: Zap,
  retail: ShoppingBag,
  education: GraduationCap,
}

export default function IndustriesHubPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://gennoor.com' },
          { name: 'Industries', url: 'https://gennoor.com/industries' },
        ]}
      />
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0C1426] via-[#0F1B33] to-[#1A2547] text-white">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-primary-500/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-[35rem] h-[35rem] bg-secondary-400/20 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-6xl mx-auto px-6 py-24 lg:py-32 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs tracking-widest text-secondary-300 mb-6">
              INDUSTRIES
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Built for your sector.
              <span className="block text-secondary-300 mt-2">Not a generic “AI consulting” deck.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
              Each industry has its own regulator, its own data shape, and its own non-negotiables.
              Pick yours — the PoCs, sustainment posture, and training paths are pre-mapped.
            </p>
          </div>
        </section>

        {/* Grid */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map(i => {
              const Icon = iconBySlug[i.slug] ?? Building2
              return (
                <Link
                  key={i.slug}
                  href={`/industries/${i.slug}`}
                  className="group bg-white rounded-2xl border border-gray-200 hover:border-primary-300 hover:shadow-xl transition-all duration-300 p-7 flex flex-col"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 group-hover:text-primary-700 transition-colors mb-1">
                    {i.name}
                  </h2>
                  <div className="text-xs uppercase tracking-widest text-gray-400 mb-3">{i.shortName}</div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-5">{i.tagline}</p>
                  <div className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-primary-700 group-hover:gap-2 transition-all">
                    See the {i.name} playbook <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Other sectors note */}
        <section className="max-w-5xl mx-auto px-6 pb-20">
          <div className="bg-gradient-to-br from-secondary-50 via-white to-primary-50 rounded-2xl border border-gray-200 p-8 md:p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Not your sector?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              Telecom, hospitality, legal services, real estate, agriculture — we deliver in all of them.
              Book a 30-minute call and we’ll map our framework to your data and your regulator.
            </p>
            <Link
              href="/contact?intent=diagnostic"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 hover:shadow-lg transition-all"
            >
              Book a 30-minute call <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
