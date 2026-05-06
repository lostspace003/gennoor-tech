import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Claude AI Workshop — Learn Claude Cowork in 4 Hours | Gennoor',
  description: 'Free live Claude AI workshop: watch demos, learn Claude Cowork, and discover how to automate workflows and reclaim 5+ hours/week. 8 topics, 1000 seats only. Register now.',
  keywords: [
    'Claude AI workshop',
    'Claude AI training',
    'free Claude AI course',
    'Claude Cowork',
    'learn Claude AI',
    'Claude AI tutorial',
    'Claude AI for business',
    'Claude AI productivity',
    'Claude AI automation',
    'how to use Claude AI',
    'AI workshop free',
    'Claude AI workflow',
    'autonomous coworker',
    'AI fluency training',
    'Gennoor',
  ],
  openGraph: {
    title: 'Free Claude AI Workshop — Learn Claude Cowork in 4 Hours',
    description: 'Free live Claude AI workshop: 8 topics, live demos, in your time zone. Reclaim 5+ hours/week. First 1000 seats only.',
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
    title: 'Free Claude AI Workshop — Learn Claude Cowork in 4 Hours',
    description: 'Free live Claude AI workshop: 8 topics, live demos, in your time zone. Reclaim 5+ hours/week. First 1000 only.',
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
            description: 'A free 4-hour live workshop where you watch demos and learn how Claude Cowork can automate your workflows.',
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Is this Claude AI workshop for technical people only?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: "No — it's specifically for non-technical leaders, PMs, ops, marketers, analysts, founders. If you can use Slack, you can do this. Zero coding required.",
                },
              },
              {
                '@type': 'Question',
                name: 'What if I miss part of the live Claude AI session?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: "Recordings are sent to all registrants after the workshop. You can catch up on anything you missed at your own pace.",
                },
              },
              {
                '@type': 'Question',
                name: 'Can I bring my whole team to the Claude Cowork workshop?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: "Yes — and you should. The more people from your team who attend, the easier it is to start using Claude across your workflows.",
                },
              },
              {
                '@type': 'Question',
                name: 'Is this free Claude AI workshop really free? What\'s the catch?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: "No catch. No upsell at the end. No mailing list spam. You get 4 hours of live demos and training. That's it.",
                },
              },
              {
                '@type': 'Question',
                name: 'What do I need before the Claude Cowork workshop?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: "Nothing! Since Claude Cowork is a paid subscription, you don't need to purchase or install anything. Just show up, sit back, and watch everything live as your trainer demonstrates every feature.",
                },
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://gennoor.com' },
              { '@type': 'ListItem', position: 2, name: 'Claude Cowork Workshop', item: 'https://gennoor.com/claude-cowork' },
            ],
          }),
        }}
      />
      {children}
    </>
  )
}
