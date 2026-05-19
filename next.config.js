/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
  serverExternalPackages: ['applicationinsights', '@azure/data-tables', '@azure/storage-blob', 'pdf-parse', '@azure/identity', '@microsoft/microsoft-graph-client'],
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