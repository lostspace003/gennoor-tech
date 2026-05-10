import Link from 'next/link'
import { Users } from 'lucide-react'
import type { Metadata } from 'next'
import { ServiceJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Collaboration Programs | Gennoor Tech',
  description:
    "We're building tailored collaboration programs to help teams work together on AI initiatives. Details coming soon.",
}

export default function CollaborationPage() {
  return (
    <>
    <ServiceJsonLd
      name="Collaboration Programs"
      description="Tailored collaboration programs to help enterprise teams work together on AI initiatives."
      url="https://gennoor.com/services/collaboration"
    />
    <BreadcrumbJsonLd items={[
      { name: 'Home', url: 'https://gennoor.com' },
      { name: 'Services', url: 'https://gennoor.com/services' },
      { name: 'Collaboration', url: 'https://gennoor.com/services/collaboration' },
    ]} />
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-14 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-white"></div>
        <div className="absolute inset-0 bg-gradient-mesh"></div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center rounded-full px-3 py-1 mb-5 text-xs font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/60">
              Collaboration
            </span>
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
                <Users className="w-16 h-16 text-gray-400" />
              </div>
            </div>
            <span className="inline-block px-4 py-1.5 bg-amber-50 text-amber-700 text-sm font-medium rounded-full mb-6 border border-amber-200">
              Work in Progress
            </span>
            <h1 className="text-4xl font-black text-gray-900 mb-6">
              Collaboration Programs
            </h1>
            <p className="text-lg text-gray-600 mb-10">
              We&apos;re building tailored collaboration programs to help teams work
              together on AI initiatives. Details coming soon.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-xl hover:shadow-glow-blue transition-all duration-300"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
    </>
  )
}
