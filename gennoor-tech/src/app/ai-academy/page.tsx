'use client'

import { BookOpen, Trophy, Headphones, ArrowRight, GraduationCap, BarChart3, Award } from 'lucide-react'
import CourseCard from '@/components/academy/CourseCard'
import { courses } from '@/config/courses'

export default function AcademyPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0C1426] via-[#1E3A8A] to-accent-700 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full text-sm text-white/90 mb-6">
              <span className="w-2 h-2 bg-secondary-400 rounded-full animate-pulse" />
              100% Free — No Credit Card Required
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              AI Academy
            </h1>
            <p className="text-lg sm:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl mx-auto">
              Free courses for everyone — technical, non-technical, business, HR, or any domain.
              Learn AI at your own pace with interactive slides, mock exams, and audio narration.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-10">
              {[
                { icon: BookOpen, label: 'Self-Paced Learning', value: '100%' },
                { icon: Headphones, label: 'Audio Narration', value: 'Built-in' },
                { icon: Trophy, label: 'Cross-Device Sync', value: 'Seamless' },
                { icon: Award, label: 'Price', value: 'Free Forever' },
              ].map(stat => (
                <div key={stat.label} className="flex items-center gap-3 text-white/90">
                  <stat.icon className="w-5 h-5 text-secondary-400" />
                  <div className="text-left">
                    <p className="text-lg font-bold">{stat.value}</p>
                    <p className="text-xs text-white/60">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="#courses"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-secondary-400 text-dark-900 font-bold rounded-lg hover:bg-secondary-300 transition-colors"
            >
              Browse Courses
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Course Catalog */}
      <section id="courses" className="section-padding bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-3">Available Courses</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Start with our flagship AB-100 certification course. More courses coming soon.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}

            {/* Coming soon placeholder */}
            <div className="rounded-2xl border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center text-center min-h-[380px]">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <GraduationCap className="w-7 h-7 text-gray-400" />
              </div>
              <h3 className="font-heading font-semibold text-gray-500 mb-2">More Courses Coming</h3>
              <p className="text-sm text-gray-400">New certification prep courses are in development.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-padding">
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
              <div key={item.step} className="text-center">
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
