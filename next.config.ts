import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['img.spoonacular.com', 'www.foodimagedb.com'],
    unoptimized: true,
  },
  swcMinify: true,
  reactStrictMode: true,
  experimental: {
    optimizeCss: true,
  },
  async rewrites() {
    return [
      {
        source: '/google7c335c90a115b1f8.html',
        destination: '/google7c335c90a115b1f8.html',
      },
    ]
  },
};

export default nextConfig;


