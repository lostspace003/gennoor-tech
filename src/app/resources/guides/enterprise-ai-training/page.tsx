import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, Award, Users, Globe, Target, CheckCircle, Zap } from 'lucide-react'
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Enterprise AI Training — Complete Guide to Corporate AI Upskilling | Gennoor Tech',
  description: 'The definitive guide to enterprise AI training. Learn how to build AI capabilities at every level — executive, management, and practitioner. Covers training formats, ROI, certification paths, and implementation strategies.',
  keywords: ['enterprise AI training', 'corporate AI training', 'AI upskilling', 'AI workforce development', 'corporate AI bootcamp', 'Microsoft AI training', 'AI certification training'],
  alternates: { canonical: 'https://gennoor.com/resources/guides/enterprise-ai-training' },
  openGraph: {
    title: 'Enterprise AI Training — Complete Guide',
    description: 'The definitive guide to building AI capabilities across your organization.',
    url: 'https://gennoor.com/resources/guides/enterprise-ai-training',
  },
}

const trainingTiers = [
  {
    title: 'Executive AI Fluency',
    audience: 'C-Suite, VPs, Directors',
    duration: '1-2 days',
    description: 'What AI can and cannot do, how to evaluate investments, governance frameworks, and risk management.',
    programs: [
      { name: 'AI Transformation for Business Leaders', href: '/services/training/ai-transformation-for-business-leaders' },
      { name: 'Executive AI Leadership', href: '/services/training/executive-ai-leadership' },
    ],
    blog: { name: 'AI Strategy for C-Suite Executives', href: '/resources/blog/ai-strategy-c-suite-executive-guide' },
  },
  {
    title: 'Management Capability',
    audience: 'Project Managers, Team Leads, Product Owners',
    duration: '2-3 days',
    description: 'Identify AI opportunities, write requirements for AI projects, manage AI-augmented teams, and measure ROI.',
    programs: [
      { name: 'AI Governance Framework', href: '/resources/blog/ai-governance-framework-enterprise' },
      { name: 'AI Data Readiness Checklist', href: '/resources/blog/ai-data-readiness-enterprise-checklist' },
    ],
    blog: { name: 'AI Training & Upskilling Enterprise Workforce', href: '/resources/blog/ai-training-upskilling-enterprise-workforce' },
  },
  {
    title: 'Practitioner Skill',
    audience: 'Developers, Data Scientists, AI Engineers',
    duration: '3-10 days',
    description: 'Hands-on technical skills: prompt engineering, model evaluation, system integration, MLOps, and agent development.',
    programs: [
      { name: 'Agentic AI Engineering', href: '/services/training/agentic-ai-engineering' },
      { name: 'Microsoft AI for Developers', href: '/services/training/microsoft-ai-for-developers' },
      { name: 'Data Science & Machine Learning', href: '/services/training/data-science-machine-learning' },
    ],
    blog: { name: 'Prompt Engineering Enterprise Guide', href: '/resources/blog/prompt-engineering-enterprise-guide' },
  },
]

const industryTraining = [
  { industry: 'Financial Services & Insurance', href: '/resources/blog/ai-bfsi-fraud-detection-claims-processing', description: 'Fraud detection, claims automation, risk modeling' },
  { industry: 'Healthcare', href: '/resources/blog/ai-healthcare-clinical-documentation', description: 'Clinical documentation, patient journey, drug discovery' },
  { industry: 'Manufacturing', href: '/resources/blog/ai-manufacturing-predictive-maintenance', description: 'Predictive maintenance, quality control, supply chain' },
  { industry: 'Government', href: '/resources/blog/ai-government-citizen-services', description: 'Citizen services, document processing, compliance' },
  { industry: 'Retail & E-Commerce', href: '/resources/blog/ai-retail-personalization-demand-forecasting', description: 'Personalization, demand forecasting, inventory' },
  { industry: 'Energy', href: '/resources/blog/ai-energy-grid-optimization', description: 'Grid optimization, predictive analytics, sustainability' },
]

const faqs = [
  { question: 'How long does it take to build enterprise AI capability?', answer: 'A structured program takes 3-6 months to achieve meaningful capability. This includes executive alignment (Month 1), core team training (Months 2-3), and hands-on project implementation (Months 4-6). Ongoing mentoring accelerates adoption.' },
  { question: 'What is the ROI of enterprise AI training?', answer: 'Organizations typically see 3-5x ROI within the first year through reduced AI project failure rates, faster time-to-production, and better vendor evaluation. Teams with proper training move from POC to production 60% faster.' },
  { question: 'Should we train everyone or just the technical team?', answer: 'Train all three tiers: executives (1-2 days for strategic fluency), managers (2-3 days for capability building), and practitioners (5-10 days for technical depth). Organizations that only train practitioners have 3x higher project failure rates.' },
  { question: 'What certifications should our team pursue?', answer: 'Start with Azure AI Fundamentals (AI-901) for broad literacy. Technical teams should pursue AI-103 (AI App & Agent Developer) and AB-100 (Agentic AI Architect). Power Platform teams need PL-200/PL-400. Data teams should target PL-300 (Power BI).' },
  { question: 'Can training be customized for our industry?', answer: 'Yes. Every program is tailored with industry-specific case studies, your own data scenarios, and relevant compliance requirements. We have delivered customized training for BFSI, healthcare, manufacturing, government, and energy sectors.' },
]

