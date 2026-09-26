import { MetadataRoute } from 'next';
import { ALL_REGION_SLUGS } from '../data/regions';
import { ALL_BLOG_SLUGS } from '../data/blog';

const BASE_URL = 'https://qallcert.kz';
const LOCALES = ['kk', 'ru', 'en'];

const CANONICAL_COURSES = [
  'math-trigonometry-80h',
  'python-pedagog-80h',
  'steam-education-80h',
  'ai-education-86h'
];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/pricing', '/features', '/contacts', '/certificates/verify', '/blog'];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Main landing and company routes
  for (const locale of LOCALES) {
    for (const route of routes) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : (route === '/certificates/verify' ? 0.9 : 0.8),
      });
    }

    // Dynamic accredited course pages
    for (const slug of CANONICAL_COURSES) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}/courses/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.95,
      });
    }

    // Dynamic regional geo-landing pages
    for (const city of ALL_REGION_SLUGS) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}/city/${city}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.85,
      });
    }

    // Dynamic blog articles
    for (const slug of ALL_BLOG_SLUGS) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  // Root canonical course pages (without locale prefix)
  for (const slug of CANONICAL_COURSES) {
    sitemapEntries.push({
      url: `${BASE_URL}/courses/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    });
  }

  // Root canonical regional pages (without locale prefix)
  for (const city of ALL_REGION_SLUGS) {
    sitemapEntries.push({
      url: `${BASE_URL}/city/${city}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    });
  }

  // Root canonical blog articles (without locale prefix)
  for (const slug of ALL_BLOG_SLUGS) {
    sitemapEntries.push({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  return sitemapEntries;
}

