'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag, CheckCircle2, Clock, XCircle,
  RotateCcw, ArrowRight, BookOpen, Loader2,
} from 'lucide-react';
import { useAppSelector } from '../../../store/hooks';
import apiClient from '../../../lib/api/client';
import { useTranslation } from '../../../lib/i18n/useTranslation';
import type { Order, OrderStatus } from '../../../types';

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, { icon: React.ElementType; cls: string; label: string }> = {
    paid: { icon: CheckCircle2, cls: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', label: 'Paid' },
    pending: { icon: Clock, cls: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200', label: 'Pending' },
    failed: { icon: XCircle, cls: 'bg-red-50 text-red-700 ring-1 ring-red-200', label: 'Failed' },
    refunded: { icon: RotateCcw, cls: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200', label: 'Refunded' },
  };
  const { icon: Icon, cls, label } = map[status] ?? map.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const { t } = useTranslation();
  const { user } = useAppSelector((s) => s.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient.get('/orders/me')
      .then(({ data }) => setOrders(data))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  const totalSpent = orders
    .filter((o) => o.status === 'paid')
    .reduce((s, o) => s + Number(o.amount), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('orders', 'title')}</h1>
        <p className="mt-1 text-sm text-slate-500">Your course purchase history.</p>
      </header>

      {/* Stats */}
      {orders.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{orders.length}</p>
                <p className="text-xs text-slate-500">Total orders</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {orders.filter((o) => o.status === 'paid').length}
                </p>
                <p className="text-xs text-slate-500">Paid</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {orders.filter((o) => o.status === 'paid').length} courses
                </p>
                <p className="text-xs text-slate-500">{t('orders', 'Unlocked')}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-700 rounded-2xl px-5 py-4 text-sm ring-1 ring-red-200">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && orders.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl">
          <ShoppingBag className="w-12 h-12 mx-auto text-slate-300 mb-4" />
          <p className="font-semibold text-slate-700">{t('orders', 'noOrders')}</p>
          <p className="text-sm text-slate-400 mt-1">{t('orders', 'Explore_courses_and_start_learning')}</p>
          <Link href="/dashboard/courses"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Browse courses <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Orders list */}
      {orders.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-900">{t('orders', 'allOrders')}</h2>
          </div>
          <ul className="divide-y divide-slate-100">
            {orders.map((order) => (
              <li key={order.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                {/* Course thumbnail */}
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600">
                  {order.cover_url ? (
                    <img src={order.cover_url} alt={order.course_title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                      {(order.course_title || 'C').charAt(0)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate">
                    {order.course_title || `Course #${order.course_id}`}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    <p className="text-xs text-slate-400">
                      {new Date(order.created_at).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </p>
                    <p className="text-xs text-slate-400">Order #{order.id}</p>
                    <p className="text-xs font-medium text-slate-600">
                      {formatCurrency(order.amount, order.currency)}
                    </p>
                  </div>
                </div>

                {/* Status + action */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <StatusBadge status={order.status} />
                  {order.status === 'paid' && (
                    <Link
                      href={`/dashboard/courses/${order.course_id}`}
                      className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      {t('orders', 'viewCourse')} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
