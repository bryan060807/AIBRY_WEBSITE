import { MetadataRoute } from "next";
import { siteMetadata } from "@/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/contact",
    "/merch",
    "/discography",
  ].map((route) => ({
    url: `${siteMetadata.url}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.7,
  }));

  return routes;
}
