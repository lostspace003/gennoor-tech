import Link from 'next/link'
import { Users } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Collaboration Programs | Gennoor Tech',
  description:
    "We're building tailored collaboration programs to help teams work together on AI initiatives. Details coming soon.",
}

export default function CollaborationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4 py-24">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
            <Users className="w-16 h-16 text-gray-400" />
          </div>
        </div>
        <span className="inline-block px-4 py-1.5 bg-amber-50 text-amber-700 text-sm font-medium rounded-full mb-6 border border-amber-200">
          Work in Progress
        </span>
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Collaboration Programs
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          We&apos;re building tailored collaboration programs to help teams work
          together on AI initiatives. Details coming soon.
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
