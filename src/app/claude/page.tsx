import type { Metadata } from 'next'
import Link from 'next/link'
import { AutomationIllustration, PlatformIllustration, TrainingIllustration } from '@/components/illustrations/Illustrations'
import { BOILERPLATE, TIER_LINE } from '@/components/ClaudePartner'

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
  },
  {
    art: PlatformIllustration,
    title: 'Courses built around your processes',
    body: 'A custom course that teaches your people to automate a process they run, using Claude.',
  },
  {
    art: AutomationIllustration,
    title: 'Claude courses by use case',
    body: 'Courses in the Learning Studio built around the problems people face at work, organised by domain.',
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
      <section className="hero-backdrop px-6 pt-16 lg:pt-[100px] pb-14 text-center">
        <h1 className="display-hero max-w-[820px] mx-auto">Claude at Gennoor.</h1>
        <p className="text-[clamp(18px,1.8vw,22px)] leading-[1.5] text-[#6e6e73] max-w-[640px] mx-auto mt-6">
          Training for teams, courses built around their work, and automation built with Claude.
        </p>
      </section>

      {/* Partner Network: approved wording only */}
      <section className="bg-[#faf9f5] px-6 py-16 lg:py-[80px]">
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

      <section className="bg-white px-6 py-16 lg:py-[90px]">
        <div className="max-w-[1080px] mx-auto">
          <h2 className="display-section text-center mb-12">What we do with Claude.</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {WHAT.map(w => (
              <div key={w.title} className="rounded-[18px] border border-[#e8e8ed] p-7">
                <w.art className="w-[84px] h-[84px] mb-5" />
                <h3 className="font-heading text-[19px] font-bold text-gray-900">{w.title}</h3>
                <p className="text-[15px] leading-[1.55] text-[#6e6e73] mt-3">{w.body}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-[22px] justify-center items-center mt-10">
            <Link href="/training" className="link-arrow">Training for organizations ›</Link>
            <Link href="/automation" className="link-arrow">Automation we build ›</Link>
            <Link href="/workshops/claude-cowork" className="link-arrow">Claude workshop recap ›</Link>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f7] px-6 py-16 lg:py-[90px]">
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

      <section className="bg-white px-6 py-16 lg:py-[90px] text-center">
        <h2 className="display-section max-w-[680px] mx-auto">Want Claude to work for your team?</h2>
        <div className="mt-8"><Link href="/contact" className="pill-primary">Talk to us</Link></div>
      </section>
    </main>
  )
}
