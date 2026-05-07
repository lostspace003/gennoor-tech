import { Metadata } from 'next'
import Link from 'next/link'
import { Building2, User, ArrowRight } from 'lucide-react'
import { OrganizationJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'About Gennoor Tech — Enterprise AI Training & Solutions',
  description: 'Gennoor Tech Private Limited — enterprise AI training, consulting, and PoC development. Trusted by Fortune 500 companies across 6+ countries.',
  keywords: ['Gennoor Tech', 'enterprise AI training', 'AI consulting', 'Microsoft Certified Trainer', 'AI solutions'],
  alternates: { canonical: 'https://gennoor.com/about' },
  openGraph: {
    title: 'About Gennoor Tech — Enterprise AI Training & Solutions',
    description: 'Enterprise AI training, consulting, and PoC development. Trusted by Fortune 500 companies across 6+ countries.',
    url: 'https://gennoor.com/about',
  },
}

const sections = [
  {
    icon: Building2,
    title: 'Gennoor Tech',
    description: 'Our vision, mission, company details, and the story of how we grew into a global AI training company',
    href: '/about/company',
    highlight: 'Serving enterprises across 4 regions',
  },
  {
    icon: User,
    title: 'Our Founder',
    description: 'Meet Jalal Ahmed Khan — MCT with 16+ active certifications & 14+ years of enterprise experience',
    href: '/about/founder',
    highlight: '16+ active certifications',
  },
]

export default function AboutPage() {
  return (
    <>
      <OrganizationJsonLd />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://gennoor.com' },
        { name: 'About', url: 'https://gennoor.com/about' },
      ]} />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-accent-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              About
            </h1>
            <p className="text-xl text-gray-600">
              Bridging the gap between C-suite vision and technical execution through
              enterprise AI training, consulting, and hands-on implementation.
            </p>
          </div>
        </div>
      </section>

      {/* Sections Grid */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {sections.map((section, index) => {
              const Icon = section.icon
              return (
                <Link
                  key={index}
                  href={section.href}
                  className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {section.title}
                  </h2>

                  <p className="text-gray-600 mb-3">
                    {section.description}
                  </p>

                  <p className="text-sm text-primary-600 font-medium mb-4">
                    {section.highlight}
                  </p>

                  <div className="flex items-center text-primary-600 text-sm font-medium">
                    <span>Learn more</span>
                    <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}