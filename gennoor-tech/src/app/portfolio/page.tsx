import { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Code, Github, MessageSquare, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Portfolio — AI Case Studies, PoCs & Enterprise Implementations',
  description: 'Explore real-world AI implementations: banking document intelligence, enterprise AI agents, Copilot Studio solutions, and Fortune 500 training programs.',
  keywords: ['AI portfolio', 'AI case studies', 'enterprise AI implementations', 'AI proof of concept examples'],
  alternates: { canonical: 'https://gennoor.com/portfolio' },
}

const portfolioSections = [
  {
    icon: FileText,
    title: 'Case Studies',
    description: 'Deep dives into transformative AI implementations across banking, government, and enterprise',
    href: '/portfolio/case-studies',
    highlight: '6 Major Projects',
    examples: ['Bank of Tanzania AI Agents', 'EY Copilot Studio', 'Banking Document Intelligence'],
  },
  {
    icon: Code,
    title: 'PoCs & Demos',
    description: 'Production-ready prototypes and technical demonstrations of AI capabilities',
    href: '/portfolio/demos',
    highlight: 'Live Implementations',
    examples: ['MCP Servers', 'Document OCR Pipeline', 'Multimodal RAG System'],
  },
  {
    icon: Github,
    title: 'Open Source',
    description: 'Contributing to the AI community with training materials and production code',
    href: '/portfolio/open-source',
    highlight: '8+ Repositories',
    examples: ['Prompt Engineering with Ollama', 'Python for AI-103', 'Banking Pipelines'],
  },
  {
    icon: MessageSquare,
    title: 'Client Testimonials',
    description: 'Feedback from executives and teams who have experienced the transformation',
    href: '/portfolio/testimonials',
    highlight: 'Fortune 500 Leaders',
    examples: ['MCIT Saudi Arabia', 'Bank of Tanzania', 'EY'],
  },
]

export default function PortfolioPage() {
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
              Our Work
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Portfolio
            </h1>
            <p className="text-xl text-gray-500 leading-relaxed">
              14+ years of delivering AI transformation across Fortune 500 companies and
              government bodies. From strategic consulting to hands-on implementation.
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio Sections */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-6xl mx-auto">
            {portfolioSections.map((section, index) => {
              const Icon = section.icon
              return (
                <Link
                  key={index}
                  href={section.href}
                  className="group rounded-2xl p-7 transition-all duration-500 glass-card glow-border"
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary-500/15">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-bold text-primary-600 bg-primary-50/80 px-3 py-1 rounded-lg border border-primary-100/60">
                      {section.highlight}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {section.title}
                  </h2>

                  <p className="text-gray-500 mb-4 leading-relaxed">
                    {section.description}
                  </p>

                  <div className="space-y-1.5 mb-5">
                    {section.examples.map((example, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-400">
                        <span className="w-1 h-1 bg-primary-500 rounded-full mr-2.5" />
                        {example}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center text-primary-600 font-semibold text-sm">
                    <span>Explore {section.title.toLowerCase()}</span>
                    <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Key Achievements */}
          <div className="mt-20 max-w-4xl mx-auto">
            <div className="section-divider mb-16" />
            <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">
              Key Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { value: '80+', label: 'Training Programs Delivered' },
                { value: '60%', label: 'Average Process Time Reduction' },
                { value: '6+', label: 'Countries Served' },
              ].map((item) => (
                <div key={item.label} className="text-center p-6 rounded-2xl glass-card">
                  <div className="text-3xl font-bold gradient-text mb-2">{item.value}</div>
                  <p className="text-sm text-gray-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Client Logos */}
          <div className="mt-16 max-w-5xl mx-auto">
            <h3 className="text-center text-xs font-semibold text-gray-400 mb-8 uppercase tracking-[0.2em]">
              Delivered Excellence For
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
              {['Microsoft', 'IBM', 'EY', 'Boeing', 'Saudi Aramco', 'Bank of Tanzania', 'HDFC Bank'].map((client) => (
                <div
                  key={client}
                  className="text-lg font-bold text-gray-300 hover:text-gray-500 transition-colors duration-300"
                >
                  {client}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
