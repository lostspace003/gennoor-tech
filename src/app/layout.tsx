import type { Metadata } from 'next'
import '@/styles/globals.css'
import '@/styles/stage.css'
import PortalShell from '@/components/portal/PortalShell'
import Footer from '@/components/layout/Footer'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import GennoorCare from '@/components/GennoorCare/GennoorCare'
import PageViewTracker from '@/components/PageViewTracker'
import BehaviorTracker from '@/components/BehaviorTracker'
import AttributionTracker from '@/components/AttributionTracker'
import RippleProvider from '@/components/RippleProvider'
import CircleTransition from '@/components/CircleTransition'
import { OrganizationJsonLd, WebSiteJsonLd } from '@/components/JsonLd'
import { siteConfig, BLOB_URL } from '@/lib/site-config'
import { THEME_SCRIPT } from '@/lib/theme'
import { shareImage } from '@/lib/seo'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'AI training',
    'AI automation',
    'Claude training',
    'Claude Partner Network',
    'AI certification courses',
    'Learning Studio',
    'Microsoft Certified Trainer',
    'Azure AI',
    'Mumbai',
    'India',
  ],
  authors: [{ name: 'Jalal Ahmed Khan' }],
  creator: 'Jalal Ahmed Khan',
  // A page that does not name its own address gets its own path: no page is left without one.
  alternates: { canonical: './' },
  icons: {
    icon: [
      { url: `${BLOB_URL}/logos/gennoor-tech-icon-white_16x16_favicon-16.png`, sizes: '16x16', type: 'image/png' },
      { url: `${BLOB_URL}/logos/gennoor-tech-icon-white_32x32_favicon-32.png`, sizes: '32x32', type: 'image/png' },
      { url: `${BLOB_URL}/logos/gennoor-tech-icon-white_48x48_favicon-48.png`, sizes: '48x48', type: 'image/png' },
      { url: `${BLOB_URL}/logos/gennoor-tech-icon-white_64x64_favicon-64.png`, sizes: '64x64', type: 'image/png' },
    ],
    apple: `${BLOB_URL}/logos/gennoor-tech-icon-white_180x180_apple-touch-icon.png`,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    // The picture a shared link shows (src/lib/og-pages.ts). A page with its own is named in its pageMeta.
    images: [shareImage('site', `${siteConfig.name}: ${siteConfig.tagline}`)],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    creator: '@jalalkhan',
    images: ['/og/site'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* The look of the site (dark or light), put on <html> before anything is drawn */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <script
          type="text/javascript"
          src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
          async
        />
      </head>
      <body className="antialiased">
        <RippleProvider />
        <CircleTransition />
        <GoogleAnalytics />
        <PageViewTracker />
        <AttributionTracker />
        <BehaviorTracker />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-primary-700 focus:text-white focus:rounded-lg">
          Skip to main content
        </a>

        <div className="relative z-10">
          <PortalShell>
            <main id="main-content">
              {children}
            </main>
            <Footer />
          </PortalShell>
          <GennoorCare />
        </div>
      </body>
    </html>
  )
}