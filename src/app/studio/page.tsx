import { offerOf, previewIds, priceOf } from '@/lib/lms-access'
import type { Metadata } from 'next'
import { listLmsCourses, toCard } from '@/lib/lms'
import { ratingSummaries } from '@/lib/lms-community'
import AcademyBar from '@/components/academy/AcademyBar'
import AcademySwitch, { STUDIO_NAME } from '@/components/academy/AcademySwitch'
import WalkthroughVideo from '@/components/WalkthroughVideo'
import { getCustomTaxonomy } from '@/lib/lms-taxonomy-store'
import LabsCatalog from '@/components/academy/LabsCatalog'

export const metadata: Metadata = {
  title: `${STUDIO_NAME} - Hands-on certification and project courses`,
  description:
    'Hands-on video courses and real projects for Microsoft, Google, AWS and Claude. Labs run on camera, quizzes check you as you go, and your progress follows you to any device.',
  alternates: { canonical: 'https://gennoor.com/studio' },
}

export const dynamic = 'force-dynamic'

export default async function LabsPage() {
  const all = await listLmsCourses()
  const previewCount = Object.fromEntries(all.map(c => [c.slug, previewIds(c).length]))
  const cards = all.map(toCard)
  const ratings = await ratingSummaries(cards.map(c => c.slug))
  const prices = Object.fromEntries(await Promise.all(cards.map(async c => [c.slug, await priceOf(c.slug)] as const)))
  const offers = Object.fromEntries(await Promise.all(cards.map(async c => [c.slug, await offerOf(c, prices[c.slug])] as const)))
  const courses = cards.map(c => ({
    ...c, rating: ratings[c.slug]?.count ? ratings[c.slug] : undefined, priceUsd: prices[c.slug]?.usd, previews: previewCount[c.slug],
    offer: offers[c.slug] ? { percent: offers[c.slug]!.percent, regularUsd: offers[c.slug]!.regular.usd } : undefined,
  }))
  return (
    <main className="bg-gray-50 min-h-screen">
      <AcademyBar section="Certifications & Projects" />
      <section className="max-w-6xl mx-auto px-6 pt-5 lg:pt-6 pb-6 text-center">
        <AcademySwitch active="studio" />
        <h1 className="font-heading font-bold tracking-[-0.035em] leading-[1.04] text-[clamp(38px,5.4vw,68px)] text-gray-900 max-w-3xl mx-auto mt-6">
          Learn it by building it.
        </h1>
        <p className="text-[19px] leading-[1.5] text-gray-500 max-w-2xl mx-auto mt-5">
          Certification courses and real projects on video, with captions and labs. Watch the preview lessons of any course without signing in.
        </p>
      </section>
      <section className="max-w-4xl mx-auto px-6 pb-10">
        <p className="text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-gray-500 mb-4">How the Learning Studio works</p>
        <WalkthroughVideo />
      </section>
      <LabsCatalog courses={courses} custom={await getCustomTaxonomy()} />
    </main>
  )
}
