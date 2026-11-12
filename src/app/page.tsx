import Link from 'next/link'
import { PersonJsonLd } from '@/components/JsonLd'
import { ClaudePartnerHero } from '@/components/ClaudePartner'
import CourseCarousel from '@/components/home/CourseCarousel'
import { allCards } from '@/lib/catalogue'
import WalkthroughVideo from '@/components/WalkthroughVideo'
import CertPromoButton from '@/components/home/CertPromoButton'
import WeekendStrip from '@/components/home/WeekendStrip'
import FilmPlayer from '@/components/home/FilmPlayer'
import WeekendFilm from '@/components/home/WeekendFilm'
import films from '@/data/films.json'
import { CloudAiIllustration, ExamplesIllustration, PlatformIllustration, TrainingIllustration } from '@/components/illustrations/Illustrations'

// Preview links are signed for 2 hours; rebuild the page well inside that.
export const revalidate = 1800

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

export default async function HomePage() {
  const catalogue = await allCards()

  return (
    <>
      <PersonJsonLd />
      <CertPromoButton />

      {/* ===== The AI Weekend, first thing on the page ===== */}
      <WeekendStrip />

      {/* ===== Hero: what we do, as a film. The film is the centre of the page; the words beside it are few. ===== */}
      <section className="hero-backdrop bg-white px-4 sm:px-6 pt-6 lg:pt-8 pb-8 lg:pb-10">
        <div className="max-w-[1180px] mx-auto grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] gap-8 lg:gap-10 items-center">
          <div className="text-center lg:text-left">
            <div className="lg:[&>div]:items-start"><ClaudePartnerHero /></div>
            <h1 className="display-hero mt-6 lg:!text-left lg:!text-[clamp(40px,4.4vw,62px)]">
              Learn what the job actually asks for.
            </h1>
            <p className="text-[clamp(17px,1.5vw,20px)] leading-[1.5] text-[#6e6e73] max-w-[560px] mx-auto lg:mx-0 mt-4">
              Certification courses, real projects and live training. Watch what we do in a minute and a half.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-[22px] justify-center lg:justify-start items-center mt-7">
              <Link href="/studio" className="pill-primary">Explore the Learning Studio</Link>
              <Link href="/contact" className="link-arrow">Talk to us ›</Link>
            </div>
          </div>
          {/* On a phone the film comes first: it is what the page is about */}
          <FilmPlayer className="order-first lg:order-none" src={films.overview.src} poster={films.overview.poster} title={`Gennoor Tech: ${films.overview.title}`} transcript={films.overview.transcript} seconds={films.overview.seconds} />
        </div>
      </section>

      {/* ===== The AI Weekend, with its own film ===== */}
      <WeekendFilm />

      {/* ===== How the Learning Studio works ===== */}
      <section className="bg-[#f5f5f7] px-6 py-10 lg:py-10">
        <div className="max-w-[980px] mx-auto text-center">
          <h2 className="display-section">See how the Learning Studio works.</h2>
          <p className="lede mt-3.5 max-w-[600px] mx-auto">From the first click to your first lesson, in about nine minutes. Find a course, ask questions, and start learning.</p>
          <WalkthroughVideo className="mt-10" />
          <div className="mt-10">
            <Link href="/studio" className="pill-primary">Open the Learning Studio</Link>
          </div>
        </div>
      </section>

      {/* ===== Courses: every Studio course plus the Claude courses, added automatically ===== */}
      {catalogue.length > 0 && (
        <section className="bg-[#f5f5f7] px-6 py-10 lg:py-10">
          <div className="max-w-[1080px] mx-auto">
            <div className="text-center mb-8">
              <h2 className="display-section">Courses at Gennoor.</h2>
              <p className="lede mt-3.5 max-w-[560px] mx-auto">Learning Studio courses you can start today, and Claude courses with instructor-led training. Pick one to open it.</p>
            </div>
            <CourseCarousel cards={catalogue} label="All courses" />
            <div className="text-center mt-8">
              <Link href="/studio" className="pill-primary">Go to the Learning Studio</Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== Vision ===== */}
      <section className="bg-white px-6 py-10 lg:py-10">
        <div className="max-w-[1080px] mx-auto">
          <div className="max-w-[820px] mx-auto text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-600">Our vision</p>
            <h2 className="display-section mt-4">A world where anyone can learn the skills that work asks for, and prove them.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {PILLARS.map(p => (
              <div key={p.title} className="rounded-[18px] border border-[#e8e8ed] p-7 flex flex-col items-center text-center">
                <p.art className="w-[104px] h-[104px] mb-5" />
                <h3 className="font-heading text-[19px] font-bold tracking-[-0.01em] text-gray-900">{p.title}</h3>
                <p className="text-[15px] leading-[1.55] text-[#6e6e73] mt-2">{p.body}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/about" className="link-arrow">About Gennoor ›</Link>
            <span className="mx-3 text-[#d2d2d7]" aria-hidden>·</span>
            <Link href="/about/certifications" className="link-arrow">Credentials ›</Link>
          </div>
        </div>
      </section>

      {/* ===== Live training, separate from the Learning Studio ===== */}
      <section className="bg-[#f5f5f7] px-6 py-10 lg:py-10">
        <div className="max-w-[1080px] mx-auto grid md:grid-cols-[auto_1fr] gap-8 items-center rounded-[22px] bg-white p-8 lg:p-10">
          <TrainingIllustration className="w-[96px] h-[96px] mx-auto md:mx-0" />
          <div className="text-center md:text-left">
            <h2 className="font-heading text-[clamp(22px,2.4vw,28px)] font-bold tracking-[-0.02em] text-gray-900">We also deliver live training.</h2>
            <p className="text-[16px] leading-[1.55] text-[#6e6e73] mt-2">Instructor-led sessions and workshops on Claude, Microsoft AI and cloud, taught live from Mumbai.</p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center md:items-start sm:justify-center md:justify-start mt-5">
              <Link href="/training" className="link-arrow">About training ›</Link>
              <Link href="/webinars" className="link-arrow">Expert sessions ›</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Contact ===== */}
      <section className="bg-white px-6 py-10 lg:py-10 text-center">
        <h2 className="display-section max-w-[720px] mx-auto">Questions? Talk to us.</h2>
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-[22px] justify-center items-center mt-8">
          <Link href="/contact" className="pill-primary">Contact us</Link>
          <Link href="/studio" className="link-arrow">Explore the Learning Studio ›</Link>
        </div>
      </section>
    </>
  )
}
