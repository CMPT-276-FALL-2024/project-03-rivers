import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['img.spoonacular.com', 'www.foodimagedb.com'],
    unoptimized: true,
  },
};

export default nextConfig;

