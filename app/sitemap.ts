import { MetadataRoute } from "next";
import { siteMetadata } from "@/lib/metadata";

/**
 * Sitemap generator for AIBRY.shop
 * Keeps all key pages indexable with correct priorities.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteMetadata?.url || "https://aibry.shop";

  const routes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/contact",
    "/merch",
    "/discography",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : 0.7,
  }));

  // Add additional routes dynamically later (e.g., from CMS or API)
  return routes;
}
