import Link from 'next/link'

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4 py-24">
        <div className="text-6xl mb-8">&#9997;&#65039;</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Great stories are worth the wait.
        </h1>
        <p className="text-xl text-gray-500 mb-4 italic">
          &ldquo;The best way to predict the future is to create it.&rdquo;
        </p>
        <p className="text-sm text-gray-400 mb-8">— Peter Drucker</p>
        <p className="text-lg text-gray-600 mb-10">
          We&apos;re crafting in-depth articles on enterprise AI, agentic systems, and real-world implementation strategies. Stay tuned.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Get Notified
          </Link>
        </div>
      </div>
    </div>
  )
}
