import type { Metadata } from 'next'
import Link from 'next/link'
import { BadgeCheck, BookOpen, Building2, CloudCog, Ear, PencilRuler, Presentation, Users, Workflow } from 'lucide-react'
import ProgramCarousel from '@/components/training/ProgramCarousel'
import { getAllPrograms } from '@/data/training-programs'
import ClaudeCourseCarousels from '@/components/training/ClaudeCourseCarousels'
import { OpenCustomTraining } from '@/components/custom-training/CustomTraining'
import Ground from '@/components/stage/Ground'
import { Ico, SparkIco } from '@/components/stage/Ico'

export const metadata: Metadata = {
  title: 'Training — Gennoor Tech',
  description: 'Live training for teams, built around the work they do: Claude, Microsoft AI and custom automation courses.',
  alternates: { canonical: 'https://gennoor.com/training' },
}

const AUDIENCES = [
  { icon: Users, tone: 'blue', title: 'Smaller teams', body: 'One tool or one process. A short course on what they will use on Monday.' },
  { icon: Building2, tone: 'violet', title: 'Larger organizations', body: 'Several teams, different roles. A program in parts, so each group learns what it needs.' },
] as const

const TOPICS = [
  { icon: null, tone: 'claude', title: 'Claude', body: 'Claude for everyday work, Claude Cowork and Claude Code.', href: '/claude', cta: 'About Claude' },
  { icon: Workflow, tone: 'green', title: 'Automation courses', body: 'A course built on one process your team runs, so they learn to automate it themselves.', href: '/automation', cta: 'About automation' },
  { icon: CloudCog, tone: 'blue', title: 'Microsoft AI', body: 'Azure AI, Copilot Studio and certification exam preparation.', href: '/services/training', cta: 'See the programs' },
] as const

/** How a course for a team is made. It is a sequence, so it is numbered. */
const BUILD = [
  { icon: Ear, tone: 'blue', title: 'We learn your work', body: 'We start with what your people do every day.' },
  { icon: PencilRuler, tone: 'violet', title: 'We build the course', body: 'Examples and exercises come from your context.' },
  { icon: Presentation, tone: 'gold', title: 'We teach it live', body: 'Online or at your office, hands-on.' },
] as const

/** A learning platform for a company: what is theirs on it. */
const YOURS = [
  { icon: BookOpen, tone: 'blue', text: 'Your courses' },
  { icon: Users, tone: 'violet', text: 'Your people' },
  { icon: BadgeCheck, tone: 'gold', text: 'Your name' },
] as const
const turn = (i: number) => ({ '--i': i }) as React.CSSProperties

