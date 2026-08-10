// lib/metadata.ts

export const siteMetadata = {
  title: "AIBRY Labs | Applied AI. Software Systems. Real-World Tools.",
  description:
    "AIBRY Labs builds applied AI systems, operator infrastructure, creative software, and real-world client platforms.",
  siteName: "AIBRY",
  author: "AIBRY",
  language: "en-US",
  locale: "en_US",
  themeColor: "#0a0a0a",

  url: "https://aibrylabs.com",

  image: "/images/og-banner.jpg",
  favicon: "/favicon.ico",
  logo: "/images/logo.png",

  keywords: [
    "AIBRY Labs",
    "applied AI",
    "AI systems",
    "operator infrastructure",
    "software development",
    "creative tools",
    "audio software",
    "automation",
    "client platforms",
    "Bandcamp",
  ],

  social: {
    soundcloud: "https://soundcloud.com/aibry_music",
    youtube: "https://www.youtube.com/@AIBRY_Music",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    title: "AIBRY Labs | Applied AI. Software Systems. Real-World Tools.",
    description:
      "AIBRY Labs builds applied AI systems, operator infrastructure, creative software, and real-world client platforms.",
    url: "https://aibrylabs.com",
    siteName: "AIBRY",
    images: [
      {
        url: "https://aibrylabs.com/images/og-banner.jpg",
        width: 1200,
        height: 630,
        alt: "AIBRY Labs — Applied AI. Software Systems. Real-World Tools.",
      },
    ],
  },

  robots: {
    allow: ["/"],
    disallow: ["/api/", "/dashboard/", "/login"],
    crawlDelay: 10,
  },
  sitemap: "https://aibrylabs.com/sitemap.xml",
};
