import { Metadata } from 'next';
import Link from 'next/link';
import { Mail, Linkedin, Calendar, MapPin, Globe, Clock, MessageCircle } from 'lucide-react';
import ContactForm from '@/components/contact/ContactForm';
import TrustpilotWidget from '@/components/TrustpilotWidget';

export const metadata: Metadata = {
  title: 'Contact Gennoor Tech — AI Training & Consulting Enquiries',
  description:
    'Get in touch with Gennoor Tech for enterprise AI training, strategy consulting, and PoC development. Based in India, serving Saudi Arabia, GCC, APAC, and Africa.',
  keywords: [
    'contact AI consultant',
    'AI training enquiry',
    'enterprise AI consulting',
    'Gennoor Tech contact',
    'Jalal Ahmed Khan',
  ],
  openGraph: {
    title: 'Contact Gennoor Tech — AI Training & Consulting Enquiries',
    description:
      'Reach out for AI training, strategy consulting, and proof-of-concept development. Based in India, serving clients globally.',
    url: 'https://gennoor.com/contact',
    type: 'website',
  },
  alternates: {
    canonical: 'https://gennoor.com/contact',
  },
};

const faqs = [
  {
    question: 'How quickly can you start an AI training engagement?',
    answer:
      'We can typically kick off a discovery call within 48 hours and begin a customized training program within 2-3 weeks, depending on the scope and number of participants.',
  },
  {
    question: 'Do you offer training in languages other than English?',
    answer:
      'Our primary delivery language is English. For Saudi Arabia and GCC engagements, we can provide bilingual materials and work with local co-facilitators for Arabic support.',
  },
  {
    question: 'What is the typical duration of your training programs?',
    answer:
      'Programs range from intensive 2-day workshops to comprehensive 8-12 week cohort programs. We design each engagement around your team\'s goals, existing skill levels, and business outcomes.',
  },
  {
    question: 'Can you deliver training remotely?',
    answer:
      'Absolutely. We deliver live, interactive virtual sessions via Microsoft Teams or Zoom. Remote training includes the same hands-on labs, real-time Q&A, and post-session support as in-person delivery.',
  },
  {
    question: 'How do I book a free consultation call?',
    answer:
      'You can book a 30-minute discovery call directly through our Calendly link on this page, or send us an email at jalalkhan@gennoor.com. We typically respond within 24 hours.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Gennoor Tech',
  description:
    'Enterprise AI training, strategy consulting, and proof-of-concept development for organizations worldwide.',
  url: 'https://gennoor.com',
  email: 'jalalkhan@gennoor.com',
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
    { '@type': 'Place', name: 'GCC' },
    { '@type': 'Place', name: 'APAC' },
    { '@type': 'Place', name: 'Africa' },
  ],
  sameAs: ['https://www.linkedin.com/in/lostspace003/'],
};

const contactChannels = [
  {
    href: 'mailto:jalalkhan@gennoor.com',
    icon: Mail,
    color: 'text-primary-600 bg-primary-50',
    title: 'Email',
    detail: 'jalalkhan@gennoor.com',
    external: false,
  },
  {
    href: 'https://wa.me/919326352241?text=Hi%20Jalal%2C%20I%20visited%20gennoor.com%20and%20would%20like%20to%20discuss%20AI%20training%2Fconsulting.',
    icon: MessageCircle,
    color: 'text-emerald-600 bg-emerald-50',
    title: 'WhatsApp',
    detail: 'Quick response on WhatsApp',
    external: true,
  },
  {
    href: 'https://www.linkedin.com/in/lostspace003/',
    icon: Linkedin,
    color: 'text-blue-600 bg-blue-50',
    title: 'LinkedIn',
    detail: 'Connect with Jalal Ahmed Khan',
    external: true,
  },
  {
    href: 'https://calendly.com/gennoortech',
    icon: Calendar,
    color: 'text-primary-600 bg-primary-50',
    title: 'Book a Call',
    detail: 'Free 30-minute discovery session',
    external: true,
  },
];

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

      {/* Hero */}
      <section className="relative py-14 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f1729] via-[#111b33] to-[#0c1524]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center rounded-full px-4 py-1.5 mb-6 text-xs font-semibold border border-white/10"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <span className="text-white/60">Get in Touch</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
            Let&apos;s Build Your AI Future Together
          </h1>
          <p className="text-xl md:text-2xl text-blue-200/50 max-w-3xl mx-auto">
            Whether you need AI training for your teams, a strategic roadmap, or a working
            proof-of-concept — we&apos;re here to help.
          </p>
        </div>
      </section>

      {/* Contact Channels */}
      <section className="py-20 lg:py-24 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Reach Out Through Any Channel
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {contactChannels.map((channel) => {
              const Tag = channel.external ? 'a' : 'a';
              return (
                <a
                  key={channel.title}
                  href={channel.href}
                  {...(channel.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group rounded-2xl p-6 text-center transition-all duration-500 glass-card glow-border"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 ${channel.color} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <channel.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">{channel.title}</h3>
                  <p className="text-xs text-gray-500">{channel.detail}</p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trustpilot */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <TrustpilotWidget />
      </div>

      {/* Contact Form + Office Info */}
      <section className="py-20 lg:py-24 relative">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-5">
                Send Us a Message
              </h2>
              <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                Tell us about your AI goals and we&apos;ll get back to you within 24 hours
                with a tailored response — no generic templates, no sales pitch.
              </p>
              <ContactForm />
            </div>

            <div className="lg:pl-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Where We Operate
              </h2>
              <div className="space-y-5">
                {[
                  { icon: MapPin, title: 'Based in India', desc: "Our home base, with deep roots in India's enterprise technology ecosystem — delivering AI training to Fortune 500 companies and fast-growing startups alike." },
                  { icon: Globe, title: 'Serving Clients Globally', desc: 'Active engagements across Saudi Arabia, the broader GCC region, APAC markets, and Africa. We travel on-site or deliver live virtual sessions across time zones.' },
                  { icon: Clock, title: 'Response Time', desc: 'We respond to all enquiries within 24 hours. For urgent requests, reach out via WhatsApp for a faster reply.' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4 p-4 rounded-xl glass-card">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1 text-sm">{item.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Regions */}
              <div className="mt-8 p-6 rounded-2xl glass-card">
                <h3 className="font-semibold text-gray-900 mb-4 text-sm">Regions We Serve</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['Saudi Arabia', 'UAE & GCC', 'India', 'Southeast Asia', 'East Africa', 'Remote / Worldwide'].map((region) => (
                    <div key={region} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                      {region}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-24 relative">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="rounded-2xl p-6 glass-card">
                <h3 className="text-base font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f1729] via-[#111b33] to-[#0c1524]" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-blue-200/50 mb-8">
            Book a free 30-minute call and let&apos;s explore how AI can transform your
            organization.
          </p>
          <a
            href="https://calendly.com/gennoortech"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
          >
            <Calendar className="w-5 h-5" />
            Book a Discovery Call
          </a>
        </div>
      </section>
    </>
  );
}
