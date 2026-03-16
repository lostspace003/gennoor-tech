import { Metadata } from 'next'
import Link from 'next/link'
import { Award, Download, ExternalLink, Shield, Trophy, BookOpen } from 'lucide-react'
import { certifications, getCertificationsByCategory, microsoftLearnStats, mctStatus } from '@/data/certifications'

export const metadata: Metadata = {
  title: 'Certifications & Credentials',
  description: 'Microsoft Certified Trainer (MCT) with 16 active certifications including Agentic AI. View my complete Microsoft Learn profile.',
}

const categoryOrder = [
  'AI Transformation',
  'Agentic AI',
  'Expert',
  'Associate',
  'Fundamentals',
  'GitHub',
  'Applied Skills'
]

const categoryColors = {
  'AI Transformation': 'from-purple-500 to-purple-600',
  'Agentic AI': 'from-indigo-500 to-indigo-600',
  'Expert': 'from-red-500 to-red-600',
  'Associate': 'from-blue-500 to-blue-600',
  'Fundamentals': 'from-green-500 to-green-600',
  'GitHub': 'from-gray-600 to-gray-700',
  'Applied Skills': 'from-orange-500 to-orange-600',
}

export default function CertificationsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-accent-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Certifications & Credentials
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Continuously learning and staying ahead of the AI curve with industry-leading certifications
            </p>

            {/* MCT Badge */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="inline-flex items-center bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg px-6 py-3 shadow-lg">
                <Shield className="w-6 h-6 mr-3" />
                <div>
                  <p className="font-bold">Microsoft Certified Trainer (MCT)</p>
                  <p className="text-sm text-blue-100">Active since {mctStatus.since} • Authorized worldwide trainer</p>
                </div>
              </div>
              <a
                href="/certificates/0-mct-certifcate.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-white border-2 border-primary-600 text-primary-600 rounded-lg px-6 py-3 shadow-lg hover:bg-primary-50 transition-colors"
              >
                <Award className="w-6 h-6 mr-3" />
                <div className="text-left">
                  <p className="font-bold">View MCT Certificate</p>
                  <p className="text-sm">Official Microsoft credential</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">16</div>
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

          {/* Microsoft Learn Profile Button */}
          <div className="mt-6 text-center">
            <a
              href="https://learn.microsoft.com/en-us/users/lostspace003/transcript/vjw63s4jxnmmwre?tab=credentials-tab"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-md hover:from-primary-700 hover:to-accent-700 transition-colors shadow-md"
            >
              <Trophy className="w-5 h-5 mr-2" />
              <span className="font-medium">View Full Microsoft Learn Profile</span>
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Certifications by Category */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {categoryOrder.map((category) => {
              const certs = getCertificationsByCategory(category as any)
              if (certs.length === 0) return null

              return (
                <div key={category} className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className={`w-1 h-8 bg-gradient-to-b ${categoryColors[category as keyof typeof categoryColors]} mr-3`} />
                    {category}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {certs.map((cert) => (
                      <div
                        key={cert.id}
                        className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {cert.name}
                            </h3>
                            <p className="text-sm text-primary-600 font-medium">
                              {cert.code}
                            </p>
                          </div>
                          <Award className={`w-8 h-8 text-gradient bg-gradient-to-br ${categoryColors[category as keyof typeof categoryColors]} text-white rounded p-1.5`} />
                        </div>

                        {cert.description && (
                          <p className="text-sm text-gray-600 mb-3">
                            {cert.description}
                          </p>
                        )}

                        {cert.skills && cert.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {cert.skills.slice(0, 4).map((skill, index) => (
                              <span
                                key={index}
                                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}

                        {cert.dateEarned && (
                          <p className="text-xs text-gray-500 mb-3">
                            Earned: {cert.dateEarned}
                          </p>
                        )}

                        <div className="flex items-center gap-3">
                          {cert.pdfPath && (
                            <a
                              href={cert.pdfPath}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-primary-600 hover:underline"
                            >
                              <Download className="w-4 h-4 mr-1" />
                              View Certificate
                            </a>
                          )}
                          {cert.credlyBadge && (
                            <a
                              href={cert.credlyBadge}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-primary-600 hover:underline"
                            >
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Credly Badge
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Applied Skills Note */}
          <div className="max-w-4xl mx-auto mt-12 bg-blue-50 bg-blue-900/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              15+ Microsoft Applied Skills
            </h3>
            <p className="text-gray-600 mb-3">
              In addition to role-based certifications, I've completed 15+ Microsoft Applied Skills
              assessments covering specific scenarios and hands-on implementations.
            </p>
            <p className="text-sm text-gray-500">
              Applied Skills demonstrate proficiency in scenario-based, hands-on tasks validated
              through interactive lab experiences.
            </p>
          </div>

          {/* Microsoft Learn Profile */}
          <div className="max-w-4xl mx-auto mt-8 text-center">
            <a
              href="https://learn.microsoft.com/en-us/users/lostspace003/transcript/vjw63s4jxnmmwre?tab=credentials-tab"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary-600 font-medium hover:underline"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              View my complete Microsoft Learn profile
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </section>
    </>
  )
}