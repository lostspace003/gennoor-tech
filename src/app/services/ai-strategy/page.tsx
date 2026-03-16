import { ArrowLeft, Target, TrendingUp, Shield, Users, CheckCircle } from 'lucide-react'
import Link from 'next/link'

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
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
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

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-primary-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Define Your AI Strategy?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Let's work together to create an AI roadmap that transforms your business
          </p>
          <Link
            href="/contact#book"
            className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Book a Strategy Consultation
          </Link>
        </div>
      </section>
    </main>
  )
}