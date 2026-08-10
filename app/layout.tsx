import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/styles/global.css";
import "@/app/globals.css";

import { siteMetadata } from "@/lib/metadata";
import { Header, Footer, ToasterProvider } from "@/components/layout";
import { AuthProvider } from "@/context/AuthContext";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.siteName}`,
  },
  description: siteMetadata.description,
  keywords: siteMetadata.keywords,
  metadataBase: new URL(siteMetadata.url),
  authors: [{ name: siteMetadata.author }],
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

export const viewport: Viewport = {
  themeColor: siteMetadata.themeColor || "#0a0a0a",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://aibrylabs.com/#organization",
      name: "AIBRY",
      url: "https://aibrylabs.com",
      description:
        "AIBRY Labs builds applied AI systems, operator infrastructure, creative software, and real-world client platforms.",
      image: "https://aibrylabs.com/images/og-banner.jpg",
      logo: "https://aibrylabs.com/images/logo.png",
      sameAs: Object.values(siteMetadata.social),
    },
    {
      "@type": "WebSite",
      "@id": "https://aibrylabs.com/#website",
      url: "https://aibrylabs.com",
      name: "AIBRY",
      publisher: { "@id": "https://aibrylabs.com/#organization" },
      inLanguage: "en-US",
    },
    {
      "@type": "WebApplication",
      name: "AIBRY Apps",
      url: "https://aibrylabs.com/apps",
      applicationCategory: "ProductivityApplication",
      operatingSystem: "Web",
      creator: { "@id": "https://aibrylabs.com/#organization" },
    },
    {
      "@type": "Store",
      name: "AIBRY Store",
      url: "https://aibrylabs.com/store",
      parentOrganization: { "@id": "https://aibrylabs.com/#organization" },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`bg-black text-gray-100 scroll-smooth dark:bg-black dark:text-gray-100 ${inter.className}`}
      >
        <AuthProvider>
          <ToasterProvider />
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
