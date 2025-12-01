import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/global.css";
import "@/app/globals.css";

import { siteMetadata } from "@/lib/metadata";
import { Header, Footer, ToasterProvider } from "@/components/layout";
import { AvatarProvider } from "@/context/AvatarContext";
import { Analytics } from "@vercel/analytics/react";

// ✅ Font setup
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

// ✅ Centralized metadata
export const metadata: Metadata = {
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.siteName}`,
  },
  description: siteMetadata.description,
  keywords: siteMetadata.keywords,
  metadataBase: new URL(siteMetadata.url),
  authors: [{ name: siteMetadata.author }],
  themeColor: siteMetadata.themeColor,
  openGraph: {
    ...siteMetadata.openGraph,
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: [siteMetadata.image],
  },
  icons: {
    icon: siteMetadata.favicon,
  },
};

// ✅ JSON-LD Structured Data (Artist + Website + Example Recordings)
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MusicGroup",
      "@id": "https://aibry.shop/#musicgroup",
      name: "AIBRY",
      url: "https://aibry.shop",
      description:
        "AIBRY is the sound of unfiltered emotion — a fusion of metal, trapmetal, and raw chaos.",
      genre: ["Metal", "Trapmetal", "Dark Trap"],
      image: "https://aibry.shop/images/og-banner.jpg",
      logo: "https://aibry.shop/images/logo.png",
      sameAs: [
        "https://www.instagram.com/aibrymusic/",
        "https://www.tiktok.com/@_aibry",
        "https://open.spotify.com/artist/6gw6SIOYGPhuMqOfLwJE9h",
        "https://music.apple.com/us/artist/aibry/1830943798",
      ],
      member: [
        {
          "@type": "Person",
          name: "AIBRY",
          roleName: "Vocalist / Producer",
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://aibry.shop/#website",
      url: "https://aibry.shop",
      name: "AIBRY.shop",
      publisher: { "@id": "https://aibry.shop/#musicgroup" },
      inLanguage: "en-US",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://aibry.shop/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    // Example of MusicRecording entries — you can extend or generate dynamically later
    {
      "@type": "MusicRecording",
      name: "BLOODWIRE",
      url: "https://aibry.shop/discography/bloodwire",
      inAlbum: {
        "@type": "MusicAlbum",
        name: "BLOODWIRE",
        byArtist: { "@id": "https://aibry.shop/#musicgroup" },
      },
      byArtist: { "@id": "https://aibry.shop/#musicgroup" },
      datePublished: "2024-06-01",
      duration: "PT3M12S",
      genre: "Trapmetal",
      offers: {
        "@type": "Offer",
        url: "https://open.spotify.com/track/xxx",
        price: "0.00",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
    },
    {
      "@type": "MusicRecording",
      name: "MIRRORS",
      url: "https://aibry.shop/discography/mirrors",
      inAlbum: {
        "@type": "MusicAlbum",
        name: "MIRRORS",
        byArtist: { "@id": "https://aibry.shop/#musicgroup" },
      },
      byArtist: { "@id": "https://aibry.shop/#musicgroup" },
      datePublished: "2024-09-15",
      duration: "PT2M58S",
      genre: "Metal / Industrial",
      offers: {
        "@type": "Offer",
        url: "https://music.apple.com/us/album/mirrors/1830943798",
        price: "0.00",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* JSON-LD structured data for artist, website, and recordings */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`bg-black text-gray-100 scroll-smooth dark:bg-black dark:text-gray-100 ${inter.className}`}
      >
        <AvatarProvider>
          <ToasterProvider />
          <Header />

          <main id="main-content" className="flex-1">
            {children}
          </main>

          <Footer />
          <Analytics />
        </AvatarProvider>
      </body>
    </html>
  );
}
