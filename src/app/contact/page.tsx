import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Compass,
  FileText,
  Calendar,
  Mail,
  MessageCircle,
  Linkedin,
  ArrowRight,
  Clock,
  Globe,
  CheckCircle2,
  MapPin,
  Activity,
} from 'lucide-react'
import ContactForm from '@/components/contact/ContactForm'
import TrustpilotWidget from '@/components/TrustpilotWidget'
import BookingCalendar from '@/components/booking/BookingCalendar'

export const metadata: Metadata = {
  title: 'Contact Gennoor Tech — Three Ways to Start',
  description:
    'Pick your starting point with Gennoor Tech: run a 15-minute AI Readiness Diagnostic, request a scoped pilot proposal, or book a 30-minute exploratory call. Response in 24 hours; faster on WhatsApp.',
  keywords: [
    'contact Gennoor Tech',
    'AI consultant contact',
    'AI readiness diagnostic',
    'AI pilot proposal',
    'book AI consulting call',
    'Gennoor Tech WhatsApp',
  ],
  alternates: { canonical: 'https://gennoor.com/contact' },
  openGraph: {
    title: 'Contact Gennoor Tech — Three Ways to Start',
    description:
      'Diagnostic, pilot proposal, or 30-minute call. Pick the entry that fits where you are.',
    url: 'https://gennoor.com/contact',
  },
}

// Schema
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Gennoor Tech',
  description:
    'Enterprise AI Transformation partner. Diagnose, train, innovate, build, sustain — delivered across GCC, India, Africa, and APAC.',
  url: 'https://gennoor.com',
  email: 'contact@gennoor.com',
  founder: {
    '@type': 'Person',
    name: 'Jalal Ahmed Khan',
    url: 'https://www.linkedin.com/in/lostspace003/',
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
    addressLocality: 'India',
  },
  areaServed: [
    { '@type': 'Country', name: 'India' },
    { '@type': 'Country', name: 'Saudi Arabia' },
    { '@type': 'Country', name: 'United Arab Emirates' },
    { '@type': 'Place', name: 'GCC' },
    { '@type': 'Place', name: 'East Africa' },
    { '@type': 'Place', name: 'Southeast Asia' },
  ],
  sameAs: ['https://www.linkedin.com/in/lostspace003/'],
}

