import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Enable static HTML export
  output: "export",
  // Base path for GitHub Pages deployment
  basePath: process.env.NODE_ENV === "production" ? "/TSWebUI-shadcn" : "",
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: process.cwd(),
  },
}

export default nextConfig
