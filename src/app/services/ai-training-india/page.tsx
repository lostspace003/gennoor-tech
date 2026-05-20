import { Metadata } from 'next';
import Link from 'next/link';
import PageCTA from '@/components/shared/PageCTA';
import {
  Calendar,
  CheckCircle,
  GraduationCap,
  Target,
  Clock,
  Users,
  Building2,
  Lightbulb,
  ArrowRight,
  IndianRupee,
  Globe,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Training in India — Enterprise Programs for Fortune 500 Teams | Gennoor Tech',
  description:
    'Enterprise AI training in India for Fortune 500 companies. Trained teams at HDFC Bank, TCS, Wipro, Siemens, and Capgemini. IST timezone delivery with flexible pricing.',
  keywords: [
    'AI training India',
    'enterprise AI training Mumbai',
    'AI consulting India',
    'corporate AI training Bangalore',
    'machine learning training India',
    'generative AI workshop India',
    'Gennoor Tech India',
  ],
  openGraph: {
    title: 'Enterprise AI Training & Solutions in India | Gennoor Tech',
    description:
      'AI training for India\'s top enterprises. Fortune 500 experience, IST delivery, flexible pricing.',
    url: 'https://gennoor.com/services/ai-training-india',
    type: 'website',
  },
  alternates: {
    canonical: 'https://gennoor.com/services/ai-training-india',
  },
};

