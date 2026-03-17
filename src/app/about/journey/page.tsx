import { Metadata } from 'next'
import { ArrowRight, MapPin, Award, Briefcase, GraduationCap, Globe, Rocket, Building2, Sparkles } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'My Journey',
  description: 'From Automobile Engineering to AI Leadership - The story of Jalal Ahmed Khan',
}

const timeline = [
  {
    year: '2010-2020',
    title: 'Academic Foundation',
    location: 'Mumbai, India',
    icon: 'graduation',
    description: 'Started with Automobile Engineering at Mumbai University, then spent 10 years as Assistant Professor across 4 colleges, building a strong foundation in teaching complex technical concepts.',
    highlight: 'Taught 1000+ engineering students',
  },
  {
    year: '2020-2022',
    title: 'Discovering Microsoft AI Ecosystem',
    location: 'India',
    icon: 'sparkles',
    description: 'Transitioned from academia to the corporate world, diving deep into Microsoft Azure, AI services, and cloud technologies. Achieved the prestigious MCT status.',
    highlight: 'Became Microsoft Certified Trainer (MCT)',
  },
  {
    year: '2022-2024',
    title: 'Scaling at Koenig Solutions',
    location: 'Global Delivery',
    icon: 'briefcase',
    description: 'Delivered 80+ enterprise training programs, working with Fortune 500 companies across 6+ countries. Specialized in Azure AI, Power Platform, and Copilot technologies.',
    highlight: 'Trained teams at Microsoft, IBM, Boeing',
  },
  {
    year: '2024-2025',
    title: 'International Leadership Programs',
    location: 'Saudi Arabia, Tanzania, Bahrain',
    icon: 'globe',
    description: 'Led transformative AI programs including 10-day bootcamps for C-suite executives at MCIT Saudi Arabia, Bank of Tanzania AI Agents implementation, and government enablement in Bahrain.',
    highlight: '50+ C-suite leaders trained on AI strategy',
  },
  {
    year: '2025-2026',
    title: 'Building PoCs at Tech Mahindra',
    location: 'India',
    icon: 'rocket',
    description: 'Developed production-ready AI solutions including RFP automation with 60% time reduction, document intelligence for banking, and custom MCP server integrations.',
    highlight: 'Delivered enterprise PoCs with immediate ROI',
  },
  {
    year: '2026-Present',
    title: 'Founding Gennoor Tech',
    location: 'Mumbai, India',
    icon: 'building',
    description: 'Launched Gennoor Tech Private Limited with the mission to democratize AI adoption for enterprises across GCC, Africa, and APAC. Planning Saudi Arabia expansion.',
    highlight: 'Building the future of enterprise AI',
  },
]

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  graduation: GraduationCap,
  sparkles: Sparkles,
  briefcase: Briefcase,
  globe: Globe,
  rocket: Rocket,
  building: Building2,
}

export default function JourneyPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-900 py-20 lg:py-28">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-widest uppercase text-primary-400 mb-4">
              About the Founder
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              My Journey
            </h1>
            <p className="text-xl text-gray-300 mb-3">
              From Automobile Engineering Professor to Global AI Transformation Leader
            </p>
            <p className="text-base text-gray-400">
              A story of continuous learning, adaptation, and impact across academia,
              enterprise training, and AI consulting.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Quote */}
      <section className="py-14 lg:py-20 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <blockquote className="relative">
              <div className="absolute -top-4 -left-2 text-6xl text-primary-200 font-serif leading-none select-none">&ldquo;</div>
              <p className="text-lg lg:text-xl text-gray-700 leading-relaxed pl-8">
                My journey is unconventional. I&apos;m not from a traditional developer background,
                yet I&apos;m building production-ready AI solutions for Fortune 500 companies.
                This unique path — from teaching engineering students to training C-suite executives
                on AI strategy — has given me a rare perspective: I understand both the technical
                complexities and the business imperatives of AI transformation.
              </p>
              <footer className="mt-6 pl-8">
                <p className="text-sm font-semibold text-gray-900">Jalal Ahmed Khan</p>
                <p className="text-sm text-gray-500">Founder, Gennoor Tech</p>
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">

            {/* Timeline */}
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-6 lg:left-8 top-0 bottom-0 w-px bg-gray-200" />

              {timeline.map((item, index) => {
                const Icon = ICONS[item.icon]
                return (
                  <div key={index} className="relative flex items-start mb-14 last:mb-0 group">
                    {/* Icon Circle */}
                    <div className="absolute left-6 lg:left-8 -translate-x-1/2 w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center group-hover:border-primary-500 transition-colors z-10">
                      {Icon && <Icon className="w-5 h-5 text-gray-500 group-hover:text-primary-600 transition-colors" />}
                    </div>

                    {/* Content Card */}
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

            {/* Key Insights */}
            <div className="mt-20 rounded-2xl border border-gray-100 bg-gray-50 p-8 lg:p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                What Makes My Approach Different
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Bridge Builder',
                    desc: 'I speak both languages — technical complexity for developers and strategic value for executives.',
                  },
                  {
                    title: 'Practical Focus',
                    desc: 'Every training includes hands-on labs, real datasets, and production-ready PoCs.',
                  },
                  {
                    title: 'Global Perspective',
                    desc: 'Delivered programs across cultures and industries, understanding diverse organizational needs.',
                  },
                  {
                    title: 'Continuous Learning',
                    desc: '376+ hours on Microsoft Learn, staying ahead of the rapidly evolving AI landscape.',
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
                href="/about/certifications"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                View my certifications
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 border border-gray-200 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}