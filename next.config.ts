import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/incheon-event',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
