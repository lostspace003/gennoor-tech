import { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Download, ArrowRight, Shield, Database, Users, Target, Zap, BookOpen } from 'lucide-react'
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'AI Readiness Checklist — Is Your Enterprise Ready for AI? | Gennoor Tech',
  description: 'Free AI readiness assessment checklist for enterprises. Evaluate your data infrastructure, team skills, governance framework, and technology stack. Based on 14+ years of enterprise AI consulting.',
  keywords: ['AI readiness checklist', 'enterprise AI assessment', 'AI readiness framework', 'AI maturity assessment', 'AI adoption checklist'],
  alternates: { canonical: 'https://gennoor.com/resources/guides/ai-readiness-checklist' },
}

const checklistSections = [
  {
    icon: Database,
    title: 'Data Readiness',
    items: [
      'Data inventory completed — you know what data you have and where it lives',
      'Data quality assessment done — accuracy, completeness, and freshness measured',
      'Data governance policies in place — ownership, access controls, retention rules',
      'Data pipelines operational — ETL/ELT processes reliable and monitored',
      'Unstructured data strategy defined — documents, images, emails catalogued',
    ],
  },
  {
    icon: Users,
    title: 'Team & Skills Readiness',
    items: [
      'Executive sponsor identified with budget authority and staying power',
      'AI champion(s) designated within business units',
      'Current team skills assessed against AI capability requirements',
      'Training plan created for all three tiers (executive, management, practitioner)',
      'Recruitment plan for missing AI/ML engineering roles',
    ],
  },
  {
    icon: Shield,
    title: 'Governance & Ethics',
    items: [
      'AI governance framework established — policies, review boards, approval processes',
      'Responsible AI principles documented — fairness, transparency, accountability',
      'Regulatory compliance requirements mapped — GDPR, HIPAA, SOC2, industry-specific',
      'Bias testing and fairness metrics defined for AI outputs',
      'Incident response plan for AI failures or harmful outputs',
    ],
  },
  {
    icon: Zap,
    title: 'Technology Infrastructure',
    items: [
      'Cloud platform selected and configured — Azure, AWS, or GCP',
      'GPU/compute resources available or budgeted for training and inference',
      'API management platform in place for model endpoints',
      'MLOps pipeline established — version control, CI/CD, model registry',
      'Monitoring and observability tools configured for AI workloads',
    ],
  },
  {
    icon: Target,
    title: 'Business Alignment',
    items: [
      'AI use cases identified and prioritized by business impact and feasibility',
      'Success criteria and KPIs defined before starting any AI project',
      'ROI model built for top 3 use cases with realistic assumptions',
      'Change management plan for AI-augmented workflows',
      'Budget allocated for initial pilot AND production scale-up',
    ],
  },
]

const faqs = [
  { question: 'How do I assess my organization\'s AI readiness?', answer: 'Use this checklist to evaluate five dimensions: data readiness, team skills, governance framework, technology infrastructure, and business alignment. Score each item as Complete, In Progress, or Not Started. Organizations typically need 60%+ completion before starting production AI projects.' },
  { question: 'What is the most common gap in AI readiness?', answer: 'Data readiness is the most common gap. Organizations often underestimate the effort needed to clean, structure, and govern their data before AI can use it effectively. The second most common gap is skills — specifically, the absence of executive and management-level AI fluency.' },
  { question: 'How long does it take to become AI-ready?', answer: 'For organizations starting from scratch, expect 3-6 months to reach baseline readiness. This includes data assessment (Month 1), governance setup (Month 2), team training (Months 2-3), and infrastructure provisioning (Months 3-4). Pilot projects can start in parallel from Month 3.' },
]

export default function AIReadinessChecklist() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://gennoor.com' },
        { name: 'Resources', url: 'https://gennoor.com/resources' },
        { name: 'Guides', url: 'https://gennoor.com/resources/guides' },
        { name: 'AI Readiness Checklist', url: 'https://gennoor.com/resources/guides/ai-readiness-checklist' },
      ]} />
      <FAQJsonLd faqs={faqs} />

      <main className="min-h-screen pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-br from-emerald-600 to-teal-800 py-16 lg:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl">
              <span className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 text-white text-sm font-medium">
                <CheckCircle className="w-4 h-4 mr-2" />
                Free Resource
              </span>
              <h1 className="text-4xl lg:text-5xl font-black text-white mb-6">
                Enterprise AI Readiness Checklist
              </h1>
              <p className="text-xl text-white/90 mb-8">
                25 critical checkpoints across 5 dimensions. Assess your organization&apos;s readiness for
                AI adoption — based on 14+ years of enterprise AI consulting across 6 countries.
              </p>
              <Link href="/contact#book" className="inline-flex items-center px-8 py-4 bg-white text-emerald-700 font-medium rounded-lg hover:bg-gray-100 transition-colors">
                Get Expert Assessment
              </Link>
            </div>
          </div>
        </section>

        {/* Checklist Sections */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-12">
              {checklistSections.map((section) => {
                const Icon = section.icon
                return (
                  <div key={section.title}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                    </div>
                    <div className="space-y-3">
                      {section.items.map((item) => (
                        <div key={item} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="w-5 h-5 border-2 border-gray-300 rounded flex-shrink-0 mt-0.5"></div>
                          <p className="text-gray-700">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Related Resources */}
        <section className="py-16 lg:py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Related Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/resources/blog/ai-data-readiness-enterprise-checklist" className="bg-white rounded-lg p-6 border border-gray-100 hover:shadow-md transition-shadow group">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-emerald-600">AI Data Readiness: Enterprise Checklist</h3>
                  <p className="text-sm text-gray-600">Deep dive into data preparation for AI projects</p>
                </Link>
                <Link href="/resources/blog/ai-governance-framework-enterprise" className="bg-white rounded-lg p-6 border border-gray-100 hover:shadow-md transition-shadow group">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-emerald-600">AI Governance Framework</h3>
                  <p className="text-sm text-gray-600">Building responsible AI governance for enterprises</p>
                </Link>
                <Link href="/resources/blog/ai-strategy-c-suite-executive-guide" className="bg-white rounded-lg p-6 border border-gray-100 hover:shadow-md transition-shadow group">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-emerald-600">AI Strategy: C-Suite Guide</h3>
                  <p className="text-sm text-gray-600">Executive guide to AI strategy and investment decisions</p>
                </Link>
                <Link href="/resources/guides/enterprise-ai-training" className="bg-white rounded-lg p-6 border border-gray-100 hover:shadow-md transition-shadow group">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-emerald-600">Enterprise AI Training Guide</h3>
                  <p className="text-sm text-gray-600">How to build AI capabilities at every level of your organization</p>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {faqs.map((faq) => (
                <div key={faq.question} className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-20 bg-emerald-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Need Help with Your AI Readiness Assessment?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Book a free 30-minute discovery call. We&apos;ll review your checklist results and recommend next steps.
            </p>
            <Link href="/contact#book" className="inline-flex items-center px-8 py-4 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors">
              Book Free Assessment Call
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
