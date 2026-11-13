import { notFound } from 'next/navigation'
import { pageMeta, metaDescription } from '@/lib/seo'
import type { Metadata } from 'next'
import { getCourseById, getChapterBySlug, getAdjacentChapters, courses } from '@/config/courses'
import ChapterViewer from '@/components/academy/ChapterViewer'

interface PageProps {
  params: Promise<{ courseId: string; chapter: string }>
}

export async function generateStaticParams() {
  const result: { courseId: string; chapter: string }[] = []
  for (const course of courses) {
    for (const ch of course.chapters) {
      result.push({ courseId: course.id, chapter: ch.slug })
    }
  }
  return result
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { courseId, chapter: chapterSlug } = await params
  const chapter = getChapterBySlug(courseId, chapterSlug)
  const course = getCourseById(courseId)
  if (!chapter || !course) return {}
  return pageMeta({
    title: `${chapter.title} — ${course.shortTitle}`,
    description: metaDescription(chapter.description),
    path: `/ai-academy/${courseId}/${chapterSlug}`,
    // the share picture of the course this chapter belongs to
    image: `/ai-academy/${courseId}/opengraph-image`,
  })
}

export default async function ChapterPage({ params }: PageProps) {
  const { courseId, chapter: chapterSlug } = await params
  const course = getCourseById(courseId)
  const chapter = getChapterBySlug(courseId, chapterSlug)
  if (!course || !chapter) notFound()

  const { prev, next } = getAdjacentChapters(courseId, chapterSlug)

  return (
    <ChapterViewer
      courseId={courseId}
      chapter={chapter}
      prevChapter={prev}
      nextChapter={next}
      allChapters={course.chapters}
    />
  )
}
