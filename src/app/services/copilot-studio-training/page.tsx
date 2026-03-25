import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, Clock, Users, Monitor, Zap, HelpCircle, ArrowRight, BookOpen, Target, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Microsoft Copilot Studio Training — Build Enterprise AI Agents | Gennoor Tech',
  description:
    'Hands-on Microsoft Copilot Studio training to build enterprise AI agents and custom copilots. 2-3 day live course covering agent creation, knowledge integration, plugin development, and deployment. Led by MCT Jalal Ahmed Khan.',
  keywords: [
    'Copilot Studio training',
    'Microsoft Copilot Studio',
    'custom copilot development',
    'AI agent training',
    'enterprise AI agents',
    'Copilot Studio course',
    'Power Virtual Agents',
    'Microsoft AI training',
  ],
  openGraph: {
    title: 'Microsoft Copilot Studio Training — Build Enterprise AI Agents',
    description:
      'Hands-on 2-3 day training to build enterprise AI agents with Microsoft Copilot Studio. Led by MCT Jalal Ahmed Khan.',
    url: 'https://gennoor.com/services/copilot-studio-training',
    siteName: 'Gennoor Tech',
    type: 'website',
  },
};

const modules = [
  {
    number: '01',
    title: 'Introduction to Microsoft Copilot Studio',
    description:
      'Understand the Copilot Studio platform, its capabilities, licensing models, and how it fits into the broader Microsoft AI ecosystem. Set up your development environment and create your first copilot.',
  },
  {
    number: '02',
    title: 'Designing Conversational AI Experiences',
    description:
      'Learn conversation design principles, topic creation, trigger phrases, and branching logic. Build multi-turn conversations that handle complex user intents with graceful fallback paths.',
  },
  {
    number: '03',
    title: 'Knowledge Integration and Grounding',
    description:
      'Connect your copilot to enterprise knowledge sources — SharePoint, websites, uploaded documents, and Dataverse. Configure generative answers powered by Azure OpenAI for contextual, grounded responses.',
  },
  {
    number: '04',
    title: 'Building Custom Plugins and Actions',
    description:
      'Extend copilot capabilities with custom plugins using Power Automate flows and custom connectors. Build actions that interact with LOB systems, APIs, and databases to perform real tasks beyond answering questions.',
  },
  {
    number: '05',
    title: 'Authentication, Security, and Governance',
    description:
      'Implement authentication flows with Azure AD, configure data loss prevention policies, manage environment security, and ensure your copilots comply with organizational governance requirements.',
  },
  {
    number: '06',
    title: 'Multi-Channel Deployment',
    description:
      'Deploy copilots across Microsoft Teams, web chat, custom websites, and third-party channels. Configure appearance customization, handoff to live agents, and analytics dashboards.',
  },
  {
    number: '07',
    title: 'Advanced Scenarios and Orchestration',
    description:
      'Build advanced patterns including multi-agent orchestration, autonomous agent capabilities, scheduled triggers, and integration with Microsoft 365 Copilot as a plugin. Explore the agent builder experience.',
  },
  {
    number: '08',
    title: 'Testing, Analytics, and Optimization',
    description:
      'Test copilots systematically, analyze conversation analytics, identify improvement areas, and implement A/B testing for topic variations. Measure ROI and build a continuous improvement process.',
  },
];

const faqData = [
  {
    question: 'Who is this Copilot Studio training designed for?',
    answer:
      'This training is designed for citizen developers, Power Platform developers, IT professionals, and business analysts who want to build custom AI agents and copilots for their organizations. Basic familiarity with Microsoft 365 and the Power Platform is helpful but not required.',
  },
  {
    question: 'Do I need coding experience to take this training?',
    answer:
      'No coding experience is required. Copilot Studio uses a low-code visual interface for building AI agents. However, participants with Power Automate or Power Apps experience will progress faster through the advanced modules on custom plugins and actions.',
  },
  {
    question: 'What is the training format and duration?',
    answer:
      'The training is delivered as a 2-3 day intensive course, available in both live in-person and virtual formats. Each day includes instructor-led demonstrations, hands-on labs, and guided exercises. Virtual sessions use Microsoft Teams with breakout rooms for lab support.',
  },
  {
    question: 'Will we build a working copilot during the training?',
    answer:
      'Yes. By the end of the training, each participant will have built and deployed a fully functional enterprise copilot with knowledge grounding, custom actions, authentication, and multi-channel deployment. We use real business scenarios, not toy examples.',
  },
  {
    question: 'Does this training help with Microsoft certification exams?',
    answer:
      'Yes. The curriculum aligns with the MS-4005 (Craft copilots with Microsoft Copilot Studio) exam objectives. While this training focuses on practical skills, the hands-on experience and conceptual understanding gained provide excellent preparation for the certification.',
  },
];

