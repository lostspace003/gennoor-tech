import { Metadata } from 'next'
import { ArrowRight, Calendar, MapPin, Award } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'My Journey',
  description: 'From Automobile Engineering to AI Leadership - The story of Jalal Ahmed Khan',
}

const timeline = [
  {
    year: '2010-2020',
    title: 'Academic Foundation',
    location: 'Mumbai, India',
    description: 'Started with Automobile Engineering at Mumbai University, then spent 10 years as Assistant Professor across 4 colleges, building a strong foundation in teaching complex technical concepts.',
    highlight: 'Taught 1000+ engineering students',
  },
  {
    year: '2020-2022',
    title: 'Discovering Microsoft AI Ecosystem',
    location: 'India',
    description: 'Transitioned from academia to the corporate world, diving deep into Microsoft Azure, AI services, and cloud technologies. Achieved the prestigious MCT status.',
    highlight: 'Became Microsoft Certified Trainer (MCT)',
  },
  {
    year: '2022-2024',
    title: 'Scaling at Koenig Solutions',
    location: 'Global Delivery',
    description: 'Delivered 80+ enterprise training programs, working with Fortune 500 companies across 6+ countries. Specialized in Azure AI, Power Platform, and Copilot technologies.',
    highlight: 'Trained teams at Microsoft, IBM, Boeing',
  },
  {
    year: '2024-2025',
    title: 'International Leadership Programs',
    location: 'Saudi Arabia, Tanzania, Bahrain',
    description: 'Led transformative AI programs including 10-day bootcamps for C-suite executives at MCIT Saudi Arabia, Bank of Tanzania AI Agents implementation, and government enablement in Bahrain.',
    highlight: '50+ C-suite leaders trained on AI strategy',
  },
  {
    year: '2025-2026',
    title: 'Building PoCs at Tech Mahindra',
    location: 'India',
    description: 'Developed production-ready AI solutions including RFP automation with 60% time reduction, document intelligence for banking, and custom MCP server integrations.',
    highlight: 'Delivered enterprise PoCs with immediate ROI',
  },
  {
    year: '2026-Present',
    title: 'Founding Gennoor Tech',
    location: 'Mumbai, India',
    description: 'Launched Gennoor Tech Private Limited with the mission to democratize AI adoption for enterprises across GCC, Africa, and APAC. Planning Saudi Arabia expansion.',
    highlight: 'Building the future of enterprise AI',
  },
]

export default function JourneyPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-accent-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              My Journey
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              From Automobile Engineering Professor to Global AI Transformation Leader
            </p>
            <p className="text-lg text-gray-600">
              A story of continuous learning, adaptation, and impact across academia,
              enterprise training, and AI consulting.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="prose prose-lg prose-invert max-w-none mb-16">
              <p>
                My journey is unconventional. I'm not from a traditional developer background,
                yet I'm building production-ready AI solutions for Fortune 500 companies.
                This unique path—from teaching engineering students to training C-suite executives
                on AI strategy—has given me a rare perspective: I understand both the technical
                complexities and the business imperatives of AI transformation.
              </p>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300" />

              {timeline.map((item, index) => (
                <div key={index} className="relative flex items-start mb-12 last:mb-0">
                  {/* Dot */}
                  <div className="absolute left-8 w-4 h-4 bg-primary-600 rounded-full -translate-x-1/2 ring-4 ring-white" />

                  {/* Content */}
                  <div className="ml-20 flex-1">
                    <div className="flex flex-wrap items-center gap-4 mb-2">
                      <span className="text-sm font-semibold text-primary-600">
                        {item.year}
                      </span>
                      <span className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        {item.location}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {item.description}
                    </p>
                    <div className="flex items-center text-sm text-success">
                      <Award className="w-4 h-4 mr-1" />
                      <span className="font-medium">{item.highlight}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Key Insights */}
            <div className="mt-16 bg-gray-50 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                What Makes My Approach Different
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <p className="text-gray-600">
                    <strong className="text-gray-900">Bridge Builder:</strong> I
                    speak both languages—technical complexity for developers and strategic value for executives.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <p className="text-gray-600">
                    <strong className="text-gray-900">Practical Focus:</strong> Every
                    training includes hands-on labs, real datasets, and production-ready PoCs.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <p className="text-gray-600">
                    <strong className="text-gray-900">Global Perspective:</strong> Delivered
                    programs across cultures and industries, understanding diverse organizational needs.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <p className="text-gray-600">
                    <strong className="text-gray-900">Continuous Learning:</strong> 376+
                    hours on Microsoft Learn, staying ahead of the rapidly evolving AI landscape.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 text-center">
              <Link
                href="/about/certifications"
                className="inline-flex items-center text-primary-600 font-medium hover:underline"
              >
                View my certifications
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}