import type { Metadata } from 'next'
import { pageMeta } from '@/lib/seo'
import Link from 'next/link'
import { ArrowLeftRight, BotMessageSquare, Building2, Hammer, FileBarChart, FileText, FlaskConical, GraduationCap, Inbox, MessagesSquare, Scale, ShieldCheck, Users } from 'lucide-react'
import Ground from '@/components/stage/Ground'
import Reveal from '@/components/stage/Reveal'
import { Ico } from '@/components/stage/Ico'
import ProcessFlow from '@/components/stage/ProcessFlow'
import PocRequestForm from '@/components/automation/PocRequestForm'
import films from '@/data/films.json'

export const metadata: Metadata = pageMeta({
  title: 'AI automation, one process at a time',
  description: 'We automate one process at a time with AI, and write down what we will and will not do before we start.',
  path: '/automation',
  image: 'automation',
})

const AUDIENCES = [
  { icon: Users, tone: 'blue', title: 'Smaller businesses', body: 'One process that eats hours every week. We automate it and make sure your team can run it.' },
  { icon: Building2, tone: 'violet', title: 'Larger organizations', body: 'A process across teams or systems. We start with a small part, agree how to check it, and grow from there.' },
] as const

const TYPICAL = [
  { icon: Inbox, tone: 'blue', text: 'Sorting documents, emails and forms' },
  { icon: MessagesSquare, tone: 'rose', text: 'Answering routine questions from a knowledge base' },
  { icon: FileBarChart, tone: 'green', text: 'Preparing reports from several sources' },
  { icon: ArrowLeftRight, tone: 'cyan', text: 'Moving information between your tools' },
  { icon: BotMessageSquare, tone: 'violet', text: 'Assistants that help people find and draft things' },
] as const

const PRINCIPLES = [
  { icon: FileText, tone: 'blue', title: 'Scope first', body: 'What we will build, what we will not, and what we need from you. In writing, before work starts.' },
  { icon: FlaskConical, tone: 'violet', title: 'Your examples', body: 'We test on real cases from your work, so you see it helps before you rely on it.' },
  { icon: Scale, tone: 'rose', title: 'Honest about value', body: 'Some processes should not be automated. If so, we say it.' },
  { icon: ShieldCheck, tone: 'green', title: 'People stay in charge', body: 'AI makes mistakes. We design for checking.' },
] as const
/** Proofs of concept we built and show. Each has its own page under /automation. */
const BUILT = [
  {
    href: '/automation/hr-intelligence',
    name: 'HR Intelligence',
    line: 'Ask HR anything. Get an answer you can check.',
    body: "A team of AI specialists answers HR questions from the company's own records, a compliance review checks every reply, and scanned forms are read and filed.",
    tags: ['Policy answers', 'Live HR numbers', 'Fair shortlisting', 'Documents filed'],
    poster: films.hrIntelligence.poster,
  },
] as const

const turn = (i: number) => ({ '--i': i }) as React.CSSProperties

