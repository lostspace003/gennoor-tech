import Link from 'next/link'
import { MessageSquare } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Client Testimonials | Gennoor Tech',
  description:
    "We're gathering stories from the teams and leaders we've worked with across the globe. Their experiences will be shared here soon.",
}

export default function TestimonialsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-white" />
      <div className="absolute inset-0 bg-gradient-mesh" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      <div className="relative text-center max-w-2xl mx-auto px-4 py-24">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full glass-card flex items-center justify-center">
            <MessageSquare className="w-16 h-16 text-gray-400" />
          </div>
        </div>
        <span className="inline-block px-4 py-1.5 bg-amber-50 text-amber-700 text-sm font-medium rounded-full mb-6 border border-amber-200">
          Work in Progress
        </span>
        <h1 className="text-4xl font-black text-gray-900 mb-6">
          Client Testimonials
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          We&apos;re gathering stories from the teams and leaders we&apos;ve
          worked with across the globe. Their experiences will be shared here
          soon.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-xl hover:shadow-glow-blue transition-all duration-300"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
