import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, CheckCircle, Clock, Award, Target, Lightbulb, HelpCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Azure AI-102 Certification: Complete Study Guide 2026 | Gennoor Tech',
  description:
    'Comprehensive AI-102 Azure AI Engineer Associate study guide for 2026. Exam overview, skills measured, study resources, and expert tips from Microsoft Certified Trainer Jalal Ahmed Khan.',
  keywords: [
    'AI-102',
    'Azure AI Engineer',
    'AI-102 study guide',
    'Azure AI certification',
    'Microsoft AI certification 2026',
    'Azure Cognitive Services',
    'Azure OpenAI certification',
    'AI-102 exam prep',
  ],
  openGraph: {
    title: 'Azure AI-102 Certification: Complete Study Guide 2026',
    description:
      'Master the AI-102 exam with this comprehensive guide. Skills measured, study resources, and expert tips from an MCT with 16 certifications.',
    url: 'https://gennoor.com/guides/ai-102-azure-ai-engineer',
    siteName: 'Gennoor Tech',
    type: 'article',
  },
};

const faqData = [
  {
    question: 'What is the AI-102 Azure AI Engineer Associate certification?',
    answer:
      'The AI-102 is a Microsoft certification that validates your skills in designing and implementing Azure AI solutions. It covers Azure AI services including Azure OpenAI Service, Azure AI Search, Document Intelligence, and custom AI solutions using Azure AI Studio and SDKs.',
  },
  {
    question: 'What are the prerequisites for the AI-102 exam?',
    answer:
      'Microsoft recommends familiarity with C# or Python, experience using REST APIs, and knowledge of Azure fundamentals. While not required, having passed the AZ-900 or AI-900 exam provides a solid foundation. Practical experience building AI solutions on Azure is highly beneficial.',
  },
  {
    question: 'How much does the AI-102 exam cost and how long is it?',
    answer:
      'The AI-102 exam costs approximately USD $165 (pricing varies by region). The exam duration is 120 minutes, and it typically contains 40-60 questions including multiple choice, drag-and-drop, case studies, and lab-based scenarios. A passing score is 700 out of 1000.',
  },
  {
    question: 'Is the AI-102 certification worth it in 2026?',
    answer:
      'Absolutely. With enterprises rapidly adopting Azure AI and OpenAI services, the AI-102 certification validates in-demand skills. Certified Azure AI Engineers command higher salaries, and the credential demonstrates practical expertise that employers actively seek for AI transformation projects.',
  },
  {
    question: 'How long does it take to prepare for the AI-102 exam?',
    answer:
      'Preparation time varies based on experience. For someone with Azure fundamentals and programming experience, 6-8 weeks of focused study is typical. With structured training from a Microsoft Certified Trainer, many candidates feel exam-ready in 3-4 weeks of dedicated preparation.',
  },
];

