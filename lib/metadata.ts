// lib/metadata.ts

export const siteMetadata = {
  // Core identity
  title: "AIBRY | Metal. Emotion. Chaos.",
  description:
    "AIBRY is the sound of unfiltered emotion — a fusion of metal, trapmetal, and raw chaos. Explore music, visuals, and exclusive releases.",
  siteName: "AIBRY",
  author: "AIBRY",
  language: "en-US",
  locale: "en_US",

  // Canonical domain
  url: "https://aibry.shop",

  // Visuals & theme
  image: "/images/og-banner.jpg",
  themeColor: "#000000",
  favicon: "/favicon.ico",
  logo: "/images/logo.png",

  // SEO keywords (still relevant for crawlers)
  keywords: [
    "AIBRY",
    "metal",
    "trapmetal",
    "dark trap",
    "alternative artist",
    "metal rapper",
    "emotional music",
    "metal visuals",
  ],

  // Social links
  social: {
    tiktok: "https://www.tiktok.com/@_aibry",
    instagram: "https://www.instagram.com/aibrymusic/",
    spotify: "https://open.spotify.com/artist/6gw6SIOYGPhuMqOfLwJE9h",
    appleMusic: "https://music.apple.com/us/artist/aibry/1830943798",
    github: "https://github.com/bryan060807/AIBRY_WEBSITE", // keep your source link visible for trust
  },

  // SEO meta extensions
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "AIBRY | Metal. Emotion. Chaos.",
    description:
      "AIBRY is the sound of unfiltered emotion — a fusion of metal, trapmetal, and raw chaos. Explore music, visuals, and exclusive releases.",
    url: "https://aibry.shop",
    siteName: "AIBRY",
    images: [
      {
        url: "https://aibry.shop/images/og-banner.jpg",
        width: 1200,
        height: 630,
        alt: "AIBRY — Metal. Emotion. Chaos.",
      },
    ],
  },

  // Robots & sitemap data
  robots: {
    allow: ["/"],
    disallow: ["/api/", "/dashboard/", "/login"],
    crawlDelay: 10,
  },
  sitemap: "https://aibry.shop/sitemap.xml",
};
