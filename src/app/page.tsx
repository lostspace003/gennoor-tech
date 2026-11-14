import type { Metadata } from 'next'
import Link from 'next/link'
import { pageMeta } from '@/lib/seo'
import { siteConfig } from '@/lib/site-config'
import { Award, BotMessageSquare, Ear, FlaskConical, ListChecks, PencilRuler, Play, Presentation, Rocket, Sparkles, Workflow } from 'lucide-react'
import { PersonJsonLd } from '@/components/JsonLd'
import { ClaudePartnerInline } from '@/components/ClaudePartner'
import CourseCarousel from '@/components/home/CourseCarousel'
import { allCards } from '@/lib/catalogue'
import WalkthroughVideo from '@/components/WalkthroughVideo'
import CertPromoButton from '@/components/home/CertPromoButton'
import WeekendStrip from '@/components/home/WeekendStrip'
import FilmPlayer from '@/components/home/FilmPlayer'
import WeekendFilm from '@/components/home/WeekendFilm'
import films from '@/data/films.json'
import Ground from '@/components/stage/Ground'
import Reveal from '@/components/stage/Reveal'
import { Ico } from '@/components/stage/Ico'
import { Ring } from '@/components/stage/Ring'

// Preview links are signed for 2 hours; rebuild the page well inside that.
export const revalidate = 1800

export const metadata: Metadata = pageMeta({
  title: `${siteConfig.name} - ${siteConfig.tagline}`,
  absoluteTitle: true,
  description: siteConfig.description,
  path: '/',
  image: 'site',
})

/** What every course has, in the order the film says it. The tone of each tile is its meaning (see Ico.tsx). */
const IN_A_COURSE = [
  { icon: Play, tone: 'blue', title: 'Short video lessons', body: 'With captions, at your own pace.' },
  { icon: FlaskConical, tone: 'violet', title: 'Labs you run yourself', body: 'A guide for every step, files included.' },
  { icon: BotMessageSquare, tone: 'green', title: 'An assistant in the lesson', body: 'It answers from the course.' },
  { icon: ListChecks, tone: 'rose', title: 'A quiz in every module', body: 'So you know it has landed.' },
  { icon: Award, tone: 'gold', title: 'A certificate at the end', body: 'Yours to share.' },
] as const

/** Three ways in. */
const WAYS = [
  { icon: Award, tone: 'gold', title: 'Certification courses', body: 'Prepare for a recognised exam in cloud and AI, and build the real thing on the way.', href: '/studio', link: 'Open the Learning Studio' },
  { icon: Rocket, tone: 'green', title: 'Project courses', body: 'One real project from start to finish, built on the problems teams meet in production.', href: '/studio', link: 'See the projects' },
  { icon: Sparkles, tone: 'violet', title: 'AI Essentials', body: 'One useful skill in about an hour, for every role, with a short quiz in each chapter.', href: '/ai-academy', link: 'Browse AI Essentials' },
] as const

/** How training for a team is made. It is a sequence, so it is numbered. */
const FOR_A_TEAM = [
  { icon: Ear, tone: 'blue', title: 'We learn your work', body: 'We start with what your people do every day.' },
  { icon: PencilRuler, tone: 'violet', title: 'We build the course', body: 'Examples and exercises come from your context.' },
  { icon: Presentation, tone: 'gold', title: 'We teach it live', body: 'Online or at your office, hands-on.' },
] as const

/** style={{ '--i': n }}: the place of a thing in the order of arrival. */
const turn = (i: number) => ({ '--i': i }) as React.CSSProperties

