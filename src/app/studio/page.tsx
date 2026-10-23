import type { Metadata } from 'next'
import { listLmsCourses, toCard } from '@/lib/lms'
import AcademyBar from '@/components/academy/AcademyBar'
import AcademySwitch, { STUDIO_NAME } from '@/components/academy/AcademySwitch'
import LabsCatalog from '@/components/academy/LabsCatalog'

export const metadata: Metadata = {
  title: `${STUDIO_NAME} - Hands-on certification and project courses`,
  description:
    'Hands-on video courses and real projects for Microsoft, Google, AWS and Claude. Labs run on camera, quizzes check you as you go, and your progress follows you to any device. Free with a Gennoor Academy account.',
  alternates: { canonical: 'https://gennoor.com/studio' },
}

export const dynamic = 'force-dynamic'

export default async function LabsPage() {
  const courses = (await listLmsCourses()).map(toCard)
  return (
    <main className="bg-[#f5f6f8] min-h-screen">
      <AcademyBar section="Certifications & Projects" />
      <section className="max-w-6xl mx-auto px-6 pt-12 lg:pt-16 pb-10 text-center">
        <AcademySwitch active="studio" />
        <h1 className="font-heading font-bold tracking-[-0.035em] leading-[1.04] text-[clamp(38px,5.4vw,68px)] text-gray-900 max-w-3xl mx-auto mt-12">
          Learn it by building it.
        </h1>
        <p className="text-[19px] leading-[1.5] text-[#6e6e73] max-w-2xl mx-auto mt-5">
          Certification courses and real projects, taught on video. Every lesson has captions, the labs run on camera, and you pick up exactly where you stopped on any device.
        </p>
      </section>
      <LabsCatalog courses={courses} />
    </main>
  )
}
