import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, Bot, Cpu, Layers, Shield, Zap, Code2, Target } from 'lucide-react'
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Agentic AI — Complete Enterprise Guide to AI Agents | Gennoor Tech',
  description: 'The definitive guide to agentic AI for enterprises. Learn about AI agent architectures, multi-agent orchestration, LangGraph, Copilot Studio, Semantic Kernel, and production deployment strategies.',
  keywords: ['agentic AI', 'AI agents', 'multi-agent systems', 'LangGraph', 'Copilot Studio agents', 'Semantic Kernel', 'enterprise AI agents', 'autonomous AI'],
  alternates: { canonical: 'https://gennoor.com/resources/guides/agentic-ai' },
  openGraph: {
    title: 'Agentic AI — Complete Enterprise Guide',
    description: 'Everything enterprises need to know about building, deploying, and governing AI agents.',
    url: 'https://gennoor.com/resources/guides/agentic-ai',
  },
}

const frameworks = [
  { name: 'Microsoft Copilot Studio', description: 'Low-code agent builder with enterprise connectors, Dataverse integration, and Microsoft 365 ecosystem', href: '/resources/blog/copilot-studio-agent-flows-complete-guide' },
  { name: 'LangGraph & LangChain', description: 'Python-first framework for building stateful, multi-step agent workflows with tool integration', href: '/resources/blog/multi-agent-systems-langgraph-crewai' },
  { name: 'Semantic Kernel', description: 'Microsoft SDK for building AI orchestration into .NET and Python applications', href: '/resources/blog/semantic-kernel-enterprise-ai-orchestration' },
  { name: 'Microsoft Agent Framework', description: 'Production-grade framework for building autonomous agents within the Microsoft ecosystem', href: '/resources/blog/microsoft-agent-framework-vs-copilot-studio' },
]

const useCases = [
  { industry: 'Customer Service', href: '/resources/blog/ai-agents-customer-service-transformation', description: 'Autonomous resolution of tickets, escalation to humans, multi-channel support' },
  { industry: 'Insurance Claims', href: '/resources/blog/ai-agents-insurance-underwriting-claims', description: 'End-to-end claims processing, document extraction, fraud detection' },
  { industry: 'HR & Employee Experience', href: '/resources/blog/ai-agents-hr-employee-experience', description: 'Onboarding automation, policy Q&A, leave management' },
  { industry: 'Banking & Loans', href: '/resources/blog/ai-agents-banking-loan-origination', description: 'Loan origination, KYC automation, risk assessment' },
  { industry: 'Healthcare', href: '/resources/blog/ai-agents-healthcare-patient-journey', description: 'Patient scheduling, clinical documentation, care coordination' },
  { industry: 'Real Estate', href: '/resources/blog/ai-agents-real-estate-property-management', description: 'Property matching, tenant management, document processing' },
  { industry: 'Telecom', href: '/resources/blog/ai-agents-telecom-customer-retention', description: 'Churn prediction, proactive retention, service troubleshooting' },
  { industry: 'Logistics', href: '/resources/blog/ai-agents-logistics-warehouse-operations', description: 'Warehouse optimization, route planning, inventory management' },
]

const faqs = [
  { question: 'What is agentic AI and how is it different from chatbots?', answer: 'Agentic AI refers to AI systems that can autonomously plan, reason, use tools, and take actions to achieve goals. Unlike chatbots that only respond to queries, AI agents can execute multi-step workflows, call APIs, query databases, and collaborate with other agents — all with minimal human intervention.' },
  { question: 'Which framework should we use for building AI agents?', answer: 'It depends on your tech stack and requirements. Microsoft Copilot Studio is ideal for low-code agent building within the Microsoft ecosystem. LangGraph/LangChain is best for Python-first teams needing maximum flexibility. Semantic Kernel works well for .NET shops. Many enterprises use a combination.' },
  { question: 'How do we move AI agents from pilot to production?', answer: 'Follow a structured approach: start with a well-defined use case (Week 1-3), build with error handling and observability (Week 4-7), load test in staging (Week 8-10), deploy with canary/blue-green strategy (Week 11-12), then monitor and iterate (Week 13+). The hardening phase is critical — do not skip it.' },
  { question: 'What are the risks of deploying AI agents in production?', answer: 'Key risks include hallucination in critical decisions, uncontrolled actions, cost overruns from excessive API calls, security vulnerabilities in tool access, and compliance violations. Mitigate with human-in-the-loop for high-stakes decisions, guardrails, rate limiting, and comprehensive logging.' },
  { question: 'How much does it cost to build enterprise AI agents?', answer: 'Costs vary by complexity. A simple single-agent chatbot might cost $5-15K to build. A multi-agent system with enterprise integrations ranges from $50-200K. Ongoing costs include model API usage ($500-5000/month typical), infrastructure, and maintenance. Proper model selection and caching can reduce API costs by 60-80%.' },
]

