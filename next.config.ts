import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  basePath: '/simple-personal-finance-tracker',
  assetPrefix: '/simple-personal-finance-tracker/',
  images: { unoptimized: true },
};

export default nextConfig;
