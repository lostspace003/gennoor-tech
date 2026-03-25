import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/media/', '/_next/', '/admin/'],
      },
    ],
    sitemap: 'https://gennoor.com/sitemap.xml',
  }
}