export default function TrainingPage() {
  const programs = getAllPrograms().map(p => ({ slug: p.slug, title: p.title, duration: p.duration, level: p.level, description: p.description, category: p.category }))
  return (
    <main>
      {/* ===== Top: the sentence, and the three steps every team course goes through ===== */}
      <Ground glow="deep" mx={60} my={44} className="px-4 sm:px-6 pt-8 lg:pt-12 pb-10 lg:pb-14">
        <div className="max-w-[1120px] mx-auto grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-9 lg:gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="st-rise display-hero">Training for your team.</h1>
            <p className="st-rise text-[clamp(17px,1.6vw,21px)] leading-[1.5] text-gray-600 max-w-[520px] mx-auto lg:mx-0 mt-5" style={turn(1)}>
              Live training built around the work your people do.
            </p>
            <div className="st-rise flex flex-col sm:flex-row flex-wrap gap-x-6 gap-y-4 justify-center lg:justify-start items-center mt-8" style={turn(2)}>
              <OpenCustomTraining className="st-pill">Ask for custom training</OpenCustomTraining>
              <Link href="/services/training" className="st-link text-[16px]">See the programs ›</Link>
              <Link href="/webinars" className="st-link text-[16px]">Expert sessions ›</Link>
            </div>
          </div>
          <ol className="grid gap-3" aria-label="How a course is built">
            {BUILD.map((b, i) => (
              <li key={b.title} className="st-left st-card relative flex items-center gap-5 p-5" style={turn(i + 2)}>
                <Ico icon={b.icon} tone={b.tone} size={64} />
                <div className="min-w-0">
                  <h2 className="text-[19.5px] font-bold tracking-[-0.01em] text-gray-900">{b.title}</h2>
                  <p className="text-[15px] leading-[1.5] text-gray-600 mt-1">{b.body}</p>
                </div>
                <span className="st-num absolute right-5 top-3.5 !text-[34px]" aria-hidden="true">0{i + 1}</span>
              </li>
            ))}
          </ol>
        </div>
      </Ground>

      <section id="programs" className="px-4 sm:px-6 py-10 lg:py-14">
        <div className="max-w-[1120px] mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 mb-7">
            <div className="max-w-[620px]">
              <h2 className="display-section">Training programs.</h2>
              <p className="lede mt-3">Bootcamps and courses for teams. Pick one to see the outline and what it covers.</p>
            </div>
            <Link href="/services/training" className="st-link text-[16px] whitespace-nowrap">See all programs ›</Link>
          </div>
          <ProgramCarousel programs={programs} />
        </div>
      </section>

      <ClaudeCourseCarousels className="bg-gray-50" />

      {/* ===== What we teach ===== */}
      <section className="px-4 sm:px-6 py-10 lg:py-14" aria-labelledby="what-we-teach">
        <div className="max-w-[1120px] mx-auto">
          <h2 id="what-we-teach" className="display-section">What we teach.</h2>
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            {TOPICS.map(t => (
              <Link key={t.title} href={t.href} className="st-card group flex flex-col p-6">
                {t.icon ? <Ico icon={t.icon} tone={t.tone} size={60} /> : <SparkIco size={60} />}
                <h3 className="text-[19.5px] font-bold tracking-[-0.01em] text-gray-900 mt-5">{t.title}</h3>
                <p className="text-[15px] leading-[1.55] text-gray-600 mt-2 flex-1">{t.body}</p>
                <span className="st-link text-[14.5px] mt-5">{t.cta} ›</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== For any size of team ===== */}
      <section className="bg-gray-50 px-4 sm:px-6 py-10 lg:py-14" aria-labelledby="any-size">
        <div className="max-w-[1120px] mx-auto">
          <h2 id="any-size" className="display-section">For any size of team.</h2>
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            {AUDIENCES.map(a => (
              <div key={a.title} className="st-card flex items-start gap-5 p-6">
                <Ico icon={a.icon} tone={a.tone} size={60} />
                <div>
                  <h3 className="text-[20px] font-bold tracking-[-0.01em] text-gray-900">{a.title}</h3>
                  <p className="text-[15.5px] leading-[1.55] text-gray-600 mt-1.5">{a.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== A learning platform of the company's own ===== */}
      <section className="px-4 sm:px-6 py-10 lg:py-14" aria-labelledby="own-platform">
        <div className="max-w-[1120px] mx-auto grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] gap-8 lg:gap-12 items-center">
          <div>
            <h2 id="own-platform" className="display-section">A home for your training.</h2>
            <p className="lede mt-3.5 max-w-[560px]">
              If training is a regular need, we set up a learning platform for your company and build the courses that go on it: video lessons, labs, quizzes, certificates, an assistant inside the lesson and a question board answered by a trainer. In the cloud or on your premises.
            </p>
            <div className="mt-7"><Link href="/contact" className="st-pill st-ghost">Tell us what you need</Link></div>
          </div>
          <ul className="grid gap-3">
            {YOURS.map(y => (
              <li key={y.text} className="st-card flex items-center gap-5 px-5 py-4">
                <Ico icon={y.icon} tone={y.tone} size={54} />
                <span className="text-[clamp(22px,2.6vw,30px)] font-bold tracking-[-0.02em] text-gray-900">{y.text}.</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-gray-50 px-4 sm:px-6 py-12 lg:py-16 text-center">
        <h2 className="display-section max-w-[680px] mx-auto">Prefer to learn on your own?</h2>
        <p className="lede mt-3.5 max-w-[480px] mx-auto">Video courses with labs and quizzes in the Learning Studio.</p>
        <div className="mt-8"><Link href="/studio" className="st-pill">Open the Learning Studio</Link></div>
      </section>
    </main>
  )
}
