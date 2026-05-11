import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Book a Call — Schedule a Consultation with Gennoor Tech',
  description: 'Schedule a free consultation with Gennoor Tech. Discuss AI training, certification preparation, agentic AI proof-of-concepts, or enterprise AI strategy for your team.',
  keywords: ['book AI consultation', 'schedule AI training call', 'Gennoor Tech booking', 'AI strategy meeting', 'enterprise AI consultation'],
  alternates: { canonical: 'https://gennoor.com/resources/calendar' },
  openGraph: {
    title: 'Book a Call with Gennoor Tech',
    description: 'Schedule a free consultation about AI training, certifications, or enterprise AI strategy.',
    url: 'https://gennoor.com/resources/calendar',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book a Call | Gennoor Tech',
    description: 'Schedule a free consultation about AI training and enterprise AI strategy.',
  },
}

export default function CalendarLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://gennoor.com' },
        { name: 'Resources', url: 'https://gennoor.com/resources/blog' },
        { name: 'Book a Call', url: 'https://gennoor.com/resources/calendar' },
      ]} />
      {children}
    </>
  )
}
