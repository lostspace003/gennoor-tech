/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  serverExternalPackages: ['applicationinsights', '@azure/data-tables', '@azure/storage-blob', 'pdf-parse', '@azure/identity', '@microsoft/microsoft-graph-client'],
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.gennoor.com' }],
        destination: 'https://gennoor.com/:path*',
        permanent: true,
      },
    ]
  },
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