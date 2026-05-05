import { Metadata } from 'next'
import AIReadinessSelector from '@/components/AIReadinessSelector'

export const metadata: Metadata = {
  title: 'AI Readiness Assessment — Is Your Business Ready for AI?',
  description:
    'Take our free AI readiness assessment. Get a personalized AI readiness profile with tailored recommendations for your industry and business size.',
  keywords: [
    'AI readiness assessment',
    'AI readiness quiz',
    'business AI readiness',
    'AI adoption',
    'AI strategy',
    'SMB AI',
    'AI training',
  ],
  openGraph: {
    title: 'AI Readiness Assessment — Is Your Business Ready for AI?',
    description:
      'Take our free AI readiness assessment. Get a personalized AI readiness profile with tailored recommendations for your industry.',
    url: 'https://gennoor.com/ai-readiness',
    type: 'website',
  },
  alternates: {
    canonical: 'https://gennoor.com/ai-readiness',
  },
}

export default function AIReadinessPage() {
  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 via-primary-50/30 to-white border-b border-gray-100">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-100/40 via-transparent to-transparent" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
            AI Readiness Assessment
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Find out where you stand with AI — choose your assessment style.
          </p>
        </div>
      </section>

      {/* Assessment Selector */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <AIReadinessSelector />
      </section>
    </>
  )
}
