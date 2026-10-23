import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Founder — Gennoor Tech',
  description: 'Jalal Ahmed Khan founded Gennoor Tech in Mumbai. He is a Microsoft Certified Trainer.',
  alternates: { canonical: 'https://gennoor.com/about/founder' },
}

export default function FounderPage() {
  return (
    <main className="bg-white">
      <section className="px-6 pt-16 lg:pt-[100px] pb-20 text-center">
        <h1 className="display-hero max-w-[820px] mx-auto">Jalal Ahmed Khan.</h1>
        <p className="text-[clamp(18px,1.8vw,22px)] leading-[1.5] text-[#6e6e73] max-w-[600px] mx-auto mt-6">
          Microsoft Certified Trainer and founder of Gennoor Tech in Mumbai. He started as an engineering teacher and now trains teams to work with AI and Claude.
        </p>
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-[22px] justify-center items-center mt-8">
          <a href="https://www.linkedin.com/in/lostspace003/" target="_blank" rel="noopener noreferrer" className="pill-primary">Jalal on LinkedIn</a>
          <Link href="/about/certifications" className="link-arrow">Credentials ›</Link>
        </div>
      </section>
    </main>
  )
}
