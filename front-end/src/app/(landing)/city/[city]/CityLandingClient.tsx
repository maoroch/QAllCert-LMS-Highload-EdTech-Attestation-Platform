'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Award, 
  ShieldCheck, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  FileText, 
  Building2, 
  ArrowRight, 
  ExternalLink,
  ChevronDown,
  Sparkles,
  School,
  Wallet,
  Globe2
} from 'lucide-react';
import { RegionData, ALL_REGION_SLUGS, REGIONS } from '../../../../data/regions';
import { CourseInfo } from '../../../../data/courses';
import { getLocale } from '../../../../lib/i18n/useTranslation';

interface CityLandingClientProps {
  region: RegionData;
  courses: CourseInfo[];
  allRegions: Array<{ slug: string; name: string }>;
}

export default function CityLandingClient({ region, courses, allRegions }: CityLandingClientProps) {
  const [locale, setLocale] = useState<'kk' | 'ru' | 'en'>('kk');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const detected = getLocale();
    if (detected === 'ru' || detected === 'en') {
      setLocale(detected);
    } else {
      setLocale('kk');
    }
  }, []);

  const lang = locale;
  const regionName = region.names[lang] || region.names.kk;
  const regionTitle = region.regionTitle[lang] || region.regionTitle.kk;
  const departmentName = region.department[lang] || region.department.kk;
  const schoolsInfo = region.schoolsInfo[lang] || region.schoolsInfo.kk;
  const features = region.features[lang] || region.features.kk;
  const attestationNote = region.attestationNote[lang] || region.attestationNote.kk;

  const t = {
    kk: {
      badge: `📍 ${regionName} педагогтарына`,
      heroSub: `ҚР Оқу-ағарту министрлігінің талаптарына толық сай келетін ресми аккредиттелген 80 және 86 академиялық сағаттық біліктілікті арттыру курстары.`,
      viewCourses: 'Курстар каталогы',
      verifyBtn: 'Сертификатты тексеру',
      accreditationTitle: 'Ресми институционалдық аккредитация',
      accreditationSub: 'Орталық Азия білім жүйесін аккредиттеу қауымдастығы (CAAAE)',
      accreditationCert: 'Куәлік № 25/20КА0003 • БСН 250240001104',
      depNoticeTitle: 'Білім басқармасы талаптарына толық сәйкестік',
      depNoticeBody: `${departmentName} жанындағы аттестаттау комиссияларына кезекті және мерзімінен бұрын санат (педагог-модератор, педагог-сарапшы, педагог-зерттеуші, педагог-шебер) алуға құжат тапсыру үшін толық жарамды.`,
      schoolsCoverage: 'Өңірлік қамту:',
      coursesTitle: `${regionName} мұғалімдеріне арналған бағдарламалар`,
      coursesSub: 'Аттестаттау портфолиосына арналған ресми бағдарламалар (80–86 академиялық сағат)',
      hoursSuffix: 'акад. сағат',
      enrollBtn: 'Толық оқу бағдарламасы',
      kaspiBadge: 'Kaspi Red / 0-0-12',
      featuresTitle: 'Неліктен мұғалімдер QAllCert таңдайды?',
      trustCardTitle: 'Ресми аккредиттеу куәлігі',
      trustCardDesc: 'ТОО «QALLCert» аккредитация куәлігі мемлекеттік реестрде тіркелген. Құжаттың электрондық түпнұсқасын жүктеп көре аласыз.',
      openPdf: 'Куәлікті ашу (PDF)',
      otherRegions: 'Қазақстанның басқа өңірлері бойынша курстар:',
      faqTitle: 'Жиі қойылатын сұрақтар',
      ctaTitle: `${regionName} мектептерінде сабақ бересіз бе?`,
      ctaSub: 'Дәл қазір курсты таңдап, аттестаттауға арналған 80/86 сағаттық ресми сертификатты үйден шықпай алыңыз!',
      ctaBtn: 'Курс таңдау'
    },
    ru: {
      badge: `📍 Для педагогов: ${regionName}`,
      heroSub: `Официальные аккредитованные курсы повышения квалификации (80 и 86 академических часов), полностью соответствующие стандартам Министерства просвещения РК.`,
      viewCourses: 'Каталог программ',
      verifyBtn: 'Проверка сертификатов',
      accreditationTitle: 'Официальная институциональная аккредитация',
      accreditationSub: 'Центрально-Азиатская Ассоциация по аккредитации образования (CAAAE)',
      accreditationCert: 'Свидетельство № 25/20КА0003 • БИН 250240001104',
      depNoticeTitle: 'Соответствие правилам аттестации',
      depNoticeBody: `Сертификаты полностью принимаются аттестационными комиссиями при ${departmentName} для подтверждения и присвоения категорий (модератор, эксперт, исследователь, мастер).`,
      schoolsCoverage: 'Охват в регионе:',
      coursesTitle: `Программы обучения для педагогов (${regionName})`,
      coursesSub: 'Аккредитованные программы объемом 80–86 часов с выдачей официального сертификата с QR-кодом',
      hoursSuffix: 'акад. часов',
      enrollBtn: 'Подробнее о курсе',
      kaspiBadge: 'Kaspi Red / 0-0-12',
      featuresTitle: 'Преимущества дистанционного обучения в QAllCert',
      trustCardTitle: 'Свидетельство об аккредитации',
      trustCardDesc: 'ТОО «QALLCert» аккредитовано в официальном реестре CAAAE. Вы можете ознакомиться с оригиналом документа онлайн.',
      openPdf: 'Открыть сертификат (PDF)',
      otherRegions: 'Курсы повышения квалификации по другим регионам РК:',
      faqTitle: 'Часто задаваемые вопросы',
      ctaTitle: `Преподаете в организациях образования (${regionName})?`,
      ctaSub: 'Запишитесь на аккредитованный курс сегодня и получите легитимный сертификат для аттестации 100% дистанционно!',
      ctaBtn: 'Выбрать курс'
    },
    en: {
      badge: `📍 For Educators in ${regionName}`,
      heroSub: `Official accredited professional development courses (80 and 86 academic hours) compliant with Kazakhstan Ministry of Education standards.`,
      viewCourses: 'Course Catalog',
      verifyBtn: 'Verify Certificate',
      accreditationTitle: 'Official Institutional Accreditation',
      accreditationSub: 'Central Asian Association for Accreditation of Education (CAAAE)',
      accreditationCert: 'Certificate No. 25/20KA0003 • BIN 250240001104',
      depNoticeTitle: 'Full Regulatory Compliance',
      depNoticeBody: `Certificates are approved by attestation boards under the ${departmentName} for educator qualification upgrades.`,
      schoolsCoverage: 'Regional Coverage:',
      coursesTitle: `Accredited Programs for ${regionName}`,
      coursesSub: 'Official 80–86 academic hour curricula with digital QR-code verification',
      hoursSuffix: 'acad. hours',
      enrollBtn: 'Course Syllabus',
      kaspiBadge: 'Kaspi 0-0-12',
      featuresTitle: 'Why Teachers Choose QAllCert',
      trustCardTitle: 'Accreditation Certificate',
      trustCardDesc: 'QALLCert LLP is registered in the official CAAAE accreditation roster. View the certificate online.',
      openPdf: 'Open Certificate (PDF)',
      otherRegions: 'Teacher courses in other Kazakhstan regions:',
      faqTitle: 'Frequently Asked Questions',
      ctaTitle: `Teaching in ${regionName}?`,
      ctaSub: 'Enroll in accredited professional development courses today and earn recognized hours from anywhere!',
      ctaBtn: 'Explore Courses'
    }
  }[lang];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-indigo-900/10 via-slate-50 to-slate-50 border-b border-slate-200/80">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-br from-indigo-500/15 via-blue-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-indigo-600 transition-colors">Басты бет</Link>
            <span>/</span>
            <span className="text-slate-400">Өңірлер</span>
            <span>/</span>
            <span className="text-slate-800 font-semibold">{regionName}</span>
          </nav>

          <div className="max-w-3xl">
            {/* Geo Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 mb-6 shadow-sm">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span>{t.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6 font-display">
              {regionTitle}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8">
              {t.heroSub}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#courses"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all"
              >
                <span>{t.viewCourses}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/certificates/verify"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-sm transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{t.verifyBtn}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Accreditation Banner */}
      <section className="py-8 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-200/60">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Институционалдық аккредитация</p>
                <p className="text-sm font-bold text-slate-900">CAAAE (№ 25/20КА0003)</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-200/60">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Академиялық көлем</p>
                <p className="text-sm font-bold text-slate-900">80 және 86 сағаттық бағдарламалар</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600 border border-purple-200/60">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Заңды құжаттар</p>
                <p className="text-sm font-bold text-slate-900">ИС ЭСФ арқылы АВР және шот</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Department Compliance Card */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-indigo-50/80 via-white to-slate-50 border border-indigo-100 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-md shrink-0">
                <Building2 className="w-8 h-8" />
              </div>
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider px-2.5 py-0.5 bg-indigo-100 rounded-full">
                    {t.depNoticeTitle}
                  </span>
                  <span className="text-xs text-slate-500">
                    {t.schoolsCoverage} {schoolsInfo}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {departmentName}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {t.depNoticeBody}
                </p>
                <div className="p-4 bg-white rounded-xl border border-slate-200 text-sm text-slate-700 italic">
                  💡 {attestationNote}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Catalog Section */}
      <section id="courses" className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/50">
              80–86 сағат
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 mb-4">
              {t.coursesTitle}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              {t.coursesSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses.map((course) => (
              <div 
                key={course.slug}
                className="flex flex-col bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{course.hours} {t.hoursSuffix}</span>
                  </span>
                  <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200/60">
                    {t.kaspiBadge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-3 line-clamp-2">
                  <Link href={`/courses/${course.slug}`}>
                    {course.title}
                  </Link>
                </h3>

                <p className="text-sm text-slate-600 line-clamp-3 mb-6 flex-1">
                  {course.description}
                </p>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Курс құны:</span>
                    <span className="text-xl font-extrabold text-slate-900">{course.price.toLocaleString('kk-KZ')} ₸</span>
                  </div>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white transition-all shadow-sm"
                  >
                    <span>{t.enrollBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regional Advantages & Official Certificate */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Features list */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {t.featuresTitle}
              </h2>
              <ul className="space-y-4">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="p-1 bg-emerald-100 text-emerald-700 rounded-full mt-0.5 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-slate-700 text-sm sm:text-base leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Certificate Preview Card */}
            <div className="lg:col-span-5">
              <div className="bg-white border-2 border-indigo-200/80 rounded-2xl p-6 shadow-lg shadow-indigo-600/5 space-y-4 text-center">
                <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <Award className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {t.trustCardTitle}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t.trustCardDesc}
                </p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-600">
                  {t.accreditationCert}
                </div>
                <a
                  href="/accreditation-certificate.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-md"
                >
                  <FileText className="w-4 h-4" />
                  <span>{t.openPdf}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regional FAQ Accordion */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-center mb-8">
            {t.faqTitle}
          </h2>

          <div className="space-y-4">
            {region.faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              const qText = faq.question[lang] || faq.question.kk;
              const aText = faq.answer[lang] || faq.answer.kk;

              return (
                <div 
                  key={idx}
                  className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-900 hover:bg-slate-50 transition-colors gap-4"
                  >
                    <span>{qText}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {aText}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cross-linking to Other Regions */}
      <section className="py-12 bg-slate-100/60 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
            {t.otherRegions}
          </p>
          <div className="flex flex-wrap gap-2.5">
            {allRegions.map((r) => {
              const isCurrent = r.slug === region.slug;
              return (
                <Link
                  key={r.slug}
                  href={`/city/${r.slug}`}
                  className={`text-xs px-3.5 py-2 rounded-lg font-medium transition-all ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 border border-slate-200'
                  }`}
                >
                  {r.name}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Regional CTA */}
      <section className="py-16 bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 font-display">
            {t.ctaTitle}
          </h2>
          <p className="text-indigo-200 text-base sm:text-lg mb-8 leading-relaxed">
            {t.ctaSub}
          </p>
          <a
            href="#courses"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-white text-indigo-900 hover:bg-indigo-50 shadow-lg shadow-black/20 transition-all text-base"
          >
            <span>{t.ctaBtn}</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>
    </div>
  );
}
