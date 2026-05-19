'use client'

import Link from 'next/link'
import { BookOpen, Trophy, ArrowRight, GraduationCap, BarChart3, Layers } from 'lucide-react'
import CourseCard from '@/components/academy/CourseCard'
import { courses } from '@/config/courses'

export default function AcademyPage() {
  return (
    <main className="min-h-screen">
      {/* Banner — part of the broader Gennoor Academy */}
      <section className="relative">
        <div className="bg-gradient-to-r from-primary-50 via-amber-50 to-primary-50 border-b border-primary-100/60">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
              <div className="inline-flex items-center gap-1.5 text-xs text-gray-600">
                <Layers className="w-3.5 h-3.5 text-primary-500" />
                <span>
                  <strong className="text-gray-900">Interactive Courses</strong> · part of{' '}
                  <strong className="text-gray-900">Gennoor Academy</strong>
                </span>
              </div>
              <Link
                href="/academy"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                Browse all 42 courses across 6 tracks
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Hero — focused on the interactive experience */}
      <section className="relative py-12 lg:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 bg-gradient-mesh" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center rounded-full px-3 py-1 mb-5 text-xs font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/60">
              <span className="w-2 h-2 bg-secondary-400 rounded-full animate-pulse mr-2" />
              Free · Self-paced · Audio-narrated · Cross-device sync
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-5">
              Interactive Courses
            </h1>
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed mb-8 max-w-2xl mx-auto">
              Full web-rendered learning experience — slides, narration, quizzes, mock exams,
              progress tracking across devices. Currently featuring <strong className="text-gray-700">AB-100: Architecting Agentic AI Business Solutions</strong>. More interactive courses ship through 2026.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="#courses"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold rounded-xl hover:shadow-glow-blue transition-all duration-300"
              >
                Browse interactive courses
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/academy"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold rounded-xl text-gray-700 glass-card hover:border-primary-200 transition-all duration-300"
              >
                Or browse the full Academy catalog
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Course Catalog */}
      <section id="courses" className="section-padding relative">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-3">Available Interactive Courses</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Currently featuring our flagship AB-100 certification course. More interactive
              courses are in development — meanwhile, the full Academy catalog has 41 more
              non-interactive courses live.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}

            {/* Cross-link to /academy */}
            <Link
              href="/academy"
              className="group rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[380px] glass-card glow-border transition-all duration-500 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-full bg-primary-50/80 flex items-center justify-center mb-4">
                <GraduationCap className="w-7 h-7 text-primary-500" />
              </div>
              <h3 className="font-heading font-semibold text-gray-900 mb-2">
                Looking for more?
              </h3>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                The full Gennoor Academy has 41 more courses across Foundations, Function,
                Leadership, Industry, Builder, and Applied tracks.
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 group-hover:translate-x-1 transition-transform">
                Browse Academy <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-padding relative">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '01',
                icon: BookOpen,
                title: 'Start Learning',
                description: 'Open any chapter and start learning immediately. No account required for the first two chapters.',
              },
              {
                step: '02',
                icon: BarChart3,
                title: 'Track Progress',
                description: 'Sign in with Google, Microsoft, or email to save your progress across devices and sessions.',
              },
              {
                step: '03',
                icon: Trophy,
                title: 'Get Certified',
                description: 'Complete all chapters, pass the mock exam, and go into your certification exam with confidence.',
              },
            ].map(item => (
              <div key={item.step} className="text-center p-6 rounded-2xl glass-card">
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 mb-4">
                  <item.icon className="w-7 h-7 text-primary-600" />
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-secondary-400 text-dark-900 text-xs font-bold rounded-full flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-heading font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
