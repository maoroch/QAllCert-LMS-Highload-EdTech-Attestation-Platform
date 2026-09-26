import { Metadata } from 'next';
import { BLOG_POSTS } from '../../../data/blog';
import BlogListClient from './BlogListClient';
import { APP_NAME } from '../../../lib/constants';

export const metadata: Metadata = {
  title: 'Педагогикалық мақалалар және аттестаттау бойынша нұсқаулықтар | QAllCert',
  description: 'Қазақстан мұғалімдеріне арналған сараптамалық мақалалар: 2026 жылғы аттестаттау талаптары, біліктілік сағаттары, сабақта жасанды интеллект қолдану және STEAM бағдарламалары.',
  keywords: [
    'мұғалімдерге мақалалар',
    'аттестаттау 2026 ережелері',
    'сабақта жасанды интеллект қолдану',
    'STEAM сабақ жоспарлары',
    'ҚМЖ дайын үлгілері',
    'біліктілікті арттыру 80 сағат',
    'QAllCert блог'
  ],
  alternates: {
    canonical: 'https://qallcert.kz/blog',
    languages: {
      'kk-KZ': 'https://qallcert.kz/kk/blog',
      'ru-KZ': 'https://qallcert.kz/ru/blog',
      'en-US': 'https://qallcert.kz/en/blog',
      'x-default': 'https://qallcert.kz/blog',
    },
  },
  openGraph: {
    title: 'Педагогикалық мақалалар және аттестаттау бойынша нұсқаулықтар | QAllCert',
    description: 'ҚР педагогтарына арналған ресми әдістемелік мақалалар мен нұсқаулықтар.',
    url: 'https://qallcert.kz/blog',
    siteName: APP_NAME,
    locale: 'kk_KZ',
    type: 'website',
  },
};

export default function BlogIndexPage() {
  const postsList = Object.values(BLOG_POSTS);

  // Schema.org Blog
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    'name': 'QAllCert Педагогикалық Блогы',
    'url': 'https://qallcert.kz/blog',
    'description': 'Қазақстан мұғалімдеріне арналған біліктілікті арттыру және аттестаттау мақалалары.',
    'publisher': {
      '@type': 'Organization',
      'name': 'ТОО «QALLCert»',
      'logo': 'https://qallcert.kz/accreditation-certificate.png'
    },
    'blogPost': postsList.map(p => ({
      '@type': 'BlogPosting',
      'headline': p.title.kk,
      'description': p.description.kk,
      'datePublished': p.publishedAt,
      'author': {
        '@type': 'Person',
        'name': p.author.name
      },
      'url': `https://qallcert.kz/blog/${p.slug}`
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogListClient posts={postsList} />
    </>
  );
}
