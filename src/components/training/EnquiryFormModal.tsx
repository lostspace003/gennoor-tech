'use client'

import { useState } from 'react'
import { X, Send, Loader2, CheckCircle } from 'lucide-react'
import PhoneInput from '@/components/ui/PhoneInput'

interface EnquiryFormModalProps {
  isOpen: boolean
  onClose: () => void
  programTitle: string
  programType: 'course' | 'bootcamp'
  docFile: string
  pdfFile?: string
}

export default function EnquiryFormModal({
  isOpen,
  onClose,
  programTitle,
  programType,
  docFile,
  pdfFile
}: EnquiryFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    designation: '',
    trainingFor: 'myself',
    teamSize: '',
    timeline: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/training-enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          programTitle,
          programType,
          requestedFile: pdfFile || docFile,
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
            trainingFor: 'myself',
            teamSize: '',
            timeline: '',
            message: ''
          })
          onClose()
        }, 4000)
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal - Scrollable container */}
      <div className="relative z-10 w-full max-w-md my-8">
        <div className="bg-white rounded-lg shadow-xl max-h-[90vh] flex flex-col overflow-hidden">
          {/* Header - Fixed */}
          <div className="flex items-center justify-between p-6 border-b flex-shrink-0 bg-gradient-to-r from-primary-50 to-primary-100">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Course Enquiry</h2>
              <p className="text-sm text-gray-600 mt-1">Get course details via email</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Form - Scrollable */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
            {success ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Enquiry Submitted!</h3>
                <p className="text-gray-600 mb-2">
                  Thank you for your interest in <strong>{programTitle}</strong>
                </p>
                <p className="text-sm text-gray-500">
                  We'll send the course details to your email from <strong>training@gennoor.com</strong>
                </p>
              </div>
            ) : (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>Course:</strong> {programTitle}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    PDF course outline will be sent to your email
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Personal Information */}
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
                  </div>

                  <PhoneInput
                    label="WhatsApp Number *"
                    id="phone"
                    value={formData.phone}
                    onChange={(fullNumber) => setFormData({ ...formData, phone: fullNumber })}
                  />

                  {/* Organization Information */}
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                      Company/Organization *
                    </label>
                    <input
                      type="text"
                      id="company"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1">
                      Designation/Role *
                    </label>
                    <input
                      type="text"
                      id="designation"
                      required
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  {/* Training Requirements */}
                  <div>
                    <label htmlFor="trainingFor" className="block text-sm font-medium text-gray-700 mb-1">
                      Training For *
                    </label>
                    <select
                      id="trainingFor"
                      required
                      value={formData.trainingFor}
                      onChange={(e) => setFormData({ ...formData, trainingFor: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="myself">Myself</option>
                      <option value="team">My Team</option>
                      <option value="organization">My Organization</option>
                    </select>
                  </div>

                  {(formData.trainingFor === 'team' || formData.trainingFor === 'organization') && (
                    <div>
                      <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700 mb-1">
                        Team Size *
                      </label>
                      <select
                        id="teamSize"
                        required
                        value={formData.teamSize}
                        onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Select team size</option>
                        <option value="2-5">2-5 people</option>
                        <option value="6-10">6-10 people</option>
                        <option value="11-20">11-20 people</option>
                        <option value="21-50">21-50 people</option>
                        <option value="50+">50+ people</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-1">
                      When do you plan to start? *
                    </label>
                    <select
                      id="timeline"
                      required
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select timeline</option>
                      <option value="immediately">Immediately</option>
                      <option value="1-month">Within 1 month</option>
                      <option value="2-3-months">2-3 months</option>
                      <option value="3-6-months">3-6 months</option>
                      <option value="planning">Just planning</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Message (Optional)
                    </label>
                    <textarea
                      id="message"
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
                    <p>
                      <strong>Privacy Notice:</strong> Your information will be used solely for sending course details
                      and responding to your training enquiry. We respect your privacy and won't share your data.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
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
        </div>
      </div>
    </div>
  )
}