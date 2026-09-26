'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Tag, 
  Search,
  Sparkles,
  Award
} from 'lucide-react';
import { BlogPost } from '../../../data/blog';
import { getLocale } from '../../../lib/i18n/useTranslation';

interface BlogListClientProps {
  posts: BlogPost[];
}

export default function BlogListClient({ posts }: BlogListClientProps) {
  const [locale, setLocale] = useState<'kk' | 'ru' | 'en'>('kk');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const detected = getLocale();
    if (detected === 'ru' || detected === 'en') {
      setLocale(detected);
    } else {
      setLocale('kk');
    }
  }, []);

  const lang = locale === 'ru' ? 'ru' : 'kk';

  const t = {
    kk: {
      heroBadge: 'Мұғалімдерге арналған пайдалы мақалалар',
      heroTitle: 'Педагогикалық мақалалар және аттестаттау нұсқаулықтары',
      heroSub: 'ҚР педагогтарының біліктілігін арттыру, жаңа аттестаттау ережелері, сабақта жасанды интеллект қолдану және STEAM әдістемесі туралы сараптамалық материалдар.',
      searchPlaceholder: 'Мақалаларды немесе кілт сөздерді іздеу...',
      allCategories: 'Барлық тақырыптар',
      readMore: 'Толық оқу',
      minRead: 'оқу',
      authorPrefix: 'Авторы:'
    },
    ru: {
      heroBadge: 'Полезные статьи для педагогов',
      heroTitle: 'Методические статьи и гид по аттестации',
      heroSub: 'Экспертные материалы о повышении квалификации учителей в РК, правилах аттестации 2026, искусственном интеллекте на уроках и методике STEAM.',
      searchPlaceholder: 'Поиск статей по теме или ключевым словам...',
      allCategories: 'Все категории',
      readMore: 'Читать статью',
      minRead: 'чтения',
      authorPrefix: 'Автор:'
    }
  }[lang];

  // Extract unique categories
  const categories = Array.from(new Set(posts.map(p => p.category[lang] || p.category.kk)));

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const title = (post.title[lang] || post.title.kk).toLowerCase();
    const desc = (post.description[lang] || post.description.kk).toLowerCase();
    const cat = post.category[lang] || post.category.kk;
    const query = searchQuery.toLowerCase();

    const matchesCategory = selectedCategory === 'all' || cat === selectedCategory;
    const matchesSearch = !query || title.includes(query) || desc.includes(query);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Blog Hero */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-gradient-to-b from-indigo-900/10 via-slate-50 to-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 mb-4 shadow-sm">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>{t.heroBadge}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4 font-display">
            {t.heroTitle}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
            {t.heroSub}
          </p>

          {/* Search bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>
        </div>
      </section>

      {/* Categories & Posts Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {t.allCategories}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => {
            const title = post.title[lang] || post.title.kk;
            const desc = post.description[lang] || post.description.kk;
            const category = post.category[lang] || post.category.kk;

            return (
              <article 
                key={post.slug}
                className="flex flex-col bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
              >
                <div className="p-6 flex-1 flex flex-col">
                  {/* Category & Meta */}
                  <div className="flex items-center justify-between gap-2 mb-4 text-xs">
                    <span className="font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                      {category}
                    </span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readingTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-3 line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>
                      {title}
                    </Link>
                  </h2>

                  {/* Excerpt */}
                  <p className="text-sm text-slate-600 line-clamp-3 mb-6 flex-1 leading-relaxed">
                    {desc}
                  </p>

                  {/* Author & Read More */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="text-slate-500">
                      <span className="block font-medium text-slate-700">{post.author.name}</span>
                      <span>{post.publishedAt}</span>
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                      <span>{t.readMore}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
