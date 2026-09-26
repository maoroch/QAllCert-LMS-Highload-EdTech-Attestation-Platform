'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, BookOpen, ShoppingBag, Loader2, AlertCircle } from 'lucide-react';
import apiClient from '@/src/lib/api/client';

interface SessionData {
  order: {
    id: number;
    course_id: number;
    course_title: string;
    amount: number;
    currency: string;
    status: string;
  };
  stripeStatus: string;
  amountTotal: number;
  currency: string;
}

function formatCurrency(amount: number, currency: string) {
  // Stripe returns amount in cents
  const value = amount / 100;
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(value);
  } catch {
    return `${value} ${currency}`;
  }
}

export default function CheckoutSuccessPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [data, setData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) {
      // No session — maybe user navigated here directly
      router.replace(`/dashboard/courses/${courseId}`);
      return;
    }

    // Find the order by course then confirm with backend
    apiClient
      .get<SessionData[]>('/orders/me')
      .then(async ({ data: orders }) => {
        // Find a pending/paid order for this course
        const order = (orders as any[]).find(
          (o) => Number(o.course_id) === Number(courseId),
        );
        if (!order) throw new Error('Order not found');

        const { data: sessionData } = await apiClient.get<SessionData>(
          `/orders/${order.id}/checkout-session`,
        );
        setData(sessionData);
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Could not verify payment.');
      })
      .finally(() => setLoading(false));
  }, [sessionId, courseId, router]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mx-auto" />
          <p className="text-sm text-slate-500">Confirming your payment…</p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl ring-1 ring-slate-200 p-10 max-w-md w-full text-center space-y-5">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Something went wrong</h2>
          <p className="text-slate-500 text-sm">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/dashboard/orders"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" /> My Orders
            </Link>
            <Link
              href={`/dashboard/courses/${courseId}`}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              <BookOpen className="w-4 h-4" /> Go to Course
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isPaid = data?.stripeStatus === 'paid' || data?.order?.status === 'paid';

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl ring-1 ring-slate-200 p-10 max-w-lg w-full text-center space-y-6">

        {/* Icon */}
        <div className="relative mx-auto w-20 h-20">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full animate-ping bg-emerald-200 opacity-30" />
        </div>

        {/* Heading */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Payment successful!</h1>
          <p className="mt-2 text-slate-500">
            You now have full access to{' '}
            <span className="font-semibold text-slate-700">
              {data?.order?.course_title || `Course #${courseId}`}
            </span>.
          </p>
        </div>

        {/* Receipt card */}
        {data && (
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 text-left divide-y divide-slate-200">
            <div className="flex justify-between items-center px-5 py-3">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Order</span>
              <span className="text-sm font-semibold text-slate-900">#{data.order.id}</span>
            </div>
            <div className="flex justify-between items-center px-5 py-3">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Course</span>
              <span className="text-sm font-semibold text-slate-900 max-w-[200px] text-right truncate">
                {data.order.course_title}
              </span>
            </div>
            {data.amountTotal != null && (
              <div className="flex justify-between items-center px-5 py-3">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Amount paid</span>
                <span className="text-sm font-bold text-emerald-700">
                  {formatCurrency(data.amountTotal, data.currency)}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center px-5 py-3">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Status</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isPaid ? 'Paid' : data.stripeStatus}
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" /> View orders
          </Link>
          <Link
            href={`/dashboard/courses/${courseId}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            <BookOpen className="w-4 h-4" /> Start learning
          </Link>
        </div>

        <p className="text-xs text-slate-400">
          A receipt has been sent to your email by Stripe.
        </p>
      </div>
    </div>
  );
}