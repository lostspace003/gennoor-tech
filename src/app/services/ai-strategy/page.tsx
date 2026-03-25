import { Metadata } from 'next'
import { ArrowLeft, Target, TrendingUp, Shield, Users, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { ServiceJsonLd, FAQJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'AI Strategy & Consulting — Enterprise AI Roadmap',
  description: 'Transform your organization with a comprehensive AI strategy. Expert-led AI readiness assessment, ROI modeling, governance frameworks, and implementation roadmaps for enterprises.',
  keywords: ['AI strategy consulting', 'enterprise AI roadmap', 'AI readiness assessment', 'AI governance framework', 'AI ROI modeling'],
  alternates: { canonical: 'https://gennoor.com/services/ai-strategy' },
  openGraph: {
    title: 'AI Strategy & Consulting — Enterprise AI Roadmap | Gennoor Tech',
    description: 'Transform your organization with a comprehensive AI strategy. Expert-led consulting from readiness assessment to implementation.',
    url: 'https://gennoor.com/services/ai-strategy',
  },
}

const faqs = [
  { question: 'How long does an AI strategy engagement take?', answer: 'A typical AI strategy engagement takes 5-8 weeks, covering discovery, strategy development, governance framework creation, and implementation planning. Timelines vary based on organization size and complexity.' },
  { question: 'What deliverables do I receive?', answer: 'You receive an AI Readiness Assessment Report, Enterprise AI Roadmap (3-5 year vision), ROI Modeling & Business Case, AI Governance Framework, Risk Assessment, and a detailed Change Management Plan.' },
  { question: 'Is this suitable for organizations new to AI?', answer: 'Absolutely. The engagement starts with a discovery phase that assesses your current state. Whether you are exploring AI for the first time or scaling existing initiatives, the strategy is tailored to your maturity level.' },
  { question: 'Do you work with specific industries?', answer: 'We have deep experience in banking & finance, government, energy, education, and technology sectors. The frameworks are adaptable to any industry with enterprise AI needs.' },
  { question: 'How is this different from a generic consulting firm?', answer: 'Jalal Ahmed Khan brings 14+ years of hands-on experience, 16 Microsoft certifications, and direct experience training C-suite leaders at Fortune 500 companies. You get practitioner-led strategy, not theoretical frameworks.' },
]

export default function AIStrategyPage() {
  const deliverables = [
    "AI Readiness Assessment Report",
    "Enterprise AI Roadmap (3-5 year vision)",
    "ROI Modeling & Business Case Development",
    "AI Governance Framework",
    "Risk Assessment & Mitigation Strategy",
    "Change Management Plan"
  ]

  const processSteps = [
    {
      title: "Discovery & Assessment",
      description: "Evaluate current state, capabilities, and AI readiness",
      duration: "1-2 weeks"
    },
    {
      title: "Strategy Development",
      description: "Design AI roadmap aligned with business objectives",
      duration: "2-3 weeks"
    },
    {
      title: "Governance Framework",
      description: "Establish policies, ethics guidelines, and controls",
      duration: "1-2 weeks"
    },
    {
      title: "Implementation Planning",
      description: "Create detailed execution plan with quick wins",
      duration: "1 week"
    }
  ]

  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="max-w-4xl">
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              AI Strategy & Consulting
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Transform your organization with a comprehensive AI strategy that delivers measurable business value.
              From readiness assessment to implementation roadmap, we guide your AI journey.
            </p>
            <Link
              href="/contact#book"
              className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              Schedule Strategy Session
            </Link>
          </div>
        </div>
      </section>

      {/* Key Focus Areas */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Strategic Focus Areas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Business Alignment</h3>
              <p className="text-gray-600">Ensure AI initiatives directly support business objectives</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">ROI Optimization</h3>
              <p className="text-gray-600">Identify high-impact use cases with clear returns</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Risk Management</h3>
              <p className="text-gray-600">Address ethical, legal, and operational risks</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Change Management</h3>
              <p className="text-gray-600">Build AI-ready culture and capabilities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Our Strategic Process
          </h2>
          <div className="max-w-4xl mx-auto">
            {processSteps.map((step, index) => (
              <div key={step.title} className="flex mb-8 last:mb-0">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 mb-1">{step.description}</p>
                  <p className="text-sm text-primary-600 font-medium">Duration: {step.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Key Deliverables
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deliverables.map((item) => (
                <div key={item} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Related Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link href="/services/training" className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-2">Corporate AI Training</h3>
              <p className="text-sm text-gray-600">Upskill your team with hands-on Azure AI, Copilot, and Power Platform bootcamps.</p>
            </Link>
            <Link href="/services/poc-development" className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-2">PoC Development</h3>
              <p className="text-sm text-gray-600">Validate your AI strategy with a working prototype in 2-6 weeks.</p>
            </Link>
            <Link href="/services/agentic-ai" className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-2">Agentic AI Solutions</h3>
              <p className="text-sm text-gray-600">Build autonomous AI systems that execute your strategy.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-primary-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Define Your AI Strategy?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Let&apos;s work together to create an AI roadmap that transforms your business
          </p>
          <Link
            href="/contact#book"
            className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Book a Strategy Consultation
          </Link>
        </div>
      </section>

      <ServiceJsonLd
        name="AI Strategy & Consulting"
        description="Comprehensive AI strategy consulting including readiness assessment, ROI modeling, governance frameworks, and implementation roadmaps for enterprises."
        url="https://gennoor.com/services/ai-strategy"
      />
      <FAQJsonLd faqs={faqs} />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://gennoor.com' },
        { name: 'Services', url: 'https://gennoor.com/services' },
        { name: 'AI Strategy & Consulting', url: 'https://gennoor.com/services/ai-strategy' },
      ]} />
    </main>
  )
}