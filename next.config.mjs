/** @type {import('next').NextConfig} */
// PAGES_BASE: set to "/<repo>" when exporting for a GitHub project page
// (assets 404 without it); unset for root-domain deploys.
const base = process.env.PAGES_BASE ?? "";

const nextConfig = {
  output: "export",
  distDir: "dist",
  basePath: base,
  assetPrefix: base,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
