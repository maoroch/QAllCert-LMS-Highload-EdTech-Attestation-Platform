'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, GraduationCap, ShieldCheck } from 'lucide-react';
import { getLocale } from '../../lib/i18n/useTranslation';
import { getDictionary } from '../../i18n/dictionaries';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { APP_NAME } from '../../lib/constants';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [locale, setLocale] = useState('ru');
  const pathname = usePathname();

  useEffect(() => {
    const currentLocale = getLocale();
    if (currentLocale) {
      setLocale(currentLocale);
    }
  }, []);

  const normalizedLocale = locale === 'kz' ? 'kk' : locale;
  const t = getDictionary(normalizedLocale);

  const navLinks = [
    { href: `/`, label: t.layout.nav.home, active: pathname === '/' },
    { href: `/features`, label: t.layout.nav.features, active: pathname === '/features' },
    { href: `/pricing`, label: t.layout.nav.pricing, active: pathname === '/pricing' },
    { href: `/blog`, label: locale === 'ru' ? 'Блог' : 'Мақалалар', active: pathname.startsWith('/blog') },
    { href: `/contacts`, label: t.layout.nav.contacts, active: pathname === '/contacts' },
  ];

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl">
      <header className={`bg-white/70 backdrop-blur-lg border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] transition-all duration-300 ${
        isOpen ? 'rounded-[2rem] px-6 py-4' : 'rounded-full px-6 py-2.5'
      }`}>
        <div className="flex items-center justify-between">
          {/* Logo & Accreditation Badge */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-1.5 bg-indigo-600 rounded-full text-white shadow-md shadow-indigo-600/10 group-hover:scale-105 transition-transform duration-300">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-slate-800 tracking-tight">
                {APP_NAME}
              </span>
            </Link>
            <a
              href="/accreditation-certificate.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold hover:bg-emerald-100 transition-colors"
              title="Институциональная аккредитация CAAAE № 25/20КА0003 (БИН 250240001104)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.accreditation?.badge || 'Аккредиттелген'}</span>
            </a>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-indigo-600 ${
                  link.active ? 'text-indigo-600 font-semibold' : 'text-slate-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <Link
              href="/login"
              className="bg-[#111827] hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-sm hover:shadow-md"
            >
              {t.layout.nav.login}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full text-slate-600 hover:bg-slate-100/50 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-slate-200/50 space-y-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    link.active
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200/50 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex justify-center items-center h-10 w-full rounded-full bg-[#111827] hover:bg-slate-800 text-xs font-semibold text-white shadow-md transition-all"
              >
                {t.layout.nav.login}
              </Link>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
