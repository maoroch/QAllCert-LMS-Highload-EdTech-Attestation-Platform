import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { REGIONS, ALL_REGION_SLUGS, RegionData } from '../../../../data/regions';
import { CANONICAL_COURSES } from '../../../../data/courses';
import CityLandingClient from './CityLandingClient';
import { APP_NAME } from '../../../../lib/constants';

type Props = {
  params: Promise<{ city: string }>;
};

export async function generateStaticParams() {
  return ALL_REGION_SLUGS.map((slug) => ({
    city: slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const region = REGIONS[city.toLowerCase()];

  if (!region) {
    return {
      title: `Өңір табылмады | ${APP_NAME}`,
      robots: { index: false, follow: false },
    };
  }

  const title = region.metaTitle.kk;
  const description = region.metaDescription.kk;
  const canonicalUrl = `https://qallcert.kz/city/${region.slug}`;

  return {
    title,
    description,
    keywords: [
      `${region.names.kk} мұғалімдер курстары`,
      `курсы для учителей ${region.names.ru}`,
      `аттестация педагогов ${region.names.ru} 80 часов`,
      `${region.names.kk} біліктілікті арттыру 80 сағат`,
      'ҚР мұғалімдерді аттестаттау курстары',
      'аккредиттелген онлайн курстар мұғалімдерге',
      'QAllCert',
      region.slug
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'kk-KZ': `https://qallcert.kz/kk/city/${region.slug}`,
        'ru-KZ': `https://qallcert.kz/ru/city/${region.slug}`,
        'en-US': `https://qallcert.kz/en/city/${region.slug}`,
        'x-default': canonicalUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: APP_NAME,
      locale: 'kk_KZ',
      type: 'website',
      images: [
        {
          url: '/accreditation-certificate.png',
          width: 1200,
          height: 630,
          alt: `QAllCert - ${region.regionTitle.kk}`,
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

export default async function CityPage({ params }: Props) {
  const { city } = await params;
  const region = REGIONS[city.toLowerCase()];

  if (!region) {
    notFound();
  }

  const coursesList = Object.values(CANONICAL_COURSES);
  const allRegionsList = ALL_REGION_SLUGS.map((slug) => ({
    slug,
    name: REGIONS[slug].names.kk,
  }));

  // Schema.org Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Басты бет',
            'item': 'https://qallcert.kz'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Өңірлер',
            'item': 'https://qallcert.kz#regions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': region.names.kk,
            'item': `https://qallcert.kz/city/${region.slug}`
          }
        ]
      },
      {
        '@type': 'EducationalOrganization',
        'name': 'ТОО «QALLCert»',
        'alternateName': APP_NAME,
        'url': 'https://qallcert.kz',
        'logo': 'https://qallcert.kz/accreditation-certificate.png',
        'taxID': '250240001104',
        'hasCredential': {
          '@type': 'EducationalOccupationalCredential',
          'credentialCategory': 'Certificate of Accreditation',
          'recognizedBy': {
            '@type': 'Organization',
            'name': 'Central Asian Association for Accreditation of Education (CAAAE)',
            'alternateName': 'Орталық Азия білім жүйесін аккредиттеу қауымдастығы'
          },
          'identifier': '№ 25/20КА0003'
        },
        'areaServed': {
          '@type': 'AdministrativeArea',
          'name': region.names.ru
        }
      },
      {
        '@type': 'ItemList',
        'name': region.regionTitle.kk,
        'itemListElement': coursesList.map((c, index) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'item': {
            '@type': 'Course',
            'name': c.title,
            'description': c.description,
            'provider': {
              '@type': 'Organization',
              'name': 'QAllCert'
            },
            'timeRequired': `PT${c.hours}H`,
            'offers': {
              '@type': 'Offer',
              'price': c.price,
              'priceCurrency': 'KZT',
              'availability': 'https://schema.org/InStock',
              'url': `https://qallcert.kz/courses/${c.slug}`
            }
          }
        }))
      },
      {
        '@type': 'FAQPage',
        'mainEntity': region.faqs.map((faq) => ({
          '@type': 'Question',
          'name': faq.question.kk,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.answer.kk
          }
        }))
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CityLandingClient
        region={region}
        courses={coursesList}
        allRegions={allRegionsList}
      />
    </>
  );
}
