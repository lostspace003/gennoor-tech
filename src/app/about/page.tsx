import type { Metadata } from 'next'
import Link from 'next/link'
import { ClaudePartnerSection } from '@/components/ClaudePartner'
import { CloudAiIllustration, ExamplesIllustration, PlatformIllustration } from '@/components/illustrations/Illustrations'

export const metadata: Metadata = {
  title: 'About — Gennoor Tech',
  description: 'Gennoor Tech gives people practical AI and cloud knowledge through certification courses, real projects and interactive learning. Mumbai, India.',
  alternates: { canonical: 'https://gennoor.com/about' },
}

const PILLARS = [
  {
    art: PlatformIllustration,
    title: 'Certification',
    body: 'Courses that prepare you for recognised exams in cloud and AI, with labs and quizzes along the way.',
  },
  {
    art: CloudAiIllustration,
    title: 'Projects',
    body: 'Project-based courses built on the problems teams face in production, solved step by step.',
  },
  {
    art: ExamplesIllustration,
    title: 'Interactive learning',
    body: 'Self-paced interactive courses for every role and domain, with a short quiz at the end of each chapter.',
  },
]

const STAND_FOR = [
  { title: 'Practical first', body: 'Every course ends with something you can do.' },
  { title: 'Real problems', body: 'We teach what the work asks for, not only what the syllabus lists.' },
  { title: 'Honest', body: 'We say what a course can and cannot do for you.' },
]

export default function AboutPage() {
  return (
    <main className="bg-white">
      <section className="hero-backdrop px-6 pt-16 lg:pt-[100px] pb-12 text-center">
        <h1 className="display-hero max-w-[820px] mx-auto">Gennoor Tech.</h1>
        <p className="text-[clamp(18px,1.8vw,22px)] leading-[1.5] text-[#6e6e73] max-w-[640px] mx-auto mt-6">
          Practical AI and cloud knowledge, for everyone who wants to build with it.
        </p>
      </section>

      {/* ===== Vision ===== */}
      <section className="px-6 pb-16 lg:pb-[90px]">
        <div className="max-w-[860px] mx-auto text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-600">Our vision</p>
          <h2 className="display-section mt-4">A world where anyone can learn the skills that work asks for, and prove them.</h2>
          <p className="lede mt-5 max-w-[620px] mx-auto">We build towards it with three kinds of learning, in one place: the Learning Studio.</p>
        </div>
        <div className="max-w-[1080px] mx-auto grid md:grid-cols-3 gap-6 mt-12">
          {PILLARS.map(p => (
            <div key={p.title} className="rounded-[18px] border border-[#e8e8ed] p-7">
              <p.art className="w-[84px] h-[84px] mb-5" />
              <h3 className="font-heading text-[19px] font-bold tracking-[-0.01em] text-gray-900">{p.title}</h3>
              <p className="text-[15px] leading-[1.55] text-[#6e6e73] mt-3">{p.body}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/studio" className="pill-primary">Open the Learning Studio</Link>
        </div>
      </section>

      {/* ===== What we stand for ===== */}
      <section className="bg-[#f5f5f7] px-6 py-16 lg:py-[90px]">
        <div className="max-w-[1080px] mx-auto">
          <h2 className="display-section text-center mb-10">What we stand for.</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {STAND_FOR.map(s => (
              <div key={s.title} className="bg-white rounded-[18px] p-6">
                <h3 className="font-heading text-[17px] font-bold text-gray-900">{s.title}</h3>
                <p className="text-[14.5px] leading-[1.55] text-[#6e6e73] mt-2">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ClaudePartnerSection />

      {/* ===== Training, separate from the Learning Studio ===== */}
      <section className="px-6 py-16 lg:py-[90px]">
        <div className="max-w-[720px] mx-auto text-center">
          <h2 className="display-section">We also deliver live training.</h2>
          <p className="lede mt-4">Instructor-led sessions and workshops, taught live from Mumbai.</p>
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-[22px] justify-center items-center mt-8">
            <Link href="/training" className="pill-primary">About training</Link>
            <Link href="/webinars" className="link-arrow">Expert sessions ›</Link>
          </div>
          <p className="text-[15px] text-[#6e6e73] mt-8">
            Based in Mumbai, India. <Link href="/contact" className="text-primary-600 hover:underline">Contact us</Link>.
          </p>
        </div>
      </section>

      <section className="bg-[#f5f5f7] px-6 py-16 lg:py-[90px]">
        <div className="max-w-[1080px] mx-auto">
          <h2 className="display-section text-center mb-10">Find out more.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: 'Learning Studio', href: '/studio', body: 'Certification, project-based and interactive courses.' },
              { title: 'Training', href: '/training', body: 'Live training and workshops.' },
              { title: 'Founder', href: '/about/founder', body: 'Jalal Ahmed Khan.' },
              { title: 'Credentials', href: '/about/certifications', body: 'Certifications held.' },
              { title: 'Work with us', href: '/join', body: 'Trainers and engineers, freelance or full-time.' },
            ].map(c => (
              <Link key={c.title} href={c.href} className="bg-white rounded-[18px] p-6 hover:shadow-md transition-shadow">
                <h3 className="font-heading text-[17px] font-bold text-gray-900">{c.title}</h3>
                <p className="text-[14.5px] text-[#6e6e73] mt-1.5">{c.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
