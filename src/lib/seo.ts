import type { Metadata } from 'next'
import { siteConfig } from '@/lib/site-config'

/**
 * What a search engine and a shared link read about a page, written in one place so that
 * every page gives the same full set: title, description, its one true address, and the
 * words and picture a link to it shows on LinkedIn, WhatsApp or X.
 *
 * A page that writes `openGraph` by hand and leaves the picture out shares with no picture
 * at all (Next does not fill it in from the layout). Use `pageMeta` and that cannot happen.
 *
 *   export const metadata = pageMeta({
 *     title: 'AI training for teams',        // the site adds " | Gennoor Tech"; never write the name yourself
 *     description: '…',                      // one or two plain sentences, about 120 to 160 characters
 *     path: '/training',                     // the page's address, from the slash
 *     image: 'training',                     // a key of src/lib/og-pages.ts; left out, the site's own picture
 *   })
 */

/** Where the blog's feed is (src/app/resources/blog/feed.xml). */
export const FEED_PATH = '/resources/blog/feed.xml'

/** The picture a shared link shows: a key of src/lib/og-pages.ts, or an address from the slash. 1200 x 630. */
export function shareImage(key: string, alt: string) {
  return { url: key.startsWith('/') ? key : `/og/${key}`, width: 1200, height: 630, alt }
}

export interface PageMeta {
  /** Without the site's name: the layout adds " | Gennoor Tech" */
  title: string
  /** Set when the title must stand exactly as written (it already names Gennoor, or is long) */
  absoluteTitle?: boolean
  /**
   * Set in a layout.tsx that has pages under it. A layout that gives a plain title switches the
   * " | Gennoor Tech" ending off for every page below it; with this the ending is kept.
   */
  forLayout?: boolean
  description: string
  /** The page's address, from the slash: '/training'. The home page is '/'. */
  path: string
  /** A key of src/lib/og-pages.ts, or an address from the slash. Default: the site's picture. */
  image?: string
  type?: 'website' | 'article'
  keywords?: string[]
  /** Kept out of search results */
  noindex?: boolean
  /** Names the blog's feed in the page, so a feed reader finds it */
  feed?: boolean
  /** For a blog post: when it was published, who wrote it, its category and tags */
  article?: { published: string; modified?: string; authors: string[]; section: string; tags: string[] }
  /** Other words for the shared link, when the page title does not suit it */
  shareTitle?: string
  shareDescription?: string
}

export function pageMeta(m: PageMeta): Metadata {
  const title = m.shareTitle || m.title
  const description = m.shareDescription || m.description
  const image = shareImage(m.image || 'site', title)
  const shared = { siteName: siteConfig.name, locale: 'en_US', url: m.path, title, description, images: [image] }
  return {
    title: m.absoluteTitle ? { absolute: m.title } : m.forLayout ? { default: m.title, template: `%s | ${siteConfig.name}` } : m.title,
    description: m.description,
    ...(m.keywords ? { keywords: m.keywords } : null),
    alternates: { canonical: m.path, ...(m.feed ? { types: { 'application/rss+xml': [{ url: FEED_PATH, title: `${siteConfig.name} blog` }] } } : null) },
    openGraph: m.article
      ? { ...shared, type: 'article', publishedTime: m.article.published, modifiedTime: m.article.modified || m.article.published, authors: m.article.authors, section: m.article.section, tags: m.article.tags }
      : { ...shared, type: m.type || 'website' },
    twitter: { card: 'summary_large_image', title, description, images: [image.url] },
    ...(m.noindex ? { robots: { index: false, follow: false } } : null),
  }
}

/**
 * A description short enough for a search result (about 160 characters), cut at the end of a
 * sentence when one ends in time, otherwise at the end of a word.
 */
export function metaDescription(text: string, max = 158): string {
  const clean = (text || '').replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const head = clean.slice(0, max + 1)
  const stop = Math.max(head.lastIndexOf('. '), head.lastIndexOf('? '), head.lastIndexOf('! '))
  if (stop >= 118) return head.slice(0, stop + 1)
  return `${head.slice(0, max - 1).replace(/\s+\S*$/, '').replace(/[\s,;:—-]+$/, '')}…`
}

/** A title short enough for a search result. Long titles are left whole in the page; this is for the tab and the result. */
export function metaTitle(text: string, max = 70): string {
  const clean = (text || '').replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  // a long title usually has a second half after a colon or a dash: keep the first half if it says enough
  const first = clean.split(/\s[—–-]\s|:\s/)[0]
  if (first.length >= 28 && first.length <= max) return first
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, '').replace(/[\s,;:—-]+$/, '')}…`
}
