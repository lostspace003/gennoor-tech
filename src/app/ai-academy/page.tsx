'use client'

import WalkthroughVideo from '@/components/WalkthroughVideo'
import Link from 'next/link'
import { BookOpen, Trophy, ArrowRight, GraduationCap, BarChart3, Layers, Sparkles } from 'lucide-react'
import InteractiveCoursesCatalog, { type EnrichedCourse } from '@/components/academy/InteractiveCoursesCatalog'
import AcademyBar from '@/components/academy/AcademyBar'
import AcademySwitch from '@/components/academy/AcademySwitch'
import LabsSpotlight from '@/components/academy/LabsSpotlight'
import LearnerAccountMenu from '@/components/academy/LearnerAccountMenu'
import ProfileSetupGate from '@/components/academy/ProfileSetupGate'
import { courses as configCourses } from '@/config/courses'
import { courses as academyCourses } from '@/data/academy/courses'

// Join config courses (with theme + chapters) to academy metadata (with track/level/audience/industry) by id == slug
const enriched: EnrichedCourse[] = configCourses.map(cfg => ({
  config: cfg,
  meta: academyCourses.find(a => a.slug === cfg.id),
}))

const totalCourses = enriched.length
const totalAcademyCatalog = academyCourses.length

export default function AcademyPage() {
  return (
    <main className="min-h-screen">
      {/* Signed-in learners finish registering before going any further. */}
      <ProfileSetupGate />

      <AcademyBar section="AI Essentials" />

      {/* Hero — leads with the Academy's positioning, same promise as
          /academy, before narrowing to the interactive format below. */}
      <section className="relative py-6 lg:py-8 overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-6 flex justify-center"><AcademySwitch active="essentials" /></div>
            <h1 className="font-heading text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.05] mb-4">
              Learn something useful in an hour.
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-6 max-w-2xl mx-auto">
              {totalCourses} interactive courses with animated slides, narration and a short quiz. A certificate when you finish.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="#courses"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-primary-600 text-white text-sm font-semibold rounded-xl transition-all duration-300"
              >
                Browse the {totalCourses} courses
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-10">
        <p className="text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-gray-500 mb-4">How the Learning Studio works</p>
        <WalkthroughVideo />
      </section>

      {/* Course Catalog (grouped + filterable) */}
      <InteractiveCoursesCatalog courses={enriched} />

      <LabsSpotlight />

      {/* How it works */}
      <section className="section-padding relative">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Three steps from opening the first chapter to applying what you learned.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '01',
                icon: BookOpen,
                title: 'Get started',
                description: 'Create an account once and every course opens. Pick a course; open it; learn.',
              },
              {
                step: '02',
                icon: BarChart3,
                title: 'Track progress',
                description: 'Your progress saves automatically in your browser — completed chapters get a tick, and you resume from where you left off.',
              },
              {
                step: '03',
                icon: Trophy,
                title: 'Ship the capstone',
                description: 'Every course ends in a capstone — a one-page roadmap, plan, or production-grade artifact applied to your context.',
              },
            ].map(item => (
              <div key={item.step} className="text-center p-6 rounded-2xl bg-white border border-gray-200/70 shadow-sm">
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 mb-4">
                  <item.icon className="w-7 h-7 text-primary-600" />
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-gray-400 text-gray-900 text-xs font-bold rounded-full flex items-center justify-center">
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
