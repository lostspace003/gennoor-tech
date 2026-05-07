import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, CheckCircle, Clock, Award, Target, Lightbulb, HelpCircle, ArrowRight, BarChart3 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'PL-300 Power BI Certification: Complete Study Guide 2026 | Gennoor Tech',
  description:
    'Comprehensive PL-300 Microsoft Power BI Data Analyst study guide for 2026. Exam overview, skills measured, study resources, and expert tips from Microsoft Certified Trainer Jalal Ahmed Khan.',
  keywords: [
    'PL-300',
    'Power BI certification',
    'PL-300 study guide',
    'Microsoft Power BI Data Analyst',
    'Power BI exam prep',
    'PL-300 exam 2026',
    'DAX certification',
    'Power BI report design',
  ],
  openGraph: {
    title: 'PL-300 Power BI Certification: Complete Study Guide 2026',
    description:
      'Master the PL-300 exam with this comprehensive guide. Skills measured, study resources, and expert tips from an MCT with 16 certifications.',
    url: 'https://gennoor.com/guides/pl-300-power-bi-analyst',
    siteName: 'Gennoor Tech',
    type: 'article',
  },
};

const faqData = [
  {
    question: 'What is the PL-300 Power BI Data Analyst certification?',
    answer:
      'The PL-300 is a Microsoft certification that validates your ability to design and build scalable data models, clean and transform data, and create meaningful visualizations using Power BI. It replaces the former DA-100 exam and covers the full analytics lifecycle from data preparation to report sharing.',
  },
  {
    question: 'What are the prerequisites for the PL-300 exam?',
    answer:
      'Microsoft recommends familiarity with data concepts, data warehousing principles, and basic experience with Power BI Desktop. Knowledge of DAX (Data Analysis Expressions), Power Query (M language), and data modeling concepts is essential. Prior experience creating reports and dashboards in Power BI significantly helps.',
  },
  {
    question: 'How difficult is the PL-300 exam compared to other Microsoft certifications?',
    answer:
      'PL-300 is considered intermediate difficulty. The main challenge lies in the breadth of topics — you must understand data modeling, DAX calculations, Power Query transformations, and deployment best practices. Candidates who work with Power BI daily still find the DAX optimization and advanced data modeling questions challenging.',
  },
  {
    question: 'How much does the PL-300 exam cost and what is the format?',
    answer:
      'The PL-300 exam costs approximately USD $165 (pricing varies by region). It is 120 minutes long and typically contains 40-60 questions including multiple choice, drag-and-drop, case studies, and scenario-based questions. A passing score is 700 out of 1000.',
  },
  {
    question: 'Is the Power BI PL-300 certification valuable for career growth in 2026?',
    answer:
      'Yes, Power BI continues to be the leading enterprise BI tool, and the PL-300 certification is one of the most sought-after data analytics credentials. Certified Power BI analysts are in high demand across industries, and the certification validates skills that directly translate to higher-paying roles in data analytics and business intelligence.',
  },
];

