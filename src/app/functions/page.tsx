import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Users, Calculator, TrendingUp, Headphones, Truck, Scale } from 'lucide-react'
import { functions } from '@/data/functions'
import { BreadcrumbJsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'AI by Function — HR, Finance, Sales, CS, Operations, Legal',
  description:
    'Function-specific AI solutions: HR copilots, finance reconciliation agents, sales proposal generators, multilingual support agents, demand forecasting, contract review.',
  keywords: [
    'AI for HR',
    'AI for finance',
    'AI for sales',
    'AI for customer service',
    'AI for operations',
    'AI for legal',
  ],
  alternates: { canonical: 'https://gennoor.com/functions' },
  openGraph: {
    title: 'AI by Function — Gennoor Tech',
    description: 'Function-specific AI playbooks with mapped PoCs and courses.',
    url: 'https://gennoor.com/functions',
  },
}

const iconBySlug: Record<string, typeof Users> = {
  hr: Users,
  finance: Calculator,
  sales: TrendingUp,
  'customer-service': Headphones,
  operations: Truck,
  legal: Scale,
}

export default function FunctionsHubPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://gennoor.com' },
          { name: 'Functions', url: 'https://gennoor.com/functions' },
        ]}
      />
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0C1426] via-[#0F1B33] to-[#1A2547] text-white">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-secondary-400/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-[35rem] h-[35rem] bg-primary-500/20 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-6xl mx-auto px-6 py-24 lg:py-32 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs tracking-widest text-secondary-300 mb-6">
              FUNCTIONS
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              AI for your function.
              <span className="block text-secondary-300 mt-2">Owned by the people doing the work.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
              Six function playbooks — each with the problems, the PoCs, and the companion course.
              Built so an HR head, a CFO, or a head of ops can self-scope their first 90 days.
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {functions.map(f => {
              const Icon = iconBySlug[f.slug] ?? Users
              return (
                <Link
                  key={f.slug}
                  href={`/functions/${f.slug}`}
                  className="group bg-white rounded-2xl border border-gray-200 hover:border-secondary-300 hover:shadow-xl transition-all duration-300 p-7 flex flex-col"
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary-100 text-secondary-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 group-hover:text-secondary-700 transition-colors mb-2">
                    {f.name}
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed mb-5">{f.tagline}</p>
                  <div className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-secondary-700 group-hover:gap-2 transition-all">
                    See the playbook <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      </div>
    </>
  )
}
