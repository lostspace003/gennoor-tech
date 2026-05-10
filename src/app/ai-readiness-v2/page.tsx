import { Metadata } from 'next'
import AIReadinessQuizV2 from '@/components/AIReadinessQuizV2'

export const metadata: Metadata = {
  title: 'AI Readiness Assessment V2 — Personalized AI Report',
  description:
    'Take our AI readiness assessment and get a personalized animated report with voice narration — powered by GPT-5.4 and Azure AI agents.',
  robots: { index: false, follow: false },
}

export default function AIReadinessV2Page() {
  return (
    <>
      <section className="relative py-14 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 bg-gradient-mesh" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center rounded-full px-3 py-1 mb-5 text-xs font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/60">AI Readiness V2</span>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
            AI Readiness Assessment
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            10 scenarios. An AI agent builds you a personalized animated report with voice narration.
          </p>
          <p className="mt-2 text-sm text-amber-600 font-medium">Preview — V2</p>
        </div>
      </section>

      <div className="section-divider" />

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="glass-card p-6 sm:p-8">
          <AIReadinessQuizV2 />
        </div>
      </section>
    </>
  )
}
