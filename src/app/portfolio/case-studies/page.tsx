import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock, Users, Building2, Github, FileText } from 'lucide-react'
import { caseStudies } from '@/data/case-studies'

export const metadata: Metadata = {
  title: 'Case Studies',
  description: 'Real-world AI implementations and training programs delivered to Fortune 500 companies and government bodies',
}

const industryColors = {
  'Banking & Financial Services': 'from-blue-500 to-blue-600',
  'Professional Services': 'from-purple-500 to-purple-600',
  'Technology': 'from-green-500 to-green-600',
  'Education & Training': 'from-orange-500 to-orange-600',
}

export default function CaseStudiesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-accent-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Case Studies
            </h1>
            <p className="text-xl text-gray-600">
              Real-world AI transformations, from multi-agent systems in banking to
              enterprise-wide Copilot implementations. Each project delivered tangible
              ROI and operational excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 max-w-6xl mx-auto">
            {caseStudies.map((study, index) => (
              <div
                key={study.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow"
              >
                {/* Header */}
                <div className={`h-2 bg-gradient-to-r ${industryColors[study.industry as keyof typeof industryColors] || 'from-gray-500 to-gray-600'}`} />

                <div className="p-6 lg:p-8">
                  <div className="flex flex-wrap items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {study.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Building2 className="w-4 h-4 mr-1" />
                          {study.client}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {study.duration}
                        </span>
                        {study.participants && (
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {study.participants}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-primary-100 bg-primary-900/30 text-primary-700 text-primary-300 rounded-full text-sm font-medium">
                      {study.industry}
                    </span>
                  </div>

                  {/* Challenge */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Challenge
                    </h3>
                    <p className="text-gray-600">
                      {study.challenge}
                    </p>
                  </div>

                  {/* Approach */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Approach
                    </h3>
                    <ul className="space-y-2">
                      {study.approach.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-start text-gray-600">
                          <span className="text-primary-600 mr-2">•</span>
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Technologies Used
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {study.technologies.slice(0, 8).map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                      {study.technologies.length > 8 && (
                        <span className="px-2 py-1 text-gray-500 text-xs">
                          +{study.technologies.length - 8} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Outcomes */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Key Outcomes
                    </h3>
                    <ul className="space-y-2">
                      {study.outcomes.slice(0, 3).map((outcome, idx) => (
                        <li key={idx} className="flex items-start text-gray-600">
                          <span className="text-success mr-2">✓</span>
                          <span className="text-sm">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Testimonial */}
                  {study.testimonial && (
                    <div className="bg-gray-50/50 rounded-lg p-4 mb-6 border-l-4 border-primary-600">
                      <p className="text-gray-700 italic mb-2">
                        "{study.testimonial.quote}"
                      </p>
                      <p className="text-sm text-gray-600">
                        — {study.testimonial.author}, {study.testimonial.role}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-200">
                    <Link
                      href={`/portfolio/case-studies/${study.id}`}
                      className="inline-flex items-center text-primary-600 font-medium hover:underline"
                    >
                      View full case study
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </Link>
                    {study.githubRepo && (
                      <a
                        href={study.githubRepo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-gray-600 hover:text-primary-600"
                      >
                        <Github className="w-4 h-4 mr-1" />
                        View on GitHub
                      </a>
                    )}
                    {study.deliverables && (
                      <span className="inline-flex items-center text-gray-500 text-sm">
                        <FileText className="w-4 h-4 mr-1" />
                        {study.deliverables.length} deliverables
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="mt-16 bg-gradient-primary rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Impact Across Industries
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-white">6+</div>
                <div className="text-blue-100">Countries</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">80+</div>
                <div className="text-blue-100">Programs Delivered</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">50+</div>
                <div className="text-blue-100">C-Suite Leaders</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">60%</div>
                <div className="text-blue-100">Avg. Time Saved</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}