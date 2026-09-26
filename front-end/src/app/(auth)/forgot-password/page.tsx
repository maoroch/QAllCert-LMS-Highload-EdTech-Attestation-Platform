'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { useTranslation } from '../../../lib/i18n/useTranslation';
import apiClient from '../../../lib/api/client';

export default function ForgotPasswordPage() {
  const { t, locale } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await apiClient.post('/auth/forgot-password', { email, locale });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || t('common', 'error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 z-10 relative bg-white/60 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/20">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold tracking-tight text-slate-900">
            {t('auth', 'forgotPasswordTitle')}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            {t('auth', 'forgotPasswordSubtitle')}
          </p>
        </div>

        {success ? (
          <div className="space-y-6">
            <div className="rounded-xl bg-emerald-50 p-6 border border-emerald-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600 text-2xl font-bold">✓</div>
              <p className="text-sm text-emerald-800 font-semibold">
                {t('auth', 'resetLinkSent')}
              </p>
            </div>
            <Button
              type="button"
              className="w-full"
              size="lg"
              onClick={() => router.push('/login')}
            >
              {t('auth', 'backToLogin')}
            </Button>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}
            <div className="space-y-4">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                label={t('auth', 'email')}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={loading}
              >
                {t('auth', 'sendResetLink')}
              </Button>
            </div>

            <p className="text-center text-sm text-slate-600">
              <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                {t('auth', 'backToLogin')}
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
