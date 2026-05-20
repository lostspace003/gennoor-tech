import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, Clock, Users, Monitor, Code, HelpCircle, ArrowRight, Award, Cpu, Search, FileText } from 'lucide-react';
import PageHero from '@/components/shared/PageHero';
import PageCTA from '@/components/shared/PageCTA';

export const metadata: Metadata = {
  title: 'Azure AI Foundry Workshop — Hands-On Enterprise AI Development | Gennoor Tech',
  description:
    'Intensive 2-day Azure AI Foundry workshop covering Azure OpenAI, AI Search, Document Intelligence, and enterprise AI development patterns. Led by MCT Jalal Ahmed Khan with hands-on labs.',
  keywords: [
    'Azure AI Foundry',
    'Azure AI workshop',
    'Azure OpenAI training',
    'Azure AI Search',
    'Document Intelligence',
    'enterprise AI development',
    'Azure AI Studio',
    'RAG pattern training',
    'AI Foundry workshop',
  ],
  openGraph: {
    title: 'Azure AI Foundry Workshop — Hands-On Enterprise AI Development',
    description:
      'Intensive 2-day workshop covering Azure OpenAI, AI Search, Document Intelligence, and enterprise AI patterns. Led by MCT Jalal Ahmed Khan.',
    url: 'https://gennoor.com/services/azure-ai-foundry-workshop',
    siteName: 'Gennoor Tech',
    type: 'website',
  },
};

const modules = [
  {
    number: '01',
    title: 'Azure AI Foundry Platform Overview',
    description:
      'Navigate the Azure AI Foundry portal (formerly Azure AI Studio), understand the project and hub architecture, and configure your development environment. Set up connections to Azure OpenAI, AI Search, and storage accounts.',
  },
  {
    number: '02',
    title: 'Azure OpenAI Service — Models and Deployments',
    description:
      'Deploy and configure GPT-4o, GPT-4, and embedding models. Understand model selection, token management, rate limiting, and content filtering. Build your first chat completion application with the Azure OpenAI SDK.',
  },
  {
    number: '03',
    title: 'Prompt Engineering and Orchestration',
    description:
      'Master prompt engineering techniques including system messages, few-shot learning, chain-of-thought reasoning, and structured outputs. Build prompt flows for complex multi-step orchestration scenarios.',
  },
  {
    number: '04',
    title: 'Azure AI Search — Building the Knowledge Layer',
    description:
      'Create search indexes, configure skillsets for AI enrichment, implement vector search with embeddings, and build hybrid search solutions. This module forms the foundation for RAG implementations.',
  },
  {
    number: '05',
    title: 'Retrieval Augmented Generation (RAG) Patterns',
    description:
      'Build end-to-end RAG solutions combining Azure OpenAI with AI Search. Implement chunking strategies, embedding pipelines, semantic ranking, and grounded generation with source citations.',
  },
  {
    number: '06',
    title: 'Azure AI Document Intelligence',
    description:
      'Extract structured data from documents, invoices, receipts, and custom forms. Build document processing pipelines that feed into your AI solutions. Train custom extraction models for domain-specific documents.',
  },
  {
    number: '07',
    title: 'Security, Networking, and Responsible AI',
    description:
      'Implement managed identities, private endpoints, and virtual network integration. Configure content safety filters, implement responsible AI monitoring, and build guardrails into production AI systems.',
  },
  {
    number: '08',
    title: 'Production Architecture and Deployment',
    description:
      'Design production-ready architectures with high availability, disaster recovery, and cost optimization. Deploy solutions using Azure Container Apps, API Management, and CI/CD pipelines. Implement evaluation and monitoring.',
  },
];

const technologies = [
  { name: 'Azure OpenAI Service', description: 'GPT-4o, GPT-4, embeddings, DALL-E' },
  { name: 'Azure AI Search', description: 'Vector search, semantic ranking, skillsets' },
  { name: 'Azure AI Document Intelligence', description: 'Document extraction and custom models' },
  { name: 'Azure AI Foundry', description: 'Project management and prompt flow orchestration' },
  { name: 'Azure AI Content Safety', description: 'Content moderation and filtering' },
  { name: 'Azure Container Apps', description: 'Serverless deployment for AI applications' },
];

