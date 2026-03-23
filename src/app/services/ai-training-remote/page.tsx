import { Metadata } from 'next';
import Link from 'next/link';
import {
  Calendar,
  CheckCircle,
  GraduationCap,
  Target,
  Clock,
  Users,
  Monitor,
  Lightbulb,
  ArrowRight,
  Globe,
  Video,
  MessageSquare,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Remote AI Training — Live Virtual Sessions Worldwide | Gennoor Tech',
  description:
    'Live, interactive remote AI training delivered via Zoom and Microsoft Teams. Not pre-recorded — real-time sessions with hands-on labs, Q&A, and post-session support. Timezone-flexible delivery worldwide.',
  keywords: [
    'online AI training',
    'remote AI training',
    'virtual AI workshop',
    'live AI training online',
    'remote machine learning course',
    'online generative AI training',
    'virtual AI consulting',
  ],
  openGraph: {
    title: 'Remote AI Training — Live Virtual Sessions Worldwide | Gennoor Tech',
    description:
      'Live, interactive AI training delivered remotely. Not recorded lectures — real sessions with real interaction.',
    url: 'https://gennoor.com/services/ai-training-remote',
    type: 'website',
  },
  alternates: {
    canonical: 'https://gennoor.com/services/ai-training-remote',
  },
};

