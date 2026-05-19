import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle2,
  Target,
  BookOpen,
  Award,
  Sparkles,
  Hammer,
} from 'lucide-react'
import { BreadcrumbJsonLd } from '@/components/JsonLd'
import ChapterContentRenderer from '@/components/academy/ChapterContentRenderer'
import ChapterQuiz from '@/components/academy/ChapterQuiz'
import ChapterAudio from '@/components/academy/ChapterAudio'
import { courses, getCourseBySlug } from '@/data/academy/courses'
import { getChapterContent, getAuthoredChapterNumbers } from '@/data/academy/chapter-content'
import { tracks, levels } from '@/data/academy/taxonomy'
import { isAcademySpeechConfigured } from '@/lib/speech/azure-speech'

interface PageProps {
  params: Promise<{ slug: string; number: string }>
}

export async function generateStaticParams() {
  const params: { slug: string; number: string }[] = []
  for (const course of courses) {
    const chapterNumbers = getAuthoredChapterNumbers(course.slug)
    for (const n of chapterNumbers) {
      params.push({ slug: course.slug, number: String(n) })
    }
  }
  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, number } = await params
  const course = getCourseBySlug(slug)
  const chapterNum = parseInt(number, 10)
  const chapterMeta = course?.chapters.find((c) => c.number === chapterNum)
  if (!course || !chapterMeta) {
    return { title: 'Chapter not found — Gennoor Academy' }
  }
  return {
    title: `${chapterMeta.title} — ${course.title} | Gennoor Academy`,
    description: `Chapter ${chapterNum} of ${course.title}. ${chapterMeta.objectives[0]}`,
    alternates: {
      canonical: `https://gennoor.com/academy/courses/${course.slug}/chapters/${chapterNum}`,
    },
    openGraph: {
      title: `${chapterMeta.title} — ${course.title}`,
      description: chapterMeta.objectives[0],
      url: `https://gennoor.com/academy/courses/${course.slug}/chapters/${chapterNum}`,
    },
  }
}

