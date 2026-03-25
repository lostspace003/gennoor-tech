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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4 py-24">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
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
          className="inline-block px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
