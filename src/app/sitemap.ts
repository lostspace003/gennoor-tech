import type { MetadataRoute } from 'next'
import { blogPostsMeta } from '@/data/blog-posts'
import { courses } from '@/config/courses'
import { getAllPrograms } from '@/data/training-programs'
import { getAllCertifications } from '@/data/certification-prep'
import { allCoursePdfs } from '@/data/course-pdfs'
import { listLmsCourses } from '@/lib/lms'

// Rebuilt at most hourly, so a newly published course is listed without a deploy.
export const revalidate = 3600

const FALLBACK_UPDATED = new Date('2026-10-01')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://gennoor.com'
  const page = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly', lastModified: Date = new Date()) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  })

  const staticPages: MetadataRoute.Sitemap = [
    page('', 1.0, 'weekly'),
    page('/claude', 0.9),
    page('/training', 0.9),
    page('/automation', 0.9),
    page('/studio', 0.9, 'weekly'),
    page('/community', 0.6, 'weekly'),
    page('/ai-academy', 0.8, 'weekly'),
    page('/about', 0.8),
    page('/about/founder', 0.6),
    page('/about/certifications', 0.6),
    page('/contact', 0.8),
    page('/join', 0.5),
    page('/services/training', 0.8, 'weekly'),
    page('/services/certifications', 0.7),
    page('/workshops', 0.6, 'weekly'),
    page('/workshops/claude-cowork', 0.6, 'monthly', new Date('2026-05-10')),
    page('/webinars', 0.5, 'weekly'),
    page('/resources/blog', 0.6, 'daily'),
    page('/guides/ai-103-azure-ai-engineer', 0.6),
    page('/guides/ai-102-azure-ai-engineer', 0.5),
    page('/guides/pl-300-power-bi-analyst', 0.5),
    page('/guides/ms-4004-copilot-365', 0.5),
    page('/privacy', 0.3, 'yearly'),
    page('/terms', 0.3, 'yearly'),
    page('/sitemap-index', 0.3, 'weekly'),
  ]

  // Learning Studio: video courses
  // Every published course, read from the catalog, so new courses appear on their own.
  let studioCourses: { slug: string; updatedAt?: string }[] = []
  try {
    studioCourses = await listLmsCourses()
  } catch {
    // storage unreachable at build time: use the built-in courses, the next revalidate fixes it
  }
  if (studioCourses.length === 0) studioCourses = [{ slug: 'ai-103' }, { slug: 'ai-500' }]
  const studioPages: MetadataRoute.Sitemap = studioCourses.map(c =>
    page(`/studio/${c.slug}`, 0.8, 'weekly', c.updatedAt ? new Date(c.updatedAt) : FALLBACK_UPDATED),
  )

  // AI Essentials: interactive courses and their chapters
  const essentialsPages: MetadataRoute.Sitemap = []
  for (const course of courses) {
    essentialsPages.push(page(`/ai-academy/${course.id}`, 0.7, 'weekly'))
    for (const chapter of course.chapters) essentialsPages.push(page(`/ai-academy/${course.id}/${chapter.slug}`, 0.5))
  }

  const blogPages: MetadataRoute.Sitemap = blogPostsMeta.map(post => page(`/resources/blog/${post.slug}`, 0.5, 'monthly', new Date(post.date)))
  const trainingPages: MetadataRoute.Sitemap = getAllPrograms().map(p => page(`/services/training/${p.slug}`, 0.6))
  const curriculumPages: MetadataRoute.Sitemap = allCoursePdfs.map(c => page(`/services/training/curriculum/${c.slug}`, 0.6))
  const certPages: MetadataRoute.Sitemap = getAllCertifications().map(c => page(`/services/certifications/${c.slug}`, 0.6))

  return [...staticPages, ...studioPages, ...essentialsPages, ...blogPages, ...trainingPages, ...curriculumPages, ...certPages]
}