const faqs = [
  {
    question: 'Are remote sessions pre-recorded or live?',
    answer:
      'All our remote sessions are 100% live and interactive. We do not sell pre-recorded content. Every session is delivered in real-time by our trainers, with live Q&A, hands-on labs, and breakout room exercises. Sessions are recorded for participants who need to review later, but the primary experience is always live.',
  },
  {
    question: 'Which tools do you use for remote delivery?',
    answer:
      'We deliver via Microsoft Teams or Zoom, depending on your organization\'s preference. We also use Miro for collaborative whiteboarding, GitHub/GitLab for code labs, and Google Colab or Jupyter notebooks for hands-on exercises. We adapt to your existing toolstack.',
  },
  {
    question: 'How do you handle different time zones?',
    answer:
      'We schedule sessions to align with your team\'s working hours, regardless of timezone. We have delivered training to teams across IST, GST (Gulf), CET, GMT, EST, and PST time zones. For globally distributed teams, we can run multiple cohorts at different times.',
  },
  {
    question: 'Is remote training as effective as in-person?',
    answer:
      'When done right, absolutely. Our remote programs are designed specifically for virtual delivery — shorter sessions, more frequent breaks, interactive labs, and small-group breakout exercises. Participant feedback consistently rates our remote sessions on par with in-person delivery for engagement and learning outcomes.',
  },
  {
    question: 'What is the ideal group size for remote training?',
    answer:
      'We recommend 8-25 participants per cohort for optimal interaction. For larger groups, we use a combination of main sessions and breakout rooms to ensure everyone gets hands-on practice and direct access to the trainer.',
  },
  {
    question: 'Do participants get access to materials after the session?',
    answer:
      'Yes. All participants receive session recordings, slide decks, code repositories, and supplementary reading materials. We also provide 2 weeks of post-training support where participants can ask follow-up questions via a dedicated channel.',
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
  name: 'Remote AI Training — Live Virtual Sessions',
  description:
    'Live, interactive remote AI training delivered worldwide via Zoom and Microsoft Teams. Hands-on labs, real-time Q&A, and timezone-flexible scheduling.',
  provider: {
    '@type': 'Organization',
    name: 'Gennoor Tech',
    url: 'https://gennoor.com',
  },
  areaServed: {
    '@type': 'Place',
    name: 'Worldwide',
  },
  serviceType: 'Remote AI Training',
};

const steps = [
  {
    number: '01',
    title: 'Discovery Call',
    description:
      'We understand your team\'s current skill level, business goals, and the specific AI problems you want to solve.',
  },
  {
    number: '02',
    title: 'Custom Program Design',
    description:
      'We build a tailored curriculum with hands-on labs using your real-world use cases and data scenarios.',
  },
  {
    number: '03',
    title: 'Live Virtual Delivery',
    description:
      'Interactive sessions via Teams or Zoom with live coding, breakout exercises, and real-time Q&A.',
  },
  {
    number: '04',
    title: 'Post-Training Support',
    description:
      '2 weeks of follow-up support, access to recordings and materials, and optional assessment.',
  },
];

export default function AITrainingRemotePage() {
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
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-primary-700 py-20 lg:py-28">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-primary-100 text-sm font-medium mb-6">
            <Globe className="w-4 h-4" />
            Worldwide
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
            Remote AI Training
            <br />
            <span className="text-primary-100">Live Virtual Sessions Worldwide</span>
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto mb-10">
            Not pre-recorded lectures. Real trainers, live interaction, hands-on labs —
            delivered to your team wherever they are.
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

      {/* How Remote Training Works */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            How Remote Training Works
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
            Our remote programs are purpose-built for virtual delivery — not in-person
            workshops awkwardly moved to Zoom. Every element is designed for engagement.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className="text-3xl font-bold text-primary-600 mb-3">{step.number}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes It Different */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Live, Interactive — Not Recorded
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                There is no shortage of recorded AI courses online. What teams actually need
                is a trainer who understands their context, can answer real questions in real
                time, and can guide them through hands-on exercises that mirror their actual
                work.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Every Gennoor Tech remote session is delivered live. Participants code
                alongside the trainer, work in breakout rooms on realistic problems, and get
                immediate feedback. This is structured learning with a human at the center —
                not a playlist.
              </p>
              <div className="space-y-3">
                {[
                  'Live coding demonstrations with real-time Q&A',
                  'Breakout room exercises for small-group practice',
                  'Hands-on labs using cloud notebooks (Colab, Jupyter)',
                  'Session recordings provided for later review',
                  'Dedicated Slack/Teams channel for async questions',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                <Video className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Live Sessions</h3>
                <p className="text-sm text-gray-600">Real-time delivery, not recordings</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                <Users className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Small Cohorts</h3>
                <p className="text-sm text-gray-600">8-25 participants for real interaction</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                <Monitor className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Hands-On Labs</h3>
                <p className="text-sm text-gray-600">Code along with real exercises</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                <MessageSquare className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Post-Support</h3>
                <p className="text-sm text-gray-600">2 weeks of follow-up assistance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timezone Flexibility */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-primary-50 rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Your Timezone, Your Schedule
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  We deliver across every major timezone — IST, GST, CET, GMT, EST, PST, and
                  everything in between. For globally distributed teams, we run multiple cohorts
                  to ensure no one is attending at 2 AM.
                </p>
                <div className="space-y-3">
                  {[
                    { zone: 'IST (UTC+5:30)', region: 'India, Sri Lanka' },
                    { zone: 'GST (UTC+4)', region: 'UAE, Saudi Arabia, GCC' },
                    { zone: 'CET (UTC+1)', region: 'Europe' },
                    { zone: 'EST (UTC-5)', region: 'US East Coast' },
                    { zone: 'PST (UTC-8)', region: 'US West Coast' },
                    { zone: 'EAT (UTC+3)', region: 'East Africa' },
                  ].map((tz) => (
                    <div key={tz.zone} className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      <span className="text-gray-700">
                        <strong>{tz.zone}</strong> — {tz.region}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Tools We Use</h3>
                <div className="space-y-4">
                  {[
                    {
                      tool: 'Microsoft Teams',
                      use: 'Primary delivery for enterprise clients with Teams licenses',
                    },
                    {
                      tool: 'Zoom',
                      use: 'Alternative delivery with breakout room support',
                    },
                    {
                      tool: 'Google Colab / Jupyter',
                      use: 'Hands-on coding labs — no local setup required',
                    },
                    {
                      tool: 'Miro',
                      use: 'Collaborative whiteboarding for strategy sessions',
                    },
                    {
                      tool: 'GitHub / GitLab',
                      use: 'Code repositories and project-based assignments',
                    },
                  ].map((item) => (
                    <div key={item.tool}>
                      <div className="font-medium text-gray-900 text-sm">{item.tool}</div>
                      <div className="text-sm text-gray-600">{item.use}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Past Remote Delivery */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            Proven Remote Delivery Track Record
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
            Since 2020, we have delivered hundreds of hours of live virtual AI training to
            teams across multiple continents.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { metric: '500+', label: 'Hours of Live Remote Training' },
              { metric: '2,000+', label: 'Professionals Trained Remotely' },
              { metric: '15+', label: 'Countries Served' },
              { metric: '4.8/5', label: 'Average Session Rating' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100"
              >
                <div className="text-3xl font-bold text-primary-600 mb-2">{stat.metric}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-12 max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Industries We Have Served Remotely
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  'Banking & Finance',
                  'IT Services',
                  'Oil & Gas',
                  'Government',
                  'Healthcare',
                  'Manufacturing',
                  'Telecommunications',
                  'Retail & E-commerce',
                  'Education',
                ].map((industry) => (
                  <div
                    key={industry}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0" />
                    {industry}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            What We Deliver Remotely
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Training Programs</h3>
              <p className="text-gray-600 mb-4">
                From executive AI literacy to hands-on prompt engineering, LLM development,
                and agentic AI systems. Multi-session programs with homework and assessments.
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
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Strategy Workshops</h3>
              <p className="text-gray-600 mb-4">
                Virtual strategy sessions with your leadership team. AI readiness assessment,
                opportunity mapping, and roadmap creation — all delivered interactively via
                video conferencing.
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
              <h3 className="text-xl font-bold text-gray-900 mb-3">Remote PoC Support</h3>
              <p className="text-gray-600 mb-4">
                Collaborative proof-of-concept development with your team over video calls and
                shared code repositories. Weekly sprint reviews and daily async updates.
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
            Ready for Live AI Training — From Anywhere?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Book a free discovery call and we&apos;ll design a remote training program
            tailored to your team&apos;s needs and timezone.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://calendly.com/gennoortech"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-50 transition-colors"
            >
              <Calendar className="w-5 h-5" />
              Book a Call
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-white border-2 border-white/30 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
