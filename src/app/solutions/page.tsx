import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Rocket, Building2, Compass, GraduationCap, Lightbulb, Hammer, RefreshCcw } from 'lucide-react'
import ThreePledges from '@/components/ThreePledges'
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

const phases = [
  { name: 'Diagnose', icon: Compass, copy: 'Establish the truth about where you stand.' },
  { name: 'Train', icon: GraduationCap, copy: 'Build the people layer before the tech layer.' },
  { name: 'Innovate', icon: Lightbulb, copy: 'Pick the right PoCs and prove value early.' },
  { name: 'Build', icon: Hammer, copy: 'Ship to production in your environment.' },
  { name: 'Sustain', icon: RefreshCcw, copy: 'We stay — governance, drift, refresh.' },
]

export default function SolutionsHubPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Home', url: 'https://gennoor.com' }, { name: 'Solutions', url: 'https://gennoor.com/solutions' }]} />
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0C1426] via-[#0F1B33] to-[#1A2547] text-white">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-primary-500/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-[35rem] h-[35rem] bg-secondary-400/20 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-6xl mx-auto px-6 py-24 lg:py-32 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs tracking-widest text-secondary-300 mb-6">
              SOLUTIONS
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Two tracks. One methodology.
              <span className="block text-secondary-300 mt-2">Built for whoever you are.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
              We don’t make SMBs feel priced out. We don’t make enterprises feel under-served.
              The same five-phase framework — <span className="text-secondary-300 font-semibold">Diagnose. Train. Innovate. Build. Sustain.</span> —
              runs both motions, just sized differently.
            </p>
          </div>
        </section>

        {/* Two-track selector */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/solutions/for-smb"
              className="group relative bg-white rounded-3xl border-2 border-gray-200 hover:border-primary-500 hover:shadow-2xl transition-all duration-300 p-8 md:p-10 flex flex-col"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Rocket className="w-7 h-7" />
              </div>
              <div className="text-xs uppercase tracking-widest text-primary-700 font-bold mb-2">For SMB</div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">10–250 person businesses</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Productized packages from $3k. Fixed price. Fixed scope. Code transferred on day one.
                Ship your first AI pilot in 6 weeks.
              </p>
              <ul className="space-y-2 text-sm text-gray-700 mb-8">
                <li>· AI Readiness Kit · Copilot Adoption Sprint · 6-Week AI Pilot</li>
                <li>· Compliance Foundation · Ongoing Fractional Capacity</li>
              </ul>
              <div className="mt-auto inline-flex items-center gap-1 text-primary-700 font-semibold group-hover:gap-2 transition-all">
                See the 5 SMB packages <ArrowRight className="w-4 h-4" />
              </div>
            </Link>

            <Link
              href="/solutions/for-enterprise"
              className="group relative bg-white rounded-3xl border-2 border-gray-200 hover:border-secondary-500 hover:shadow-2xl transition-all duration-300 p-8 md:p-10 flex flex-col"
            >
              <div className="w-14 h-14 rounded-2xl bg-secondary-100 text-secondary-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Building2 className="w-7 h-7" />
              </div>
              <div className="text-xs uppercase tracking-widest text-secondary-700 font-bold mb-2">For Enterprise</div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">250+ person organizations</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Custom engagement models — diagnostics, multi-PoC programs, agent factories, and
                multi-year sustainment retainers. Senior, Microsoft-certified, boutique-fast.
              </p>
              <ul className="space-y-2 text-sm text-gray-700 mb-8">
                <li>· Readiness Diagnostic · PoC Programs · Agent Factory</li>
                <li>· Center of Excellence · Sustainment Retainers · Sovereign Deployments</li>
              </ul>
              <div className="mt-auto inline-flex items-center gap-1 text-secondary-700 font-semibold group-hover:gap-2 transition-all">
                See the 6 enterprise models <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </section>

        {/* Phases mini */}
        <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 border-y border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="text-center mb-12">
              <div className="text-xs uppercase tracking-widest text-primary-700 font-bold mb-2">The Gennoor Way</div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">One journey, five phases</h2>
              <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
                Both tracks share the same backbone — you can enter at any phase, and you can stop at any phase.
              </p>
            </div>
            <div className="grid md:grid-cols-5 gap-4">
              {phases.map(p => (
                <div key={p.name} className="bg-white rounded-xl border border-gray-200 p-5 text-center hover:shadow-md transition-all">
                  <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center">
                    <p.icon className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-gray-900 mb-1">{p.name}</div>
                  <p className="text-xs text-gray-600 leading-relaxed">{p.copy}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/the-gennoor-way"
                className="inline-flex items-center gap-2 text-primary-700 font-semibold hover:text-primary-800"
              >
                Read the full methodology <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        <ThreePledges />

        {/* Final CTA */}
        <section className="max-w-5xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Not sure which track fits?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Book a 30-minute call. We’ll listen, ask three honest questions, and tell you which side of the door to walk through —
            even if the answer is “neither, you need someone else.”
          </p>
          <Link
            href="/contact?intent=diagnostic"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 hover:shadow-xl transition-all"
          >
            Book a 30-minute call <ArrowRight className="w-5 h-5" />
          </Link>
        </section>
      </div>
    </>
  )
}
