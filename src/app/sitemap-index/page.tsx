import Link from 'next/link'
import type { Metadata } from 'next'
import { blogPostsMeta } from '@/data/blog-posts'
import { courses } from '@/config/courses'
import { getAllPrograms } from '@/data/training-programs'
import { getAllCertifications } from '@/data/certification-prep'

export const metadata: Metadata = {
  title: 'Sitemap | Gennoor Tech',
  description: 'Complete index of every page on gennoor.com — training, automation, certifications, blog posts, and AI Academy courses.',
  alternates: { canonical: 'https://gennoor.com/sitemap-index' },
}

interface Section {
  heading: string
  links: { href: string; label: string }[]
}

export default function SitemapIndexPage() {
  const sections: Section[] = [
    {
      heading: 'Company',
      links: [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/about/certifications', label: 'About — Certifications' },
        { href: '/about/founder', label: 'About — Founder' },
        { href: '/contact', label: 'Contact' },
        { href: '/join', label: 'Work with us' },
        { href: '/privacy', label: 'Privacy Policy' },
        { href: '/terms', label: 'Terms of Service' },
      ],
    },
    {
      heading: 'What we do',
      links: [
        { href: '/claude', label: 'Claude' },
        { href: '/training', label: 'Training' },
        { href: '/automation', label: 'Automation' },
        { href: '/services/training', label: 'Training catalog' },
        { href: '/services/certifications', label: 'Certification prep' },
      ],
    },
    {
      heading: 'Training Programs',
      links: getAllPrograms().map((p) => ({
        href: `/services/training/${p.slug}`,
        label: p.title || p.slug,
      })),
    },
    {
      heading: 'Certification Prep',
      links: getAllCertifications().map((c) => ({
        href: `/services/certifications/${c.slug}`,
        label: c.title || c.slug,
      })),
    },
    {
      heading: 'Workshops',
      links: [
        { href: '/workshops', label: 'Workshops Overview' },
        { href: '/workshops/claude-cowork', label: 'Claude Cowork — Workshop' },
      ],
    },
    {
      heading: 'Resources',
      links: [
        { href: '/resources/blog', label: 'Blog' },
        { href: '/resources/calendar', label: 'Calendar / Book a Call' },
      ],
    },
    {
      heading: 'Certification Guides',
      links: [
        { href: '/guides/ai-103-azure-ai-engineer', label: 'AI-103 — Azure AI Engineer (current)' },
        { href: '/guides/ai-102-azure-ai-engineer', label: 'AI-102 — Azure AI Engineer (retires 2026-06-30)' },
        { href: '/guides/pl-300-power-bi-analyst', label: 'PL-300 — Power BI Analyst' },
        { href: '/guides/ms-4004-copilot-365', label: 'MS-4004 — Copilot 365' },
      ],
    },
    {
      heading: 'Learning Studio',
      links: [
        { href: '/studio', label: 'Learning Studio' },
        { href: '/studio/ai-103', label: 'Learning Studio — AI-103' },
        { href: '/studio/ai-500', label: 'Learning Studio — AI-500' },
        { href: '/ai-academy', label: 'AI Essentials' },
        ...courses.flatMap((course) => [
          { href: `/ai-academy/${course.id}`, label: `${course.shortTitle || course.title}` },
          ...course.chapters.map((ch) => ({
            href: `/ai-academy/${course.id}/${ch.slug}`,
            label: `${course.shortTitle || course.title} — ${ch.title}`,
          })),
        ]),
      ],
    },
    {
      heading: 'Tools & Engagement',
      links: [
        { href: '/webinars', label: 'Webinars' },
      ],
    },
    {
      heading: 'Blog Posts',
      links: blogPostsMeta.map((p) => ({
        href: `/resources/blog/${p.slug}`,
        label: p.title,
      })),
    },
  ]

  const totalLinks = sections.reduce((n, s) => n + s.links.length, 0)

  return (
    <div className="min-h-screen bg-surface">
      <section className="relative py-10 lg:py-10 overflow-hidden">
        <div className="absolute inset-0 bg-surface" />
        <div className="absolute inset-0" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface to-transparent" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center rounded-full px-3 py-1 mb-5 text-xs font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/60">
            Sitemap
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            Every Page on Gennoor Tech
          </h1>
          <p className="text-gray-600">
            {totalLinks} pages across {sections.length} sections. Also available as{' '}
            <Link href="/sitemap.xml" className="text-primary-600 hover:underline">
              sitemap.xml
            </Link>{' '}
            for search engines.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 pb-10 sm:pb-14">
        <div className="grid sm:grid-cols-2 gap-6">
          {sections.map((section) => (
            <div
              key={section.heading}
              className="glass-card p-6 transition-transform"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-3">
                {section.heading}{' '}
                <span className="text-xs font-normal text-gray-500">
                  ({section.links.length})
                </span>
              </h2>
              <ul className="space-y-1.5 text-sm">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-700 hover:text-primary-600 hover:underline transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
