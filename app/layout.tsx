import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

/* 👇 Import order matters: Tailwind/theme first, app utilities second */
import '../styles/global.css';
import '../app/globals.css';

import { Header, Footer, ToasterProvider } from '@/components/layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'AIBRY',
    template: '%s | AIBRY',
  },
  description: 'Official site for AIBRY music and merch.',
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
  metadataBase: new URL('https://aibry.com'),
};

/* Optional but recommended for mobile browsers */
export const viewport: Viewport = {
  themeColor: '#000000',
};

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
        <ToasterProvider />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
