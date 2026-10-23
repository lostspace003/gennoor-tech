import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { verifyLearnerSession } from '@/lib/learner-auth'
import { getLmsCourse, getLmsProgress, imageUrl, isEnrolled, promoUrl, toCard, type LmsProgressEntry } from '@/lib/lms'
import { resumePoint } from '@/lib/lms-resume'
import ResumePanel from '@/components/academy/ResumePanel'
import { kindOf, KIND_COLOR } from '@/lib/lms-kind'
import AcademyBar from '@/components/academy/AcademyBar'
import EnrollButton from '@/components/academy/EnrollButton'
import PromoPlayer from '@/components/academy/PromoPlayer'
import CourseAbout from '@/components/academy/CourseAbout'
import CourseReviews from '@/components/academy/CourseReviews'
import { Stars } from '@/components/academy/Stars'
import { getReviews } from '@/lib/lms-community'
import { CourseStrip, StripLegend } from '@/components/academy/CourseStrip'
import { BreadcrumbJsonLd } from '@/components/JsonLd'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

const KIND_LABEL: Record<string, string> = { certification: 'Certification course', project: 'Project course', course: 'Course' }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const course = await getLmsCourse(slug)
  if (!course) return {}
  const url = `https://gennoor.com/studio/${slug}`
  return {
    title: `${course.title} - Learning Studio`,
    description: course.subtitle,
    alternates: { canonical: url },
    openGraph: { type: 'website', url, title: course.title, description: course.subtitle },
  }
}