const faqData = [
  {
    question: 'Who is this Azure AI Foundry workshop designed for?',
    answer:
      'This workshop is designed for software developers, solution architects, and technical leads who want to build enterprise AI solutions on Azure. Participants should have basic Azure experience and programming proficiency in Python or C#. Experience with REST APIs is expected.',
  },
  {
    question: 'What is the workshop format and duration?',
    answer:
      'The workshop is an intensive 2-day hands-on program delivered either on-site or virtually via Microsoft Teams. Each day runs approximately 8 hours with a mix of instructor demonstrations, guided labs, and independent exercises. The ratio is roughly 40% instruction and 60% hands-on work.',
  },
  {
    question: 'Do participants need their own Azure subscriptions?',
    answer:
      'For corporate training, we recommend the organization provide Azure subscriptions with pre-configured permissions. For public sessions, we provide lab environments. Participants should have a laptop with VS Code, Python 3.10+, and the Azure CLI installed.',
  },
  {
    question: 'How does this workshop differ from Microsoft Learn modules?',
    answer:
      'While Microsoft Learn provides excellent foundational content, this workshop focuses on production-grade patterns and real-world architecture decisions. You will build a complete enterprise RAG solution end-to-end, learn from an MCT who has implemented these solutions in production, and get personalized guidance on your specific use cases.',
  },
  {
    question: 'Does this workshop help with AI-103 certification preparation?',
    answer:
      'Yes. The workshop covers the AI-103 (Developing AI Apps and Agents on Azure) exam objectives — Microsoft Foundry, the Foundry Agent Service, generative AI, RAG patterns, Document Intelligence in Foundry Tools, and responsible AI. Combined with our AI-103 study guide, this hands-on experience provides excellent exam preparation. AI-103 replaces AI-102, which retires on June 30, 2026.',
  },
];

