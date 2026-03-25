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
    examples: ['Bank of Tanzania AI Agents', 'EY Copilot Studio', 'Banking Document Intelligence']
  },
  {
    icon: Code,
    title: 'PoCs & Demos',
    description: 'Production-ready prototypes and technical demonstrations of AI capabilities',
    href: '/portfolio/demos',
    highlight: 'Live Implementations',
    examples: ['MCP Servers', 'Document OCR Pipeline', 'Multimodal RAG System']
  },
  {
    icon: Github,
    title: 'Open Source',
    description: 'Contributing to the AI community with training materials and production code',
    href: '/portfolio/open-source',
    highlight: '8+ Repositories',
    examples: ['Prompt Engineering with Ollama', 'Python for AI-103', 'Banking Pipelines']
  },
  {
    icon: MessageSquare,
    title: 'Client Testimonials',
    description: 'Feedback from executives and teams who have experienced the transformation',
    href: '/portfolio/testimonials',
    highlight: 'Fortune 500 Leaders',
    examples: ['MCIT Saudi Arabia', 'Bank of Tanzania', 'EY']
  },
]

export default function PortfolioPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-accent-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Portfolio
            </h1>
            <p className="text-xl text-gray-600">
              14+ years of delivering AI transformation across Fortune 500 companies and
              government bodies. From strategic consulting to hands-on implementation.
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio Sections */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {portfolioSections.map((section, index) => {
              const Icon = section.icon
              return (
                <Link
                  key={index}
                  href={section.href}
                  className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-primary-600">
                      {section.highlight}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {section.title}
                  </h2>

                  <p className="text-gray-600 mb-4">
                    {section.description}
                  </p>

                  <div className="space-y-1 mb-4">
                    {section.examples.map((example, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-500">
                        <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-2" />
                        {example}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center text-primary-600 font-medium">
                    <span>Explore {section.title.toLowerCase()}</span>
                    <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Key Achievements */}
          <div className="mt-16 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Key Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">80+</div>
                <p className="text-gray-600">Training Programs Delivered</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">60%</div>
                <p className="text-gray-600">Average Process Time Reduction</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">6+</div>
                <p className="text-gray-600">Countries Served</p>
              </div>
            </div>
          </div>

          {/* Client Logos */}
          <div className="mt-16 max-w-5xl mx-auto">
            <h3 className="text-center text-sm font-semibold text-gray-600 mb-8 uppercase tracking-wider">
              Delivered Excellence For
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
              {['Microsoft', 'IBM', 'EY', 'Boeing', 'Saudi Aramco', 'Bank of Tanzania', 'HDFC Bank'].map((client) => (
                <div
                  key={client}
                  className="text-xl font-bold text-gray-400 text-gray-600 hover:text-gray-600 hover:text-gray-400 transition-colors"
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