import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, Bot, Settings, Plug, Shield, Users, Zap, Database } from 'lucide-react'
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Microsoft Copilot Studio — Complete Enterprise Guide | Gennoor Tech',
  description: 'The definitive guide to Microsoft Copilot Studio for enterprises. Learn to build AI agents, integrate with Dataverse and Power Platform, implement agent flows, and deploy production copilots.',
  keywords: ['Microsoft Copilot Studio', 'Copilot Studio training', 'Copilot Studio agents', 'Power Platform AI', 'Dataverse AI agents', 'Microsoft AI', 'low-code AI agents'],
  alternates: { canonical: 'https://gennoor.com/resources/guides/microsoft-copilot-studio' },
  openGraph: {
    title: 'Microsoft Copilot Studio — Complete Enterprise Guide',
    description: 'Build enterprise AI agents with Microsoft Copilot Studio, Dataverse, and Power Platform.',
    url: 'https://gennoor.com/resources/guides/microsoft-copilot-studio',
  },
}

const capabilities = [
  { icon: Bot, title: 'Agent Flows', description: 'Build multi-step autonomous agents that reason, plan, and execute complex business workflows', href: '/resources/blog/copilot-studio-agent-flows-complete-guide' },
  { icon: Database, title: 'Dataverse Integration', description: 'Connect agents to your business data in Dataverse for contextual, data-driven responses', href: '/resources/blog/dataverse-mcp-server-ai-agents' },
  { icon: Plug, title: 'Power Automate Flows', description: 'Trigger and orchestrate Power Automate workflows from within your copilot conversations', href: '/resources/blog/copilot-studio-power-automate-integration' },
  { icon: Shield, title: 'Enterprise Security', description: 'Built-in DLP, authentication, role-based access, and compliance with Microsoft 365 security' },
]

const useCases = [
  { title: 'Insurance Claims Processing', href: '/resources/blog/copilot-studio-dataverse-insurance-claims', description: 'Automate claims intake, document extraction, and approval workflows' },
  { title: 'Customer Service Agents', href: '/resources/blog/ai-agents-customer-service-transformation', description: 'Resolve common queries autonomously with escalation to human agents' },
  { title: 'HR Self-Service', href: '/resources/blog/ai-agents-hr-employee-experience', description: 'Employee onboarding, leave management, and policy questions' },
  { title: 'Document Intelligence', href: '/resources/blog/ai-document-intelligence-enterprise', description: 'Extract, classify, and process unstructured documents at scale' },
]

const faqs = [
  { question: 'What is Microsoft Copilot Studio?', answer: 'Microsoft Copilot Studio is a low-code platform for building AI agents (formerly Power Virtual Agents). It allows you to create conversational AI agents that can reason, use tools, access enterprise data via Dataverse, and execute multi-step workflows — all within the Microsoft 365 security boundary.' },
  { question: 'How is Copilot Studio different from ChatGPT or Azure OpenAI?', answer: 'Copilot Studio is an agent builder, not just a chat interface. It provides a visual designer for building agent flows, built-in connectors to Microsoft 365 and Dataverse, enterprise security and DLP, and the ability to orchestrate multi-step business processes. It uses Azure OpenAI under the hood but adds enterprise orchestration.' },
  { question: 'What skills does my team need for Copilot Studio?', answer: 'Copilot Studio is designed for citizen developers and power users — no deep coding required. However, for advanced scenarios (custom connectors, complex agent flows, Dataverse integration), Power Platform development experience is valuable. We offer training for both beginner and advanced levels.' },
  { question: 'Can Copilot Studio agents access our company data?', answer: 'Yes. Copilot Studio integrates natively with Dataverse, SharePoint, and Microsoft 365. Agents can query business data, update records, and trigger workflows — all within your existing security and compliance boundaries. You can also connect to external systems via custom connectors.' },
  { question: 'How much does Copilot Studio cost?', answer: 'Copilot Studio is licensed per tenant with message-based consumption. Enterprise plans are available through Microsoft 365 E3/E5 or as standalone licenses. The exact cost depends on message volume and features needed. We can help you estimate costs for your specific use case during a discovery call.' },
]

