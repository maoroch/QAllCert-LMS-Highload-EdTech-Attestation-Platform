'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Clock, 
  Video, 
  FileText, 
  Code, 
  ArrowRight,
  GraduationCap,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  Award,
  HelpCircle
} from 'lucide-react';
import { getLocale } from '../../../../lib/i18n/useTranslation';
import { getDictionary } from '../../../../i18n/dictionaries';

export interface LessonData {
  id: number;
  title: string;
  content_type: 'text' | 'video' | 'practice';
  order_index: number;
}

export interface ModuleData {
  module_id: number;
  module_title: string;
  is_final: boolean;
  lessons: LessonData[];
}

export interface CourseData {
  id: number | string;
  slug?: string;
  title: string;
  description: string;
  price: string | number;
  currency?: string;
  teacher_name?: string;
  hours?: number | string;
  target_audience?: string;
}

interface Props {
  initialCourse: CourseData;
  initialCurriculum: ModuleData[];
  courseIdentifier: string;
}

export default function CourseDetailsClient({ initialCourse, initialCurriculum, courseIdentifier }: Props) {
  const [course] = useState<CourseData>(initialCourse);
  const [curriculum] = useState<ModuleData[]>(initialCurriculum);
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>(() => {
    const expansions: Record<number, boolean> = {};
    initialCurriculum.forEach((mod) => {
      expansions[mod.module_id] = true;
    });
    return expansions;
  });
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [paymentMode, setPaymentMode] = useState<'installment' | 'full'>('installment');
  const [installmentMonths, setInstallmentMonths] = useState<3 | 6 | 12>(3);

  const activeLocale = getLocale() || 'kk';
  const normalizedLocale = activeLocale === 'kz' ? 'kk' : activeLocale;
  const t = getDictionary(normalizedLocale);

  const toggleModule = (modId: number) => {
    setExpandedModules(prev => ({
      ...prev,
      [modId]: !prev[modId]
    }));
  };

  const labels = {
    backToCatalog: {
      ru: '← Назад в каталог курсов',
      en: '← Back to Course Catalog',
      kk: '← Курстар каталогына оралу'
    },
    accreditedBadge: {
      ru: 'Официально аккредитованный курс РК',
      en: 'Officially Accredited Course in RK',
      kk: 'ҚР ресми аккредиттелген курсы'
    },
    hours: {
      ru: 'Академических часов',
      en: 'Academic Hours',
      kk: 'Академиялық сағат'
    },
    forAttestation: {
      ru: 'Сертификат для аттестации педагогов',
      en: 'Certificate for Teacher Attestation',
      kk: 'Педагогтарды аттестаттауға арналған'
    },
    buyBtn: {
      ru: 'Записаться и начать обучение',
      en: 'Enroll and Start Learning',
      kk: 'Тіркелу және оқуды бастау'
    },
    freeBtn: {
      ru: 'Начать бесплатно',
      en: 'Start for Free',
      kk: 'Тегін бастау'
    },
    curriculumTitle: {
      ru: 'Официальная программа курса',
      en: 'Official Course Curriculum',
      kk: 'Курстың ресми бағдарламасы'
    },
    certificatePreviewTitle: {
      ru: 'Образец верифицируемого сертификата',
      en: 'Sample Verifiable Certificate',
      kk: 'Тексерілетін ресми сертификат үлгісі'
    },
    certificateCheck: {
      ru: 'Проверить подлинность по QR-коду',
      en: 'Verify authenticity via QR code',
      kk: 'QR-код арқылы түпнұсқалығын тексеру'
    },
    faqTitle: {
      ru: 'Частые вопросы об аттестации и обучении',
      en: 'Frequently Asked Questions',
      kk: 'Аттестаттау және оқу бойынша жиі қойылатын сұрақтар'
    }
  };

  const getLabel = (key: keyof typeof labels) => {
    const section = labels[key] as any;
    return section[normalizedLocale] ?? section['kk'];
  };

  const hoursDisplay = course.hours || (course.title.includes('86') ? '86' : '80');
  const priceNum = Number(course.price) || (course.title.includes('86') ? 18000 : 15000);

  const teacherFaqs = [
    {
      q: normalizedLocale === 'ru' 
        ? 'Примет ли аттестационная комиссия этот сертификат?' 
        : 'Бұл сертификатты аттестаттау комиссиясы қабылдай ма?',
      a: normalizedLocale === 'ru'
        ? 'Да, обязательно. Платформа QAllCert имеет официальный сертификат об аккредитации организации образования. Программа содержит 80-86 академических часов, что полностью соответствует требованиям правил аттестации педагогических работников Республики Казахстан.'
        : 'Иә, міндетті түрде қабылдайды. QAllCert платформасы білім беру ұйымын аккредиттеу туралы ресми сертификатқа ие. Курс бағдарламасы 80-86 академиялық сағатты құрайды, бұл Қазақстан Республикасының педагог қызметкерлерін аттестаттау ережелерінің талаптарына толық сәйкес келеді.'
    },
    {
      q: normalizedLocale === 'ru'
        ? 'Как проходит обучение и сдача итогового теста?'
        : 'Оқыту және қорытынды тест қалай өтеді?',
      a: normalizedLocale === 'ru'
        ? 'Обучение проходит дистанционно в онлайн-формате. Вы изучаете видеоуроки, методические материалы и практические задания в удобное время. В конце курса сдается итоговое онлайн-тестирование.'
        : 'Оқыту толығымен қашықтан онлайн форматта өтеді. Сіз бейнесабақтарды, әдістемелік материалдар мен практикалық тапсырмаларды өзіңізге ыңғайлы уақытта оқисыз. Курс соңында онлайн тестілеу тапсырылады.'
    },
    {
      q: normalizedLocale === 'ru'
        ? 'Как быстро выдается сертификат после завершения?'
        : 'Курс аяқталған соң сертификат қашан беріледі?',
      a: normalizedLocale === 'ru'
        ? 'Электронный сертификат с уникальным номером и защитным QR-кодом генерируется моментально в личном кабинете сразу после успешной сдачи теста. Его можно скачать в PDF и прикрепить к аттестационному портфолио.'
        : 'Бірегей нөмірі мен қорғалған QR-коды бар электронды сертификат тестті сәтті тапсырғаннан кейін бірден жеке кабинетте дайын болады. Оны PDF форматында жүктеп алып, аттестациялық портфолиоға бірден тіркеуге болады.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-gradient-to-b from-indigo-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12 relative z-10">
        {/* Back Link */}
        <div className="text-left">
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            {getLabel('backToCatalog')}
          </Link>
        </div>

        {/* Hero Course Details Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 md:p-12 shadow-sm flex flex-col lg:flex-row justify-between gap-10 items-start">
          <div className="space-y-6 max-w-2xl text-left">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                {getLabel('accreditedBadge')}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                QAllCert 2026
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {course.title}
            </h1>

            <p className="text-slate-600 text-base md:text-lg leading-relaxed">
              {course.description}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-2 text-slate-700 text-sm font-semibold bg-slate-100/80 border border-slate-200/60 px-3.5 py-1.5 rounded-xl">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>{hoursDisplay} {getLabel('hours')}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700 text-sm font-semibold bg-emerald-50 border border-emerald-200/60 px-3.5 py-1.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{getLabel('forAttestation')}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 text-sm font-semibold bg-slate-100/80 border border-slate-200/60 px-3.5 py-1.5 rounded-xl">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>{course.teacher_name || 'QAllCert Академиялық кеңесі'}</span>
              </div>
            </div>
          </div>

          {/* Pricing & Installment Calculator Box */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 w-full lg:w-88 space-y-6 flex flex-col justify-between shrink-0 shadow-xl border border-slate-800">
            <div className="space-y-4 text-left">
              {/* Payment Mode Selector */}
              <div className="flex rounded-xl bg-slate-800/90 p-1 border border-slate-700/60 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setPaymentMode('installment')}
                  className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                    paymentMode === 'installment'
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {normalizedLocale === 'ru' ? 'В рассрочку 0-0-12' : 'Бөліп төлеу 0-0-12'}
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode('full')}
                  className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                    paymentMode === 'full'
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {normalizedLocale === 'ru' ? 'Единоразово' : 'Бірден төлеу'}
                </button>
              </div>

              {/* Price Calculations */}
              {paymentMode === 'installment' ? (
                <div className="space-y-3">
                  <div>
                    <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">
                      {normalizedLocale === 'ru' ? 'Ежемесячный платеж (0% переплат)' : 'Ай сайынғы төлем (0% артық төлемсіз)'}
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl sm:text-4xl font-black text-white">
                        {Math.round(priceNum / installmentMonths).toLocaleString()}
                      </span>
                      <span className="text-emerald-400 font-bold text-base sm:text-lg">
                        KZT / {normalizedLocale === 'ru' ? 'мес' : 'ай'}
                      </span>
                    </div>
                  </div>

                  {/* Installment Term Selector */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {([3, 6, 12] as const).map((months) => (
                      <button
                        key={months}
                        type="button"
                        onClick={() => setInstallmentMonths(months)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                          installmentMonths === months
                            ? 'bg-indigo-600/40 border-indigo-400 text-white shadow-inner'
                            : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {months} {normalizedLocale === 'ru' ? 'мес' : 'ай'}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 rounded-lg px-2.5 py-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {normalizedLocale === 'ru'
                        ? `Kaspi Red / Рассрочка: общая сумма ${priceNum.toLocaleString()} KZT`
                        : `Kaspi Red / Бөліп төлеу: жалпы сомасы ${priceNum.toLocaleString()} KZT`}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">
                    {normalizedLocale === 'ru' ? 'Полная стоимость обучения' : 'Толық оқу құны'}
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl sm:text-4xl font-black text-white">{priceNum.toLocaleString()}</span>
                    <span className="text-emerald-400 font-bold text-base sm:text-lg">KZT</span>
                  </div>
                  <p className="text-xs text-slate-400 pt-1 leading-normal">
                    {normalizedLocale === 'ru' 
                      ? 'Официальный сертификат включен в стоимость. Доступ к материалам навсегда.'
                      : 'Ресми сертификат бағаға кіреді. Оқу материалдарына қолжетімділік шексіз сақталады.'}
                  </p>
                </div>
              )}

              {/* Supported Payment Badges */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <span className="text-[11px] text-slate-400 block font-medium">
                  {normalizedLocale === 'ru' ? 'Поддерживаемые способы оплаты:' : 'Қолжетімді төлем түрлері:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/50">
                    Kaspi QR / Red
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                    Halyk Bank
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    Visa / Mastercard
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {normalizedLocale === 'ru' ? 'Счет для школы (ЭСФ)' : 'Мектепке шот-фактура'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                href="/login"
                className="flex w-full items-center justify-center gap-2 h-13 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                {getLabel('buyBtn')}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#accreditation-doc"
                className="block text-center text-xs text-slate-400 hover:text-white transition-colors py-1"
              >
                {normalizedLocale === 'ru' ? 'Посмотреть аккредитацию' : 'Аккредиттеу құжатын көру'}
              </a>
            </div>
          </div>
        </div>

        {/* Accreditation Document Reference Card */}
        <div id="accreditation-doc" className="bg-emerald-50/60 border border-emerald-200/80 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                {normalizedLocale === 'ru' ? 'Официальная институциональная аккредитация CAAAE' : 'CAAAE ресми институционалдық аккредитациясы'}
              </h3>
              <p className="text-sm text-slate-600 mt-0.5">
                {normalizedLocale === 'ru' 
                  ? 'Сертификат об аккредитации ТОО «QALLCert» № 25/20КА0003 (БИН 250240001104). Сертификат официально признается всеми отделами образования РК (РайОО / ГорОО).'
                  : '«QALLCert» ЖШС білім беру ұйымын аккредиттеу туралы № 25/20КА0003 куәлігі (БСН 250240001104). Сертификат барлық білім бөлімдерінде (Аудандық/Қалалық) жарамды.'}
              </p>
            </div>
          </div>
          <a
            href="/accreditation-certificate.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-all shrink-0"
          >
            <span>{normalizedLocale === 'ru' ? 'Посмотреть PDF аккредитации' : 'Аккредитация PDF көру'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Curriculum Section */}
        <div className="space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {getLabel('curriculumTitle')}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {normalizedLocale === 'ru' 
                  ? `Утвержденный учебно-тематический план курса на ${hoursDisplay} академических часов`
                  : `Курстың бекітілген ${hoursDisplay} академиялық сағаттық оқу-тақырыптық жоспары`}
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-3 py-1.5 rounded-full w-fit">
              {curriculum.length} {normalizedLocale === 'ru' ? 'модулей' : 'модуль'}
            </span>
          </div>

          <div className="space-y-4">
            {curriculum.map((mod, mIdx) => {
              const isExpanded = !!expandedModules[mod.module_id];
              return (
                <div key={mod.module_id || mIdx} className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs transition-all duration-200">
                  <button
                    onClick={() => toggleModule(mod.module_id)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-sm text-indigo-600 shrink-0">
                        {mIdx + 1}
                      </div>
                      <span className="font-bold text-slate-900 text-base md:text-lg">
                        {mod.module_title}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ${
                        isExpanded ? 'rotate-180 text-indigo-600' : ''
                      }`}
                    />
                  </button>

                  {/* Lessons list - always rendered in DOM for search engine crawlers */}
                  <div className={`border-t border-slate-100 divide-y divide-slate-100 bg-slate-50/40 ${isExpanded ? 'block' : 'hidden'}`}>
                    {mod.lessons && mod.lessons.length > 0 ? (
                      mod.lessons.map((lesson, lIdx) => {
                        const iconMap = {
                          video: <Video className="w-4 h-4 text-pink-500" />,
                          text: <FileText className="w-4 h-4 text-indigo-500" />,
                          practice: <Code className="w-4 h-4 text-emerald-500" />
                        };
                        const labelMap = {
                          video: normalizedLocale === 'ru' ? 'Видеосабак' : 'Бейнесабақ',
                          text: normalizedLocale === 'ru' ? 'Методика' : 'Теориялық материал',
                          practice: normalizedLocale === 'ru' ? 'Практика' : 'Практикалық тапсырма'
                        };
                        return (
                          <div key={lesson.id || lIdx} className="px-6 py-3.5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                              {iconMap[lesson.content_type]}
                              <span>{lesson.title}</span>
                            </div>
                            <span className="text-slate-400 text-[11px] font-semibold uppercase bg-white px-2 py-0.5 rounded-md border border-slate-200 shrink-0">
                              {labelMap[lesson.content_type]}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="px-6 py-4 text-slate-400 text-sm">Сабақтар кестесі дайындалуда</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Certificate Showcase Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 md:p-10 shadow-sm text-left space-y-6">
          <div className="flex items-center gap-3 text-emerald-600">
            <Award className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {getLabel('certificatePreviewTitle')}
            </h2>
          </div>
          
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-widest text-emerald-400 font-bold">QAllCert Official Verification</div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white">
                СЕРТИФИКАТ № KZ-2026-80H-XXXX
              </h3>
              <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
                {normalizedLocale === 'ru'
                  ? 'Сертификат содержит регистрационный номер, QR-код для моментальной онлайн-проверки на qallcert.kz, гербовую печать и подпись председателя комиссии.'
                  : 'Сертификатта тіркеу нөмірі, qallcert.kz сайтында лезде онлайн тексеруге арналған QR-код, ресми мөр мен комиссия төрағасының қолы көрсетіледі.'}
              </p>
            </div>

            <Link 
              href="/certificates/verify/KZ-2026-80H-DEMO"
              className="group/qr bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center shrink-0 transition-all duration-200"
              title={normalizedLocale === 'ru' ? 'Проверить пример в реестре' : 'Тізілімдегі үлгіні тексеру'}
            >
              <div className="w-20 h-20 bg-white rounded-lg p-2 mx-auto flex items-center justify-center text-slate-900 font-mono text-[9px] font-bold group-hover/qr:scale-105 transition-transform shadow-sm">
                [QR CODE]
              </div>
              <span className="text-[10px] text-emerald-400 group-hover/qr:text-white mt-2 block font-semibold">
                Тексеру үлгісі →
              </span>
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6 text-left">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {getLabel('faqTitle')}
            </h2>
          </div>

          <div className="space-y-3">
            {teacherFaqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-bold text-slate-900 text-base md:text-lg">
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${activeFaq === idx ? 'rotate-180 text-indigo-600' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <p className="mt-3 text-slate-600 text-sm md:text-base leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-indigo-600 text-white rounded-3xl p-8 sm:p-10 text-center space-y-4 shadow-xl shadow-indigo-600/10">
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            {normalizedLocale === 'ru' 
              ? 'Начните повышение квалификации уже сегодня' 
              : 'Біліктілікті арттыру курсын бүгін бастаңыз'}
          </h2>
          <p className="text-indigo-100 max-w-xl mx-auto text-sm sm:text-base">
            {normalizedLocale === 'ru'
              ? 'Официальный сертификат установленного образца для подтверждения или повышения квалификационной категории педагога.'
              : 'Педагогтың біліктілік санатын растау немесе көтеруге арналған бекітілген үлгідегі ресми сертификат.'}
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-indigo-950 hover:bg-slate-100 rounded-full font-bold shadow-md transition-all duration-300"
            >
              <span>{getLabel('buyBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
