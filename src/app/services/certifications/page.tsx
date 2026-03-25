'use client'

import { useState } from 'react'
import { ArrowLeft, Award, Clock, DollarSign, Target, BookOpen, CheckCircle, Info, Send, Filter, X } from 'lucide-react'
import Link from 'next/link'
import { microsoftCertifications, googleCertifications, awsCertifications, githubCertifications } from '@/data/certification-prep'
import CertificationDetailsModal from '@/components/certifications/CertificationDetailsModal'
import CertificationEnquiryForm from '@/components/certifications/CertificationEnquiryForm'

export default function CertificationPreparationPage() {
  const [selectedProvider, setSelectedProvider] = useState<'all' | 'Microsoft' | 'Google' | 'AWS' | 'GitHub'>('all')
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'Fundamentals' | 'Associate' | 'Expert' | 'Specialty'>('all')
  const [selectedCertification, setSelectedCertification] = useState<any>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEnquiryForm, setShowEnquiryForm] = useState(false)

  // Combine all certifications
  const allCerts = [
    ...microsoftCertifications,
    ...googleCertifications,
    ...awsCertifications,
    ...githubCertifications
  ]

  // Filter certifications
  const filteredCertifications = allCerts.filter(cert => {
    const matchesProvider = selectedProvider === 'all' || cert.provider === selectedProvider
    const matchesLevel = selectedLevel === 'all' || cert.level === selectedLevel
    return matchesProvider && matchesLevel
  })

  // Group certifications by provider
  const groupedCertifications = {
    Microsoft: filteredCertifications.filter(c => c.provider === 'Microsoft'),
    Google: filteredCertifications.filter(c => c.provider === 'Google'),
    AWS: filteredCertifications.filter(c => c.provider === 'AWS'),
    GitHub: filteredCertifications.filter(c => c.provider === 'GitHub')
  }

  const handleViewDetails = (cert: any) => {
    setSelectedCertification(cert)
    setShowDetailsModal(true)
  }

  const handleEnquiry = (cert: any) => {
    setSelectedCertification(cert)
    setShowEnquiryForm(true)
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Fundamentals':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Associate':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Expert':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Specialty':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'Microsoft':
        return 'bg-blue-600'
      case 'Google':
        return 'bg-red-600'
      case 'AWS':
        return 'bg-orange-600'
      case 'GitHub':
        return 'bg-gray-800'
      default:
        return 'bg-gray-600'
    }
  }

  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href="/services/training"
            className="inline-flex items-center text-white/90 hover:text-white mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Training
          </Link>

          <div className="max-w-4xl">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <Award className="w-5 h-5 text-yellow-400 mr-2" />
              <span className="text-white font-medium">Official Certification Preparation</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-black text-white mb-6">
              Certification Exam Preparation
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Prepare for industry-recognized certifications with expert guidance from a Microsoft Certified Trainer
              with 16+ active certifications across Microsoft, AWS, Google Cloud, and GitHub.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-white">16+</div>
                <div className="text-white/80 text-sm">Active Certifications</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-white">98%</div>
                <div className="text-white/80 text-sm">Pass Rate</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-white">2000+</div>
                <div className="text-white/80 text-sm">Students Certified</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-white">4</div>
                <div className="text-white/80 text-sm">Cloud Platforms</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600 font-medium">Filter by:</span>
            </div>

            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              <option value="all">All Providers</option>
              <option value="Microsoft">Microsoft</option>
              <option value="Google">Google Cloud</option>
              <option value="AWS">AWS</option>
              <option value="GitHub">GitHub</option>
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              <option value="all">All Levels</option>
              <option value="Fundamentals">Fundamentals</option>
              <option value="Associate">Associate</option>
              <option value="Expert">Expert</option>
              <option value="Specialty">Specialty</option>
            </select>

            {(selectedProvider !== 'all' || selectedLevel !== 'all') && (
              <button
                onClick={() => {
                  setSelectedProvider('all')
                  setSelectedLevel('all')
                }}
                className="inline-flex items-center px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 mr-1" />
                Clear filters
              </button>
            )}
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredCertifications.length}</span> certification{filteredCertifications.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </section>

      {/* Certifications Grid */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {Object.entries(groupedCertifications).map(([provider, certs]) => {
            if (certs.length === 0) return null

            return (
              <div key={provider} className="mb-12">
                <div className="flex items-center mb-6">
                  <div className={`w-2 h-8 ${getProviderColor(provider)} mr-4 rounded`}></div>
                  <h2 className="text-2xl font-bold text-gray-900">{provider} Certifications</h2>
                  <span className="ml-3 px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                    {certs.length} available
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certs.map((cert) => (
                    <div
                      key={cert.id}
                      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                    >
                      {/* Card Header */}
                      <div className={`h-2 ${getProviderColor(cert.provider)}`}></div>

                      <div className="p-6">
                        {/* Certification Code and Level */}
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <span className="text-2xl font-bold text-primary-600">{cert.code}</span>
                            <h3 className="text-lg font-semibold text-gray-900 mt-1">
                              {cert.title}
                            </h3>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getLevelColor(cert.level)}`}>
                            {cert.level}
                          </span>
                        </div>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {cert.description}
                        </p>

                        {/* Meta Information */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-2" />
                            Duration: {cert.examDuration}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Target className="w-4 h-4 mr-2" />
                            Pass Score: {cert.passingScore}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <DollarSign className="w-4 h-4 mr-2" />
                            Exam Fee: {cert.price}
                          </div>
                        </div>

                        {/* Topics Preview */}
                        <div className="mb-4">
                          <p className="text-xs font-medium text-gray-700 mb-2">Key Topics:</p>
                          <div className="flex flex-wrap gap-1">
                            {cert.topics.slice(0, 2).map((topic, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                              >
                                {topic.split(' ').slice(0, 3).join(' ')}...
                              </span>
                            ))}
                            {cert.topics.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                +{cert.topics.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDetails(cert)}
                            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <Info className="w-4 h-4 mr-2" />
                            More Details
                          </button>
                          <button
                            onClick={() => handleEnquiry(cert)}
                            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Enquire
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Quick Enquiry Form */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Quick Certification Enquiry
              </h2>
              <p className="text-gray-600 text-center mb-8">
                Not sure which certification is right for you? Get personalized guidance from our expert trainer.
              </p>

              <CertificationEnquiryForm
                selectedCertification={null}
                embedded={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Why Choose Our Certification Preparation?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Trainer</h3>
              <p className="text-gray-600">
                Learn from a Microsoft Certified Trainer with 16+ active certifications
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">98% Pass Rate</h3>
              <p className="text-gray-600">
                Proven track record with over 2000+ professionals certified
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Official Content</h3>
              <p className="text-gray-600">
                Updated curriculum aligned with latest exam objectives
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Practice Tests</h3>
              <p className="text-gray-600">
                Mock exams and hands-on labs for real exam experience
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Small Batches</h3>
              <p className="text-gray-600">
                Personalized attention with maximum 10 participants per batch
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Flexible Delivery</h3>
              <p className="text-gray-600">
                On-site, virtual, or hybrid training options available globally
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      {selectedCertification && (
        <>
          <CertificationDetailsModal
            isOpen={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            certification={selectedCertification}
            onEnquire={() => {
              setShowDetailsModal(false)
              setShowEnquiryForm(true)
            }}
          />

          {!showDetailsModal && (
            <CertificationEnquiryForm
              isOpen={showEnquiryForm}
              onClose={() => setShowEnquiryForm(false)}
              selectedCertification={selectedCertification}
            />
          )}
        </>
      )}
    </main>
  )
}

// Import statements for missing components
import { Users, Globe } from 'lucide-react'