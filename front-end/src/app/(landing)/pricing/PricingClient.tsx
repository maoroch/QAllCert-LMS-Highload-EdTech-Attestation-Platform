'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getDictionary } from '../../../i18n/dictionaries';
import { getLocale } from '../../../lib/i18n/useTranslation';
import { Check, ChevronDown, BookOpen } from 'lucide-react';
import apiClient from '../../../lib/api/client';
import { useAppSelector } from '../../../store/hooks';

export default function PricingClient({ locale }: { locale: string }) {
  const [activeLocale, setActiveLocale] = useState(locale);
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const currentLocale = getLocale();
    if (currentLocale && currentLocale !== activeLocale) {
      setActiveLocale(currentLocale);
    }

    const loadCourses = async () => {
      try {
        const { data } = await apiClient.get('/courses');
        setCourses(data || []);
      } catch (err) {
        console.error('Failed to load courses', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, []);

  const normalizedLocale = activeLocale === 'kz' ? 'kk' : activeLocale;
  const t = getDictionary(normalizedLocale);

  // Localization labels
  const labels = {
    title: {
      ru: 'Доступные курсы и цены',
      en: 'Available Courses & Pricing',
      kk: 'Қолжетімді курстар және бағалар'
    },
    subtitle: {
      ru: 'Инвестируйте в свое будущее. Выберите подходящую программу и начните обучение прямо сейчас с пожизненным доступом.',
      en: 'Invest in your future. Choose the right program and start learning right now with lifetime access.',
      kk: 'Болашағыңызға инвестиция салыңыз. Сәйкес бағдарламаны таңдап, дәл қазір өмірлік қолжетімділікпен оқуды бастаңыз.'
    },
    lifetimeAccess: {
      ru: 'Пожизненный доступ',
      en: 'Lifetime access',
      kk: 'Өмірлік қолжетімділік'
    },
    buyBtn: {
      ru: 'Начать обучение',
      en: 'Start Learning',
      kk: 'Оқуды бастау'
    },
    free: {
      ru: 'Бесплатно',
      en: 'Free',
      kk: 'Тегін'
    },
    features: {
      ru: [
        'Полноценный доступ ко всем лекциям',
        'Интерактивная практика и автотесты',
        'Сертификат об успешном окончании',
        'Поддержка преподавателей и соавторов',
        'Пожизненный доступ к обновлениям'
      ],
      en: [
        'Full access to all lectures',
        'Interactive practice and autograder',
        'Verified certificate of completion',
        'Support from teachers and co-authors',
        'Lifetime access to updates'
      ],
      kk: [
        'Барлық дәрістерге толық қолжетімділік',
        'Интерактивті тәжірибе және автотесттер',
        'Аяқтау туралы сертификат',
        'Оқытушылар мен соавторлардың қолдауы',
        'Жаңартуларға өмірлік қолжетімділік'
      ]
    }
  };

  const getLabel = (key: keyof typeof labels) => {
    const section = labels[key] as any;
    return section[normalizedLocale] ?? section['ru'];
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-slate-50 relative overflow-hidden pt-36 pb-24">
      {/* Decorative background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-b from-indigo-500/10 to-transparent blur-3xl pointer-events-none" />

      <main className="z-10 w-full max-w-6xl px-4 space-y-16">
        {/* Header */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
            {getLabel('title')}
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {getLabel('subtitle')}
          </p>
        </div>

        {/* Courses Pricing Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-8">
            {(courses.length > 0 ? courses : t.home.courses).map((course, i) => {
              const isDbCourse = !!course.id;
              const price = isDbCourse ? Number(course.price) : 0;

              // Target URL: redirect to dynamic public course page if guest, otherwise dashboard
              const targetUrl = isDbCourse
                ? `/courses/${course.id}`
                : '/login';

              const highlight = i === 1; // Highlight the middle course for design aesthetics

              const currentFeatures = getLabel('features') as string[];

              return (
                <div
                  key={i}
                  className={`relative bg-white rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 ${highlight
                      ? 'border-2 border-indigo-500 shadow-xl shadow-indigo-500/10'
                      : 'border border-slate-200/60 shadow-sm'
                    }`}
                >
                  {highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                      Popular
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-indigo-600">
                      <BookOpen className="w-5 h-5" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {getLabel('lifetimeAccess')}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 leading-snug">{course.title}</h3>
                      <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                        {course.description || course.desc}
                      </p>
                    </div>

                    <div className="pt-2 flex items-baseline gap-2">
                      {price > 0 ? (
                        <>
                          <span className="text-4xl font-extrabold text-slate-900">
                            {price}
                          </span>
                          <span className="text-slate-500 text-sm font-semibold">USD</span>
                        </>
                      ) : (
                        <span className="text-4xl font-extrabold text-slate-900">
                          {getLabel('free')}
                        </span>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-6">
                      <ul className="space-y-4">
                        {currentFeatures.map((feature, j) => (
                          <li key={j} className="flex items-start gap-3 text-slate-600 text-sm">
                            <Check className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-8">
                    <Link
                      href={targetUrl}
                      className={`flex w-full items-center justify-center h-12 rounded-2xl font-semibold text-sm transition-all duration-300 ${highlight
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md'
                          : 'bg-slate-50 text-slate-800 border border-slate-200 hover:bg-slate-100'
                        }`}
                    >
                      {getLabel('buyBtn')}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* FAQ */}
        <div className="max-w-3xl mx-auto pt-24">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">{t.pricing.faqTitle}</h2>
          <div className="space-y-4">
            {t.pricing.faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-semibold text-slate-800">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''
                      }`}
                  />
                </button>
                <div
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                  <p className="text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
