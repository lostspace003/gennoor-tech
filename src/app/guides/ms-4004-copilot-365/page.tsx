import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, CheckCircle, Clock, Award, Target, Lightbulb, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'MS-4004 Microsoft 365 Copilot: Exam Prep Guide 2026 | Gennoor Tech',
  description:
    'Comprehensive MS-4004 Microsoft 365 Copilot exam preparation guide for 2026. Exam overview, skills measured, study resources, and expert tips from Microsoft Certified Trainer Jalal Ahmed Khan.',
  keywords: [
    'MS-4004',
    'Microsoft 365 Copilot',
    'Copilot certification',
    'MS-4004 study guide',
    'Microsoft Copilot exam prep',
    'M365 Copilot certification 2026',
    'Copilot for Microsoft 365',
    'AI productivity certification',
  ],
  openGraph: {
    title: 'MS-4004 Microsoft 365 Copilot: Exam Prep Guide 2026',
    description:
      'Master the MS-4004 exam with this comprehensive guide. Skills measured, study resources, and expert tips from an MCT with 16 certifications.',
    url: 'https://gennoor.com/guides/ms-4004-copilot-365',
    siteName: 'Gennoor Tech',
    type: 'article',
  },
};

const faqData = [
  {
    question: 'What is the MS-4004 Microsoft 365 Copilot exam?',
    answer:
      'MS-4004 is a Microsoft certification exam that validates your ability to empower workforce productivity using Microsoft 365 Copilot. It covers how to craft effective prompts, use Copilot across Microsoft 365 apps (Word, Excel, PowerPoint, Outlook, Teams), and understand how Copilot leverages organizational data through Microsoft Graph to generate contextual responses.',
  },
  {
    question: 'Who should take the MS-4004 exam?',
    answer:
      'MS-4004 is designed for business users, knowledge workers, IT professionals, and productivity consultants who want to demonstrate their expertise in using Microsoft 365 Copilot effectively. It is particularly valuable for champions and trainers responsible for driving Copilot adoption within their organizations.',
  },
  {
    question: 'What are the prerequisites for MS-4004?',
    answer:
      'You should have working experience with Microsoft 365 applications including Word, Excel, PowerPoint, Outlook, and Teams. Familiarity with basic AI concepts is helpful but not required. Understanding how Microsoft 365 data flows through Microsoft Graph and SharePoint provides a strong foundation for the exam.',
  },
  {
    question: 'How does the MS-4004 exam differ from other Copilot certifications?',
    answer:
      'MS-4004 focuses specifically on using Copilot for productivity within Microsoft 365 apps. It differs from MS-4005 (Copilot Studio) which covers building custom copilots, and from MS-4006 which covers Copilot for Microsoft 365 administration. MS-4004 is the end-user productivity certification.',
  },
  {
    question: 'Is the MS-4004 certification worth pursuing in 2026?',
    answer:
      'Absolutely. As organizations rapidly adopt Microsoft 365 Copilot, professionals who can demonstrate effective use of AI-powered productivity tools are in high demand. The certification validates a skill set that applies across every role and industry, making it one of the most universally valuable Microsoft credentials available.',
  },
];

