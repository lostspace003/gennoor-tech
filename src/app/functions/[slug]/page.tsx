import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, AlertCircle, GraduationCap } from 'lucide-react'
import { functions, getFunctionBySlug, getPoCsForFunction } from '@/data/functions'
import { BreadcrumbJsonLd } from '@/components/JsonLd'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return functions.map(f => ({ slug: f.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const fn = getFunctionBySlug(slug)
  if (!fn) return { title: 'Function not found' }
  return {
    title: `AI for ${fn.name} — Gennoor Tech`,
    description: fn.tagline,
    alternates: { canonical: `https://gennoor.com/functions/${fn.slug}` },
    openGraph: {
      title: `AI for ${fn.name} — Gennoor Tech`,
      description: fn.tagline,
      url: `https://gennoor.com/functions/${fn.slug}`,
    },
  }
}

export default async function FunctionDetailPage({ params }: PageProps) {
  const { slug } = await params
  const fn = getFunctionBySlug(slug)
  if (!fn) notFound()

  const pocs = getPoCsForFunction(fn)

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://gennoor.com' },
          { name: 'Functions', url: 'https://gennoor.com/functions' },
          { name: fn.name, url: `https://gennoor.com/functions/${fn.slug}` },
        ]}
      />
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-6 pt-8">
          <Link href="/functions" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-secondary-700 transition-colors">
            <ArrowLeft className="w-4 h-4" /> All functions
          </Link>
        </div>

        <section className="max-w-5xl mx-auto px-6 pt-6 pb-16">
          <div className="text-xs uppercase tracking-widest text-secondary-700 font-bold mb-2">FUNCTION PLAYBOOK</div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-5">
            AI for <span className="text-secondary-700">{fn.name}</span>
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mb-8">{fn.tagline}</p>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">{fn.hero}</p>
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Three problems we solve for {fn.name}</h2>
          <div className="space-y-4">
            {fn.problems.map((p, i) => (
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

        {pocs.length > 0 && (
          <section className="max-w-5xl mx-auto px-6 pb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">PoCs we ship for {fn.name}</h2>
            <p className="text-gray-500 mb-6">Fixed scope, fixed price, 90-day sustainment plan.</p>
            <div className="grid md:grid-cols-2 gap-4">
              {pocs.map(p => (
                <Link
                  key={p.id}
                  href={`/resources/pocs/${p.id}`}
                  className="group bg-white rounded-xl border border-gray-200 hover:border-secondary-300 hover:shadow-md transition-all p-5 flex flex-col"
                >
                  <div className="text-[10px] font-bold tracking-widest uppercase text-secondary-700 bg-secondary-50 px-2 py-0.5 rounded inline-block self-start mb-2">
                    {p.category}
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-secondary-700 transition-colors mb-1">{p.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{p.problem}</p>
                  <div className="mt-auto text-xs text-gray-500">
                    {p.timeline} · {p.priceBand.smb ? `SMB ${p.priceBand.smb} · ` : ''}Enterprise {p.priceBand.enterprise}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {fn.flagshipCourse && (
          <section className="max-w-5xl mx-auto px-6 pb-16">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary-100 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-6 h-6 text-secondary-700" />
              </div>
              <div className="flex-1">
                <div className="text-xs uppercase tracking-widest text-gray-500 mb-0.5">Companion course</div>
                <div className="font-bold text-gray-900">{fn.flagshipCourse}</div>
              </div>
              <Link href="/ai-academy" className="inline-flex items-center gap-1 px-4 py-2 bg-secondary-600 text-white font-semibold rounded-lg hover:bg-secondary-700 transition-all text-sm">
                Browse academy <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}

        <section className="max-w-5xl mx-auto px-6 pb-20">
          <div className="bg-gradient-to-br from-secondary-600 to-secondary-800 rounded-2xl p-8 md:p-12 text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Want a {fn.name} AI roadmap in 90 days?</h2>
            <p className="text-white/80 mb-6 max-w-2xl">
              Book a 30-minute call. We’ll map the three problems above to your reality and come back with a fixed-scope proposal in 5 working days.
            </p>
            <Link
              href={`/contact?intent=diagnostic&function=${fn.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-secondary-700 font-bold rounded-xl hover:shadow-lg transition-all"
            >
              Book a call <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