export default async function HomePage() {
  const catalogue = await allCards()

  return (
    <>
      <PersonJsonLd />
      <CertPromoButton />

      {/* ===== The AI Weekend, first thing on the page ===== */}
      <WeekendStrip />

      {/* ===== Hero: what we do, as a film. The film is the centre of the page; the words beside it are few. ===== */}
      <Ground glow="blue" mx={70} my={45} className="px-4 sm:px-6 pt-6 lg:pt-9 pb-9 lg:pb-12">
        <div className="max-w-[1180px] mx-auto grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-8 lg:gap-11 items-center">
          <div className="text-center lg:text-left">
            <div className="st-fade flex justify-center lg:justify-start"><ClaudePartnerInline /></div>
            <h1 className="st-rise display-hero mt-6 !text-[clamp(38px,4.4vw,62px)]" style={turn(1)}>
              Learn what the job actually asks for.
            </h1>
            <p className="st-rise text-[clamp(17px,1.5vw,20px)] leading-[1.5] text-gray-600 max-w-[520px] mx-auto lg:mx-0 mt-4" style={turn(2)}>
              Certification courses, real projects and live training. Watch what we do in a minute and a half.
            </p>
            <div className="st-rise flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start items-center mt-7" style={turn(3)}>
              <Link href="/studio" className="st-pill">Explore the Learning Studio</Link>
              <Link href="/contact" className="st-link text-[16px]">Talk to us ›</Link>
            </div>
          </div>
          {/* On a phone the film comes first: it is what the page is about */}
          <div className="st-pop order-first lg:order-none" style={turn(1)}>
            <FilmPlayer src={films.overview.src} poster={films.overview.poster} title={`Gennoor Tech: ${films.overview.title}`} transcript={films.overview.transcript} seconds={films.overview.seconds} />
          </div>
        </div>
      </Ground>

      {/* ===== The AI Weekend, with its own film ===== */}
      <WeekendFilm />

      {/* ===== What is in every course: the five things the film names ===== */}
      <section className="px-4 sm:px-6 py-10 lg:py-14" aria-labelledby="in-a-course">
        <div className="max-w-[1180px] mx-auto">
          <div className="max-w-[640px]">
            <h2 id="in-a-course" className="display-section">Every course is built to be done, not just watched.</h2>
            <p className="lede mt-3.5">The same five things are in each one, so you always know what you are getting.</p>
          </div>
          <Reveal as="ul" className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {IN_A_COURSE.map((f, i) => (
              <li key={f.title} className="st-rise st-card p-4 sm:p-5" style={turn(i)}>
                <Ico icon={f.icon} tone={f.tone} size={40} />
                <h3 className="text-[16.5px] font-semibold leading-snug text-gray-900 mt-4">{f.title}</h3>
                <p className="text-[14px] leading-[1.45] text-gray-500 mt-1.5">{f.body}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ===== How the Learning Studio works ===== */}
      <section className="bg-gray-50 px-4 sm:px-6 py-10 lg:py-14">
        <div className="max-w-[1180px] mx-auto grid lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] gap-8 lg:gap-11 items-center">
          <div>
            <h2 className="display-section">See how the Learning Studio works.</h2>
            <p className="lede mt-3.5">From the first click to your first lesson, in about nine minutes: find a course, ask questions, and start learning.</p>
            <div className="mt-7"><Link href="/studio" className="st-pill">Open the Learning Studio</Link></div>
          </div>
          <WalkthroughVideo />
        </div>
      </section>

      {/* ===== Courses: every Studio course plus the Claude courses, added automatically ===== */}
      {catalogue.length > 0 && (
        <section className="px-4 sm:px-6 py-10 lg:py-14">
          <div className="max-w-[1180px] mx-auto">
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 mb-7">
              <div className="max-w-[620px]">
                <h2 className="display-section">Courses at Gennoor.</h2>
                <p className="lede mt-3">Learning Studio courses you can start today, and Claude courses with instructor-led training. Pick one to open it.</p>
              </div>
              <Link href="/studio" className="st-link text-[16px] whitespace-nowrap">See them all ›</Link>
            </div>
            <CourseCarousel cards={catalogue} label="All courses" />
          </div>
        </section>
      )}

      {/* ===== Vision: the one statement of the page, with the ring from the logo behind it ===== */}
      <Ground glow="violet" my={36} className="px-4 sm:px-6 py-12 lg:py-16" aria-labelledby="vision">
        <div className="pointer-events-none absolute left-1/2 top-[-60px] -translate-x-1/2 w-[min(720px,150vw)] opacity-50" aria-hidden="true">
          <Ring r={330} n={96} turn={240} />
        </div>
        <div className="relative max-w-[1180px] mx-auto">
          <div className="max-w-[860px] mx-auto text-center">
            <p className="st-kicker">Our vision</p>
            <h2 id="vision" className="mt-5 text-[clamp(30px,4.2vw,54px)] font-bold leading-[1.1] tracking-[-0.03em] text-gray-900">
              A world where anyone can learn the skills that work asks for,{' '}
              <span className="st-grad st-serif text-[1.16em] whitespace-nowrap">and prove them.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-10 lg:mt-12">
            {WAYS.map(w => (
              <Link key={w.title} href={w.href} className="st-card group flex flex-col p-6">
                <Ico icon={w.icon} tone={w.tone} size={44} />
                <h3 className="text-[20px] font-bold tracking-[-0.01em] text-gray-900 mt-5">{w.title}</h3>
                <p className="text-[15px] leading-[1.55] text-gray-600 mt-2 flex-1">{w.body}</p>
                <span className="st-link text-[14.5px] mt-5">{w.link} ›</span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8 text-[15.5px]">
            <Link href="/about" className="st-link">About Gennoor ›</Link>
            <span className="mx-3 text-gray-300" aria-hidden>·</span>
            <Link href="/about/certifications" className="st-link">Credentials ›</Link>
          </div>
        </div>
      </Ground>

      {/* ===== For a team: live training, and automation training ===== */}
      <section className="bg-gray-50 px-4 sm:px-6 py-10 lg:py-14" aria-labelledby="for-a-team">
        <div className="max-w-[1180px] mx-auto">
          <div className="max-w-[640px]">
            <h2 id="for-a-team" className="display-section">For your team, we go further.</h2>
            <p className="lede mt-3.5">Live training on Claude, Microsoft AI and automation, built on the work your people do and taught from Mumbai, online or at your office.</p>
          </div>
          <ol className="grid md:grid-cols-3 gap-4 mt-8">
            {FOR_A_TEAM.map((s, i) => (
              <li key={s.title} className="st-card relative p-6">
                <span className="st-num absolute right-5 top-4" aria-hidden="true">0{i + 1}</span>
                <Ico icon={s.icon} tone={s.tone} size={44} />
                <h3 className="text-[20px] font-bold tracking-[-0.01em] text-gray-900 mt-5">{s.title}</h3>
                <p className="text-[15px] leading-[1.55] text-gray-600 mt-2">{s.body}</p>
              </li>
            ))}
          </ol>
          <div className="st-card mt-4 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 p-5 sm:p-6">
            <Ico icon={Workflow} tone="green" size={44} />
            <div className="flex-1 min-w-0">
              <h3 className="text-[18.5px] font-bold tracking-[-0.01em] text-gray-900">We also teach automation.</h3>
              <p className="text-[15px] leading-[1.5] text-gray-600 mt-1">One process your team runs every week, and a course built on it, so they can automate it themselves.</p>
            </div>
            <Link href="/automation" className="st-link text-[15px] whitespace-nowrap">About automation ›</Link>
          </div>
          <div className="flex flex-wrap gap-x-7 gap-y-3 items-center mt-7">
            <Link href="/training" className="st-pill">See training for teams</Link>
            <Link href="/webinars" className="st-link text-[16px]">Expert sessions ›</Link>
          </div>
        </div>
      </section>

      {/* ===== Contact ===== */}
      <section className="px-4 sm:px-6 py-12 lg:py-16 text-center">
        <h2 className="display-section max-w-[720px] mx-auto">Questions? Talk to us.</h2>
        <p className="lede mt-3.5 max-w-[520px] mx-auto">Tell us how many people, which teams and by when. We will suggest something sensible in twenty minutes.</p>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mt-8">
          <Link href="/contact" className="st-pill">Contact us</Link>
          <Link href="/resources/calendar" className="st-link text-[16px]">Book a 20-minute call ›</Link>
        </div>
      </section>
    </>
  )
}
