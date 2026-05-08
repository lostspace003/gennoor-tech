import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCourseById, courses } from '@/config/courses'
import CourseDetailClient from './CourseDetailClient'

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
  return {
    title: course.title,
    description: course.description,
  }
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { courseId } = await params
  const course = getCourseById(courseId)
  if (!course) notFound()

  return <CourseDetailClient course={course} />
}
