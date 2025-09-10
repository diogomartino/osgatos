/** @type {import('next').NextConfig} */
const nextConfig = {
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
    qualities: [40, 60, 100]
  },
  experimental: {
    viewTransition: true
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
