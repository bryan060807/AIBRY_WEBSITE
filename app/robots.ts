import { MetadataRoute } from "next";
import { siteMetadata } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard/", "/login"],
    },
    sitemap: `${siteMetadata.url}/sitemap.xml`,
    host: siteMetadata.url,
  };
}
