import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — Showit Site Analyzer | Get Help With Your Showit SEO',
  description:
    'Get help with your Showit SEO analysis, report a bug, request a feature, or book a free 30-minute strategy call with a Showit expert. We reply within 24 hours.',
  alternates: { canonical: 'https://showitanalyzer.com/contact' },
  keywords: [
    'contact Showit Site Analyzer',
    'Showit SEO help',
    'Showit expert strategy call',
    'Showit website help',
    'Showit SEO consultation free',
    'Showit photographer SEO help',
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Contact Showit Site Analyzer — Questions & Free Strategy Calls',
    description:
      'Get help with your Showit website SEO, report a bug, or book a free 30-minute strategy call with a Showit expert.',
    url: 'https://showitanalyzer.com/contact',
    type: 'website',
    siteName: 'Showit Site Analyzer',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Contact Showit Site Analyzer — Get Showit SEO Help',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Showit Site Analyzer',
    description:
      'Questions about your Showit SEO? Book a free strategy call or send us a message.',
    images: ['/opengraph-image'],
  },
};

const contactSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ContactPage',
      '@id': 'https://showitanalyzer.com/contact#webpage',
      url: 'https://showitanalyzer.com/contact',
      name: 'Contact Showit Site Analyzer',
      description:
        'Contact page for Showit Site Analyzer. Submit a bug report, feature request, general question, or book a free strategy call.',
      inLanguage: 'en-US',
      isPartOf: { '@type': 'WebSite', url: 'https://showitanalyzer.com', name: 'Showit Site Analyzer' },
      breadcrumb: { '@id': 'https://showitanalyzer.com/contact#breadcrumb' },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://showitanalyzer.com/contact#breadcrumb',
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
          name: 'Contact',
          item: 'https://showitanalyzer.com/contact',
        },
      ],
    },
    {
      '@type': 'Organization',
      name: 'Showit Site Analyzer',
      url: 'https://showitanalyzer.com',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        url: 'https://showitanalyzer.com/contact',
        availableLanguage: 'English',
      },
    },
  ],
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      {children}
    </>
  );
}