const faqs = [
  {
    question: 'Which cities in India do you deliver training in?',
    answer:
      'We deliver on-site training across all major Indian cities including Mumbai, Bangalore, Hyderabad, Delhi NCR, Pune, Chennai, and Kolkata. We also offer hybrid and fully remote delivery for distributed teams.',
  },
  {
    question: 'Do you offer training in Indian regional languages?',
    answer:
      'Our training is delivered in English, which is the standard for enterprise technology training in India. However, we ensure our communication is clear and accessible, and trainers can accommodate mixed-language Q&A sessions when needed.',
  },
  {
    question: 'What Fortune 500 companies have you trained in India?',
    answer:
      'We have delivered AI training and consulting engagements for teams at HDFC Bank, TCS, Wipro, Siemens, and Capgemini among others. Each engagement was customized to the organization\'s specific AI maturity level and business objectives.',
  },
  {
    question: 'How does your pricing work for Indian companies?',
    answer:
      'We offer flexible pricing models for the Indian market — per-participant, per-cohort, or retainer-based engagement models. We understand the Indian enterprise procurement cycle and can work with your budget constraints while ensuring quality outcomes.',
  },
  {
    question: 'Can you train teams of 50+ participants?',
    answer:
      'Absolutely. We have experience running large-scale training programs with 50-200+ participants. For large cohorts, we use a train-the-trainer model combined with hands-on breakout sessions to ensure every participant gets meaningful interaction.',
  },
  {
    question: 'Do you provide post-training certification?',
    answer:
      'Yes. All participants receive a Gennoor Tech completion certificate. We also help organizations track skill development through pre- and post-assessments, and can integrate with your internal learning management systems.',
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

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Enterprise AI Training in India',
  description:
    'AI training programs for Indian enterprises. Fortune 500 experience with IST timezone delivery and flexible pricing.',
  provider: {
    '@type': 'Organization',
    name: 'Gennoor Tech',
    url: 'https://gennoor.com',
  },
  areaServed: {
    '@type': 'Country',
    name: 'India',
  },
  serviceType: 'AI Training and Consulting',
};

const clients = [
  'HDFC Bank',
  'TCS',
  'Wipro',
  'Siemens',
  'Capgemini',
];

export default function AITrainingIndiaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-primary-700 py-14 lg:py-20">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-primary-100 text-sm font-medium mb-6">
            <Building2 className="w-4 h-4" />
            India
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
            Enterprise AI Training
            <br />
            & Solutions in India
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto mb-10">
            Hands-on AI programs for India&apos;s leading enterprises — built on real
            experience training Fortune 500 teams across the country.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://calendly.com/gennoortech"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-50 transition-colors"
            >
              <Calendar className="w-5 h-5" />
              Book a Discovery Call
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-white border-2 border-white/30 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors"
            >
              Send an Enquiry
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* India AI Ecosystem */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                India&apos;s AI Ecosystem Is Booming — Is Your Team Ready?
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                India is the world&apos;s largest talent market for technology, and AI adoption
                is accelerating across every sector — from banking and financial services to
                manufacturing, IT services, and healthcare. NASSCOM projects that AI will add
                $500 billion to India&apos;s GDP by 2025.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                But the gap between AI ambition and AI execution is still wide. Most enterprise
                teams need structured, practical training that goes beyond theory — they need
                to learn how to build, deploy, and govern AI systems using their own data and
                their own business problems.
              </p>
              <p className="text-lg text-gray-600">
                That&apos;s exactly what we deliver. Our programs are designed for Indian
                enterprises — with IST-friendly scheduling, pricing flexibility, and deep
                understanding of the local business context.
              </p>
            </div>
            <div className="bg-primary-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Why Indian Enterprises Choose Us
              </h3>
              <div className="space-y-4">
                {[
                  'Fortune 500 training experience across Indian enterprises',
                  'IST timezone delivery — no late-night sessions for your teams',
                  'Flexible pricing models that work with Indian procurement',
                  'On-site delivery in Mumbai, Bangalore, Hyderabad, Delhi NCR, and more',
                  'Post-training support and skill assessment frameworks',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Experience */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            Trusted by India&apos;s Top Enterprises
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
            We have delivered AI training and consulting engagements for some of the most
            recognized names in Indian business.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
            {clients.map((client) => (
              <div
                key={client}
                className="bg-white rounded-xl px-8 py-5 shadow-sm border border-gray-100 text-lg font-semibold text-gray-700"
              >
                {client}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Banking & Financial Services</h3>
              <p className="text-gray-600">
                Trained AI and data science teams at one of India&apos;s largest private banks,
                covering machine learning for credit risk modeling, NLP for customer service
                automation, and responsible AI governance for regulatory compliance.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-3">IT Services & Consulting</h3>
              <p className="text-gray-600">
                Delivered enterprise AI upskilling programs for technology teams at major Indian
                IT services firms — helping consultants move from traditional software delivery
                to AI-powered solution design and implementation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* IST & Pricing */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                IST Timezone Delivery
              </h3>
              <p className="text-gray-600 mb-4">
                All sessions are scheduled within standard Indian business hours. No more asking
                your teams to join calls at odd hours. For remote sessions, we deliver via
                Microsoft Teams or Zoom with full recording and playback access.
              </p>
              <ul className="space-y-2">
                {[
                  'Standard sessions: 10:00 AM - 5:00 PM IST',
                  'Flexible scheduling for shift-based teams',
                  'Weekend intensive options available',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-primary-600 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                <IndianRupee className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Pricing Flexibility</h3>
              <p className="text-gray-600 mb-4">
                We understand Indian enterprise procurement. Our pricing is structured to work
                with your budget cycles, approval processes, and vendor onboarding requirements.
              </p>
              <ul className="space-y-2">
                {[
                  'Per-participant pricing for open enrollment',
                  'Flat-rate cohort pricing for internal teams',
                  'Retainer model for ongoing learning programs',
                  'INR invoicing and GST-compliant billing',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-primary-600 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            Services Available in India
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Training Programs</h3>
              <p className="text-gray-600 mb-4">
                Executive AI awareness, prompt engineering, LLM application development,
                agentic AI systems, and MLOps. Customized for your team&apos;s skill level and
                business domain.
              </p>
              <Link
                href="/services/training"
                className="inline-flex items-center gap-1 text-primary-600 font-medium hover:text-primary-700"
              >
                Learn more <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Strategy Consulting</h3>
              <p className="text-gray-600 mb-4">
                AI readiness assessment, use case identification, build-vs-buy analysis, and
                implementation roadmaps designed for Indian market dynamics and regulatory
                requirements.
              </p>
              <Link
                href="/services/ai-strategy"
                className="inline-flex items-center gap-1 text-primary-600 font-medium hover:text-primary-700"
              >
                Learn more <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">PoC Development</h3>
              <p className="text-gray-600 mb-4">
                Validate AI ideas with working prototypes in 4-6 weeks. We build using your
                data, your infrastructure, and your security requirements — so the PoC is
                production-ready from day one.
              </p>
              <Link
                href="/services/poc-development"
                className="inline-flex items-center gap-1 text-primary-600 font-medium hover:text-primary-700"
              >
                Learn more <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-20">
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

      <PageCTA
        title="Ready to Upskill Your Team in AI?"
        description="Join the ranks of India's top enterprises investing in AI capability. Book a free discovery call today."
        ctas={[
          { label: 'Book a Call', href: 'https://calendly.com/gennoortech' },
          { label: 'Contact Us', href: '/contact', variant: 'ghost' },
        ]}
      />
    </>
  );
}
