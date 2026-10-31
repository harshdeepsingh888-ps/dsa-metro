import type { NextConfig } from 'next';

// GitHub Pages serves the site from /dsa-metro, so the deploy workflow sets BASE_PATH.
// Locally it is empty and the site runs at http://localhost:3000/.
const basePath = process.env.BASE_PATH || '';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
