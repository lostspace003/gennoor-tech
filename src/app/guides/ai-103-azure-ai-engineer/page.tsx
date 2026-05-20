import { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, CheckCircle, Clock, Award, Target, Lightbulb, HelpCircle, ArrowRight, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Azure AI-103 Certification: Complete Study Guide 2026 | Gennoor Tech',
  description:
    'Comprehensive AI-103 Azure AI Engineer study guide for 2026 — Developing AI Apps and Agents on Azure. Exam overview, skills measured, Microsoft Foundry coverage, and expert tips from an MCT.',
  keywords: [
    'AI-103',
    'AI-103 Azure AI Engineer',
    'AI-103 study guide',
    'AI-103 exam prep',
    'Developing AI Apps and Agents on Azure',
    'Microsoft Foundry',
    'Azure AI agents certification',
    'AI-102 retirement',
    'Microsoft AI certification 2026',
  ],
  openGraph: {
    title: 'Azure AI-103 Certification: Complete Study Guide 2026',
    description:
      'Master the AI-103 exam — Developing AI Apps and Agents on Azure. Skills measured, Microsoft Foundry coverage, and expert preparation tips from a Microsoft Certified Trainer.',
    url: 'https://gennoor.com/guides/ai-103-azure-ai-engineer',
    siteName: 'Gennoor Tech',
    type: 'article',
  },
  alternates: {
    canonical: 'https://gennoor.com/guides/ai-103-azure-ai-engineer',
  },
}

const faqData = [
  {
    question: 'What is the AI-103 certification and how does it replace AI-102?',
    answer:
      'AI-103: Developing AI Apps and Agents on Azure is the successor to AI-102. It validates your ability to build, manage, and deploy AI apps and agents that take advantage of Microsoft Foundry — including generative AI, agentic solutions, computer vision, text analysis, and information extraction. AI-102 retires on June 30, 2026 at 11:59 PM Central Time.',
  },
  {
    question: 'What is the difference between AI-102 and AI-103?',
    answer:
      'AI-103 reflects the move to Microsoft Foundry and adds significant weight on agentic solutions and generative AI (30-35% of the exam). Skills are now grouped into five domains: Plan and manage an Azure AI solution (25-30%), Implement generative AI and agentic solutions (30-35%), Implement computer vision (10-15%), Implement text analysis (10-15%), and Implement information extraction (10-15%). The exam expects working knowledge of Python.',
  },
  {
    question: 'What are the prerequisites for AI-103?',
    answer:
      'Microsoft expects you to be an Azure AI engineer with experience developing apps in Python and familiarity with general AI, generative AI, and Azure services. While not required, AI-900 fundamentals or prior AI-102 experience provides a strong foundation. Practical experience with Microsoft Foundry, prompt flow, and agent frameworks is highly beneficial.',
  },
  {
    question: 'What does the AI-103 exam cover specifically?',
    answer:
      'Five domains: (1) planning and managing Azure AI solutions including responsible AI across generative and agentic systems, (2) implementing generative AI and agentic solutions including the Microsoft Foundry Agent Service and multi-agent orchestration, (3) computer vision, (4) text analysis and translation, and (5) information extraction using Document Intelligence and Content Understanding in Foundry Tools.',
  },
  {
    question: 'How long does it take to prepare for AI-103?',
    answer:
      'For someone with Azure fundamentals and Python experience, 6-8 weeks of focused study is typical. Engineers transitioning from AI-102 typically need 3-4 weeks to upskill on Microsoft Foundry, agent frameworks, and the expanded agentic domain. Structured training with hands-on Foundry labs accelerates readiness significantly.',
  },
]

