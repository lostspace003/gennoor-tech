import type { Metadata } from 'next'
import Link from 'next/link'
import { AutomationIllustration, PlatformIllustration, TrainingIllustration } from '@/components/illustrations/Illustrations'
import { BOILERPLATE, TIER_LINE } from '@/components/ClaudePartner'
import ClaudeCourseCarousels from '@/components/training/ClaudeCourseCarousels'

// The course cards carry short-lived image links, so this page is rendered per request.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Claude — Gennoor Tech',
  description: 'Gennoor is Certified in the Claude Partner Network. Claude training for teams, courses built around your processes, and automation built with Claude.',
  alternates: { canonical: 'https://gennoor.com/claude' },
}

const WHAT = [
  {
    art: TrainingIllustration,
    title: 'Claude training for teams',
    body: 'Live sessions on Claude for everyday work, Claude Cowork and Claude Code, built around what your team actually does.',
    href: '/workshops/claude-cowork',
    cta: 'Claude workshop recap',
  },
  {
    art: PlatformIllustration,
    title: 'Custom Claude courses',
    body: 'A custom course that teaches your people to automate a process they run, using Claude.',
    href: '/training',
    cta: 'Training for organizations',
  },
  {
    art: AutomationIllustration,
    title: 'Claude courses by use case',
    body: 'Courses in the Learning Studio built around the problems people face at work, organised by domain.',
    href: '/studio?company=Claude',
    cta: 'See Claude courses',
  },
]

// The use-case domains Claude courses will be organised by. These courses are being prepared.
const DOMAINS = [
  'Software development',
  'DevOps and infrastructure operations',
  'Data analysis and business intelligence',
  'Document processing',
  'Knowledge retrieval and enterprise search',
  'Content creation',
  'Customer support',
  'Sales and revenue operations',
  'Meeting and conversation intelligence',
  'Research',
  'Cybersecurity',
  'Compliance and regulatory',
  'Education and learning',
  'Business process and operations',
]

export default function ClaudePage() {
  return (
    <main className="bg-white">
      <section className="hero-backdrop px-6 pt-8 lg:pt-10 pb-10 text-center">
        <h1 className="display-hero max-w-[820px] mx-auto">Claude at Gennoor.</h1>
        <p className="text-[clamp(18px,1.8vw,22px)] leading-[1.5] text-[#6e6e73] max-w-[640px] mx-auto mt-6">
          Training for teams, courses built around their work, and automation built with Claude.
        </p>
      </section>

      {/* Partner Network: approved wording only */}
      <section className="bg-[#faf9f5] px-6 py-10 lg:py-14">
        <div className="max-w-[860px] mx-auto grid sm:grid-cols-[190px_1fr] gap-10 items-center">
          <div className="mx-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/cpn/cpn-certified-vertical.svg" alt="Claude Partner Network - Certified" width={170} className="h-auto" />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="font-heading text-[26px] font-bold tracking-[-0.02em] text-gray-900">Claude Partner Network</h2>
            <p className="text-[18px] font-semibold text-gray-900 mt-3">{TIER_LINE}</p>
            <p className="text-[15.5px] leading-[1.65] text-[#52525b] mt-3">{BOILERPLATE}</p>
          </div>
        </div>
      </section>

      {/* Certification prep: the four official Claude certifications */}
      <section className="bg-white px-6 py-10 lg:py-14">
        <div className="max-w-[900px] mx-auto text-center">
          <p className="kicker">New</p>
          <h2 className="display-section mt-3">Get Claude certified.</h2>
          <p className="lede mt-3.5 max-w-[620px] mx-auto">
            Story-driven prep for all four official Anthropic certifications — interactive courses,
            animations, and full-length practice exams. Free to read.
          </p>
          <ul className="flex flex-wrap justify-center gap-2.5 mt-7">
            {['CCAS-F · Associate', 'CCDV-F · Developer', 'CCAR-F · Architect', 'CCAR-P · Architect Pro'].map(c => (
              <li key={c} className="px-4 py-2 rounded-full bg-[#faf9f5] border border-[#e2e5ec] text-[13.5px] font-semibold text-[#3a3a3f]">{c}</li>
            ))}
          </ul>
          <div className="mt-9">
            <Link href="/claude/certifications" className="pill-primary">Explore certification prep</Link>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f7] px-6 py-10 lg:py-14">
        <div className="max-w-[1080px] mx-auto">
          <h2 className="display-section text-center mb-12">What we do with Claude.</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {WHAT.map(w => (
              <div key={w.title} className="rounded-[18px] border border-[#e8e8ed] p-7 flex flex-col items-center text-center">
                <w.art className="w-[104px] h-[104px] mb-5" />
                <h3 className="font-heading text-[19px] font-bold text-gray-900">{w.title}</h3>
                <p className="text-[15px] leading-[1.55] text-[#6e6e73] mt-2 flex-1">{w.body}</p>
                <Link href={w.href} className="link-arrow !text-[15px] mt-5">{w.cta} ›</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course catalogue: always open, no tab or click needed to see the courses */}
      <ClaudeCourseCarousels />

      <section className="bg-[#f5f5f7] px-6 py-10 lg:py-14">
        <div className="max-w-[900px] mx-auto text-center">
          <h2 className="display-section">Claude courses by domain.</h2>
          <p className="lede mt-3.5 max-w-[600px] mx-auto">
            We are preparing Claude courses for these lines of work. They will appear in the Learning Studio as they are ready.
          </p>
          <ul className="flex flex-wrap justify-center gap-2.5 mt-9">
            {DOMAINS.map(d => (
              <li key={d} className="px-4 py-2 rounded-full bg-white border border-[#e2e5ec] text-[14px] text-[#3a3a3f]">{d}</li>
            ))}
          </ul>
          <div className="mt-10">
            <Link href="/studio?company=Claude" className="pill-primary">See Claude courses</Link>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-10 lg:py-14 text-center">
        <h2 className="display-section max-w-[680px] mx-auto">Want Claude to work for your team?</h2>
        <div className="mt-8"><Link href="/contact" className="pill-primary">Talk to us</Link></div>
      </section>
    </main>
  )
}
