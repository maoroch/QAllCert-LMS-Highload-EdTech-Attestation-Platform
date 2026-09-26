import { Metadata } from 'next';
import { getDictionary } from '../../../i18n/dictionaries';
import FeaturesClient from './FeaturesClient';

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
    title: t.seo.features.title,
    description: t.seo.features.description,
    alternates: {
      canonical: `https://edutech.kz/${locale}/features`,
      languages: {
        'ru-KZ': 'https://edutech.kz/ru/features',
        'kk-KZ': 'https://edutech.kz/kk/features',
        'en-US': 'https://edutech.kz/en/features',
      },
    },
  };
}

export default async function FeaturesPage({ params }: Props) {
  const resolvedParams = await params;
  const locale = resolvedParams.landing || 'ru';

  return <FeaturesClient locale={locale} />;
}
