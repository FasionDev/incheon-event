import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/inchecon-event',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
