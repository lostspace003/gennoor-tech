'use client'

import { useState } from 'react'
import { X, Send, Loader2, CheckCircle, Phone } from 'lucide-react'
import PhoneInput from '@/components/ui/PhoneInput'

interface BookCallModalProps {
  isOpen: boolean
  onClose: () => void
  programTitle: string
}

export default function BookCallModal({ isOpen, onClose, programTitle }: BookCallModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    whatsappCountry: '',
    company: '',
    designation: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.whatsapp) {
      return // PhoneInput validation will show error
    }

    setLoading(true)

    try {
      const response = await fetch('/api/book-expert-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          programTitle,
          timestamp: new Date().toISOString()
        })
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false)
          setFormData({
            name: '',
            email: '',
            whatsapp: '',
            whatsappCountry: '',
            company: '',
            designation: '',
            message: ''
          })
          onClose()
        }, 5000)
      }
    } catch (error) {
      console.error('Error booking call:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md my-8">
        <div className="bg-white rounded-lg shadow-xl max-h-[90vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b flex-shrink-0 bg-gradient-to-r from-primary-600 to-primary-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Book an Expert Call</h2>
                <p className="text-sm text-primary-100">Speak with our training specialist</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
            {success ? (
              <div className="text-center py-10">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank You for Your Interest!</h3>
                <p className="text-gray-600 mb-3">
                  We've received your request regarding <strong>{programTitle}</strong>.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                  <p className="text-sm text-blue-800">
                    A confirmation has been sent to your email from <strong>training@gennoor.com</strong>.
                    Our team will revert back to you shortly to schedule the call.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5">
                  <p className="text-sm text-amber-800">
                    <strong>Interested in:</strong> {programTitle}
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                    Our expert will discuss your requirements, customization options, and answer all your queries.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="bc-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="bc-name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="bc-email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="bc-email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <PhoneInput
                    label="WhatsApp Number *"
                    id="bc-whatsapp"
                    value={formData.whatsapp}
                    onChange={(fullNumber, _dialCode, country) => {
                      setFormData({ ...formData, whatsapp: fullNumber, whatsappCountry: country })
                    }}
                  />

                  <div>
                    <label htmlFor="bc-company" className="block text-sm font-medium text-gray-700 mb-1">
                      Company / Organization *
                    </label>
                    <input
                      type="text"
                      id="bc-company"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="bc-designation" className="block text-sm font-medium text-gray-700 mb-1">
                      Designation / Role *
                    </label>
                    <input
                      type="text"
                      id="bc-designation"
                      required
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="bc-message" className="block text-sm font-medium text-gray-700 mb-1">
                      What would you like to discuss? (Optional)
                    </label>
                    <textarea
                      id="bc-message"
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
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
                    disabled={loading || !formData.whatsapp}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Request Call
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
