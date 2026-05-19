import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, ArrowLeft, AlertCircle, Sparkles, GraduationCap } from 'lucide-react'
import { industries, getIndustryBySlug, getPoCsForIndustry } from '@/data/industries'
import { BreadcrumbJsonLd } from '@/components/JsonLd'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return industries.map(i => ({ slug: i.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const industry = getIndustryBySlug(slug)
  if (!industry) return { title: 'Industry not found' }
  return {
    title: `AI for ${industry.name} — ${industry.shortName}`,
    description: industry.tagline,
    alternates: { canonical: `https://gennoor.com/industries/${industry.slug}` },
    openGraph: {
      title: `AI for ${industry.name} — Gennoor Tech`,
      description: industry.tagline,
      url: `https://gennoor.com/industries/${industry.slug}`,
    },
  }
}

export default async function IndustryDetailPage({ params }: PageProps) {
  const { slug } = await params
  const industry = getIndustryBySlug(slug)
  if (!industry) notFound()

  const pocs = getPoCsForIndustry(industry)

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://gennoor.com' },
          { name: 'Industries', url: 'https://gennoor.com/industries' },
          { name: industry.name, url: `https://gennoor.com/industries/${industry.slug}` },
        ]}
      />
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
        {/* Back */}
        <div className="max-w-5xl mx-auto px-6 pt-8">
          <Link href="/industries" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-700 transition-colors">
            <ArrowLeft className="w-4 h-4" /> All industries
          </Link>
        </div>

        {/* Hero */}
        <section className="max-w-5xl mx-auto px-6 pt-6 pb-16">
          <div className="text-xs uppercase tracking-widest text-primary-700 font-bold mb-2">{industry.shortName}</div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-5">
            AI for <span className="text-primary-700">{industry.name}</span>
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mb-8">{industry.tagline}</p>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">{industry.hero}</p>
        </section>

        {/* Why now */}
        <section className="max-w-5xl mx-auto px-6 pb-16">
          <div className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 rounded-2xl border border-gray-200 p-8">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-secondary-600" />
              <h2 className="text-xs uppercase tracking-widest font-bold text-secondary-700">Why now</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">{industry.whyNow}</p>
          </div>
        </section>

        {/* Problems */}
        <section className="max-w-5xl mx-auto px-6 pb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Three problems we solve in {industry.name}</h2>
          <div className="space-y-4">
            {industry.problems.map((p, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{p.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{p.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PoCs */}
        {pocs.length > 0 && (
          <section className="max-w-5xl mx-auto px-6 pb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">PoCs we ship for {industry.name}</h2>
            <p className="text-gray-500 mb-6">Each one comes with a fixed scope, fixed price, and a 90-day sustainment plan.</p>
            <div className="grid md:grid-cols-2 gap-4">
              {pocs.map(p => (
                <Link
                  key={p.id}
                  href={`/resources/pocs/${p.id}`}
                  className="group bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all p-5 flex flex-col"
                >
                  <div className="text-[10px] font-bold tracking-widest uppercase text-primary-700 bg-primary-50 px-2 py-0.5 rounded inline-block self-start mb-2">
                    {p.category}
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-primary-700 transition-colors mb-1">{p.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{p.problem}</p>
                  <div className="mt-auto text-xs text-gray-500">
                    {p.timeline} · {p.priceBand.smb ? `SMB ${p.priceBand.smb} · ` : ''}Enterprise {p.priceBand.enterprise}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Course */}
        {industry.flagshipCourse && (
          <section className="max-w-5xl mx-auto px-6 pb-16">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary-100 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-6 h-6 text-secondary-700" />
              </div>
              <div className="flex-1">
                <div className="text-xs uppercase tracking-widest text-gray-500 mb-0.5">Companion course</div>
                <div className="font-bold text-gray-900">{industry.flagshipCourse}</div>
              </div>
              <Link
                href="/ai-academy"
                className="inline-flex items-center gap-1 px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all text-sm"
              >
                Browse academy <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="max-w-5xl mx-auto px-6 pb-20">
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8 md:p-12 text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Start with a 30-minute call</h2>
            <p className="text-white/80 mb-6 max-w-2xl">
              Tell us the regulator, the data shape, and the deadline. We’ll come back with a fixed-scope proposal in 5 working days.
            </p>
            <Link
              href={`/contact?intent=diagnostic&industry=${industry.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 font-bold rounded-xl hover:shadow-lg transition-all"
            >
              Book a call <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
