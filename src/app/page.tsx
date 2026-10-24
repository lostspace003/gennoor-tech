import Link from 'next/link'
import { PersonJsonLd } from '@/components/JsonLd'
import { ClaudePartnerHero } from '@/components/ClaudePartner'
import HomeCourses from '@/components/home/HomeCourses'
import WalkthroughVideo from '@/components/WalkthroughVideo'
import { listLmsCourses, toCard } from '@/lib/lms'
import { AutomationIllustration, DeliverIllustration, HandoverIllustration, PlatformIllustration, ScopeIllustration, TalkIllustration, TrainingIllustration } from '@/components/illustrations/Illustrations'

// Preview links are signed for 2 hours; rebuild the page well inside that.
export const revalidate = 1800

const WHAT_WE_DO = [
  {
    art: TrainingIllustration,
    title: 'Training for organizations',
    body: 'Custom courses built around the work your people do. Claude, Microsoft AI and other tools, taught live.',
    href: '/training',
    cta: 'About training',
  },
  {
    art: AutomationIllustration,
    title: 'Automation we build',
    body: 'One process at a time, scoped in writing first, built with the people who will use it.',
    href: '/automation',
    cta: 'About automation',
  },
  {
    art: PlatformIllustration,
    title: 'Learning platforms',
    body: 'The Learning Studio is one: video courses, quizzes and certificates.',
    href: '/studio',
    cta: 'Open the Learning Studio',
  },
]

const STEPS = [
  { art: TalkIllustration, title: 'We talk', body: 'You tell us what you want your team to be able to do, or which process costs you time.' },
  { art: ScopeIllustration, title: 'We write it down', body: 'A short scope: what we will do, what we will not, and what we need from you.' },
  { art: DeliverIllustration, title: 'We deliver', body: 'Training sessions or a working automation, built with your people.' },
  { art: HandoverIllustration, title: 'We hand over', body: 'Your team can run it without us. We stay reachable if something needs a second look.' },
]

export default async function HomePage() {
  const courses = (await listLmsCourses()).map(toCard).filter(c => c.promoUrl || c.thumbnailUrl).slice(0, 2)

  return (
    <>
      <PersonJsonLd />

      {/* ===== Hero: the Claude Partner Network first ===== */}
      <section className="hero-backdrop bg-white px-6 pt-16 lg:pt-[100px] pb-16 lg:pb-[90px] text-center">
        <ClaudePartnerHero />
        <h1 className="display-hero max-w-[860px] mx-auto mt-12">
          Train your team on AI. Automate the rest.
        </h1>
        <p className="text-[clamp(18px,1.8vw,22px)] leading-[1.5] text-[#6e6e73] max-w-[620px] mx-auto mt-6">
          Custom training on Claude and other AI tools, automations built one process at a time, and courses you can take yourself in the Learning Studio.
        </p>
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-[22px] justify-center items-center mt-10">
          <Link href="/contact" className="pill-primary">Talk to us</Link>
          <Link href="/studio" className="link-arrow">Explore the Learning Studio ›</Link>
        </div>
      </section>

      {/* ===== How the Learning Studio works ===== */}
      <section className="bg-[#f5f5f7] px-6 py-16 lg:py-[90px]">
        <div className="max-w-[980px] mx-auto text-center">
          <h2 className="display-section">See how the Learning Studio works.</h2>
          <p className="lede mt-3.5 max-w-[600px] mx-auto">From the first click to your first lesson, in about eight minutes. Find a course, ask questions, and start learning for free.</p>
          <WalkthroughVideo className="mt-10" />
          <div className="mt-10">
            <Link href="/studio" className="pill-primary">Open the Learning Studio</Link>
          </div>
        </div>
      </section>

      {/* ===== Course previews ===== */}
      {courses.length > 0 && (
        <section className="bg-[#f5f5f7] px-6 py-16 lg:py-[90px]">
          <div className="max-w-[1080px] mx-auto">
            <div className="text-center mb-12">
              <h2 className="display-section">Two courses you can start today.</h2>
              <p className="lede mt-3.5 max-w-[560px] mx-auto">Watch the preview, then open the full course in the Learning Studio.</p>
            </div>
            <HomeCourses courses={courses} />
            <div className="text-center mt-12">
              <Link href="/studio" className="pill-primary">Go to the Learning Studio</Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== What we do ===== */}
      <section className="bg-white px-6 py-16 lg:py-[90px]">
        <div className="max-w-[1080px] mx-auto">
          <h2 className="display-section text-center mb-12">What we do.</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {WHAT_WE_DO.map(w => (
              <div key={w.title} className="rounded-[18px] border border-[#e8e8ed] p-7 flex flex-col">
                <w.art className="w-[84px] h-[84px] mb-5" />
                <h3 className="font-heading text-[19px] font-bold tracking-[-0.01em] text-gray-900">{w.title}</h3>
                <p className="text-[15px] leading-[1.55] text-[#6e6e73] mt-3 flex-1">{w.body}</p>
                <Link href={w.href} className="link-arrow !text-[15px] mt-6">{w.cta} ›</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== How we work ===== */}
      <section className="bg-[#f5f5f7] px-6 py-16 lg:py-[90px]">
        <div className="max-w-[1080px] mx-auto">
          <h2 className="display-section text-center mb-12">How we work.</h2>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map(s => (
              <li key={s.title} className="bg-white rounded-[18px] p-6">
                <s.art className="w-[72px] h-[72px] mb-4" />
                <h3 className="font-heading text-[17px] font-bold text-gray-900">{s.title}</h3>
                <p className="text-[14.5px] leading-[1.55] text-[#6e6e73] mt-2">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== Mission ===== */}
      <section className="bg-white px-6 py-16 lg:py-[90px] text-center">
        <p className="font-heading text-[clamp(24px,3vw,36px)] leading-[1.25] tracking-[-0.02em] text-gray-900 max-w-[780px] mx-auto">
          To help every organization use AI with confidence, by training its people and automating the work that slows them down.
        </p>
      </section>

      {/* ===== Contact ===== */}
      <section className="bg-[#f5f5f7] px-6 py-16 lg:py-[100px] text-center">
        <h2 className="display-section max-w-[720px] mx-auto">Tell us what you want your team to be able to do.</h2>
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-[22px] justify-center items-center mt-8">
          <Link href="/contact" className="pill-primary">Contact us</Link>
          <Link href="/about" className="link-arrow">About Gennoor ›</Link>
        </div>
      </section>
    </>
  )
}
