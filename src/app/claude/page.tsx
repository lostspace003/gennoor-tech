import type { Metadata } from 'next'
import Link from 'next/link'
import { PencilRuler, Users, Workflow } from 'lucide-react'
import { BOILERPLATE, PROGRAM_URL, TIER_LINE } from '@/components/ClaudePartner'
import ClaudeCourseCarousels from '@/components/training/ClaudeCourseCarousels'
import { CLAUDE_CERTS } from '@/data/claude-certifications'
import Ground from '@/components/stage/Ground'
import Reveal from '@/components/stage/Reveal'
import { Ico, SparkIco } from '@/components/stage/Ico'

// The course cards carry short-lived image links, so this page is rendered per request.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Claude — Gennoor Tech',
  description: 'Gennoor is Certified in the Claude Partner Network. Claude training for teams, courses built around your processes, and automation built with Claude.',
  alternates: { canonical: 'https://gennoor.com/claude' },
}

const WHAT = [
  {
    icon: Users,
    tone: 'claude',
    title: 'Claude training for teams',
    body: 'Live sessions on Claude for everyday work, Claude Cowork and Claude Code, built around what your team actually does.',
    href: '/workshops/claude-cowork',
    cta: 'Claude workshop recap',
  },
  {
    icon: PencilRuler,
    tone: 'violet',
    title: 'Custom Claude courses',
    body: 'A custom course that teaches your people to automate a process they run, using Claude.',
    href: '/training',
    cta: 'Training for organizations',
  },
  {
    icon: Workflow,
    tone: 'gold',
    title: 'Claude courses by use case',
    body: 'Courses in the Learning Studio built around the problems people face at work, organised by domain.',
    href: '/studio?company=Claude',
    cta: 'See Claude courses',
  },
] as const

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
const DOTS = ['#e58a62', '#7cc0ff', '#ffc24b', '#b3a4ff', '#3ed598']

/** The short name of a certification: "Claude Certified Architect – Professional" -> "Architect, Professional". */
const shortName = (name: string) => name.replace(/^Claude Certified\s+/, '').replace(/\s+[–-]\s+/, ', ')
const turn = (i: number) => ({ '--i': i }) as React.CSSProperties