export default function AI103StudyGuidePage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Azure AI-103 Certification: Complete Study Guide 2026',
    author: { '@type': 'Person', name: 'Jalal Ahmed Khan', jobTitle: 'Microsoft Certified Trainer' },
    publisher: { '@type': 'Organization', name: 'Gennoor Tech', url: 'https://gennoor.com' },
    datePublished: '2026-04-20',
    dateModified: '2026-05-21',
    description:
      'Comprehensive AI-103 Azure AI Engineer study guide — Developing AI Apps and Agents on Azure. Skills measured, Microsoft Foundry coverage, and expert preparation strategy.',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      {/* Hero */}
      <section className="relative py-14 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f0f4ff] via-white to-[#f0fdf8]" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-mesh" aria-hidden="true" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center rounded-full px-3 py-1 mb-5 text-[11px] font-semibold text-primary-700 bg-primary-50/90 border border-primary-100/70">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary-500 mr-2 animate-pulse" />
            AI-103 Study Guide
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-[2.75rem] font-bold mb-5 text-gray-900 tracking-tight leading-tight">
            Azure AI-103 Certification: Complete Study Guide 2026
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-7 leading-relaxed">
            Everything you need to pass <strong>AI-103: Developing AI Apps and Agents on Azure</strong> —
            the successor to AI-102. Skills measured, Microsoft Foundry coverage, and expert strategy
            from a Microsoft Certified Trainer with 16 active certifications.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary-500" />
              15 min read
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-primary-500" />
              Skills measured Apr 16, 2026
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-primary-500" />
              Replaces AI-102 (retires 2026-06-30)
            </span>
          </div>
        </div>
      </section>

      {/* Migration callout */}
      <section className="py-8 bg-amber-50/60 border-y border-amber-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900 mb-1">AI-102 retires June 30, 2026</p>
              <p className="text-sm text-amber-800 leading-relaxed">
                If you are about to schedule the Azure AI Engineer exam, choose <strong>AI-103</strong>.
                AI-102 will sit closed after June 30, 2026 at 11:59 PM Central Time. AI-103 is the
                Microsoft Foundry-aligned exam your certification will renew against going forward.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Exam Overview */}
      <section className="py-14 lg:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-5">Exam Overview</h2>
          <p className="text-base text-gray-600 mb-5 leading-relaxed">
            <strong>AI-103: Developing AI Apps and Agents on Azure</strong> validates that you can build,
            manage, and deploy AI apps and agents using Microsoft Foundry. As an Azure AI engineer,
            you collaborate with business stakeholders, solution architects, data scientists, DevOps
            engineers, and cloud security engineers to design, implement, and maintain AI solutions.
          </p>
          <p className="text-base text-gray-600 mb-8 leading-relaxed">
            The exam expects practical experience developing apps in Python and familiarity with
            generative AI, agent frameworks, and the Microsoft Foundry stack — including the Foundry
            Agent Service, prompt flow, Foundry Tools, and Content Understanding.
          </p>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-xl bg-gray-50 ring-1 ring-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Exam Details</h3>
              <ul className="space-y-1.5 text-sm text-gray-700">
                <li><strong className="text-gray-900">Exam code:</strong> AI-103</li>
                <li><strong className="text-gray-900">Certification:</strong> Azure AI Engineer Associate</li>
                <li><strong className="text-gray-900">Skills measured as of:</strong> April 16, 2026</li>
                <li><strong className="text-gray-900">Duration:</strong> 120 minutes</li>
                <li><strong className="text-gray-900">Passing score:</strong> 700 / 1000</li>
                <li><strong className="text-gray-900">Cost:</strong> ~USD $165 (varies by region)</li>
              </ul>
            </div>
            <div className="rounded-xl bg-gray-50 ring-1 ring-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Who should take this exam</h3>
              <ul className="space-y-1.5 text-sm text-gray-700">
                <li>Azure AI engineers building Foundry-based apps</li>
                <li>Engineers shipping agentic solutions in production</li>
                <li>Developers integrating generative AI into existing apps</li>
                <li>Solution architects validating their AI design skills</li>
                <li>AI-102 holders renewing into the current track</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Measured */}
      <section className="py-14 lg:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Skills Measured</h2>
          <p className="text-base text-gray-600 mb-8 leading-relaxed">
            Per the official Microsoft Learn study guide (skills measured as of April 16, 2026), the
            AI-103 exam covers five domains. The biggest weight shift from AI-102 is the new
            <strong> agentic solutions</strong> emphasis bundled with generative AI.
          </p>

          <div className="space-y-4">
            <SkillBlock
              weight="25–30%"
              title="Plan and manage an Azure AI solution"
              items={[
                'Choose appropriate Microsoft Foundry services for generative AI and agents',
                'Choose retrieval, indexing, memory, tool, and knowledge integration services',
                'Set up AI solutions in Foundry: infrastructure, deployment options, CI/CD',
                'Manage quotas, scaling, rate limits, and cost footprints for model and agent workloads',
                'Monitor performance, drift, safety events, grounding quality, search index health',
                'Configure security: managed identity, private networking, keyless credentials, role policies',
                'Implement responsible AI: safety filters, guardrails, content moderation, harm detection',
              ]}
            />
            <SkillBlock
              weight="30–35%"
              title="Implement generative AI and agentic solutions"
              items={[
                'Build generative AI solutions with Microsoft Foundry (hubs, projects, deployments)',
                'Implement prompt flow solutions and RAG patterns grounded in your data',
                'Use Azure OpenAI in Foundry Models for content generation, code, DALL-E, multimodal',
                'Configure parameters, monitoring, tracing, feedback, and model reflection',
                'Create custom agents with the Microsoft Foundry Agent Service',
                'Implement complex agents with Microsoft Agent Framework',
                'Orchestrate multi-agent solutions, multi-user workflows, and autonomous capabilities',
              ]}
            />
            <SkillBlock
              weight="10–15%"
              title="Implement computer vision solutions"
              items={[
                'Analyse images: tags, descriptions, objects, people, OCR',
                'Implement custom vision models for classification and object detection',
                'Analyse videos and video indexer scenarios',
                'Use Azure AI Vision and Foundry vision capabilities in production',
              ]}
            />
            <SkillBlock
              weight="10–15%"
              title="Implement text analysis solutions"
              items={[
                'Analyse text: sentiment, key phrases, entities, language detection',
                'Implement translation, including custom translation models',
                'Build NLP pipelines that route text through the right Foundry service',
              ]}
            />
            <SkillBlock
              weight="10–15%"
              title="Implement information extraction solutions"
              items={[
                'Implement Azure Document Intelligence in Foundry Tools',
                'Use prebuilt and custom document intelligence models, including composed models',
                'Extract information with Azure Content Understanding in Foundry Tools',
                'Process and ingest documents, images, video, and audio with Content Understanding',
                'Provision Azure AI Search: indexes, skillsets, custom skills, semantic and vector stores',
              ]}
            />
          </div>
        </div>
      </section>

      {/* Study plan */}
      <section className="py-14 lg:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Target className="w-7 h-7 text-primary-600" />
            Recommended Study Plan
          </h2>
          <p className="text-base text-gray-600 mb-8 leading-relaxed">
            Built from real candidate progress data across AI-102 and AI-103 cohorts. Allocate
            roughly 80 hours over 6-8 weeks; AI-102 holders typically need 25-30 hours to upskill.
          </p>

          <div className="space-y-4">
            <PlanStep
              num="1"
              title="Microsoft Learn AI-103 learning paths"
              body="Start with the official AI-103 collection on Microsoft Learn. Cover the Foundry, agents, generative AI, vision, NLP, and information extraction paths. Free, sandbox-enabled."
            />
            <PlanStep
              num="2"
              title="Hands-on with Microsoft Foundry"
              body="Provision a hub and project. Deploy a model, build a prompt flow, ground it with RAG, instrument it with tracing. Then build a custom agent with the Foundry Agent Service and add tools."
            />
            <PlanStep
              num="3"
              title="Build a multi-agent solution"
              body="Use the Microsoft Agent Framework to compose a planner + specialist pattern. Implement evaluation, content safety, and a CI/CD pipeline. This single project covers the heaviest exam weight."
            />
            <PlanStep
              num="4"
              title="Review the under-weighted but tricky areas"
              body="Computer vision, text analysis, and information extraction together account for ~35% of the exam. Don't ignore them — Document Intelligence and Content Understanding in particular have subtle Foundry Tools positioning you should know."
            />
            <PlanStep
              num="5"
              title="Practice assessment + mock"
              body="Use the official Microsoft Learn AI-103 practice assessment (free). Rerun until you consistently score 80%+. Time-box your attempts to the real 120-minute window."
            />
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="py-14 lg:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Lightbulb className="w-7 h-7 text-primary-600" />
            Tips From The Trainer
          </h2>
          <ul className="space-y-3">
            {[
              'Learn the Foundry vocabulary precisely — "Foundry Tools", "Foundry Agent Service", "Microsoft Foundry" replace older "Azure AI Studio" wording and the exam tests recognition.',
              'Practise writing safety filters and guardrails as code, not just clicking through Studio. The exam includes scenario-based responsible AI questions.',
              'Memorise when to choose Document Intelligence vs Content Understanding — the boundaries are subtle and frequently tested.',
              'For agent orchestration, know the difference between planner-driven, autonomous, and multi-agent patterns and when each is appropriate.',
              'Don\'t skip the cost, scaling, and security domain — it\'s 25-30% of the exam but candidates routinely under-prepare it.',
              'AI-102 holders: focus your 30 hours on the agentic + Foundry-positioning material. The vision/NLP/extraction topics overlap heavily with what you already know.',
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 ring-1 ring-gray-200">
                <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700 leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 lg:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <HelpCircle className="w-7 h-7 text-primary-600" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqData.map((faq, i) => (
              <div key={i} className="rounded-xl ring-1 ring-gray-200 p-5">
                <h3 className="text-base font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f0f4ff] via-white to-[#f0fdf8]" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-mesh" aria-hidden="true" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center rounded-full px-3 py-1 mb-5 text-[11px] font-semibold text-primary-700 bg-primary-50/90 border border-primary-100/70">
            Get Started
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Pass the AI-103 Exam?</h2>
          <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Get expert-led AI-103 preparation from a Microsoft Certified Trainer with 16 active
            certifications. Hands-on Microsoft Foundry labs, agent-building practice, and the
            exam strategy that has worked for hundreds of candidates.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact#book"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:shadow-glow-blue transition-all group"
            >
              Book AI-103 Training
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/services/azure-ai-foundry-workshop"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-xl text-gray-700 bg-white/80 backdrop-blur-sm ring-1 ring-gray-200 hover:ring-primary-300 hover:text-primary-700 transition-all"
            >
              See the Foundry Workshop
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

function SkillBlock({ weight, title, items }: { weight: string; title: string; items: string[] }) {
  return (
    <div className="rounded-xl bg-white ring-1 ring-gray-200 p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className="text-[10px] font-bold tracking-widest text-primary-700 bg-primary-50 ring-1 ring-primary-100 px-2 py-0.5 rounded-full uppercase whitespace-nowrap">
          {weight}
        </span>
      </div>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="w-1 h-1 rounded-full bg-primary-400 flex-shrink-0 mt-2" />
            <span className="leading-relaxed">{it}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function PlanStep({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <div className="flex items-start gap-4 bg-white rounded-xl p-5 ring-1 ring-gray-200">
      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary-50 text-primary-700 font-bold text-sm flex items-center justify-center">
        {num}
      </div>
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
      </div>
    </div>
  )
}
