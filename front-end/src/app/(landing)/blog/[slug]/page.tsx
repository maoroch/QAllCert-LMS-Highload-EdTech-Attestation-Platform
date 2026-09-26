import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BLOG_POSTS, ALL_BLOG_SLUGS, BlogPost } from '../../../../data/blog';
import { CANONICAL_COURSES } from '../../../../data/courses';
import BlogPostClient from './BlogPostClient';
import { APP_NAME } from '../../../../lib/constants';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return ALL_BLOG_SLUGS.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS[slug];

  if (!post) {
    return {
      title: `Мақала табылмады | ${APP_NAME}`,
      robots: { index: false, follow: false },
    };
  }

  const title = `${post.title.kk} | ${APP_NAME}`;
  const description = post.description.kk;
  const canonicalUrl = `https://qallcert.kz/blog/${post.slug}`;

  return {
    title,
    description,
    keywords: post.tags,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'kk-KZ': `https://qallcert.kz/kk/blog/${post.slug}`,
        'ru-KZ': `https://qallcert.kz/ru/blog/${post.slug}`,
        'en-US': `https://qallcert.kz/en/blog/${post.slug}`,
        'x-default': canonicalUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: APP_NAME,
      locale: 'kk_KZ',
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      tags: post.tags,
      images: [
        {
          url: '/accreditation-certificate.png',
          width: 1200,
          height: 630,
          alt: post.title.kk,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/accreditation-certificate.png'],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS[slug];

  if (!post) {
    notFound();
  }

  const leadCourse = CANONICAL_COURSES[post.courseLeadSlug];
  const relatedPosts = Object.values(BLOG_POSTS)
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  // Schema.org Article / BlogPosting Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title.kk,
    'description': post.description.kk,
    'datePublished': post.publishedAt,
    'dateModified': post.publishedAt,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://qallcert.kz/blog/${post.slug}`,
    },
    'author': {
      '@type': 'Person',
      'name': post.author.name,
      'jobTitle': post.author.role,
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'ТОО «QALLCert»',
      'alternateName': APP_NAME,
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://qallcert.kz/accreditation-certificate.png',
      },
    },
    'keywords': post.tags.join(', '),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostClient
        post={post}
        leadCourse={leadCourse}
        relatedPosts={relatedPosts}
      />
    </>
  );
}
