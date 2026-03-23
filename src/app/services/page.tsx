import Link from 'next/link'
import { Brain, GraduationCap, Code2, Bot, Handshake, Award, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Services | Gennoor',
  description: 'AI transformation services: strategy consulting, corporate training, PoC development, agentic AI solutions, collaboration, and certifications.',
}

const services = [
  {
    title: 'AI Strategy & Consulting',
    description: 'Enterprise AI roadmaps, ROI modeling, and governance frameworks. From readiness assessment to implementation planning.',
    icon: Brain,
    href: '/services/ai-strategy',
  },
  {
    title: 'Corporate Training',
    description: 'Executive bootcamps and technical workshops on Azure AI, Copilot, Power Platform, and emerging AI technologies.',
    icon: GraduationCap,
    href: '/services/training',
  },
  {
    title: 'PoC Development',
    description: 'Production-ready prototypes for document intelligence, chatbots, and automation — validated and deployable.',
    icon: Code2,
    href: '/services/poc-development',
  },
  {
    title: 'Agentic AI Solutions',
    description: 'Multi-agent orchestration with LangChain, CrewAI, and Copilot Studio for complex workflow automation.',
    icon: Bot,
    href: '/services/agentic-ai',
  },
  {
    title: 'Collaboration',
    description: 'Partnership models for organizations looking to co-develop AI solutions and share expertise.',
    icon: Handshake,
    href: '/services/collaboration',
  },
  {
    title: 'Certifications',
    description: 'Industry-recognized AI and cloud certifications to validate your team\'s expertise and capabilities.',
    icon: Award,
    href: '/services/certifications',
  },
]

export default function ServicesPage() {
  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our Services
            </h1>
            <p className="text-xl text-gray-600">
              End-to-end AI transformation — from strategic planning to hands-on implementation.
              We help organizations unlock the full potential of artificial intelligence.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <Link
                  key={service.title}
                  href={service.href}
                  className="group relative bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 block"
                >
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    {service.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-5">
                    {service.description}
                  </p>
                  <div className="flex items-center text-primary-600 text-sm font-medium">
                    <span>Learn more</span>
                    <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-600/5 to-accent-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-primary-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Not Sure Where to Start?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Book a free consultation and we&apos;ll help identify the right AI services for your organization.
          </p>
          <Link
            href="/contact#book"
            className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Book a Consultation
          </Link>
        </div>
      </section>
    </main>
  )
}
