'use client';

import { useCallback } from 'react';
import { translations, Locale, TranslationKey, TranslationSubKey } from '@/src/lib/i18n/translations';

// Read locale from URL pathname first, then cookie, then localStorage, fallback to 'kk'
export function getLocale(): Locale {
    if (typeof window === 'undefined') return 'kk';

    // 1. URL Pathname detection (/kk, /ru, /en)
    const firstSegment = window.location.pathname.split('/').filter(Boolean)[0]?.toLowerCase();
    if (firstSegment === 'kk' || firstSegment === 'kz') return 'kk';
    if (firstSegment === 'ru') return 'ru';
    if (firstSegment === 'en') return 'en';

    // 2. Cookie detection
    const match = document.cookie.match(/(?:^|; )locale=([^;]*)/);
    if (match) {
        const c = decodeURIComponent(match[1]).toLowerCase();
        if (c === 'kk' || c === 'kz') return 'kk';
        if (c === 'ru') return 'ru';
        if (c === 'en') return 'en';
    }

    // 3. LocalStorage detection
    try {
        const stored = localStorage.getItem('locale')?.toLowerCase();
        if (stored === 'kk' || stored === 'kz') return 'kk';
        if (stored === 'ru') return 'ru';
        if (stored === 'en') return 'en';
    } catch {}

    return 'kk';
}

export function setLocale(locale: Locale) {
    if (typeof window === 'undefined') return;
    const normalized = (locale === 'kz' ? 'kk' : locale) as 'kk' | 'ru' | 'en';
    
    // Save to storage and cookie
    localStorage.setItem('locale', normalized);
    document.cookie = `locale=${normalized}; path=/; max-age=${60 * 60 * 24 * 365}`;

    // Switch URL seamlessly
    const pathname = window.location.pathname;
    const segments = pathname.split('/').filter(Boolean);
    const firstSegment = segments[0]?.toLowerCase();

    let newPath = '';
    if (firstSegment === 'kk' || firstSegment === 'ru' || firstSegment === 'en' || firstSegment === 'kz') {
        newPath = '/' + [normalized, ...segments.slice(1)].join('/');
    } else {
        newPath = `/${normalized}${pathname === '/' ? '' : pathname}`;
    }

    window.location.href = newPath;
}

// Hook: returns a t() function
export function useTranslation() {
    const locale = getLocale();
    const normalized = locale === 'kk' ? 'kz' : locale; // translations dictionary uses 'kz' for Kazakh

    const t = useCallback(
        <S extends TranslationKey>(
            section: S,
            key: TranslationSubKey<S>
        ): string => {
            const section_ = translations[section] as any;
            const entry = section_?.[key as string];
            if (!entry) return String(key);
            return entry[locale] ?? entry[normalized] ?? entry['kk'] ?? entry['en'] ?? String(key);
        },
        [locale, normalized]
    );

    return { t, locale };
}