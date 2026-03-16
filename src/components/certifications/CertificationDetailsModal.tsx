'use client'

import { X, Clock, Target, DollarSign, Calendar, CheckCircle, AlertCircle, BookOpen, Send } from 'lucide-react'

interface CertificationDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  certification: any
  onEnquire: () => void
}

export default function CertificationDetailsModal({
  isOpen,
  onClose,
  certification,
  onEnquire
}: CertificationDetailsModalProps) {
  if (!isOpen || !certification) return null

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

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Fundamentals':
        return 'bg-green-100 text-green-800'
      case 'Associate':
        return 'bg-blue-100 text-blue-800'
      case 'Expert':
        return 'bg-purple-100 text-purple-800'
      case 'Specialty':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className={`h-2 ${getProviderColor(certification.provider)}`}></div>
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-primary-600">{certification.code}</span>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getLevelColor(certification.level)}`}>
                {certification.level}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mt-2">{certification.title}</h2>
            <p className="text-gray-600 mt-1">{certification.provider} Certification</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Overview</h3>
            <p className="text-gray-600 leading-relaxed">
              {certification.description}
            </p>
          </div>

          {/* Exam Details Grid */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Exam Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-gray-600 mb-1">
                  <Clock className="w-5 h-5 mr-2 text-primary-600" />
                  <span className="font-medium">Duration</span>
                </div>
                <p className="text-gray-900 ml-7">{certification.examDuration}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-gray-600 mb-1">
                  <Target className="w-5 h-5 mr-2 text-primary-600" />
                  <span className="font-medium">Passing Score</span>
                </div>
                <p className="text-gray-900 ml-7">{certification.passingScore}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-gray-600 mb-1">
                  <DollarSign className="w-5 h-5 mr-2 text-primary-600" />
                  <span className="font-medium">Exam Fee</span>
                </div>
                <p className="text-gray-900 ml-7">{certification.price}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-gray-600 mb-1">
                  <Calendar className="w-5 h-5 mr-2 text-primary-600" />
                  <span className="font-medium">Validity Period</span>
                </div>
                <p className="text-gray-900 ml-7">{certification.validityPeriod}</p>
              </div>
            </div>
          </div>

          {/* Prerequisites */}
          {certification.prerequisites && certification.prerequisites.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Prerequisites</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                {certification.prerequisites.length === 0 ? (
                  <p className="text-gray-600 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    No prerequisites required - suitable for beginners
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {certification.prerequisites.map((prereq: string, idx: number) => (
                      <li key={idx} className="flex items-start">
                        <AlertCircle className="w-5 h-5 mr-2 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{prereq}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Topics Covered */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Topics Covered</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <ul className="space-y-2">
                {certification.topics.map((topic: string, idx: number) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Training Approach */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Training Approach</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <BookOpen className="w-6 h-6 text-primary-600 mb-2" />
                <h4 className="font-medium text-gray-900 mb-1">Official Curriculum</h4>
                <p className="text-sm text-gray-600">
                  Updated content aligned with the latest exam objectives
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <Target className="w-6 h-6 text-primary-600 mb-2" />
                <h4 className="font-medium text-gray-900 mb-1">Practice Tests</h4>
                <p className="text-sm text-gray-600">
                  Mock exams simulating the real certification experience
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <CheckCircle className="w-6 h-6 text-primary-600 mb-2" />
                <h4 className="font-medium text-gray-900 mb-1">Hands-on Labs</h4>
                <p className="text-sm text-gray-600">
                  Practical exercises to reinforce theoretical concepts
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <Calendar className="w-6 h-6 text-primary-600 mb-2" />
                <h4 className="font-medium text-gray-900 mb-1">Flexible Schedule</h4>
                <p className="text-sm text-gray-600">
                  Weekday, weekend, and fast-track options available
                </p>
              </div>
            </div>
          </div>

          {/* Success Guarantee */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Success Guarantee</h3>
            <p className="text-gray-700 mb-3">
              We're confident in our training methodology. With our comprehensive preparation:
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                <span className="text-gray-700">98% first-attempt pass rate</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                <span className="text-gray-700">Free retake session if you don't pass</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                <span className="text-gray-700">6 months post-training support</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
          <button
            onClick={onEnquire}
            className="flex-1 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center justify-center"
          >
            <Send className="w-5 h-5 mr-2" />
            Enquire About This Certification
          </button>
        </div>
      </div>
    </div>
  )
}