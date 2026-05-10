import { Metadata } from 'next'
import { Target, Rocket, GraduationCap, Globe, Building2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Gennoor Tech',
  description: 'Enterprise AI Training & Solutions — Bridging the gap between cutting-edge technology and real-world business impact across emerging markets.',
}

const coreObjectives = [
  { title: 'Enterprise AI Training', description: 'Deliver world-class training programs across Azure AI, Copilot, Agentic AI, and cloud platforms, with hands-on labs and real-world datasets.', icon: GraduationCap },
  { title: 'Strategic Consulting', description: 'Guide leadership teams through AI readiness assessments, use-case identification, and transformation roadmaps tailored to their industry.', icon: Target },
  { title: 'PoC Development', description: 'Build production-ready proof-of-concepts in 4-8 week sprints — from document intelligence to agentic workflows — delivering immediate, measurable ROI.', icon: Rocket },
  { title: 'Global Expansion', description: 'Scale AI enablement across GCC, Africa, and APAC markets, bringing enterprise-grade training to regions where demand is surging.', icon: Globe },
]

const companyDetails = [
  { label: 'Company', value: 'Gennoor Tech Private Limited' },
  { label: 'Founded', value: '2026' },
  { label: 'Headquarters', value: 'Mumbai, India' },
  { label: 'Markets', value: 'India, GCC, Africa, APAC' },
  { label: 'Founder', value: 'Jalal Ahmed Khan' },
]

export default function CompanyPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-14 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 bg-gradient-mesh" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full px-3 py-1 mb-5 text-xs font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/60">
              About the Company
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4 leading-tight">
              Gennoor Tech
            </h1>
            <p className="text-xl text-gray-500">
              Enterprise AI Training &amp; Solutions
            </p>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-16 lg:py-20 relative">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-primary-400 mb-4">Our Vision</p>
            <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
              To be the trusted partner for enterprises navigating AI transformation — bridging
              the gap between cutting-edge technology and real-world business impact across
              emerging markets.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 lg:py-20 relative">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-primary-400 mb-4">Our Mission</p>
            <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
              We democratize AI adoption for enterprises through expert-led training, hands-on
              implementation, and strategic consulting. From C-suite strategy workshops to
              production-ready PoC development, we ensure organizations don&apos;t just
              understand AI — they deploy it.
            </p>
          </div>
        </div>
      </section>

      {/* Core Objectives */}
      <section className="py-16 lg:py-24 relative">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl glass-card p-8 lg:p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Core Objectives</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {coreObjectives.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.title} className="rounded-xl p-5 glass-card">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-primary-600" />
                        </div>
                        <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Company Details */}
            <div className="mt-10 rounded-2xl glass-card p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Company Details</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10">
                {companyDetails.map((item) => (
                  <div key={item.label}>
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-1">{item.label}</p>
                    <p className="text-base font-medium text-gray-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/about/journey"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold rounded-xl hover:shadow-glow-blue transition-all duration-300"
              >
                Meet the Founder
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 text-sm font-semibold text-gray-700 rounded-xl glass-card transition-all duration-300"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
