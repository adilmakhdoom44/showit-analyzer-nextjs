import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Showit Site Analyzer — Built Specifically for Showit Creators',
  description:
    'Learn how Showit Site Analyzer gives photographers, coaches, and creative entrepreneurs the SEO fixes generic tools can\'t — with Showit-native instructions for every recommendation.',
  alternates: { canonical: 'https://showitanalyzer.com/about' },
  openGraph: {
    title: 'About Showit Site Analyzer — Built for Showit, Not WordPress',
    description:
      'Generic SEO tools give Showit creators the wrong instructions. Showit Site Analyzer was built specifically for how Showit works — so every fix is one you can actually implement.',
    url: 'https://showitanalyzer.com/about',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'About Showit Site Analyzer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Showit Site Analyzer — Built for Showit Creators',
    description:
      'The only SEO analyzer built specifically for Showit — with fixes that reference the exact Showit panels you need to open.',
    images: ['/opengraph-image'],
  },
};

const aboutSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://showitanalyzer.com/about#webpage',
      url: 'https://showitanalyzer.com/about',
      name: 'About Showit Site Analyzer — Built Specifically for Showit Creators',
      description:
        'Showit Site Analyzer is a free SEO, speed, and AI visibility tool built for photographers, coaches, and creative entrepreneurs on Showit.',
      inLanguage: 'en-US',
      isPartOf: { '@type': 'WebSite', url: 'https://showitanalyzer.com', name: 'Showit Site Analyzer' },
      breadcrumb: { '@id': 'https://showitanalyzer.com/about#breadcrumb' },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://showitanalyzer.com/about#breadcrumb',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://showitanalyzer.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'About',
          item: 'https://showitanalyzer.com/about',
        },
      ],
    },
  ],
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      {children}
    </>
  );
}
