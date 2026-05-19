import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, ArrowLeft, Clock, DollarSign, RefreshCcw, GraduationCap, Github, Layers, BookOpen } from 'lucide-react'
import { pocs, getPoCById } from '@/data/pocs'
import { industries } from '@/data/industries'
import { functions as bizFunctions } from '@/data/functions'

const industryNameToSlug = new Map(industries.map(i => [i.name.toLowerCase(), i.slug]))
const functionNameToSlug = new Map(
  bizFunctions.flatMap(f => {
    const variants = [f.name.toLowerCase(), f.slug.toLowerCase()]
    if (f.name.includes(' & ')) variants.push(f.name.split(' & ')[0].toLowerCase())
    return variants.map(v => [v, f.slug] as const)
  })
)

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return pocs.map(p => ({ slug: p.id }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const poc = getPoCById(slug)
  if (!poc) return { title: 'PoC not found' }
  return {
    title: `${poc.title} — Gennoor Tech PoC`,
    description: poc.problem,
    alternates: { canonical: `https://gennoor.com/resources/pocs/${poc.id}` },
    openGraph: {
      title: `${poc.title} — Gennoor Tech PoC`,
      description: poc.problem,
      url: `https://gennoor.com/resources/pocs/${poc.id}`,
    },
  }
}

export default async function PoCDetailPage({ params }: PageProps) {
  const { slug } = await params
  const poc = getPoCById(slug)
  if (!poc) notFound()

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Back link */}
      <div className="max-w-5xl mx-auto px-6 pt-8">
        <Link
          href="/resources/pocs"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> All PoCs
        </Link>
      </div>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-6 pb-12">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-[10px] font-bold tracking-widest uppercase text-primary-700 bg-primary-50 px-2 py-1 rounded">
            {poc.category}
          </span>
          <span className="text-[10px] font-bold tracking-widest uppercase text-secondary-700 bg-secondary-50 px-2 py-1 rounded">
            {poc.phaseTag}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">{poc.title}</h1>
        <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">{poc.problem}</p>
      </section>

      {/* What we build */}
      <section className="max-w-5xl mx-auto px-6 pb-12">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4" /> What we build
          </h2>
          <ul className="space-y-3">
            {poc.build.map((b, i) => (
              <li key={i} className="flex gap-3 text-gray-700">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-700 font-bold text-xs flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Quick facts */}
      <section className="max-w-5xl mx-auto px-6 pb-12">
        <div className="grid md:grid-cols-3 gap-4">
          <FactCard icon={Clock} label="Timeline" value={poc.timeline} />
          <FactCard
            icon={DollarSign}
            label="Price band"
            value={poc.priceBand.smb ? `SMB ${poc.priceBand.smb}` : `Enterprise only`}
            sub={`Enterprise ${poc.priceBand.enterprise}`}
          />
          <FactCard icon={RefreshCcw} label="Sustainment" value={poc.sustainmentBand} />
        </div>
      </section>

      {/* Architecture */}
      {poc.architecture && (
        <section className="max-w-5xl mx-auto px-6 pb-12">
          <div className="bg-[#0C1426] text-white rounded-2xl p-6 overflow-x-auto">
            <h2 className="text-sm font-bold uppercase tracking-widest text-secondary-300 mb-4">Architecture</h2>
            <pre className="text-xs leading-relaxed font-mono text-white/80 whitespace-pre">{poc.architecture}</pre>
          </div>
        </section>
      )}

      {/* Tech stack */}
      <section className="max-w-5xl mx-auto px-6 pb-12">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-3">Technology stack</h2>
          <div className="flex flex-wrap gap-2">
            {poc.technologies.map(t => (
              <span
                key={t}
                className="text-xs font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics */}
      {poc.metrics && poc.metrics.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 pb-12">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-3">Reference metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {poc.metrics.map(m => (
              <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <div className="text-2xl font-bold text-primary-700">{m.value}</div>
                <div className="text-xs text-gray-500 mt-1">{m.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Paired course */}
      {poc.pairedCourseTitle && (
        <section className="max-w-5xl mx-auto px-6 pb-12">
          <div className="bg-gradient-to-r from-secondary-50 to-primary-50 rounded-2xl border border-gray-200 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-6 h-6 text-primary-700" />
            </div>
            <div className="flex-1">
              <div className="text-xs uppercase tracking-widest text-gray-500 mb-0.5">Paired course</div>
              <div className="font-bold text-gray-900">{poc.pairedCourseTitle}</div>
            </div>
            <Link
              href={`/ai-academy`}
              className="hidden sm:inline-flex items-center gap-1 px-4 py-2 bg-white text-primary-700 font-semibold rounded-lg hover:shadow-md transition-all text-sm"
            >
              See course <BookOpen className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* Industries */}
      <section className="max-w-5xl mx-auto px-6 pb-12">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-3">Industries</h2>
            <div className="flex flex-wrap gap-2">
              {poc.industries.map(i => {
                const slug = industryNameToSlug.get(i.toLowerCase())
                const cls = 'text-xs font-medium text-primary-700 bg-primary-50 px-3 py-1.5 rounded-full'
                return slug ? (
                  <Link key={i} href={`/industries/${slug}`} className={`${cls} hover:bg-primary-100 transition-colors`}>
                    {i} →
                  </Link>
                ) : (
                  <span key={i} className={cls}>{i}</span>
                )
              })}
            </div>
          </div>
          {poc.functions && poc.functions.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-3">Functions</h2>
              <div className="flex flex-wrap gap-2">
                {poc.functions.map(f => {
                  const slug = functionNameToSlug.get(f.toLowerCase())
                  const cls = 'text-xs font-medium text-secondary-700 bg-secondary-50 px-3 py-1.5 rounded-full'
                  return slug ? (
                    <Link key={f} href={`/functions/${slug}`} className={`${cls} hover:bg-secondary-100 transition-colors`}>
                      {f} →
                    </Link>
                  ) : (
                    <span key={f} className={cls}>{f}</span>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Note */}
      {poc.note && (
        <section className="max-w-5xl mx-auto px-6 pb-12">
          <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-5 text-sm leading-relaxed">
            <strong>Note: </strong>{poc.note}
          </div>
        </section>
      )}

      {/* CTAs */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8 md:p-12 text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to scope this PoC?</h2>
          <p className="text-white/80 mb-6 max-w-2xl">
            Book a 30-minute discovery call. We’ll write a fixed-scope, fixed-price proposal within 5 working days.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/contact?intent=poc&poc=${poc.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 font-bold rounded-xl hover:shadow-lg transition-all"
            >
              Get this PoC scoped <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact?intent=delivery"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white border border-white/20 font-semibold rounded-xl hover:bg-white/20 transition-all"
            >
              Talk to delivery
            </Link>
            {poc.githubUrl && (
              <a
                href={poc.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-transparent text-white border border-white/30 font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                <Github className="w-4 h-4" /> Reference repo
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

function FactCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Clock
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center gap-2 text-gray-400 mb-2">
        <Icon className="w-4 h-4" />
        <span className="text-[10px] uppercase tracking-widest font-bold">{label}</span>
      </div>
      <div className="text-xl font-bold text-gray-900">{value}</div>
      {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
    </div>
  )
}
