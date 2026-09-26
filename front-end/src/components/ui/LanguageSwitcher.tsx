'use client';

import React, { useState, useRef, useEffect } from 'react';
import { LOCALES, Locale } from '../../lib/i18n/translations';
import { getLocale, setLocale } from '../../lib/i18n/useTranslation';
import { Globe, ChevronDown, Check } from 'lucide-react';

export function LanguageSwitcher() {
  const [current, setCurrent] = useState<Locale>('kk');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrent(getLocale());
  }, []);

  const normalizedCurrent = (current === 'kz' ? 'kk' : current) as 'kk' | 'ru' | 'en';
  const currentMeta = LOCALES.find((l) => l.code === normalizedCurrent) || LOCALES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center" ref={containerRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200/60 cursor-pointer"
        aria-label="Change language"
      >
        <span className="text-sm">{currentMeta.flag}</span>
        <span className="uppercase text-[11px] font-bold">{currentMeta.code}</span>
        <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 bg-white rounded-2xl shadow-xl ring-1 ring-slate-200/80 overflow-hidden min-w-[150px] p-1 space-y-0.5">
          {LOCALES.map((loc) => {
            const isActive = normalizedCurrent === loc.code;
            return (
              <button
                key={loc.code}
                onClick={() => {
                  setLocale(loc.code as Locale);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  isActive ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="text-base">{loc.flag}</span>
                <span>{loc.label}</span>
                {isActive && <Check className="w-4 h-4 ml-auto text-indigo-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}