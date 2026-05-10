'use client'

import { useState } from 'react'
import { Award, Users, Clock, Globe, BookOpen, Rocket, Search, Filter, X, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { bootcamps, courses } from '@/data/training-programs'
import TrainingCard from '@/components/training/TrainingCard'

export default function TrainingPage() {
  const [activeTab, setActiveTab] = useState<'bootcamps' | 'courses'>('bootcamps')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [selectedAudience, setSelectedAudience] = useState<string>('all')
  const [selectedTechnology, setSelectedTechnology] = useState<string>('all')
  const [selectedCertification, setSelectedCertification] = useState<string>('all')

  // Filter programs based on search and filters - using OR logic for independent filters
  const filterPrograms = (programs: typeof bootcamps) => {
    return programs.filter(program => {
      // Search is always required if there's a search query
      if (searchQuery) {
        const matchesSearch = program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             program.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             program.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()))
        if (!matchesSearch) return false
      }

      // If all filters are set to "all", show everything
      if (selectedLevel === 'all' &&
          selectedAudience === 'all' &&
          selectedTechnology === 'all' &&
          selectedCertification === 'all') {
        return true
      }

      // OR logic - match any active filter
      const matchesLevel = selectedLevel === 'all' || program.level === selectedLevel
      const matchesAudience = selectedAudience === 'all' || program.audience.includes(selectedAudience)
      const matchesTechnology = selectedTechnology === 'all' || program.technology === selectedTechnology
      const matchesCertification = selectedCertification === 'all' ||
                                   (selectedCertification === 'Yes' && program.certification === 'Yes') ||
                                   (selectedCertification === 'No' && program.certification === 'No')

      // If any non-"all" filter is selected, use OR logic
      const hasActiveFilters = selectedLevel !== 'all' ||
                               selectedAudience !== 'all' ||
                               selectedTechnology !== 'all' ||
                               selectedCertification !== 'all'

      if (hasActiveFilters) {
        // Show program if it matches ANY active filter
        return (selectedLevel !== 'all' && program.level === selectedLevel) ||
               (selectedAudience !== 'all' && program.audience.includes(selectedAudience)) ||
               (selectedTechnology !== 'all' && program.technology === selectedTechnology) ||
               (selectedCertification === 'Yes' && program.certification === 'Yes') ||
               (selectedCertification === 'No' && program.certification === 'No')
      }

      return true
    })
  }

  const filteredBootcamps = filterPrograms(bootcamps)
  const filteredCourses = filterPrograms(courses)

  // Count active filters
  const activeFilterCount = [
    selectedLevel !== 'all' ? 1 : 0,
    selectedAudience !== 'all' ? 1 : 0,
    selectedTechnology !== 'all' ? 1 : 0,
    selectedCertification !== 'all' ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  // Clear all filters
  const clearFilters = () => {
    setSelectedLevel('all')
    setSelectedAudience('all')
    setSelectedTechnology('all')
    setSelectedCertification('all')
    setSearchQuery('')
  }

  const stats = [
    { label: "Training Programs", value: "40+", icon: BookOpen },
    { label: "Professionals Trained", value: "2000+", icon: Users },
    { label: "Countries Covered", value: "6", icon: Globe },
    { label: "Client Satisfaction", value: "98%", icon: Award }
  ]

  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced', 'Executive']
  const audiences = [
    'all',
    'C-Suite',
    'Developers',
    'Data Scientists',
    'Business Users',
    'ML Engineers',
    'Cloud Engineers'
  ]
  const technologies = [
    'all',
    'Microsoft',
    'Google Cloud',
    'AWS',
    'Open Source',
    'Claude/Anthropic',
    'Cross-Platform',
    'Multi-Cloud'
  ]
  const certifications = ['all', 'Yes', 'No']

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-14 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-white"></div>
        <div className="absolute inset-0 bg-gradient-mesh"></div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <span className="inline-flex items-center rounded-full px-3 py-1 mb-5 text-xs font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/60">
              Training Programs
            </span>
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Corporate AI Training & Bootcamps
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Transform your workforce with comprehensive AI training programs. From executive workshops
              to intensive technical bootcamps, we deliver customized training aligned with your business goals.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact#book"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-xl hover:shadow-glow-blue transition-all duration-300"
              >
                Request Custom Training
              </Link>
              <a
                href="#programs"
                className="inline-flex items-center px-8 py-4 border-2 border-primary-600 text-primary-600 font-medium rounded-xl hover:bg-primary-50 transition-all duration-300"
              >
                Explore Programs
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-14 lg:py-20 bg-gray-50">
        <div className="section-divider"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-card p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Training Programs Section */}
      <section id="programs" className="relative py-14 lg:py-20">
        <div className="section-divider"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Training Programs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from intensive bootcamps or focused courses designed to meet your specific needs
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('bootcamps')}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === 'bootcamps'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Rocket className="w-5 h-5 inline-block mr-2" />
                Bootcamps ({bootcamps.length})
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === 'courses'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BookOpen className="w-5 h-5 inline-block mr-2" />
                Courses ({courses.length})
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search programs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Filter Header with Clear Button */}
            {(activeFilterCount > 0 || searchQuery) && (
              <div className="flex justify-center items-center gap-3 mb-3">
                <span className="text-sm text-gray-600">
                  {activeFilterCount > 0 && (
                    <span className="inline-flex items-center">
                      <Filter className="w-4 h-4 mr-1" />
                      {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
                    </span>
                  )}
                  {activeFilterCount > 0 && searchQuery && ' • '}
                  {searchQuery && 'Search active'}
                </span>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-3 h-3 mr-1" />
                  Clear all
                </button>
              </div>
            )}

            {/* Filters Grid - 4 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
              {/* Level Filter */}
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
              >
                <option value="all">All Levels</option>
                {levels.slice(1).map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>

              {/* Audience Filter */}
              <select
                value={selectedAudience}
                onChange={(e) => setSelectedAudience(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
              >
                <option value="all">All Audiences</option>
                {audiences.slice(1).map(audience => (
                  <option key={audience} value={audience}>{audience}</option>
                ))}
              </select>

              {/* Technology Filter */}
              <select
                value={selectedTechnology}
                onChange={(e) => setSelectedTechnology(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
              >
                <option value="all">All Technologies</option>
                {technologies.slice(1).map(tech => (
                  <option key={tech} value={tech}>{tech}</option>
                ))}
              </select>

              {/* Certification Filter */}
              <select
                value={selectedCertification}
                onChange={(e) => setSelectedCertification(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
              >
                <option value="all">Certification</option>
                <option value="Yes">With Certification</option>
                <option value="No">No Certification</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold">{activeTab === 'bootcamps' ? filteredBootcamps.length : filteredCourses.length}</span> of{' '}
              <span className="font-semibold">{activeTab === 'bootcamps' ? bootcamps.length : courses.length}</span> {activeTab}
            </p>
          </div>

          {/* Program Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === 'bootcamps' ? (
              filteredBootcamps.length > 0 ? (
                filteredBootcamps.map((program) => (
                  <TrainingCard key={program.id} program={program} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No bootcamps found matching your criteria.</p>
                </div>
              )
            ) : (
              filteredCourses.length > 0 ? (
                filteredCourses.map((program) => (
                  <TrainingCard key={program.id} program={program} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No courses found matching your criteria.</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="relative py-14 lg:py-20 bg-gray-50">
        <div className="section-divider"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Certification Exam Preparation
          </h2>
          <div className="max-w-5xl mx-auto">
            <div className="glass-card glow-border p-8">
              <div className="text-center mb-8">
                <Award className="w-16 h-16 text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  Expert-Led Certification Training
                </h3>
                <p className="text-gray-600 mb-6">
                  Prepare with a trainer holding 16+ active certifications across Microsoft, AWS, Google Cloud, and GitHub
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Microsoft Certifications */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-6 bg-blue-600 mr-2 rounded"></span>
                    Microsoft
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="text-gray-700">AI-901: AI Fundamentals <span className="text-xs text-green-600">(New)</span></li>
                    <li className="text-gray-700">AI-103: AI App & Agent Developer <span className="text-xs text-green-600">(New)</span></li>
                    <li className="text-gray-700">AI-300: MLOps Engineer <span className="text-xs text-green-600">(New)</span></li>
                    <li className="text-gray-700">AB-100: Agentic AI Architect</li>
                    <li className="text-gray-700">AB-730: AI Business Professional</li>
                    <li className="text-gray-700">AB-731: AI Transformation Leader</li>
                    <li className="text-gray-700">AB-900: Copilot Administration</li>
                    <li className="text-gray-700">AZ-204/305/400: Azure</li>
                    <li className="text-gray-700">PL-200/300/400/500/600: Power Platform</li>
                    <li className="text-gray-600 text-xs">+ 25+ more certifications</li>
                  </ul>
                </div>

                {/* Google Cloud Certifications */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-6 bg-red-600 mr-2 rounded"></span>
                    Google Cloud
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="text-gray-700">Cloud Digital Leader</li>
                    <li className="text-gray-700">ML Engineer</li>
                    <li className="text-gray-700">Data Engineer</li>
                    <li className="text-gray-700">Cloud Architect</li>
                    <li className="text-gray-700">Cloud Developer</li>
                  </ul>
                </div>

                {/* AWS Certifications */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-6 bg-orange-600 mr-2 rounded"></span>
                    AWS
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="text-gray-700">Cloud Practitioner</li>
                    <li className="text-gray-700">AI Practitioner</li>
                    <li className="text-gray-700">ML Engineer</li>
                    <li className="text-gray-700">ML Specialty</li>
                    <li className="text-gray-700">Solutions Architect</li>
                  </ul>
                </div>

                {/* GitHub Certifications */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-6 bg-gray-800 mr-2 rounded"></span>
                    GitHub
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="text-gray-700">GH-900: Foundations</li>
                    <li className="text-gray-700">GH-300: Actions</li>
                    <li className="text-gray-700">GH-200: Copilot</li>
                    <li className="text-gray-700">Advanced Security</li>
                    <li className="text-gray-700">Administration</li>
                  </ul>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="grid md:grid-cols-3 gap-4 text-center mb-6">
                  <div>
                    <div className="text-2xl font-bold text-primary-600">98%</div>
                    <div className="text-sm text-gray-600">Pass Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary-600">2000+</div>
                    <div className="text-sm text-gray-600">Students Certified</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary-600">16+</div>
                    <div className="text-sm text-gray-600">Active Certifications</div>
                  </div>
                </div>

                <div className="text-center">
                  <Link
                    href="/services/certifications"
                    className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-xl hover:shadow-glow-blue transition-all duration-300"
                  >
                    View All Certification Programs
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Delivery */}
      <section className="relative py-14 lg:py-20">
        <div className="section-divider"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-12 text-center">
            <Globe className="w-20 h-20 text-white mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Global Training Delivery
            </h2>
            <p className="text-xl text-white/90 mb-6 max-w-3xl mx-auto">
              Extensive experience delivering training across India, Saudi Arabia, UAE, Tanzania, Kenya, and Malaysia.
              Available for on-site, virtual, and hybrid training formats.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg">
                India
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg">
                Saudi Arabia
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg">
                UAE
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg">
                Tanzania
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg">
                Kenya
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg">
                Malaysia
              </span>
            </div>
            <Link
              href="/contact#book"
              className="inline-flex items-center px-8 py-4 bg-white text-primary-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Schedule International Training
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-14 lg:py-20">
        <div className="section-divider"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              { question: 'What training formats does Gennoor Tech offer?', answer: 'We offer on-site classroom training, live virtual instructor-led sessions, and hybrid formats. All programs include hands-on labs, real-world case studies, and post-training support materials.' },
              { question: 'How are training programs customized for our team?', answer: 'Every program is tailored to your industry, tech stack, and team skill level. We conduct a pre-training assessment to understand your goals and design the curriculum around your specific use cases and data.' },
              { question: 'What is the minimum batch size for corporate training?', answer: 'We recommend a minimum of 5 participants for corporate training to ensure interactive group exercises. Maximum batch size is typically 15-20 to maintain personalized attention. For larger groups, we run multiple parallel batches.' },
              { question: 'Do you provide certification preparation as part of training?', answer: 'Yes, many of our bootcamps and courses include certification preparation for Microsoft, AWS, Google Cloud, and GitHub exams. Our trainer holds 16+ active certifications with a 98% student pass rate.' },
              { question: 'Which industries do you serve with AI training?', answer: 'We serve financial services, insurance, healthcare, manufacturing, oil & gas, telecom, government, and technology sectors. Our clients include Fortune 500 companies like Boeing, Saudi Aramco, HDFC Bank, Siemens, and EY.' },
              { question: 'What is the typical duration of a training program?', answer: 'Executive bootcamps run 2-3 days. Technical workshops are 3-5 days. Deep-dive courses can extend to 2 weeks. We also offer ongoing mentoring programs for teams implementing AI projects post-training.' },
            ].map((faq) => (
              <div key={faq.question} className="glass-card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-14 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-white"></div>
        <div className="absolute inset-0 bg-gradient-mesh"></div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Team&apos;s AI Capabilities?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get a customized training proposal tailored to your industry and specific use cases
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact#book"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-xl hover:shadow-glow-blue transition-all duration-300"
            >
              Get Training Proposal
            </Link>
            <Link
              href="/resources/calendar"
              className="inline-flex items-center px-8 py-4 border-2 border-primary-600 text-primary-600 font-medium rounded-xl hover:bg-primary-50 transition-all duration-300"
            >
              View Training Calendar
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
