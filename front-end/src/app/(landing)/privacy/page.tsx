'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Lock, Eye, FileText } from 'lucide-react';
import { getLocale } from '../../../lib/i18n/useTranslation';
import { APP_NAME } from '../../../lib/constants';

export default function PrivacyPolicyPage() {
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
      ru: 'Политика конфиденциальности',
      en: 'Privacy Policy',
      kk: 'Құпиялылық саясаты'
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
      ru: '1. Общие положения',
      en: '1. General Provisions',
      kk: '1. Жалпы ережелер'
    },
    introText: {
      ru: `Настоящая Политика конфиденциальности определяет порядок сбора, хранения, защиты и обработки персональных данных пользователей платформы ${APP_NAME}. Мы придаем приоритетное значение безопасности вашей личной информации и соблюдаем требования законодательства Республики Казахстан о персональных данных и их защите.`,
      en: `This Privacy Policy governs the collection, storage, protection, and processing of personal data of users of the ${APP_NAME} platform. We prioritize the security of your personal information and strictly comply with the applicable legislation of the Republic of Kazakhstan on personal data and its protection.`,
      kk: `Осы Құпиялылық саясаты ${APP_NAME} платформасы пайдаланушыларының дербес деректерін жинау, сақтау, қорғау және өңдеу тәртібін айқындайды. Біз сіздің жеке ақпаратыңыздың қауіпсіздігіне басымдық береміз және Қазақстан Республикасының дербес деректер және оларды қорғау туралы заңнамасының талаптарын сақтаймыз.`
    },
    collectionTitle: {
      ru: '2. Сбор персональных данных',
      en: '2. Collection of Personal Data',
      kk: '2. Дербес деректерді жинау'
    },
    collectionText: {
      ru: 'Мы собираем информацию, которую вы предоставляете непосредственно при регистрации и использовании платформы: имя и фамилию, адрес электронной почты, номер телефона, данные профиля (включая аватар и навыки), а также информацию о прохождении курсов, выполнении домашних заданий и прохождении тестов.',
      en: 'We collect information you provide directly during registration and platform usage: your first and last name, email address, phone number, profile details (including avatar and skills), as well as details about course progress, homework submissions, and tests.',
      kk: 'Платформада тіркелу және оны пайдалану кезінде сіз тікелей ұсынатын ақпаратты жинаймыз: аты-жөніңізді, электрондық поштаңызды, телефон нөміріңізді, профиль деректерін (соның ішінде аватар мен дағдыларды), сондай-ақ курстардан өту, үй тапсырмаларын орындау және тесттерден өту туралы ақпаратты.'
    },
    usageTitle: {
      ru: '3. Использование данных',
      en: '3. Use of Personal Data',
      kk: '3. Деректерді пайдалану'
    },
    usageText: {
      ru: 'Предоставленные вами данные используются исключительно в целях предоставления услуг обучения, персонализации учебного процесса, взаимодействия с кураторами и преподавателями, автоматической генерации официальных сертификатов об окончании, обработки транзакций оплаты и отправки системных уведомлений.',
      en: 'The data you provide is used solely to deliver educational services, personalize the learning workflow, enable interactions with curators and instructors, automatically generate official certificates of completion, process payment transactions, and send system notifications.',
      kk: 'Сіз ұсынған деректер оқу қызметтерін көрсету, оқу процесін даралау, кураторлармен және оқытушылармен өзара іс-қимыл жасау, аяқтау туралы ресми сертификаттарды автоматты түрде жасау, төлем операцияларын өңдеу және жүйелік хабарландыруларды жіберу мақсатында ғана пайдаланылады.'
    },
    securityTitle: {
      ru: '4. Защита и хранение данных',
      en: '4. Data Protection & Security',
      kk: '4. Деректерді қорғау және сақтау'
    },
    securityText: {
      ru: 'Все данные передаются в зашифрованном виде с использованием протокола SSL/TLS. Мы храним ваши данные в безопасной облачной инфраструктуре с использованием авторизованного контроля доступа. Пароли пользователей хранятся в зашифрованном виде (хэшируются) и недоступны сотрудникам платформы.',
      en: 'All data is transmitted in encrypted form using SSL/TLS protocols. We store your data in a secure cloud infrastructure with authorized access controls. User passwords are stored in encrypted format (hashed) and are not accessible to platform staff.',
      kk: 'Барлық деректер SSL/TLS хаттамасын пайдалана отырып, шифрланған түрде беріледі. Біз сіздің деректеріңізді рұқсат етілген қол жеткізуді бақылауды пайдалана отырып, қауіпсіз бұлттық инфрақұрылымда сақтаймыз. Пайдаланушы құпия сөздері шифрланған түрде (хэштеледі) сақталады және платформа қызметкерлеріне қолжетімсіз болады.'
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
              <Shield className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Privacy & Security</span>
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
                <Eye className="w-5 h-5 text-indigo-500 shrink-0" />
                {getLabel('collectionTitle')}
              </h3>
              <p>{getLabel('collectionText')}</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500 shrink-0" />
                {getLabel('usageTitle')}
              </h3>
              <p>{getLabel('usageText')}</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-500 shrink-0" />
                {getLabel('securityTitle')}
              </h3>
              <p>{getLabel('securityText')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
