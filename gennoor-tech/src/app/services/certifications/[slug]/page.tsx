import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Clock, Target, DollarSign, Award, BookOpen, CheckCircle, Calendar, Users, Zap, Phone } from 'lucide-react'
import { getAllCertifications, getCertificationBySlug } from '@/data/certification-prep'
import { ServiceJsonLd, BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cert = getCertificationBySlug(slug)
  if (!cert) return {}

  const title = `${cert.code}: ${cert.title} Exam Guide — ${cert.provider} Certification | Gennoor Tech`
  const description = `Complete ${cert.code} ${cert.title} exam preparation guide. ${cert.description} Exam duration: ${cert.examDuration}, passing score: ${cert.passingScore}. Expert-led preparation with 98% pass rate.`

  return {
    title,
    description,
    keywords: [cert.code, cert.title, `${cert.code} exam`, `${cert.code} certification`, `${cert.provider} certification`, 'exam preparation'],
    alternates: { canonical: `https://gennoor.com/services/certifications/${cert.slug}` },
    openGraph: { title, description, url: `https://gennoor.com/services/certifications/${cert.slug}` },
  }
}

export function generateStaticParams() {
  return getAllCertifications().map(c => ({ slug: c.slug }))
}

function generateFaqs(cert: NonNullable<ReturnType<typeof getCertificationBySlug>>) {
  return [
    {
      question: `What is the ${cert.code} ${cert.title} certification?`,
      answer: cert.description,
    },
    {
      question: `How long is the ${cert.code} exam?`,
      answer: `The ${cert.code} exam duration is ${cert.examDuration}. The passing score is ${cert.passingScore}. The exam fee is ${cert.price}.`,
    },
    {
      question: `What topics does the ${cert.code} exam cover?`,
      answer: `The ${cert.code} exam covers: ${cert.topics.join('; ')}.`,
    },
    {
      question: `What are the prerequisites for ${cert.code}?`,
      answer: cert.prerequisites.length > 0
        ? `Prerequisites include: ${cert.prerequisites.join(', ')}.`
        : 'There are no formal prerequisites for this certification. However, foundational knowledge in the domain is recommended.',
    },
    {
      question: `How long is the ${cert.code} certification valid?`,
      answer: `The ${cert.code} certification is valid for ${cert.validityPeriod}. ${cert.validityPeriod === '2 years' ? 'You will need to renew by passing a recertification assessment before expiry.' : ''}`,
    },
    {
      question: `Does Gennoor Tech offer ${cert.code} preparation training?`,
      answer: `Yes, we offer expert-led ${cert.code} preparation with hands-on labs, practice exams, and personalized guidance. Our trainer holds 16+ active certifications with a 98% student pass rate across all exams.`,
    },
  ]
}