export default function CopilotStudioGuide() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://gennoor.com' },
        { name: 'Resources', url: 'https://gennoor.com/resources' },
        { name: 'Guides', url: 'https://gennoor.com/resources/guides' },
        { name: 'Microsoft Copilot Studio', url: 'https://gennoor.com/resources/guides/microsoft-copilot-studio' },
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
                Microsoft Copilot Studio: The Enterprise Guide
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Build enterprise AI agents with Microsoft&apos;s low-code platform. From simple chatbots to autonomous
                multi-step agents integrated with Dataverse and Power Platform.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/services/copilot-studio-training" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-xl hover:shadow-glow-blue transition-all duration-300">
                  Copilot Studio Training
                </Link>
                <Link href="/contact#book" className="inline-flex items-center px-8 py-4 border-2 border-primary-600 text-primary-700 font-medium rounded-xl hover:bg-primary-50 transition-colors">
                  Book Expert Session
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Key Capabilities */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Key Capabilities</h2>
              <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
                Copilot Studio brings together conversational AI, enterprise data, and workflow automation in a single platform.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {capabilities.map((cap) => {
                  const Icon = cap.icon
                  const content = (
                    <div className="glass-card p-6 hover:shadow-md transition-shadow group h-full">
                      <Icon className="w-8 h-8 text-primary-600 mb-3" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{cap.title}</h3>
                      <p className="text-gray-600 text-sm">{cap.description}</p>
                    </div>
                  )
                  return cap.href ? (
                    <Link key={cap.title} href={cap.href}>{content}</Link>
                  ) : (
                    <div key={cap.title}>{content}</div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* MCP Integration */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">MCP: The Universal AI Integration Standard</h2>
              <p className="text-lg text-gray-600 mb-8">
                The Model Context Protocol (MCP) is becoming the USB-C of AI integration. Build one MCP server for your
                enterprise system, and every AI agent can use it — Copilot Studio, Claude, GPT, open-source models.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/resources/blog/mcp-protocol-universal-ai-integration" className="glass-card p-6 hover:shadow-md transition-shadow group">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600">MCP Protocol: Universal AI Integration</h3>
                  <p className="text-sm text-gray-600">Understanding the Model Context Protocol and why it matters for enterprises</p>
                </Link>
                <Link href="/resources/blog/dataverse-mcp-server-ai-agents" className="glass-card p-6 hover:shadow-md transition-shadow group">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600">Dataverse MCP Server</h3>
                  <p className="text-sm text-gray-600">Build an MCP server to connect AI agents to your Dataverse business data</p>
                </Link>
                <Link href="/resources/blog/power-apps-mcp-server-citizen-developers" className="glass-card p-6 hover:shadow-md transition-shadow group">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600">Power Apps MCP Server</h3>
                  <p className="text-sm text-gray-600">Enable citizen developers to build AI-powered apps with MCP integration</p>
                </Link>
                <Link href="/resources/blog/microsoft-agent-framework-vs-copilot-studio" className="glass-card p-6 hover:shadow-md transition-shadow group">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600">Agent Framework vs Copilot Studio</h3>
                  <p className="text-sm text-gray-600">When to use Microsoft Agent Framework vs Copilot Studio for building agents</p>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Use Cases */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Enterprise Use Cases</h2>
              <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
                Proven implementations we have built with Copilot Studio across industries.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {useCases.map((uc) => (
                  <Link key={uc.title} href={uc.href} className="glass-card p-6 hover:shadow-md transition-shadow group">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{uc.title}</h3>
                    <p className="text-sm text-gray-600">{uc.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Training & Certification */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Training & Certification</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/services/copilot-studio-training" className="glass-card p-6 hover:shadow-md transition-shadow group">
                  <Zap className="w-8 h-8 text-primary-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600">Copilot Studio Training</h3>
                  <p className="text-sm text-gray-600">Dedicated hands-on workshop for building enterprise copilots</p>
                </Link>
                <Link href="/services/training/genai-copilot-mastery" className="glass-card p-6 hover:shadow-md transition-shadow group">
                  <Users className="w-8 h-8 text-primary-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600">GenAI Copilot Mastery Bootcamp</h3>
                  <p className="text-sm text-gray-600">5-day bootcamp covering Microsoft 365 Copilot, GitHub Copilot, and Copilot Studio</p>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Build with Copilot Studio?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Get hands-on training or let us build your first enterprise copilot.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/services/copilot-studio-training" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-xl hover:shadow-glow-blue transition-all duration-300">
                Start Training
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
