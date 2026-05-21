import { Metadata } from 'next';
import Link from 'next/link';
import PageCTA from '@/components/shared/PageCTA';
import {
  Calendar,
  CheckCircle,
  GraduationCap,
  Target,
  Shield,
  Users,
  Building2,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Training in Saudi Arabia — Vision 2030 Aligned | Gennoor Tech',
  description:
    'Expert AI training and consulting in Saudi Arabia. Aligned with Vision 2030 and SDAIA frameworks. Trained teams at MCIT and worked with Aramco. Enterprise AI strategy, training, and PoC development.',
  keywords: [
    'AI training Saudi Arabia',
    'artificial intelligence training Riyadh',
    'AI consulting Saudi Arabia',
    'Vision 2030 AI',
    'SDAIA AI framework',
    'enterprise AI Saudi',
    'Gennoor Tech Saudi Arabia',
  ],
  openGraph: {
    title: 'AI Training & Consulting in Saudi Arabia | Gennoor Tech',
    description:
      'Vision 2030-aligned AI training for Saudi enterprises. Real experience with MCIT and Aramco.',
    url: 'https://gennoor.com/services/ai-training-saudi-arabia',
    type: 'website',
  },
  alternates: {
    canonical: 'https://gennoor.com/services/ai-training-saudi-arabia',
  },
};

