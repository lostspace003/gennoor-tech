'use client'

import { useState, useEffect } from 'react'
import { Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
import EmailOTP from '@/components/EmailOTP'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    whatsappCountry: '+91',
    company: '',
    designation: '',
    interest: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [emailVerified, setEmailVerified] = useState(false)

  useEffect(() => {
    setEmailVerified(false)
  }, [formData.email])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    try {
      const res = await fetch('/api/book-expert-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          programTitle: formData.interest || 'General Enquiry',
          timestamp: new Date().toISOString(),
        }),
      })

      if (!res.ok) throw new Error('Failed to submit')
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong. Please email us directly at contact@gennoor.com')
    }
  }

  const update = (field: string, value: string) =>
    setFormData(prev => ({ ...prev, [field]: value }))

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-24 text-center max-w-2xl">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h1>
          <p className="text-lg text-gray-600 mb-2">
            We&apos;ve received your enquiry and will get back to you within 24 hours.
          </p>
          <p className="text-gray-500">
            A confirmation email has been sent to <strong>{formData.email}</strong>
          </p>
          <a
            href="/"
            className="inline-block mt-8 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Let&apos;s Work Together
          </h1>
          <p className="text-lg text-gray-600">
            Whether you need AI training for your team, a proof-of-concept, or strategic consulting — let&apos;s discuss how we can help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Get in Touch</h2>
              <div className="space-y-4">
                <a href="mailto:contact@gennoor.com" className="flex items-start gap-3 text-gray-600 hover:text-primary-600 transition-colors">
                  <Mail className="h-5 w-5 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p>contact@gennoor.com</p>
                  </div>
                </a>
                <div className="flex items-start gap-3 text-gray-600">
                  <MapPin className="h-5 w-5 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p>Mumbai, India</p>
                    <p className="text-sm text-gray-500">Serving clients globally</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-gray-600">
                  <Clock className="h-5 w-5 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Response Time</p>
                    <p>Within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* What to expect */}
            <div className="bg-primary-50 rounded-xl p-6">
              <h3 className="font-semibold text-primary-900 mb-3">What happens next?</h3>
              <ol className="space-y-3 text-sm text-primary-800">
                <li className="flex gap-2">
                  <span className="font-bold text-primary-600">1.</span>
                  We review your requirements within 24 hours
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-primary-600">2.</span>
                  Schedule a 30-min discovery call at your convenience
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-primary-600">3.</span>
                  Receive a tailored proposal with scope, timeline & pricing
                </li>
              </ol>
            </div>

            {/* How we work */}
            <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl p-6 border border-primary-100">
              <h3 className="font-semibold text-gray-900 mb-4">How We Work</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">Corporate Training</p>
                  <p className="text-xs text-gray-600">2–10 day programs tailored to your team&apos;s level and goals</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">AI Strategy Workshop</p>
                  <p className="text-xs text-gray-600">1–2 day intensive sessions for leadership alignment</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">PoC Development</p>
                  <p className="text-xs text-gray-600">4–8 week sprints from prototype to production-ready demo</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Advisory Retainer</p>
                  <p className="text-xs text-gray-600">Ongoing monthly guidance for AI initiatives</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-primary-100">
                <p className="text-sm font-medium text-gray-900 mb-3">For a quote, let&apos;s connect</p>
                <div className="space-y-2">
                  <a
                    href="https://www.linkedin.com/in/jalal-khan-b8319955/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 px-4 py-2.5 bg-[#0A66C2] text-white text-sm font-medium rounded-lg hover:bg-[#004182] transition-colors"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    Connect on LinkedIn
                  </a>
                  <a
                    href="https://www.youtube.com/@GennoorTech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 px-4 py-2.5 bg-[#FF0000] text-white text-sm font-medium rounded-lg hover:bg-[#CC0000] transition-colors"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    GennoorTech on YouTube
                  </a>
                  <a
                    href="mailto:contact@gennoor.com"
                    className="flex items-center gap-2.5 px-4 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    contact@gennoor.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2" id="book">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">We&apos;d Love to Hear From You</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => update('name', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => update('email', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="you@company.com"
                    />
                    <EmailOTP email={formData.email} onVerified={() => setEmailVerified(true)} verified={emailVerified} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                    <div className="flex gap-2">
                      <select
                        value={formData.whatsappCountry}
                        onChange={e => update('whatsappCountry', e.target.value)}
                        className="w-24 px-2 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                      >
                        <option value="+91">+91</option>
                        <option value="+966">+966</option>
                        <option value="+971">+971</option>
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                        <option value="+255">+255</option>
                      </select>
                      <input
                        type="tel"
                        value={formData.whatsapp}
                        onChange={e => update('whatsapp', e.target.value)}
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="WhatsApp number"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={e => update('company', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Company name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                    <input
                      type="text"
                      value={formData.designation}
                      onChange={e => update('designation', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Your role"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">I&apos;m Interested In</label>
                    <select
                      value={formData.interest}
                      onChange={e => update('interest', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select an option</option>
                      <option value="Corporate Training">Corporate Training</option>
                      <option value="AI Strategy Consulting">AI Strategy Consulting</option>
                      <option value="PoC Development">PoC Development</option>
                      <option value="Agentic AI Solutions">Agentic AI Solutions</option>
                      <option value="Speaking / Webinar">Speaking / Webinar</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tell us about your requirements</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={e => update('message', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Briefly describe what you're looking for — team size, timeline, specific topics, etc."
                  />
                </div>

                {errorMsg && (
                  <p className="text-sm text-red-600">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting' || !emailVerified}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Enquiry
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
