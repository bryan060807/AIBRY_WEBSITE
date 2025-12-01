import { MetadataRoute } from "next";
import { siteMetadata } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteMetadata?.url || "https://aibry.shop";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/login"],
        crawlDelay: 10,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
