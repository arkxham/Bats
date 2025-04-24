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
    domains: ['bats.rip', 'vercel.app', 'localhost'],
    // Only use unoptimized for local development
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // No basePath needed for Vercel deployment
  // basePath: '',
};

export default nextConfig;
