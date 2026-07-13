/** @type {import('next').NextConfig} */
// PAGES_BASE: set to "/<repo>" when exporting for a GitHub project page
// (assets 404 without it); unset for root-domain deploys.
const base = process.env.PAGES_BASE ?? "";

const nextConfig = {
  output: "export",
  env: {
    // raw <img> tags don't get basePath auto-prefixed — bridge it to the client
    NEXT_PUBLIC_BASE_PATH: base,
  },
  distDir: "dist",
  basePath: base,
  assetPrefix: base,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
