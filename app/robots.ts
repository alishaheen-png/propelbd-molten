import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://propelbd.ai/sitemap.xml",
    host: "https://propelbd.ai",
  };
}