const faqs = [
  {
    question: 'Do you deliver AI training on-site in Saudi Arabia?',
    answer:
      'Yes. We regularly travel to Riyadh, Jeddah, and Dammam for in-person training engagements. We also offer hybrid and fully remote delivery options for teams spread across multiple Saudi locations.',
  },
  {
    question: 'How is your training aligned with Saudi Vision 2030?',
    answer:
      'Our programs are designed to support the National Strategy for Data and AI. We map training outcomes to Vision 2030 objectives — digital transformation, workforce upskilling, and building in-house AI capabilities — so your investment directly contributes to national priorities.',
  },
  {
    question: 'Have you worked with Saudi government organizations?',
    answer:
      'Yes. We have trained teams at the Ministry of Communications and Information Technology (MCIT) and have collaborated with Aramco on AI initiatives. Our understanding of government procurement processes and compliance requirements in Saudi Arabia is a core differentiator.',
  },
  {
    question: 'Do you understand SDAIA regulations and data governance?',
    answer:
      'Absolutely. Our training incorporates SDAIA\'s National Data Management Office guidelines, the Personal Data Protection Law (PDPL), and responsible AI frameworks specific to the Kingdom. We help teams build AI solutions that are compliant from day one.',
  },
  {
    question: 'What sectors do you serve in Saudi Arabia?',
    answer:
      'We work across government, oil and gas, financial services, healthcare, and telecommunications. Our sector-specific training modules address the unique AI use cases and regulatory requirements of each industry in the Saudi market.',
  },
  {
    question: 'Can you help us build an internal AI Center of Excellence?',
    answer:
      'Yes. Beyond training, we help organizations establish AI CoEs — defining governance structures, building internal champion networks, and creating sustainable learning pathways so your AI capability grows long after our engagement ends.',
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
  name: 'AI Training & Consulting in Saudi Arabia',
  description:
    'Enterprise AI training aligned with Saudi Vision 2030 and SDAIA frameworks. On-site delivery in Riyadh, Jeddah, and Dammam.',
  provider: {
    '@type': 'Organization',
    name: 'Gennoor Tech',
    url: 'https://gennoor.com',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Saudi Arabia',
  },
  serviceType: 'AI Training and Consulting',
};

export default function AITrainingSaudiArabiaPage() {
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
            Saudi Arabia
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
            AI Training & Consulting
            <br />
            in Saudi Arabia
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto mb-10">
            Vision 2030-aligned programs that build real AI capability within your
            organization — from executive awareness to hands-on engineering.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/contact#book"
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

      {/* Vision 2030 Alignment */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Aligned with Saudi Vision 2030
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Saudi Arabia is making one of the world&apos;s most ambitious bets on artificial
                intelligence. The National Strategy for Data and AI aims to position the Kingdom
                as a global AI leader by 2030 — and that requires a workforce that can build,
                deploy, and govern AI systems responsibly.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our training programs are designed specifically to support this national priority.
                We don&apos;t deliver generic AI courses — we build programs that map to SDAIA
                frameworks, respect local data governance requirements, and address the real-world
                use cases Saudi organizations face.
              </p>
            </div>
            <div className="bg-primary-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                How We Support Vision 2030
              </h3>
              <div className="space-y-4">
                {[
                  'Workforce upskilling aligned with NDMO guidelines',
                  'Responsible AI training incorporating PDPL compliance',
                  'Arabic-language support materials where needed',
                  'Building in-house AI teams to reduce dependency on external vendors',
                  'Sector-specific use cases for Saudi industries',
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

      {/* Real Experience */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            Proven Track Record in Saudi Arabia
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
            We don&apos;t just know AI — we know the Saudi market. Our founder, Jalal Ahmed Khan,
            has personally delivered engagements with leading Saudi organizations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Ministry of Communications & IT (MCIT)
              </h3>
              <p className="text-gray-600">
                Delivered AI training programs for MCIT teams, covering machine learning
                fundamentals, generative AI applications, and responsible AI governance
                practices aligned with national digital transformation objectives.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Aramco</h3>
              <p className="text-gray-600">
                Collaborated on AI initiatives with one of the world&apos;s largest energy
                companies, bringing practical AI strategy and implementation expertise to
                teams working on operational efficiency and predictive analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            Services Available in Saudi Arabia
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Training Programs</h3>
              <p className="text-gray-600 mb-4">
                From executive AI literacy to hands-on prompt engineering and LLM fine-tuning.
                Multi-day workshops and extended cohort programs delivered on-site in Riyadh,
                Jeddah, or Dammam.
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
                Build an AI roadmap that aligns with Vision 2030 objectives and your business
                goals. We assess AI readiness, identify high-value use cases, and create
                actionable implementation plans.
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
                Validate AI ideas with working prototypes before committing to full-scale
                development. We build proof-of-concepts in 4-6 weeks using real data from
                your organization.
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

      {/* Why Gennoor */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            Why Choose Gennoor Tech for Saudi Arabia
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
            Not every AI consultancy understands the Saudi market. We do.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: 'SDAIA & PDPL Expertise',
                description:
                  'Training content incorporates Saudi data protection and AI governance frameworks from the ground up.',
              },
              {
                icon: Building2,
                title: 'Government Experience',
                description:
                  'Direct experience delivering to Saudi government entities. We understand procurement, compliance, and protocol.',
              },
              {
                icon: Users,
                title: 'Cultural Understanding',
                description:
                  'We have worked extensively in the Saudi market and understand business culture, communication norms, and local expectations.',
              },
              {
                icon: Target,
                title: 'Vision 2030 Mapping',
                description:
                  'Every program is mapped to national AI strategy objectives so you can report upward on ROI and national contribution.',
              },
              {
                icon: GraduationCap,
                title: 'Hands-On, Not Theoretical',
                description:
                  'Participants build real AI solutions during training — using their own data and use cases wherever possible.',
              },
              {
                icon: Lightbulb,
                title: 'Post-Training Support',
                description:
                  'We stay engaged after the workshop. Participants get access to follow-up sessions and ongoing technical guidance.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center mb-3">
                  <item.icon className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
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
        title="Ready to Build AI Capability in Saudi Arabia?"
        description="Let's discuss how we can support your Vision 2030 AI objectives with practical, results-driven training."
        ctas={[
          { label: 'Book a Call', href: '/contact#book' },
          { label: 'Contact Us', href: '/contact', variant: 'ghost' },
        ]}
      />
    </>
  );
}
