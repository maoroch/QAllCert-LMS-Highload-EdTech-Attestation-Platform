'use client';

import { useState, useEffect } from 'react';
import { getDictionary } from '../../../i18n/dictionaries';
import { getLocale } from '../../../lib/i18n/useTranslation';
import {
  Code2,
  Sparkles,
  UserCheck,
  Flame,
  GitFork,
  Briefcase,
  Play,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const ICON_MAP = {
  sandbox: Code2,
  autograder: Sparkles,
  review: UserCheck,
  gamification: Flame,
  github: GitFork,
  career: Briefcase,
};

export default function FeaturesClient({ locale }: { locale: string }) {
  const [activeLocale, setActiveLocale] = useState(locale);
  const [code, setCode] = useState('');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'fail'>('idle');
  const [errorDetails, setErrorDetails] = useState('');

  useEffect(() => {
    const currentLocale = getLocale();
    if (currentLocale && currentLocale !== activeLocale) {
      setActiveLocale(currentLocale);
    }
  }, []);

  const normalizedLocale = activeLocale === 'kz' ? 'kk' : activeLocale;
  const t = getDictionary(normalizedLocale);

  // Set default code template when localized data is loaded
  useEffect(() => {
    setCode(t.features.editorPlaceholder);
  }, [activeLocale, t.features.editorPlaceholder]);

  const handleRunTests = () => {
    setTestStatus('testing');

    setTimeout(() => {
      try {
        // Simple evaluation to check if sum(a, b) returns correct sum
        // We look for function sum in the code block
        const cleanCode = code.replace(/function\s+sum\s*\(/, 'function _sum(');
        const evalFn = new Function('a', 'b', `
          ${cleanCode};
          if (typeof sum !== 'undefined') return sum(a, b);
          if (typeof _sum !== 'undefined') return _sum(a, b);
          throw new Error('Function sum is not defined');
        `);

        const result1 = evalFn(2, 3);
        const result2 = evalFn(-1, 5);

        if (result1 === 5 && result2 === 4) {
          setTestStatus('success');
          setErrorDetails('');
        } else {
          setTestStatus('fail');
          setErrorDetails(`sum(2, 3) returned ${result1} instead of 5`);
        }
      } catch (err: any) {
        setTestStatus('fail');
        setErrorDetails(err.message || 'Syntax Error');
      }
    }, 1200);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-slate-50 relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[10%] w-[300px] h-[300px] rounded-full bg-indigo-400 blur-[120px]" />
        <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-blue-300 blur-[150px]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 w-full max-w-5xl text-center mt-8 mb-20">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/50 mb-4 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          LMS for Students
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 mb-6 tracking-tight">
          {t.features.title}
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-slate-600 sm:text-xl font-normal leading-relaxed">
          {t.features.subtitle}
        </p>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
        {t.features.items.map((item) => {
          const Icon = ICON_MAP[item.id as keyof typeof ICON_MAP] || Code2;
          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200/60 p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/20 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-300">
                  <Icon className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              <ul className="space-y-2.5 pt-4 border-t border-slate-100">
                {item.details.map((detail, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs text-slate-500 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 group-hover:bg-indigo-500 transition-colors" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>
    </div>
  );
}
