// Server component - renders JSON-LD schema for the homepage
export default function HomeSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://showitanalyzer.com/#website',
        url: 'https://showitanalyzer.com',
        name: 'Showit Site Analyzer',
        description:
          'Free SEO, speed, and AI visibility analyzer built specifically for Showit website creators - photographers, coaches, designers, and creative entrepreneurs.',
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: 'https://showitanalyzer.com/?url={url}' },
          'query-input': 'required name=url',
        },
      },
      {
        '@type': 'WebPage',
        '@id': 'https://showitanalyzer.com/#webpage',
        url: 'https://showitanalyzer.com',
        name: 'Showit Site Analyzer - Free SEO & Speed Tool for Showit Websites',
        description:
          'Analyze your Showit website for SEO, Core Web Vitals, AI visibility, broken links, and schema markup. Get Showit-specific fixes in 30 seconds - free, no signup.',
        inLanguage: 'en-US',
        isPartOf: { '@id': 'https://showitanalyzer.com/#website' },
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Showit Site Analyzer',
        url: 'https://showitanalyzer.com',
        applicationCategory: 'WebApplication',
        operatingSystem: 'Web Browser',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        description:
          'A free web application that analyzes Showit websites for SEO, page speed (Core Web Vitals), AI visibility, broken links, and conversion optimization. Built for photographers, videographers, coaches, designers, and creative entrepreneurs.',
        keywords:
          'Showit SEO, Showit website analyzer, photographer website SEO, Showit speed test, Core Web Vitals Showit, AI visibility score, SEO tool for photographers, free website analyzer',
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Is Showit Site Analyzer free?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, completely free. No signup, no credit card, no trial period. The tool uses the Google PageSpeed Insights API and runs analysis in real time - no data is stored.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does this SEO tool work for photographer websites on Showit?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Showit Site Analyzer was built specifically for photographers and other creative entrepreneurs using Showit. Every fix recommendation references the exact Showit dashboard panel you need to change - not generic SEO advice written for WordPress.',
            },
          },
          {
            '@type': 'Question',
            name: 'What does the Showit website analyzer check?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'It checks SEO (title, meta, headings, keywords), speed (Core Web Vitals, LCP, CLS), AI visibility (AEO score, schema, E-E-A-T), broken links, technical issues (analytics, structured data), and bonus tools like SERP estimator and competitor comparison.',
            },
          },
          {
            '@type': 'Question',
            name: 'How long does a Showit SEO audit take?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'About 30 seconds. The tool calls the Google PageSpeed Insights API and scrapes your page HTML simultaneously, then displays a full report across six analysis tabs.',
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