const faqs = [
  {
    question: 'How quickly will you respond?',
    answer:
      'Within 24 hours for any inbound (email, contact form, LinkedIn). WhatsApp is typically much faster — most messages get a same-day response, often within a few hours during business hours across GCC, India, and Africa time zones.',
  },
  {
    question: 'Is the discovery call really free, with no hidden cost?',
    answer:
      'Yes. The 30-minute exploratory call is free, with no obligation to engage further. The 15-minute AI Readiness Diagnostic on /ai-readiness is also free. We charge starting at the engagement-scoping stage — when you ask us to deliver a written proposal.',
  },
  {
    question: 'Do I need to sign an NDA before the first conversation?',
    answer:
      'Not for an exploratory call. We respect confidentiality by default and do not take notes that leave our team. For deeper scoping conversations where you want to share specific data, sample documents, or detailed architecture, a mutual NDA is signed first (typical exchange: 2–5 working days). See /about/trust-and-security for our NDA posture.',
  },
  {
    question: 'What if my use case isn\'t in your standard packages or PoC catalog?',
    answer:
      'That\'s common. The packages and PoCs cover our most-shipped patterns. For bespoke needs — a custom ML model, a forecasting engine, an analytics platform, an air-gapped deployment, a domain-specific agent — we scope it as a custom build after the exploratory call. Typical custom-build scoping takes 5 working days after the call.',
  },
  {
    question: 'What information should I have ready for the discovery call?',
    answer:
      'Whatever you have, in whatever form. Useful but not required: a rough sense of your team size, what tools you currently use (Microsoft 365, Google Workspace, your CRM, your data warehouse), which use case or problem you\'re trying to solve, and any constraints (regulatory, budget, timeline). We can have a useful conversation with very little — bring whatever you have.',
  },
  {
    question: 'What does the 15-minute Readiness Diagnostic involve?',
    answer:
      'A short structured self-assessment covering strategy, data, people, tech, and governance. You answer a series of questions; the system computes your AI Readiness Score across five dimensions; you get a written summary on screen and a downloadable PDF you can share with your team. Free, no commitment, takes about 15 minutes.',
  },
  {
    question: 'Can you travel on-site for engagements?',
    answer:
      'Yes. On-site delivery is standard for executive bootcamps, large workshops, and steering committees. We have ongoing on-site presence in India, Saudi Arabia, UAE, Tanzania, Kenya, and remote engagements globally. On-site costs are quoted transparently in the SOW.',
  },
  {
    question: 'What hours are you reachable?',
    answer:
      'Core hours: 9am–7pm India Standard Time (covers GCC, Africa, and APAC business hours). For urgent matters during active engagements, WhatsApp and async Slack work outside core hours. For sev-1 incidents on Sustain retainers, the 4-hour senior-practitioner SLA applies 24/7.',
  },
  {
    question: 'Do you offer free workshops or webinars?',
    answer:
      'Yes. Free workshops and webinars run regularly across GCC, India, and East Africa — covering Copilot adoption, AI governance, prompt engineering, and emerging topics. Schedule on /workshops and /webinars. Coming to a city near you? We do open events when client travel takes us there.',
  },
  {
    question: 'How do you handle personal data (PII, PHI, regulated content)?',
    answer:
      'For engagements involving regulated data, we default to private-deployment patterns (open-source LLMs on private infra, tokenization or de-identification before model inputs), explicit DPA terms, and regional-residency deployment. See /about/trust-and-security for the full data-handling reference.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
}

// Three intents — the core of the page
const intents = [
  {
    code: 'A',
    title: 'Run the 15-minute Readiness Diagnostic',
    icon: Compass,
    accent: 'from-amber-500 to-amber-600',
    eyebrow: 'Top of funnel · Free',
    blurb:
      'Not sure where you are in your AI journey? Answer a structured set of questions on strategy, data, people, tech, and governance. Get a written AI Readiness Score and a 1-page summary you can share with your leadership team — in about 15 minutes.',
    bullets: [
      'Free · no commitment · no email gate to start',
      '5-dimension AI Readiness Score',
      'Written summary you keep',
      'Recommended next step based on your score',
    ],
    cta: { label: 'Start the diagnostic', href: '/ai-readiness' },
    type: 'link' as const,
  },
  {
    code: 'B',
    title: 'Request a scoped engagement proposal',
    icon: FileText,
    accent: 'from-primary-500 to-primary-700',
    eyebrow: 'Middle of funnel · 5 working days',
    blurb:
      'Already know what you want to build, scope, or scale? Tell us the situation in the form below. Within 5 working days you get a written proposal — fixed scope, fixed price, fixed timeline — that your procurement team can act on.',
    bullets: [
      'Written proposal in 5 working days',
      'Fixed scope · fixed price for Diagnose/Train/Innovate',
      'No PowerPoint deck — plain English',
      'NDA exchanged before any sensitive data sharing',
    ],
    cta: { label: 'Jump to the form', href: '#proposal' },
    type: 'anchor' as const,
  },
  {
    code: 'C',
    title: 'Book a 30-minute exploratory call',
    icon: Calendar,
    accent: 'from-primary-500 to-primary-700',
    eyebrow: 'Anywhere in funnel · Free',
    blurb:
      'Prefer to talk first? Book a 30-minute call. We listen, ask awkward questions, and tell you honestly which package or engagement fits — or whether AI is the right answer for this problem yet. No deck, no pitch.',
    bullets: [
      'Free · no commitment',
      'Direct calendar booking — no back-and-forth',
      'You walk away with a clear next step (even if it isn\'t us)',
      'Recording available on request',
    ],
    cta: {
      label: 'Book a call',
      href: '#book',
      external: false,
    },
    type: 'anchor' as const,
  },
]

const directChannels = [
  {
    icon: Mail,
    label: 'Email',
    value: 'contact@gennoor.com',
    href: 'mailto:contact@gennoor.com',
    note: 'Response within 24 hours',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: 'Message us',
    href: 'https://wa.me/919326352241?text=Hi%20Gennoor%2C%20I%20visited%20gennoor.com%20and%20would%20like%20to%20discuss%20an%20AI%20engagement.',
    note: 'Fastest channel · usually same day',
    external: true,
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'Jalal Ahmed Khan',
    href: 'https://www.linkedin.com/in/lostspace003/',
    note: 'Founder — connect or message',
    external: true,
  },
  {
    icon: Calendar,
    label: 'Book a slot',
    value: 'Pick a time below',
    href: '#book',
    note: 'Direct 30-min slot booking · Microsoft Bookings',
    external: false,
  },
]

const regions = [
  { name: 'India', detail: 'Mumbai-based · GST-compliant invoicing · on-site coverage nationwide' },
  { name: 'Saudi Arabia', detail: 'Vision 2030-aligned · MCIT partnerships · on-site delivery' },
  { name: 'UAE', detail: 'DIFC + ADGM regulated finance · on-site in Dubai & Abu Dhabi' },
  { name: 'East Africa', detail: 'Tanzania, Kenya · partner-augmented delivery + on-site' },
  { name: 'Southeast Asia', detail: 'Singapore, Malaysia · remote-first, on-site on request' },
  { name: 'Global remote', detail: 'EU, UK, US, Africa elsewhere · live virtual delivery' },
]

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      {/* HERO */}
      <section className="relative py-14 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 bg-gradient-mesh" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center rounded-full px-3 py-1 mb-5 text-xs font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/60">
              <MessageCircle className="w-3 h-3 mr-1.5" />
              Get in touch
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-gray-900 mb-5 leading-[1.1]">
              Three ways to <span className="gradient-text">start</span>.
            </h1>
            <p className="text-lg text-gray-500 mb-2 leading-relaxed max-w-3xl mx-auto">
              Pick the entry point that fits where you are — top of funnel, middle, or
              bottom. All three are free. We respond within 24 hours; WhatsApp is the
              fastest path.
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              For procurement / legal / security reference materials, see{' '}
              <Link
                href="/about/trust-and-security"
                className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
              >
                Trust &amp; Security
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* THREE INTENTS */}
      <section className="py-12 lg:py-16 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {intents.map((intent) => {
              const Icon = intent.icon
              const Wrapper: React.ElementType = intent.type === 'anchor' ? 'a' : Link

              return (
                <Wrapper
                  key={intent.code}
                  href={intent.cta.href}
                  className="group rounded-3xl p-7 lg:p-8 glass-card glow-border transition-all duration-500 hover:-translate-y-1 flex flex-col"
                >
                  <div
                    className={`inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br ${intent.accent} items-center justify-center mb-5 shadow-lg shadow-primary-500/15 group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">
                    Intent {intent.code} · {intent.eyebrow}
                  </p>
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 leading-tight">
                    {intent.title}
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed mb-5">{intent.blurb}</p>
                  <ul className="space-y-2 mb-6 flex-grow">
                    {intent.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <CheckCircle2 className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="inline-flex items-center text-primary-600 font-semibold group-hover:text-primary-700 transition-colors">
                    <span>{intent.cta.label}</span>
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </Wrapper>
              )
            })}
          </div>
        </div>
      </section>

      {/* INTENT B — proposal form */}
      <section id="proposal" className="scroll-mt-24 py-20 lg:py-24 relative">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
              <div className="lg:col-span-5">
                <p className="text-xs font-bold tracking-widest text-primary-600 uppercase mb-3">
                  Intent B · Engagement proposal
                </p>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-5 leading-tight">
                  Tell us the situation. Get a written proposal in 5 working days.
                </h2>
                <p className="text-base text-gray-600 leading-relaxed mb-6">
                  Use this form if you already know roughly what you want — a specific PoC,
                  a Copilot rollout, a custom build, a multi-quarter transformation program.
                  We respond within 24 hours to acknowledge and within 5 working days with a
                  written proposal you can act on.
                </p>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                    <span>
                      Fixed scope and fixed price for Diagnose / Train / Innovate phases
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                    <span>
                      Mutual NDA exchanged before sensitive data shared (2–5 working days)
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                    <span>No sales pitch, no PowerPoint deck — plain-English proposal</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                    <span>
                      If we can&apos;t take on the engagement, we say so and recommend partners
                    </span>
                  </div>
                </div>
                <div className="mt-7 rounded-2xl p-5 bg-amber-50/40 border border-amber-100/50">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <strong className="text-gray-900">Just exploring?</strong>{' '}
                    The 15-minute{' '}
                    <Link
                      href="/ai-readiness"
                      className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
                    >
                      Readiness Diagnostic
                    </Link>{' '}
                    or a 30-minute{' '}
                    <a
                      href="#book"
                      className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
                    >
                      exploratory call
                    </a>{' '}
                    are better starting points than the proposal form.
                  </p>
                </div>
              </div>
              <div className="lg:col-span-7">
                <div className="rounded-3xl p-7 lg:p-8 glass-card">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DIRECT CHANNELS */}
      <section className="py-16 lg:py-20 relative">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <p className="text-xs font-bold tracking-widest text-primary-600 uppercase mb-3">
              Or reach out directly
            </p>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Four channels — pick what suits you.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {directChannels.map((c) => {
              const Icon = c.icon
              const isExternal = !!c.external
              const Tag: React.ElementType = 'a'
              return (
                <Tag
                  key={c.label}
                  href={c.href}
                  {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group rounded-2xl p-6 glass-card glow-border transition-all duration-500 hover:-translate-y-1 text-center"
                >
                  <div className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 items-center justify-center mb-4 shadow-lg shadow-primary-500/15">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">{c.label}</h3>
                  <p className="text-sm text-gray-700 mb-1 font-medium">{c.value}</p>
                  <p className="text-xs text-gray-400">{c.note}</p>
                </Tag>
              )
            })}
          </div>
        </div>
      </section>

      {/* INTENT C — book a call */}
      <section id="book" className="scroll-mt-24 py-20 lg:py-24 relative">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <p className="text-xs font-bold tracking-widest text-primary-600 uppercase mb-3">
              Intent C · Exploratory call
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Book a 30-minute call. Pick a time below.
            </h2>
            <p className="text-base text-gray-500 leading-relaxed">
              Free, no commitment. We listen, ask awkward questions, and tell you honestly
              which engagement fits — or whether AI is the right answer yet.
            </p>
          </div>
          <BookingCalendar />
        </div>
      </section>

      {/* TRUSTPILOT */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <TrustpilotWidget />
      </div>

      {/* REGIONS + RESPONSE TIME */}
      <section className="py-20 lg:py-24 relative">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5">
                <p className="text-xs font-bold tracking-widest text-primary-600 uppercase mb-3">
                  Where we deliver
                </p>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-5 leading-tight">
                  Regional presence and remote everywhere.
                </h2>
                <p className="text-base text-gray-600 leading-relaxed mb-6">
                  On-the-ground delivery experience across GCC, India, East Africa, and SEA.
                  Remote delivery worldwide. Engagement language: English (Hindi, Urdu, and
                  Arabic co-facilitation available on request).
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-gray-900 mb-0.5">
                        Response within 24 hours
                      </p>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        WhatsApp is faster — typically same-day, often within a few hours.
                        For sev-1 incidents on Sustain retainers, 4-hour senior practitioner
                        SLA applies 24/7.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Activity className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-gray-900 mb-0.5">
                        Core hours: 9am–7pm IST
                      </p>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Covers GCC, Africa, and APAC business hours. Outside core hours,
                        async Slack and WhatsApp work for active engagements.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-gray-900 mb-0.5">
                        Invoicing
                      </p>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        INR (GST-compliant) via Gennoor Tech Private Limited. International
                        invoicing in USD, EUR, SAR, AED supported.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-7">
                <div className="rounded-3xl p-7 lg:p-8 glass-card">
                  <h3 className="text-base font-bold text-gray-900 mb-5">
                    Regions we serve
                  </h3>
                  <div className="space-y-3">
                    {regions.map((r) => (
                      <div key={r.name} className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-primary-500 flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-sm font-bold text-gray-900 mb-0.5">{r.name}</p>
                          <p className="text-xs text-gray-500 leading-relaxed">{r.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-24 relative">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs font-bold tracking-widest text-primary-600 uppercase mb-3">
                FAQ
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Before you reach out.
              </h2>
              <p className="text-base text-gray-500 leading-relaxed">
                What people commonly ask before sending the first message.
              </p>
            </div>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-2xl p-5 glass-card transition-all duration-300"
                >
                  <summary className="flex justify-between items-start gap-4 cursor-pointer list-none">
                    <h3 className="text-sm font-semibold text-gray-900">{faq.question}</h3>
                    <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5 transition-transform duration-300 group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f1729] via-[#111b33] to-[#0c1524]" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Still not sure where to start?
          </h2>
          <p className="text-lg text-blue-200/60 mb-8 max-w-2xl mx-auto">
            Read the methodology first. The Gennoor Way page walks through the five phases
            and tells you which one you&apos;re probably in.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/the-gennoor-way"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all duration-300"
            >
              Read the methodology
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/ai-readiness"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-white border border-white/20 hover:bg-white/5 transition-all duration-300"
            >
              Run the 15-min diagnostic
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
