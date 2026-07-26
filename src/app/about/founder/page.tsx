import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Award, ExternalLink, Shield, Trophy, BookOpen } from 'lucide-react'
import { PersonJsonLd } from '@/components/JsonLd'
import PageHero from '@/components/shared/PageHero'
import { getCertificationsByCategory, microsoftLearnStats, mctStatus, aictStatus } from '@/data/certifications'
import { BLOB_URL } from '@/lib/site-config'
import CertificationCards from '@/components/certifications/CertificationCards'
import MCTCertificateButton from '@/components/certifications/MCTCertificateButton'

export const metadata: Metadata = {
  title: 'Our Founder — Jalal Ahmed Khan | Gennoor Tech',
  description: 'Meet Jalal Ahmed Khan, founder of Gennoor Tech — Microsoft Certified Trainer with 16+ active certifications, 14+ years of enterprise AI experience, and Fortune 500 clients across 6+ countries.',
  keywords: ['Jalal Ahmed Khan', 'Gennoor Tech founder', 'Microsoft Certified Trainer', 'enterprise AI consultant'],
  alternates: { canonical: 'https://gennoor.com/about/founder' },
}

const categoryOrder = [
  'AI Transformation',
  'Agentic AI',
  'AI CERTs',
  'Expert',
  'Associate',
  'Fundamentals',
  'GitHub',
  'Applied Skills'
]

const categoryColors: Record<string, string> = {
  'AI Transformation': 'from-purple-500 to-purple-600',
  'Agentic AI': 'from-indigo-500 to-indigo-600',
  'AI CERTs': 'from-yellow-500 to-yellow-600',
  'Expert': 'from-red-500 to-red-600',
  'Associate': 'from-blue-500 to-blue-600',
  'Fundamentals': 'from-green-500 to-green-600',
  'GitHub': 'from-gray-600 to-gray-700',
  'Applied Skills': 'from-orange-500 to-orange-600',
}

export default function FounderPage() {
  return (
    <>
      <PersonJsonLd />

      {/* Hero Section */}
      <PageHero
        eyebrow="Our Founder"
        title="Jalal Ahmed Khan"
        description="Microsoft Certified Trainer & Enterprise AI Consultant"
      >
        <p className="text-base text-gray-500">
          Founder of Gennoor Tech Private Limited
        </p>
      </PageHero>

      {/* Bio Section */}
      <section className="py-10 lg:py-16 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14 items-start">
              <div className="lg:col-span-2">
                <p className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-6">
                  Jalal Ahmed Khan brings 14+ years of experience spanning academia, enterprise training,
                  and AI consulting. His path — from teaching engineering students to training C-suite
                  executives at Fortune 500 companies — gives him a rare ability to bridge technical
                  complexity with strategic business value.
                </p>
                <p className="text-base text-gray-600 leading-relaxed mb-6">
                  He has delivered 80+ enterprise training programs across 6+ countries, working with
                  organizations including Microsoft, IBM, Boeing, EY, Saudi Aramco, and Bank of Tanzania.
                  His specialization spans Azure AI, Microsoft Copilot, Agentic AI, and Power Platform.
                </p>
                <p className="text-base text-gray-600 leading-relaxed">
                  In 2026, Jalal founded Gennoor Tech with a mission to democratize AI adoption for
                  enterprises across GCC, Africa, and APAC — delivering hands-on training, strategic
                  consulting, and production-ready PoC development.
                </p>
              </div>
              <div className="flex justify-center lg:justify-end">
                <img
                  src="/media/assets/jalal-portrait.jpeg"
                  alt="Jalal Ahmed Khan, Founder of Gennoor Tech"
                  className="w-64 h-80 rounded-2xl object-cover object-[50%_20%] shadow-lg border-4 border-white ring-1 ring-gray-200"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trainer Badges */}
      <section className="py-10 lg:py-14 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Credentials</h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="inline-flex items-center bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl px-6 py-3 shadow-lg shadow-primary-500/15">
                  <Shield className="w-6 h-6 mr-3" />
                  <div>
                    <p className="font-bold">Microsoft Certified Trainer (MCT)</p>
                    <p className="text-sm text-blue-100">Active since {mctStatus.since} • Authorized worldwide trainer</p>
                  </div>
                </div>
                <MCTCertificateButton pdfUrl={`${BLOB_URL}/certificates/0-mct-certifcate.pdf`} />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="inline-flex items-center bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-xl px-6 py-3 shadow-lg shadow-yellow-500/15">
                  <Award className="w-6 h-6 mr-3" />
                  <div>
                    <p className="font-bold">AI CERTs Certified Trainer (AICT)</p>
                    <p className="text-sm text-yellow-100">Active since {aictStatus.since} • ID: {aictStatus.id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-10">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">20</div>
                <div className="text-sm text-gray-600">Active Certifications</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">{microsoftLearnStats.hours}</div>
                <div className="text-sm text-gray-600">Learning Hours</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">{microsoftLearnStats.modules}</div>
                <div className="text-sm text-gray-600">Modules Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">{microsoftLearnStats.learningPaths}</div>
                <div className="text-sm text-gray-600">Learning Paths</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">{microsoftLearnStats.exams}</div>
                <div className="text-sm text-gray-600">Exams Passed</div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <a
                href="https://learn.microsoft.com/en-us/users/lostspace003/transcript/vjw63s4jxnmmwre?tab=credentials-tab"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:shadow-glow-blue transition-all duration-300 text-sm font-semibold"
              >
                <Trophy className="w-4 h-4 mr-2" />
                <span>View Full Microsoft Learn Profile</span>
                <ExternalLink className="w-3.5 h-3.5 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications by Category */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Certifications</h2>
            {categoryOrder.map((category) => {
              const certs = getCertificationsByCategory(category as any)
              if (certs.length === 0) return null

              return (
                <div key={category} className="mb-12">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className={`w-1 h-8 bg-gradient-to-b ${categoryColors[category as keyof typeof categoryColors]} mr-3`} />
                    {category}
                  </h3>

                  <CertificationCards
                    certs={certs}
                    category={category}
                    categoryColor={categoryColors[category as keyof typeof categoryColors]}
                  />
                </div>
              )
            })}
          </div>

          <div className="max-w-4xl mx-auto mt-12 bg-white rounded-2xl border border-gray-200/70 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              15+ Microsoft Applied Skills
            </h3>
            <p className="text-gray-600 mb-3">
              In addition to role-based certifications, our founder has completed 15+ Microsoft Applied Skills
              assessments covering specific scenarios and hands-on implementations.
            </p>
            <p className="text-sm text-gray-500">
              Applied Skills demonstrate proficiency in scenario-based, hands-on tasks validated
              through interactive lab experiences.
            </p>
          </div>

          <div className="max-w-4xl mx-auto mt-8 text-center">
            <a
              href="https://learn.microsoft.com/en-us/users/lostspace003/transcript/vjw63s4jxnmmwre?tab=credentials-tab"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary-600 font-medium hover:underline"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              View complete Microsoft Learn profile
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold rounded-xl hover:shadow-glow-blue transition-all duration-300"
            >
              Work with Gennoor Tech
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              href="/about/company"
              className="inline-flex items-center px-6 py-3 bg-white ring-1 ring-gray-200 text-sm font-semibold text-gray-700 rounded-xl hover:ring-primary-300 hover:text-primary-700 transition-all duration-300"
            >
              Read our company story
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