export default function AzureAIFoundryWorkshopPage() {
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
    name: 'Azure AI Foundry Workshop',
    description:
      'Intensive 2-day hands-on workshop covering Azure OpenAI, AI Search, Document Intelligence, and enterprise AI development patterns on the Azure AI Foundry platform.',
    provider: {
      '@type': 'Organization',
      name: 'Gennoor Tech',
      url: 'https://gennoor.com',
    },
    serviceType: 'Technical Workshop',
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

      <PageHero
        eyebrow="Workshop"
        breadcrumbs={[
          { label: 'Services', href: '/services' },
          { label: 'Azure AI Foundry Workshop' },
        ]}
        title="Azure AI Foundry Workshop — Hands-On Enterprise AI Development"
        description="An intensive 2-day workshop where developers and architects build production-grade AI solutions using Azure OpenAI, AI Search, Document Intelligence, and the Azure AI Foundry platform. All code, all hands-on, all real."
        meta={[
          { icon: Clock, label: '2 Days Intensive' },
          { icon: Monitor, label: 'Live / Virtual' },
          { icon: Code, label: '60% Hands-On Labs' },
          { icon: Award, label: 'MCT-Led' },
        ]}
        ctas={[
          { label: 'Book Workshop', href: '/contact#book' },
          { label: 'View AI-103 Study Guide', href: '/guides/ai-103-azure-ai-engineer', variant: 'ghost' },
        ]}
      />

      {/* Workshop Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Workshop Overview</h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            Azure AI Foundry (formerly Azure AI Studio) is Microsoft&apos;s unified platform for
            building enterprise AI solutions. This workshop gives your technical team the hands-on
            experience they need to go from zero to production-ready AI applications in two
            intensive days.
          </p>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Unlike passive training where participants watch demonstrations, this workshop is built
            around building. Every module includes guided labs where participants write real code,
            configure real Azure resources, and solve real architectural challenges. By the end of
            day two, every participant will have built a complete enterprise RAG solution with
            document processing, vector search, and grounded chat — ready to adapt for their own
            use cases.
          </p>
        </div>
      </section>

      {/* Technologies Covered */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Technologies Covered</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {technologies.map((tech, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm flex items-start gap-4">
                <div className="bg-primary-50 rounded-lg p-2">
                  {index === 0 && <Cpu className="w-6 h-6 text-primary-600" />}
                  {index === 1 && <Search className="w-6 h-6 text-primary-600" />}
                  {index === 2 && <FileText className="w-6 h-6 text-primary-600" />}
                  {index === 3 && <Code className="w-6 h-6 text-primary-600" />}
                  {index === 4 && <CheckCircle className="w-6 h-6 text-primary-600" />}
                  {index === 5 && <Monitor className="w-6 h-6 text-primary-600" />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{tech.name}</h3>
                  <p className="text-gray-600 text-sm">{tech.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Who This Workshop Is For</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-100 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Code className="w-5 h-5 text-primary-600" />
                Software Developers
              </h3>
              <p className="text-gray-600 text-sm">
                Developers who want to add AI capabilities to their applications. You will learn to
                integrate Azure OpenAI APIs, build RAG pipelines, and implement document processing
                in your existing tech stack using Python or C#.
              </p>
            </div>
            <div className="border border-gray-100 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-600" />
                Solution Architects
              </h3>
              <p className="text-gray-600 text-sm">
                Architects designing AI solutions for enterprise clients. Gain hands-on experience
                with production architecture patterns, security configurations, and scaling strategies
                to make informed design decisions.
              </p>
            </div>
            <div className="border border-gray-100 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-primary-600" />
                AI/ML Engineers
              </h3>
              <p className="text-gray-600 text-sm">
                AI engineers expanding from open-source models to Azure&apos;s managed AI platform.
                Learn the Azure-specific patterns for deploying, monitoring, and optimizing AI
                solutions at enterprise scale.
              </p>
            </div>
            <div className="border border-gray-100 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary-600" />
                Technical Leads
              </h3>
              <p className="text-gray-600 text-sm">
                Technical leads evaluating Azure AI for their organizations. Get the hands-on
                understanding needed to make technology decisions, estimate effort, and guide your
                teams through AI implementation projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Workshop Curriculum</h2>
          <p className="text-lg text-gray-600 mb-8">
            Eight modules across two days, progressing from platform fundamentals to production-ready
            enterprise AI architectures.
          </p>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 bg-primary-50 px-4 py-2 rounded-lg">
              Day 1 — Foundations and Core Services
            </h3>
            <div className="space-y-4">
              {modules.slice(0, 4).map((module) => (
                <div
                  key={module.number}
                  className="border border-gray-100 bg-white rounded-xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-primary-50 text-primary-700 rounded-lg px-3 py-1 font-bold text-sm">
                      {module.number}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{module.title}</h4>
                      <p className="text-gray-600 text-sm">{module.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 bg-primary-50 px-4 py-2 rounded-lg">
              Day 2 — Advanced Patterns and Production
            </h3>
            <div className="space-y-4">
              {modules.slice(4).map((module) => (
                <div
                  key={module.number}
                  className="border border-gray-100 bg-white rounded-xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-primary-50 text-primary-700 rounded-lg px-3 py-1 font-bold text-sm">
                      {module.number}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{module.title}</h4>
                      <p className="text-gray-600 text-sm">{module.description}</p>
                    </div>
                  </div>
                </div>
              ))}
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

      <PageCTA
        title="Ready to Build Enterprise AI on Azure?"
        description="Book an Azure AI Foundry workshop for your development team. Two intensive days of hands-on learning that accelerates your team's ability to deliver production AI solutions."
        ctas={[
          { label: 'Book Workshop', href: '/contact#book' },
          { label: 'View AI-103 Study Guide', href: '/guides/ai-103-azure-ai-engineer', variant: 'ghost' },
        ]}
      />
    </>
  );
}
