import type { NextConfig } from "next";

const BASE_PATH = '/incheon-event';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: BASE_PATH,
  env: {
    NEXT_PUBLIC_BASE_PATH: BASE_PATH,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
