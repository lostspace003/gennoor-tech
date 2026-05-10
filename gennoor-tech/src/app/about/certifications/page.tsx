import { Metadata } from 'next'
import Link from 'next/link'
import { Award, ExternalLink, Shield, Trophy, BookOpen } from 'lucide-react'
import { certifications, getCertificationsByCategory, microsoftLearnStats, mctStatus, aictStatus } from '@/data/certifications'
import { BLOB_URL } from '@/lib/site-config'
import CertificationCards from '@/components/certifications/CertificationCards'
import MCTCertificateButton from '@/components/certifications/MCTCertificateButton'

export const metadata: Metadata = {
  title: 'Certifications & Credentials — 20+ Active Certifications',
  description: 'Microsoft Certified Trainer (MCT) & AI CERTs Certified Trainer (AICT) with 20+ active certifications including Azure AI, AI+ Security, AI+ Executive, and GitHub. 376+ hours on Microsoft Learn.',
  keywords: ['Microsoft certifications', 'MCT trainer', 'Azure AI certifications', 'AI CERTs', 'AICT trainer', 'AI+ Security', 'AI+ Executive'],
  alternates: { canonical: 'https://gennoor.com/about/certifications' },
}

const categoryOrder = ['AI Transformation', 'Agentic AI', 'AI CERTs', 'Expert', 'Associate', 'Fundamentals', 'GitHub', 'Applied Skills']

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

export default function CertificationsPage() {
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
              Credentials
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Certifications & Credentials
            </h1>
            <p className="text-xl text-gray-500 mb-8 leading-relaxed">
              Continuously learning and staying ahead of the AI curve with industry-leading certifications
            </p>

            {/* Trainer Badges */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="inline-flex items-center bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl px-6 py-3 shadow-lg shadow-primary-500/15">
                  <Shield className="w-5 h-5 mr-3" />
                  <div>
                    <p className="font-bold text-sm">Microsoft Certified Trainer (MCT)</p>
                    <p className="text-xs text-blue-200/70">Active since {mctStatus.since} • Authorized worldwide trainer</p>
                  </div>
                </div>
                <MCTCertificateButton pdfUrl={`${BLOB_URL}/certificates/0-mct-certifcate.pdf`} />
              </div>
              <div>
                <div className="inline-flex items-center bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-xl px-6 py-3 shadow-lg shadow-yellow-500/15">
                  <Award className="w-5 h-5 mr-3" />
                  <div>
                    <p className="font-bold text-sm">AI CERTs Certified Trainer (AICT)</p>
                    <p className="text-xs text-yellow-200/70">Active since {aictStatus.since} • ID: {aictStatus.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 relative">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {[
              { value: '20', label: 'Active Certifications' },
              { value: microsoftLearnStats.hours, label: 'Learning Hours' },
              { value: microsoftLearnStats.modules, label: 'Modules Completed' },
              { value: microsoftLearnStats.learningPaths, label: 'Learning Paths' },
              { value: microsoftLearnStats.exams, label: 'Exams Passed' },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-xl glass-card">
                <div className="text-2xl font-bold text-primary-600">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <a
              href="https://learn.microsoft.com/en-us/users/lostspace003/transcript/vjw63s4jxnmmwre?tab=credentials-tab"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl hover:shadow-glow-blue transition-all duration-300 text-sm font-semibold"
            >
              <Trophy className="w-4 h-4 mr-2" />
              View Full Microsoft Learn Profile
              <ExternalLink className="w-3.5 h-3.5 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Certifications by Category */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {categoryOrder.map((category) => {
              const certs = getCertificationsByCategory(category as any)
              if (certs.length === 0) return null
              return (
                <div key={category} className="mb-14">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className={`w-1 h-7 rounded-full bg-gradient-to-b ${categoryColors[category as keyof typeof categoryColors]} mr-3`} />
                    {category}
                  </h2>
                  <CertificationCards
                    certs={certs}
                    category={category}
                    categoryColor={categoryColors[category as keyof typeof categoryColors]}
                  />
                </div>
              )
            })}
          </div>

          {/* Applied Skills Note */}
          <div className="max-w-4xl mx-auto mt-12 rounded-2xl p-6 glass-card">
            <h3 className="text-base font-semibold text-gray-900 mb-2">15+ Microsoft Applied Skills</h3>
            <p className="text-sm text-gray-500 mb-2 leading-relaxed">
              In addition to role-based certifications, I've completed 15+ Microsoft Applied Skills
              assessments covering specific scenarios and hands-on implementations.
            </p>
            <p className="text-xs text-gray-400">
              Applied Skills demonstrate proficiency in scenario-based, hands-on tasks validated
              through interactive lab experiences.
            </p>
          </div>

          <div className="max-w-4xl mx-auto mt-8 text-center">
            <a
              href="https://learn.microsoft.com/en-us/users/lostspace003/transcript/vjw63s4jxnmmwre?tab=credentials-tab"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary-600 font-semibold text-sm hover:text-primary-700 transition-colors"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              View my complete Microsoft Learn profile
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
