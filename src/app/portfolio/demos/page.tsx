import { Metadata } from 'next'
import Link from 'next/link'
import { Github, ExternalLink, Code, Database, Brain, FileText, Bot, Shield, BarChart } from 'lucide-react'
import { pocs } from '@/data/pocs'

export const metadata: Metadata = {
  title: 'PoCs & Demos',
  description: 'Production-ready prototypes and AI solutions for banking, enterprise automation, and document processing',
}

const demos = [
  {
    title: 'Banking Document Intelligence Pipeline',
    category: 'Document Processing',
    icon: FileText,
    description: 'Production-grade document processing for banking using Azure AI Document Intelligence and GPT-4o. Handles cheques, invoices, KYC forms, ID cards, and trade finance documents.',
    features: [
      'MICR extraction from cheques',
      'KYC document processing',
      'Invoice data extraction',
      'Trade finance automation',
      'ID card verification'
    ],
    technologies: ['Azure AI', 'GPT-4o', 'Python', 'FastAPI', 'OCR'],
    githubUrl: 'https://github.com/lostspace003/azure-doc-intelligence-banking-pipeline',
    impact: '60% reduction in processing time'
  },
  {
    title: 'Computer Vision & OCR for Banking',
    category: 'Fraud Detection',
    icon: Shield,
    description: 'Advanced computer vision pipeline for banking documents with signature verification, face detection, and fraud detection capabilities.',
    features: [
      'Signature matching & verification',
      'Face detection for ID verification',
      'MICR code extraction',
      'MRZ parsing for passports',
      'Fraud detection patterns'
    ],
    technologies: ['OpenCV', 'OCR', 'Python', 'FastAPI', 'Computer Vision'],
    githubUrl: 'https://github.com/lostspace003/cv-ocr-banking-pipeline',
    impact: 'Real-time fraud detection'
  },
  {
    title: 'Multimodal RAG for Financial Documents',
    category: 'AI/ML',
    icon: Brain,
    description: 'Retrieval-augmented generation system that processes financial documents with charts, tables, and images, providing answers with source citations.',
    features: [
      'Process documents with charts & tables',
      'Image embeddings for visual search',
      'Citation-backed responses',
      'Multimodal understanding',
      'Compliance-ready outputs'
    ],
    technologies: ['Claude', 'RAG', 'Vector DB', 'FastAPI', 'Multimodal AI'],
    githubUrl: 'https://github.com/lostspace003/multimodal-rag-banking',
    impact: 'Complete document understanding'
  },
  {
    title: 'Copilot Studio MCP Server - 12 Tools',
    category: 'Enterprise Integration',
    icon: Database,
    description: 'Model Context Protocol server connecting Microsoft Copilot Studio to Azure SQL databases with 12 comprehensive tools for natural language database operations.',
    features: [
      'Natural language to SQL',
      'Schema inspection',
      'CRUD operations',
      'Adaptive Card visualizations',
      'Query optimization'
    ],
    technologies: ['MCP', 'Copilot Studio', 'Azure SQL', 'Python', 'Adaptive Cards'],
    githubUrl: 'https://github.com/lostspace003/copilot-studio-azure-sql-mcp',
    impact: '80% faster database queries'
  },
  {
    title: 'Human-in-the-Loop Agent Flows',
    category: 'Workflow Automation',
    icon: Bot,
    description: 'Interactive agent flow orchestration for Microsoft Copilot Studio with human approval points and multi-agent coordination.',
    features: [
      'HITL approval workflows',
      'Multi-agent orchestration',
      'Visual flow designer',
      'Enterprise automation patterns',
      'Governance checkpoints'
    ],
    technologies: ['Copilot Studio', 'Agent Flows', 'HTML5', 'JavaScript'],
    githubUrl: 'https://github.com/lostspace003/copilot-studio-agent-flow',
    impact: 'Enterprise-grade automation'
  },
  {
    title: 'Python for AI-103 Certification',
    category: 'Training Materials',
    icon: Code,
    description: 'Complete Python fundamentals course specifically tailored for Microsoft AI-103 certification preparation with hands-on labs.',
    features: [
      'Python basics to advanced',
      'Azure SDK integration',
      'AI service implementation',
      'Hands-on Jupyter notebooks',
      'Certification aligned content'
    ],
    technologies: ['Python', 'Jupyter', 'Azure AI', 'Microsoft Learn'],
    githubUrl: 'https://github.com/lostspace003/python-for-ai102',
    impact: 'Training resource for 100+ developers'
  },
  {
    title: 'Local Prompt Engineering with Ollama',
    category: 'Training Materials',
    icon: Brain,
    description: 'Free, API-key-free prompt engineering training using Ollama and Qwen3 for completely local execution.',
    features: [
      'Zero-shot prompting',
      'Few-shot learning',
      'Chain-of-thought reasoning',
      'Role-based prompting',
      '100% local execution'
    ],
    technologies: ['Ollama', 'Qwen3', 'Jupyter', 'Python'],
    githubUrl: 'https://github.com/lostspace003/prompt-engineering-ollama',
    impact: 'Democratized AI training'
  }
]

const categoryColors = {
  'Document Processing': 'from-blue-500 to-blue-600',
  'Fraud Detection': 'from-red-500 to-red-600',
  'AI/ML': 'from-purple-500 to-purple-600',
  'Enterprise Integration': 'from-green-500 to-green-600',
  'Workflow Automation': 'from-orange-500 to-orange-600',
  'Training Materials': 'from-indigo-500 to-indigo-600',
}

export default function DemosPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-accent-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              PoCs & Demos
            </h1>
            <p className="text-xl text-gray-600">
              Production-ready prototypes solving real enterprise challenges. Every solution
              is documented, tested, and available on GitHub for implementation.
            </p>
          </div>
        </div>
      </section>

      {/* Demos Grid */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
            {demos.map((demo, index) => {
              const Icon = demo.icon
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                >
                  {/* Category Bar */}
                  <div className={`h-1 bg-gradient-to-r ${categoryColors[demo.category as keyof typeof categoryColors]}`} />

                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${categoryColors[demo.category as keyof typeof categoryColors]} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {demo.title}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {demo.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4">
                      {demo.description}
                    </p>

                    {/* Features */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-700 mb-2">
                        Key Features:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {demo.features.slice(0, 3).map((feature, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                          >
                            {feature}
                          </span>
                        ))}
                        {demo.features.length > 3 && (
                          <span className="text-xs px-2 py-1 text-gray-500">
                            +{demo.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Technologies */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-700 mb-2">
                        Tech Stack:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {demo.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 border border-gray-300 rounded text-gray-600"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Impact */}
                    <div className="mb-4 flex items-center text-sm text-success">
                      <span className="font-medium">Impact:</span>
                      <span className="ml-2">{demo.impact}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <a
                        href={demo.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-primary-600 font-medium hover:underline"
                      >
                        <Github className="w-4 h-4 mr-1" />
                        View on GitHub
                      </a>
                      <button className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Live Demo
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Need a Custom PoC for Your Organization?
            </h2>
            <p className="text-gray-600 mb-6">
              I can build production-ready prototypes tailored to your specific use cases,
              integrating with your existing systems and meeting your compliance requirements.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors"
            >
              Discuss Your Requirements
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}