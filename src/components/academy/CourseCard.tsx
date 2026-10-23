'use client'

import Link from 'next/link'
import { Clock, BarChart3, Award, BookOpen } from 'lucide-react'
import type { Course } from '@/config/courses'

interface CourseCardProps {
  course: Course
  overallProgress?: number
}

export default function CourseCard({ course, overallProgress = 0 }: CourseCardProps) {
  const headerStyle = course.theme
    ? { background: course.theme.primaryDeep }
    : undefined

  return (
    <Link
      href={`/ai-academy/${course.id}`}
      className="group block bg-white rounded-[18px] border border-[#e8e8ed] hover:border-[#d2d2d7] transition-colors duration-200 overflow-hidden"
    >
      {/* Themed header */}
      <div
        className={`relative h-48 p-6 flex flex-col justify-between ${course.theme ? '' : ' bg-[#1d1d1f] '}`}
        style={headerStyle}
      >
        <div className="flex items-start justify-between">
          <span className="inline-flex items-center text-[10.5px] font-semibold text-white/70 uppercase tracking-[0.12em]">
            {course.badge}
          </span>
          <span className="text-white/70 text-[13px] font-medium">{course.shortTitle}</span>
        </div>
        <div>
          <h3 className="text-white font-bold tracking-[-0.01em] text-[22px] leading-tight">{course.title}</h3>
        </div>
        {overallProgress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div className="h-full bg-white/70 transition-all duration-500" style={{ width: `${overallProgress}%` }} />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Micro-meta line */}
        <div className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#1d8348] mb-3.5">
          Free · Interactive
          <span className="text-[#86868b] font-medium normal-case tracking-normal">
            {' '}· {course.totalChapters} chapters · audio included
          </span>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed mb-4">{course.description}</p>

        {/* Meta */}
        <div className="grid grid-cols-2 gap-3 mb-4">
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
        <div className="text-xs text-[#86868b] mb-5">
          {course.tags.slice(0, 4).join(' · ')}
        </div>

        {/* Open-access signal */}
        {overallProgress === 0 && (
          <p className="text-xs text-[#86868b] mb-4">
            Free with sign-in · certificate on completion
          </p>
        )}

        {/* CTA */}
        <div className="flex items-center justify-between pt-3.5 border-t border-[#f0f0f2]">
          <span className="text-[13px] font-semibold text-primary-600 group-hover:text-[#0077ed] transition-colors">
            {overallProgress > 0 ? 'Continue learning ›' : 'Start learning ›'}
          </span>
        </div>
      </div>
    </Link>
  )
}
