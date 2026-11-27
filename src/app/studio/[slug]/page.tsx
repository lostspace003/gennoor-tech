import { notFound } from 'next/navigation'
import { metaDescription } from '@/lib/seo'
import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, Check, ChevronDown } from 'lucide-react'
import { verifyLearnerSession } from '@/lib/learner-auth'
import { getLmsCourse, getLmsProgress, imageUrl, promoUrl, toCard, type LmsProgressEntry } from '@/lib/lms'
import { hasFullAccess, offerOf, previewIds, priceOf } from '@/lib/lms-access'
import { BuyButton, CouponBox, CourseBuyProvider, LessonRow, PreviewList, PreviewProvider, PriceLine, type PreviewItem } from '@/components/academy/CourseAccess'
import { OfferRibbon } from '@/components/academy/Offer'
import { resumePoint } from '@/lib/lms-resume'
import ResumePanel from '@/components/academy/ResumePanel'
import { kindOf, KIND_COLOR } from '@/lib/lms-kind'
import AcademyBar from '@/components/academy/AcademyBar'
import EnrollButton from '@/components/academy/EnrollButton'
import PromoPlayer from '@/components/academy/PromoPlayer'
import CourseAbout from '@/components/academy/CourseAbout'
import { ComplimentaryTile } from '@/components/academy/ComplimentaryInvite'
import { LessonLine } from '@/components/academy/LessonLine'
import { moduleLabel } from '@/lib/lms-about'
import CourseReviews from '@/components/academy/CourseReviews'
import { Stars } from '@/components/academy/Stars'
import { getReviews } from '@/lib/lms-community'
import { CourseStrip, StripLegend, longestLesson } from '@/components/academy/CourseStrip'
import { OutlineGate, OutlineLesson } from '@/components/academy/OutlineGate'
import InstructorCredentials from '@/components/academy/InstructorCredentials'
import { BreadcrumbJsonLd, LmsCourseJsonLd } from '@/components/JsonLd'

const FALLBACK_UPDATED = '2026-10-01T00:00:00.000Z'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

const KIND_LABEL: Record<string, string> = { certification: 'Certification course', project: 'Project course', course: 'Course' }
/** One tile tone a module, in the order the tiles are used on the site. */
const MODULE_TONES = ['', 't-violet', 't-cyan', 't-green', 't-gold', 't-rose'] as const
/** What is in a module, in words: one and many. */
const MIX_WORD = { lecture: ['lesson', 'lessons'], lab: ['lab', 'labs'], demo: ['demo', 'demos'], quiz: ['quiz', 'quizzes'] } as const

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const course = await getLmsCourse(slug)
  if (!course) return {}
  const url = `https://gennoor.com/studio/${slug}`
  const card = toCard(course)
  const facts = [`${course.stats.lectures} video lessons`, course.stats.quizzes ? `${course.stats.quizzes} quizzes` : '', card.hours ? `${card.hours} hours of video` : ''].filter(Boolean).join(', ')
  const lead = /[.!?]$/.test(course.subtitle.trim()) ? course.subtitle.trim() : `${course.subtitle.trim()}.`
  const description = metaDescription(`${lead} ${facts}. Learn on Gennoor Learning Studio.`, 200)
  const keywords = [course.title, course.code, card.vendor, ...(course.topics_tags || []), ...(course.topics || [])].filter(Boolean)
  return {
    // absolute: the site title template would push long course titles past what search results show
    title: { absolute: `${course.title} | Gennoor` },
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: { type: 'website', url, title: course.title, description, siteName: 'Gennoor Tech' },
    twitter: { card: 'summary_large_image', title: course.title, description },
  }
}

