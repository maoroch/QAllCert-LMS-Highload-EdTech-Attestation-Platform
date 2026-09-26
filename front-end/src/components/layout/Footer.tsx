'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GraduationCap, MapPin, Phone, Mail } from 'lucide-react';
import { getLocale } from '../../lib/i18n/useTranslation';
import { getDictionary } from '../../i18n/dictionaries';
import { APP_NAME } from '../../lib/constants';

export default function Footer() {
  const [locale, setLocale] = useState('ru');

  useEffect(() => {
    const currentLocale = getLocale();
    if (currentLocale) {
      setLocale(currentLocale);
    }
  }, []);

  const normalizedLocale = locale === 'kz' ? 'kk' : locale;
  const t = getDictionary(normalizedLocale);

  return (
    <footer className="bg-white border-t border-slate-200/60 text-slate-600 py-16 relative overflow-hidden z-10">
      {/* Subtle bottom blur */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-48 bg-gradient-to-t from-indigo-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-600/10">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 font-display">
                {APP_NAME}
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              {t.layout.footer.desc}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">{t.layout.footer.company}</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a 
                  href="/accreditation-certificate.pdf" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors flex items-center gap-1.5"
                >
                  <span>Аккредитация CAAAE (№ 25/20КА0003)</span>
                </a>
              </li>
              <li>
                <Link href="/certificates/verify" className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                  Тексеру тізілімі (Верификация сертификатов)
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-indigo-600 transition-colors">
                  {locale === 'ru' ? 'Блог и статьи' : 'Мақалалар мен блог'}
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-indigo-600 transition-colors">
                  {t.layout.footer.features}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-indigo-600 transition-colors">
                  {t.layout.footer.pricing}
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="hover:text-indigo-600 transition-colors">
                  {t.layout.footer.contacts}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details / Offices */}
          <div className="space-y-4 md:col-span-2">
            <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">{t.layout.footer.offices}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              {t.contacts.offices.map((office, idx) => (
                <div key={idx} className="space-y-2">
                  <span className="font-semibold text-slate-700">{office.city}</span>
                  <div className="space-y-1.5 text-slate-500">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                      <span>{office.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span>{office.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span>{office.email}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Kazakhstan Regions Internal Links for Geo-SEO */}
        <div className="pt-8 border-t border-slate-200/60 pb-8">
          <p className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-3">
            {locale === 'ru' ? 'Курсы для учителей по регионам Казахстана (Аттестация 80-86 ч.):' : 'ҚР өңірлері бойынша мұғалімдерге арналған курстар (80-86 сағат):'}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
            <Link href="/city/shymkent" className="hover:text-indigo-600 transition-colors">Шымкент қаласы</Link>
            <span className="text-slate-300">•</span>
            <Link href="/city/turkestan" className="hover:text-indigo-600 transition-colors">Түркістан облысы</Link>
            <span className="text-slate-300">•</span>
            <Link href="/city/almaty" className="hover:text-indigo-600 transition-colors">Алматы қаласы және облысы</Link>
            <span className="text-slate-300">•</span>
            <Link href="/city/astana" className="hover:text-indigo-600 transition-colors">Астана қаласы және Ақмола облысы</Link>
            <span className="text-slate-300">•</span>
            <Link href="/city/taraz" className="hover:text-indigo-600 transition-colors">Тараз және Жамбыл облысы</Link>
            <span className="text-slate-300">•</span>
            <Link href="/city/karaganda" className="hover:text-indigo-600 transition-colors">Қарағанды облысы</Link>
            <span className="text-slate-300">•</span>
            <Link href="/city/aktobe" className="hover:text-indigo-600 transition-colors">Ақтөбе облысы</Link>
            <span className="text-slate-300">•</span>
            <Link href="/city/kyzylorda" className="hover:text-indigo-600 transition-colors">Қызылорда облысы</Link>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-8 border-t border-slate-200/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} {APP_NAME}. {t.layout.footer.rights}
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-indigo-600 transition-colors">
              {t.layout.footer.privacy}
            </Link>
            <Link href="/terms" className="hover:text-indigo-600 transition-colors">
              {t.layout.footer.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
