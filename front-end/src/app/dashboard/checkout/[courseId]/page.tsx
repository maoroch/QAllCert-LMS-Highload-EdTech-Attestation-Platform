'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck, CreditCard, Lock, ArrowLeft,
  Loader2, BookOpen, ChevronRight, AlertCircle,
  GraduationCap, Award, MessageCircle, Smartphone, RefreshCw
} from 'lucide-react';
import { useAppSelector } from '@/src/store/hooks';
import apiClient from '@/src/lib/api/client';
import type { Course } from '@/src/types';
import { useTranslation } from '@/src/lib/i18n/useTranslation';

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount: number | null | undefined, currency: string) {
  if (amount == null) return '—';
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function CheckoutPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { t } = useTranslation();
  const { courseId: courseIdStr } = use(params);
  const courseId = parseInt(courseIdStr, 10);
  const router = useRouter();
  const { user } = useAppSelector((s) => s.auth);

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [initiating, setInitiating] = useState(false);
  const [error, setError] = useState('');
  const [alreadyOwned, setAlreadyOwned] = useState(false);

  // ── Guard: only students can access checkout ──────────────────────────────
  useEffect(() => {
    if (user && user.role !== 'student') {
      router.replace('/dashboard/courses');
    }
  }, [user, router]);

  // ── Load course details ───────────────────────────────────────────────────
  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    apiClient
      .get<Course>(`/courses/${courseId}`)
      .then(({ data }) => {
        setCourse(data);
        // If free course, redirect directly to enroll
        if (!data.price || Number(data.price) === 0) {
          router.replace(`/dashboard/courses/${courseId}`);
        }
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Course not found.');
      })
      .finally(() => setLoading(false));
  }, [courseId, router]);

  // ── Initiate Stripe Checkout ──────────────────────────────────────────────
  const handlePay = async () => {
    setInitiating(true);
    setError('');
    try {
      const { data } = await apiClient.post('/orders', {
        courseId,
        paymentProvider: 'stripe',
      });

      // Backend returns Stripe Checkout URL — redirect the browser there
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      // Fallback: should not happen, but handle gracefully
      setError('Failed to create payment session. Please try again.');
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.message || '';
      if (msg.toLowerCase().includes('already have access')) {
        setAlreadyOwned(true);
        return;
      }
      setError(msg || 'Failed to initiate payment. Please try again.');
    } finally {
      setInitiating(false);
    }
  };

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  // ── Already owns course ───────────────────────────────────────────────────
  if (alreadyOwned) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl ring-1 ring-slate-200 p-10 max-w-md w-full text-center space-y-5">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{t('checkout', 'alreadyOwnedTitle')}</h2>
          <p className="text-slate-500 text-sm">{t('checkout', 'alreadyOwnedDesc')}</p>
          <Link
            href={`/dashboard/courses/${courseId}`}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            <BookOpen className="w-4 h-4" /> {t('checkout', 'goToCourse')}
          </Link>
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (!course && error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <p className="text-slate-700 font-medium">{error}</p>
          <Link href="/dashboard/courses" className="text-indigo-600 hover:underline text-sm">
            ← {t('checkout', 'backToCourses')}
          </Link>
        </div>
      </div>
    );
  }

  if (!course) return null;

  const price = Number(course.price ?? 0);
  const currency = course.currency || 'USD';

  // ── Main checkout UI ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex items-start justify-center p-4 sm:p-8">
      <div className="w-full max-w-4xl space-y-6">

        {/* Back link */}
        <Link
          href={`/dashboard/courses/${courseId}`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {t('checkout', 'backToCourse')}
        </Link>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span>{t('checkout', 'courses')}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="truncate max-w-[200px]">{course.title}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-indigo-600 font-medium">{t('checkout', 'checkout')}</span>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── Left: order summary ──────────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-5">

            {/* Course card */}
            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
              <div className="relative h-40 sm:h-52 bg-gradient-to-br from-indigo-500 to-purple-700">
                {course.cover_url && (
                  <img
                    src={course.cover_url}
                    alt={course.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-xs text-white/70 uppercase tracking-wider font-medium mb-1">{t('checkout', 'course')}</p>
                  <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug line-clamp-2">
                    {course.title}
                  </h2>
                  {course.teacher_name && (
                    <p className="text-sm text-white/70 mt-1">{t('checkout', 'by')} {course.teacher_name}</p>
                  )}
                </div>
              </div>

              <div className="p-5 space-y-4">
                {course.description && (
                  <p className="text-sm text-slate-600 line-clamp-3">{course.description}</p>
                )}

                {/* Order line items */}
                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">{t('checkout', 'courseAccess')}</span>
                    <span className="font-medium text-slate-900">{formatCurrency(price, currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">{t('checkout', 'taxesAndFees')}</span>
                    <span className="text-slate-400">{t('checkout', 'calculatedAtCheckout')}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-slate-200 pt-4 flex justify-between">
                  <span className="text-base font-bold text-slate-900">{t('checkout', 'total')}</span>
                  <span className="text-base font-bold text-indigo-700">{formatCurrency(price, currency)}</span>
                </div>
              </div>
            </div>

            {/* What's included */}
            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">{t('checkout', 'whatsIncluded')}</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                {[
                  { text: t('checkout', 'included1'), Icon: GraduationCap },
                  { text: t('checkout', 'included2'), Icon: Award },
                  { text: t('checkout', 'included3'), Icon: MessageCircle },
                  { text: t('checkout', 'included4'), Icon: Smartphone },
                  { text: t('checkout', 'included5'), Icon: RefreshCw },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <item.Icon className="w-4 h-4 mt-0.5 flex-shrink-0 text-indigo-500" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Right: payment panel ─────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{t('checkout', 'completePurchase')}</h2>
                <p className="text-sm text-slate-500 mt-1">
                  {t('checkout', 'redirectingToStripe')}
                </p>
              </div>

              {/* Price callout */}
              <div className="rounded-xl bg-indigo-50 ring-1 ring-indigo-100 px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-medium text-indigo-700">{t('checkout', 'amountDueToday')}</span>
                <span className="text-xl font-extrabold text-indigo-700">{formatCurrency(price, currency)}</span>
              </div>

              {/* Error banner */}
              {error && (
                <div className="flex items-start gap-2.5 rounded-xl bg-red-50 ring-1 ring-red-200 px-4 py-3">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Pay button */}
              <button
                onClick={handlePay}
                disabled={initiating}
                className="w-full inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {initiating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('checkout', 'redirecting')}
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    {t('checkout', 'payWithStripe').replace('{amount}', formatCurrency(price, currency))}
                  </>
                )}
              </button>

              {/* Trust badges */}
              <div className="pt-2 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Lock className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>{t('checkout', 'securePayments')}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>{t('checkout', 'sslCompliant')}</span>
                </div>
              </div>

              {/* Stripe logo */}
              <div className="flex items-center justify-center gap-2 pt-1">
                <span className="text-xs text-slate-400">{t('checkout', 'poweredBy')}</span>
                <svg viewBox="0 0 60 25" className="h-5 text-slate-400 fill-current" aria-label="Stripe">
                  <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 01-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 2.98 5.96 7.14 0 .71-.07 1.33-.06 1.84zm-8.06-2.88h3.57c-.21-1.66-1.11-2.49-1.77-2.49-.73 0-1.62.7-1.8 2.49zm-9.78 5.7c0 1.3.98 2.07 2.37 2.07.51 0 1.11-.12 1.59-.32v3.38c-.7.29-1.61.44-2.59.44-2.99 0-5.12-1.66-5.12-5.43V6.49l4.75-1.07v2.49h3.97v3.54h-3.97v5.65zm-12.35 4.47H25.7V6h4.75V21.57zM25.7 2.16c0-1.38 1.11-2.5 2.53-2.5 1.44 0 2.5 1.1 2.5 2.5 0 1.42-1.06 2.49-2.5 2.49-1.42 0-2.53-1.08-2.53-2.5zM14.99 21.57v-3.35c-.6.3-1.49.49-2.42.49-2.53 0-4.38-1.75-4.38-4.77V6h4.73v8.64c0 1.08.59 1.6 1.35 1.6.49 0 .9-.11 1.22-.29v5.62h-.5zm-10.23.9c-1.55 0-2.87-.52-3.87-1.42L0 24.53c1.01.87 2.54 1.47 4.52 1.47 3.52 0 5.48-1.62 5.48-4.44 0-2.41-1.55-3.67-4.05-4.36-1.4-.38-2.01-.68-2.01-1.35 0-.57.55-.92 1.4-.92 1.01 0 2.01.43 2.83 1.01l.9-3.09c-.99-.7-2.32-1.14-3.91-1.14C2.3 11.71 0 13.23 0 16.09c0 2.27 1.52 3.64 4 4.33 1.44.4 2.06.74 2.06 1.45 0 .68-.57 1.1-1.3 1.1z" />
                </svg>
              </div>
            </div>

            {/* Accepted cards */}
            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 px-5 py-4">
              <p className="text-xs text-slate-500 mb-3 font-medium uppercase tracking-wider">{t('checkout', 'acceptedMethods')}</p>
              <div className="flex items-center gap-3 flex-wrap">
                {['Visa', 'MC', 'Amex', 'Apple Pay', 'Google Pay'].map((card) => (
                  <span key={card} className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                    {card}
                  </span>
                ))}
              </div>
            </div>

            {/* Help text */}
            <p className="text-xs text-center text-slate-400 px-2">
              {t('checkout', 'termsAgreement')}{' '}
              <a href="#" className="underline hover:text-slate-600">{t('checkout', 'termsOfService')}</a>{' '}
              {t('checkout', 'and')}{' '}
              <a href="#" className="underline hover:text-slate-600">{t('checkout', 'privacyPolicy')}</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}