import { Metadata } from 'next';
import { getDictionary } from '../../../i18n/dictionaries';
import ContactsClient from './ContactsClient';

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
    title: t.seo.contacts.title,
    description: t.seo.contacts.description,
    alternates: {
      canonical: `https://edutech.kz/${locale}/contacts`,
      languages: {
        'ru-KZ': 'https://edutech.kz/ru/contacts',
        'kk-KZ': 'https://edutech.kz/kk/contacts',
        'en-US': 'https://edutech.kz/en/contacts',
      },
    },
  };
}

export default async function ContactsPage({ params }: Props) {
  const resolvedParams = await params;
  const locale = resolvedParams.landing || 'ru';

  return <ContactsClient locale={locale} />;
}
