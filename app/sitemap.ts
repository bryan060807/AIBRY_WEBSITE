import { MetadataRoute } from "next";
import { siteMetadata } from "@/lib/metadata";

/**
 * Public, indexable pages only. Keep this list synchronized with real routes.
 * Do not emit lastModified: new Date() on every sitemap request:
 * that incorrectly tells crawlers every page was just updated.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteMetadata.url.replace(/\/$/, "");

  const pages = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/apps", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/apps/trackmaster", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/apps/aibry-id", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/apps/taskmaster", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/apps/chordmaster", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/store", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/discography", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/event-horizon", priority: 0.5, changeFrequency: "monthly" as const },
  ];

  return pages.map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}${path}`,
    changeFrequency,
    priority,
  }));
}
