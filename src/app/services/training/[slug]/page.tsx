import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Clock, Users, Award, BookOpen, CheckCircle, Globe, Zap, Phone, Download } from 'lucide-react'
import { getAllPrograms, getProgramBySlug } from '@/data/training-programs'
import { ServiceJsonLd, BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd'
import ContentModal from '@/components/training/ContentModal'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const program = getProgramBySlug(slug)
  if (!program) return {}

  const title = `${program.title} Training — ${program.category === 'bootcamp' ? 'Bootcamp' : 'Course'} | Gennoor Tech`
  const description = `${program.description} ${program.duration} ${program.category} for ${program.audience}. Hands-on labs, expert instruction, and real-world projects.`

  return {
    title,
    description,
    keywords: [program.title, `${program.title} training`, `${program.title} course`, program.technology, 'enterprise AI training', 'corporate training'],
    alternates: { canonical: `https://gennoor.com/services/training/${program.slug}` },
    openGraph: {
      title,
      description,
      url: `https://gennoor.com/services/training/${program.slug}`,
    },
  }
}

export function generateStaticParams() {
  return getAllPrograms().map(p => ({ slug: p.slug }))
}

function generateFaqs(program: NonNullable<ReturnType<typeof getProgramBySlug>>) {
  return [
    {
      question: `What will I learn in the ${program.title} program?`,
      answer: `${program.description} The program covers ${program.highlights.join(', ')} through hands-on labs and real-world enterprise scenarios.`,
    },
    {
      question: `Who should attend the ${program.title} ${program.category}?`,
      answer: `This program is designed for ${program.audience}. It is at the ${program.level} level and assumes relevant foundational knowledge.`,
    },
    {
      question: `How long is the ${program.title} program?`,
      answer: `The program runs for ${program.duration} with full-day instructor-led sessions. Each day includes a mix of lectures, demonstrations, hands-on labs, and group exercises.`,
    },
    {
      question: `Is the ${program.title} training available online?`,
      answer: 'Yes, this program is available as on-site classroom training, live virtual instructor-led sessions, or hybrid format. Virtual sessions include the same hands-on labs and interactive experience.',
    },
    {
      question: `Does the ${program.title} program include certification?`,
      answer: program.certification === 'No'
        ? 'This program focuses on practical skills. While it does not directly map to a certification exam, the skills learned are applicable to related industry certifications.'
        : `Yes, this program aligns with certification preparation (${program.certification === 'Yes' ? 'relevant industry certifications' : program.certification}). Our trainer holds 16+ active certifications with a 98% student pass rate.`,
    },
  ]
}

