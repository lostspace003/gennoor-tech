import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, Users, Building2, Github, FileText, CheckCircle } from 'lucide-react'
import { getCaseStudyBySlug } from '@/data/case-studies'
import ArchitectureDiagram from '@/components/portfolio/ArchitectureDiagram'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const caseStudy = getCaseStudyBySlug(params.id)

  if (!caseStudy) {
    return {
      title: 'Case Study Not Found',
      robots: { index: false, follow: false },
    }
  }

  const url = `https://gennoor.com/portfolio/case-studies/${params.id}`

  return {
    title: caseStudy.title,
    description: caseStudy.challenge,
    alternates: { canonical: url },
    openGraph: {
      title: `${caseStudy.title} | Gennoor Tech Case Study`,
      description: caseStudy.challenge,
      url,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: caseStudy.title,
      description: caseStudy.challenge,
    },
  }
}

export default function CaseStudyPage({ params }: { params: { id: string } }) {
  const caseStudy = getCaseStudyBySlug(params.id)

  if (!caseStudy) {
    notFound()
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-accent-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/portfolio/case-studies"
            className="inline-flex items-center text-primary-600 hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Case Studies
          </Link>

          <div className="max-w-4xl">
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              {caseStudy.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-600">
              <span className="flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                {caseStudy.client}
              </span>
              <span className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                {caseStudy.duration}
              </span>
              {caseStudy.participants && (
                <span className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  {caseStudy.participants}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Challenge */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                The Challenge
              </h2>
              <p className="text-lg text-gray-600">
                {caseStudy.challenge}
              </p>
            </div>

            {/* Approach */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Our Approach
              </h2>
              <ul className="space-y-3">
                {caseStudy.approach.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary-600 mt-1.5 mr-3">•</span>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Architecture Diagram */}
            {caseStudy.architecture && (
              <ArchitectureDiagram
                diagram={caseStudy.architecture}
                title="Technical Architecture"
              />
            )}

            {/* Technologies */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Technologies Used
              </h2>
              <div className="flex flex-wrap gap-2">
                {caseStudy.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Outcomes */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Key Outcomes & Impact
              </h2>
              <div className="space-y-3">
                {caseStudy.outcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables */}
            {caseStudy.deliverables && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Deliverables
                </h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <ul className="space-y-2">
                    {caseStudy.deliverables.map((deliverable, index) => (
                      <li key={index} className="flex items-start">
                        <FileText className="w-4 h-4 text-primary-600 mt-1 mr-3 flex-shrink-0" />
                        <span className="text-gray-600 text-sm">{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Testimonial */}
            {caseStudy.testimonial && (
              <div className="mb-12">
                <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-8 border-l-4 border-primary-600">
                  <p className="text-lg text-gray-700 italic mb-4">
                    "{caseStudy.testimonial.quote}"
                  </p>
                  <p className="text-sm text-gray-600">
                    — {caseStudy.testimonial.author}, {caseStudy.testimonial.role}
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-8 border-t border-gray-200">
              {caseStudy.githubRepo && (
                <a
                  href={caseStudy.githubRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  <Github className="w-5 h-5 mr-2" />
                  View on GitHub
                </a>
              )}
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Discuss Similar Project
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}