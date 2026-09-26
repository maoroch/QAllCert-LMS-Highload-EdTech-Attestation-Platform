import { Metadata } from 'next';
import { getDictionary } from '../../../i18n/dictionaries';
import PricingClient from './PricingClient';

type Props = {
  params: Promise<{ landing: string }>;
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams.landing || 'ru';
  const t = getDictionary(locale);

  return {
    title: t.seo.pricing.title,
    description: t.seo.pricing.description,
    alternates: {
      canonical: `https://edutech.kz/${locale}/pricing`,
      languages: {
        'ru-KZ': 'https://edutech.kz/ru/pricing',
        'kk-KZ': 'https://edutech.kz/kk/pricing',
        'en-US': 'https://edutech.kz/en/pricing',
      },
    },
  };
}

export default async function PricingPage({ params }: Props) {
  const resolvedParams = await params;
  const locale = resolvedParams.landing || 'ru';
  const t = getDictionary(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": t.pricing.plans.map((plan, index) => ({
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": plan.name,
      },
      "price": plan.price.replace(/\D/g, '') || "0",
      "priceCurrency": "KZT",
      "position": index + 1
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PricingClient locale={locale} />
    </>
  );
}
