import Link from 'next/link'
import { FileText } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Gennoor Tech',
  description:
    'Our terms of service are being prepared and will be available here soon.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-14 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 bg-gradient-mesh" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center rounded-full px-3 py-1 mb-5 text-xs font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/60">
            Terms of Service
          </span>
          <h1 className="text-4xl font-black text-gray-900 mb-6">
            Terms of Service
          </h1>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 pb-24">
        <div className="glass-card p-8 sm:p-10 text-center">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
              <FileText className="w-16 h-16 text-gray-400" />
            </div>
          </div>
          <span className="inline-block px-4 py-1.5 bg-amber-50 text-amber-700 text-sm font-medium rounded-full mb-6 border border-amber-200">
            Work in Progress
          </span>
          <p className="text-lg text-gray-600 mb-10">
            Our terms of service are being prepared and will be available here
            soon.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-xl hover:shadow-glow-blue transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