export default async function ChapterPage({ params }: PageProps) {
  const { slug, number } = await params
  const chapterNum = parseInt(number, 10)
  if (Number.isNaN(chapterNum)) notFound()

  const course = getCourseBySlug(slug)
  if (!course) notFound()

  const chapterMeta = course.chapters.find((c) => c.number === chapterNum)
  if (!chapterMeta) notFound()

  const content = getChapterContent(slug, chapterNum)
  if (!content) notFound()

  const trackInfo = tracks.find((t) => t.id === course.track)
  const levelInfo = levels.find((l) => l.id === course.level)

  // Find prev/next authored chapters
  const authoredNumbers = getAuthoredChapterNumbers(slug)
  const currentIdx = authoredNumbers.indexOf(chapterNum)
  const prevNum = currentIdx > 0 ? authoredNumbers[currentIdx - 1] : null
  const nextNum =
    currentIdx >= 0 && currentIdx < authoredNumbers.length - 1
      ? authoredNumbers[currentIdx + 1]
      : null
  const prevChapter = prevNum != null ? course.chapters.find((c) => c.number === prevNum) : null
  const nextChapter = nextNum != null ? course.chapters.find((c) => c.number === nextNum) : null

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
          {
            name: chapterMeta.title,
            url: `https://gennoor.com/academy/courses/${course.slug}/chapters/${chapterNum}`,
          },
        ]}
      />

      {/* HERO — chapter framing */}
      <section className="relative py-12 lg:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 bg-gradient-mesh" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Link
              href={`/academy/courses/${course.slug}`}
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors mb-5"
            >
              <ArrowLeft className="w-4 h-4" />
              {course.title}
            </Link>

            <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-bold text-primary-600 bg-primary-50 border border-primary-100/60">
                {trackInfo?.label}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-semibold text-gray-600 bg-gray-50 border border-gray-100">
                {levelInfo?.label}
              </span>
              <span className="text-gray-300">·</span>
              <span className="text-gray-500">
                Chapter {chapterNum} of {course.chapterCount}
              </span>
              <span className="text-gray-300">·</span>
              <span className="inline-flex items-center gap-1 text-gray-500">
                <Clock className="w-3 h-3" /> {chapterMeta.duration}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-bold tracking-tight text-gray-900 mb-4 leading-[1.2]">
              {chapterMeta.isCapstone ? (
                <>
                  <span className="text-amber-500">Capstone:</span> {chapterMeta.title}
                </>
              ) : (
                chapterMeta.title
              )}
            </h1>

            {/* Objectives */}
            <div className="rounded-2xl p-5 glass-card mb-6">
              <p className="text-xs font-bold tracking-widest text-primary-600 uppercase mb-3">
                By the end of this chapter you&apos;ll be able to
              </p>
              <ul className="space-y-2">
                {chapterMeta.objectives.map((obj) => (
                  <li key={obj} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700 leading-relaxed">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Audio narration — rendered when Academy speech is configured */}
            {isAcademySpeechConfigured() && (
              <div className="mb-6">
                <ChapterAudio
                  courseSlug={course.slug}
                  chapterNumber={chapterNum}
                  chapterTitle={chapterMeta.title}
                  estimatedDuration={chapterMeta.duration}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-6 lg:py-8 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <p
              className="text-lg lg:text-xl text-gray-600 leading-relaxed italic"
              dangerouslySetInnerHTML={{ __html: content.intro }}
            />
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-8 lg:py-12 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <ChapterContentRenderer blocks={content.blocks} />
          </div>
        </div>
      </section>

      {/* KEY TAKEAWAYS */}
      <section className="py-10 lg:py-14 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-3xl p-6 lg:p-8 bg-gradient-to-br from-primary-50/60 to-amber-50/40 border border-primary-100/60">
              <p className="text-xs font-bold tracking-widest text-primary-600 uppercase mb-4">
                Key takeaways
              </p>
              <ul className="space-y-3">
                {content.keyTakeaways.map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0 mt-1" />
                    <span className="text-base text-gray-700 leading-relaxed font-medium">
                      {t}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* QUIZ */}
      {content.quiz && content.quiz.length > 0 && (
        <section className="py-10 lg:py-14 relative">
          <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <ChapterQuiz questions={content.quiz} />
            </div>
          </div>
        </section>
      )}

      {/* EXERCISE */}
      {content.exercise && (
        <section className="py-10 lg:py-14 relative">
          <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="rounded-3xl p-6 lg:p-8 bg-amber-50/40 border border-amber-200/60">
                <div className="flex items-center gap-2 mb-3">
                  <Hammer className="w-5 h-5 text-amber-600" />
                  <p className="text-xs font-bold tracking-widest text-amber-700 uppercase">
                    Exercise
                  </p>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {content.exercise.title}
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">
                      What to do
                    </p>
                    <p className="text-base text-gray-700 leading-relaxed">
                      {content.exercise.prompt}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">
                      What you walk away with
                    </p>
                    <p className="text-base text-gray-700 leading-relaxed">
                      {content.exercise.deliverable}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CAPSTONE */}
      {content.capstone && (
        <section className="py-10 lg:py-14 relative">
          <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="rounded-3xl p-6 lg:p-8 bg-gradient-to-br from-amber-50 to-primary-50/40 border border-amber-300/60 glow-border">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-6 h-6 text-amber-600" />
                  <p className="text-xs font-bold tracking-widest text-amber-700 uppercase">
                    Capstone Challenge
                  </p>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {course.capstoneTitle ?? 'Course Capstone'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">
                      Instructions
                    </p>
                    <p className="text-base text-gray-700 leading-relaxed">
                      {content.capstone.instructions}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">
                      Your deliverable
                    </p>
                    <p className="text-base text-gray-700 leading-relaxed">
                      {content.capstone.deliverable}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PREV / NEXT NAV */}
      <section className="py-10 lg:py-14 relative">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevChapter ? (
                <Link
                  href={`/academy/courses/${course.slug}/chapters/${prevChapter.number}`}
                  className="group rounded-2xl p-5 glass-card glow-border transition-all duration-300 hover:-translate-y-0.5"
                >
                  <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1.5 inline-flex items-center gap-1.5">
                    <ArrowLeft className="w-3 h-3" /> Previous chapter
                  </p>
                  <p className="text-sm font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {prevChapter.number}. {prevChapter.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{prevChapter.duration}</p>
                </Link>
              ) : (
                <Link
                  href={`/academy/courses/${course.slug}`}
                  className="group rounded-2xl p-5 glass-card transition-all duration-300 hover:-translate-y-0.5"
                >
                  <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1.5 inline-flex items-center gap-1.5">
                    <ArrowLeft className="w-3 h-3" /> Back to
                  </p>
                  <p className="text-sm font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                    Course overview
                  </p>
                </Link>
              )}

              {nextChapter ? (
                <Link
                  href={`/academy/courses/${course.slug}/chapters/${nextChapter.number}`}
                  className="group rounded-2xl p-5 glass-card glow-border transition-all duration-300 hover:-translate-y-0.5 text-right"
                >
                  <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1.5 inline-flex items-center gap-1.5">
                    Next chapter <ArrowRight className="w-3 h-3" />
                  </p>
                  <p className="text-sm font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {nextChapter.number}. {nextChapter.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{nextChapter.duration}</p>
                </Link>
              ) : (
                <Link
                  href={`/academy/courses/${course.slug}#enablement`}
                  className="group rounded-2xl p-5 bg-gradient-to-br from-amber-50 to-primary-50/40 border border-amber-200/60 transition-all duration-300 hover:-translate-y-0.5 text-right"
                >
                  <p className="text-xs font-bold tracking-widest text-amber-700 uppercase mb-1.5 inline-flex items-center gap-1.5">
                    <Award className="w-3 h-3" /> Course complete
                  </p>
                  <p className="text-sm font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
                    See what comes next →
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* BACK TO COURSE */}
      <section className="py-10 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link
            href={`/academy/courses/${course.slug}`}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            All {course.chapterCount} chapters in {course.title}
          </Link>
        </div>
      </section>
    </>
  )
}
