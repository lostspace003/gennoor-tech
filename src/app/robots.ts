import type { MetadataRoute } from 'next'

/**
 * What search engines may read.
 *
 * `/_next/` is NOT closed: it holds the site's styles and scripts, and a search engine that
 * cannot load them sees every page as plain unstyled text and judges it so (it was closed
 * until November 2026). `/og/` stays open too: it holds the pictures a shared link shows, and
 * LinkedIn's reader obeys this file.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/crm/', '/api/', '/dev/', '/demo/', '/functions/'],
      },
    ],
    sitemap: 'https://gennoor.com/sitemap.xml',
  }
}
