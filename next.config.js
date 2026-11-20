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
  async rewrites() {
    // The certification study guides are standalone HTML apps under public/.
    // Next.js serves public/ files only at exact paths, so clean directory-style
    // URLs rewrite to each app's index.html (afterFiles: real files still win).
    return {
      afterFiles: [],
      // Nothing is served from /downloads, whatever is on the server's disk.
      // A spreadsheet of leads once sat in public/downloads. Deleting it from the project did NOT take it off
      // the live site: a deploy copies the new files over the old ones and removes none, so every file that was
      // ever in public/ is still served (20 November 2026: 166 of the 167 files deleted over the years answered).
      // A rule here is looked at BEFORE any file is looked for, so this address now ends at "not found".
      // Do not put a folder called downloads in public/ again (docs/SECURITY.md, "Files").
      beforeFiles: [{ source: '/downloads/:path*', destination: '/not-found-nothing-is-kept-here' }],
      fallback: [],
    }
  },
  async redirects() {
    return [
      // The Claude certification courses moved from standalone HTML apps into the site itself.
      { source: '/claude-certifications', destination: '/claude/certifications', permanent: true },
      { source: '/claude-certifications/prep-hub', destination: '/claude/certifications', permanent: true },
      { source: '/claude-certifications/:slug', destination: '/claude/certifications/:slug', permanent: true },
      { source: '/claude-cowork', destination: '/workshops/claude-cowork', permanent: true },
      { source: '/portfolio/:path*', destination: '/about', permanent: true },
      { source: '/portfolio', destination: '/about', permanent: true },
      { source: '/case-studies', destination: '/about', permanent: true },
      { source: '/work/:path*', destination: '/about', permanent: true },
      { source: '/the-gennoor-way', destination: '/about', permanent: true },
      { source: '/solutions/:path*', destination: '/training', permanent: true },
      { source: '/solutions', destination: '/training', permanent: true },
      { source: '/services', destination: '/training', permanent: true },
      { source: '/services/ai-strategy', destination: '/automation', permanent: true },
      { source: '/services/agentic-ai', destination: '/automation', permanent: true },
      { source: '/services/poc-development', destination: '/automation', permanent: true },
      { source: '/services/collaboration', destination: '/contact', permanent: true },
      { source: '/services/training-rollout', destination: '/training', permanent: true },
      { source: '/services/enterprise-ai-roadmap-workshop', destination: '/training', permanent: true },
      { source: '/services/ai-training-saudi-arabia', destination: '/training', permanent: true },
      { source: '/services/ai-training-india', destination: '/training', permanent: true },
      { source: '/services/ai-training-remote', destination: '/training', permanent: true },
      { source: '/services/copilot-studio-training', destination: '/services/training', permanent: true },
      { source: '/services/azure-ai-foundry-workshop', destination: '/services/training', permanent: true },
      { source: '/about/company', destination: '/about', permanent: true },
      { source: '/about/story', destination: '/about', permanent: true },
      { source: '/about/team-and-delivery', destination: '/about', permanent: true },
      { source: '/about/trust-and-security', destination: '/about', permanent: true },
      { source: '/industries/:path*', destination: '/training', permanent: true },
      { source: '/industries', destination: '/training', permanent: true },
      { source: '/functions/:path*', destination: '/training', permanent: true },
      { source: '/functions', destination: '/training', permanent: true },
      { source: '/ai-readiness-v2', destination: '/contact', permanent: true },
      { source: '/ai-readiness/:path*', destination: '/contact', permanent: true },
      { source: '/ai-readiness', destination: '/contact', permanent: true },
      { source: '/career-coach', destination: '/studio', permanent: true },
      { source: '/demo/:path*', destination: '/', permanent: true },
      { source: '/dev/:path*', destination: '/', permanent: true },
      { source: '/resources', destination: '/resources/blog', permanent: true },
      { source: '/resources/pocs/:path*', destination: '/automation', permanent: true },
      { source: '/resources/pocs', destination: '/automation', permanent: true },
      { source: '/resources/calculators/:path*', destination: '/resources/blog', permanent: true },
      { source: '/resources/guides/:path*', destination: '/resources/blog', permanent: true },
      { source: '/resources/videos', destination: '/resources/blog', permanent: true },
      { source: '/academy', destination: '/studio', permanent: true },
      { source: '/labs/:path*', destination: '/studio/:path*', permanent: true },
      { source: '/video-courses/:path*', destination: '/studio/:path*', permanent: true },
      { source: '/about/journey', destination: '/about/founder', permanent: true },
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