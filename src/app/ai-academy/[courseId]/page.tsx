import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCourseById, courses } from '@/config/courses'
import CourseDetailClient from './CourseDetailClient'
import { CourseJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd'

interface PageProps {
  params: Promise<{ courseId: string }>
}

export async function generateStaticParams() {
  return courses.map(c => ({ courseId: c.id }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { courseId } = await params
  const course = getCourseById(courseId)
  if (!course) return {}
  const url = `https://gennoor.com/ai-academy/${courseId}`
  // OG image — Next.js auto-detects opengraph-image.tsx in this folder if present.
  // Fallback to the global brand OG image for now.
  return {
    title: `${course.title} — Gennoor Academy`,
    description: course.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: `${course.title} — Gennoor Academy`,
      description: course.description,
      siteName: 'Gennoor Tech',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${course.title} — Gennoor Academy`,
      description: course.description,
    },
    keywords: course.tags,
  }
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { courseId } = await params
  const course = getCourseById(courseId)
  if (!course) notFound()

  const url = `https://gennoor.com/ai-academy/${courseId}`
  return (
    <>
      <CourseJsonLd
        title={course.title}
        description={course.description}
        url={url}
        courseCode={course.id}
        duration={course.duration}
        level={course.level}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://gennoor.com' },
          { name: 'AI Academy', url: 'https://gennoor.com/ai-academy' },
          { name: course.title, url },
        ]}
      />
      <CourseDetailClient course={course} />
    </>
  )
}
