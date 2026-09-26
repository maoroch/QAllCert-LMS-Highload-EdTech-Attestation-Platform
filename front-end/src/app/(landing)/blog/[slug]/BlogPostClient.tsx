'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  Tag, 
  Award, 
  ShieldCheck, 
  Share2, 
  BookOpen,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { BlogPost } from '../../../../data/blog';
import { CourseInfo } from '../../../../data/courses';
import { getLocale } from '../../../../lib/i18n/useTranslation';

interface BlogPostClientProps {
  post: BlogPost;
  leadCourse?: CourseInfo;
  relatedPosts: BlogPost[];
}

export default function BlogPostClient({ post, leadCourse, relatedPosts }: BlogPostClientProps) {
  const [locale, setLocale] = useState<'kk' | 'ru' | 'en'>('kk');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const detected = getLocale();
    if (detected === 'ru' || detected === 'en') {
      setLocale(detected);
    } else {
      setLocale('kk');
    }
  }, []);

  const lang = locale === 'ru' ? 'ru' : 'kk';

  const title = post.title[lang] || post.title.kk;
  const description = post.description[lang] || post.description.kk;
  const content = post.content[lang] || post.content.kk;
  const category = post.category[lang] || post.category.kk;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const t = {
    kk: {
      backBtn: 'Барлық мақалаларға оралу',
      published: 'Жарияланған күні:',
      readingTime: 'Оқу уақыты:',
      authorTitle: 'Мақала авторы:',
      shareBtn: copied ? 'Сілтеме көшірілді!' : 'Мақаламен бөлісу',
      leadBadge: 'Ұсынылатын ресми курс (80/86 сағат)',
      leadTitle: 'Аттестаттауға арналған сертификат қажет пе?',
      leadSub: 'Осы тақырып бойынша аккредиттелген бағдарламаны өтіп, ресми QR-кодты сертификат алыңыз.',
      hours: 'академиялық сағат',
      enrollCourse: 'Бағдарламамен танысу',
      kaspiBadge: 'Kaspi Red / 0-0-12',
      relatedTitle: 'Тақырыпқа сай басқа мақалалар'
    },
    ru: {
      backBtn: 'Вернуться к списку статей',
      published: 'Дата публикации:',
      readingTime: 'Время чтения:',
      authorTitle: 'Автор статьи:',
      shareBtn: copied ? 'Ссылка скопирована!' : 'Поделиться статьей',
      leadBadge: 'Рекомендуемый официальный курс (80/86 ч.)',
      leadTitle: 'Готовитесь к аттестации педагогов?',
      leadSub: 'Пройдите аккредитованный курс по данной теме и получите официальный сертификат с QR-кодом для аттестационной комиссии.',
      hours: 'академических часов',
      enrollCourse: 'Узнать больше о курсе',
      kaspiBadge: 'Kaspi Red / 0-0-12',
      relatedTitle: 'Читайте также по этой теме'
    }
  }[lang];

  return (
    <article className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Article Header */}
      <header className="relative pt-12 pb-12 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb / Back */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.backBtn}</span>
            </Link>

            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/50">
              {category}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6 font-display">
            {title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6">
            {description}
          </p>

          {/* Metadata bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-100 text-xs sm:text-sm text-slate-500">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                {post.author.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{post.author.name}</p>
                <p className="text-xs text-slate-400">{post.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                {post.publishedAt}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                {post.readingTime}
              </span>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium transition-colors text-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{t.shareBtn}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Article Markdown */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200/80 shadow-sm prose prose-slate max-w-none prose-headings:font-display prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-p:leading-relaxed prose-li:my-1">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>

            {/* Embedded In-Article Lead Magnet */}
            {leadCourse && (
              <div className="mt-10 bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <Award className="w-3.5 h-3.5" />
                    <span>{leadCourse.hours} {t.hours}</span>
                  </span>
                  <span className="text-xs font-bold bg-rose-500/20 text-rose-300 px-2.5 py-1 rounded-full border border-rose-500/30">
                    {t.kaspiBadge}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold mb-2">
                  {leadCourse.title}
                </h3>

                <p className="text-xs sm:text-sm text-indigo-200 mb-6 leading-relaxed">
                  {t.leadSub}
                </p>

                <div className="pt-4 border-t border-indigo-700/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-indigo-300 block">Бағасы:</span>
                    <span className="text-xl sm:text-2xl font-extrabold text-white">
                      {leadCourse.price.toLocaleString('kk-KZ')} ₸
                    </span>
                  </div>

                  <Link
                    href={`/courses/${leadCourse.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-white text-indigo-900 hover:bg-indigo-50 shadow-md transition-all"
                  >
                    <span>{t.enrollCourse}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                Тегтер:
              </span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-slate-200/80 text-slate-700 px-3 py-1 rounded-lg"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Sticky Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {leadCourse && (
              <div className="bg-white border border-indigo-200 rounded-2xl p-6 shadow-sm sticky top-24">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-2">
                  {t.leadBadge}
                </span>
                <h4 className="font-bold text-slate-900 text-sm mb-3">
                  {leadCourse.title}
                </h4>
                <div className="space-y-2 text-xs text-slate-600 mb-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>CAAAE ресми аккредитациясы (№ 25/20КА0003)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Аттестаттауға 100% жарамды ({leadCourse.hours} сағат)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Kaspi бөліп төлеу қарастырылған</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl mb-4 text-center">
                  <span className="text-xs text-slate-400 block">Оқу құны</span>
                  <span className="text-xl font-bold text-slate-900">
                    {leadCourse.price.toLocaleString('kk-KZ')} ₸
                  </span>
                </div>

                <Link
                  href={`/courses/${leadCourse.slug}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all text-center"
                >
                  <span>{t.enrollCourse}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </aside>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-10 border-t border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-6">
              {t.relatedTitle}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((r) => (
                <div 
                  key={r.slug}
                  className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-300 transition-all"
                >
                  <span className="text-xs text-indigo-600 font-semibold mb-2 block">
                    {r.category[lang] || r.category.kk}
                  </span>
                  <h4 className="font-bold text-slate-900 hover:text-indigo-600 transition-colors mb-2">
                    <Link href={`/blog/${r.slug}`}>
                      {r.title[lang] || r.title.kk}
                    </Link>
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {r.description[lang] || r.description.kk}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
