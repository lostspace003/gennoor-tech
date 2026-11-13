import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Check } from 'lucide-react'
import PromoPlayer from '@/components/academy/PromoPlayer'
import LiveTrainerPointers from '@/components/training/LiveTrainerPointers'
import OutlinePdfButton from '@/components/training/OutlinePdfButton'
import OutlineViewer from '@/components/training/OutlineViewer'
import ScheduleCallButton from '@/components/training/ScheduleCallButton'
import { getTocCourse, tocLinks } from '@/lib/toc-courses'

export const dynamic = 'force-dynamic'

interface PageProps { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const c = getTocCourse((await params).slug)
  if (!c) return {}
  return {
    title: `${c.title} | Gennoor Tech`,
    description: `${c.tagline}. ${c.days} days (${c.hours} hours) with instructor-led training, online or at your destination.`.slice(0, 300),
    alternates: { canonical: `https://gennoor.com/claude/courses/${c.slug}` },
  }
}

export default async function TocCoursePage({ params }: PageProps) {
  const c = getTocCourse((await params).slug)
  if (!c) notFound()
  const links = tocLinks(c)
  return (
    <main className="bg-surface">
      <section className="bg-[#0b1220] text-white px-6 py-10 lg:py-12">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-sm font-semibold text-primary-300 mb-3">{c.domain}</p>
            <h1 className="font-heading text-white text-[clamp(30px,4vw,48px)] font-bold tracking-[-0.02em] leading-[1.1]">{c.title}</h1>
            <p className="text-[18px] leading-[1.5] text-[#c4cede] mt-4">{c.tagline}.</p>
            <div className="mt-8"><ScheduleCallButton course={c.title} courseSlug={c.slug} /></div>
          </div>
          <div><PromoPlayer src={links.promo} poster={links.thumbnail} autoPlay={false} startMuted={false} resumeKey={`claude-${c.slug}`} /></div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <LiveTrainerPointers days={c.days} hours={c.hours} />
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-12 grid lg:grid-cols-[minmax(0,1fr)_320px] gap-14">
        <div className="space-y-14">
          <section>
            <h2 className="font-heading text-[26px] font-bold tracking-[-0.02em] text-gray-900 mb-5">What you will be able to do</h2>
            <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
              {c.outcomes.map(o => (
                <li key={o} className="flex gap-3 text-[15.5px] leading-[1.5] text-gray-700">
                  <Check className="w-[18px] h-[18px] shrink-0 mt-[3px] text-primary-600" strokeWidth={2.5} />{o}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="font-heading text-[26px] font-bold tracking-[-0.02em] text-gray-900 mb-5">Table of contents</h2>
            <ol className="border-t border-gray-200">
              {c.modules.map((m, i) => (
                <li key={m} className="flex gap-4 py-3.5 border-b border-gray-200 text-[15.5px] text-gray-700">
                  <span className="w-6 shrink-0 text-gray-400 tabular-nums">{i + 1}</span>{m}
                </li>
              ))}
            </ol>
          </section>
        </div>
        <aside className="space-y-5">
          <div className="rounded-2xl border border-gray-200 p-6">
            <p className="text-sm font-semibold text-gray-900">Course outline</p>
            <div className="mt-3 flex flex-col gap-2 text-[15px]">
              <OutlineViewer slug={c.slug} title={c.title} />
              <OutlinePdfButton slug={c.slug} title={c.title} />
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 p-6">
            <p className="text-sm font-semibold text-gray-900">Who it is for</p>
            <p className="text-[14.5px] leading-[1.55] text-gray-500 mt-2">{c.audience}.</p>
            <p className="text-[13.5px] text-gray-400 mt-3">Level: {c.level}</p>
          </div>
          <ScheduleCallButton course={c.title} courseSlug={c.slug} className="w-full inline-flex items-center justify-center rounded-xl bg-primary-600 px-6 py-3 text-[15px] font-semibold text-white hover:bg-primary-700 transition-colors" />
          <Link href="/claude" className="block text-center link-arrow !text-[14px]">‹ All Claude courses</Link>
        </aside>
      </div>
    </main>
  )
}
