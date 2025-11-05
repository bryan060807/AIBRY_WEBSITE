import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '../styles/global.css'; // Global Tailwind/theme first
import '../app/globals.css';   // App-level globals second

import { Header, Footer, ToasterProvider } from '@/components/layout';

/**
 * Font setup
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Prevents flash of unstyled text (FOUT)
});

/**
 * Metadata and Open Graph defaults
 */
export const metadata: Metadata = {
  title: {
    default: 'AIBRY',
    template: '%s | AIBRY',
  },
  description: 'Official site for AIBRY music and merch.',
  metadataBase: new URL('https://aibry.com'),
  openGraph: {
    title: 'AIBRY',
    description: 'Official site for AIBRY music and merch.',
    url: 'https://aibry.com',
    siteName: 'AIBRY',
    images: [
      {
        url: '/images/logo.png',
        width: 800,
        height: 600,
        alt: 'AIBRY Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIBRY',
    description: 'Official site for AIBRY music and merch.',
    images: ['/images/logo.png'],
  },
};

/**
 * Browser theming metadata
 */
export const viewport: Viewport = {
  themeColor: '#000000',
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
        className={`${inter.className} flex min-h-screen flex-col antialiased 
          selection:bg-[#629aa9]/40 selection:text-white`}
      >
        {/* Toast notifications available globally */}
        <ToasterProvider />

        {/* Global navigation */}
        <Header />

        {/* Content slot — supports both public and protected layouts */}
        <main id="main-content" className="flex-1">
          {children}
        </main>

        {/* Global footer */}
        <Footer />
      </body>
    </html>
  );
}
