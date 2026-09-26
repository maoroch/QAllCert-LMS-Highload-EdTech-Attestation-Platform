'use client';

import { useState, useEffect } from 'react';
import { getDictionary } from '../../../i18n/dictionaries';
import { getLocale } from '../../../lib/i18n/useTranslation';
import { MapPin, Phone, Mail, Loader2 } from 'lucide-react';

export default function ContactsClient({ locale }: { locale: string }) {
  const [activeLocale, setActiveLocale] = useState(locale);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const currentLocale = getLocale();
    if (currentLocale && currentLocale !== activeLocale) {
      setActiveLocale(currentLocale);
    }
  }, []);

  const normalizedLocale = activeLocale === 'kz' ? 'kk' : activeLocale;
  const t = getDictionary(normalizedLocale);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-slate-50 relative overflow-hidden pt-36 pb-24">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-indigo-500/10 to-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <main className="z-10 w-full max-w-6xl px-4 grid grid-cols-1 md:grid-cols-2 gap-16">

        {/* Geo-Cards Info */}
        <div className="space-y-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">{t.contacts.officesTitle}</h1>
            <p className="text-lg text-slate-600">{t.seo.contacts.description}</p>
          </div>

          <div className="space-y-6">
            {t.contacts.offices.map((office, idx) => (
              <div key={idx} className="bg-white rounded-3xl border border-slate-200/60 p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:border-indigo-500/30">
                <h3 className="text-2xl font-bold text-slate-800 mb-6">{office.city}</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 text-slate-600">
                    <MapPin className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                    <span>{office.address}</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-600">
                    <Phone className="w-5 h-5 text-indigo-500 shrink-0" />
                    <span>{office.phone}</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-600">
                    <Mail className="w-5 h-5 text-indigo-500 shrink-0" />
                    <span>{office.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Form */}
        <div className="bg-white rounded-3xl border border-slate-200/60 p-8 shadow-xl shadow-slate-200/50">
          <h2 className="text-2xl font-bold text-slate-800 mb-8">{t.contacts.formTitle}</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-700">{t.contacts.formName}</label>
              <input
                id="name"
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Ivan Ivanov"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">{t.contacts.formEmail}</label>
              <input
                id="email"
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                placeholder="ivan@example.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-slate-700">{t.contacts.formMessage}</label>
              <textarea
                id="message"
                rows={4}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none"
                placeholder="Ваш вопрос..."
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 flex items-center justify-center rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                t.contacts.formSubmit
              )}
            </button>
          </form>
        </div>

      </main>
    </div>
  );
}
