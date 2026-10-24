import type { Metadata } from 'next'
import Link from 'next/link'
import { BalanceIllustration, ExamplesIllustration, OrgIllustration, ScopeIllustration, ShieldIllustration, SmallTeamIllustration } from '@/components/illustrations/Illustrations'

export const metadata: Metadata = {
  title: 'Automation — Gennoor Tech',
  description: 'We automate one process at a time with AI, and write down what we will and will not do before we start.',
  alternates: { canonical: 'https://gennoor.com/automation' },
}

const AUDIENCES = [
  {
    art: SmallTeamIllustration,
    title: 'Smaller businesses',
    body: 'One process that eats hours every week. We automate it and make sure your team can run it.',
  },
  {
    art: OrgIllustration,
    title: 'Larger organizations',
    body: 'A process across teams or systems. We start with a small part, agree how to check it, and grow from there.',
  },
]

const TYPICAL = [
  'Sorting documents, emails and forms',
  'Answering routine questions from a knowledge base',
  'Preparing reports from several sources',
  'Moving information between your tools',
  'Assistants that help people find and draft things',
]

const PRINCIPLES = [
  { art: ScopeIllustration, title: 'Scope first', body: 'What we will build, what we will not, and what we need from you. In writing, before work starts.' },
  { art: ExamplesIllustration, title: 'Your examples', body: 'We test on real cases from your work, so you see it helps before you rely on it.' },
  { art: BalanceIllustration, title: 'Honest about value', body: 'Some processes should not be automated. If so, we say it.' },
  { art: ShieldIllustration, title: 'People stay in charge', body: 'AI makes mistakes. We design for checking.' },
]

export default function AutomationPage() {
  return (
    <main className="bg-white">
      <section className="hero-backdrop px-6 pt-16 lg:pt-[100px] pb-16 text-center">
        <h1 className="display-hero max-w-[820px] mx-auto">Automation, one process at a time.</h1>
        <p className="text-[clamp(18px,1.8vw,22px)] leading-[1.5] text-[#6e6e73] max-w-[560px] mx-auto mt-6">
          We automate the part that costs your team the most time, with Claude and other AI tools.
        </p>
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-[22px] justify-center items-center mt-9">
          <Link href="/contact" className="pill-primary">Describe your process</Link>
          <Link href="/training" className="link-arrow">Or train your team to do it ›</Link>
        </div>
      </section>

      <section className="bg-[#f5f5f7] px-6 py-16 lg:py-[90px]">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="display-section text-center mb-12">For any size of team.</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {AUDIENCES.map(a => (
              <div key={a.title} className="bg-white rounded-[18px] p-8 text-center">
                <a.art className="w-[112px] h-[112px] mx-auto mb-5" />
                <h3 className="font-heading text-[20px] font-bold text-gray-900">{a.title}</h3>
                <p className="text-[15.5px] leading-[1.55] text-[#6e6e73] mt-2">{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16 lg:py-[90px]">
        <div className="max-w-[640px] mx-auto">
          <h2 className="display-section text-center mb-10">What we automate.</h2>
          <ul className="space-y-4">
            {TYPICAL.map(t => (
              <li key={t} className="flex gap-3 text-[17px] leading-[1.5] text-[#3a3a3f]">
                <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-primary-600 shrink-0" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[#f5f5f7] px-6 py-16 lg:py-[90px]">
        <div className="max-w-[1080px] mx-auto">
          <h2 className="display-section text-center mb-12">How we keep it honest.</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {PRINCIPLES.map(p => (
              <div key={p.title} className="bg-white rounded-[18px] p-7 text-center">
                <p.art className="w-[96px] h-[96px] mx-auto mb-4" />
                <h3 className="font-heading text-[18px] font-bold text-gray-900">{p.title}</h3>
                <p className="text-[15px] leading-[1.55] text-[#6e6e73] mt-2">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16 lg:py-[90px] text-center">
        <h2 className="display-section max-w-[680px] mx-auto">Tell us about the process.</h2>
        <p className="lede mt-3.5 max-w-[480px] mx-auto">A few lines are enough. We reply with questions, or tell you honestly if it is not a fit.</p>
        <div className="mt-8"><Link href="/contact" className="pill-primary">Contact us</Link></div>
      </section>
    </main>
  )
}
