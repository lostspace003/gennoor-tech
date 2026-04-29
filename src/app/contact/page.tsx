import { Metadata } from 'next';
import Link from 'next/link';
import { Mail, Phone, Linkedin, Calendar, MapPin, Globe, Clock, MessageCircle } from 'lucide-react';
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
      'You can book a 30-minute discovery call directly through our Calendly link on this page, or send us an email at contact@gennoor.com. We typically respond within 24 hours.',
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
  email: 'contact@gennoor.com',
  founder: {
    '@type': 'Person',
    name: 'Jalal Ahmed Khan',
    url: 'https://www.linkedin.com/in/jalal-khan-b8319955/',
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
  sameAs: ['https://www.linkedin.com/in/jalal-khan-b8319955/'],
};

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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-primary-700 py-20 lg:py-28">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
            Let&apos;s Build Your AI Future Together
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
            Whether you need AI training for your teams, a strategic roadmap, or a working
            proof-of-concept — we&apos;re here to help.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Reach Out Through Any Channel
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Email */}
            <a
              href="mailto:contact@gennoor.com"
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-50 rounded-xl mb-4 group-hover:bg-primary-100 transition-colors">
                <Mail className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
              <p className="text-sm text-gray-600">contact@gennoor.com</p>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/919326352241?text=Hi%20Jalal%2C%20I%20visited%20gennoor.com%20and%20would%20like%20to%20discuss%20AI%20training%2Fconsulting."
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-50 rounded-xl mb-4 group-hover:bg-green-100 transition-colors">
                <MessageCircle className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">WhatsApp</h3>
              <p className="text-sm text-gray-600">Quick response on WhatsApp</p>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/jalal-khan-b8319955/"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 rounded-xl mb-4 group-hover:bg-blue-100 transition-colors">
                <Linkedin className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">LinkedIn</h3>
              <p className="text-sm text-gray-600">Connect with Jalal Ahmed Khan</p>
            </a>

            {/* Calendly */}
            <a
              href="https://calendly.com/gennoortech"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-accent-50 rounded-xl mb-4 group-hover:bg-primary-50 transition-colors">
                <Calendar className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Book a Call</h3>
              <p className="text-sm text-gray-600">Free 30-minute discovery session</p>
            </a>
          </div>
        </div>
      </section>

      {/* Trustpilot */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <TrustpilotWidget />
      </div>

      {/* Contact Form Section */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Send Us a Message
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Tell us about your AI goals and we&apos;ll get back to you within 24 hours
                with a tailored response — no generic templates, no sales pitch.
              </p>
              <ContactForm />
            </div>

            {/* Office Info */}
            <div className="lg:pl-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Where We Operate
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Based in India</h3>
                    <p className="text-gray-600">
                      Our home base, with deep roots in India&apos;s enterprise technology
                      ecosystem — delivering AI training to Fortune 500 companies and
                      fast-growing startups alike.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Serving Clients Globally
                    </h3>
                    <p className="text-gray-600">
                      Active engagements across Saudi Arabia, the broader GCC region, APAC
                      markets, and Africa. We travel on-site or deliver live virtual sessions
                      across time zones.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Response Time</h3>
                    <p className="text-gray-600">
                      We respond to all enquiries within 24 hours. For urgent requests, reach
                      out via WhatsApp for a faster reply.
                    </p>
                  </div>
                </div>
              </div>

              {/* Regions Served */}
              <div className="mt-10 p-6 bg-gray-50 rounded-2xl">
                <h3 className="font-semibold text-gray-900 mb-4">Regions We Serve</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Saudi Arabia',
                    'UAE & GCC',
                    'India',
                    'Southeast Asia',
                    'East Africa',
                    'Remote / Worldwide',
                  ].map((region) => (
                    <div
                      key={region}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <div className="w-2 h-2 bg-primary-600 rounded-full" />
                      {region}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Book a free 30-minute call and let&apos;s explore how AI can transform your
            organization.
          </p>
          <a
            href="https://calendly.com/gennoortech"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-50 transition-colors"
          >
            <Calendar className="w-5 h-5" />
            Book a Discovery Call
          </a>
        </div>
      </section>
    </>
  );
}
