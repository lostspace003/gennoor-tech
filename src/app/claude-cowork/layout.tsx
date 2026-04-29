import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Claude Cowork Workshop · 1000 Seats Only · Gennoor',
  description: 'A free 8-hour, hands-on workshop that turns scattered tools, files, and meetings into one autonomous coworker. First 1000 seats only — register now.',
  keywords: [
    'Claude Cowork',
    'AI workshop',
    'free AI training',
    'productivity workshop',
    'Claude AI',
    'autonomous coworker',
    'AI fluency',
    'Gennoor',
  ],
  openGraph: {
    title: 'Free Claude Cowork Workshop · 1000 Seats Only',
    description: 'Reclaim 5+ hours every week. A free 8-hour hands-on workshop in your time zone. First 1000 only.',
    url: 'https://gennoor.com/claude-cowork',
    type: 'website',
    images: [
      {
        url: 'https://gennoor.com/assets/claude-cowork-og.png',
        width: 1200,
        height: 630,
        alt: 'Claude Cowork Workshop — Free, 1000 Seats Only',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Claude Cowork Workshop · 1000 Seats Only',
    description: 'Reclaim 5+ hours every week. Free, hands-on, in your time zone. First 1000 only.',
    images: ['https://gennoor.com/assets/claude-cowork-og.png'],
  },
  alternates: {
    canonical: 'https://gennoor.com/claude-cowork',
  },
}

export default function ClaudeCoworkLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: 'Claude Cowork for Productivity Workshop',
            description: 'A free 8-hour hands-on workshop that turns scattered tools, files, and meetings into one autonomous coworker.',
            eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
            eventStatus: 'https://schema.org/EventScheduled',
            location: {
              '@type': 'VirtualLocation',
              url: 'https://gennoor.com/claude-cowork',
            },
            image: 'https://gennoor.com/assets/claude-cowork-og.png',
            organizer: {
              '@type': 'Organization',
              name: 'Gennoor',
              url: 'https://gennoor.com',
            },
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
              availability: 'https://schema.org/LimitedAvailability',
              url: 'https://gennoor.com/claude-cowork',
              validFrom: '2026-04-29',
            },
          }),
        }}
      />
      {children}
    </>
  )
}