export default async function LabsCoursePage({ params }: PageProps) {
  const { slug } = await params
  const course = await getLmsCourse(slug)
  if (!course) notFound()

  const learner = await verifyLearnerSession()
  const enrolled = learner ? await isEnrolled(learner.email, slug).catch(() => false) : false
  const progress: Record<string, LmsProgressEntry> = learner && enrolled ? await getLmsProgress(learner.email, slug).catch(() => ({})) : {}
  const point = enrolled ? resumePoint(course, progress) : null
  const totalItems = course.sections.reduce((n, s) => n + s.items.length, 0)
  const card = toCard(course)
  const promo = promoUrl(course)
  const counts = { hours: card.hours, lecture: 0, lab: 0, demo: 0, quiz: 0 }
  for (const s of course.sections) for (const i of s.items) counts[kindOf(i)] += 1
  const badge = imageUrl(course, course.badge)
  const { summary } = await getReviews(slug).catch(() => ({ summary: { average: 0, count: 0, counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } } }))

  return (
    <main className="bg-white">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://gennoor.com' },
          { name: 'Learning Studio', url: 'https://gennoor.com/studio' },
          { name: course.title, url: `https://gennoor.com/studio/${slug}` },
        ]}
      />

      <AcademyBar section="Certifications & Projects" />

      {/* Hero: the promo plays first, then the shape of the whole course */}
      <section className="bg-[#0f1824] text-white">
        <div className="max-w-6xl mx-auto px-6 pt-10 pb-12 lg:pt-14">
          <Link href="/studio" className="text-sm text-[#8d9bb0] hover:text-white transition-colors">
            ‹ All Learning Studio courses
          </Link>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-x-14 gap-y-10 items-center mt-8">
            <div>
              <p className="text-[15px] text-[#8d9bb0]">{card.vendor}, {(KIND_LABEL[card.kind] || card.kind).toLowerCase()}, {card.level.toLowerCase()} level</p>
              <h1 className="font-heading font-bold tracking-[-0.035em] leading-[1.06] text-[clamp(32px,4.2vw,54px)] mt-3 !text-white">
                {course.title}
              </h1>
              <p className="text-[18px] leading-[1.5] text-[#aab6c8] mt-5 max-w-xl">{course.subtitle}</p>
              {summary.count > 0 && (
                <a href="#reviews" className="mt-4 inline-flex items-center gap-2 text-[15px] text-white">
                  <span className="font-semibold tabular-nums">{summary.average.toFixed(1)}</span>
                  <Stars value={summary.average} size={16} />
                  <span className="text-[#8d9bb0] underline-offset-2 hover:underline">({summary.count} {summary.count === 1 ? 'rating' : 'ratings'})</span>
                </a>
              )}
              {point && point.kind !== 'start' ? (
                <div className="mt-8"><ResumePanel slug={slug} point={point} dark /></div>
              ) : (
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <EnrollButton slug={slug} enrolled={enrolled} />
                {!learner && <p className="text-[13px] text-[#8d9bb0]">Free. You sign in once to start.</p>}
              </div>
              )}
              <dl className="flex flex-wrap gap-x-8 gap-y-2 mt-8 text-[15px]">
                {[
                  [course.stats.sections, 'modules'],
                  [course.stats.lectures, 'video lessons'],
                  [course.stats.quizzes, 'quizzes'],
                  ...(card.hours ? [[`${card.hours} h`, 'of video']] : []),
                ].map(([v, l]) => (
                  <div key={String(l)} className="flex items-baseline gap-2">
                    <dt className="font-semibold text-white tabular-nums">{v}</dt>
                    <dd className="text-[#8d9bb0]">{l}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              {promo ? (
                <PromoPlayer src={promo} poster={card.thumbnailUrl} />
              ) : card.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={card.thumbnailUrl} alt="" className="w-full aspect-video object-cover rounded-2xl shadow-[0_30px_60px_-20px_rgba(0,0,0,.6)] ring-1 ring-white/10" />
              ) : null}
            </div>
          </div>

          <div className="mt-12">
            <CourseStrip sections={course.sections} height={52} animate />
            <div className="mt-4">
              <StripLegend sections={course.sections} dark />
            </div>
            <p className="text-[13px] text-[#6f7d92] mt-3">Each bar is one lesson. Gaps separate the modules.</p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16 lg:py-24 grid lg:grid-cols-[minmax(0,1fr)_340px] gap-16">
        <div className="min-w-0 space-y-20">
          <section>
            <h2 className="font-heading text-[28px] font-bold tracking-[-0.02em] text-gray-900 mb-6">What you will be able to do</h2>
            <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
              {course.outcomes.map(o => (
                <li key={o} className="flex gap-3 text-[15.5px] leading-[1.5] text-[#3a3a3f]">
                  <Check className="w-[18px] h-[18px] shrink-0 mt-[3px] text-primary-600" strokeWidth={2.5} />
                  {o}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-[28px] font-bold tracking-[-0.02em] text-gray-900 mb-2">Curriculum</h2>
            <p className="text-[#6e6e73] mb-6">{totalItems} items (lessons and quizzes) across {course.sections.length} modules. {enrolled ? 'Pick any lesson to play it.' : 'Open a module to see its lessons.'}</p>
            <div className="border-t border-[#e8e8ed]">
              {course.sections.map((s, i) => (
                <details key={i} className="group border-b border-[#e8e8ed]" open={i === Math.min(1, course.sections.length - 1)}>
                  <summary className="cursor-pointer list-none py-5 flex items-center gap-5 [&::-webkit-details-marker]:hidden">
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-gray-900 text-[16px] leading-snug group-open:text-primary-600 transition-colors">{s.title}</div>
                      <div className="mt-3 max-w-xs"><CourseStrip sections={[s]} height={14} /></div>
                    </div>
                    <span className="text-[13px] text-[#86868b] tabular-nums shrink-0">{s.items.length} {s.items.length === 1 ? "lesson" : "lessons"}</span>
                    <span className="text-[#86868b] transition-transform group-open:rotate-90" aria-hidden>›</span>
                  </summary>
                  <ul className="pb-5 grid gap-px">
                    {s.items.map(it => (
                      <li key={it.id}>
                        {enrolled ? (
                          <Link href={`/studio/${slug}/learn?item=${it.id}`} className="flex items-start gap-3 py-1.5 text-[14.5px] leading-snug text-[#424245] hover:text-primary-600 transition-colors">
                            <span className="w-1.5 h-4 rounded-[1px] mt-0.5 shrink-0" style={{ background: KIND_COLOR[kindOf(it)] }} />
                            <span className="flex-1">{it.title}</span>
                            {progress[it.id]?.done && <Check className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" strokeWidth={2.5} />}
                          </Link>
                        ) : (
                          <span className="flex items-start gap-3 py-1.5 text-[14.5px] leading-snug text-[#424245]">
                            <span className="w-1.5 h-4 rounded-[1px] mt-0.5 shrink-0" style={{ background: KIND_COLOR[kindOf(it)] }} />
                            {it.title}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-heading text-[28px] font-bold tracking-[-0.02em] text-gray-900 mb-6">About this course</h2>
            {course.about && course.about.length > 0 ? (
              <CourseAbout blocks={course.about} counts={counts} />
            ) : (
              <div className="space-y-4 text-[16px] leading-[1.7] text-[#3a3a3f] max-w-[68ch]">
                {course.description.map((p, i) => <p key={i} className="whitespace-pre-line">{p}</p>)}
              </div>
            )}
          </section>

          <CourseReviews slug={slug} enrolled={enrolled} />
        </div>

        <aside className="lg:sticky lg:top-24 self-start space-y-10">
          {badge && (
            <div className="rounded-2xl overflow-hidden bg-[#0f1824]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={badge} alt="Microsoft Certified: Azure AI App and Agent Developer Associate" className="w-full aspect-[4/3] object-cover object-top" />
              <p className="px-6 py-4 text-[14px] text-[#aab6c8]">This course prepares you for the certification above.</p>
            </div>
          )}
          <div className="rounded-2xl bg-[#f5f6f8] p-7">
            <h2 className="font-heading font-semibold text-gray-900 mb-3">Before you start</h2>
            <ul className="space-y-2.5 text-[14.5px] leading-snug text-[#424245] list-disc pl-5">
              {course.requirements.map(r => <li key={r}>{r}</li>)}
            </ul>
          </div>
          <div className="px-1">
            <h2 className="font-heading font-semibold text-gray-900 mb-3">Who it is for</h2>
            <ul className="space-y-2.5 text-[14.5px] leading-snug text-[#424245] list-disc pl-5">
              {course.audience.map(r => <li key={r}>{r}</li>)}
            </ul>
          </div>
          {enrolled && (
            <Link href={`/studio/${slug}/discussion`} className="block rounded-2xl border border-[#e2e5ec] p-5 hover:border-primary-400 transition-colors">
              <div className="font-heading font-semibold text-gray-900">Course discussion</div>
              <div className="text-[14px] text-[#6e6e73] mt-1">Ask questions and talk with other learners and the team.</div>
            </Link>
          )}
          {course.instructor && <p className="text-[13.5px] text-[#6e6e73] px-1">Taught by Jalal Khan, {course.instructor}.</p>}
        </aside>
      </div>
    </main>
  )
}
