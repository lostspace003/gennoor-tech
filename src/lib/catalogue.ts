import { listLmsCourses, toCard } from '@/lib/lms'
import { tocCourses, tocThumbnailUrl, tocPromoUrl, TOC_DOMAINS } from '@/lib/toc-courses'

/** One card in a course carousel, whatever kind of course it is. */
export interface CatalogueCard {
  id: string
  title: string
  href: string
  image: string | null
  video: string | null
  meta: string
  group: string
}

/** Published Learning Studio courses. A new course appears here by itself once it is published. */
export async function studioCards(): Promise<CatalogueCard[]> {
  try {
    return (await listLmsCourses()).map(toCard).map(c => ({
      id: `studio-${c.slug}`,
      title: c.title,
      href: `/studio/${c.slug}`,
      image: c.thumbnailUrl,
      video: c.promoUrl || null,
      meta: `${c.lectures} lessons${c.hours ? ` · ${c.hours} hours` : ''}`,
      group: 'Learning Studio',
    }))
  } catch {
    return [] // storage not configured: the page still renders
  }
}

/** The instructor-led Claude courses, optionally for one domain. */
export function claudeCards(domain?: string): CatalogueCard[] {
  return tocCourses
    .filter(c => !domain || c.domain === domain)
    .map(c => {
      let image: string | null = null
      let video: string | null = null
      try { image = tocThumbnailUrl(c); video = tocPromoUrl(c) } catch { /* storage not configured */ }
      return { id: `claude-${c.slug}`, title: c.title, href: `/claude/courses/${c.slug}`, image, video, meta: `${c.days} days · ${c.hours} hours · instructor-led`, group: c.domain }
    })
}

/** Everything, for the home page: Studio courses first, then the Claude courses by domain. */
export async function allCards(): Promise<CatalogueCard[]> {
  return [...(await studioCards()), ...TOC_DOMAINS.flatMap(d => claudeCards(d))]
}
