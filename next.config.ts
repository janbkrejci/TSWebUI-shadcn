import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static HTML export (replaces `next export`)
  output: 'export',
  /* config options here */
  // basePath: '/shadcn',
  turbopack: {
    root: './',
  }
};

export default nextConfig;
