import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { PersonJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'About Jalal Ahmed Khan & Gennoor Tech — Enterprise AI Expert',
  description: 'Meet Jalal Ahmed Khan — Microsoft Certified Trainer with 16 certifications, 14+ years of experience, and Fortune 500 clients across 6 countries. Founder of Gennoor Tech Private Limited.',
  keywords: ['Jalal Ahmed Khan', 'Microsoft Certified Trainer', 'Gennoor Tech', 'enterprise AI consultant', 'AI trainer'],
  alternates: { canonical: 'https://gennoor.com/about' },
  openGraph: {
    title: 'About Jalal Ahmed Khan & Gennoor Tech',
    description: 'Microsoft Certified Trainer with 16 certifications, 14+ years experience, Fortune 500 clients across 6 countries.',
    url: 'https://gennoor.com/about',
  },
}

/**
 * About hub in the Apple idiom, per the redesign handoff: display hero,
 * founder card with portrait and stats, six "Get to know us" cards mapped
 * to the real subpages, the dark delivery-model band, and the CTA.
 */

const sections = [
  { title: 'My Journey', description: 'From automobile engineering professor to global AI transformation leader.', highlight: '14+ years of experience', href: '/about/journey' },
  { title: 'Credentials', description: 'Microsoft Certified Trainer with 16 active certifications including Agentic AI.', highlight: '376+ hours on Microsoft Learn', href: '/about/certifications' },
  { title: 'The Company', description: 'Founded to democratize AI adoption across GCC, Africa, and APAC.', highlight: 'Vision 2030 aligned', href: '/about/company' },
  { title: 'Team & Delivery', description: 'Senior-only model, published operating cadence, honest capacity.', highlight: 'How we work', href: '/about/team-and-delivery' },
  { title: 'Trust & Security', description: 'Data handling, IP ownership, compliance, sub-processors, and stack.', highlight: 'Read the commitments', href: '/about/trust-and-security' },
  { title: 'Case Studies', description: 'Client success stories and testimonials from live engagements.', highlight: 'See the work', href: '/portfolio/case-studies' },
]

const stats = [
  { value: '16', label: 'Certifications' },
  { value: '14+', label: 'Years' },
  { value: '6', label: 'Countries' },
  { value: '376+', label: 'Hours on MS Learn' },
]

export default function AboutPage() {
  return (
    <>
      <PersonJsonLd />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://gennoor.com' },
        { name: 'About', url: 'https://gennoor.com/about' },
      ]} />

      <main className="min-h-screen bg-white">
        {/* ===== Hero ===== */}
        <section className="px-8 pt-20 lg:pt-[110px] pb-20 text-center">
          <div className="kicker mb-5">About Gennoor Tech</div>
          <h1 className="text-[clamp(38px,4.4vw,60px)] leading-[1.08] tracking-[-0.03em] font-bold text-gray-900 max-w-[840px] mx-auto">
            The next wave of AI value shouldn&rsquo;t skip our regions.
          </h1>
          <p className="text-[clamp(18px,1.8vw,22px)] leading-[1.45] text-[#6e6e73] max-w-[640px] mx-auto mt-[22px]">
            Gennoor Tech is the AI transformation partner for enterprises and
            growing businesses across GCC, Africa, and South Asia.
          </p>
        </section>

        {/* ===== Founder ===== */}
        <section className="bg-[#f5f5f7] px-8 py-20">
          <div className="max-w-[920px] mx-auto bg-white rounded-3xl p-8 lg:p-12 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 md:gap-11 items-center">
            <Image
              src="/assets/jalal-portrait.jpeg"
              alt="Jalal Ahmed Khan"
              width={200}
              height={200}
              className="w-[160px] h-[160px] md:w-[200px] md:h-[200px] object-cover rounded-full mx-auto"
            />
            <div>
              <div className="kicker !tracking-[0.14em] mb-2">Founder</div>
              <h2 className="text-[28px] font-bold tracking-[-0.02em] text-gray-900 mb-2.5">
                Jalal Ahmed Khan
              </h2>
              <p className="text-[15px] leading-[1.6] text-[#6e6e73] mb-[18px]">
                From automobile engineering professor to global AI transformation
                leader. Microsoft Certified Trainer with 16 active certifications
                including Agentic AI, 14+ years of experience, and Fortune 500
                clients across six countries.
              </p>
              <div className="flex flex-wrap gap-7">
                {stats.map(s => (
                  <div key={s.label}>
                    <div className="text-[22px] font-bold tracking-[-0.02em] text-gray-900">{s.value}</div>
                    <div className="text-xs text-[#86868b]">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== Get to know us ===== */}
        <section className="px-8 py-16 lg:py-24">
          <div className="max-w-[1080px] mx-auto">
            <h2 className="display-card text-center mb-12">Get to know us.</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sections.map(section => (
                <Link
                  key={section.title}
                  href={section.href}
                  className="bg-white border border-[#e8e8ed] hover:border-[#d2d2d7] rounded-[18px] px-[26px] py-7 flex flex-col min-h-[170px] text-gray-900 transition-colors"
                >
                  <h3 className="text-[18px] font-bold mb-2">{section.title}</h3>
                  <p className="text-[13.5px] leading-[1.55] text-[#6e6e73] mb-3.5">
                    {section.description}
                  </p>
                  <p className="text-[12.5px] font-semibold text-primary-600 mt-auto">
                    {section.highlight}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Delivery model ===== */}
        <section className="bg-[#1d1d1f] px-8 py-16 lg:py-24">
          <div className="max-w-[1080px] mx-auto text-center">
            <h2 className="display-card !text-white mb-3">Senior-only, by design.</h2>
            <p className="text-[18px] text-[#a1a1a6] max-w-[600px] mx-auto mb-14">
              No bench, no juniors billed as seniors, no handoffs to people you
              haven&rsquo;t met. The model is boutique on purpose.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left md:text-center">
              {[
                { title: 'Who scopes, delivers', body: 'The engineer on the sales call is the engineer on the build.' },
                { title: 'Regional presence', body: 'Delivery in GCC, Africa, and South Asia timezones — on-site when it matters.' },
                { title: 'Transparent capacity', body: 'We publish our operating cadence and take fewer engagements than we could.' },
              ].map(cell => (
                <div key={cell.title}>
                  <div className="text-[17px] font-bold text-white mb-1.5">{cell.title}</div>
                  <div className="text-sm leading-[1.55] text-[#a1a1a6]">{cell.body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="bg-[#f5f5f7] px-8 py-[90px] text-center">
          <h2 className="display-card">Work with us.</h2>
          <p className="text-[18px] text-[#6e6e73] mt-3 mb-7 max-w-[440px] mx-auto">
            Start with the diagnostic, or just start a conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-[22px] justify-center items-center">
            <Link href="/ai-readiness" className="pill-primary-sm">
              Run the diagnostic
            </Link>
            <Link href="/contact" className="text-[15px] font-medium text-primary-600 hover:text-[#0077ed]">
              Contact us ›
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
