/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  serverExternalPackages: ['applicationinsights', '@azure/data-tables', '@azure/storage-blob'],
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
    ],
  },
  turbopack: {
    root: './'
  }
}

module.exports = nextConfig