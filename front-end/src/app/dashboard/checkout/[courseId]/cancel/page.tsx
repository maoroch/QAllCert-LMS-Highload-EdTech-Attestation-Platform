'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { XCircle, ArrowLeft, CreditCard } from 'lucide-react';

export default function CheckoutCancelPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50/20 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl ring-1 ring-slate-200 p-10 max-w-md w-full text-center space-y-6">

        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Payment cancelled</h1>
          <p className="mt-2 text-slate-500 text-sm">
            No worries — you weren't charged. Your progress and course access are unchanged.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href={`/dashboard/checkout/${courseId}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            <CreditCard className="w-4 h-4" /> Try again
          </Link>
          <Link
            href={`/dashboard/courses/${courseId}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to course
          </Link>
        </div>
      </div>
    </div>
  );
}