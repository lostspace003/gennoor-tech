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
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 via-primary-50/30 to-white border-b border-gray-100">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-100/40 via-transparent to-transparent" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
            AI Readiness Assessment
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            10 scenarios. An AI agent builds you a personalized animated report with voice narration.
          </p>
          <p className="mt-2 text-sm text-amber-600 font-medium">Preview — V2</p>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <AIReadinessQuizV2 />
      </section>
    </>
  )
}
