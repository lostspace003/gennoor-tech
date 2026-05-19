import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Layers,
  Users,
  CheckCircle2,
  BookOpen,
  Award,
  ExternalLink,
  Target,
  AlertCircle,
} from 'lucide-react'
import { BreadcrumbJsonLd } from '@/components/JsonLd'
import EnablementMoment from '@/components/academy/EnablementMoment'
import { courses, getCourseBySlug, getRelatedCourses } from '@/data/academy/courses'
import {
  tracks,
  levels,
  audienceLabels,
  functionLabels,
  industryLabels,
  stackLabels,
} from '@/data/academy/taxonomy'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const course = getCourseBySlug(slug)
  if (!course) {
    return { title: 'Course not found — Gennoor Academy' }
  }
  return {
    title: `${course.title} — Gennoor Academy`,
    description: course.subtitle,
    keywords: [
      course.title,
      'AI course',
      'Gennoor Academy',
      ...(course.functions?.map((f) => functionLabels[f]) ?? []),
      ...(course.industries?.map((i) => industryLabels[i]) ?? []),
    ],
    alternates: {
      canonical: `https://gennoor.com/academy/courses/${course.slug}`,
    },
    openGraph: {
      title: `${course.title} — Gennoor Academy`,
      description: course.subtitle,
      url: `https://gennoor.com/academy/courses/${course.slug}`,
    },
  }
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params
  const course = getCourseBySlug(slug)
  if (!course) notFound()

  const trackInfo = tracks.find((t) => t.id === course.track)
  const levelInfo = levels.find((l) => l.id === course.level)
  const relatedCourses = getRelatedCourses(course.slug)
  const isAvailable = course.status === 'available'

  // Schema for AEO retrieval
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.subtitle,
    provider: {
      '@type': 'Organization',
      name: 'Gennoor Tech',
      sameAs: 'https://gennoor.com',
    },
    educationalLevel: levelInfo?.label,
    timeRequired: course.duration,
    inLanguage: 'en',
    isAccessibleForFree: true,
    learningResourceType: 'Course',
    teaches: course.whatYoullLearn,
  }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://gennoor.com' },
          { name: 'Academy', url: 'https://gennoor.com/academy' },
          {
            name: course.title,
            url: `https://gennoor.com/academy/courses/${course.slug}`,
          },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />

      {/* HERO */}
      <section className="relative py-14 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 bg-gradient-mesh" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/academy"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Academy catalog
            </Link>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold text-primary-600 bg-primary-50 border border-primary-100/60">
                {trackInfo?.label}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-100">
                {levelInfo?.label}
              </span>
              {!isAvailable && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100/60">
                  {course.status === 'coming-soon' ? 'Coming soon' : 'In development'}
                  {course.availableFrom ? ` · ${course.availableFrom}` : ''}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-gray-900 mb-4 leading-[1.15]">
              {course.title}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-6 max-w-3xl">
              {course.subtitle}
            </p>

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500 mb-2">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary-500" />
                {course.duration}
              </span>
              <span className="text-gray-300">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-primary-500" />
                {course.chapterCount} chapters
              </span>
              <span className="text-gray-300">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="w-4 h-4 text-primary-500" />
                {course.audience.map((a) => audienceLabels[a]).join(' · ')}
              </span>
              <span className="text-gray-300">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Award className="w-4 h-4 text-primary-500" />
                Free
              </span>
            </div>
            <p className="text-xs text-gray-400">Last updated: {course.lastUpdated}</p>
          </div>
        </div>
      </section>

      {/* WHAT YOU'LL LEARN + WHO IT'S FOR */}
      <section className="py-14 lg:py-18 relative">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-7">
                <p className="text-xs font-bold tracking-widest text-primary-600 uppercase mb-3">
                  What you&apos;ll learn
                </p>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-5 leading-tight">
                  By the end of this course you&apos;ll be able to:
                </h2>
                <ul className="space-y-3">
                  {course.whatYoullLearn.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <span className="text-base text-gray-700 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:col-span-5">
                <div className="rounded-2xl p-6 glass-card mb-5">
                  <p className="text-xs font-bold tracking-widest text-primary-600 uppercase mb-2">
                    Who this is for
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">{course.whoThisIsFor}</p>
                </div>
                {course.prerequisites && course.prerequisites.length > 0 && (
                  <div className="rounded-2xl p-6 glass-card">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      <p className="text-xs font-bold tracking-widest text-amber-700 uppercase">
                        Prerequisites
                      </p>
                    </div>
                    <ul className="space-y-1">
                      {course.prerequisites.map((p) => (
                        <li key={p} className="text-sm text-gray-600 leading-relaxed">
                          · {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTER LIST */}
      <section className="py-14 lg:py-18 relative">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-10">
              <p className="text-xs font-bold tracking-widest text-primary-600 uppercase mb-3">
                Curriculum
              </p>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                {course.chapterCount} chapters · {course.exerciseCount} hands-on exercises ·
                capstone challenge
              </h2>
              <p className="text-base text-gray-500 leading-relaxed">
                Each chapter ends with the learning objectives ticked off. Quizzes are
                auto-graded with feedback; exercises are open-ended and produce artifacts you
                can take to your team.
              </p>
            </div>

            <div className="space-y-3">
              {course.chapters.map((chapter) => (
                <div
                  key={chapter.number}
                  className={`rounded-2xl p-5 lg:p-6 ${
                    chapter.isCapstone
                      ? 'bg-amber-50/40 border border-amber-100/50'
                      : 'glass-card'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                        chapter.isCapstone
                          ? 'bg-amber-500 text-white'
                          : 'bg-primary-50 text-primary-600 border border-primary-100/60'
                      }`}
                    >
                      {chapter.isCapstone ? <Target className="w-5 h-5" /> : chapter.number}
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
                        <h3 className="text-base font-bold text-gray-900 leading-tight">
                          {chapter.isCapstone
                            ? `Capstone: ${chapter.title}`
                            : `${chapter.number}. ${chapter.title}`}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-gray-400 inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {chapter.duration}
                          </span>
                          {chapter.hasQuiz && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold text-primary-600 bg-primary-50 border border-primary-100/60">
                              QUIZ
                            </span>
                          )}
                          {chapter.hasExercise && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100/60">
                              EXERCISE
                            </span>
                          )}
                        </div>
                      </div>
                      <ul className="space-y-1">
                        {chapter.objectives.map((obj) => (
                          <li key={obj} className="text-sm text-gray-500 leading-relaxed flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary-400 flex-shrink-0 mt-0.5" />
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {course.capstoneTitle && (
              <div className="mt-6 rounded-2xl p-5 bg-primary-50/40 border border-primary-100/50">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <strong className="text-gray-900">Capstone deliverable: </strong>
                  Every learner who completes this course produces &laquo;
                  {course.capstoneTitle}&raquo; — a tangible artifact you take back to your
                  organization.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ACCESS / STATUS */}
      <section className="py-12 lg:py-14 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="rounded-2xl p-6 lg:p-7 glass-card glow-border">
              {isAvailable ? (
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-grow">
                    <h3 className="text-base font-bold text-gray-900 mb-1">
                      Course is live and free to access.
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Sign in to track your progress across devices. The first two chapters
                      are accessible without an account.
                    </p>
                  </div>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:shadow-glow-blue transition-all flex-shrink-0"
                  >
                    Get notified when chapter 1 ships
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-grow">
                    <h3 className="text-base font-bold text-gray-900 mb-1">
                      Available {course.availableFrom ?? 'soon'}.
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      This course is in development. Drop us a note if you want first access
                      when it ships — we&apos;ll prioritize.
                    </p>
                  </div>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:shadow-glow-blue transition-all flex-shrink-0"
                  >
                    Request early access
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section className="py-14 lg:py-18 relative">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-bold tracking-widest text-primary-600 uppercase mb-3">
              References &amp; sources
            </p>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-5 leading-tight">
              Built on cited sources — not vibes.
            </h2>
            <p className="text-base text-gray-500 leading-relaxed mb-6">
              Every course is researched fresh against vendor documentation, regulatory
              sources, and peer-reviewed work. Sources used in this course:
            </p>
            <div className="space-y-3">
              {course.references.map((ref) => (
                <div
                  key={ref.title}
                  className="rounded-xl p-4 glass-card flex items-start gap-3"
                >
                  <BookOpen className="w-4 h-4 text-primary-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-0.5">
                      {ref.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      <em>{ref.source}</em>
                      {ref.url && (
                        <>
                          {' · '}
                          <a
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700 transition-colors inline-flex items-center gap-1"
                          >
                            Source link <ExternalLink className="w-3 h-3" />
                          </a>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COURSE METADATA STRIP */}
      <section className="py-12 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="rounded-2xl p-6 glass-card">
              <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">
                Course details
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <MetaItem
                  label="Track"
                  value={trackInfo?.label ?? course.track}
                />
                <MetaItem label="Level" value={levelInfo?.label ?? course.level} />
                <MetaItem
                  label="Audience"
                  value={course.audience.map((a) => audienceLabels[a]).join(', ')}
                />
                {course.functions && course.functions.length > 0 && (
                  <MetaItem
                    label="Function"
                    value={course.functions.map((f) => functionLabels[f]).join(', ')}
                  />
                )}
                {course.industries && course.industries.length > 0 && (
                  <MetaItem
                    label="Industry"
                    value={course.industries.map((i) => industryLabels[i]).join(', ')}
                  />
                )}
                <MetaItem
                  label="Stack"
                  value={course.stack.map((s) => stackLabels[s]).join(', ')}
                />
                <MetaItem
                  label="Paired Gennoor Way phase"
                  value={course.pairedPhase.join(', ')}
                />
                <MetaItem label="Format" value={course.format.join(', ')} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE ENABLEMENT MOMENT */}
      <EnablementMoment course={course} relatedCourses={relatedCourses} />

      {/* BACK TO CATALOG */}
      <section className="py-12 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link
            href="/academy"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all {courses.length} Academy courses
          </Link>
        </div>
      </section>
    </>
  )
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase mb-1">{label}</p>
      <p className="text-sm text-gray-700 leading-relaxed">{value}</p>
    </div>
  )
}

