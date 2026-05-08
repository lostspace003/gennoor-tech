'use client'

import Link from 'next/link'
import { Clock, BarChart3, Award, BookOpen, ArrowRight } from 'lucide-react'
import type { Course } from '@/config/courses'

interface CourseCardProps {
  course: Course
  overallProgress?: number
}

export default function CourseCard({ course, overallProgress = 0 }: CourseCardProps) {
  return (
    <Link
      href={`/ai-academy/${course.id}`}
      className="group block bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden ring-1 ring-gray-100"
    >
      {/* Gradient header */}
      <div className="relative h-48 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 p-6 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <span className="inline-flex items-center px-3 py-1 text-xs font-bold bg-secondary-400 text-dark-900 rounded-full uppercase">
            {course.badge}
          </span>
          <span className="text-white/80 text-sm font-medium">{course.shortTitle}</span>
        </div>
        <div>
          <h3 className="text-white font-heading font-bold text-xl leading-tight">{course.title}</h3>
        </div>
        {overallProgress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div className="h-full bg-secondary-400 transition-all duration-500" style={{ width: `${overallProgress}%` }} />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-6">
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
        <div className="flex flex-wrap gap-1.5 mb-5">
          {course.tags.slice(0, 4).map(tag => (
            <span key={tag} className="px-2 py-0.5 text-xs font-medium bg-primary-50 text-primary-700 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-sm font-semibold text-primary-600 group-hover:text-primary-700 transition-colors">
            {overallProgress > 0 ? 'Continue Learning' : 'Start Learning'}
          </span>
          <ArrowRight className="w-5 h-5 text-primary-500 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  )
}
