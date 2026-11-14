import type { Metadata } from 'next'
import { pageMeta } from '@/lib/seo'
import Link from 'next/link'
import { ArrowLeftRight, BotMessageSquare, Building2, FileBarChart, FileText, FlaskConical, GraduationCap, Inbox, MessagesSquare, Scale, ShieldCheck, Users } from 'lucide-react'
import Ground from '@/components/stage/Ground'
import Reveal from '@/components/stage/Reveal'
import { Ico } from '@/components/stage/Ico'
import ProcessFlow from '@/components/stage/ProcessFlow'

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

      {/* ===== What we automate ===== */}
      <section className="px-4 sm:px-6 py-10 lg:py-14" aria-labelledby="what-we-automate">
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
      <section className="bg-gray-50 px-4 sm:px-6 py-10 lg:py-14" aria-labelledby="any-size">
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
      <section className="px-4 sm:px-6 py-10 lg:py-14" aria-labelledby="honest">
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
      <section className="bg-gray-50 px-4 sm:px-6 py-10 lg:py-12" aria-labelledby="teach-it">
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

      <section className="px-4 sm:px-6 py-12 lg:py-16 text-center">
        <h2 className="display-section max-w-[680px] mx-auto">Tell us about the process.</h2>
        <p className="lede mt-3.5 max-w-[480px] mx-auto">A few lines are enough. We reply with questions, or tell you honestly if it is not a fit.</p>
        <div className="mt-8"><Link href="/contact" className="st-pill">Contact us</Link></div>
      </section>
    </main>
  )
}
