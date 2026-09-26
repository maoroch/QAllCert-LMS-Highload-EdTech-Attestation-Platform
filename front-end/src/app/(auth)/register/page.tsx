'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { registerUser, clearError } from '../../../store/auth/authSlice';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';

import { useTranslation } from '../../../lib/i18n/useTranslation';

export default function RegisterPage() {
  const { t, locale } = useTranslation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  
  const dispatch = useAppDispatch();
  const { isLoading, error, user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (error) dispatch(clearError());
    
    const resultAction = await dispatch(registerUser({ fullName, email, password, role, locale }));
    if (registerUser.fulfilled.match(resultAction)) {
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden">
      
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 z-10 relative bg-white/60 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/20 ">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold tracking-tight text-slate-900 ">
            {t('auth', 'register')}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 ">
            {t('auth', 'registerSubtitle')}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200 ">
              <div className="text-sm text-red-700 ">{error}</div>
            </div>
          )}
          
          <div className="space-y-4">
            <Input
              id="fullName"
              name="fullName"
              type="text"
              required
              label={t('auth', 'fullName')}
              placeholder="e.g. Jane Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
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
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              label={t('auth', 'password')}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <div className="pt-2">
              <label className="text-sm font-medium text-slate-700 block mb-2">
                {t('auth', 'role')}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`border rounded-lg p-3 text-center transition-colors ${
                    role === 'student' 
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ' 
                      : 'border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="block text-sm font-semibold">{t('auth', 'student')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`border rounded-lg p-3 text-center transition-colors ${
                    role === 'teacher' 
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ' 
                      : 'border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="block text-sm font-semibold">{t('auth', 'teacher')}</span>
                </button>
              </div>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              {t('auth', 'register')}
            </Button>
          </div>
        </form>
        
        <p className="text-center text-sm text-slate-600 ">
          {t('auth', 'haveAccount')}{' '}
          <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
            {t('auth', 'login')}
          </a>
        </p>
      </div>
    </div>
  );
}

