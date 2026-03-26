import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, Clock, Users, Target, HelpCircle, ArrowRight, Award, Briefcase, FileCheck, MapPin, Lightbulb, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Enterprise AI Roadmap Workshop — From Strategy to Implementation | Gennoor Tech',
  description:
    'One-day intensive AI strategy workshop for C-suite and IT leaders. Deliverables include AI readiness assessment, prioritized use cases, and a 90-day action plan. Led by MCT Jalal Ahmed Khan.',
  keywords: [
    'enterprise AI strategy',
    'AI roadmap workshop',
    'AI readiness assessment',
    'AI strategy for executives',
    'enterprise AI adoption',
    'AI use case prioritization',
    'AI implementation plan',
    'Microsoft AI strategy',
    'digital transformation AI',
  ],
  openGraph: {
    title: 'Enterprise AI Roadmap Workshop — From Strategy to Implementation',
    description:
      'One-day intensive AI strategy workshop for C-suite and IT leaders. Get an AI readiness assessment, prioritized use cases, and 90-day action plan.',
    url: 'https://gennoor.com/services/enterprise-ai-roadmap-workshop',
    siteName: 'Gennoor Tech',
    type: 'website',
  },
};

const deliverables = [
  {
    icon: FileCheck,
    title: 'AI Readiness Assessment',
    description:
      'A comprehensive evaluation of your organization\'s current AI readiness across five dimensions: data maturity, technology infrastructure, talent and skills, governance and ethics, and organizational culture. Each dimension receives a maturity score with specific recommendations.',
  },
  {
    icon: Target,
    title: 'Prioritized Use Case Portfolio',
    description:
      'A scored and prioritized list of 10-15 AI use cases specific to your organization, evaluated by business impact, technical feasibility, data availability, and implementation risk. Includes quick wins for immediate value and strategic bets for long-term transformation.',
  },
  {
    icon: MapPin,
    title: '90-Day Action Plan',
    description:
      'A concrete, week-by-week implementation plan covering your top 3 priority use cases. Includes technology selections, team requirements, budget estimates, success metrics, and governance checkpoints. Designed to be immediately actionable.',
  },
  {
    icon: TrendingUp,
    title: 'Business Case Framework',
    description:
      'A customized business case template for presenting AI investments to the board, including ROI projections, risk mitigation strategies, and benchmark data from comparable organizations in your industry.',
  },
];

const agendaItems = [
  {
    time: '9:00 - 10:30',
    title: 'AI Landscape and Opportunity Assessment',
    description:
      'We begin with an overview of the current enterprise AI landscape, focusing on proven technologies and real ROI data — not hype. Then we assess your organization\'s current state across key AI readiness dimensions using our structured framework.',
  },
  {
    time: '10:45 - 12:30',
    title: 'Use Case Discovery and Prioritization',
    description:
      'Through facilitated exercises, we identify AI use cases specific to your business processes, customer interactions, and operational workflows. Each use case is scored on a 2x2 matrix of business impact versus implementation feasibility.',
  },
  {
    time: '13:30 - 15:00',
    title: 'Technology Architecture and Platform Decisions',
    description:
      'We map your prioritized use cases to specific technology solutions — Microsoft Copilot, Azure OpenAI, custom AI applications, and automation platforms. Discuss build vs. buy decisions, vendor evaluation, and integration with existing systems.',
  },
  {
    time: '15:15 - 17:00',
    title: 'Roadmap Construction and 90-Day Planning',
    description:
      'We construct your AI implementation roadmap with clear phases, milestones, and resource requirements. The session concludes with a detailed 90-day action plan for your top priority use cases, including team structure and governance model.',
  },
];

const faqData = [
  {
    question: 'Who should attend the Enterprise AI Roadmap Workshop?',
    answer:
      'This workshop is designed for C-suite executives (CEO, CTO, CIO, CDO), VP-level IT and digital transformation leaders, and senior managers responsible for AI strategy and adoption. We recommend 6-12 participants from across business and technology functions to ensure diverse perspectives and organizational buy-in.',
  },
  {
    question: 'What makes this workshop different from typical AI consulting?',
    answer:
      'Unlike traditional consulting engagements that take weeks and deliver a deck, this is a single intensive day that produces actionable deliverables. You leave with a concrete plan, not a 100-page report. As a Microsoft Certified Trainer with hands-on implementation experience, I bridge the gap between strategy and technical reality — every recommendation is grounded in what actually works.',
  },
  {
    question: 'Do we need technical knowledge to participate?',
    answer:
      'No. The workshop is designed for business leaders and is conducted in business language, not technical jargon. I translate complex AI concepts into business impact terms. Technical staff are welcome and add value to the technology architecture discussion, but the workshop is accessible to non-technical executives.',
  },
  {
    question: 'What do we need to prepare before the workshop?',
    answer:
      'Two weeks before the workshop, I will send a brief pre-assessment questionnaire covering your current technology stack, data assets, strategic priorities, and any AI initiatives already underway. This allows me to customize the workshop content and come prepared with industry-specific use cases relevant to your organization.',
  },
  {
    question: 'Can this workshop be delivered virtually?',
    answer:
      'Yes, though I recommend on-site delivery for maximum engagement and collaboration. For virtual delivery, we use Microsoft Teams with interactive whiteboarding (Miro or Microsoft Whiteboard), breakout rooms for small group exercises, and digital collaboration tools. The experience is highly interactive regardless of format.',
  },
];

