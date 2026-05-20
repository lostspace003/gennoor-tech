import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Target, GraduationCap, Code2, Bot, Award, MapPin } from 'lucide-react'
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd'

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
    highlights: ['AI-103', 'PL-300', 'MS-4004', 'GitHub Certifications'],
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
      {/* Hero */}
      <section className="relative py-14 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 bg-gradient-mesh" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="inline-flex items-center rounded-full px-3 py-1 mb-5 text-xs font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/60">
              The Gennoor Way · Five phases, one partner
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              End-to-end AI transformation — diagnosed, built, and sustained by one team.
            </h1>
            <p className="text-xl text-gray-500 mb-8 leading-relaxed max-w-3xl">
              Diagnose. Train. Innovate. Build. Sustain. We deliver the full AI journey for
              enterprises and growing businesses across GCC, Africa, and South Asia — with
              senior Microsoft-certified delivery, transparent pricing, and stack-flexible
              architecture (Azure, AWS, GCP, or open-source — your choice).
            </p>
            <Link
              href="/contact#book"
              className="inline-flex items-center px-7 py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:shadow-glow-blue transition-all duration-300"
            >
              Book a Free Discovery Call
            </Link>
          </div>
        </div>
      </section>

      {/* Service Cards */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-5 max-w-5xl mx-auto">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <Link
                  key={service.title}
                  href={service.href}
                  className="group flex flex-col md:flex-row gap-6 rounded-2xl p-7 transition-all duration-500 glass-card glow-border"
                >
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary-500/15">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {service.title}
                    </h2>
                    <p className="text-gray-500 mb-4 leading-relaxed">{service.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {service.highlights.map((h) => (
                        <span key={h} className="px-3 py-1 bg-primary-50/80 text-primary-600 text-xs font-semibold rounded-lg border border-primary-100/60">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary-600 group-hover:translate-x-1.5 transition-all duration-300" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Training by Location */}
      <section className="py-20 lg:py-24 relative">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Training by Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {locationServices.map((loc) => (
              <Link
                key={loc.title}
                href={loc.href}
                className="rounded-2xl p-6 transition-all duration-500 glass-card glow-border group"
              >
                <MapPin className="w-5 h-5 text-primary-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">{loc.title}</h3>
                <p className="text-sm text-gray-500">{loc.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-24 relative">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { question: 'What AI services does Gennoor Tech offer?', answer: 'Gennoor Tech offers AI strategy consulting, corporate AI training (80+ programs), PoC development, agentic AI solutions, and certification exam preparation across Microsoft, AWS, Google Cloud, and GitHub platforms.' },
              { question: 'Do you offer remote AI training?', answer: 'Yes, we offer live virtual instructor-led training with the same hands-on labs and interactive experience as on-site sessions. We serve clients globally across India, Saudi Arabia, UAE, East Africa, and Southeast Asia.' },
              { question: 'Which industries does Gennoor Tech serve?', answer: 'We serve financial services, insurance, healthcare, manufacturing, oil and gas, telecom, government, and technology sectors. Our clients include Fortune 500 companies like Boeing, Saudi Aramco, HDFC Bank, Siemens, and EY.' },
              { question: 'How do I get started with Gennoor Tech?', answer: 'Book a free 30-minute discovery call where we discuss your goals, assess your current AI maturity, and recommend the right service. From there we provide a customized proposal within 48 hours.' },
              { question: 'What makes Gennoor Tech training different from other providers?', answer: 'Our training is led by a Microsoft Certified Trainer with 16+ active certifications and 14+ years of enterprise experience across 6 countries. Every program is customized with industry-specific case studies, hands-on labs using your own data scenarios, and post-training mentoring.' },
            ].map((faq) => (
              <div key={faq.question} className="rounded-2xl p-6 glass-card">
                <h3 className="text-base font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 bg-gradient-mesh" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-5">Not Sure Where to Start?</h2>
          <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
            Book a free 30-minute discovery call. We&apos;ll discuss your goals and recommend the right service for your organization.
          </p>
          <Link
            href="/contact#book"
            className="inline-flex items-center px-7 py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:shadow-glow-blue transition-all duration-300"
          >
            Book a Free Call
          </Link>
        </div>
      </section>

      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://gennoor.com' },
        { name: 'Services', url: 'https://gennoor.com/services' },
      ]} />
      <FAQJsonLd faqs={[
        { question: 'What AI services does Gennoor Tech offer?', answer: 'Gennoor Tech offers AI strategy consulting, corporate AI training (80+ programs), PoC development, agentic AI solutions, and certification exam preparation across Microsoft, AWS, Google Cloud, and GitHub platforms.' },
        { question: 'Do you offer remote AI training?', answer: 'Yes, we offer live virtual instructor-led training with the same hands-on labs and interactive experience as on-site sessions. We serve clients globally across India, Saudi Arabia, UAE, East Africa, and Southeast Asia.' },
        { question: 'Which industries does Gennoor Tech serve?', answer: 'We serve financial services, insurance, healthcare, manufacturing, oil and gas, telecom, government, and technology sectors. Our clients include Fortune 500 companies like Boeing, Saudi Aramco, HDFC Bank, Siemens, and EY.' },
        { question: 'How do I get started with Gennoor Tech?', answer: 'Book a free 30-minute discovery call where we discuss your goals, assess your current AI maturity, and recommend the right service. From there we provide a customized proposal within 48 hours.' },
        { question: 'What makes Gennoor Tech training different from other providers?', answer: 'Our training is led by a Microsoft Certified Trainer with 16+ active certifications and 14+ years of enterprise experience across 6 countries. Every program is customized with industry-specific case studies, hands-on labs using your own data scenarios, and post-training mentoring.' },
      ]} />
    </>
  )
}
