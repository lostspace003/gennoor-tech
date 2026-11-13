'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, BarChart3, Award, BookOpen } from 'lucide-react'
import type { Course } from '@/config/courses'

interface CourseCardProps {
  course: Course
  overallProgress?: number
}

export default function CourseCard({ course, overallProgress = 0 }: CourseCardProps) {
  // A course without its generated thumbnail yet falls back to the themed block.
  const [imageFailed, setImageFailed] = useState(false)
  const headerStyle = course.theme
    ? { background: course.theme.primaryDeep }
    : undefined

  return (
    <Link
      href={`/ai-academy/${course.id}`}
      className="group flex flex-col h-full bg-raised rounded-[18px] border border-gray-200 hover:border-gray-300 transition-colors duration-200 overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        {imageFailed ? (
          <div
            className={`w-full h-full p-6 flex items-end ${course.theme ? '' : 'bg-gray-900'}`}
            style={headerStyle}
          >
            <span className="text-white font-bold tracking-[-0.01em] text-[22px] leading-tight">{course.shortTitle}</span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.thumbnail}
            alt=""
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
        {overallProgress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10">
            <div className="h-full bg-primary-600 transition-all duration-500" style={{ width: `${overallProgress}%` }} />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col flex-1">
        {/* Micro-meta line */}
        <div className="text-[11px] font-semibold tracking-[0.1em] uppercase text-green-600 mb-2.5">
          Interactive
          <span className="text-gray-400 font-medium normal-case tracking-normal">
            {' '}· {course.totalChapters} chapters · audio included
          </span>
        </div>

        <h3 className="font-bold tracking-[-0.01em] text-[20px] leading-snug text-gray-900 mb-2">{course.title}</h3>

        <p className="text-gray-600 text-sm leading-relaxed mb-4">{course.description}</p>

        {/* Meta */}
        <div className="grid grid-cols-2 gap-3 mb-4 mt-auto">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <BookOpen className="w-4 h-4 text-primary-500" />
            <span>{course.totalChapters} Chapters</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4 text-primary-500" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <BarChart3 className="w-4 h-4 text-primary-500" />
            <span>{course.level}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Award className="w-4 h-4 text-primary-500" />
            <span>{course.certification}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="text-xs text-gray-400 mb-5 truncate">
          {course.tags.slice(0, 4).join(' · ')}
        </div>

        {/* Open-access signal */}
        {overallProgress === 0 && (
          <p className="text-xs text-gray-400 mb-4">
            Sign in to start · certificate on completion
          </p>
        )}

        {/* CTA */}
        <div className="flex items-center justify-between pt-3.5 border-t border-gray-100">
          <span className="text-[13px] font-semibold text-primary-600 group-hover:text-primary-500 transition-colors">
            {overallProgress > 0 ? 'Continue learning ›' : 'Start learning ›'}
          </span>
        </div>
      </div>
    </Link>
  )
}
