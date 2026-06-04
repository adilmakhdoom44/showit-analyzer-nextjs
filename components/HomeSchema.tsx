export default function HomeSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://showitanalyzer.com/#organization',
        name: 'Showit Site Analyzer',
        url: 'https://showitanalyzer.com',
        description: 'Free SEO, speed, and AI visibility analyzer built specifically for Showit website creators.',
        priceRange: 'Free',
        areaServed: 'Worldwide',
        logo: {
          '@type': 'ImageObject',
          url: 'https://showitanalyzer.com/icon',
          width: 32,
          height: 32,
        },
        sameAs: [],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          url: 'https://showitanalyzer.com/contact',
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://showitanalyzer.com/#website',
        url: 'https://showitanalyzer.com',
        name: 'Showit Site Analyzer',
        description:
          'Free SEO, speed, and AI visibility analyzer built specifically for Showit website creators — photographers, coaches, designers, and creative entrepreneurs.',
        publisher: { '@id': 'https://showitanalyzer.com/#organization' },
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: 'https://showitanalyzer.com/?url={url}' },
          'query-input': 'required name=url',
        },
        inLanguage: 'en-US',
      },
      {
        '@type': 'WebPage',
        '@id': 'https://showitanalyzer.com/#webpage',
        url: 'https://showitanalyzer.com',
        name: 'Showit Site Analyzer - Free SEO & Speed Tool for Showit Websites',
        description:
          'Analyze your Showit website for SEO, Core Web Vitals, AI visibility, broken links, and schema markup. Get Showit-specific fixes in 30 seconds — free, no signup.',
        inLanguage: 'en-US',
        isPartOf: { '@id': 'https://showitanalyzer.com/#website' },
        about: { '@id': 'https://showitanalyzer.com/#organization' },
        datePublished: '2024-01-01',
        dateModified: new Date().toISOString().split('T')[0],
      },
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://showitanalyzer.com/#app',
        name: 'Showit Site Analyzer',
        url: 'https://showitanalyzer.com',
        applicationCategory: 'WebApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires JavaScript',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
        description:
          'A free web application that analyzes Showit websites for SEO, page speed (Core Web Vitals), AI visibility, broken links, and conversion optimization. Built for photographers, videographers, coaches, designers, and creative entrepreneurs.',
        featureList: [
          'SEO audit (title, meta, headings, keywords, Open Graph)',
          'Core Web Vitals — LCP, CLS, TBT, FCP',
          'AI visibility score for ChatGPT and Google AI Overviews',
          'Broken link detection',
          'Technical audit (schema, analytics, robots, HTTPS)',
          'Showit-specific fix instructions',
          'Score history in browser',
          'PDF export of fix checklist',
        ],
        screenshot: 'https://showitanalyzer.com/opengraph-image',
      },
      {
        '@type': 'HowTo',
        '@id': 'https://showitanalyzer.com/#howto',
        name: 'How to Analyze Your Showit Website for SEO',
        description:
          'Use Showit Site Analyzer to get a free SEO, speed, and AI visibility report for your Showit website in under 30 seconds.',
        totalTime: 'PT1M',
        tool: [{ '@type': 'HowToTool', name: 'Showit Site Analyzer' }],
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Enter your Showit website URL',
            text: 'Go to showitanalyzer.com and paste your Showit website URL into the analyzer input field.',
            url: 'https://showitanalyzer.com',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Click Analyze',
            text: 'Click the Analyze button. The tool calls the Google PageSpeed Insights API and fetches your page HTML simultaneously.',
            url: 'https://showitanalyzer.com',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Review your results across 6 tabs',
            text: 'In about 30 seconds, your full report appears across 6 tabs: Overview, SEO, Speed, Links, Technical, and AI Visibility.',
            url: 'https://showitanalyzer.com',
          },
          {
            '@type': 'HowToStep',
            position: 4,
            name: 'Fix issues using Showit-specific instructions',
            text: 'Each issue includes instructions for the exact Showit panel you need to open — Page Settings, Site Settings, or the canvas editor.',
            url: 'https://showitanalyzer.com',
          },
          {
            '@type': 'HowToStep',
            position: 5,
            name: 'Export your fix checklist as PDF',
            text: 'Click the Print Report button to export a prioritized PDF checklist of all issues ranked by impact.',
            url: 'https://showitanalyzer.com/report',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://showitanalyzer.com/#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Is Showit Site Analyzer free?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, completely free. No signup, no credit card, no trial period. The tool uses the Google PageSpeed Insights API and runs analysis in real time — no data is stored.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does this SEO tool work for photographer websites on Showit?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Showit Site Analyzer was built specifically for photographers and other creative entrepreneurs using Showit. Every fix recommendation references the exact Showit dashboard panel you need to change — not generic SEO advice written for WordPress.',
            },
          },
          {
            '@type': 'Question',
            name: 'What does the Showit website analyzer check?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'It checks SEO (title, meta, headings, keywords, Open Graph, canonical URLs), speed (Core Web Vitals: LCP, CLS, TBT, FCP), AI visibility (AEO score, schema markup, E-E-A-T signals), broken links, technical issues (analytics, structured data, robots/sitemap, HTTPS), and bonus tools like a SERP estimator and competitor comparison.',
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
          {
            '@type': 'Question',
            name: 'Why do generic SEO tools give wrong advice for Showit websites?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Generic SEO tools assume you are using WordPress and tell you to edit theme files, install Yoast, or modify PHP — none of which apply to Showit. Showit Site Analyzer gives you fixes for Showit\'s canvas-based editor, Page Settings panel, and Site Settings — the places you can actually make changes.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does this tool work for non-Showit websites?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'It will analyze any public URL, but the fix recommendations are written specifically for Showit users. If your site is on another platform, the scores will still be accurate but the action steps will reference Showit panels.',
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
