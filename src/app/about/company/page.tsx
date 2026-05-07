import { Metadata } from 'next'
import { Target, Rocket, GraduationCap, Globe, Building2, ArrowRight, MapPin, Award, Sparkles, Briefcase } from 'lucide-react'
import Link from 'next/link'
import { OrganizationJsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'About Gennoor Tech — Enterprise AI Training & Solutions',
  description: 'Gennoor Tech Private Limited — enterprise AI training, consulting, and PoC development. Trusted by Fortune 500 companies across 6+ countries.',
  alternates: { canonical: 'https://gennoor.com/about/company' },
}

const coreObjectives = [
  {
    title: 'Enterprise AI Training',
    description: 'Deliver world-class training programs across Azure AI, Copilot, Agentic AI, and cloud platforms, with hands-on labs and real-world datasets.',
    icon: GraduationCap,
  },
  {
    title: 'Strategic Consulting',
    description: 'Guide leadership teams through AI readiness assessments, use-case identification, and transformation roadmaps tailored to their industry.',
    icon: Target,
  },
  {
    title: 'PoC Development',
    description: 'Build production-ready proof-of-concepts in 4-8 week sprints — from document intelligence to agentic workflows — delivering immediate, measurable ROI.',
    icon: Rocket,
  },
  {
    title: 'Global Expansion',
    description: 'Scale AI enablement across GCC, Africa, and APAC markets, bringing enterprise-grade training to regions where demand is surging.',
    icon: Globe,
  },
]

const companyDetails = [
  { label: 'Company', value: 'Gennoor Tech Private Limited' },
  { label: 'Founded', value: '2026' },
  { label: 'Headquarters', value: 'Mumbai, India' },
  { label: 'Markets', value: 'India, GCC, Africa, APAC' },
  { label: 'Founder', value: 'Jalal Ahmed Khan' },
]

const timeline = [
  {
    year: '2020–2022',
    title: 'Early Consulting & Microsoft Partnership',
    location: 'India',
    icon: 'sparkles',
    description: 'What started as independent AI consulting quickly evolved into a deep partnership with the Microsoft ecosystem. Achieving Microsoft Certified Trainer (MCT) status opened the door to enterprise-grade delivery.',
    highlight: 'Microsoft Certified Trainer status achieved',
  },
  {
    year: '2022–2024',
    title: 'Scaling Enterprise Training',
    location: 'Global Delivery',
    icon: 'briefcase',
    description: 'Delivered 80+ enterprise training programs for Fortune 500 companies across 6+ countries. Specialization in Azure AI, Power Platform, and Copilot technologies established Gennoor as a trusted training partner.',
    highlight: '80+ programs for Microsoft, IBM, Boeing & more',
  },
  {
    year: '2024–2025',
    title: 'International Expansion',
    location: 'Saudi Arabia, Tanzania, Bahrain',
    icon: 'globe',
    description: 'Led transformative AI programs for government and enterprise clients — including C-suite bootcamps at MCIT Saudi Arabia, AI Agents implementation for Bank of Tanzania, and government enablement in Bahrain.',
    highlight: '50+ C-suite leaders trained on AI strategy',
  },
  {
    year: '2025–2026',
    title: 'Enterprise-Grade Solutions',
    location: 'India',
    icon: 'rocket',
    description: 'Built production-ready AI solutions for enterprise clients — RFP automation achieving 60% time reduction, document intelligence for banking, and custom MCP server integrations that delivered immediate ROI.',
    highlight: 'Enterprise PoCs with measurable ROI',
  },
  {
    year: '2026–Present',
    title: 'Gennoor Tech Pvt Ltd Incorporated',
    location: 'Mumbai, India',
    icon: 'building',
    description: 'Incorporated as Gennoor Tech Private Limited with a mission to democratize AI adoption for enterprises across GCC, Africa, and APAC. Expanding training, consulting, and PoC development services globally.',
    highlight: 'Building the future of enterprise AI',
  },
]

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  sparkles: Sparkles,
  briefcase: Briefcase,
  globe: Globe,
  rocket: Rocket,
  building: Building2,
}

