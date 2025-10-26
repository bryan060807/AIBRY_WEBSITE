import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ToasterProvider from "@/components/ToasterProvider"; // Import the provider

export const metadata: Metadata = {
  title: {
    default: "AIBRY",
    template: "%s | AIBRY",
  },
  description: "Official site for AIBRY music and merch.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "AIBRY",
    description: "Official site for AIBRY music and merch.",
    url: "https://aibry.com", // update if you deploy to Vercel with custom domain
    siteName: "AIBRY",
    images: [
      {
        url: "/images/logo.png", // fallback for social previews
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AIBRY",
    description: "Official site for AIBRY music and merch.",
    images: ["/images/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-black text-gray-100">
      <body className="flex min-h-screen flex-col">
        {/* This will render the toast pop-ups anywhere in your app */}
        <ToasterProvider />
        
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}