export default function AgenticAIGuide() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://gennoor.com' },
        { name: 'Resources', url: 'https://gennoor.com/resources' },
        { name: 'Guides', url: 'https://gennoor.com/resources/guides' },
        { name: 'Agentic AI', url: 'https://gennoor.com/resources/guides/agentic-ai' },
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
                Agentic AI: The Complete Enterprise Guide
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Everything you need to know about building, deploying, and governing AI agents in the enterprise.
                From single-agent chatbots to multi-agent orchestration systems.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/services/agentic-ai" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-xl hover:shadow-glow-blue transition-all duration-300">
                  Agentic AI Services
                </Link>
                <Link href="/services/training/agentic-ai-engineering" className="inline-flex items-center px-8 py-4 border-2 border-primary-600 text-primary-700 font-medium rounded-xl hover:bg-primary-50 transition-colors">
                  Agentic AI Training
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* What is Agentic AI */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What is Agentic AI?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Agentic AI represents a paradigm shift from passive AI (models that respond to prompts) to active AI
                (systems that plan, reason, and act autonomously). An AI agent can break down complex goals into steps,
                use tools to gather information, make decisions, and execute actions — all while maintaining context and
                learning from outcomes.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6">
                  <Cpu className="w-8 h-8 text-primary-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Reasoning</h3>
                  <p className="text-sm text-gray-600">Breaks complex problems into steps, plans execution strategies, and adapts when things change</p>
                </div>
                <div className="glass-card p-6">
                  <Zap className="w-8 h-8 text-primary-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Tool Use</h3>
                  <p className="text-sm text-gray-600">Calls APIs, queries databases, searches the web, executes code, and processes documents</p>
                </div>
                <div className="glass-card p-6">
                  <Layers className="w-8 h-8 text-primary-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Collaboration</h3>
                  <p className="text-sm text-gray-600">Multiple agents work together, each with specialized roles, sharing context and results</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Frameworks */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Agent Development Frameworks</h2>
              <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
                The right framework depends on your team&apos;s skills, existing infrastructure, and use case complexity.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {frameworks.map((fw) => (
                  <Link key={fw.name} href={fw.href} className="glass-card p-6 hover:shadow-md transition-shadow group">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{fw.name}</h3>
                    <p className="text-gray-600 text-sm">{fw.description}</p>
                  </Link>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link href="/resources/blog/what-are-ai-agents-enterprise-guide" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
                  Read: What Are AI Agents? Enterprise Guide <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Industry Use Cases */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">AI Agent Use Cases by Industry</h2>
              <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
                AI agents are transforming every industry. Here are proven enterprise use cases we have implemented.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {useCases.map((uc) => (
                  <Link key={uc.industry} href={uc.href} className="glass-card p-5 hover:shadow-md transition-shadow group">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors text-sm">{uc.industry}</h3>
                    <p className="text-gray-600 text-xs">{uc.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Production Readiness */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">From POC to Production</h2>
              <p className="text-lg text-gray-600 mb-8">
                The difference between a demo AI agent and a production system is error handling, observability,
                human-in-the-loop controls, and cost management. Here is the proven playbook.
              </p>
              <div className="space-y-4">
                {[
                  { phase: 'Define & Design', weeks: '1-3', desc: 'Select use case, define success criteria, design agent architecture' },
                  { phase: 'Build & Harden', weeks: '4-7', desc: 'Implement agent logic, add error handling, security, and guardrails' },
                  { phase: 'Test & Stage', weeks: '8-10', desc: 'Load testing, adversarial testing, staging deployment' },
                  { phase: 'Deploy', weeks: '11-12', desc: 'Blue-green or canary deployment with monitoring' },
                  { phase: 'Operate & Improve', weeks: '13+', desc: 'Monitor KPIs, gather feedback, iterate on agent behavior' },
                ].map((step, i) => (
                  <div key={step.phase} className="flex items-start gap-4 glass-card p-5">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary-600">{i + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{step.phase} <span className="text-sm font-normal text-gray-500">(Weeks {step.weeks})</span></h3>
                      <p className="text-sm text-gray-600">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link href="/resources/blog/ai-poc-to-production-playbook" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
                  Read: AI POC to Production Playbook <ArrowRight className="w-4 h-4 ml-2" />
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
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Build AI Agents?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Whether you need training, a proof of concept, or production-ready agents, we can help.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/services/agentic-ai" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-xl hover:shadow-glow-blue transition-all duration-300">
                Agentic AI Services
              </Link>
              <Link href="/contact#book" className="inline-flex items-center px-8 py-4 border-2 border-primary-600 text-primary-700 font-medium rounded-xl hover:bg-primary-50 transition-colors">
                Book a Discovery Call
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