export default function EnterpriseAIRoadmapWorkshopPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((faq) => ({
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
    name: 'Enterprise AI Roadmap Workshop',
    description:
      'One-day intensive AI strategy workshop for C-suite and IT leaders. Deliverables include AI readiness assessment, prioritized use cases, and a 90-day action plan.',
    provider: {
      '@type': 'Organization',
      name: 'Gennoor Tech',
      url: 'https://gennoor.com',
    },
    serviceType: 'Strategic Consulting Workshop',
    areaServed: 'Worldwide',
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'USD',
    },
  };

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

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-primary-100 mb-4">
            <Link href="/services" className="hover:text-white transition-colors">
              Services
            </Link>
            <span>/</span>
            <span>Enterprise AI Roadmap</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6">
            Enterprise AI Roadmap Workshop — From Strategy to Implementation
          </h1>
          <p className="text-xl text-primary-100 mb-8 leading-relaxed">
            A one-day intensive workshop that transforms AI ambiguity into a clear, actionable
            implementation plan. Designed for C-suite executives and IT leaders who need to move
            beyond AI experimentation into strategic, organization-wide adoption.
          </p>
          <div className="flex flex-wrap gap-6 text-primary-100">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>1-Day Intensive</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              <span>Executive-Level</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>6-12 Participants</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              <span>MCT-Facilitated</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Challenge */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Challenge</h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            Every organization knows AI is important. But moving from awareness to action is where
            most stall. Leadership teams face a flood of AI vendor pitches, conflicting advice, and
            uncertainty about where to start. Pilot projects launch without strategic alignment.
            Valuable budget gets spent on initiatives that never reach production.
          </p>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            This workshop exists because I have seen the pattern repeat across dozens of
            organizations: enthusiasm without direction leads to wasted investment. What leaders
            need is not more information about AI — it is a structured process to translate their
            specific business context into a clear, prioritized, and realistic implementation plan.
            That is exactly what this one-day intensive delivers.
          </p>
        </div>
      </section>

      {/* Deliverables */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What You Walk Away With</h2>
          <p className="text-lg text-gray-600 mb-8">
            Every participant receives these four tangible deliverables within one week of the
            workshop, professionally documented and ready for board-level presentation.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {deliverables.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                  <Icon className="w-8 h-8 text-primary-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Day Agenda */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Workshop Agenda</h2>
          <p className="text-lg text-gray-600 mb-8">
            A structured, facilitated day that moves progressively from assessment through strategy
            to a concrete action plan.
          </p>

          <div className="space-y-6">
            {agendaItems.map((item, index) => (
              <div
                key={index}
                className="border border-gray-100 rounded-xl p-6 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-primary-50 text-primary-700 rounded-lg px-3 py-1 font-bold text-sm whitespace-nowrap">
                    {item.time}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Who This Workshop Is For</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Briefcase className="w-8 h-8 text-primary-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">C-Suite Executives</h3>
              <p className="text-gray-600 text-sm">
                CEOs, CTOs, CIOs, and CDOs who need to set AI strategy for their organizations.
                Gain clarity on where AI delivers real value versus hype, and leave with a plan
                you can confidently present to the board.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Lightbulb className="w-8 h-8 text-primary-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">IT and Digital Leaders</h3>
              <p className="text-gray-600 text-sm">
                VPs of IT, digital transformation directors, and enterprise architects responsible
                for evaluating and implementing AI technologies. Translate business priorities into
                technical architecture decisions.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <TrendingUp className="w-8 h-8 text-primary-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Business Unit Leaders</h3>
              <p className="text-gray-600 text-sm">
                Department heads and senior managers who see AI potential in their operations.
                Identify concrete use cases in your function, understand resource requirements,
                and build the case for investment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Approach */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why This Approach Works</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Practitioner, Not Theorist</h3>
                <p className="text-gray-600 text-sm">
                  This workshop is facilitated by a Microsoft Certified Trainer who builds and
                  deploys AI solutions — not a strategy consultant who only creates slides. Every
                  recommendation is grounded in real implementation experience.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Speed to Action</h3>
                <p className="text-gray-600 text-sm">
                  One day, not three months. Traditional consulting engagements take weeks of
                  interviews and analysis. This workshop compresses that process into an intensive,
                  facilitated day that produces immediately actionable outputs.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Cross-Functional Alignment</h3>
                <p className="text-gray-600 text-sm">
                  By bringing business and technology leaders together in a structured process,
                  the workshop creates organizational alignment that months of email threads and
                  steering committees cannot achieve.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Platform-Informed, Not Locked</h3>
                <p className="text-gray-600 text-sm">
                  While deeply experienced in the Microsoft AI ecosystem, recommendations are
                  driven by your business needs, not vendor partnerships. If an open-source or
                  non-Microsoft solution is the right fit, that is what I will recommend.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <HelpCircle className="w-8 h-8 text-primary-600" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="border border-gray-100 rounded-xl p-6 bg-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-700 to-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Build Your AI Roadmap?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Book an Enterprise AI Roadmap Workshop for your leadership team. One day of focused
            strategy work that saves months of misaligned AI experimentation and delivers a clear
            path from where you are to where you need to be.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact#book"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
            >
              Book Workshop
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/services/training"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
