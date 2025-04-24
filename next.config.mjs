/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export settings for Vercel deployment
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['bats.rip', 'vercel.app', 'localhost', 'v0-custom-website-design-lyart.vercel.app'],
    // Only use unoptimized for local development
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // No basePath needed for Vercel deployment
  // basePath: '',
  async headers() {
    return [
      {
        // Add CORS headers to all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
};

export default nextConfig;
