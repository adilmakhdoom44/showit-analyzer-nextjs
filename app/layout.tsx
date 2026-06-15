import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { AnalyzerProvider } from '@/lib/analyzer-context';
import { ThemeProvider } from '@/lib/theme-context';
import CalendlyButton from '@/components/CalendlyButton';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://showitanalyzer.com'),
  title: {
    default: 'Showit Site Analyzer - Free SEO & Speed Tool for Showit Websites',
    template: '%s | Showit Site Analyzer',
  },
  description:
    'Free SEO, speed, and AI visibility analyzer built for Showit creators. Analyze your photographer or creative business website and get Showit-specific fixes in 30 seconds. No signup required.',
  keywords: [
    'Showit SEO',
    'Showit website analyzer',
    'Showit SEO tool',
    'Showit site audit',
    'Showit speed test',
    'Showit Core Web Vitals',
    'photographer website SEO',
    'Showit photographer SEO',
    'free SEO tool for photographers',
    'Showit performance tool',
    'AI visibility score',
    'AI search optimization',
    'Showit website checker',
    'Showit broken links',
    'Showit schema markup',
    'creative entrepreneur SEO',
    'wedding photographer SEO',
    'Showit page speed',
    'free website audit Showit',
    'Showit Google ranking',
  ],
  authors: [{ name: 'Showit Site Analyzer', url: 'https://showitanalyzer.com' }],
  creator: 'Showit Site Analyzer',
  publisher: 'Showit Site Analyzer',
  category: 'technology',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Showit Site Analyzer - Free SEO & Speed Tool',
    description: 'Analyze your Showit website for SEO, speed, and AI visibility. Get Showit-specific fixes in 30 seconds - free, no signup.',
    type: 'website',
    url: 'https://showitanalyzer.com',
    siteName: 'Showit Site Analyzer',
    locale: 'en_US',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Showit Site Analyzer - Free SEO, Speed & AI Visibility Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Showit Site Analyzer - Free SEO Tool for Showit Websites',
    description: 'Free SEO, speed, and AI visibility analysis for Showit websites. Built for photographers, coaches, and creative entrepreneurs.',
    images: ['/opengraph-image'],
    creator: '@adilmakhdoom44',
    site: '@showitanalyzer',
  },
  alternates: { canonical: 'https://showitanalyzer.com' },
  icons: {
    icon: [{ url: '/icon', type: 'image/png', sizes: '32x32' }],
    apple: [{ url: '/apple-icon', type: 'image/png', sizes: '180x180' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4DGQ5L9GDD"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4DGQ5L9GDD');
          `}
        </Script>
      </head>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <AnalyzerProvider>
            {children}
            {/* <CalendlyButton /> */}
          </AnalyzerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
