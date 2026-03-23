import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Target, GraduationCap, Code2, Bot, Award, MapPin } from 'lucide-react'
import { BreadcrumbJsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'AI Training & Consulting Services — Enterprise Solutions',
  description: 'Enterprise AI services: strategy consulting, corporate training, PoC development, agentic AI solutions, and certification preparation. Delivered by Microsoft Certified Trainer Jalal Ahmed Khan.',
  keywords: ['AI training services', 'enterprise AI consulting', 'Microsoft AI training', 'corporate AI bootcamp', 'AI certification training'],
  alternates: { canonical: 'https://gennoor.com/services' },
}

const services = [
  {
    icon: Target,
    title: 'AI Strategy & Consulting',
    description: 'Enterprise AI roadmaps, readiness assessments, ROI modeling, and governance frameworks tailored to your business objectives.',
    href: '/services/ai-strategy',
    highlights: ['AI Readiness Assessment', 'ROI Modeling', 'Governance Framework', 'Implementation Roadmap'],
  },
  {
    icon: GraduationCap,
    title: 'Corporate AI Training',
    description: 'Executive bootcamps and technical workshops on Azure AI, Copilot Studio, Power Platform, and more. Live, hands-on, customized to your team.',
    href: '/services/training',
    highlights: ['Executive Bootcamps', 'Technical Workshops', 'Custom Curriculum', '80+ Programs'],
  },
  {
    icon: Code2,
    title: 'PoC Development',
    description: 'Production-ready AI prototypes in 2-6 weeks. Document intelligence, chatbots, process automation, and predictive analytics.',
    href: '/services/poc-development',
    highlights: ['2-6 Week Delivery', 'Full Source Code', 'Production Architecture', 'Knowledge Transfer'],
  },
  {
    icon: Bot,
    title: 'Agentic AI Solutions',
    description: 'Multi-agent systems using LangChain, CrewAI, Copilot Studio, and AutoGen. Autonomous AI that thinks, acts, and collaborates.',
    href: '/services/agentic-ai',
    highlights: ['Multi-Agent Orchestration', 'Tool Integration', 'Autonomous Workflows', 'Enterprise Scale'],
  },
  {
    icon: Award,
    title: 'Certification Preparation',
    description: 'Structured preparation for Microsoft Azure AI, Power BI, Copilot, and GitHub certifications with hands-on labs and practice exams.',
    href: '/services/certifications',
    highlights: ['AI-102', 'PL-300', 'MS-4004', 'GitHub Certifications'],
  },
]

const locationServices = [
  { title: 'AI Training in Saudi Arabia', href: '/services/ai-training-saudi-arabia', description: 'Vision 2030 aligned AI programs' },
  { title: 'AI Training in India', href: '/services/ai-training-india', description: 'Enterprise training across India' },
  { title: 'Remote AI Training', href: '/services/ai-training-remote', description: 'Live virtual sessions worldwide' },
]

export default function ServicesPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary-50 to-accent-50 py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Enterprise AI Services
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              From strategy to implementation — comprehensive AI training, consulting, and development
              services delivered by a Microsoft Certified Trainer with 14+ years of Fortune 500 experience.
            </p>
            <Link
              href="/contact#book"
              className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              Book a Free Discovery Call
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 max-w-5xl mx-auto">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <Link
                  key={service.title}
                  href={service.href}
                  className="group flex flex-col md:flex-row gap-6 bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {service.title}
                    </h2>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {service.highlights.map((h) => (
                        <span key={h} className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Training by Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {locationServices.map((loc) => (
              <Link
                key={loc.title}
                href={loc.href}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
              >
                <MapPin className="w-6 h-6 text-primary-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">{loc.title}</h3>
                <p className="text-sm text-gray-600">{loc.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-primary-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Not Sure Where to Start?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Book a free 30-minute discovery call. We&apos;ll discuss your goals and recommend the right service for your organization.
          </p>
          <Link
            href="/contact#book"
            className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Book a Free Call
          </Link>
        </div>
      </section>

      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://gennoor.com' },
        { name: 'Services', url: 'https://gennoor.com/services' },
      ]} />
    </>
  )
}
