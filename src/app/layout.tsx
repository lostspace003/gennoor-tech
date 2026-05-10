import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import '@/styles/globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import WhatsAppButton from '@/components/WhatsAppButton'
import TrackingPixels from '@/components/TrackingPixels'
import PageViewTracker from '@/components/PageViewTracker'
import { OrganizationJsonLd, WebSiteJsonLd } from '@/components/JsonLd'
import { siteConfig, BLOB_URL } from '@/lib/site-config'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'AI Training',
    'Microsoft Certified Trainer',
    'Azure AI',
    'Copilot Studio',
    'Power Platform',
    'Agentic AI',
    'Enterprise AI',
    'AI Consulting',
    'Corporate Training',
    'Saudi Arabia',
    'India',
    'Fortune 500',
  ],
  authors: [{ name: 'Jalal Ahmed Khan' }],
  creator: 'Jalal Ahmed Khan',
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
    images: [
      {
        url: `${BLOB_URL}/logos/gennoor-tech-banner-facebook-820x312.png`,
        width: 820,
        height: 312,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    creator: '@jalalkhan',
    images: [`${BLOB_URL}/logos/gennoor-tech-banner-twitter-1500x500.png`],
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
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <script
          type="text/javascript"
          src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
          async
        />
      </head>
      <body className={`${inter.variable} ${plusJakarta.variable} antialiased`}>
        <GoogleAnalytics />
        <TrackingPixels />
        <PageViewTracker />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg">
          Skip to main content
        </a>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
        </div>
      </body>
    </html>
  )
}