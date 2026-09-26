'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Scale, BookOpen, AlertCircle, FileText } from 'lucide-react';
import { getLocale } from '../../../lib/i18n/useTranslation';
import { APP_NAME } from '../../../lib/constants';

export default function TermsOfServicePage() {
  const [locale, setLocale] = useState('ru');

  useEffect(() => {
    const currentLocale = getLocale();
    if (currentLocale) {
      setLocale(currentLocale);
    }
  }, []);

  const normalizedLocale = locale === 'kz' ? 'kk' : locale;

  const labels = {
    title: {
      ru: 'Условия использования',
      en: 'Terms of Service',
      kk: 'Пайдалану шарттары'
    },
    lastUpdated: {
      ru: 'Последнее обновление: 15 июля 2026 г.',
      en: 'Last updated: July 15, 2026',
      kk: 'Соңғы жаңартылуы: 15 шілде 2026 ж.'
    },
    backToHome: {
      ru: '← На главную',
      en: '← Back to Home',
      kk: '← Басты бетке'
    },
    introTitle: {
      ru: '1. Согласие с условиями',
      en: '1. Acceptance of Terms',
      kk: '1. Шарттармен келісу'
    },
    introText: {
      ru: `Регистрируясь на платформе ${APP_NAME} или используя её функции, вы соглашаетесь соблюдать настоящие Условия использования. Если вы не согласны с какими-либо положениями, пожалуйста, прекратите использование платформы.`,
      en: `By registering on the ${APP_NAME} platform or using its services, you agree to comply with these Terms of Service. If you do not agree with any of the terms, please stop using the platform.`,
      kk: `${APP_NAME} платформасында тіркелу немесе оның функцияларын пайдалану арқылы сіз осы Пайдалану шарттарын сақтауға келісесіз. Егер сіз қандай да бір ережелермен келіспесеңіз, платформаны пайдалануды тоқтатыңыз.`
    },
    accountsTitle: {
      ru: '2. Учетные записи пользователей',
      en: '2. User Accounts',
      kk: '2. Пайдаланушы аккаунттары'
    },
    accountsText: {
      ru: 'Для доступа к курсам вы должны зарегистрироваться и предоставить точную и актуальную информацию. Вы несете личную ответственность за конфиденциальность ваших учетных данных и за любые действия, совершаемые под вашей учетной записью.',
      en: 'To access courses, you must register and provide accurate, up-to-date information. You are personally responsible for maintaining the confidentiality of your login credentials and for any actions taken under your account.',
      kk: 'Курстарға қол жеткізу үшін сіз тіркеліп, нақты және өзекті ақпаратты ұсынуыңыз керек. Сіз өзіңіздің тіркелгі деректеріңіздің құпиялылығы үшін және сіздің аккаунтыңыз арқылы жасалатын кез келген әрекеттер үшін жеке жауапты боласыз.'
    },
    contentTitle: {
      ru: '3. Интеллектуальная собственность',
      en: '3. Intellectual Property',
      kk: '3. Зияткерлік меншік'
    },
    contentText: {
      ru: 'Все материалы курсов (видео, тексты, код заданий, графические файлы), опубликованные на платформе, защищены законом об авторском праве. Вам предоставляется ограниченное право личного некоммерческого просмотра. Копирование, распространение или продажа контента платформы запрещены.',
      en: 'All course materials (videos, text documents, practice coding tasks, graphic assets) published on the platform are protected by copyright laws. You are granted a limited, personal, non-commercial right to view the content. Copying, redistributing, or selling platform content is strictly prohibited.',
      kk: 'Платформада жарияланған барлық курс материалдары (бейнелер, мәтіндер, тапсырмалар коды, графикалық файлдар) авторлық құқық туралы заңмен қорғалған. Сізге жеке коммерциялық емес қараудың шектеулі құқығы беріледі. Платформа мазмұнын көшіруге, таратуға немесе сатуға тыйым салынады.'
    },
    paymentsTitle: {
      ru: '4. Оплата и возврат средств',
      en: '4. Payments and Refunds',
      kk: '4. Төлем және қаражатты қайтару'
    },
    paymentsText: {
      ru: 'Платные курсы оплачиваются единовременно для получения пожизненного доступа. Обработка платежей производится через сертифицированный платежный шлюз Stripe. Условия возврата регулируются законодательством Республики Казахстан в области защиты прав потребителей.',
      en: 'Paid courses are processed as a one-time payment for lifetime access. Payments are secured and processed through the Stripe gateway. Refund requests are handled in accordance with the applicable consumer protection laws of the Republic of Kazakhstan.',
      kk: 'Ақылы курстар өмірлік қолжетімділікті алу үшін бір рет төленеді. Төлемдерді өңдеу сертификатталған Stripe төлем шлюзі арқылы жүзеге асырылады. Қаражатты қайтару шарттары Қазақстан Республикасының тұтынушылардың құқықтарын қорғау саласындағы заңнамасымен реттеледі.'
    }
  };

  const getLabel = (key: keyof typeof labels) => {
    return labels[key][normalizedLocale as 'ru' | 'en' | 'kk'] || labels[key]['ru'];
  };

  return (
    <div className="min-h-screen bg-slate-50 py-28 relative overflow-hidden text-left">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-b from-indigo-500/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 space-y-8 relative z-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
          {getLabel('backToHome')}
        </Link>

        <div className="bg-white border border-slate-200/60 rounded-3xl p-8 md:p-12 shadow-sm space-y-8">
          <div className="space-y-3 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-2 text-indigo-600">
              <Scale className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Terms & Agreement</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              {getLabel('title')}
            </h1>
            <p className="text-slate-400 text-sm">{getLabel('lastUpdated')}</p>
          </div>

          <div className="space-y-6 text-slate-600 leading-relaxed text-sm">
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500 shrink-0" />
                {getLabel('introTitle')}
              </h3>
              <p>{getLabel('introText')}</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-indigo-500 shrink-0" />
                {getLabel('accountsTitle')}
              </h3>
              <p>{getLabel('accountsText')}</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-500 shrink-0" />
                {getLabel('contentTitle')}
              </h3>
              <p>{getLabel('contentText')}</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-indigo-500 shrink-0" />
                {getLabel('paymentsTitle')}
              </h3>
              <p>{getLabel('paymentsText')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
