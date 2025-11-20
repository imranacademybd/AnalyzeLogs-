import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Googlebot Analyzer - Analyze Your Googlebot Logs Instantly',
    template: '%s | Googlebot Analyzer'
  },
  description: 'Analyze your Googlebot log files instantly. Get detailed crawl metrics, top URLs, status codes, mobile vs desktop crawls, CSV export, and comprehensive SEO insights. Free log analyzer tool for SEO professionals.',
  keywords: [
    'googlebot analyzer',
    'log analyzer',
    'crawl log analysis',
    'googlebot logs',
    'SEO log analyzer',
    'crawl metrics',
    'bot analysis',
    'log file analyzer',
    'crawl statistics',
    'SEO tools',
    'web crawler analysis',
    'googlebot crawl data'
  ],
  authors: [{ name: 'imranseo', url: 'https://imranseo.com/' }],
  creator: 'imranseo',
  publisher: 'imranseo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://imranseo.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://imranseo.com',
    siteName: 'Googlebot Analyzer',
    title: 'Googlebot Analyzer - Analyze Your Googlebot Logs Instantly',
    description: 'Analyze your Googlebot log files instantly. Get detailed crawl metrics, top URLs, status codes, mobile vs desktop crawls, CSV export, and comprehensive SEO insights.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Googlebot Analyzer - Log Analysis Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Googlebot Analyzer - Analyze Your Googlebot Logs Instantly',
    description: 'Analyze your Googlebot log files instantly. Get detailed crawl metrics, top URLs, CSV export, and comprehensive SEO insights.',
    images: ['/og-image.jpg'],
    creator: '@imranseo',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here if needed
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
