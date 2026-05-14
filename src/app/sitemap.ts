import type { MetadataRoute } from 'next'
import { blogPostsMeta } from '@/data/blog-posts'
import { courses } from '@/config/courses'
import { caseStudies } from '@/data/case-studies'
import { getAllPrograms } from '@/data/training-programs'
import { getAllCertifications } from '@/data/certification-prep'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://gennoor.com'

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/about/company`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/about/journey`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/about/certifications`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/about/founder`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },

    // Services
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/services/ai-strategy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/services/training`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/services/poc-development`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/services/agentic-ai`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/services/certifications`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services/collaboration`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },

    // Location pages
    { url: `${baseUrl}/services/ai-training-saudi-arabia`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services/ai-training-india`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services/ai-training-remote`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },

    // Course landing pages
    { url: `${baseUrl}/services/copilot-studio-training`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services/azure-ai-foundry-workshop`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services/enterprise-ai-roadmap-workshop`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },

    // Portfolio
    { url: `${baseUrl}/portfolio`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/portfolio/case-studies`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/portfolio/demos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/portfolio/open-source`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/portfolio/testimonials`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },

    // Resources
    { url: `${baseUrl}/resources/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/resources/videos`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/resources/calendar`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/resources/guides/agentic-ai`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/resources/guides/ai-readiness-checklist`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/resources/guides/enterprise-ai-training`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/resources/guides/microsoft-copilot-studio`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },

    // Certification guides
    { url: `${baseUrl}/guides/ai-102-azure-ai-engineer`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/guides/pl-300-power-bi-analyst`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/guides/ms-4004-copilot-365`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },

    // Workshops
    { url: `${baseUrl}/workshops`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/workshops/claude-cowork`, lastModified: new Date('2026-05-10'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/claude-cowork`, lastModified: new Date('2026-05-10'), changeFrequency: 'monthly', priority: 0.7 },

    // Tools & features
    { url: `${baseUrl}/ai-readiness`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/webinars`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/career-coach`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  // AI Academy pages
  const academyPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/ai-academy`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
  ]
  for (const course of courses) {
    academyPages.push({
      url: `${baseUrl}/ai-academy/${course.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })
    for (const chapter of course.chapters) {
      academyPages.push({
        url: `${baseUrl}/ai-academy/${course.id}/${chapter.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })
    }
  }

  // Blog post pages
  const blogPages: MetadataRoute.Sitemap = blogPostsMeta.map((post) => ({
    url: `${baseUrl}/resources/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Case study pages
  const caseStudyPages: MetadataRoute.Sitemap = caseStudies.map((cs) => ({
    url: `${baseUrl}/portfolio/case-studies/${cs.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Training program pages
  const trainingPages: MetadataRoute.Sitemap = getAllPrograms().map((p) => ({
    url: `${baseUrl}/services/training/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Certification prep pages
  const certPages: MetadataRoute.Sitemap = getAllCertifications().map((c) => ({
    url: `${baseUrl}/services/certifications/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...academyPages, ...blogPages, ...caseStudyPages, ...trainingPages, ...certPages]
}
