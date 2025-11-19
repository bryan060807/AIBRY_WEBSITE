import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/styles/global.css";
import "@/app/globals.css";

import { siteMetadata } from "@/lib/metadata";
import { Header, Footer, ToasterProvider } from "@/components/layout";
import { AvatarProvider } from "@/context/AvatarContext"; // 👈 NEW IMPORT

/**
 * Font setup
 */
const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Prevents FOUT (Flash of Unstyled Text)
});

/**
 * Metadata (merged from your version + centralized config)
 */
export const metadata: Metadata = {
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  metadataBase: new URL(siteMetadata.url),
  keywords: siteMetadata.keywords,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.url,
    siteName: siteMetadata.title,
    images: [
      {
        url: siteMetadata.image,
        width: 1200,
        height: 630,
        alt: "AIBRY Official Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: [siteMetadata.image],
  },
  authors: [{ name: siteMetadata.author }],
};

/**
 * Browser theming metadata
 */
export const viewport: Viewport = {
  themeColor: siteMetadata.themeColor,
};

/**
 * RootLayout — wraps the entire app (public + protected)
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className="bg-black text-gray-100 scroll-smooth dark:bg-black dark:text-gray-100"
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>

      <body
        className={`${inter.className} flex min-h-screen flex-col antialiased selection:bg-[#629aa9]/40 selection:text-white`}
      >
        {/* Context provider wraps the app so header & forms share avatar state */}
        <AvatarProvider>
          {/* Global toast notifications */}
          <ToasterProvider />

          {/* Global navigation */}
          <Header />

          {/* Page content */}
          <main id="main-content" className="flex-1">
            {children}
          </main>

          {/* Global footer */}
          <Footer />
        </AvatarProvider>
      </body>
    </html>
  );
}
