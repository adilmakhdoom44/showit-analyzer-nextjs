import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
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
  title: 'Showit Site Analyzer - Free SEO & Speed Tool for Showit Websites',
  description:
    'Free SEO, speed, and AI visibility analyzer built for Showit creators. Analyze your photographer or creative business website and get Showit-specific fixes in 30 seconds. No signup required.',
  keywords: 'Showit SEO, Showit website analyzer, photographer website SEO, Showit speed test, Core Web Vitals, AI visibility, free SEO tool',
  openGraph: {
    title: 'Showit Site Analyzer - Free SEO & Speed Tool',
    description: 'Analyze your Showit website for SEO, speed, and AI visibility. Get Showit-specific fixes in 30 seconds - free, no signup.',
    type: 'website',
    url: 'https://showitanalyzer.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Showit Site Analyzer - Free SEO Tool',
    description: 'Free SEO, speed, and AI visibility analysis for Showit websites. Built for photographers, coaches, and creative entrepreneurs.',
  },
  alternates: { canonical: 'https://showitanalyzer.com' },
  icons: {
    icon: [
      { url: '/icon', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-icon', type: 'image/png', sizes: '180x180' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <AnalyzerProvider>
            {children}
            <CalendlyButton />
          </AnalyzerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
