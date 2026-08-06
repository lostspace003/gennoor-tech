import { Metadata } from 'next'
import Link from 'next/link'
import { User, Award, Building, ArrowRight } from 'lucide-react'
import { PersonJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd'
import PageHero from '@/components/shared/PageHero'

export const metadata: Metadata = {
  title: 'About Jalal Ahmed Khan & Gennoor Tech — Enterprise AI Expert',
  description: 'Meet Jalal Ahmed Khan — Microsoft Certified Trainer with 16 certifications, 14+ years of experience, and Fortune 500 clients across 6 countries. Founder of Gennoor Tech Private Limited.',
  keywords: ['Jalal Ahmed Khan', 'Microsoft Certified Trainer', 'Gennoor Tech', 'enterprise AI consultant', 'AI trainer'],
  alternates: { canonical: 'https://gennoor.com/about' },
  openGraph: {
    title: 'About Jalal Ahmed Khan & Gennoor Tech',
    description: 'Microsoft Certified Trainer with 16 certifications, 14+ years experience, Fortune 500 clients across 6 countries.',
    url: 'https://gennoor.com/about',
  },
}

const sections = [
  {
    icon: User,
    title: 'My Journey',
    description: 'From Automobile Engineering Professor to Global AI Transformation Leader',
    href: '/about/journey',
    highlight: '14+ years of experience',
  },
  {
    icon: Award,
    title: 'Certifications & Credentials',
    description: 'Microsoft Certified Trainer (MCT) with 16 active certifications including Agentic AI',
    href: '/about/certifications',
    highlight: '376+ hours on Microsoft Learn',
  },
  {
    icon: Building,
    title: 'Gennoor Tech Private Limited',
    description: 'Founded to democratize AI adoption for enterprises across GCC, Africa, and APAC',
    href: '/about/company',
    highlight: 'Vision 2030 aligned',
  },
]

export default function AboutPage() {
  return (
    <>
      <PersonJsonLd />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://gennoor.com' },
        { name: 'About', url: 'https://gennoor.com/about' },
      ]} />

      {/* Hero */}
      <PageHero
        eyebrow="About Gennoor Tech"
        title="We exist so the next wave of AI value doesn't skip our regions."
        description="Gennoor Tech is the AI transformation partner for enterprises and growing businesses across GCC, Africa, and South Asia — running the full journey from readiness diagnostic to deployed agents to long-term sustainment."
      />

      {/* Sections Grid */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {sections.map((section, index) => {
              const Icon = section.icon
              return (
                <Link
                  key={index}
                  href={section.href}
                  className="group rounded-2xl p-7 transition-all duration-300 bg-white border border-gray-200/70 shadow-sm hover:shadow-md hover:border-primary-200/70"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary-500/15">
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {section.title}
                  </h2>

                  <p className="text-gray-500 mb-3 leading-relaxed">
                    {section.description}
                  </p>

                  <p className="text-sm text-primary-600 font-semibold mb-5">
                    {section.highlight}
                  </p>

                  <div className="flex items-center text-primary-600 text-sm font-semibold">
                    <span>Learn more</span>
                    <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
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