export default function PL300StudyGuidePage() {
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
    headline: 'PL-300 Power BI Certification: Complete Study Guide 2026',
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
    datePublished: '2026-01-20',
    dateModified: '2026-03-23',
    description:
      'Comprehensive PL-300 Power BI Data Analyst study guide with exam overview, skills measured, study resources, and expert preparation strategies.',
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
            <span>PL-300</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6">
            PL-300 Power BI Certification: Complete Study Guide 2026
          </h1>
          <p className="text-xl text-primary-100 mb-8 leading-relaxed">
            Your definitive guide to passing the PL-300 Microsoft Power BI Data Analyst exam —
            covering every skill domain, study strategies, and practical tips from a Microsoft
            Certified Trainer who has delivered Power BI training to hundreds of professionals.
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
              <BarChart3 className="w-5 h-5" />
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
            The PL-300: Microsoft Power BI Data Analyst exam measures your ability to prepare data,
            model data, visualize and analyze data, and deploy and maintain assets in Power BI. This
            certification proves you can transform raw data into meaningful insights that drive
            business decisions.
          </p>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Power BI remains the industry-leading business intelligence platform, and the PL-300 is
            consistently one of the most popular Microsoft certifications. From my experience
            training data teams across organizations, I have seen this certification open doors for
            analysts, consultants, and BI developers at every career stage.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-primary-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Exam Details</h3>
              <ul className="space-y-2 text-gray-600">
                <li><strong>Exam Code:</strong> PL-300</li>
                <li><strong>Certification:</strong> Power BI Data Analyst Associate</li>
                <li><strong>Duration:</strong> 120 minutes</li>
                <li><strong>Questions:</strong> 40-60 questions</li>
                <li><strong>Passing Score:</strong> 700/1000</li>
                <li><strong>Cost:</strong> ~USD $165</li>
                <li><strong>Renewal:</strong> Annual free renewal assessment</li>
              </ul>
            </div>
            <div className="bg-accent-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Who Should Take This Exam</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Business Intelligence Analysts and Developers</li>
                <li>Data Analysts and Reporting Specialists</li>
                <li>Business Analysts using data for decisions</li>
                <li>Excel power users transitioning to Power BI</li>
                <li>IT professionals building self-service BI</li>
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
            The PL-300 exam tests your proficiency across four primary domains. Each domain
            represents a critical stage of the analytics workflow in Power BI.
          </p>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="bg-primary-100 text-primary-700 rounded-lg p-2 font-bold text-sm min-w-[60px] text-center">
                  25-30%
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Prepare the Data</h3>
                  <p className="text-gray-600 mb-3">
                    Get data from various sources, clean and transform data using Power Query, and
                    profile data to identify quality issues and patterns.
                  </p>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Connect to data sources (SQL Server, Excel, web, SharePoint, Dataverse)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Power Query transformations and M language fundamentals
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Data profiling, error handling, and query folding
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Parameters and dynamic data source configurations
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Model the Data</h3>
                  <p className="text-gray-600 mb-3">
                    Design and implement data models, create DAX measures and calculated columns,
                    and optimize model performance.
                  </p>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Star schema design and relationship management
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      DAX measures: CALCULATE, filter context, time intelligence
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Role-level security (RLS) implementation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Performance optimization and model size reduction
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="bg-primary-100 text-primary-700 rounded-lg p-2 font-bold text-sm min-w-[60px] text-center">
                  25-30%
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Visualize and Analyze the Data
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Create effective reports and dashboards, implement advanced analytics features,
                    and use AI visuals in Power BI.
                  </p>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Report design best practices and accessibility
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Conditional formatting, drill-through, and bookmarks
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      AI insights: Q&A, Key Influencers, Decomposition Tree
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Paginated reports and Power BI mobile optimization
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
                    Deploy and Maintain Assets
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Manage workspaces, implement data governance, configure data refresh, and
                    promote content across environments.
                  </p>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Workspace management and deployment pipelines
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Sensitivity labels and data governance
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Scheduled refresh, incremental refresh, and dataflows
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      Power BI REST API and automation scenarios
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
            Based on years of training Power BI professionals, here is the study plan I recommend
            for a structured and efficient preparation.
          </p>

          <div className="space-y-6">
            <div className="border border-gray-100 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-600" />
                Microsoft Learn — PL-300 Learning Paths
              </h3>
              <p className="text-gray-600">
                Complete all modules in the official &quot;Prepare for Exam PL-300&quot; collection
                on Microsoft Learn. These free paths cover data preparation, modeling, visualization,
                and deployment with hands-on exercises. Pay special attention to the DAX and data
                modeling modules.
              </p>
            </div>

            <div className="border border-gray-100 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-600" />
                SQLBI — DAX Mastery
              </h3>
              <p className="text-gray-600">
                The DAX Guide and articles from SQLBI (by Marco Russo and Alberto Ferrari) are
                essential reading. Understanding evaluation context, CALCULATE, and iterator
                functions deeply is the difference between passing and failing. Their free
                &quot;Introducing DAX&quot; course is excellent.
              </p>
            </div>

            <div className="border border-gray-100 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-600" />
                Instructor-Led Power BI Training
              </h3>
              <p className="text-gray-600">
                My{' '}
                <Link
                  href="/services/training"
                  className="text-primary-600 hover:text-primary-700 underline"
                >
                  Power BI training sessions
                </Link>{' '}
                cover every PL-300 domain with real datasets, practical scenarios, and exam-focused
                exercises. Participants work through complex DAX patterns, build production-quality
                data models, and practice the exact types of scenarios that appear on the exam.
              </p>
            </div>

            <div className="border border-gray-100 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-600" />
                Practice with Real Data
              </h3>
              <p className="text-gray-600">
                Download sample datasets (Adventure Works, Contoso, Wide World Importers) and build
                complete solutions end-to-end. Create star schemas, write complex DAX measures, build
                interactive reports, and publish them to the Power BI Service. Hands-on experience is
                irreplaceable for this exam.
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
            These are the areas where I see candidates struggle most, and the strategies that
            consistently lead to success on the PL-300.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Lightbulb className="w-6 h-6 text-primary-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Master CALCULATE and Filter Context</h3>
              <p className="text-gray-600 text-sm">
                DAX questions are where most candidates lose points. Understand how CALCULATE
                modifies filter context, how row context transitions to filter context, and when to
                use FILTER versus direct filter arguments. Practice writing time intelligence
                measures from scratch.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Lightbulb className="w-6 h-6 text-primary-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Know Power Query Inside Out</h3>
              <p className="text-gray-600 text-sm">
                Questions on data transformation are heavily weighted. Understand merge vs. append
                queries, query folding, handling errors, pivoting/unpivoting columns, and when to
                transform data in Power Query versus DAX. Know how to read M code even if you cannot
                write it fluently.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Lightbulb className="w-6 h-6 text-primary-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Star Schema is Non-Negotiable</h3>
              <p className="text-gray-600 text-sm">
                Every data modeling question assumes star schema principles. Know the difference
                between fact and dimension tables, understand relationship cardinality and cross-filter
                direction, and know when to use bi-directional filtering (sparingly) versus
                CROSSFILTER in DAX.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Lightbulb className="w-6 h-6 text-primary-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Do Not Ignore Deployment Topics</h3>
              <p className="text-gray-600 text-sm">
                Many candidates underprepare for the deployment and governance section. Understand
                workspace roles, deployment pipelines, row-level security testing, scheduled refresh
                configuration, and sensitivity labels. These are straightforward points if you study
                them.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Lightbulb className="w-6 h-6 text-primary-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Understand Performance Optimization</h3>
              <p className="text-gray-600 text-sm">
                Questions about model optimization appear consistently. Know when to use
                aggregations, how to reduce model size (removing unnecessary columns, proper data
                types), and how to use Performance Analyzer in Power BI Desktop to identify slow
                visuals.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Lightbulb className="w-6 h-6 text-primary-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Read Case Studies Carefully</h3>
              <p className="text-gray-600 text-sm">
                PL-300 case studies provide detailed business scenarios. Read the entire case study
                before answering questions — the requirements often contain subtle constraints that
                change the correct answer. Take notes on data sources, security requirements, and
                refresh schedules mentioned.
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
          <h2 className="text-3xl font-bold mb-4">Ready to Pass the PL-300 Exam?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Get expert-led PL-300 preparation training with hands-on labs, real-world datasets, and
            exam strategies from a Microsoft Certified Trainer who has trained hundreds of
            successful Power BI analysts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact#book"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
            >
              Book PL-300 Training
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
