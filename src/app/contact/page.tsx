import type { Metadata } from 'next'
import Link from 'next/link'
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

/**
 * Contact page in the Apple idiom, per the redesign handoff: "Let's talk."
 * hero, grey form section with the real proposal form beside a quiet side
 * stack (email / WhatsApp / dark book-a-call card / elsewhere). The booking
 * calendar, Trustpilot widget, regions, FAQ, and both JSON-LD schemas all
 * survive.
 */

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

const intents = [
  {
    eyebrow: 'Free · 15 minutes',
    title: 'Run the Readiness Diagnostic',
    blurb:
      'Not sure where you are in your AI journey? Get a written AI Readiness Score and a summary you can share with leadership.',
    cta: { label: 'Start the diagnostic ›', href: '/ai-readiness' },
  },
  {
    eyebrow: '5 working days',
    title: 'Request a scoped proposal',
    blurb:
      'Already know what you want to build, scope, or scale? Tell us the situation and get a written, fixed-price proposal.',
    cta: { label: 'Jump to the form ›', href: '#proposal' },
  },
  {
    eyebrow: 'Free · 30 minutes',
    title: 'Book an exploratory call',
    blurb:
      'Prefer to talk first? We listen, ask awkward questions, and tell you honestly which engagement fits — no deck, no pitch.',
    cta: { label: 'Book a call ›', href: '#book' },
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

const WHATSAPP_URL =
  'https://wa.me/919326352241?text=Hi%20Gennoor%2C%20I%20visited%20gennoor.com%20and%20would%20like%20to%20discuss%20an%20AI%20engagement.'

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

      <main className="min-h-screen bg-white">
        {/* ===== Hero ===== */}
        <section className="px-8 pt-20 lg:pt-[100px] pb-10 text-center">
          <div className="kicker mb-5">Contact</div>
          <h1 className="text-[clamp(40px,4.8vw,64px)] leading-[1.06] tracking-[-0.03em] font-bold text-gray-900">
            Let&rsquo;s talk.
          </h1>
          <p className="text-[clamp(18px,1.8vw,22px)] leading-[1.45] text-[#6e6e73] max-w-[520px] mx-auto mt-5">
            Thirty minutes, no deck, no pitch. Senior person on the call, always.
          </p>
          <p className="text-[13px] text-[#86868b] mt-4">
            Procurement, legal, or security reference?{' '}
            <Link href="/about/trust-and-security" className="text-primary-600 font-medium hover:text-[#0077ed]">
              Trust &amp; Security ›
            </Link>
          </p>
        </section>

        {/* ===== Three ways to start ===== */}
        <section className="px-8 pb-14">
          <div className="max-w-[1080px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            {intents.map(intent => (
              <div key={intent.title} className="bg-white border border-[#e8e8ed] hover:border-[#d2d2d7] rounded-[18px] px-6 py-7 flex flex-col transition-colors">
                <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#86868b] mb-2.5">
                  {intent.eyebrow}
                </div>
                <h2 className="text-[17px] font-bold text-gray-900 mb-2">{intent.title}</h2>
                <p className="text-[13.5px] leading-[1.55] text-[#6e6e73] mb-4">{intent.blurb}</p>
                <a
                  href={intent.cta.href}
                  className="text-[13px] font-semibold text-primary-600 hover:text-[#0077ed] mt-auto"
                >
                  {intent.cta.label}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ===== Form + side stack ===== */}
        <section id="proposal" className="scroll-mt-16 bg-[#f5f5f7] px-8 pt-16 pb-24">
          <div className="max-w-[980px] mx-auto grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4 items-start">
            {/* Form card */}
            <div className="bg-white rounded-3xl p-7 lg:p-10">
              <h2 className="text-[22px] font-bold tracking-[-0.01em] text-gray-900 mb-1.5">
                Tell us the situation.
              </h2>
              <p className="text-[14px] text-[#6e6e73] mb-7">
                Written proposal in 5 working days — fixed scope, fixed price,
                plain English. NDA before any sensitive data is shared.
              </p>
              <ContactForm />
            </div>

            {/* Side stack */}
            <div className="flex flex-col gap-3.5">
              <div className="bg-white rounded-[20px] p-[26px]">
                <div className="text-sm font-bold text-gray-900 mb-1">Email</div>
                <a href="mailto:contact@gennoor.com" className="text-sm text-primary-600 hover:text-[#0077ed]">
                  contact@gennoor.com
                </a>
                <div className="text-xs text-[#86868b] mt-1.5">Response within 24 hours</div>
              </div>

              <div className="bg-white rounded-[20px] p-[26px]">
                <div className="text-sm font-bold text-gray-900 mb-1">WhatsApp</div>
                <p className="text-[13.5px] leading-normal text-[#6e6e73]">
                  Fastest for GCC, Africa, and South Asia hours.
                </p>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-[13.5px] font-medium text-primary-600 hover:text-[#0077ed] mt-1.5"
                >
                  Message us ›
                </a>
              </div>

              <div className="bg-[#1d1d1f] rounded-[20px] p-[26px]">
                <div className="text-sm font-bold text-white mb-1">Book a call</div>
                <p className="text-[13.5px] leading-normal text-[#a1a1a6] mb-3">
                  Pick a slot that suits your timezone.
                </p>
                <a
                  href="#book"
                  className="inline-block bg-primary-600 hover:bg-[#0077ed] text-white text-[13px] font-semibold px-[18px] py-[9px] rounded-full transition-colors"
                >
                  Open calendar
                </a>
              </div>

              <div className="bg-white rounded-[20px] p-[26px]">
                <div className="text-sm font-bold text-gray-900 mb-1">Elsewhere</div>
                <div className="flex gap-4 mt-1.5">
                  <a
                    href="https://www.linkedin.com/in/lostspace003/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13.5px] font-medium text-primary-600 hover:text-[#0077ed]"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://www.youtube.com/@GennoorTech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13.5px] font-medium text-primary-600 hover:text-[#0077ed]"
                  >
                    YouTube
                  </a>
                  <a
                    href="https://github.com/lostspace003"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13.5px] font-medium text-primary-600 hover:text-[#0077ed]"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Book a call ===== */}
        <section id="book" className="scroll-mt-16 px-8 py-16 lg:py-24">
          <div className="text-center max-w-[560px] mx-auto mb-10">
            <h2 className="display-card mb-3">Pick a time.</h2>
            <p className="text-[17px] text-[#6e6e73]">
              Free, no commitment. We listen, ask awkward questions, and tell you
              honestly which engagement fits — or whether AI is the right answer yet.
            </p>
          </div>
          <BookingCalendar />
        </section>

        {/* ===== Trustpilot ===== */}
        <div className="max-w-[1080px] mx-auto px-8">
          <TrustpilotWidget />
        </div>

        {/* ===== Regions ===== */}
        <section className="bg-[#f5f5f7] px-8 py-16 lg:py-24 mt-14">
          <div className="max-w-[1080px] mx-auto">
            <h2 className="display-card text-center mb-3">Regional presence. Remote everywhere.</h2>
            <p className="text-[17px] text-[#6e6e73] text-center max-w-[620px] mx-auto mb-12">
              English engagement language — Hindi, Urdu, and Arabic co-facilitation
              on request. Core hours 9am–7pm IST; 4-hour senior-practitioner SLA
              for sev-1 incidents on Sustain retainers. INR (GST-compliant), USD,
              EUR, SAR, and AED invoicing.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e8e8ed] border border-[#e8e8ed] rounded-[18px] overflow-hidden">
              {regions.map(r => (
                <div key={r.name} className="bg-white px-6 py-6">
                  <div className="text-[15px] font-bold text-gray-900 mb-1">{r.name}</div>
                  <div className="text-[13px] leading-[1.55] text-[#6e6e73]">{r.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className="px-8 py-16 lg:py-24">
          <div className="max-w-[720px] mx-auto">
            <h2 className="display-card text-center mb-12">Before you reach out.</h2>
            <div className="border-t border-[#e8e8ed]">
              {faqs.map(faq => (
                <details key={faq.question} className="group border-b border-[#e8e8ed] py-5">
                  <summary className="relative cursor-pointer list-none pr-8 text-[15px] font-semibold text-gray-900">
                    {faq.question}
                  </summary>
                  <p className="text-sm text-[#6e6e73] mt-3 leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Final CTA ===== */}
        <section className="bg-[#f5f5f7] px-8 py-[90px] text-center">
          <h2 className="display-section">Still not sure where to start?</h2>
          <p className="text-[18px] text-[#6e6e73] mt-3 mb-7 max-w-[520px] mx-auto">
            The Gennoor Way walks through the five phases and tells you which one
            you&rsquo;re probably in.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-[22px] justify-center items-center">
            <Link href="/the-gennoor-way" className="pill-primary-sm">
              Read the methodology
            </Link>
            <Link href="/ai-readiness" className="text-[15px] font-medium text-primary-600 hover:text-[#0077ed]">
              Run the 15-min diagnostic ›
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