export default function CopilotStudioTrainingPage() {
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
    name: 'Microsoft Copilot Studio Training',
    description:
      'Hands-on training to build enterprise AI agents and custom copilots using Microsoft Copilot Studio. 2-3 day intensive course led by a Microsoft Certified Trainer.',
    provider: {
      '@type': 'Organization',
      name: 'Gennoor Tech',
      url: 'https://gennoor.com',
    },
    serviceType: 'Professional Training',
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
            <span>Copilot Studio Training</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6">
            Microsoft Copilot Studio Training — Build Enterprise AI Agents
          </h1>
          <p className="text-xl text-primary-100 mb-8 leading-relaxed">
            Hands-on, instructor-led training to build and deploy custom AI agents using Microsoft
            Copilot Studio. Learn to create intelligent copilots that integrate with your
            organizational data and automate business processes.
          </p>
          <div className="flex flex-wrap gap-6 text-primary-100">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>2-3 Days</span>
            </div>
            <div className="flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              <span>Live / Virtual</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>Max 20 Participants</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              <span>MCT-Led</span>
            </div>
          </div>
        </div>
      </section>

      {/* What You Will Learn */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What Participants Learn</h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            This training goes beyond documentation and tutorials. Participants build production-ready
            AI agents from scratch, learning the patterns and practices that separate a proof-of-concept
            from an enterprise-grade solution.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Create custom copilots with the visual Copilot Studio designer',
              'Ground AI responses in organizational knowledge (SharePoint, web, docs)',
              'Build multi-turn conversational experiences with branching logic',
              'Develop custom plugins with Power Automate and connectors',
              'Implement authentication and role-based access control',
              'Deploy copilots to Teams, web chat, and custom channels',
              'Configure generative AI responses with Azure OpenAI',
              'Build autonomous agent workflows with scheduled triggers',
              'Measure copilot performance with built-in analytics',
              'Apply governance and DLP policies for enterprise compliance',
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3">
                <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Who This Training Is For</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Zap className="w-8 h-8 text-primary-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Citizen Developers</h3>
              <p className="text-gray-600 text-sm">
                Business users who want to build AI-powered solutions without deep coding skills.
                Learn to create copilots that automate your team&apos;s most common questions and
                tasks.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Target className="w-8 h-8 text-primary-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Power Platform Developers</h3>
              <p className="text-gray-600 text-sm">
                Developers already working with Power Apps and Power Automate who want to add AI
                agent capabilities to their solutions. Extend existing investments with
                conversational AI.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <BookOpen className="w-8 h-8 text-primary-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">IT Professionals</h3>
              <p className="text-gray-600 text-sm">
                IT teams responsible for evaluating, deploying, and governing AI solutions within
                their organizations. Understand security, compliance, and administration of Copilot
                Studio environments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Training Curriculum</h2>
          <p className="text-lg text-gray-600 mb-8">
            Eight comprehensive modules covering the full Copilot Studio development lifecycle,
            from initial setup to production deployment and optimization.
          </p>

          <div className="space-y-4">
            {modules.map((module) => (
              <div
                key={module.number}
                className="border border-gray-100 rounded-xl p-6 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-primary-50 text-primary-700 rounded-lg px-3 py-1 font-bold text-sm">
                    {module.number}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.title}</h3>
                    <p className="text-gray-600 text-sm">{module.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Real Outcomes from Past Sessions</h2>
          <p className="text-lg text-gray-600 mb-8">
            Participants in my Copilot Studio training sessions have gone on to deliver measurable
            impact in their organizations.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-primary-600">
              <p className="text-gray-600 mb-2">
                A financial services team built an HR FAQ copilot during the training that was
                deployed to production within two weeks of the session, reducing HR ticket volume by
                40%.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-primary-600">
              <p className="text-gray-600 mb-2">
                An IT department created a self-service IT helpdesk agent that handles password
                resets, software requests, and common troubleshooting — saving their team 20 hours
                per week.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-primary-600">
              <p className="text-gray-600 mb-2">
                A sales team deployed a product knowledge copilot grounded in their SharePoint
                documentation, enabling new sales representatives to find answers in seconds instead
                of hours.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-primary-600">
              <p className="text-gray-600 mb-2">
                A government agency built a citizen inquiry agent that handles common questions about
                services and processes, improving response times from days to seconds for routine
                inquiries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <HelpCircle className="w-8 h-8 text-primary-600" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="border border-gray-100 rounded-xl p-6">
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
            Ready to Build AI Agents with Copilot Studio?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Book a Copilot Studio training session for your team. Available as a 2-3 day course
            delivered live on-site or virtually, customized to your organization&apos;s use cases
            and industry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact#book"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
            >
              Book Training Session
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/services/training"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors"
            >
              View All Training Options
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
