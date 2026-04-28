import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep all images from src/assets working
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
