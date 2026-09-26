'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getDictionary } from '../../i18n/dictionaries';
import { APP_NAME } from '../../lib/constants';
import { getLocale } from '../../lib/i18n/useTranslation';
import { useAppSelector } from '../../store/hooks';
import apiClient from '../../lib/api/client';
import {
  Layers,
  CreditCard,
  HardDrive,
  FileText,
  Activity,
  ShieldCheck,
  ChevronDown,
  CheckCircle2,
  Terminal,
  ArrowRight,
  Clock
} from 'lucide-react';

const icons = [Layers, CreditCard, HardDrive, FileText, Activity, ShieldCheck];

const cardStyles = [
  {
    iconBg: "bg-pink-500/10 text-pink-400 border border-pink-500/20",
    hoverBorder: "hover:border-pink-500/40 hover:shadow-pink-500/5",
    glow: "from-pink-500/10 to-rose-500/10",
    accentBg: "group-hover:bg-pink-500/20"
  },
  {
    iconBg: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
    hoverBorder: "hover:border-indigo-500/40 hover:shadow-indigo-500/5",
    glow: "from-indigo-500/10 to-purple-500/10",
    accentBg: "group-hover:bg-indigo-500/20"
  },
  {
    iconBg: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
    hoverBorder: "hover:border-cyan-500/40 hover:shadow-cyan-500/5",
    glow: "from-cyan-500/10 to-blue-500/10",
    accentBg: "group-hover:bg-cyan-500/20"
  },
  {
    iconBg: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    hoverBorder: "hover:border-purple-500/40 hover:shadow-purple-500/5",
    glow: "from-purple-500/10 to-pink-500/10",
    accentBg: "group-hover:bg-purple-500/20"
  },
  {
    iconBg: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    hoverBorder: "hover:border-blue-500/40 hover:shadow-blue-500/5",
    glow: "from-blue-500/10 to-indigo-500/10",
    accentBg: "group-hover:bg-blue-500/20"
  },
  {
    iconBg: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    hoverBorder: "hover:border-emerald-500/40 hover:shadow-emerald-500/5",
    glow: "from-emerald-500/10 to-teal-500/10",
    accentBg: "group-hover:bg-emerald-500/20"
  }
];

