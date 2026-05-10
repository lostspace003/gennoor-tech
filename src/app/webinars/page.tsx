import Link from 'next/link'
import { Youtube } from 'lucide-react'

export default function WebinarsPage() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-white" />
      <div className="absolute inset-0 bg-gradient-mesh" />
      <div className="relative text-center max-w-2xl mx-auto px-4 py-24">
        <div className="text-6xl mb-8">&#127908;</div>
        <h1 className="text-4xl font-black text-gray-900 mb-6">
          Something exciting is brewing.
        </h1>
        <p className="text-xl text-gray-400 mb-4 italic">
          &ldquo;Tell me and I forget, teach me and I may remember, involve me and I learn.&rdquo;
        </p>
        <p className="text-sm text-gray-300 mb-8">— Benjamin Franklin</p>
        <p className="text-lg text-gray-500 mb-6 leading-relaxed">
          Live webinars on AI strategy, hands-on workshops, and expert panels are coming soon. Be the first to know.
        </p>
        <p className="text-base text-gray-500 mb-10">
          Webinars will also be available on our YouTube channel{' '}
          <a
            href="https://www.youtube.com/@GennoorTech"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-red-600 font-semibold hover:text-red-700 transition-colors"
          >
            <Youtube className="h-4 w-4" />
            GennoorTech
          </a>
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:shadow-glow-blue transition-all duration-300"
          >
            Back to Home
          </Link>
          <a
            href="https://www.youtube.com/@GennoorTech"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all duration-300"
          >
            <Youtube className="h-5 w-5" />
            Subscribe on YouTube
          </a>
          <Link
            href="/contact"
            className="px-6 py-3 font-semibold rounded-xl glass-card text-gray-700 transition-all duration-300"
          >
            Get Notified
          </Link>
        </div>
      </div>
    </div>
  )
}
