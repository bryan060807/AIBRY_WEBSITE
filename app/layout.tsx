import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: {
    default: "AIBRY",
    template: "%s | AIBRY",
  },
  description: "Official site for AIBRY music, merch, and creative archive.",
  metadataBase: new URL("https://aibry.shop"),
  alternates: { canonical: "https://aibry.shop" },
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "AIBRY",
    description: "Official site for AIBRY music, merch, and creative archive.",
    url: "https://aibry.shop",
    siteName: "AIBRY",
    images: [{ url: "/images/logo.png", width: 800, height: 600 }],
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
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-black text-gray-100 antialiased">
        <Toaster position="top-center" />
        <Header />
        <main id="main-content" className="flex-1 focus:outline-none">
          {children}
          <ContactForm />
        </main>
        <Footer />
      </body>
    </html>
  );
}