export default function ClaudePage() {
  return (
    <main>
      {/* ===== Top: the name, and the partnership in the approved words ===== */}
      <Ground glow="claude" mx={62} my={42} className="px-4 sm:px-6 pt-8 lg:pt-12 pb-10 lg:pb-14">
        <div className="max-w-[1120px] mx-auto grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-9 lg:gap-12 items-center">
          <div className="text-center lg:text-left">
            <p className="st-kicker st-fade" style={{ color: '#e58a62' }}>Claude</p>
            <h1 className="st-rise display-hero mt-5" style={turn(1)}>Claude at Gennoor.</h1>
            <p className="st-rise text-[clamp(17px,1.6vw,21px)] leading-[1.5] text-gray-600 max-w-[560px] mx-auto lg:mx-0 mt-5" style={turn(2)}>
              Training for teams, courses built around their work, and automation built with Claude.
            </p>
            <div className="st-rise flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start items-center mt-8" style={turn(3)}>
              <Link href="/claude/certifications" className="st-pill">Explore certification prep</Link>
              <Link href="/contact" className="st-link text-[16px]">Talk to us ›</Link>
            </div>
          </div>
          {/* Partner Network: approved wording only, the badge on its own light card */}
          <div className="st-pop st-card p-6 sm:p-7 grid sm:grid-cols-[150px_1fr] gap-6 sm:gap-7 items-center" style={turn(2)}>
            <a href={PROGRAM_URL} target="_blank" rel="noopener noreferrer" className="mx-auto block rounded-[14px] bg-[#f0eee6] p-2 leading-[0] shadow-[0_18px_44px_-18px_rgba(0,0,0,0.8)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/cpn/cpn-certified-vertical.svg" alt="Claude Partner Network - Certified" width={134} className="h-auto rounded-[8px]" />
            </a>
            <div className="text-center sm:text-left">
              <h2 className="text-[21px] font-bold tracking-[-0.02em] text-gray-900">Claude Partner Network</h2>
              <p className="text-[16.5px] font-semibold text-gray-900 mt-2.5">{TIER_LINE}</p>
              <p className="text-[14px] leading-[1.6] text-gray-600 mt-2.5">{BOILERPLATE}</p>
            </div>
          </div>
        </div>
      </Ground>

      {/* ===== Certification prep: the four official Claude certifications, as steps on a rising path ===== */}
      <section className="px-4 sm:px-6 py-10 lg:py-14" aria-labelledby="claude-certified">
        <div className="max-w-[1120px] mx-auto grid lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] gap-9 lg:gap-12 items-center">
          <div>
            <h2 id="claude-certified" className="display-section">Get Claude certified.</h2>
            <p className="lede mt-3.5">
              A guide and a practice exam for each of the four official Anthropic certifications: a story to follow, diagrams you step through, and questions with the reasoning explained.
            </p>
            <div className="mt-7"><Link href="/claude/certifications" className="st-pill">Explore certification prep</Link></div>
          </div>
          <Reveal className="relative">
            <svg className="absolute inset-x-[10%] top-[18%] w-[80%] h-[46%] hidden sm:block" viewBox="0 0 600 160" preserveAspectRatio="none" aria-hidden="true">
              <defs><linearGradient id="cert-path" x1="0" x2="1"><stop offset="0" stopColor="#e58a62" stopOpacity=".25" /><stop offset="1" stopColor="#ffc24b" /></linearGradient></defs>
              <path className="st-draw" style={{ '--len': 700 } as React.CSSProperties} d="M0 150 C 120 150, 130 110, 200 104 S 340 62, 400 54 S 520 18, 600 8" fill="none" stroke="url(#cert-path)" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <ol className="relative grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-6 sm:items-end">
              {CLAUDE_CERTS.map((c, i) => (
                <li key={c.slug} className="st-pop" style={{ ...turn(i + 2), paddingBottom: `calc(${i} * clamp(0px, 2.2vw, 26px))` }}>
                  <Link href={`/claude/certifications/${c.slug}`} className="group flex flex-col items-center text-center">
                    <SparkIco code={c.code} className="w-[84px] h-[84px] sm:w-[96px] sm:h-[96px] [--s:84px] sm:[--s:96px] transition-transform group-hover:-translate-y-1" />
                    <span className="mt-3 text-[15px] font-semibold leading-snug text-gray-900 group-hover:text-primary-600">{shortName(c.name)}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* ===== What we do with Claude ===== */}
      <section className="bg-gray-50 px-4 sm:px-6 py-10 lg:py-14" aria-labelledby="claude-what">
        <div className="max-w-[1120px] mx-auto">
          <h2 id="claude-what" className="display-section">What we do with Claude.</h2>
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            {WHAT.map(w => (
              <Link key={w.title} href={w.href} className="st-card group flex flex-col p-6">
                <Ico icon={w.icon} tone={w.tone} size={60} />
                <h3 className="text-[19.5px] font-bold tracking-[-0.01em] text-gray-900 mt-5">{w.title}</h3>
                <p className="text-[15px] leading-[1.55] text-gray-600 mt-2 flex-1">{w.body}</p>
                <span className="st-link text-[14.5px] mt-5">{w.cta} ›</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Course catalogue: always open, no tab or click needed to see the courses */}
      <ClaudeCourseCarousels />

      {/* ===== The lines of work the Claude courses are organised by ===== */}
      <section className="bg-gray-50 px-4 sm:px-6 py-10 lg:py-14" aria-labelledby="claude-domains">
        <div className="max-w-[1120px] mx-auto grid lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] gap-8 lg:gap-12 items-center">
          <div>
            <h2 id="claude-domains" className="display-section">Claude courses by domain.</h2>
            <p className="lede mt-3.5">
              We are preparing Claude courses for these lines of work. They will appear in the Learning Studio as they are ready.
            </p>
            <div className="mt-7"><Link href="/studio?company=Claude" className="st-pill">See Claude courses</Link></div>
          </div>
          <ul className="flex flex-wrap gap-2.5">
            {DOMAINS.map((d, i) => (
              <li key={d} className="st-chip" style={{ '--dot': DOTS[i % DOTS.length] } as React.CSSProperties}><i />{d}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-12 lg:py-16 text-center">
        <h2 className="display-section max-w-[680px] mx-auto">Want Claude to work for your team?</h2>
        <p className="lede mt-3.5 max-w-[520px] mx-auto">Tell us what your people do every day. We will suggest where Claude helps first.</p>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mt-8">
          <Link href="/contact" className="st-pill">Talk to us</Link>
          <Link href="/training" className="st-link text-[16px]">Training for teams ›</Link>
        </div>
      </section>
    </main>
  )
}
