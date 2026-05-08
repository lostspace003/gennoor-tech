'use client'

import Link from 'next/link'
import { CheckCircle2, Clock, FileQuestion, PlayCircle } from 'lucide-react'
import ProgressRing from './ProgressRing'
import type { Chapter } from '@/config/courses'

export interface ChapterProgress {
  chapterId: string
  courseId: string
  currentSlide: number
  totalSlides: number
  completionPercent: number
  completed: boolean
  lastAccessed: string
}

interface ChapterListProps {
  courseId: string
  chapters: Chapter[]
  progress?: Record<string, ChapterProgress>
}

export default function ChapterList({ courseId, chapters, progress }: ChapterListProps) {
  const regularChapters = chapters.filter(ch => !ch.isMockExam)
  const mockExam = chapters.find(ch => ch.isMockExam)

  return (
    <div className="space-y-3">
      {regularChapters.map((chapter) => {
        const chProgress = progress?.[chapter.id]
        const isCompleted = chProgress?.completed
        const inProgress = chProgress && !chProgress.completed && chProgress.completionPercent > 0

        return (
          <Link
            key={chapter.id}
            href={`/ai-academy/${courseId}/${chapter.slug}`}
            className="group flex items-center gap-4 p-4 bg-white rounded-xl ring-1 ring-gray-100 hover:ring-primary-200 hover:shadow-md transition-all duration-200 hover:translate-x-1"
          >
            {/* Chapter number */}
            <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-heading font-bold text-sm ${
              isCompleted
                ? 'bg-green-100 text-green-700'
                : inProgress
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-500'
            }`}>
              {isCompleted ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                String(chapter.number).padStart(2, '0')
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                {chapter.title}
              </h3>
              <p className="text-sm text-gray-500 truncate">{chapter.description}</p>
            </div>

            {/* Meta */}
            <div className="hidden sm:flex items-center gap-4 flex-shrink-0">
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3.5 h-3.5" />
                {chapter.estimatedMinutes} min
              </span>
              {chProgress && chProgress.completionPercent > 0 ? (
                <ProgressRing percent={chProgress.completionPercent} size={36} strokeWidth={3} />
              ) : (
                <PlayCircle className="w-5 h-5 text-gray-300 group-hover:text-primary-400 transition-colors" />
              )}
            </div>
          </Link>
        )
      })}

      {/* Mock Exam */}
      {mockExam && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Assessment</h3>
          <Link
            href={`/ai-academy/${courseId}/${mockExam.slug}`}
            className="group flex items-center gap-4 p-4 bg-gradient-to-r from-secondary-50 to-orange-50 rounded-xl ring-1 ring-secondary-200 hover:ring-secondary-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary-100 text-secondary-700 flex items-center justify-center">
              <FileQuestion className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-semibold text-gray-900 group-hover:text-secondary-700 transition-colors">
                {mockExam.title}
              </h3>
              <p className="text-sm text-gray-500">{mockExam.description}</p>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              {mockExam.estimatedMinutes} min
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}
