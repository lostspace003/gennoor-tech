import type { Metadata } from 'next'
import Link from 'next/link'
import { ClaudePartnerSection } from '@/components/ClaudePartner'

export const metadata: Metadata = {
  title: 'About — Gennoor Tech',
  description: 'Gennoor Tech trains organizations to work with AI and Claude, and builds the automations they use. Run by Jalal Ahmed Khan from Mumbai, India.',
  alternates: { canonical: 'https://gennoor.com/about' },
}

export default function AboutPage() {
  return (
    <main className="bg-white">
      <section className="px-6 pt-16 lg:pt-[100px] pb-12 text-center">
        <h1 className="display-hero max-w-[820px] mx-auto">Gennoor Tech.</h1>
        <p className="text-[clamp(18px,1.8vw,22px)] leading-[1.5] text-[#6e6e73] max-w-[640px] mx-auto mt-6">
          A training and automation company in Mumbai, India. We teach teams to work with AI and Claude, and we build the automations they use.
        </p>
      </section>

      <section className="px-6 pb-16">
        <div className="max-w-[720px] mx-auto space-y-5 text-[17px] leading-[1.7] text-[#3a3a3f]">
          <p>
            Gennoor Tech is run by <strong>Jalal Ahmed Khan</strong>, a Microsoft Certified Trainer. He started as an engineering teacher and has spent the years since teaching teams to work with Microsoft&rsquo;s AI and cloud tools.
          </p>
          <p>
            Today the work is training organizations to use Claude and other AI tools, building automations with them, and building learning platforms. The Learning Studio on this site is one of those platforms, built with Claude.
          </p>
          <p>
            We are based in Mumbai, India. You can reach us on the <Link href="/contact" className="text-primary-600 hover:underline">contact page</Link>.
          </p>
        </div>
      </section>

      <ClaudePartnerSection />

      <section className="bg-[#f5f5f7] px-6 py-16 lg:py-[90px]">
        <div className="max-w-[1080px] mx-auto">
          <h2 className="display-section text-center mb-10">Find out more.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: 'Training', href: '/training', body: 'Live training for teams.' },
              { title: 'Automation', href: '/automation', body: 'What we build and how we scope it.' },
              { title: 'Founder', href: '/about/founder', body: 'Jalal Ahmed Khan.' },
              { title: 'Work with us', href: '/join', body: 'Trainers and engineers, freelance or full-time.' },
              { title: 'Credentials', href: '/about/certifications', body: 'Certifications held.' },
            ].map(c => (
              <Link key={c.title} href={c.href} className="bg-white rounded-[18px] p-6 hover:shadow-md transition-shadow">
                <h3 className="font-heading text-[17px] font-bold text-gray-900">{c.title}</h3>
                <p className="text-[14.5px] text-[#6e6e73] mt-1.5">{c.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
