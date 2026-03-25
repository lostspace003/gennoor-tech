import { Metadata } from 'next'
import { ArrowLeft, Bot, Network, Cpu, GitBranch, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { ServiceJsonLd, FAQJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Agentic AI Solutions — Multi-Agent Systems for Enterprise',
  description: 'Build autonomous AI agent systems for your enterprise. Multi-agent orchestration using LangChain, CrewAI, Copilot Studio, and AutoGen. From customer service automation to document processing pipelines.',
  keywords: ['agentic AI', 'AI agents enterprise', 'multi-agent systems', 'LangChain agents', 'CrewAI', 'Copilot Studio agents', 'autonomous AI'],
  alternates: { canonical: 'https://gennoor.com/services/agentic-ai' },
  openGraph: {
    title: 'Agentic AI Solutions — Multi-Agent Systems | Gennoor Tech',
    description: 'Build autonomous AI agent systems using LangChain, CrewAI, and Copilot Studio for enterprise workflows.',
    url: 'https://gennoor.com/services/agentic-ai',
  },
}

const faqs = [
  { question: 'What is Agentic AI and how is it different from regular AI?', answer: 'Agentic AI systems can autonomously reason, plan, use tools, and take actions to achieve goals — unlike traditional AI that only responds to single prompts. They can break down complex tasks, call APIs, query databases, and collaborate with other agents.' },
  { question: 'What frameworks do you use for building AI agents?', answer: 'We use LangChain, CrewAI, Microsoft AutoGen, and Copilot Studio depending on the use case. For enterprise deployments, we often combine Copilot Studio for low-code scenarios with LangChain/CrewAI for complex orchestrations.' },
  { question: 'How secure are agentic AI systems?', answer: 'Security is built in from the start. We implement role-based access controls, audit logging, human-in-the-loop approvals for sensitive actions, and deploy within your Azure tenant so data never leaves your security boundary.' },
  { question: 'Can agents integrate with our existing systems?', answer: 'Yes. Agents are designed to use tools — which includes your existing APIs, databases, CRMs, ERPs, and Microsoft 365 services. We build custom tool integrations as part of every engagement.' },
  { question: 'What is the typical timeline for an agentic AI project?', answer: 'A single-agent solution can be delivered in 2-3 weeks. Multi-agent orchestrations typically take 4-8 weeks depending on the number of agents, tool integrations, and workflow complexity.' },
]

export default function AgenticAIPage() {
  const agentCapabilities = [
    {
      title: "Autonomous Decision Making",
      description: "Agents that can analyze, decide, and act without constant human oversight",
      icon: Cpu
    },
    {
      title: "Multi-Agent Orchestration",
      description: "Coordinate multiple specialized agents to solve complex problems",
      icon: Network
    },
    {
      title: "Tool Integration",
      description: "Agents that can use APIs, databases, and external tools",
      icon: GitBranch
    },
    {
      title: "Continuous Learning",
      description: "Systems that improve performance through feedback loops",
      icon: Bot
    }
  ]

  const useCases = [
    {
      title: "Customer Service Automation",
      description: "Multi-tier support with escalation, ticket creation, and resolution",
      agents: ["Triage Agent", "Research Agent", "Resolution Agent", "QA Agent"]
    },
    {
      title: "Document Processing Pipeline",
      description: "End-to-end document analysis, extraction, and validation",
      agents: ["Classifier Agent", "Extractor Agent", "Validator Agent", "Router Agent"]
    },
    {
      title: "Sales & Marketing Automation",
      description: "Lead qualification, personalization, and follow-up orchestration",
      agents: ["Lead Scorer", "Content Creator", "Outreach Agent", "Analytics Agent"]
    },
    {
      title: "DevOps Automation",
      description: "Code review, testing, deployment, and monitoring",
      agents: ["Code Reviewer", "Test Agent", "Deploy Agent", "Monitor Agent"]
    }
  ]

  const techStack = [
    { name: "LangChain", description: "Framework for building LLM applications" },
    { name: "CrewAI", description: "Multi-agent orchestration platform" },
    { name: "Copilot Studio", description: "Microsoft's low-code agent builder" },
    { name: "AutoGen", description: "Microsoft's multi-agent framework" },
    { name: "Azure OpenAI", description: "Enterprise-grade LLM infrastructure" },
    { name: "Vector Databases", description: "Pinecone, Weaviate, ChromaDB" }
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
              Agentic AI Solutions
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Build autonomous AI systems that think, act, and collaborate. From single agents to
              complex multi-agent orchestrations, we create AI that works like your best team members.
            </p>
            <Link
              href="/contact#book"
              className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              Explore Agent Solutions
            </Link>
          </div>
        </div>
      </section>

      {/* What are Agentic Systems */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              What Makes AI "Agentic"?
            </h2>
            <p className="text-lg text-gray-600">
              Agentic AI systems go beyond simple prompts. They reason, plan, use tools, and
              collaborate to achieve complex goals autonomously.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {agentCapabilities.map((capability) => {
              const Icon = capability.icon
              return (
                <div key={capability.title} className="bg-white rounded-lg p-6 shadow-md">
                  <Icon className="w-10 h-10 text-primary-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{capability.title}</h3>
                  <p className="text-sm text-gray-600">{capability.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Real-World Agent Applications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {useCases.map((useCase) => (
              <div key={useCase.title} className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{useCase.title}</h3>
                <p className="text-gray-600 mb-4">{useCase.description}</p>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Agent Team:</p>
                  <div className="flex flex-wrap gap-2">
                    {useCase.agents.map((agent) => (
                      <span
                        key={agent}
                        className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full"
                      >
                        {agent}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Our Agentic AI Tech Stack
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {techStack.map((tech) => (
              <div key={tech.name} className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">{tech.name}</h3>
                  <p className="text-sm text-gray-600">{tech.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Build */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            How We Build Agent Systems
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Agent Design</h3>
                  <p className="text-gray-600">Define agent roles, capabilities, and interaction patterns based on your workflow</p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Tool Integration</h3>
                  <p className="text-gray-600">Connect agents to your existing systems, APIs, and data sources</p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Orchestration Setup</h3>
                  <p className="text-gray-600">Configure agent collaboration, communication, and decision-making flows</p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Testing & Optimization</h3>
                  <p className="text-gray-600">Validate agent behavior, refine prompts, and optimize performance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Why Choose Agentic AI?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">10x</div>
              <div className="text-lg font-semibold mb-2">Productivity Gain</div>
              <p className="text-gray-600 text-sm">Automate complex workflows end-to-end</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">24/7</div>
              <div className="text-lg font-semibold mb-2">Autonomous Operation</div>
              <p className="text-gray-600 text-sm">Agents work round the clock without breaks</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">∞</div>
              <div className="text-lg font-semibold mb-2">Scalability</div>
              <p className="text-gray-600 text-sm">Add more agents as your needs grow</p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Related Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link href="/services/poc-development" className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-2">PoC Development</h3>
              <p className="text-sm text-gray-600">Start with a focused agent prototype before scaling to full orchestration.</p>
            </Link>
            <Link href="/services/training" className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-2">Corporate AI Training</h3>
              <p className="text-sm text-gray-600">Train your developers on LangChain, CrewAI, and Copilot Studio agent development.</p>
            </Link>
            <Link href="/services/ai-strategy" className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-2">AI Strategy & Consulting</h3>
              <p className="text-sm text-gray-600">Identify the highest-impact agent use cases for your organization.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Frequently Asked Questions</h2>
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
            Ready to Build Your AI Agent Team?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Let&apos;s design and deploy autonomous agents that transform your operations
          </p>
          <Link
            href="/contact#book"
            className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Schedule Agent Strategy Session
          </Link>
        </div>
      </section>

      <ServiceJsonLd
        name="Agentic AI Solutions"
        description="Build autonomous AI agent systems for enterprise. Multi-agent orchestration using LangChain, CrewAI, Copilot Studio, and AutoGen."
        url="https://gennoor.com/services/agentic-ai"
      />
      <FAQJsonLd faqs={faqs} />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://gennoor.com' },
        { name: 'Services', url: 'https://gennoor.com/services' },
        { name: 'Agentic AI Solutions', url: 'https://gennoor.com/services/agentic-ai' },
      ]} />
    </main>
  )
}