import { Metadata } from 'next'
import { ArrowRight, MapPin, Award, Briefcase, GraduationCap, Globe, Rocket, Building2, Sparkles } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'My Journey — From Engineering Professor to Global AI Leader',
  description: 'The story of Jalal Ahmed Khan: 14+ years from Automobile Engineering professor to Microsoft Certified Trainer, Fortune 500 AI consultant, and founder of Gennoor Tech.',
  keywords: ['Jalal Ahmed Khan journey', 'AI consultant story', 'Microsoft Certified Trainer India'],
  alternates: { canonical: 'https://gennoor.com/about/journey' },
}

const timeline = [
  { year: '2010-2020', title: 'Academic Foundation', location: 'Mumbai, India', icon: 'graduation', description: 'Started with Automobile Engineering at Mumbai University, then spent 10 years as Assistant Professor across 4 colleges, building a strong foundation in teaching complex technical concepts.', highlight: 'Taught 1000+ engineering students' },
  { year: '2020-2022', title: 'Discovering Microsoft AI Ecosystem', location: 'India', icon: 'sparkles', description: 'Transitioned from academia to the corporate world, diving deep into Microsoft Azure, AI services, and cloud technologies. Achieved the prestigious MCT status.', highlight: 'Became Microsoft Certified Trainer (MCT)' },
  { year: '2022-2024', title: 'Scaling at Koenig Solutions', location: 'Global Delivery', icon: 'briefcase', description: 'Delivered 80+ enterprise training programs, working with Fortune 500 companies across 6+ countries. Specialized in Azure AI, Power Platform, and Copilot technologies.', highlight: 'Trained teams at Microsoft, IBM, Boeing' },
  { year: '2024-2025', title: 'International Leadership Programs', location: 'Saudi Arabia, Tanzania, Bahrain', icon: 'globe', description: 'Led transformative AI programs including 10-day bootcamps for C-suite executives at MCIT Saudi Arabia, Bank of Tanzania AI Agents implementation, and government enablement in Bahrain.', highlight: '50+ C-suite leaders trained on AI strategy' },
  { year: '2025-2026', title: 'Building PoCs at Tech Mahindra', location: 'India', icon: 'rocket', description: 'Developed production-ready AI solutions including RFP automation with 60% time reduction, document intelligence for banking, and custom MCP server integrations.', highlight: 'Delivered enterprise PoCs with immediate ROI' },
  { year: '2026-Present', title: 'Founding Gennoor Tech', location: 'Mumbai, India', icon: 'building', description: 'Launched Gennoor Tech Private Limited with the mission to democratize AI adoption for enterprises across GCC, Africa, and APAC. Planning Saudi Arabia expansion.', highlight: 'Building the future of enterprise AI' },
]

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  graduation: GraduationCap, sparkles: Sparkles, briefcase: Briefcase,
  globe: Globe, rocket: Rocket, building: Building2,
}

export default function JourneyPage() {
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
              About the Founder
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4 leading-tight">My Journey</h1>
            <p className="text-xl text-gray-500 mb-2">From Automobile Engineering Professor to Global AI Transformation Leader</p>
            <p className="text-base text-gray-400">A story of continuous learning, adaptation, and impact across academia, enterprise training, and AI consulting.</p>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-16 lg:py-20 relative">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <blockquote className="relative glass-card rounded-2xl p-8">
              <div className="absolute -top-3 left-6 text-5xl text-primary-200 font-serif leading-none select-none">&ldquo;</div>
              <p className="text-lg text-gray-600 leading-relaxed pl-4">
                My journey is unconventional. I&apos;m not from a traditional developer background,
                yet I&apos;m building production-ready AI solutions for Fortune 500 companies.
                This unique path — from teaching engineering students to training C-suite executives
                on AI strategy — has given me a rare perspective: I understand both the technical
                complexities and the business imperatives of AI transformation.
              </p>
              <footer className="mt-5 pl-4">
                <p className="text-sm font-semibold text-gray-900">Jalal Ahmed Khan</p>
                <p className="text-xs text-gray-400">Founder, Gennoor Tech</p>
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-6 lg:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary-200 via-gray-200 to-gray-100" />

              {timeline.map((item, index) => {
                const Icon = ICONS[item.icon]
                return (
                  <div key={index} className="relative flex items-start mb-12 last:mb-0 group">
                    <div className="absolute left-6 lg:left-8 -translate-x-1/2 w-12 h-12 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center group-hover:border-primary-400 transition-colors z-10 shadow-sm">
                      {Icon && <Icon className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />}
                    </div>

                    <div className="ml-20 lg:ml-24 flex-1 rounded-2xl p-6 glass-card glow-border transition-all duration-500">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="px-3 py-1 rounded-lg text-xs font-bold bg-primary-50/80 text-primary-600 border border-primary-100/60">
                          {item.year}
                        </span>
                        <span className="flex items-center text-xs text-gray-400">
                          <MapPin className="w-3 h-3 mr-1" />
                          {item.location}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed mb-4">{item.description}</p>
                      <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50/80 rounded-lg px-3 py-2 w-fit border border-emerald-100/60">
                        <Award className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="font-semibold">{item.highlight}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Key Insights */}
            <div className="mt-20 rounded-2xl glass-card p-8 lg:p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">What Makes My Approach Different</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'Bridge Builder', desc: 'I speak both languages — technical complexity for developers and strategic value for executives.' },
                  { title: 'Practical Focus', desc: 'Every training includes hands-on labs, real datasets, and production-ready PoCs.' },
                  { title: 'Global Perspective', desc: 'Delivered programs across cultures and industries, understanding diverse organizational needs.' },
                  { title: 'Continuous Learning', desc: '376+ hours on Microsoft Learn, staying ahead of the rapidly evolving AI landscape.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-xl p-5 glass-card">
                    <h4 className="text-sm font-bold text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/about/certifications" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold rounded-xl hover:shadow-glow-blue transition-all duration-300">
                View my certifications <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center px-6 py-3 text-sm font-semibold text-gray-700 rounded-xl glass-card transition-all duration-300">
                Get in touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
