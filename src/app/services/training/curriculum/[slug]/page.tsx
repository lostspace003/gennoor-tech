import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, Clock, BookOpen, Users, Layers } from 'lucide-react'
import { getCoursePdfBySlug, allCoursePdfs } from '@/data/course-pdfs'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return allCoursePdfs.map(c => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const course = getCoursePdfBySlug(slug)
  if (!course) return { title: 'Curriculum not found' }
  return {
    title: `${course.title} — 2-Day Training Curriculum · Gennoor Tech`,
    description: course.subtitle,
    alternates: { canonical: `https://gennoor.com/services/training/curriculum/${course.slug}` },
  }
}

export default async function CurriculumViewerPage({ params }: Props) {
  const { slug } = await params
  const course = getCoursePdfBySlug(slug)
  if (!course) notFound()

  const pdfUrl = `/api/content/courses/pdfs/${course.slug}.pdf`

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Top metadata band */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/services/training#catalog"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            All curriculum
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center text-[10px] font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {course.trackLabel}
                </span>
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                  Paid · Instructor-led
                </span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                {course.title}
              </h1>
              <p className="text-sm text-gray-600 max-w-3xl leading-relaxed">
                {course.subtitle}
              </p>

              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary-500" />
                  {course.duration}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-primary-500" />
                  {course.modules.length} modules
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-primary-500" />
                  {course.audience}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-primary-500" />
                  Track: {course.trackLabel}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 lg:flex-shrink-0">
              <a
                href={pdfUrl}
                download={`${course.slug}.pdf`}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </a>
              <Link
                href="/contact#book"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border-2 border-primary-600 text-primary-600 text-sm font-semibold rounded-lg hover:bg-primary-50 transition-colors"
              >
                Request training quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PDF viewer + curriculum outline side-by-side */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* PDF inline viewer */}
          <div className="bg-white rounded-2xl ring-1 ring-gray-200 overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-600">Curriculum PDF</span>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-primary-600 hover:text-primary-700"
              >
                Open in new tab ↗
              </a>
            </div>
            <iframe
              src={pdfUrl}
              title={`${course.title} — curriculum PDF`}
              className="w-full h-[800px] border-0"
              aria-label={`Curriculum PDF for ${course.title}`}
            />
            <noscript>
              <p className="p-4 text-sm text-gray-600">
                Your browser does not support inline PDF viewing.{' '}
                <a href={pdfUrl} className="text-primary-600 font-semibold">Download the PDF</a>.
              </p>
            </noscript>
          </div>

          {/* Outline / quick-glance sidebar */}
          <aside className="bg-white rounded-2xl ring-1 ring-gray-200 p-5 h-fit lg:sticky lg:top-4">
            <h2 className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-3">
              Module outline
            </h2>
            <ol className="space-y-3 text-sm">
              {course.modules.map(mod => (
                <li key={mod.number} className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary-50 text-primary-700 font-bold text-xs flex items-center justify-center">
                    {mod.number}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 leading-tight">{mod.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{mod.topics.length} topics</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">
                Run this for your team
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">
                Two-day instructor-led course. Customised to your industry, your data, your tools.
              </p>
              <Link
                href="/contact#book"
                className="block w-full text-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Request quote
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
