'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'
import Link from 'next/link'
import { Check, ChevronDown, Download, ArrowRight, CheckCircle, AlertCircle, Loader2, Calendar } from 'lucide-react'
import InlineVideoPlayer from '@/components/InlineVideoPlayer'
import { BLOB_URL } from '@/lib/site-config'

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
  '01': 'Get introduced to Claude — what it is, how it thinks, and why it\'s different from every other AI tool you\'ve tried.',
  '02': 'Understand the key differences between Claude Chat and Claude Cowork, and learn when to use each for maximum impact.',
  '03': 'Watch how Cowork takes your messy files, docs, and data and turns them into polished summaries, comparisons, and briefs.',
  '04': 'See how Cowork creates professional reports and presentations from raw data — deliverables in minutes, not hours.',
  '05': 'Connect Cowork to Google Drive and other enterprise systems to pull context and push outputs where you actually work.',
  '06': 'Use Claude Cowork directly inside Chrome — browse, research, and get work done without switching tabs.',
  '07': 'Set up scheduled flows and automated tasks so Claude handles recurring work while you focus on what matters.',
  '08': 'Your roadmap to AI-powered productivity — what to do next and how to keep building on what you\'ve learned.',
}

export default function ClaudeCoworkPage() {
  const [openModule, setOpenModule] = useState<string | null>(null)
  const registerRef = useRef<HTMLDivElement>(null)
  const formTracked = useRef(false)

  const [tzSearch, setTzSearch] = useState('')
  const [tzOpen, setTzOpen] = useState(false)
  const tzRef = useRef<HTMLDivElement>(null)

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
    const handleClickOutside = (e: MouseEvent) => {
      if (tzRef.current && !tzRef.current.contains(e.target as Node)) {
        setTzOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredTimeZones = TIME_ZONES.filter((tz) =>
    tz.toLowerCase().includes(tzSearch.toLowerCase())
  )

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
          <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8 items-center">
            <div>
              <div className="mb-4">
                <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase">
                  Claude <span className="text-[#FFD23F]">Cowork</span>
                </span>
              </div>

              <p className="text-[#FFD23F] text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-6">
                GENNOOR PRESENTS &middot; FREE WORKSHOP &middot; 1000 SEATS ONLY
              </p>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-[1.1] tracking-tight mb-6 max-w-3xl text-white">
                Free Claude AI Workshop:<br />
                Learn to Automate Your Work in 4 Hours
              </h1>

              <p className="text-lg sm:text-xl text-[#FFD23F] font-bold mb-5 max-w-2xl">
                Stop drowning in busywork. Ship work like an operator.
              </p>

              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-[13px] mb-5" style={{ background: 'rgba(255,255,255,.08)', color: '#D4DCEF' }} aria-live="polite">
                <span className="w-2 h-2 rounded-full" style={{ background: '#06A77D', animation: 'pulse 1.5s ease-in-out infinite' }} aria-hidden="true" />
                <strong className="text-[#FFD23F] text-[15px]" id="seats-remaining">837</strong> seats remaining of 1000
              </div>

              <p className="text-base sm:text-lg text-white/90 max-w-2xl mb-8 leading-relaxed">
                A free 4-hour live workshop where you sit back, watch live demos, and see how Claude Cowork can transform the way you work.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                {[
                  { label: 'CLAUDE COWORK', color: '#FF6B35' },
                  { label: '8 LIVE TOPICS', color: '#00A8A8' },
                  { label: '1000 SEATS ONLY', color: '#7B5EA7' },
                  { label: 'WATCH & LEARN', color: '#06A77D' },
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

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => { scrollToRegister(); trackEvent('cta_hero_click') }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF6B35] hover:bg-[#e55a25] text-white font-bold text-lg rounded-full transition-colors cursor-pointer"
                >
                  GRAB MY FREE SEAT <ArrowRight className="w-5 h-5" />
                </button>
                <Link
                  href="/resources/calendar"
                  onClick={() => trackEvent('cta_schedule_meet_click')}
                  className="inline-flex items-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-base rounded-full transition-colors border-2 border-white/30"
                >
                  <Calendar className="w-5 h-5" /> Schedule a Meet
                </Link>
              </div>
            </div>

            <div className="hidden md:flex flex-col items-end gap-4">
              <img src="/assets/jalal-portrait.jpeg" alt="Jalal Khan, Founder of Gennoor"
                className="w-[260px] h-[320px] rounded-2xl object-cover"
                style={{ objectPosition: '50% 20%', boxShadow: '0 8px 30px rgba(0,0,0,.3)' }} />
              <div className="w-[260px] rounded-xl px-4 py-3 text-center" style={{ background: 'rgba(255,255,255,.08)', backdropFilter: 'blur(8px)' }}>
                <p className="text-white font-bold text-sm leading-tight mb-0.5">Jalal Khan</p>
                <p className="text-[#FFD23F] text-[12px] font-bold tracking-wide mb-0.5">Microsoft Certified Trainer</p>
                <p className="text-white/70 text-[11px] font-semibold tracking-wide uppercase mb-2">Founder, CEO — Gennoor Tech</p>
                <p className="text-white/80 text-[12px] leading-relaxed m-0">5,000+ leaders trained at Microsoft, IBM, EY, Boeing &amp; more.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { number: '4 hrs', label: 'intensive' },
            { number: '8 topics', label: 'covered live' },
            { number: 'live', label: 'demos & walkthroughs' },
            { number: '5+ hrs/wk', label: 'you reclaim' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-6 text-center shadow-md border border-gray-100">
              <div className="text-2xl sm:text-3xl font-black text-[#1B2845]">{stat.number}</div>
              <div className="text-sm text-[#5C6784] mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About Gennoor — Video */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-[#1B2845] mb-3">
            We Serve AI Enablement for Anyone
          </h2>
          <p className="text-[#5C6784] text-base sm:text-lg max-w-2xl mx-auto">
            We train teams, build AI solutions, and ship products — from strategy to production.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <InlineVideoPlayer
            videoSrc="/media/videos/gennoor-presentation.mp4"
            posterSrc={`${BLOB_URL}/videos/video-thumbnail-bright.png`}
            className="shadow-xl"
            rounded="rounded-2xl"
          />
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
                'Clear understanding of what Claude can do for you',
                'Know exactly when to use Chat vs Cowork',
                'See data turned into reports and presentations live',
                'Learn how to connect Claude to Google Drive and more',
                'A roadmap to start automating your own workflows',
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

      {/* Meet Your Trainer */}
      <section className="py-6" style={{ background: '#FFF8F0' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl px-6 py-5 flex flex-col md:flex-row md:items-center gap-4" style={{ background: '#FAF6F0', boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
            <div className="flex-1 min-w-0">
              <p className="text-[#FF6B35] font-extrabold text-[10px] tracking-[.08em] uppercase mb-0.5">YOUR TRAINER</p>
              <h2 className="text-xl font-black text-[#1B2845] leading-tight mb-1">Jalal Khan</h2>
              <p className="text-[13px] text-[#5C6784] mb-2">Microsoft Certified Trainer · 16+ certifications · Founder, Gennoor</p>
              <p className="text-[14px] text-[#1B2845] leading-relaxed m-0">5,000+ leaders trained at Microsoft, IBM, EY, Boeing, Saudi Aramco &amp; more. 21 hands-on labs — you walk out with workflows running, not just concepts noted.</p>
            </div>
            <div className="flex flex-wrap gap-1.5 md:max-w-[240px] shrink-0">
              {['Microsoft', 'IBM', 'EY', 'Boeing', 'Saudi Aramco', 'HDFC Bank', 'Siemens', 'TCS'].map((logo) => (
                <span key={logo} className="px-2 py-0.5 bg-white border border-[#E2DFD8] rounded text-[10px] font-bold tracking-[.04em] text-[#5C6784] uppercase">{logo}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What We Cover */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1.5 h-8 bg-[#FFD23F] rounded-full" />
          <h2 className="text-xl sm:text-2xl font-black text-[#1B2845] uppercase tracking-wide">
            What We Cover &mdash; One Intensive Session
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { id: '01', title: 'What is Claude', color: '#FF6B35' },
            { id: '02', title: 'Chat vs Cowork', color: '#00A8A8' },
            { id: '03', title: 'Understand & Organize Data', color: '#7B5EA7' },
            { id: '04', title: 'Reports & Presentations', color: '#06A77D' },
            { id: '05', title: 'Enterprise Systems', color: '#FF6B35' },
            { id: '06', title: 'Cowork in Chrome', color: '#00A8A8' },
            { id: '07', title: 'Schedule Flows', color: '#7B5EA7' },
            { id: '08', title: 'What\'s Next?', color: '#06A77D' },
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

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <h2 className="text-[13px] font-extrabold tracking-[.06em] uppercase text-[#1B2845] mb-4 pl-3.5 border-l-4 border-[#FFD23F]">What past trainees say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {[
            { quote: "An excellent trainer with deep expertise in AI. He explains complex concepts in a very clear and practical way. His knowledge as an AI manager truly reflects in the way he connects theory with real-world applications. Highly engaging sessions and very helpful for both beginners and professionals.", cite: '— Sourabh Taneja, via Trustpilot' },
            { quote: "I have been utilizing training services of Jalal for different courses on Microsoft and AI. He is an excellent trainer when it comes to delivering official training and bespoke courses on AI. I would highly recommend him.", cite: '— Bhavesh Shah, via Trustpilot' },
            { quote: "Jalal possesses a rare ability to take incredibly complex topics and break them down into actionable, easy-to-understand insights. He doesn't just teach code — he teaches the 'why' behind the models. Sessions are consistently high-energy, well-structured, and meticulously researched.", cite: '— Joshua Charles, via LinkedIn' },
          ].map((t, i) => (
            <blockquote key={i} className="m-0 p-5 rounded-xl border-t-4 border-[#FF6B35]" style={{ background: '#FFF8F0', boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
              <p className="text-sm leading-relaxed italic text-[#1B2845] mb-2.5">&ldquo;{t.quote}&rdquo;</p>
              <cite className="text-xs text-[#5C6784] not-italic font-bold">{t.cite}</cite>
            </blockquote>
          ))}
        </div>
      </section>

      {/* The Promise */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        <div className="bg-[#FFD23F] rounded-2xl p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#1B2845]" />
          <h3 className="font-black text-[#1B2845] text-lg uppercase tracking-wide mb-4">The Promise</h3>
          <p className="text-[#1B2845] text-lg sm:text-xl italic leading-relaxed max-w-4xl">
            Walk in curious. Walk out knowing exactly how Claude Cowork can automate your reports, organize your data, and give you back 5+ hours every week.
          </p>
        </div>
      </section>

      {/* CTA Band */}
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
                  <span>4 hours &middot; in your time zone &middot; details sent via email</span>
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
                    <div ref={tzRef} className="relative">
                      <label htmlFor="tzSearchInput" className="block text-sm font-semibold text-[#1B2845] mb-1">Time Zone *</label>
                      <input type="hidden" name="timeZone" value={formData.timeZone} required />
                      <div
                        onClick={() => setTzOpen(!tzOpen)}
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-white cursor-pointer flex items-center justify-between ${formData.timeZone ? 'text-[#1B2845]' : 'text-gray-400'} ${tzOpen ? 'border-[#FF6B35] ring-2 ring-[#FF6B35]/40' : 'border-gray-200'}`}
                      >
                        <span className="truncate">{formData.timeZone || 'Select time zone'}</span>
                        <ChevronDown className={`w-4 h-4 shrink-0 text-gray-400 transition-transform ${tzOpen ? 'rotate-180' : ''}`} />
                      </div>
                      {tzOpen && (
                        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                          <div className="p-2 border-b border-gray-100">
                            <input
                              id="tzSearchInput"
                              type="text"
                              placeholder="Type to search... e.g. IN, Mumbai, UTC+5"
                              value={tzSearch}
                              onChange={(e) => setTzSearch(e.target.value)}
                              autoFocus
                              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-[#1B2845] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/40 focus:border-[#FF6B35]"
                            />
                          </div>
                          <ul className="max-h-48 overflow-y-auto py-1">
                            {filteredTimeZones.length > 0 ? filteredTimeZones.map((tz) => (
                              <li
                                key={tz}
                                onClick={() => {
                                  setFormData((prev) => ({ ...prev, timeZone: tz }))
                                  setTzOpen(false)
                                  setTzSearch('')
                                }}
                                className={`px-4 py-2 text-sm cursor-pointer hover:bg-[#FFF8F0] ${formData.timeZone === tz ? 'bg-[#FFF8F0] text-[#FF6B35] font-semibold' : 'text-[#1B2845]'}`}
                              >
                                {tz}
                              </li>
                            )) : (
                              <li className="px-4 py-2 text-sm text-gray-400">No matching time zones</li>
                            )}
                          </ul>
                        </div>
                      )}
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

                  <div className="rounded-lg py-3.5 px-4 my-3.5 border-l-4 border-[#FFD23F]" style={{ background: '#FAF6F0' }}>
                    <p className="text-[13px] font-bold text-[#1B2845] mb-2"><strong>What happens after you register:</strong></p>
                    <ol className="m-0 pl-5 text-[13px] text-[#5C6784] leading-relaxed list-decimal">
                      <li>Confirmation email lands in your inbox within an hour</li>
                      <li>Session timings and joining link sent via email</li>
                      <li>Just show up — no downloads or setup needed</li>
                      <li>Sit back, watch live demos, and ask questions anytime</li>
                    </ol>
                  </div>

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

      {/* FAQ */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-[13px] font-extrabold tracking-[.06em] uppercase text-[#1B2845] mb-5 pl-3.5 border-l-4 border-[#FFD23F]">Common questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              { q: 'Is this for technical people only?', a: "No — it's specifically for non-technical leaders, PMs, ops, marketers, analysts, founders. If you can use Slack, you can do this. Zero coding required." },
              { q: 'What if I miss part of the live session?', a: "Recordings are sent to all registrants after the workshop. You can catch up on anything you missed at your own pace." },
              { q: 'Can I bring my whole team?', a: "Yes — and you should. The more people from your team who attend, the easier it is to start using Claude across your workflows." },
              { q: "What's the catch? Is there an upsell?", a: "No catch. No upsell at the end. No mailing list spam. You get 4 hours of live demos and training. That's it." },
              { q: 'What do I need before the workshop?', a: "Nothing! Since Claude Cowork is a paid subscription, you don't need to purchase or install anything. Just show up, sit back, and watch everything live as your trainer demonstrates every feature." },
            ].map((faq, i) => (
              <details key={i} className="rounded-xl px-5 py-3.5 cursor-pointer" style={{ background: '#FFF8F0', boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}>
                <summary className="font-bold text-[15px] text-[#1B2845] list-none relative pr-6">
                  {faq.q}
                  <span className="absolute right-0 top-0 text-xl text-[#FF6B35] font-bold" />
                </summary>
                <p className="mt-2.5 text-sm leading-relaxed text-[#5C6784]">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Share Buttons */}
      <section className="py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl py-6 px-7 text-center" style={{ background: '#FFD23F' }}>
            <p className="text-lg font-extrabold text-[#1B2845] mb-1">Know someone else who&apos;d benefit?</p>
            <p className="text-sm text-[#1B2845] opacity-85 mb-4">Forwarding this page helps fill the seats faster — and your friend gets a Sunday well spent.</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <a href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fgennoor.com%2Fclaude-cowork" target="_blank" rel="noopener noreferrer"
                className="px-4 py-2.5 text-white rounded-full font-bold text-[13px] no-underline transition-transform hover:-translate-y-0.5" style={{ background: '#0A66C2' }}>Share on LinkedIn</a>
              <a href="https://wa.me/?text=I%20just%20signed%20up%20for%20a%20free%204-hour%20Claude%20workshop.%20Reclaim%205%2B%20hours%2Fweek.%20First%201000%20only%3A%20https%3A%2F%2Fgennoor.com%2Fclaude-cowork" target="_blank" rel="noopener noreferrer"
                className="px-4 py-2.5 text-white rounded-full font-bold text-[13px] no-underline transition-transform hover:-translate-y-0.5" style={{ background: '#25D366' }}>Share on WhatsApp</a>
              <a href="https://twitter.com/intent/tweet?text=Just%20signed%20up%20for%20a%20free%204-hour%20Claude%20Cowork%20workshop%20by%20%40gennoor.%20First%201000%20only%3A%20https%3A%2F%2Fgennoor.com%2Fclaude-cowork" target="_blank" rel="noopener noreferrer"
                className="px-4 py-2.5 text-white rounded-full font-bold text-[13px] no-underline transition-transform hover:-translate-y-0.5" style={{ background: '#000' }}>Share on X</a>
              <a href="mailto:?subject=Free%204-hour%20Claude%20Cowork%20Workshop&body=Hey%20-%20thought%20you%27d%20want%20to%20see%20this%3A%20https%3A%2F%2Fgennoor.com%2Fclaude-cowork"
                className="px-4 py-2.5 text-white rounded-full font-bold text-[13px] no-underline transition-transform hover:-translate-y-0.5" style={{ background: '#1B2845' }}>Share via email</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
