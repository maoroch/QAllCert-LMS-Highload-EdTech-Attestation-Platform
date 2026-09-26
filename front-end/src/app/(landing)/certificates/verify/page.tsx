'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Search, 
  QrCode, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Building2 
} from 'lucide-react';
import { APP_NAME } from '../../../../lib/constants';

export default function CertificateVerifySearchPage() {
  const [code, setCode] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    router.push(`/certificates/verify/${encodeURIComponent(code.trim().toUpperCase())}`);
  };

  const sampleCodes = [
    'KZ-2026-80H-DEMO',
    'KZ-2026-86H-DEMO'
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-24 px-4 sm:px-6 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[450px] bg-gradient-to-b from-indigo-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full mx-auto space-y-10 relative z-10 text-center">
        {/* Back Link */}
        <div className="text-left">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            ← Басты бетке қайту
          </Link>
        </div>

        {/* Heading */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Ресми мемлекеттік тіркеу базасы
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Сертификаттың түпнұсқалығын тексеру
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            {APP_NAME} білім беру ұйымы берген 80 және 86 сағаттық біліктілікті арттыру сертификаттарының түпнұсқалығын онлайн тексеріңіз.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-lg shadow-slate-200/40 text-left space-y-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <label htmlFor="certCode" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Сертификаттың бірегей нөмірін немесе кодын енгізіңіз
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="certCode"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Мысалы: KZ-2026-80H-DEMO"
                  className="w-full pl-12 pr-4 h-13 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-mono text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all uppercase"
                  required
                />
              </div>
              <button
                type="submit"
                className="h-13 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5 cursor-pointer shrink-0"
              >
                <span>Тексеру</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Demo Test Buttons */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Үлгі нөмірлермен тексеру:</span>
            {sampleCodes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => router.push(`/certificates/verify/${s}`)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-mono font-semibold transition-colors cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Institutional Accreditation Trust Badge */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-6 text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">
                Институционалдық аккредитация куәлігі: № 25/20КА0003
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                Орталық Азия білім жүйесін аккредиттеу қауымдастығы (CAAAE) • БСН 250240001104
              </p>
            </div>
          </div>

          <a
            href="/accreditation-certificate.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shrink-0"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PDF ашу</span>
          </a>
        </div>
      </div>
    </div>
  );
}
