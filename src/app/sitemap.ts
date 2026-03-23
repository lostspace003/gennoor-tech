import type { MetadataRoute } from 'next'
import { blogPosts } from '@/data/blog-posts'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://gennoor.com'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/about/journey`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/about/certifications`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },

    // Services
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/services/ai-strategy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/services/training`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/services/poc-development`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/services/agentic-ai`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/services/certifications`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },

    // Location pages
    { url: `${baseUrl}/services/ai-training-saudi-arabia`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services/ai-training-india`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services/ai-training-remote`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },

    // Portfolio
    { url: `${baseUrl}/portfolio`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/portfolio/case-studies`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/portfolio/demos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },

    // Resources
    { url: `${baseUrl}/resources/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },

    // Certification guides
    { url: `${baseUrl}/guides/ai-102-azure-ai-engineer`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/guides/pl-300-power-bi-analyst`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/guides/ms-4004-copilot-365`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },

    // Course landing pages
    { url: `${baseUrl}/services/copilot-studio-training`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services/azure-ai-foundry-workshop`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services/enterprise-ai-roadmap-workshop`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ]

  // Blog post pages
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/resources/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...blogPages]
}
