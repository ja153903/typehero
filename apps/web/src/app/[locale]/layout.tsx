import { Analytics } from '@vercel/analytics/react';

import '../../styles/globals.css';

import { Toaster } from '@repo/ui/components/toaster';
import { Inter } from 'next/font/google';
import { Navigation } from '~/components/navigation';
import { getStaticParams } from '~/locales/server';
import { Providers } from './providers';

import { OG_URL, tagline } from '../metadata';

export const metadata = {
  metadataBase: new URL(OG_URL),
  title: 'TypeHero',
  robots: {
    index: true,
    follow: true,
  },
  description: tagline,
  openGraph: {
    title: 'TypeHero',
    description: tagline,
    siteName: 'TypeHero',
    images: [
      {
        url: `${OG_URL}/api/default`,
        width: 1920,
        height: 1080,
      },
    ],
    locale: 'en-US',
    type: 'website',
  },
  twitter: {
    title: 'TypeHero',
    card: 'summary_large_image',
    images: [
      {
        url: `${OG_URL}/api/default`,
        width: 1920,
        height: 1080,
      },
    ],
  },
  icons: {
    shortcut: '/favicon.ico',
  },
};

const inter = Inter({ subsets: ['latin'] });

export function generateStaticParams() {
  return getStaticParams();
}

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <meta
          content="Level up your typescript skills with interactive exercises"
          name="description"
        />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${inter.className} flex flex-col`}>
        <Providers locale={locale}>
          <Navigation />
          <main className="flex-1">{children}</main>
          <Toaster />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