export default function AI102StudyGuidePage() {
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

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Azure AI-102 Certification: Complete Study Guide 2026',
    author: {
      '@type': 'Person',
      name: 'Jalal Ahmed Khan',
      jobTitle: 'Microsoft Certified Trainer',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Gennoor Tech',
      url: 'https://gennoor.com',
    },
    datePublished: '2026-01-15',
    dateModified: '2026-03-23',
    description:
      'Comprehensive AI-102 Azure AI Engineer Associate study guide covering exam overview, skills measured, study resources, and expert preparation tips.',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-primary-100 mb-4">
            <Link href="/guides" className="hover:text-white transition-colors">
              Guides
            </Link>
            <span>/</span>
            <span>AI-102</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6">
            Azure AI-102 Certification: Complete Study Guide 2026
          </h1>
          <p className="text-xl text-primary-100 mb-8 leading-relaxed">
            Everything you need to pass the AI-102 Azure AI Engineer Associate exam — from skills
            measured to study strategies, written by a Microsoft Certified Trainer with 16
            certifications.
          </p>
          <div className="flex flex-wrap gap-6 text-primary-100">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>15 min read</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              <span>Updated March 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span>Expert Guide</span>
            </div>
          </div>
        </div>
      </section>

      {/* Exam Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Exam Overview</h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            The AI-102: Designing and Implementing a Microsoft Azure AI Solution exam validates your
            ability to build, manage, and deploy AI solutions that leverage Azure AI services. This
            certification is designed for AI engineers who use Azure AI services, Azure AI Search,
            and Azure OpenAI to build intelligent solutions.
          </p>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            As someone who has trained hundreds of professionals for this exam, I can tell you that
            AI-102 is one of the most practical and rewarding Microsoft certifications available
            today. The exam closely mirrors real-world scenarios you will encounter when building
            enterprise AI solutions on Azure.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-primary-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Exam Details</h3>
              <ul className="space-y-2 text-gray-600">
                <li><strong>Exam Code:</strong> AI-102</li>
                <li><strong>Certification:</strong> Azure AI Engineer Associate</li>
                <li><strong>Duration:</strong> 120 minutes</li>
                <li><strong>Questions:</strong> 40-60 questions</li>
                <li><strong>Passing Score:</strong> 700/1000</li>
                <li><strong>Cost:</strong> ~USD $165</li>
                <li><strong>Languages:</strong> English, Japanese, Chinese, Korean</li>
              </ul>
            </div>
            <div className="bg-accent-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Who Should Take This Exam</h3>
              <ul className="space-y-2 text-gray-600">
                <li>AI Engineers and Solution Architects</li>
                <li>Developers building AI-powered applications</li>
                <li>Data professionals transitioning to AI</li>
                <li>Cloud architects adding AI capabilities</li>
                <li>Technical leads overseeing AI projects</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Measured */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Skills Measured</h2>
          <p className="text-lg text-gray-600 mb-8">
            The AI-102 exam measures your competency across five key domains. Understanding the
            weight of each domain helps you prioritize your study time effectively.
          </p>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="bg-primary-100 text-primary-700 rounded-lg p-2 font-bold text-sm min-w-[60px] text-center">
                  15-20%
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Plan and Manage an Azure AI Solution
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Select the appropriate Azure AI service, plan and configure security for AI
                    services, create and manage Azure AI resources, and implement responsible AI
                    practices.
                  </p>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Azure AI services resource configuration and networking
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Diagnostic logging and cost management
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Managed identities and key vault integration
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="bg-primary-100 text-primary-700 rounded-lg p-2 font-bold text-sm min-w-[60px] text-center">
                  15-20%
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Implement Content Moderation Solutions
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Analyze text and images for harmful content, implement Azure AI Content Safety,
                    and build content moderation pipelines.
                  </p>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Azure AI Content Safety for text and image analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Custom content filtering categories
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Moderation workflows and escalation paths
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="bg-primary-100 text-primary-700 rounded-lg p-2 font-bold text-sm min-w-[60px] text-center">
                  15-20%
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Implement Computer Vision Solutions
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Analyze images using Azure AI Vision, implement custom vision models, analyze
                    videos, and work with spatial analysis and face detection.
                  </p>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Image analysis with Azure AI Vision 4.0
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Custom image classification and object detection
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Optical character recognition (OCR) solutions
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="bg-primary-100 text-primary-700 rounded-lg p-2 font-bold text-sm min-w-[60px] text-center">
                  20-25%
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Implement Natural Language Processing Solutions
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Analyze text with Azure AI Language, build conversational AI with question
                    answering, implement language understanding (CLU), translation, and speech
                    services.
                  </p>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Conversational language understanding (CLU)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Custom named entity recognition and text classification
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Azure AI Speech (speech-to-text, text-to-speech, translation)
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="bg-primary-100 text-primary-700 rounded-lg p-2 font-bold text-sm min-w-[60px] text-center">
                  15-20%
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Implement Generative AI Solutions
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Build solutions with Azure OpenAI Service, implement retrieval augmented
                    generation (RAG) with Azure AI Search, and manage prompt engineering.
                  </p>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Azure OpenAI Service deployment and configuration
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      RAG pattern with Azure AI Search integration
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Prompt engineering and token management
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Study Resources */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Recommended Study Resources</h2>
          <p className="text-lg text-gray-600 mb-8">
            After training over 500 professionals for this exam, here are the resources I recommend
            combining for the most effective preparation.
          </p>

          <div className="space-y-6">
            <div className="border border-gray-100 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-600" />
                Microsoft Learn — Official Learning Paths
              </h3>
              <p className="text-gray-600 mb-2">
                Start with the official Microsoft Learn modules for AI-102. These free learning
                paths cover every exam objective with hands-on exercises using sandbox environments.
                Complete all modules in the &quot;Prepare for Exam AI-102&quot; collection.
              </p>
            </div>

            <div className="border border-gray-100 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-600" />
                Hands-On Labs in Azure Portal
              </h3>
              <p className="text-gray-600 mb-2">
                Nothing replaces hands-on experience. Use an Azure free account or trial
                subscription to build solutions with Azure AI services. Deploy an Azure OpenAI
                resource, build a RAG solution with AI Search, and configure Document Intelligence
                — these scenarios appear frequently on the exam.
              </p>
            </div>

            <div className="border border-gray-100 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-600" />
                Instructor-Led Training
              </h3>
              <p className="text-gray-600 mb-2">
                A structured training program with a Microsoft Certified Trainer accelerates your
                preparation significantly. My{' '}
                <Link
                  href="/services/training"
                  className="text-primary-600 hover:text-primary-700 underline"
                >
                  AI-102 training sessions
                </Link>{' '}
                cover every exam domain with real-world case studies, hands-on labs, and exam
                strategy discussions that go beyond what self-study materials offer.
              </p>
            </div>

            <div className="border border-gray-100 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-600" />
                Practice Assessments
              </h3>
              <p className="text-gray-600 mb-2">
                Use the official Microsoft Practice Assessment for AI-102 (free on Microsoft Learn).
                Take it multiple times to identify knowledge gaps. Supplement with the
                MeasureUp practice test, which closely mirrors the actual exam format and
                difficulty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Exam Tips */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Expert Exam Tips from an MCT
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Having helped hundreds of candidates pass AI-102, here are the strategies that
            consistently make the difference between passing and falling short.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Lightbulb className="w-6 h-6 text-primary-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Focus on Azure OpenAI and RAG</h3>
              <p className="text-gray-600 text-sm">
                The generative AI section is heavily tested and continues to grow in weight. Know
                how to configure Azure OpenAI deployments, implement RAG patterns with AI Search,
                and manage token limits and content filters.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Lightbulb className="w-6 h-6 text-primary-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Know the SDK Patterns</h3>
              <p className="text-gray-600 text-sm">
                You will see code snippets in both Python and C#. Understand the client libraries
                for Azure AI services — how to initialize clients, make API calls, and handle
                responses. You do not need to memorize syntax, but you must recognize correct
                patterns.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Lightbulb className="w-6 h-6 text-primary-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Understand Security Models</h3>
              <p className="text-gray-600 text-sm">
                Questions on managed identities, private endpoints, and Key Vault integration appear
                consistently. Know when to use API keys versus Azure AD authentication, and how to
                secure AI services in a virtual network.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Lightbulb className="w-6 h-6 text-primary-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Master Responsible AI</h3>
              <p className="text-gray-600 text-sm">
                Microsoft takes responsible AI seriously in the exam. Understand transparency notes,
                content filtering in Azure OpenAI, fairness considerations, and when specific AI
                services require additional access approval.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Lightbulb className="w-6 h-6 text-primary-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Time Management Strategy</h3>
              <p className="text-gray-600 text-sm">
                With 40-60 questions in 120 minutes, you have roughly 2-3 minutes per question. Flag
                difficult questions and return to them. Case study sections take longer — budget 15-20
                minutes per case study and tackle them first while your mind is fresh.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Lightbulb className="w-6 h-6 text-primary-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Lab Questions Are Critical</h3>
              <p className="text-gray-600 text-sm">
                Lab-based questions test real skills in the Azure portal. Practice creating and
                configuring AI resources, building search indexes, and deploying models. These
                questions carry significant weight and cannot be guessed.
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
          <h2 className="text-3xl font-bold mb-4">Ready to Pass the AI-102 Exam?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Get expert-led AI-102 preparation training from a Microsoft Certified Trainer with
            real-world Azure AI project experience and a proven track record of helping candidates
            succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact#book"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
            >
              Book AI-102 Training
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/about/founder"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors"
            >
              View Trainer Credentials
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