export default async function TrainingProgramPage({ params }: Props) {
  const { slug } = await params
  const program = getProgramBySlug(slug)

  if (!program) {
    notFound()
  }

  const faqs = generateFaqs(program)
  const allPrograms = getAllPrograms()
  const relatedPrograms = allPrograms
    .filter(p => p.slug !== slug && (p.technology === program.technology || p.level === program.level))
    .slice(0, 3)

  return (
    <>
      <ServiceJsonLd
        name={`${program.title} Training`}
        description={program.description}
        url={`https://gennoor.com/services/training/${program.slug}`}
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://gennoor.com' },
        { name: 'Services', url: 'https://gennoor.com/services' },
        { name: 'Training', url: 'https://gennoor.com/services/training' },
        { name: program.title, url: `https://gennoor.com/services/training/${program.slug}` },
      ]} />
      <FAQJsonLd faqs={faqs} />

      <main className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-16 lg:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Link
              href="/services/training"
              className="inline-flex items-center text-white/90 hover:text-white mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Programs
            </Link>

            <div className="max-w-4xl">
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                  {program.category === 'bootcamp' ? 'Bootcamp' : 'Course'}
                </span>
                <span className="inline-flex items-center px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                  {program.level}
                </span>
                <span className="inline-flex items-center px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                  {program.technology}
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-black text-white mb-6">
                {program.title}
              </h1>
              <p className="text-xl text-white/90 mb-8">
                {program.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <Clock className="w-6 h-6 text-white mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">{program.duration}</div>
                  <div className="text-white/80 text-sm">Duration</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <Users className="w-6 h-6 text-white mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">5-15</div>
                  <div className="text-white/80 text-sm">Batch Size</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <Award className="w-6 h-6 text-white mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">{program.certification === 'No' ? 'Practical' : 'Cert-Aligned'}</div>
                  <div className="text-white/80 text-sm">Certification</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <Globe className="w-6 h-6 text-white mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">Global</div>
                  <div className="text-white/80 text-sm">Delivery</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact#book"
                  className="inline-flex items-center px-8 py-4 bg-white text-primary-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Enquire Now
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* What You'll Learn */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">What You&apos;ll Learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {program.highlights.map((highlight) => (
                  <div key={highlight} className="flex items-start gap-3 p-4 bg-primary-50 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{highlight}</h3>
                      <p className="text-sm text-gray-600 mt-1">Hands-on labs and real-world enterprise scenarios</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Program Details */}
        <section className="py-16 lg:py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Program Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Target Audience</h3>
                  <p className="text-gray-600">{program.audience}</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Level</h3>
                  <p className="text-gray-600">{program.level} — {program.level === 'Executive' ? 'No technical prerequisites' : program.level === 'Beginner' ? 'Basic IT knowledge' : program.level === 'Intermediate' ? 'Foundational knowledge in the domain' : 'Strong technical background required'}</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Technology Platform</h3>
                  <p className="text-gray-600">{program.technology}</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Industry Focus</h3>
                  <p className="text-gray-600">{program.industry}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Delivery Format */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Delivery Format</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-7 h-7 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">On-Site Training</h3>
                  <p className="text-sm text-gray-600">Instructor-led classroom sessions at your location or ours</p>
                </div>
                <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-7 h-7 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Live Virtual</h3>
                  <p className="text-sm text-gray-600">Interactive online sessions with hands-on labs and breakout rooms</p>
                </div>
                <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-7 h-7 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Hybrid</h3>
                  <p className="text-sm text-gray-600">Combine on-site and virtual for distributed teams</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose This Program */}
        <section className="py-16 lg:py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Choose Gennoor Tech</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Expert Trainer</h3>
                    <p className="text-sm text-gray-600">Microsoft Certified Trainer with 16+ active certifications and 14+ years of enterprise experience</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Customized Curriculum</h3>
                    <p className="text-sm text-gray-600">Tailored to your industry, tech stack, and team skill level with your own data scenarios</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">98% Satisfaction Rate</h3>
                    <p className="text-sm text-gray-600">Consistently rated excellent by 2000+ professionals across Fortune 500 companies</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Global Delivery</h3>
                    <p className="text-sm text-gray-600">Training delivered across India, Saudi Arabia, UAE, East Africa, and Southeast Asia</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {faqs.map((faq) => (
                <div key={faq.question} className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Programs */}
        {relatedPrograms.length > 0 && (
          <section className="py-16 lg:py-20 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Related Programs</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {relatedPrograms.map((rp) => (
                  <Link
                    key={rp.slug}
                    href={`/services/training/${rp.slug}`}
                    className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">
                        {rp.category === 'bootcamp' ? 'Bootcamp' : 'Course'}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                        {rp.duration}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {rp.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{rp.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-16 lg:py-20 bg-primary-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Ready to Get Started with {program.title}?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Get a customized training proposal for your team. We&apos;ll tailor the curriculum to your specific needs and schedule.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact#book"
                className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                Request Custom Proposal
              </Link>
              <Link
                href="/services/training"
                className="inline-flex items-center px-8 py-4 border-2 border-primary-600 text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-colors"
              >
                View All Programs
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
