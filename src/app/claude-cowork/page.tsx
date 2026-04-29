'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'
import { Check, ChevronDown, Download, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

const TIME_ZONES = [
  'UTC-12:00 (Baker Island)',
  'UTC-11:00 (Pago Pago)',
  'UTC-10:00 (Honolulu)',
  'UTC-09:00 (Anchorage)',
  'UTC-08:00 (Los Angeles)',
  'UTC-07:00 (Denver)',
  'UTC-06:00 (Chicago)',
  'UTC-05:00 (New York)',
  'UTC-04:00 (Santiago)',
  'UTC-03:00 (São Paulo)',
  'UTC-02:00 (Mid-Atlantic)',
  'UTC-01:00 (Azores)',
  'UTC+00:00 (London)',
  'UTC+01:00 (Paris, Lagos)',
  'UTC+02:00 (Cairo, Johannesburg)',
  'UTC+03:00 (Moscow, Riyadh)',
  'UTC+03:30 (Tehran)',
  'UTC+04:00 (Dubai)',
  'UTC+04:30 (Kabul)',
  'UTC+05:00 (Karachi)',
  'UTC+05:30 (Mumbai, Kolkata)',
  'UTC+05:45 (Kathmandu)',
  'UTC+06:00 (Dhaka)',
  'UTC+06:30 (Yangon)',
  'UTC+07:00 (Bangkok, Jakarta)',
  'UTC+08:00 (Singapore, Beijing)',
  'UTC+09:00 (Tokyo, Seoul)',
  'UTC+09:30 (Adelaide)',
  'UTC+10:00 (Sydney)',
  'UTC+11:00 (Solomon Islands)',
  'UTC+12:00 (Auckland)',
  'UTC+13:00 (Samoa)',
]

const moduleDescriptions: Record<string, string> = {
  '01': 'Understand what Claude Cowork is, how it differs from chat-based AI, and the mental model for delegating real work to an autonomous coworker.',
  '02': 'Learn to feed Cowork your messy files, docs, and data — and get polished summaries, comparisons, and briefs back in minutes.',
  '03': 'Connect Cowork to your calendar, email, project tools, and CRM so it can pull context and push outputs where you actually work.',
  '04': 'Set up recurring tasks, scheduled digests, and automated handoffs so Cowork runs workflows while you sleep.',
  '05': 'Build 5+ real workflows live: Friday digest, 1:1 prep, vendor review, stakeholder report, and your own custom workflow.',
  '06': 'Create your team\'s rollout playbook — governance guardrails, approval chains, and a phased adoption plan you can present to leadership.',
}

export default function ClaudeCoworkPage() {
  const [openModule, setOpenModule] = useState<string | null>(null)
  const registerRef = useRef<HTMLDivElement>(null)
  const formTracked = useRef(false)

  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [formError, setFormError] = useState('')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    country: '',
    timeZone: '',
    role: '',
    company: '',
    biggestWorkflow: '',
    consent: false,
  })

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value
    setFormData((prev) => ({ ...prev, [target.name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!formData.consent) return

    setFormStatus('submitting')
    setFormError('')
    trackEvent('form_submit')

    try {
      const res = await fetch('/api/claude-cowork-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          country: formData.country,
          timeZone: formData.timeZone,
          role: formData.role,
          company: formData.company,
          biggestWorkflow: formData.biggestWorkflow,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setFormStatus('success')
      } else {
        setFormError(data.message || 'Something went wrong.')
        setFormStatus('error')
      }
    } catch {
      setFormError('Network error. Please try again or email admin@gennoor.com.')
      setFormStatus('error')
    }
  }

  useEffect(() => {
    if (!registerRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !formTracked.current) {
          formTracked.current = true
          trackEvent('form_view')
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(registerRef.current)
    return () => observer.disconnect()
  }, [])

  const toggleModule = (id: string) => {
    setOpenModule(openModule === id ? null : id)
  }

  const scrollToRegister = () => {
    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })
  }

  const trackEvent = (eventName: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName)
    }
  }

  return (
    <div className="bg-[#FFF8F0] min-h-screen" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Hero Section */}
      <section className="relative bg-[#1B2845] text-white overflow-hidden">
        <div className="absolute top-6 right-6 sm:top-10 sm:right-10 w-20 h-20 sm:w-24 sm:h-24 bg-[#FFD23F] rounded-full flex items-center justify-center z-10">
          <div className="text-center">
            <div className="text-[#1B2845] text-xs font-bold leading-tight">100%</div>
            <div className="text-[#1B2845] text-lg font-black leading-tight">FREE</div>
          </div>
        </div>

        <div className="absolute bottom-8 left-8 w-4 h-4 bg-[#7B5EA7] rounded-full opacity-60 hidden sm:block" />
        <div className="absolute top-1/3 right-24 w-5 h-5 bg-[#FFD23F] rounded-full opacity-40 hidden sm:block" />
        <div className="absolute bottom-12 right-12 w-3 h-3 bg-[#FF6B35] rounded-full opacity-50 hidden sm:block" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="mb-4">
            <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase">
              Claude <span className="text-[#FFD23F]">Cowork</span>
            </span>
          </div>

          <p className="text-[#FFD23F] text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-6">
            GENNOOR PRESENTS &middot; FREE WORKSHOP &middot; 1000 SEATS ONLY
          </p>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-[1.1] tracking-tight mb-6 max-w-3xl text-white">
            Stop drowning in busywork.<br />
            Ship work like an operator.
          </h1>

          <p className="text-base sm:text-lg text-white/90 max-w-2xl mb-8 leading-relaxed">
            A free 8-hour, hands-on workshop that turns scattered tools, files, and meetings into one autonomous coworker. In your own time zone.
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            {[
              { label: 'CLAUDE COWORK', color: '#FF6B35' },
              { label: '21 LIVE LABS', color: '#00A8A8' },
              { label: '1000 SEATS ONLY', color: '#7B5EA7' },
              { label: 'BUILD-IT-LIVE', color: '#06A77D' },
            ].map((pill) => (
              <span
                key={pill.label}
                className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold text-white border-2"
                style={{ borderColor: pill.color, backgroundColor: `${pill.color}20` }}
              >
                {pill.label}
              </span>
            ))}
          </div>

          <button
            onClick={() => { scrollToRegister(); trackEvent('cta_hero_click') }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF6B35] hover:bg-[#e55a25] text-white font-bold text-lg rounded-full transition-colors cursor-pointer"
          >
            GRAB MY FREE SEAT <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { number: '8 hrs', label: 'intensive' },
            { number: '6 mods', label: 'real workflows' },
            { number: '21 labs', label: 'hands-on' },
            { number: '5+ hrs/wk', label: 'you reclaim' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-6 text-center shadow-md border border-gray-100">
              <div className="text-2xl sm:text-3xl font-black text-[#1B2845]">{stat.number}</div>
              <div className="text-sm text-[#5C6784] mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Two-column Value Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Walk Away With */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <div className="bg-[#FF6B35] px-6 py-4">
              <h2 className="text-white font-black text-lg uppercase tracking-wide">You&apos;ll Walk Away With</h2>
            </div>
            <ul className="p-6 space-y-4">
              {[
                'A weekly Friday digest that writes itself',
                'A 1:1 prep packet ready every morning',
                'Vendor + contract reviews in 10 minutes',
                'A board-ready stakeholder report on demand',
                'Your team\'s personalized rollout playbook',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#06A77D] mt-0.5 shrink-0" />
                  <span className="text-[#1B2845]">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Who This Is For */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <div className="bg-[#00A8A8] px-6 py-4">
              <h2 className="text-white font-black text-lg uppercase tracking-wide">Who This Is For</h2>
            </div>
            <ul className="p-6 space-y-5">
              {[
                { title: 'BUSINESS LEADERS', desc: 'Managers buried in updates, reviews, 1:1 prep', color: '#FF6B35' },
                { title: 'KNOWLEDGE WORKERS', desc: 'PMs, ops, marketers, analysts juggling 6 tools', color: '#00A8A8' },
                { title: 'L&D + ENTERPRISE', desc: 'Training teams rolling AI out across the org', color: '#7B5EA7' },
                { title: 'INDIVIDUAL PROS', desc: 'Future-proofing your career with AI fluency', color: '#06A77D' },
              ].map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <span className="w-3 h-3 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: item.color }} />
                  <div>
                    <div className="font-bold text-[#1B2845] text-sm">{item.title}</div>
                    <div className="text-[#5C6784] text-sm">{item.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* What We Cover */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1.5 h-8 bg-[#FFD23F] rounded-full" />
          <h2 className="text-xl sm:text-2xl font-black text-[#1B2845] uppercase tracking-wide">
            What We Cover &mdash; One Intensive Day
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { id: '01', title: 'Understanding Cowork', color: '#FF6B35' },
            { id: '02', title: 'Files & Synthesis', color: '#00A8A8' },
            { id: '03', title: 'Connect to Your Work', color: '#7B5EA7' },
            { id: '04', title: 'Delegate & Schedule', color: '#E63946' },
            { id: '05', title: 'Real Workflows', color: '#E07A1F' },
            { id: '06', title: 'Govern & Roll Out', color: '#06A77D' },
          ].map((mod) => (
            <button
              key={mod.id}
              onClick={() => toggleModule(mod.id)}
              className="text-left bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-md cursor-pointer"
            >
              <div className="flex items-center justify-between p-4" style={{ borderTop: `4px solid ${mod.color}` }}>
                <div>
                  <span className="text-xs font-bold text-white px-2 py-0.5 rounded" style={{ backgroundColor: mod.color }}>
                    {mod.id}
                  </span>
                  <div className="font-bold text-[#1B2845] text-sm mt-2">{mod.title}</div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#5C6784] transition-transform ${openModule === mod.id ? 'rotate-180' : ''}`}
                />
              </div>
              {openModule === mod.id && (
                <div className="px-4 pb-4 text-sm text-[#5C6784] leading-relaxed border-t border-gray-50 pt-3">
                  {moduleDescriptions[mod.id]}
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* The Promise */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        <div className="bg-[#FFD23F] rounded-2xl p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#1B2845]" />
          <h3 className="font-black text-[#1B2845] text-lg uppercase tracking-wide mb-4">The Promise</h3>
          <p className="text-[#1B2845] text-lg sm:text-xl italic leading-relaxed max-w-4xl">
            Walk in overwhelmed. Walk out with a personalized rollout playbook, 5+ workflows running on autopilot, and the AI-fluent reflexes that put you ahead of 95% of your peers.
          </p>
        </div>
      </section>

      {/* Registration Section */}
      <section id="register" ref={registerRef} className="bg-[#1B2845] py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Left — Copy */}
            <div className="text-white">
              <h2 className="text-3xl sm:text-4xl font-black mb-4 text-white">Filling Seats Now</h2>
              <p className="text-gray-300 text-lg mb-8">
                Free for the first 1000 registrants. After that, the doors close.
              </p>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#FFD23F] mt-0.5 shrink-0" />
                  <span>8 hours &middot; in your time zone &middot; details sent via email</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#FFD23F] mt-0.5 shrink-0" />
                  <span>Session details emailed to your email</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#FFD23F] mt-0.5 shrink-0" />
                  <span>100% free &middot; No upsell &middot; Open to anyone, anywhere</span>
                </li>
              </ul>

              <div className="mt-8">
                <a
                  href="/assets/Claude_Cowork_Workshop_Flyer.pdf"
                  download
                  onClick={() => trackEvent('flyer_download')}
                  className="inline-flex items-center gap-2 text-[#FFD23F] hover:text-[#ffe066] font-semibold transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download the workshop one-pager (PDF)
                </a>
              </div>
            </div>

            {/* Right — Form */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
              {formStatus === 'success' ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-[#06A77D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-[#06A77D]" />
                  </div>
                  <h3 className="text-xl font-black text-[#1B2845] mb-2">You&apos;re In!</h3>
                  <p className="text-[#5C6784]">
                    Check your email for confirmation and workshop details.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-lg font-black text-[#1B2845] mb-1">Register Now</h3>
                  <p className="text-sm text-[#5C6784] mb-4">Secure your free seat in under 60 seconds.</p>

                  {formStatus === 'error' && (
                    <div className="flex items-start gap-2 bg-red-50 text-red-700 text-sm p-3 rounded-lg">
                      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                      {formError}
                    </div>
                  )}

                  <div>
                    <label htmlFor="fullName" className="block text-sm font-semibold text-[#1B2845] mb-1">Full Name *</label>
                    <input id="fullName" name="fullName" type="text" required value={formData.fullName} onChange={handleFormChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-[#1B2845] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/40 focus:border-[#FF6B35]" />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-[#1B2845] mb-1">Email *</label>
                    <input id="email" name="email" type="email" required value={formData.email} onChange={handleFormChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-[#1B2845] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/40 focus:border-[#FF6B35]" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="country" className="block text-sm font-semibold text-[#1B2845] mb-1">Country *</label>
                      <input id="country" name="country" type="text" required value={formData.country} onChange={handleFormChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-[#1B2845] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/40 focus:border-[#FF6B35]" />
                    </div>
                    <div>
                      <label htmlFor="timeZone" className="block text-sm font-semibold text-[#1B2845] mb-1">Time Zone *</label>
                      <select id="timeZone" name="timeZone" required value={formData.timeZone} onChange={handleFormChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-[#1B2845] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/40 focus:border-[#FF6B35]">
                        <option value="">Select time zone</option>
                        {TIME_ZONES.map((tz) => (
                          <option key={tz} value={tz}>{tz}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="role" className="block text-sm font-semibold text-[#1B2845] mb-1">Role / Title</label>
                      <input id="role" name="role" type="text" value={formData.role} onChange={handleFormChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-[#1B2845] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/40 focus:border-[#FF6B35]" />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-semibold text-[#1B2845] mb-1">Company</label>
                      <input id="company" name="company" type="text" value={formData.company} onChange={handleFormChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-[#1B2845] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/40 focus:border-[#FF6B35]" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="biggestWorkflow" className="block text-sm font-semibold text-[#1B2845] mb-1">Biggest workflow you&apos;d Cowork-ify?</label>
                    <textarea id="biggestWorkflow" name="biggestWorkflow" rows={2} value={formData.biggestWorkflow} onChange={handleFormChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-[#1B2845] resize-none focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/40 focus:border-[#FF6B35]" />
                  </div>

                  <label className="flex items-start gap-2 cursor-pointer">
                    <input type="checkbox" name="consent" checked={formData.consent} onChange={handleFormChange}
                      className="mt-1 rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]" />
                    <span className="text-xs text-[#5C6784]">
                      I agree to receive workshop details and session updates from Gennoor via email. No spam, unsubscribe anytime.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={formStatus === 'submitting' || !formData.consent}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#FF6B35] hover:bg-[#e55a25] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-full transition-colors cursor-pointer"
                  >
                    {formStatus === 'submitting' ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Registering...</>
                    ) : (
                      <>GRAB MY FREE SEAT <ArrowRight className="w-5 h-5" /></>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA Band */}
      <section className="bg-[#FF6B35] py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
                Ready to ship work like an operator?
              </h2>
              <p className="text-white/80 mb-6">
                Free for the first 1000 registrants. Doors close after that.
              </p>
              <button
                onClick={() => { scrollToRegister(); trackEvent('cta_footer_click') }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#1B2845] hover:bg-[#243354] text-white font-bold text-lg rounded-full transition-colors cursor-pointer"
              >
                GRAB MY FREE SEAT <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="text-white/90 text-right md:text-right text-left">
              <p className="mb-2">
                Questions? Email{' '}
                <a href="mailto:admin@gennoor.com" className="underline font-semibold hover:text-white">
                  admin@gennoor.com
                </a>
              </p>
              <p className="text-sm text-white/70">
                100% free &middot; No upsell &middot; Open to anyone, anywhere &middot; First 1000 only
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
