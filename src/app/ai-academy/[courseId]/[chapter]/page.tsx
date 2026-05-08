import { notFound } from 'next/navigation'
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
  return {
    title: `${chapter.title} — ${course.shortTitle}`,
    description: chapter.description,
  }
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