export default async function CertificationGuidePage({ params }: Props) {
  const { slug } = await params
  const cert = getCertificationBySlug(slug)

  if (!cert) {
    notFound()
  }

  const faqs = generateFaqs(cert)
  const allCerts = getAllCertifications()
  const relatedCerts = allCerts
    .filter(c => c.slug !== slug && c.provider === cert.provider)
    .slice(0, 3)

  const providerColor: Record<string, string> = {
    Microsoft: 'from-blue-600 to-blue-800',
    Google: 'from-red-600 to-red-800',
    AWS: 'from-orange-600 to-orange-800',
    GitHub: 'from-gray-700 to-gray-900',
  }

  const levelColor: Record<string, string> = {
    Fundamentals: 'bg-green-100 text-green-800',
    Associate: 'bg-blue-100 text-blue-800',
    Expert: 'bg-purple-100 text-purple-800',
    Specialty: 'bg-orange-100 text-orange-800',
  }

  return (
    <>
      <ServiceJsonLd
        name={`${cert.code} ${cert.title} Certification Preparation`}
        description={cert.description}
        url={`https://gennoor.com/services/certifications/${cert.slug}`}
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://gennoor.com' },
        { name: 'Services', url: 'https://gennoor.com/services' },
        { name: 'Certifications', url: 'https://gennoor.com/services/certifications' },
        { name: `${cert.code}: ${cert.title}`, url: `https://gennoor.com/services/certifications/${cert.slug}` },
      ]} />
      <FAQJsonLd faqs={faqs} />

      <main className="min-h-screen pt-20">
        {/* Hero */}
        <section className={`bg-gradient-to-br ${providerColor[cert.provider] || 'from-primary-600 to-primary-800'} py-16 lg:py-24 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-grid-white/10"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Link href="/services/certifications" className="inline-flex items-center text-white/90 hover:text-white mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Certifications
            </Link>

            <div className="max-w-4xl">
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                  {cert.provider}
                </span>
                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium ${levelColor[cert.level] || 'bg-gray-100 text-gray-800'}`}>
                  {cert.level}
                </span>
              </div>

              <div className="mb-4">
                <span className="text-3xl font-bold text-white/90">{cert.code}</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-white mb-6">
                {cert.title}
              </h1>
              <p className="text-xl text-white/90 mb-8">
                {cert.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <Clock className="w-6 h-6 text-white mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">{cert.examDuration}</div>
                  <div className="text-white/80 text-sm">Exam Duration</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <Target className="w-6 h-6 text-white mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">{cert.passingScore}</div>
                  <div className="text-white/80 text-sm">Passing Score</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <DollarSign className="w-6 h-6 text-white mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">{cert.price}</div>
                  <div className="text-white/80 text-sm">Exam Fee</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <Calendar className="w-6 h-6 text-white mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">{cert.validityPeriod}</div>
                  <div className="text-white/80 text-sm">Validity</div>
                </div>
              </div>

              <Link
                href="/contact#book"
                className="inline-flex items-center px-8 py-4 bg-white text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Phone className="w-5 h-5 mr-2" />
                Start Preparation
              </Link>
            </div>
          </div>
        </section>

        {/* Exam Topics */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Exam Topics</h2>
              <div className="space-y-4">
                {cert.topics.map((topic, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary-600">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{topic}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Prerequisites */}
        <section className="py-16 lg:py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Prerequisites</h2>
              {cert.prerequisites.length > 0 ? (
                <div className="space-y-3">
                  {cert.prerequisites.map((prereq, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100">
                      <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700">{prereq}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg p-6 border border-gray-100">
                  <p className="text-gray-600">No formal prerequisites are required. This certification is suitable for beginners with basic IT knowledge.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Preparation Approach */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Preparation Approach</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Structured Curriculum</h3>
                    <p className="text-sm text-gray-600 mt-1">Aligned with latest exam objectives and updated for current exam patterns</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Hands-On Labs</h3>
                    <p className="text-sm text-gray-600 mt-1">Practical exercises using real cloud environments and enterprise scenarios</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Practice Exams</h3>
                    <p className="text-sm text-gray-600 mt-1">Mock exams modeled on real questions with detailed answer explanations</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Expert Guidance</h3>
                    <p className="text-sm text-gray-600 mt-1">Learn from a trainer with 16+ active certifications and 98% student pass rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 lg:py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {faqs.map((faq) => (
                <div key={faq.question} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Certifications */}
        {relatedCerts.length > 0 && (
          <section className="py-16 lg:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Other {cert.provider} Certifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {relatedCerts.map((rc) => (
                  <Link
                    key={rc.slug}
                    href={`/services/certifications/${rc.slug}`}
                    className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl font-bold text-primary-600">{rc.code}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${levelColor[rc.level] || 'bg-gray-100 text-gray-800'}`}>
                        {rc.level}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {rc.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{rc.description}</p>
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
              Ready to Pass the {cert.code} Exam?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Get expert preparation with hands-on labs and practice exams. Join 2000+ professionals who passed on their first attempt.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact#book"
                className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                Start Preparation
              </Link>
              <Link
                href="/services/certifications"
                className="inline-flex items-center px-8 py-4 border-2 border-primary-600 text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-colors"
              >
                View All Certifications
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
