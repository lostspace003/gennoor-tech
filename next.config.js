/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // SAMEORIGIN keeps academy chapter iframes (same-origin /api/content) working
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // No includeSubDomains/preload yet — subdomain inventory unverified (docs/FOLLOW-UPS.md)
          { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/claude-cowork',
        destination: '/workshops/claude-cowork',
        permanent: true,
      },
      {
        source: '/portfolio/demos',
        destination: '/resources/pocs',
        permanent: true,
      },
      {
        source: '/services',
        destination: '/solutions',
        permanent: true,
      },
    ]
  },
  output: 'standalone',
  // pdfkit MUST stay external: bundling it strips the .afm font data files it
  // reads from disk at runtime (PDF generation then fails at "Helvetica").
  serverExternalPackages: ['applicationinsights', '@azure/data-tables', '@azure/storage-blob', 'pdf-parse', '@azure/identity', '@microsoft/microsoft-graph-client', 'pdfkit'],
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'gennoor-tech.azurewebsites.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'stgennoortech.blob.core.windows.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  turbopack: {
    root: './'
  }
}

module.exports = nextConfig