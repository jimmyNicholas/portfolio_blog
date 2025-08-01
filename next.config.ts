import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/portfolio_blog' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/portfolio_blog/' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