export default function CompanyPage() {
  return (
    <>
      <OrganizationJsonLd />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-accent-50 py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-widest uppercase text-primary-600 mb-4">
              About the Company
            </p>
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
              Gennoor Tech
            </h1>
            <p className="text-xl text-gray-600 mb-3">
              Enterprise AI Training &amp; Solutions
            </p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-14 lg:py-20 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm font-semibold tracking-widest uppercase text-primary-400 mb-4">
              Our Vision
            </p>
            <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
              To be the trusted partner for enterprises navigating AI transformation — bridging
              the gap between cutting-edge technology and real-world business impact across
              emerging markets.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-14 lg:py-20 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm font-semibold tracking-widest uppercase text-primary-400 mb-4">
              Our Mission
            </p>
            <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
              We democratize AI adoption for enterprises through expert-led training, hands-on
              implementation, and strategic consulting. From C-suite strategy workshops to
              production-ready PoC development, we ensure organizations don&apos;t just
              understand AI — they deploy it.
            </p>
          </div>
        </div>
      </section>

      {/* Core Objectives Section */}
      <section className="py-16 lg:py-24 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-8 lg:p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Core Objectives
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {coreObjectives.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.title} className="bg-white rounded-xl p-5 border border-gray-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-primary-600" />
                        </div>
                        <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Company Details Card */}
            <div className="mt-12 rounded-2xl border border-gray-100 bg-white p-8 lg:p-10 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Company Details
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10">
                {companyDetails.map((item) => (
                  <div key={item.label}>
                    <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1">
                      {item.label}
                    </p>
                    <p className="text-base font-medium text-gray-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story — Timeline */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                From early AI consulting to a global enterprise training company
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-6 lg:left-8 top-0 bottom-0 w-px bg-gray-200" />

              {timeline.map((item, index) => {
                const Icon = ICONS[item.icon]
                return (
                  <div key={index} className="relative flex items-start mb-14 last:mb-0 group">
                    <div className="absolute left-6 lg:left-8 -translate-x-1/2 w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center group-hover:border-primary-500 transition-colors z-10">
                      {Icon && <Icon className="w-5 h-5 text-gray-500 group-hover:text-primary-600 transition-colors" />}
                    </div>

                    <div className="ml-20 lg:ml-24 flex-1 bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-700">
                          {item.year}
                        </span>
                        <span className="flex items-center text-xs text-gray-400">
                          <MapPin className="w-3 h-3 mr-1" />
                          {item.location}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed mb-4">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 rounded-lg px-3 py-2 w-fit">
                        <Award className="w-4 h-4 flex-shrink-0" />
                        <span className="font-medium">{item.highlight}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* What Makes Us Different */}
            <div className="mt-20 rounded-2xl border border-gray-100 bg-gray-50 p-8 lg:p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                What Makes Gennoor Tech Different
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Bridge Between Strategy & Execution',
                    desc: 'We speak both languages — technical depth for developers and strategic value for executives.',
                  },
                  {
                    title: 'Practical, Not Theoretical',
                    desc: 'Every training includes hands-on labs, real datasets, and production-ready PoCs.',
                  },
                  {
                    title: 'Global Perspective',
                    desc: 'Programs delivered across cultures and industries, understanding diverse organizational needs.',
                  },
                  {
                    title: 'Continuous Innovation',
                    desc: '16+ active certifications and deep engagement with the latest AI platforms and frameworks.',
                  },
                ].map((item) => (
                  <div key={item.title} className="bg-white rounded-xl p-5 border border-gray-100">
                    <h4 className="text-sm font-bold text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/about/founder"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                Meet the Founder
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 border border-gray-200 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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
