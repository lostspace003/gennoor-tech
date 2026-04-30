import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Claude AI Workshop — Learn Claude Cowork in 8 Hours | Gennoor',
  description: 'Free hands-on Claude AI workshop: learn to use Claude Cowork to automate workflows, reclaim 5+ hours/week, and become AI-fluent. 21 live labs, 1000 seats only. Register now.',
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
    title: 'Free Claude AI Workshop — Learn Claude Cowork in 8 Hours',
    description: 'Free hands-on Claude AI workshop: 21 live labs, real workflows, in your time zone. Reclaim 5+ hours/week. First 1000 seats only.',
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
    title: 'Free Claude AI Workshop — Learn Claude Cowork in 8 Hours',
    description: 'Free hands-on Claude AI workshop: 21 live labs, real workflows, in your time zone. Reclaim 5+ hours/week. First 1000 only.',
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
                  text: "Recordings are sent to all registrants 24 hours after the workshop. The labs are runnable on your own time too — they're built into a folder you can keep.",
                },
              },
              {
                '@type': 'Question',
                name: 'Can I bring my whole team to the Claude Cowork workshop?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: "Yes — and you should. Module 6 is \"build your team's rollout playbook.\" Bring at least one teammate so you can split labs and get more output.",
                },
              },
              {
                '@type': 'Question',
                name: 'Is this free Claude AI workshop really free? What\'s the catch?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: "No catch. No upsell at the end. No mailing list spam. You get 8 hours of training, the lab files, and the trainer playbook PDF. That's it.",
                },
              },
              {
                '@type': 'Question',
                name: 'What do I need before the Claude Cowork workshop?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'The Claude desktop app installed and Cowork mode enabled (free), Chrome browser, and a laptop with at least 4 hours of battery. Setup checklist arrives by email after registration.',
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