export default function AutomationPage() {
  return (
    <main>
      {/* ===== Top: the sentence, and the picture of one process before and after ===== */}
      <Ground glow="green" mx={66} my={46} className="px-4 sm:px-6 pt-8 lg:pt-12 pb-10 lg:pb-14">
        <div className="max-w-[1120px] mx-auto grid lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] gap-9 lg:gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="st-rise display-hero">Automation, one process at a time.</h1>
            <p className="st-rise text-[clamp(17px,1.6vw,21px)] leading-[1.5] text-gray-600 max-w-[520px] mx-auto lg:mx-0 mt-5" style={turn(1)}>
              We automate the part that costs your team the most time, with Claude and other AI tools.
            </p>
            <div className="st-rise flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start items-center mt-8" style={turn(2)}>
              <Link href="/contact" className="st-pill">Describe your process</Link>
              <Link href="/training" className="st-link text-[16px]">Or train your team to do it ›</Link>
            </div>
          </div>
          <ProcessFlow />
        </div>
      </Ground>

      {/* ===== Proofs of concept we built: a small tile each (snapshot + title), each opens its own page ===== */}
      <section className="px-4 sm:px-6 py-10 lg:py-12" aria-labelledby="built">
        <div className="max-w-[1120px] mx-auto">
          <h2 id="built" className="display-section">See one working.</h2>
          <p className="lede mt-3.5 max-w-[640px]">Proofs of concept we built. Your team can learn to build one, or we build it on your process.</p>
          <ul className="grid md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-4 mt-7">
            {BUILT.map(b => (
              <li key={b.href}>
                <Link href={b.href} className="st-card group flex items-center gap-4 sm:gap-5 p-3.5 sm:p-4 h-full hover:border-primary-600 transition-colors">
                  <div className="relative w-[116px] sm:w-[208px] aspect-video shrink-0 overflow-hidden rounded-xl bg-gray-100 st-keep">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={b.poster} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="st-kicker text-[11px]">Proof of concept</p>
                    <h3 className="text-[18px] sm:text-[20px] font-bold tracking-[-0.01em] text-gray-900 mt-1">{b.name}</h3>
                    <p className="text-[14.5px] sm:text-[15.5px] leading-snug text-gray-600 mt-1">{b.line}</p>
                    <span className="st-link text-[14.5px] inline-block mt-2">See it work ›</span>
                  </div>
                </Link>
              </li>
            ))}
            <li>
              <a href="#poc" className="st-card flex items-center gap-4 p-4 h-full border-dashed hover:border-primary-600 transition-colors">
                <Ico icon={Hammer} tone="violet" size={40} />
                <div className="min-w-0">
                  <h3 className="text-[17px] font-bold text-gray-900">Yours could be next.</h3>
                  <p className="text-[14.5px] leading-snug text-gray-600 mt-1">Tell us a process, and we build a proof of concept on it.</p>
                  <span className="st-link text-[14.5px] inline-block mt-2">Ask for one ›</span>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </section>

      {/* ===== What we automate ===== */}
      <section className="bg-gray-50 px-4 sm:px-6 py-10 lg:py-14" aria-labelledby="what-we-automate">
        <div className="max-w-[1120px] mx-auto grid lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] gap-8 lg:gap-12 items-start">
          <div>
            <h2 id="what-we-automate" className="display-section">What we automate.</h2>
            <p className="lede mt-3.5">The work that comes back every week and follows the same steps each time.</p>
          </div>
          <Reveal as="ul" className="grid sm:grid-cols-2 gap-3">
            {TYPICAL.map((t, i) => (
              <li key={t.text} className={`st-rise st-card flex items-center gap-4 p-4 ${i === TYPICAL.length - 1 ? 'sm:col-span-2' : ''}`} style={turn(i)}>
                <Ico icon={t.icon} tone={t.tone} size={36} />
                <span className="text-[16px] font-semibold leading-snug text-gray-900">{t.text}</span>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ===== For any size of team ===== */}
      <section className="px-4 sm:px-6 py-10 lg:py-14" aria-labelledby="any-size">
        <div className="max-w-[1120px] mx-auto">
          <h2 id="any-size" className="display-section">For any size of team.</h2>
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            {AUDIENCES.map(a => (
              <div key={a.title} className="st-card flex items-start gap-5 p-6">
                <Ico icon={a.icon} tone={a.tone} size={44} />
                <div>
                  <h3 className="text-[20px] font-bold tracking-[-0.01em] text-gray-900">{a.title}</h3>
                  <p className="text-[15.5px] leading-[1.55] text-gray-600 mt-1.5">{a.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== How we keep it honest ===== */}
      <section className="bg-gray-50 px-4 sm:px-6 py-10 lg:py-14" aria-labelledby="honest">
        <div className="max-w-[1120px] mx-auto">
          <h2 id="honest" className="display-section">How we keep it honest.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {PRINCIPLES.map(p => (
              <div key={p.title} className="st-card p-6">
                <Ico icon={p.icon} tone={p.tone} size={40} />
                <h3 className="text-[18.5px] font-bold tracking-[-0.01em] text-gray-900 mt-5">{p.title}</h3>
                <p className="text-[15px] leading-[1.55] text-gray-600 mt-2">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Or we teach your team to do it ===== */}
      <section className="px-4 sm:px-6 py-10 lg:py-12" aria-labelledby="teach-it">
        <div className="st-card max-w-[1120px] mx-auto flex flex-col md:flex-row md:items-center gap-5 md:gap-7 p-6 sm:p-8">
          <Ico icon={GraduationCap} tone="gold" size={48} />
          <div className="flex-1 min-w-0">
            <h2 id="teach-it" className="text-[clamp(22px,2.4vw,28px)] font-bold tracking-[-0.02em] text-gray-900">Or your team learns to automate it.</h2>
            <p className="text-[16px] leading-[1.55] text-gray-600 mt-2 max-w-[640px]">
              Custom automation training: we take one process your team runs every week and build the course on it, with their own examples and files. They automate it themselves, live and hands-on.
            </p>
          </div>
          <Link href="/training" className="st-pill st-ghost whitespace-nowrap">See training for teams</Link>
        </div>
      </section>

      {/* ===== A proof of concept: the one form for it (the same form is on each proof-of-concept page) ===== */}
      <section id="poc" className="bg-gray-50 px-4 sm:px-6 py-10 lg:py-14 scroll-mt-20" aria-labelledby="poc-title">
        <div className="max-w-[1120px] mx-auto grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-8 lg:gap-12 items-start">
          <div>
            <h2 id="poc-title" className="display-section">Want to see it work first?</h2>
            <p className="lede mt-3.5">We build a proof of concept on one process of yours: small, agreed in writing, and tested on real cases. Then you decide what comes next.</p>
          </div>
          <div className="st-card p-6 sm:p-8">
            <PocRequestForm />
          </div>
        </div>
      </section>
      <section className="px-4 sm:px-6 py-12 lg:py-16 text-center">
        <h2 className="display-section max-w-[680px] mx-auto">Tell us about the process.</h2>
        <p className="lede mt-3.5 max-w-[480px] mx-auto">A few lines are enough. We reply with questions, or tell you honestly if it is not a fit.</p>
        <div className="mt-8"><Link href="/contact" className="st-pill">Contact us</Link></div>
      </section>
    </main>
  )
}
