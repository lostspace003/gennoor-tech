import type { Metadata } from 'next'
import AIROICalculatorClient from './AIROICalculatorClient'

export const metadata: Metadata = {
  title: 'AI ROI Calculator — Estimate Payback in 60 Seconds',
  description:
    'A simple, honest AI ROI estimator. Enter your team size, hours saved per person per week, fully-loaded cost, and program spend — see payback, year-1 net, and 3-year value.',
  keywords: ['AI ROI calculator', 'AI payback period', 'Copilot ROI', 'enterprise AI value calculator'],
  alternates: { canonical: 'https://gennoor.com/resources/calculators/ai-roi' },
  openGraph: {
    title: 'AI ROI Calculator — Gennoor Tech',
    description: 'Honest AI ROI in 60 seconds. No vendor math.',
    url: 'https://gennoor.com/resources/calculators/ai-roi',
  },
}

export default function AIROICalculatorPage() {
  return <AIROICalculatorClient />
}
