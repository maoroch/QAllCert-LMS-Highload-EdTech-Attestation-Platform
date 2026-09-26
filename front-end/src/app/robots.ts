import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/courses/*',
        '/*/courses/*',
        '/certificates/verify',
        '/*/certificates/verify',
        '/accreditation-certificate.pdf',
        '/pricing',
        '/*/pricing',
        '/features',
        '/*/features',
        '/contacts',
        '/*/contacts',
      ],
      disallow: [
        '/dashboard/*',
        '/*/dashboard/*',
        '/admin/*',
        '/*/admin/*',
        '/api/*',
        '/certificates/verify/*', // individual dynamic verification query pages
        '/*/certificates/verify/*',
      ],
    },
    sitemap: 'https://qallcert.kz/sitemap.xml',
  };
}
