/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.BUILD_STANDALONE ? 'standalone' : undefined,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      },
      {
        protocol: 'http',
        hostname: '**'
      }
    ],
    qualities: [40, 50, 60, 100]
  },
  headers: async () => [
    {
      source: '/:path*',
      has: [{ type: 'host', value: 'osgatos.vercel.app' }],
      headers: [{ key: 'X-Robots-Tag', value: 'noindex' }]
    }
  ]
};

module.exports = nextConfig;
