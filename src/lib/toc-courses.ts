import data from '@/data/toc-courses.json'
import { signBlobUrl } from '@/lib/lms'

export interface TocCourse {
  slug: string; title: string; domain: string; tagline: string; level: string; audience: string
  days: number; hours: number; outcomes: string[]; modules: string[]; capstone: string
  promo: string; thumbnail: string; captions: string; outlineHtml: string; outlinePdf: string
}

// Outlines and promo videos live in the private blob container; pages hand out short-lived read links.
export const TOC_CONTAINER = 'toc-and-promotional-videos'
export const TOC_DOMAINS = ['Automation with Claude', 'Agentic Cybersecurity'] as const

export const tocCourses = data as TocCourse[]
export const getTocCourse = (slug: string) => tocCourses.find(c => c.slug === slug)

/** Just the card image (a short-lived read link), for the course lists. */
export const tocThumbnailUrl = (c: TocCourse) => signBlobUrl(TOC_CONTAINER, c.thumbnail, 180, { contentType: 'image/png' })

export function tocLinks(c: TocCourse) {
  return {
    promo: signBlobUrl(TOC_CONTAINER, c.promo, 180, { contentType: 'video/mp4' }),
    thumbnail: signBlobUrl(TOC_CONTAINER, c.thumbnail, 180, { contentType: 'image/png' }),
    outlineHtml: signBlobUrl(TOC_CONTAINER, c.outlineHtml, 180, { contentType: 'text/html' }),
    outlinePdf: signBlobUrl(TOC_CONTAINER, c.outlinePdf, 180, { inline: false, filename: `${c.title} - Course Outline.pdf`, contentType: 'application/pdf' }),
  }
}
