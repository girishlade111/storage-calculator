/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // Subpath deploy on GitHub Pages. Remove basePath for root-domain / Vercel deploys.
  basePath: "/storage-calculator",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
