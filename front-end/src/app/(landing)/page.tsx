import { Metadata } from 'next';
import { getDictionary } from '../../i18n/dictionaries';
import LandingClient from './LandingClient';

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
    title: t.seo.home.title,
    description: t.seo.home.description,
    alternates: {
      canonical: `https://edutech.kz/${locale}`,
      languages: {
        'ru-KZ': 'https://edutech.kz/ru',
        'kk-KZ': 'https://edutech.kz/kk',
        'en-US': 'https://edutech.kz/en',
      },
    },
  };
}

export default async function LandingPage({ params }: Props) {
  const resolvedParams = await params;
  const locale = resolvedParams.landing || 'ru';

  return <LandingClient locale={locale} />;
}