export default function LandingClient({ locale }: { locale: string }) {
  const [activeLocale, setActiveLocale] = useState(locale);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [courses, setCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
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
        console.error('Failed to fetch courses', err);
      } finally {
        setLoadingCourses(false);
      }
    };

    loadCourses();
  }, []);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % t.home.testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + t.home.testimonials.length) % t.home.testimonials.length);
  };

  const normalizedLocale = activeLocale === 'kz' ? 'kk' : activeLocale;
  const t = getDictionary(normalizedLocale);

  const localT = {
    contributionTitle: {
      ru: 'Наш вклад в развитие IT-кадров Казахстана',
      en: 'Our contribution to the development of IT talent in Kazakhstan',
      kk: 'Қазақстанның IT-мамандарын дамытуға қосқан үлесіміз'
    },
    incubatorTitle: {
      ru: 'Инкубатор стартапов для студентов',
      en: 'Startup incubator for students',
      kk: 'Студенттерге арналған стартап инкубаторы'
    },
    incubatorDesc: {
      ru: 'Помогаем запустить собственный IT-продукт, консультируем по архитектуре и даем гранты на облачную инфраструктуру.',
      en: 'We help launch your own IT product, consult on architecture, and provide grants for cloud infrastructure.',
      kk: 'Жеке IT өніміңізді іске қосуға көмектесеміз, архитектура бойынша кеңес береміз және бұлттық инфрақұрылымға гранттар береміз.'
    },
    applyBtn: {
      ru: 'Подать заявку',
      en: 'Apply now',
      kk: 'Өтінім беру'
    },
    recommendationsTitle: {
      ru: 'Рекомендации в Astana Hub',
      en: 'Recommendations to Astana Hub',
      kk: 'Astana Hub-қа ұсыныстар'
    },
    recommendationsDesc: {
      ru: 'Отправляем резюме лучших студентов напрямую HR-директорам ведущих продуктовых и сервисных IT-компаний РК.',
      en: 'We send the resumes of our top students directly to the HR directors of leading product and service IT companies in Kazakhstan.',
      kk: 'Үздік студенттердің түйіндемелерін Қазақстанның жетекші өнімдік және сервистік IT компанияларының HR директордарына тікелей жібереміз.'
    },
    partnershipLink: {
      ru: 'Подробнее о партнерстве',
      en: 'Read more about partnership',
      kk: 'Серіктестік туралы толығырақ'
    },
    alihan: {
      ru: 'Алихан: Создал pull request для главной страницы',
      en: 'Alikhan: Created a pull request for the home page',
      kk: 'Әлихан: Басты бетке pull request жасады'
    },
    curator: {
      ru: 'Куратор:',
      en: 'Curator:',
      kk: 'Куратор:'
    },
    curatorComment: {
      ru: '"Отличный рефакторинг! Сливаю."',
      en: '"Great refactoring! Merging now."',
      kk: '"Керемет рефакторинг! Біріктіремін."'
    },
    aibek: {
      ru: 'Айбек Сериков',
      en: 'Aibek Serikov',
      kk: 'Айбек Серіков'
    },
    resumeStatus: {
      ru: 'Резюме одобрено',
      en: 'Resume Approved',
      kk: 'Түйіндеме мақұлданды'
    },
    resumeOk: {
      ru: 'Анализ резюме: OK',
      en: 'Resume Analysis: OK',
      kk: 'Түйіндеме талдауы: OK'
    },
    responses: {
      ru: '12 Откликов',
      en: '12 Responses',
      kk: '12 Жауап'
    },
    moreDetails: {
      ru: 'Подробнее о курсе',
      en: 'Course Details',
      kk: 'Курс туралы толығырақ'
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "QAllCert",
    "url": "https://qallcert.kz",
    "logo": "https://qallcert.kz/logo.png",
    "description": "Официальные аккредитованные курсы повышения квалификации для учителей и педагогов Казахстана (80-86 академических часов).",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Almaty",
      "addressRegion": "Almaty Region",
      "addressCountry": "KZ"
    },
    "areaServed": [
      { "@type": "City", "name": "Almaty" },
      { "@type": "City", "name": "Astana" },
      { "@type": "City", "name": "Shymkent" },
      { "@type": "City", "name": "Karaganda" },
      { "@type": "City", "name": "Aktobe" },
      { "@type": "City", "name": "Taraz" }
    ]
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-slate-50 relative overflow-hidden pt-16 animate-fade-in">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Stripe-like Skewed Gradient Canvas (Screenshot 2 style) */}
      <div className="absolute inset-x-0 top-0 h-[820px] overflow-hidden -skew-y-6 origin-top-left -z-10 bg-slate-50">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#f6f9fc] via-[#eef2f7] to-[#f6f9fc]" />
        <div className="absolute top-[-30%] left-[-15%] w-[130%] h-[100%] bg-gradient-to-r from-orange-400 via-pink-500 to-indigo-600 opacity-20 blur-3xl transform rotate-3" />
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[55%] bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 opacity-25 -skew-y-3" />
        <div className="absolute top-[-25%] right-[-10%] w-[70%] h-[70%] bg-gradient-to-bl from-yellow-300 via-pink-400 to-purple-600 opacity-20 blur-3xl rounded-full" />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Hero Section */}
      <main className="z-10 text-center max-w-4xl px-4 py-24 space-y-8 mt-12 flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight animate-fade-in-up">
          {t.home.heroTitle} <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">{APP_NAME}</span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-100">
          {t.home.heroSubtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-fade-in-up animation-delay-200">
          <Link
            href="/login"
            className="inline-flex h-14 items-center justify-center rounded-full bg-indigo-600 px-8 text-base font-medium text-white shadow-lg transition-all duration-300 ease-in-out hover:bg-indigo-700 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 hover:shadow-indigo-600/25"
          >
            {t.home.ctaStart}
          </Link>
          <a
            href="#accreditation"
            className="inline-flex h-14 items-center justify-center rounded-full border border-slate-200/60 bg-white/80 backdrop-blur-sm px-8 text-base font-medium text-slate-700 shadow-sm transition-all duration-300 ease-in-out hover:bg-white hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 group"
          >
            {t.home.ctaDemo}
            <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
      </main>

      {/* Redesigned Dark Stats Section (Screenshot 1 style) */}
      <section className="w-full bg-[#0a2540] border-y border-indigo-950 text-white relative overflow-hidden py-24 px-4 mt-8">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-full blur-3xl opacity-40 pointer-events-none -z-10" />

        {/* Dynamic Network Node SVG line art */}
        <svg className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 opacity-25 text-indigo-400" viewBox="0 0 1000 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="500" cy="300" r="100" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="500" cy="300" r="200" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" />
          <circle cx="500" cy="300" r="300" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="500" cy="300" r="400" stroke="currentColor" strokeWidth="1" strokeDasharray="8 8" />
          <line x1="500" y1="300" x2="100" y2="100" stroke="currentColor" strokeWidth="1" />
          <line x1="500" y1="300" x2="300" y2="50" stroke="currentColor" strokeWidth="1.5" />
          <line x1="500" y1="300" x2="500" y2="0" stroke="currentColor" strokeWidth="2" />
          <line x1="500" y1="300" x2="700" y2="50" stroke="currentColor" strokeWidth="1.5" />
          <line x1="500" y1="300" x2="900" y2="100" stroke="currentColor" strokeWidth="1" />
          <circle cx="100" cy="100" r="4" fill="#6366f1" />
          <circle cx="300" cy="50" r="5" fill="#c084fc" />
          <circle cx="500" cy="0" r="6" fill="#818cf8" />
          <circle cx="700" cy="50" r="5" fill="#f472b6" />
          <circle cx="900" cy="100" r="4" fill="#22d3ee" />
        </svg>

        <div className="max-w-6xl mx-auto space-y-12 relative z-10">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
              {localT.contributionTitle[normalizedLocale as 'ru' | 'en' | 'kk'] || localT.contributionTitle.ru}
            </h2>
            <div className="w-16 h-1 bg-indigo-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8">
            {t.home.stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center text-center space-y-3 border-r border-indigo-900/40 last:border-0">
                <span className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">{stat.value}</span>
                <span className="text-sm md:text-base text-slate-400 font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* Official Accreditation Section */}
      <section id="accreditation" className="z-10 w-full max-w-6xl px-4 pt-20">
        <div className="bg-gradient-to-br from-white via-emerald-50/20 to-indigo-50/30 border border-emerald-200/80 rounded-3xl p-8 md:p-12 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="space-y-5 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t.accreditation?.badge || "Аккредиттелген ұйым"}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
              {t.accreditation?.title || "Официальный сертификат об аккредитации"}
            </h2>
            <p className="text-slate-600 leading-relaxed text-base md:text-lg">
              {t.accreditation?.subtitle || "Свидетельство об институциональной и программной аккредитации организации образования РК."}{" "}
              {t.accreditation?.validityNote || "Сертификаты официально учитываются аттестационными комиссиями управлений образования при присвоении квалификационных категорий."}
            </p>
            <div className="flex flex-wrap gap-3 text-xs font-semibold text-slate-700 pt-2">
              <span className="flex items-center gap-1.5 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                80–86 академиялық сағат
              </span>
              <span className="flex items-center gap-1.5 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Аттестаттауға 100% жарамды
              </span>
              <span className="flex items-center gap-1.5 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                QR-код арқылы онлайн тексеру
              </span>
            </div>
          </div>

          {/* PDF Document Card linking directly to official certificate */}
          <div className="w-full lg:w-92 shrink-0">
            <a
              href="/accreditation-certificate.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-slate-900 hover:bg-slate-800 text-white rounded-3xl p-6 transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 border border-slate-800"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-13 h-13 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-extrabold text-sm shrink-0">
                    PDF
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-100 text-sm group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {t.accreditation?.title || "Сертификат об аккредитации QALLCert"}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      1 страница • 638 КБ • CAAAE
                    </p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                  <ArrowRight className="w-4.5 h-4.5" />
                </div>
              </div>
              <div className="mt-5 pt-3.5 border-t border-slate-800 text-xs text-slate-400 text-left flex items-center justify-between">
                <span>{t.accreditation?.viewDoc || "Посмотреть документ"}</span>
                <span className="text-emerald-400 font-semibold">{t.accreditation?.docNumber || "№ 25/20КА0003"}</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Course Catalog Section */}
      <section className="z-10 w-full max-w-6xl px-4 py-24">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 animate-fade-in-up">{t.home.coursesTitle}</h2>
          <div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full" />
        </div>

        {loadingCourses ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(courses.length > 0 ? courses : t.home.courses).map((course, idx) => {
              const colors = [
                { border: "hover:border-indigo-500/40", shadow: "hover:shadow-indigo-500/5", badgeBg: "bg-indigo-50 text-indigo-700" },
                { border: "hover:border-pink-500/40", shadow: "hover:shadow-pink-500/5", badgeBg: "bg-pink-50 text-pink-700" },
                { border: "hover:border-cyan-500/40", shadow: "hover:shadow-cyan-500/5", badgeBg: "bg-cyan-50 text-cyan-700" }
              ][idx % 3];

              // Determine level, duration, and CTA labels dynamically or use fallback
              const isDbCourse = !!course.id;
              const level = isDbCourse
                ? (activeLocale === 'en' ? 'Course' : activeLocale === 'kz' ? 'Курс' : 'Курс')
                : course.level;
              const duration = isDbCourse
                ? (activeLocale === 'en' ? '3-6 months' : activeLocale === 'kz' ? '3-6 ай' : '3-6 месяцев')
                : course.duration;
              const price = isDbCourse ? Number(course.price) : 0;

              const fallbackSlugs = [
                'math-trigonometry-80h',
                'python-pedagog-80h',
                'steam-education-80h',
                'ai-education-86h'
              ];
              const slugIdentifier = course.slug || (course.id ? String(course.id) : fallbackSlugs[idx % fallbackSlugs.length]);
              const targetUrl = `/courses/${slugIdentifier}`;
              const ctaText = localT.moreDetails[normalizedLocale as 'ru' | 'en' | 'kk'] || localT.moreDetails.ru;

              return (
                <div
                  key={idx}
                  className={`bg-white border border-slate-200/60 rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${colors.border} ${colors.shadow}`}
                >
                  <div className="space-y-6">
                    <div className="flex gap-2.5">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${colors.badgeBg}`}>
                        {level}
                      </span>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {duration}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900">{course.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{course.description || course.desc}</p>
                  </div>

                  <div className="pt-8">
                    <Link
                      href={targetUrl}
                      className="inline-flex w-full items-center justify-center gap-2 h-12 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300"
                    >
                      {ctaText}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>



      {/* How It Works Roadmap Stepper Section */}
      <section className="z-10 w-full max-w-6xl px-4 py-24">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 animate-fade-in-up">{t.home.howItWorksTitle}</h2>
          <div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full" />
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-[52px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-indigo-500/10 via-purple-500/20 to-cyan-500/10 -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.home.howItWorks.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 group">
                <div className="w-24 h-24 rounded-3xl bg-white border border-slate-200/80 shadow-md flex items-center justify-center text-3xl font-extrabold text-indigo-600 transition-all duration-300 group-hover:scale-105 group-hover:border-indigo-500/30 group-hover:shadow-indigo-600/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10">{step.step}</span>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xl font-bold text-slate-800">{step.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-xs">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits (Bento Grid) — Refactored to Dark Themed Section with glowing gradients and visual UI mockups (Screenshot 3 style) */}
      <section className="w-full bg-gradient-to-b from-[#3435e0] via-[#1b1580] to-[#0a0733] border-y border-indigo-500/20 text-white relative overflow-hidden py-28 px-4 mt-12">
        {/* Particle burst / starburst SVG at the bottom center (Screenshot 2 style) */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[340px] pointer-events-none select-none opacity-90 z-0">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-[240px] bg-[radial-gradient(ellipse_at_bottom,rgba(165,180,252,0.35)_0%,rgba(99,102,241,0.12)_60%,transparent_100%)] rounded-full blur-xl" />
          <svg className="w-full h-full text-indigo-200/50" viewBox="0 0 1000 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            {Array.from({ length: 45 }).map((_, idx) => {
              const angleDeg = 15 + (idx * 150) / 44;
              const angleRad = (angleDeg * Math.PI) / 180;
              const length = 140 + (idx % 3) * 45 + (idx % 5) * 20;
              const xEnd = 500 + length * Math.cos(angleRad);
              const yEnd = 300 - length * Math.sin(angleRad);
              return (
                <g key={idx}>
                  <line
                    x1="500"
                    y1="300"
                    x2={xEnd}
                    y2={yEnd}
                    stroke="currentColor"
                    strokeWidth="0.8"
                    opacity={0.25 + (idx % 3) * 0.15}
                  />
                  <circle
                    cx={xEnd}
                    cy={yEnd}
                    r={1.2 + (idx % 2) * 0.8}
                    fill={idx % 3 === 0 ? "#ffffff" : idx % 2 === 0 ? "#a5b4fc" : "#818cf8"}
                    className="animate-pulse"
                    style={{ animationDelay: `${idx * 150}ms` }}
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Subtle, beautiful flowing background gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl opacity-40 pointer-events-none -z-10 animate-flowing-gradient bg-gradient-to-r" />

        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-100 animate-fade-in-up">
              {t.home.benefitsTitle}
            </h2>
            <div className="w-16 h-1 bg-indigo-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.home.benefits.map((benefit, i) => {
              const Icon = icons[i % icons.length];
              const style = cardStyles[i % cardStyles.length];
              const delays = ["animation-delay-100", "animation-delay-200", "animation-delay-300"];
              const delayClass = delays[i % 3];

              // Inline UI mockups to match Screenshot 3
              const renderVisualMockup = () => {
                switch (i) {
                  case 0: // Interactive coding
                    return (
                      <div className="w-full mt-4 bg-slate-950 border border-slate-800/80 rounded-xl overflow-hidden font-mono text-[10px] leading-normal text-slate-300 select-none">
                        <div className="bg-slate-900/60 px-3 py-1.5 border-b border-slate-800/80 flex items-center justify-between text-slate-500">
                          <span>solution.py</span>
                          <span className="text-[9px] bg-indigo-950 text-indigo-400 border border-indigo-900/40 px-1 rounded">Python</span>
                        </div>
                        <div className="p-3 space-y-1 text-left">
                          <div><span className="text-indigo-400">def</span> <span className="text-amber-300">fizzbuzz</span>(n):</div>
                          <div>&nbsp;&nbsp;&nbsp;&nbsp;r = <span className="text-rose-400">&quot;&quot;</span></div>
                          <div>&nbsp;&nbsp;&nbsp;&nbsp;r += <span className="text-rose-400">&quot;Fizz&quot;</span> <span className="text-indigo-400">if</span> n % <span className="text-cyan-400">3</span> == <span className="text-cyan-400">0</span> <span className="text-indigo-400">else</span> <span className="text-rose-400">&quot;&quot;</span></div>
                          <div className="pt-2 text-emerald-400 flex items-center gap-1.5">
                            <span>✓</span> <span>Test 1: fizzbuzz(15) == &quot;FizzBuzz&quot; passed!</span>
                          </div>
                        </div>
                      </div>
                    );
                  case 1: // Team Projects
                    return (
                      <div className="w-full mt-4 bg-slate-900/60 border border-slate-800/60 rounded-xl p-3 flex flex-col gap-2 font-sans text-xs text-left select-none">
                        <div className="flex items-center gap-2 border-b border-slate-800/50 pb-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="font-semibold text-slate-300">#project-chat</span>
                        </div>
                        <div className="flex gap-2">
                          <div className="w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center font-bold text-[9px] text-white">AS</div>
                          <div className="bg-slate-800/80 rounded-lg p-2 flex-grow">
                            <p className="text-[11px] text-slate-300 leading-normal">
                              {localT.alihan[normalizedLocale as 'ru' | 'en' | 'kk'] || localT.alihan.ru}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  case 2: // Code review
                    return (
                      <div className="w-full mt-4 flex items-center justify-between gap-4 p-3 bg-slate-950 border border-slate-800/80 rounded-xl font-mono text-[9px] select-none">
                        <svg className="w-14 h-10 text-slate-600 shrink-0" viewBox="0 0 60 40">
                          <path d="M10 20 H50" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
                          <path d="M20 20 C25 20, 25 32, 30 32 H45" stroke="#6366f1" strokeWidth="1.5" />
                          <circle cx="10" cy="20" r="3" fill="#ef4444" />
                          <circle cx="30" cy="32" r="3" fill="#6366f1" />
                          <circle cx="50" cy="20" r="3" fill="#22c55e" />
                        </svg>
                        <div className="flex-grow bg-slate-900/60 border border-slate-800/60 rounded p-1.5 text-left">
                          <span className="text-indigo-400 font-semibold">
                            {localT.curator[normalizedLocale as 'ru' | 'en' | 'kk'] || localT.curator.ru}
                          </span>
                          <p className="text-slate-300 text-[10px] leading-tight mt-0.5">
                            {localT.curatorComment[normalizedLocale as 'ru' | 'en' | 'kk'] || localT.curatorComment.ru}
                          </p>
                        </div>
                      </div>
                    );
                  case 3: // Shareable Certificates
                    return (
                      <div className="w-full mt-4 bg-slate-900/30 border border-slate-800/80 rounded-xl p-3 flex flex-col items-center justify-center relative overflow-hidden group/cert select-none">
                        <div className="w-full aspect-[16/10] bg-[#090d1a] border border-indigo-900/40 rounded p-2 flex flex-col justify-between text-center relative">
                          <div className="absolute top-1 right-1 w-6 h-6 rounded-full border border-indigo-500/20 bg-indigo-500/5 flex items-center justify-center text-[8px]">🏆</div>
                          <div className="text-[7px] tracking-wider text-indigo-400 font-bold uppercase">Certificate of Completion</div>
                          <div className="space-y-0.5">
                            <div className="text-[9px] font-bold text-white leading-tight">
                              {localT.aibek[normalizedLocale as 'ru' | 'en' | 'kk'] || localT.aibek.ru}
                            </div>
                            <div className="text-[6px] text-slate-400">Python Web Development Specialist</div>
                          </div>
                          <div className="text-[5px] text-slate-500 border-t border-slate-900 pt-0.5">ID: EDUTECH-89732-KZ</div>
                        </div>
                      </div>
                    );
                  case 4: // Github Portfolio
                    return (
                      <div className="w-full mt-4 bg-slate-950 border border-slate-800/80 rounded-xl p-3 flex flex-col gap-2 font-mono text-[9px] select-none">
                        <div className="text-slate-400 text-left">github.com/serik-almaty</div>
                        <div className="grid grid-cols-7 gap-1 w-full max-w-[160px] mx-auto pt-1">
                          {Array.from({ length: 28 }).map((_, idx) => {
                            const bg = ["bg-slate-800", "bg-emerald-950", "bg-emerald-800", "bg-emerald-500", "bg-emerald-300"][idx % 5];
                            return <div key={idx} className={`w-3.5 h-3.5 rounded-sm ${bg}`} />;
                          })}
                        </div>
                      </div>
                    );
                  case 5: // Career support
                    return (
                      <div className="w-full mt-4 bg-slate-900/60 border border-slate-800/60 rounded-xl p-3 flex flex-col gap-2.5 text-left font-sans select-none">
                        <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">
                          {localT.resumeStatus[normalizedLocale as 'ru' | 'en' | 'kk'] || localT.resumeStatus.ru}
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full w-[85%]" />
                        </div>
                        <div className="flex justify-between items-center text-[9px] text-slate-400">
                          <span>
                            {localT.resumeOk[normalizedLocale as 'ru' | 'en' | 'kk'] || localT.resumeOk.ru}
                          </span>
                          <span className="text-emerald-400 font-bold">
                            {localT.responses[normalizedLocale as 'ru' | 'en' | 'kk'] || localT.responses.ru}
                          </span>
                        </div>
                      </div>
                    );
                  default:
                    return null;
                }
              };

              return (
                <div
                  key={i}
                  className={`group relative bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/80 rounded-3xl p-8 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/5 flex flex-col justify-between items-start gap-4 animate-fade-in-up ${delayClass} overflow-hidden`}
                >
                  <div className="w-full flex flex-col items-start gap-4">
                    {/* Subtle colorful back-glow inside card */}
                    <div className={`absolute inset-0 bg-gradient-to-tr ${style.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                    <div className={`p-3 rounded-2xl transition-colors duration-300 ${style.iconBg} ${style.accentBg}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-slate-100 relative z-10">{benefit.title}</h3>
                      <p className="text-slate-400 leading-relaxed text-sm relative z-10">{benefit.desc}</p>
                    </div>
                  </div>

                  {/* High Fidelity Visual Element */}
                  <div className="w-full relative z-10">
                    {renderVisualMockup()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Visual Horizontal Callout Cards (Screenshot 4 style) */}
      <section className="z-10 w-full max-w-6xl px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative bg-white border border-slate-200/60 rounded-3xl p-8 overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[220px]">
          <div className="absolute right-0 top-0 bottom-0 w-[40%] bg-gradient-to-tr from-pink-500 to-purple-600 opacity-10 -skew-x-12 origin-top-right transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute right-[-10%] top-[-10%] w-[180px] h-[180px] bg-gradient-to-tr from-pink-500 to-purple-600 opacity-20 blur-2xl rounded-full pointer-events-none" />

          <div className="space-y-4 max-w-[65%] text-left">
            <span className="text-xs font-extrabold uppercase tracking-widest text-pink-600">EduTech Incubator</span>
            <h3 className="text-2xl font-bold text-slate-900">
              {localT.incubatorTitle[normalizedLocale as 'ru' | 'en' | 'kk'] || localT.incubatorTitle.ru}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              {localT.incubatorDesc[normalizedLocale as 'ru' | 'en' | 'kk'] || localT.incubatorDesc.ru}
            </p>
          </div>
          <div className="pt-6 text-left">
            <Link href="/contacts" className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 group-hover:text-indigo-700">
              {localT.applyBtn[normalizedLocale as 'ru' | 'en' | 'kk'] || localT.applyBtn.ru} <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        <div className="relative bg-white border border-slate-200/60 rounded-3xl p-8 overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[220px]">
          <div className="absolute right-0 top-0 bottom-0 w-[40%] bg-gradient-to-tr from-yellow-400 to-orange-500 opacity-10 -skew-x-12 origin-top-right transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute right-[-10%] top-[-10%] w-[180px] h-[180px] bg-gradient-to-tr from-yellow-400 to-orange-500 opacity-20 blur-2xl rounded-full pointer-events-none" />

          <div className="space-y-4 max-w-[65%] text-left">
            <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600">Job Connections</span>
            <h3 className="text-2xl font-bold text-slate-900">
              {localT.recommendationsTitle[normalizedLocale as 'ru' | 'en' | 'kk'] || localT.recommendationsTitle.ru}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              {localT.recommendationsDesc[normalizedLocale as 'ru' | 'en' | 'kk'] || localT.recommendationsDesc.ru}
            </p>
          </div>
          <div className="pt-6 text-left">
            <Link href="/contacts" className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 group-hover:text-indigo-700">
              {localT.partnershipLink[normalizedLocale as 'ru' | 'en' | 'kk'] || localT.partnershipLink.ru} <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section — Refactored to dynamic reviews slider with moving gradient backdrop */}
      <section className="z-10 w-full max-w-4xl px-4 py-24 relative">
        {/* Flowing animated gradient banner behind reviews */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 rounded-[40px] blur-3xl opacity-60 pointer-events-none -z-10 animate-flowing-gradient bg-gradient-to-r" />

        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 animate-fade-in-up">{t.home.testimonialsTitle}</h2>
          <div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full" />
        </div>

        {/* Slider Card */}
        <div className="relative bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/40 flex flex-col md:flex-row items-center gap-8 min-h-[250px] animate-fade-in-up">
          {/* Decorative quote mark */}
          <span className="absolute top-4 left-6 text-slate-200/40 text-8xl font-serif font-bold select-none">&ldquo;</span>

          <div className="flex-grow space-y-6 relative z-10 text-left">
            <p className="text-xl text-slate-700 italic leading-relaxed">
              &quot;{t.home.testimonials[activeTestimonial].text}&quot;
            </p>
            <div>
              <p className="font-bold text-lg text-slate-900">{t.home.testimonials[activeTestimonial].author}</p>
              <p className="text-sm font-semibold text-indigo-600">{t.home.testimonials[activeTestimonial].location}</p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex md:flex-col items-center gap-3 shrink-0 self-end md:self-center">
            <button
              onClick={prevTestimonial}
              className="p-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm text-slate-600 hover:text-slate-900 focus:outline-none cursor-pointer"
              aria-label="Previous testimonial"
            >
              ←
            </button>
            <button
              onClick={nextTestimonial}
              className="p-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm text-slate-600 hover:text-slate-900 focus:outline-none cursor-pointer"
              aria-label="Next testimonial"
            >
              →
            </button>
          </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center items-center gap-2.5 mt-8">
          {t.home.testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveTestimonial(i)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${activeTestimonial === i ? 'w-8 bg-indigo-600' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Student FAQ Accordion Section */}
      <section className="z-10 w-full max-w-4xl px-4 py-24 mb-16">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 animate-fade-in-up">{t.home.studentFaqTitle}</h2>
          <div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full" />
        </div>

        <div className="space-y-4">
          {t.home.studentFaqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm"
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
                <p className="text-slate-600 leading-relaxed text-sm">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pre-footer CTA Block */}
      <section className="z-10 w-full max-w-6xl px-4 py-12 mb-16">
        <div className="bg-white border border-slate-200/60 rounded-3xl p-12 text-center relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[300px] bg-gradient-to-b from-indigo-500/5 to-transparent blur-2xl pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              {t.home.ctaTitle}
            </h2>
            <div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full" />
            
            <p className="text-slate-600 text-lg leading-relaxed pt-2">
              {t.home.ctaSubtitle}
            </p>
            <div className="pt-6">
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-indigo-600 px-8 text-sm font-semibold text-white shadow-md shadow-indigo-600/10 transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5"
              >
                {t.home.ctaButton}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
