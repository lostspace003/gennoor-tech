'use client'

import { useState, useEffect } from 'react'
import { X, Send, Loader2, CheckCircle } from 'lucide-react'
import PhoneInput from '@/components/ui/PhoneInput'
import EmailOTP from '@/components/EmailOTP'

interface CertificationEnquiryFormProps {
  isOpen?: boolean
  onClose?: () => void
  selectedCertification?: any
  embedded?: boolean
}

export default function CertificationEnquiryForm({
  isOpen = true,
  onClose,
  selectedCertification,
  embedded = false
}: CertificationEnquiryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    designation: '',
    certifications: selectedCertification ? [selectedCertification.code] : [],
    currentLevel: '',
    targetDate: '',
    trainingMode: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)

  useEffect(() => {
    setEmailVerified(false)
  }, [formData.email])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/certification-enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          selectedCertification: selectedCertification?.code || 'General Enquiry',
          timestamp: new Date().toISOString()
        })
      })

      if (response.ok) {
        setSuccess(true)
        // Reset form after delay
        setTimeout(() => {
          setSuccess(false)
          setFormData({
            name: '',
            email: '',
            phone: '',
            company: '',
            designation: '',
            certifications: [],
            currentLevel: '',
            targetDate: '',
            trainingMode: '',
            message: ''
          })
          if (onClose) onClose()
        }, 4000)
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error)
    } finally {
      setLoading(false)
    }
  }

  const content = (
    <form onSubmit={handleSubmit} className={embedded ? '' : 'p-6 overflow-y-auto flex-1'}>
      {success ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Enquiry Submitted!</h3>
          <p className="text-gray-600 mb-2">
            Thank you for your interest in certification preparation.
          </p>
          <p className="text-sm text-gray-500">
            Our training coordinator will contact you with detailed information.
          </p>
        </div>
      ) : (
        <>
          {selectedCertification && !embedded && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Selected Certification:</strong> {selectedCertification.code} - {selectedCertification.title}
              </p>
            </div>
          )}

          <div className="space-y-4">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <EmailOTP email={formData.email} onVerified={() => setEmailVerified(true)} verified={emailVerified} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <PhoneInput
                  label="WhatsApp Number *"
                  id="cert-phone"
                  value={formData.phone}
                  onChange={(fullNumber) => setFormData({ ...formData, phone: fullNumber })}
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Company/Organization
                </label>
                <input
                  type="text"
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1">
                Current Role/Designation
              </label>
              <input
                type="text"
                id="designation"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Certification Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="currentLevel" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Certification Level *
                </label>
                <select
                  id="currentLevel"
                  required
                  value={formData.currentLevel}
                  onChange={(e) => setFormData({ ...formData, currentLevel: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select level</option>
                  <option value="none">No certifications yet</option>
                  <option value="fundamentals">Have fundamentals certification</option>
                  <option value="associate">Have associate certification</option>
                  <option value="expert">Have expert certification</option>
                  <option value="multiple">Multiple certifications</option>
                </select>
              </div>

              <div>
                <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Target Exam Date *
                </label>
                <select
                  id="targetDate"
                  required
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select timeline</option>
                  <option value="1-month">Within 1 month</option>
                  <option value="2-months">Within 2 months</option>
                  <option value="3-months">Within 3 months</option>
                  <option value="6-months">Within 6 months</option>
                  <option value="planning">Just exploring</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="trainingMode" className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Training Mode *
              </label>
              <select
                id="trainingMode"
                required
                value={formData.trainingMode}
                onChange={(e) => setFormData({ ...formData, trainingMode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select mode</option>
                <option value="online-live">Online Live Sessions</option>
                <option value="onsite">On-site at our location</option>
                <option value="corporate">Corporate training at office</option>
                <option value="self-paced">Self-paced with mentoring</option>
                <option value="weekend">Weekend batches</option>
                <option value="fast-track">Fast-track intensive</option>
              </select>
            </div>

            {!selectedCertification && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interested Certifications (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['AI-901', 'AI-103', 'AI-300', 'AB-100', 'AB-730', 'AB-731', 'AB-900', 'AZ-204', 'AZ-305', 'AZ-400', 'PL-200', 'PL-300', 'PL-400'].map(cert => (
                    <label key={cert} className="flex items-center">
                      <input
                        type="checkbox"
                        value={cert}
                        checked={formData.certifications.includes(cert)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, certifications: [...formData.certifications, cert] })
                          } else {
                            setFormData({ ...formData, certifications: formData.certifications.filter(c => c !== cert) })
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{cert}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Questions or Requirements
              </label>
              <textarea
                id="message"
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            {!embedded && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading || !emailVerified}
              className="flex-1 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Submit Enquiry
                </>
              )}
            </button>
          </div>
        </>
      )}
    </form>
  )

  if (embedded) {
    return content
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl my-8">
        <div className="bg-white rounded-lg shadow-xl max-h-[90vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b flex-shrink-0 bg-gradient-to-r from-primary-50 to-primary-100">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Certification Preparation Enquiry</h2>
              <p className="text-sm text-gray-600 mt-1">Get personalized guidance for your certification journey</p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>

          {content}
        </div>
      </div>
    </div>
  )
}