import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: 'https://showitanalyzer.com/sitemap.xml',
    host: 'https://showitanalyzer.com',
  };
}
