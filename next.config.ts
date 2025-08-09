import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  // Dynamic base path based on deployment target
  basePath: process.env.DEPLOY_TARGET === 'cpanel' 
    ? '' 
    : process.env.NODE_ENV === 'production' ? '/portfolio_blog' : '',
  assetPrefix: process.env.DEPLOY_TARGET === 'cpanel'
    ? ''
    : process.env.NODE_ENV === 'production' ? '/portfolio_blog/' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
