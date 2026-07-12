import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://propelbd.com",
      lastModified: new Date("2026-07-12"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