export default function EnterpriseAITrainingGuide() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://gennoor.com' },
        { name: 'Resources', url: 'https://gennoor.com/resources' },
        { name: 'Guides', url: 'https://gennoor.com/resources/guides' },
        { name: 'Enterprise AI Training', url: 'https://gennoor.com/resources/guides/enterprise-ai-training' },
      ]} />
      <FAQJsonLd faqs={faqs} />

      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative py-14 lg:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-white" />
          <div className="absolute inset-0 bg-gradient-mesh" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <span className="inline-flex items-center rounded-full px-3 py-1 mb-5 text-xs font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/60">
                Comprehensive Guide
              </span>
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
                Enterprise AI Training: The Complete Guide
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                How to build AI capabilities at every level of your organization — from executive fluency to hands-on practitioner skills.
                Based on training 2000+ professionals across Fortune 500 companies in 6 countries.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/services/training" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-xl hover:shadow-glow-blue transition-all duration-300">
                  View Training Programs
                </Link>
                <Link href="/contact#book" className="inline-flex items-center px-8 py-4 border-2 border-primary-600 text-primary-700 font-medium rounded-xl hover:bg-primary-50 transition-colors">
                  Get Custom Proposal
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Why AI Training Matters */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Enterprise AI Training Matters</h2>
              <p className="text-lg text-gray-600 mb-8">
                The #1 barrier to enterprise AI adoption is not technology — it is skills. According to industry research,
                87% of AI projects never make it to production, and the primary reason is the gap between AI capabilities
                and organizational readiness to use them effectively.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">87%</div>
                  <p className="text-gray-600">of AI projects never reach production</p>
                </div>
                <div className="glass-card p-6 text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">60%</div>
                  <p className="text-gray-600">faster POC-to-production with proper training</p>
                </div>
                <div className="glass-card p-6 text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">3-5x</div>
                  <p className="text-gray-600">typical first-year ROI from AI training</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Three-Tier Training Model */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">The Three-Tier Training Model</h2>
              <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
                Most companies only train their technical teams. The ones that succeed train all three tiers — executives,
                managers, and practitioners — at different depths for different roles.
              </p>

              <div className="space-y-8">
                {trainingTiers.map((tier, index) => (
                  <div key={tier.title} className="glass-card p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{tier.title}</h3>
                        <p className="text-sm text-gray-500">{tier.audience} &middot; {tier.duration}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-6">{tier.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Recommended Programs</h4>
                        <div className="space-y-2">
                          {tier.programs.map((prog) => (
                            <Link key={prog.name} href={prog.href} className="flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm">
                              <ArrowRight className="w-4 h-4" />
                              {prog.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Related Reading</h4>
                        <Link href={tier.blog.href} className="flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm">
                          <BookOpen className="w-4 h-4" />
                          {tier.blog.name}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Industry-Specific Training */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Industry-Specific AI Training</h2>
              <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
                AI training is most effective when it uses your industry&apos;s data, challenges, and regulatory requirements.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {industryTraining.map((item) => (
                  <Link
                    key={item.industry}
                    href={item.href}
                    className="glass-card p-6 hover:shadow-md transition-shadow group"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{item.industry}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Certification Paths */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Certification Paths</h2>
              <p className="text-lg text-gray-600 mb-8 text-center">
                Certifications validate your team&apos;s skills and demonstrate investment in AI capability building.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/services/certifications/ai-901-azure-ai-fundamentals" className="glass-card p-6 hover:shadow-md transition-shadow group">
                  <span className="text-xl font-bold text-blue-600">AI-901</span>
                  <h3 className="font-semibold text-gray-900 mt-1 group-hover:text-primary-600">Azure AI Fundamentals</h3>
                  <p className="text-sm text-gray-600 mt-1">Best starting point for all roles</p>
                </Link>
                <Link href="/services/certifications/ai-103-azure-ai-app-and-agent-developer-associate" className="glass-card p-6 hover:shadow-md transition-shadow group">
                  <span className="text-xl font-bold text-blue-600">AI-103</span>
                  <h3 className="font-semibold text-gray-900 mt-1 group-hover:text-primary-600">AI App & Agent Developer</h3>
                  <p className="text-sm text-gray-600 mt-1">For developers building AI applications</p>
                </Link>
                <Link href="/services/certifications/ab-100-agentic-ai-business-solutions-architect" className="glass-card p-6 hover:shadow-md transition-shadow group">
                  <span className="text-xl font-bold text-blue-600">AB-100</span>
                  <h3 className="font-semibold text-gray-900 mt-1 group-hover:text-primary-600">Agentic AI Architect</h3>
                  <p className="text-sm text-gray-600 mt-1">For architects designing agent systems</p>
                </Link>
                <Link href="/services/certifications" className="glass-card p-6 hover:shadow-md transition-shadow group flex items-center justify-center">
                  <span className="font-semibold text-primary-600 group-hover:text-primary-700">View All 25+ Certifications →</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* FAQ */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {faqs.map((faq) => (
                <div key={faq.question} className="glass-card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* CTA */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Build Your Team&apos;s AI Capability?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Get a customized training roadmap for your organization. We&apos;ll assess your current maturity and recommend the right programs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact#book" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-xl hover:shadow-glow-blue transition-all duration-300">
                Get Training Roadmap
              </Link>
              <Link href="/services/training" className="inline-flex items-center px-8 py-4 border-2 border-primary-600 text-primary-700 font-medium rounded-xl hover:bg-primary-50 transition-colors">
                Browse All Programs
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
