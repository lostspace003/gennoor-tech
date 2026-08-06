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
      <div className="min-h-screen bg-white">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-white" />
          <div className="absolute inset-0" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
          <div className="relative max-w-6xl mx-auto px-6 py-10 lg:py-16 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50/80 border border-primary-100/60 text-xs tracking-widest font-semibold text-primary-600 mb-6">
              SOLUTIONS
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-gray-900 leading-tight tracking-tight mb-6">
              Two tracks. One methodology.
              <span className="block gradient-text mt-2">Built for whoever you are.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto">
              We don’t make SMBs feel priced out. We don’t make enterprises feel under-served.
              The same five-phase framework — <span className="text-primary-600 font-semibold">Diagnose. Train. Innovate. Build. Sustain.</span> —
              runs both motions, just sized differently.
            </p>
          </div>
        </section>

        {/* Two-track selector */}
        <section className="max-w-6xl mx-auto px-6 py-10 lg:py-16">
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/solutions/for-smb"
              className="group relative bg-white rounded-2xl border border-gray-200/70 shadow-sm hover:border-primary-300 hover:shadow-md transition-all duration-300 p-8 md:p-10 flex flex-col"
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
              className="group relative bg-white rounded-2xl border border-gray-200/70 shadow-sm hover:border-secondary-300 hover:shadow-md transition-all duration-300 p-8 md:p-10 flex flex-col"
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
        <section className="bg-primary-50 border-y border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-10 lg:py-16">
            <div className="text-center mb-12">
              <div className="text-xs uppercase tracking-widest text-primary-700 font-bold mb-2">The Gennoor Way</div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">One journey, five phases</h2>
              <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
                Both tracks share the same backbone — you can enter at any phase, and you can stop at any phase.
              </p>
            </div>
            <div className="grid md:grid-cols-5 gap-4">
              {phases.map(p => (
                <div key={p.name} className="bg-white rounded-2xl border border-gray-200/70 shadow-sm p-5 text-center hover:shadow-md transition-all">
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
        <section className="max-w-5xl mx-auto px-6 py-10 lg:py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Not sure which track fits?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Book a 30-minute call. We’ll listen, ask three honest questions, and tell you which side of the door to walk through —
            even if the answer is “neither, you need someone else.”
          </p>
          <Link
            href="/contact?intent=diagnostic"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl transition-all duration-300"
          >
            Book a 30-minute call <ArrowRight className="w-5 h-5" />
          </Link>
        </section>
      </div>
    </>
  )
}