export default function MS4004StudyGuidePage() {
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
    headline: 'MS-4004 Microsoft 365 Copilot: Exam Prep Guide 2026',
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
    datePublished: '2026-02-01',
    dateModified: '2026-03-23',
    description:
      'Comprehensive MS-4004 Microsoft 365 Copilot exam preparation guide with skills measured, study resources, and expert tips.',
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
      <section className="relative py-14 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 bg-gradient-mesh" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center rounded-full px-3 py-1 mb-5 text-xs font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/60">
            MS-4004 Study Guide
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-6 text-gray-900">
            MS-4004 Microsoft 365 Copilot: Exam Prep Guide 2026
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Your complete preparation guide for the MS-4004 exam — learn how to demonstrate
            mastery of Microsoft 365 Copilot for workforce productivity, with expert strategies
            from a Microsoft Certified Trainer.
          </p>
          <div className="flex flex-wrap gap-6 text-gray-500">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>12 min read</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              <span>Updated March 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span>Expert Guide</span>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Exam Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Exam Overview</h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            The MS-4004: Empower your workforce with Copilot for Microsoft 365 Use Cases exam
            validates your ability to leverage Microsoft 365 Copilot to enhance productivity across
            the Microsoft 365 suite. This is one of the newest Microsoft certifications, reflecting
            the rapid enterprise adoption of AI-powered productivity tools.
          </p>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Having trained organizations through their Copilot adoption journeys, I can tell you
            that this exam goes well beyond basic prompting. It tests your understanding of how
            Copilot integrates with organizational data, how to craft effective prompts for
            different business scenarios, and how to maximize the value of AI across daily
            workflows. The professionals who pass this exam become the go-to Copilot champions in
            their organizations.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="glass-card p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Exam Details</h3>
              <ul className="space-y-2 text-gray-600">
                <li><strong>Exam Code:</strong> MS-4004</li>
                <li><strong>Focus:</strong> Microsoft 365 Copilot Productivity</li>
                <li><strong>Duration:</strong> 120 minutes</li>
                <li><strong>Questions:</strong> 40-55 questions</li>
                <li><strong>Passing Score:</strong> 700/1000</li>
                <li><strong>Cost:</strong> ~USD $165</li>
                <li><strong>Format:</strong> Multiple choice, scenario-based</li>
              </ul>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Who Should Take This Exam</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Knowledge workers using Microsoft 365 daily</li>
                <li>Copilot champions and adoption leads</li>
                <li>IT trainers and change management professionals</li>
                <li>Productivity consultants and solution architects</li>
                <li>Managers driving AI adoption in their teams</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Skills Measured */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Skills Measured</h2>
          <p className="text-lg text-gray-600 mb-8">
            The MS-4004 exam covers your ability to use Copilot effectively across different
            Microsoft 365 applications and business scenarios.
          </p>

          <div className="space-y-6">
            <div className="glass-card p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary-100 text-primary-700 rounded-lg p-2 font-bold text-sm min-w-[60px] text-center">
                  20-25%
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Craft Effective Prompts for Microsoft 365 Copilot
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Understand prompt engineering principles for Copilot, including how to structure
                    prompts with clear goals, context, sources, and expectations.
                  </p>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Prompt structure: goal, context, source, expectations
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Iterative prompt refinement techniques
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Understanding Copilot limitations and responsible use
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary-100 text-primary-700 rounded-lg p-2 font-bold text-sm min-w-[60px] text-center">
                  20-25%
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Use Copilot in Microsoft 365 Core Apps
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Demonstrate proficiency using Copilot in Word, Excel, PowerPoint, Outlook, and
                    Teams for various business tasks.
                  </p>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Word: drafting, rewriting, summarizing documents
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Excel: data analysis, formula generation, insights
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      PowerPoint: creating presentations from documents and prompts
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Outlook: email drafting, summarization, scheduling
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Teams: meeting summaries, chat catch-up, action items
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary-100 text-primary-700 rounded-lg p-2 font-bold text-sm min-w-[60px] text-center">
                  15-20%
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Use Microsoft 365 Copilot Chat (Business Chat)
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Leverage Copilot Chat (formerly Bing Chat Enterprise and Business Chat) to query
                    across organizational data using Microsoft Graph.
                  </p>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Cross-app queries using Microsoft Graph grounding
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Referencing specific files, emails, and meetings in prompts
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Understanding data boundaries and permissions
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary-100 text-primary-700 rounded-lg p-2 font-bold text-sm min-w-[60px] text-center">
                  20-25%
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Apply Copilot to Business Scenarios
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Identify and implement Copilot use cases for executive, sales, marketing, finance,
                    IT, and HR scenarios.
                  </p>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Executive briefing and decision support scenarios
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Sales and customer communication workflows
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Marketing content creation and campaign analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Finance reporting and data analysis workflows
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Study Resources */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Recommended Study Resources</h2>
          <p className="text-lg text-gray-600 mb-8">
            The MS-4004 is a newer exam, and study materials are evolving. Here is the most
            effective preparation approach based on my experience delivering Copilot training.
          </p>

          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-600" />
                Microsoft Learn — MS-4004 Learning Path
              </h3>
              <p className="text-gray-600">
                Complete the official Microsoft Learn path for MS-4004. This covers the Copilot
                system architecture, prompt engineering best practices, and app-specific Copilot
                capabilities with interactive exercises.
              </p>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-600" />
                Hands-On Copilot Practice
              </h3>
              <p className="text-gray-600">
                The most effective preparation is using Copilot daily in your real work. If your
                organization has Microsoft 365 Copilot licenses, spend time using it in every
                app — drafting in Word, analyzing in Excel, creating in PowerPoint, managing email
                in Outlook, and summarizing in Teams. Document what works and what does not.
              </p>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-600" />
                Instructor-Led Copilot Training
              </h3>
              <p className="text-gray-600">
                My{' '}
                <Link
                  href="/services/copilot-studio-training"
                  className="text-primary-600 hover:text-primary-700 underline"
                >
                  Copilot training sessions
                </Link>{' '}
                cover the full MS-4004 curriculum with live demonstrations, hands-on exercises, and
                real business scenario walkthroughs. Participants practice crafting prompts for
                every Microsoft 365 app and learn the patterns that consistently produce the best
                results.
              </p>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-600" />
                Microsoft Copilot Adoption Resources
              </h3>
              <p className="text-gray-600">
                Review the Microsoft Copilot for Microsoft 365 adoption guide and the Copilot Lab.
                These resources contain prompt libraries, scenario guides, and best practices that
                directly align with exam topics. The Copilot Success Kit is particularly useful for
                understanding business scenario applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Exam Tips */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Expert Exam Tips from an MCT
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            The MS-4004 exam tests practical knowledge, not just theory. Here are the strategies I
            share with every candidate preparing for this certification.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Lightbulb className="w-6 h-6 text-primary-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Master the Prompt Framework</h3>
              <p className="text-gray-600 text-sm">
                Every question about prompting tests the four-element framework: Goal (what you
                want), Context (why and background), Source (which data to use), and Expectations
                (format and tone). Know how to apply this framework to every Microsoft 365 app.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Lightbulb className="w-6 h-6 text-primary-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Know App-Specific Capabilities</h3>
              <p className="text-gray-600 text-sm">
                Copilot works differently in each app. Know what Copilot can and cannot do in Word
                versus Excel versus PowerPoint. Understand that Excel Copilot works best with
                formatted tables, PowerPoint Copilot can create from files, and Teams Copilot needs
                transcription enabled.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Lightbulb className="w-6 h-6 text-primary-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Understand Data Grounding</h3>
              <p className="text-gray-600 text-sm">
                The exam tests your understanding of how Copilot accesses organizational data
                through Microsoft Graph. Know that Copilot respects existing permissions — it can
                only access data the user already has access to. This is a frequently tested concept.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Lightbulb className="w-6 h-6 text-primary-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Think in Business Scenarios</h3>
              <p className="text-gray-600 text-sm">
                Many questions present a business scenario and ask which Copilot approach is most
                effective. Practice thinking about which app and prompt approach best serves each
                use case — a sales proposal needs different Copilot workflows than a financial
                analysis or an HR policy document.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Lightbulb className="w-6 h-6 text-primary-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Responsible AI is Tested</h3>
              <p className="text-gray-600 text-sm">
                Understand the responsible AI principles built into Microsoft 365 Copilot. Know when
                to verify Copilot outputs, how to handle sensitive data in prompts, and the
                importance of reviewing AI-generated content before sharing it with stakeholders.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Lightbulb className="w-6 h-6 text-primary-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Practice Iterative Prompting</h3>
              <p className="text-gray-600 text-sm">
                The exam expects you to know how to refine prompts when the initial output is not
                ideal. Understand techniques for narrowing scope, adding constraints, changing tone,
                and referencing specific sources to improve Copilot responses iteratively.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <HelpCircle className="w-8 h-8 text-primary-600" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="glass-card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Pass the MS-4004 Exam?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get expert-led Microsoft 365 Copilot training with hands-on practice, real business
            scenarios, and exam preparation strategies from a Microsoft Certified Trainer who has
            guided organizations through successful Copilot adoption.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact#book"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-glow-blue transition-all duration-300"
            >
              Book Copilot Training
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/about/certifications"
              className="inline-flex items-center justify-center gap-2 border-2 border-primary-600 text-primary-700 px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
            >
              View Trainer Credentials
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