export default async function LabsCoursePage({ params }: PageProps) {
  const { slug } = await params
  const course = await getLmsCourse(slug)
  if (!course) notFound()

  const learner = await verifyLearnerSession()
  // `enrolled` means the whole course is open to this person: they bought it, or it is a free course they enrolled in
  const price = await priceOf(slug)
  const enrolled = learner ? await hasFullAccess(learner.email, slug).catch(() => false) : false
  // Shown only to people who have not bought the course yet
  const offer = enrolled ? null : await offerOf(course, price)
  const previews = new Set(previewIds(course))
  // The previews in course order, each with the module it comes from, for the one list they are shown in
  const previewList: PreviewItem[] = course.sections.flatMap((sec) => sec.items.filter((it) => previews.has(it.id)).map((it) => ({
    id: it.id, title: it.title, module: sec.title,
    minutes: it.type === 'lecture' && it.durationSec ? Math.max(1, Math.round(it.durationSec / 60)) : undefined,
  })))
  const progress: Record<string, LmsProgressEntry> = learner && enrolled ? await getLmsProgress(learner.email, slug).catch(() => ({})) : {}
  const point = enrolled ? resumePoint(course, progress) : null
  const totalItems = course.sections.reduce((n, s) => n + s.items.length, 0)
  const card = toCard(course)
  const promo = promoUrl(course)
  const counts = { hours: card.hours, lecture: 0, lab: 0, demo: 0, quiz: 0 }
  for (const s of course.sections) for (const i of s.items) counts[kindOf(i)] += 1
  const badge = imageUrl(course, course.badge)
  const { summary } = await getReviews(slug).catch(() => ({ summary: { average: 0, count: 0, counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } } }))

  const Shell = ({ children }: { children: React.ReactNode }) => (price ? <CourseBuyProvider slug={slug} price={price} offer={offer}>{children}</CourseBuyProvider> : <>{children}</>)

  return (
    <Shell>
    <main className="bg-surface">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://gennoor.com' },
          { name: 'Learning Studio', url: 'https://gennoor.com/studio' },
          { name: course.title, url: `https://gennoor.com/studio/${slug}` },
        ]}
      />

      <LmsCourseJsonLd
        c={{
          slug,
          code: course.code,
          title: course.title,
          description: course.subtitle,
          level: card.level,
          vendor: card.vendor,
          hours: card.hours,
          outcomes: course.outcomes,
          imageUrl: `https://gennoor.com/studio/${slug}/opengraph-image`,
          hasPromo: !!course.promo,
          uploadDate: course.updatedAt || FALLBACK_UPDATED,
          rating: summary.count > 0 ? { average: summary.average, count: summary.count } : undefined,
        }}
      />

      <AcademyBar section="Certifications & Projects" />

      {/* Hero: the promo plays first, then the shape of the whole course */}
      <section className="st-deep">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-6 pt-10 pb-8 lg:pt-10">
          <Link href="/studio" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            ‹ All Learning Studio courses
          </Link>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-x-14 gap-y-10 items-center mt-8">
            <div>
              <p className="text-[15px] text-gray-500">{card.vendor}, {(KIND_LABEL[card.kind] || card.kind).toLowerCase()}, {card.level.toLowerCase()} level</p>
              <h1 className="font-heading font-bold tracking-[-0.035em] leading-[1.06] text-[clamp(32px,4.2vw,54px)] mt-3 text-gray-900">
                {course.title}
              </h1>
              <p className="text-[18px] leading-[1.5] text-gray-600 mt-5 max-w-xl">{course.subtitle}</p>
              {summary.count > 0 && (
                <a href="#reviews" className="mt-4 inline-flex items-center gap-2 text-[15px] text-gray-900">
                  <span className="font-semibold tabular-nums">{summary.average.toFixed(1)}</span>
                  <Stars value={summary.average} size={16} />
                  <span className="text-gray-500 underline-offset-2 hover:underline">({summary.count} {summary.count === 1 ? 'rating' : 'ratings'})</span>
                </a>
              )}
              {point && point.kind !== 'start' ? (
                <div className="mt-8"><ResumePanel slug={slug} point={point} /></div>
              ) : (
              price && !enrolled ? (
              <div className="mt-8">
                <PriceLine className="mb-4" />
                <div className="flex flex-wrap items-center gap-4">
                  <BuyButton />
                  <a href="#previews" className="text-[14px] font-semibold text-gray-900 underline underline-offset-4 hover:text-primary-600">Watch {previews.size} preview lessons</a>
                </div>
                <CouponBox className="mt-3" />
                <p className="mt-2.5 text-[13px] text-gray-500">One payment. Every lesson, lab and quiz, and a certificate. Previews need no sign-in.</p>
              </div>
              ) : (
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <EnrollButton slug={slug} enrolled={enrolled} />
                {!learner && <p className="text-[13px] text-gray-500">You sign in once to start.</p>}
              </div>
              )
              )}
              <dl className="flex flex-wrap gap-x-8 gap-y-2 mt-8 text-[15px]">
                {[
                  [course.stats.sections, 'modules'],
                  [course.stats.lectures, 'video lessons'],
                  [course.stats.quizzes, 'quizzes'],
                  ...(card.hours ? [[`${card.hours} h`, 'of video']] : []),
                ].map(([v, l]) => (
                  <div key={String(l)} className="flex items-baseline gap-2">
                    <dt className="font-semibold text-gray-900 tabular-nums">{v}</dt>
                    <dd className="text-gray-500">{l}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative">
              {offer && <OfferRibbon percent={offer.percent} className="rounded-tr-2xl" />}
              {promo ? (
                <PromoPlayer src={promo} poster={card.thumbnailUrl} resumeKey={`studio-${slug}`} underRibbon={!!offer} />
              ) : card.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={card.thumbnailUrl} alt="" className="w-full aspect-video object-cover rounded-2xl shadow-[0_30px_60px_-20px_rgba(0,0,0,.6)] ring-1 ring-white/10" />
              ) : null}
            </div>
          </div>

          <div className="mt-8">
            <CourseStrip sections={course.sections} height={26} animate />
            <div className="mt-4">
              <StripLegend sections={course.sections} />
            </div>
            <p className="text-[13px] text-gray-500 mt-3">Each bar is one lesson. Gaps separate the modules.</p>
          </div>
        </div>
      </section>

      <div className="max-w-[1240px] mx-auto px-5 sm:px-6 py-10 lg:py-14 grid lg:grid-cols-[minmax(0,1fr)_320px] gap-x-12 gap-y-12">
        <div className="min-w-0 space-y-14">
          <section>
            <h2 className="font-heading text-[28px] font-bold tracking-[-0.02em] text-gray-900 mb-6">What you will be able to do</h2>
            <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
              {course.outcomes.map(o => (
                <li key={o} className="flex gap-3 text-[15.5px] leading-[1.5] text-gray-700">
                  <Check className="w-[18px] h-[18px] shrink-0 mt-[3px] text-primary-600" strokeWidth={2.5} />
                  {o}
                </li>
              ))}
            </ul>
          </section>

          <section id="curriculum" className="scroll-mt-24">
            <h2 className="font-heading text-[28px] font-bold tracking-[-0.02em] text-gray-900 mb-2">Curriculum</h2>
            <p className="text-gray-500 mb-6">{totalItems} items (lessons and quizzes) across {course.sections.length} modules. {enrolled ? 'Pick any lesson to open it.' : price ? `The ${previews.size} preview lessons are listed first. The rest open when you buy the course.` : 'Pick any lesson to open it. You will sign in first if you have not already.'}</p>
            <PreviewProvider slug={slug} previews={price && !enrolled ? previewList : []}>
            <PreviewList />
            <OutlineGate slug={slug}>
            <div className="space-y-3">
              {course.sections.map((s, i) => {
                const { number, name } = moduleLabel(s.title)
                const mix = (['lecture', 'lab', 'demo', 'quiz'] as const).map((k) => [k, s.items.filter((it) => kindOf(it) === k).length] as const).filter(([, n]) => n > 0)
                const minutes = Math.round(s.items.reduce((n, it) => n + (it.type === 'lecture' ? it.durationSec || 0 : 0), 0) / 60)
                return (
                  <details key={i} className="group st-card !rounded-2xl overflow-hidden" open={i === Math.min(1, course.sections.length - 1)}>
                    <summary className="cursor-pointer list-none px-4 py-4 sm:px-6 sm:py-5 flex items-start gap-4 [&::-webkit-details-marker]:hidden after:!content-none">
                      <span className={`st-ico ${MODULE_TONES[i % MODULE_TONES.length]} mt-0.5`} style={{ ['--s' as string]: '40px' }} aria-hidden="true">
                        {number ? <b>{number}</b> : <BookOpen fill="none" stroke="currentColor" strokeWidth={1.9} />}
                      </span>
                      <div className="min-w-0 flex-1">
                        {number && <p className="text-[12.5px] font-semibold text-gray-500">Module {number}</p>}
                        <h3 className="font-heading text-[18px] font-semibold leading-snug tracking-[-0.01em] text-gray-900">{name}</h3>
                        <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13.5px] text-gray-500">
                          <span className="font-medium text-gray-700">{s.items.length} {s.items.length === 1 ? 'item' : 'items'}{minutes ? `, ${minutes >= 60 ? `${Math.floor(minutes / 60)} h ${minutes % 60} min` : `${minutes} min`}` : ''}</span>
                          {mix.map(([k, n]) => (
                            <span key={k} className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full" style={{ background: KIND_COLOR[k] }} />{n} {MIX_WORD[k][n === 1 ? 0 : 1]}</span>
                          ))}
                        </p>
                        <div className="mt-3 max-w-md"><CourseStrip sections={[s]} height={8} maxSeconds={longestLesson(course.sections)} /></div>
                      </div>
                      <ChevronDown className="mt-1.5 h-5 w-5 shrink-0 text-gray-400 transition-transform group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <ul className="border-t border-gray-200 px-2 py-2.5 sm:px-3.5 grid gap-0.5">
                      {s.items.map(it => {
                        const mins = it.type === 'lecture' && it.durationSec ? Math.max(1, Math.round(it.durationSec / 60)) : undefined
                        return (
                          <li key={it.id}>
                            {enrolled ? (
                              <Link href={`/studio/${slug}/learn?item=${it.id}`} className="group/line block rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500">
                                <LessonLine title={it.title} kind={kindOf(it)} minutes={mins} state={progress[it.id]?.done ? 'done' : 'open'} />
                              </Link>
                            ) : price ? (
                              <LessonRow id={it.id} title={it.title} kind={kindOf(it)} minutes={mins} preview={previews.has(it.id)} />
                            ) : (
                              <OutlineLesson id={it.id} title={it.title} kind={kindOf(it)} minutes={mins} />
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  </details>
                )
              })}
            </div>
            </OutlineGate>
            </PreviewProvider>
            {price && !enrolled && (
              <div className="mt-8 st-card st-solid p-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="font-heading text-[19px] font-semibold text-gray-900">Get the full course</div>
                  <div className="text-[14px] text-gray-600 mt-1">{course.stats.lectures} video lessons, the labs, {course.stats.quizzes} quizzes and a certificate.</div>
                  <CouponBox className="mt-2" />
                </div>
                <BuyButton />
              </div>
            )}
          </section>

          <section>
            <h2 className="font-heading text-[28px] font-bold tracking-[-0.02em] text-gray-900 mb-6">About this course</h2>
            {course.about && course.about.length > 0 ? (
              <CourseAbout blocks={course.about} counts={counts} slug={slug} />
            ) : (
              <div className="space-y-4 text-[16.5px] leading-[1.75] text-gray-700">
                {course.description.map((p, i) => <p key={i} className="whitespace-pre-line st-justify">{p}</p>)}
              </div>
            )}
          </section>

          <CourseReviews slug={slug} enrolled={enrolled} />
        </div>

        <aside className="lg:sticky lg:top-24 self-start space-y-10">
          {badge && (
            <div className="st-card st-solid overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={badge} alt="Microsoft Certified: Azure AI App and Agent Developer Associate" className="w-full aspect-[4/3] object-cover object-top" />
              <p className="px-6 py-4 text-[14px] text-gray-600">This course prepares you for the certification above.</p>
            </div>
          )}
          <div className="rounded-2xl bg-gray-50 p-7">
            <h2 className="font-heading text-[19px] font-semibold leading-snug tracking-[-0.01em] text-gray-900 mb-3">Before you start</h2>
            <ul className="space-y-2.5 text-[14.5px] leading-snug text-gray-700 list-disc pl-5">
              {course.requirements.map(r => <li key={r}>{r}</li>)}
            </ul>
          </div>
          <div className="px-1">
            <h2 className="font-heading text-[19px] font-semibold leading-snug tracking-[-0.01em] text-gray-900 mb-3">Who it is for</h2>
            <ul className="space-y-2.5 text-[14.5px] leading-snug text-gray-700 list-disc pl-5">
              {course.audience.map(r => <li key={r}>{r}</li>)}
            </ul>
          </div>
          {enrolled && (
            <Link href={`/studio/${slug}/discussion`} className="block rounded-2xl border border-gray-200 p-5 hover:border-primary-400 transition-colors">
              <div className="font-heading font-semibold text-gray-900">Course discussion</div>
              <div className="text-[14px] text-gray-500 mt-1">Ask questions and talk with other learners and the team.</div>
            </Link>
          )}
          {course.instructor && <InstructorCredentials slug={slug} instructor={course.instructor} />}
        </aside>
      </div>
    </main>
    </Shell>
  )
}
