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
  return <AIReadinessSelector />
}
