import type { Metadata } from 'next'
import Link from 'next/link'
import ClaudeCourseCarousels from '@/components/training/ClaudeCourseCarousels'
import { OpenCustomTraining } from '@/components/custom-training/CustomTraining'
import { AutomationIllustration, ClaudeIllustration, CloudAiIllustration, OrgIllustration, ScopeIllustration, SmallTeamIllustration, TalkIllustration, TrainingIllustration } from '@/components/illustrations/Illustrations'

export const metadata: Metadata = {
  title: 'Training — Gennoor Tech',
  description: 'Live training for teams, built around the work they do: Claude, Microsoft AI and custom automation courses.',
  alternates: { canonical: 'https://gennoor.com/training' },
}

const AUDIENCES = [
  {
    art: SmallTeamIllustration,
    title: 'Smaller teams',
    body: 'One tool or one process. A short course on what they will use on Monday.',
  },
  {
    art: OrgIllustration,
    title: 'Larger organizations',
    body: 'Several teams, different roles. A program in parts, so each group learns what it needs.',
  },
]

const TOPICS = [
  {
    art: ClaudeIllustration,
    title: 'Claude',
    body: 'Claude for everyday work, Claude Cowork and Claude Code.',
    href: '/claude',
    cta: 'About Claude',
  },
  {
    art: AutomationIllustration,
    title: 'Automation courses',
    body: 'A course built on one process your team runs, so they learn to automate it themselves.',
    href: '/automation',
    cta: 'About automation',
  },
  {
    art: CloudAiIllustration,
    title: 'Microsoft AI',
    body: 'Azure AI, Copilot Studio and certification exam preparation.',
    href: '/services/training',
    cta: 'See the programs',
  },
]

const BUILD = [
  { art: TalkIllustration, title: 'We learn your work', body: 'We start with what your people do every day.' },
  { art: ScopeIllustration, title: 'We build the course', body: 'Examples and exercises come from your context.' },
  { art: TrainingIllustration, title: 'We teach it live', body: 'Online or at your office, hands-on.' },
]

export default function TrainingPage() {
  return (
    <main className="bg-white">
      <section className="hero-backdrop px-6 pt-16 lg:pt-[100px] pb-16 text-center">
        <h1 className="display-hero max-w-[820px] mx-auto">Training for your team.</h1>
        <p className="text-[clamp(18px,1.8vw,22px)] leading-[1.5] text-[#6e6e73] max-w-[560px] mx-auto mt-6">
          Live training built around the work your people do.
        </p>
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-[22px] justify-center items-center mt-9">
          <OpenCustomTraining className="pill-primary">Ask for custom training</OpenCustomTraining>
          <Link href="/services/training" className="link-arrow">See the programs ›</Link>
          <Link href="/webinars" className="link-arrow">Expert sessions ›</Link>
        </div>
      </section>

      <ClaudeCourseCarousels className="bg-[#f5f5f7]" />

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
        <div className="max-w-[1080px] mx-auto">
          <h2 className="display-section text-center mb-12">What we teach.</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TOPICS.map(t => (
              <div key={t.title} className="rounded-[18px] border border-[#e8e8ed] p-7 flex flex-col items-center text-center">
                <t.art className="w-[104px] h-[104px] mb-5" />
                <h3 className="font-heading text-[19px] font-bold text-gray-900">{t.title}</h3>
                <p className="text-[15px] leading-[1.55] text-[#6e6e73] mt-2 flex-1">{t.body}</p>
                <Link href={t.href} className="link-arrow !text-[15px] mt-5">{t.cta} ›</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f7] px-6 py-16 lg:py-[90px]">
        <div className="max-w-[1080px] mx-auto">
          <h2 className="display-section text-center mb-12">How a course is built.</h2>
          <ol className="grid md:grid-cols-3 gap-6">
            {BUILD.map(b => (
              <li key={b.title} className="bg-white rounded-[18px] p-7 text-center">
                <b.art className="w-[96px] h-[96px] mx-auto mb-4" />
                <h3 className="font-heading text-[18px] font-bold text-gray-900">{b.title}</h3>
                <p className="text-[15px] leading-[1.55] text-[#6e6e73] mt-2">{b.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-white px-6 py-16 lg:py-[90px] text-center">
        <h2 className="display-section max-w-[680px] mx-auto">Prefer to learn on your own?</h2>
        <p className="lede mt-3.5 max-w-[480px] mx-auto">Video courses with labs and quizzes in the Learning Studio.</p>
        <div className="mt-8"><Link href="/studio" className="pill-primary">Open the Learning Studio</Link></div>
      </section>
    </main>
  )
}
