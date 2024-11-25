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
};

export default nextConfig;


