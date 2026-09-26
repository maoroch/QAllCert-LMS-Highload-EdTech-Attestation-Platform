'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAppSelector } from '../../../store/hooks';
import apiClient from '../../../lib/api/client';
import { useTranslation } from '../../../lib/i18n/useTranslation';

interface Notification {
  id: number;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
export default function NotificationsPage() {
  const { user, isLoading: authLoading } = useAppSelector((s) => s.auth);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [markingAll, setMarkingAll] = useState(false);
  const { t } = useTranslation();

  const TYPE_META: Record<string, { icon: string; color: string; label: string }> = {
    grade_received:     { icon: '🎯', color: 'bg-indigo-50 border-indigo-100',  label: t('notifications', 'gradeReceived') },
    course_completed:   { icon: '🎓', color: 'bg-green-50 border-green-100',    label: t('notifications', 'courseCompleted') },
    new_submission:     { icon: '📥', color: 'bg-amber-50 border-amber-100',    label: t('notifications', 'newSubmission') },
    enrollment:         { icon: '📚', color: 'bg-blue-50 border-blue-100',      label: t('notifications', 'enrolled') },
    default:            { icon: '🔔', color: 'bg-slate-50 border-slate-200',    label: t('notifications', 'notification') },
  };

  const getTypeMeta = (type: string) => {
    return TYPE_META[type] || TYPE_META.default;
  };

  const timeAgo = (date: string): string => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1)  return t('notifications', 'justNow');
    if (mins < 60) return t('notifications', 'm_ago').replace('{mins}', mins.toString());
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)  return t('notifications', 'h_ago').replace('{hrs}', hrs.toString());
    const days = Math.floor(hrs / 24);
    if (days < 7)  return t('notifications', 'd_ago').replace('{days}', days.toString());
    return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await apiClient.get('/notifications');
      setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
  }, [user, fetchNotifications]);

  const markOneRead = async (id: number) => {
    if (notifications.find(n => n.id === id)?.is_read) return;
    try {
      await apiClient.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch {/* silent */}
  };

  const markAllRead = async () => {
    setMarkingAll(true);
    try {
      await apiClient.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch {/* silent */}
    finally { setMarkingAll(false); }
  };

  const displayed = filter === 'unread'
    ? notifications.filter(n => !n.is_read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (authLoading || !user) {
    return <div className="flex items-center justify-center py-24"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('notifications', 'title')}</h1>
          <p className="mt-1 text-sm text-slate-600">
            {unreadCount > 0
              ? t('notifications', 'unreadCount').replace('{count}', unreadCount.toString())
              : t('notifications', 'allCaughtUp')}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            disabled={markingAll}
            className="flex-shrink-0 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 disabled:opacity-60 transition-colors"
          >
            {markingAll ? t('common', 'loading') : t('notifications', 'markAllRead')}
          </button>
        )}
      </header>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {(['all', 'unread'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-5 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
            {f === 'unread' ? `${t('notifications', 'unread')} ${unreadCount > 0 ? `(${unreadCount})` : ''}` : t('notifications', 'all')}
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => <div key={i} className="h-20 bg-slate-200 animate-pulse rounded-2xl"/>)}
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500">
          <div className="text-5xl mb-4">
            {filter === 'unread' ? '✅' : '🔔'}
          </div>
          <p className="font-medium text-base">
            {filter === 'unread' ? t('notifications', 'noUnread') : t('notifications', 'noNotifs')}
          </p>
          <p className="text-sm mt-1">
            {filter === 'unread' ? t('notifications', 'switchToAll') : t('notifications', 'willAppearHere')}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {displayed.map((n) => {
            const meta = getTypeMeta(n.type);
            return (
              <button
                key={n.id}
                onClick={() => markOneRead(n.id)}
                className={`w-full text-left flex items-start gap-4 p-4 rounded-2xl border transition-all ${
                  n.is_read
                    ? 'bg-white border-slate-200 opacity-70 hover:opacity-100'
                    : `${meta.color} border hover:shadow-sm`
                }`}
              >
                {/* Icon */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${n.is_read ? 'bg-slate-100' : 'bg-white shadow-sm'}`}>
                  {meta.icon}
                </div>

                {/* Body */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm leading-relaxed ${n.is_read ? 'text-slate-600' : 'text-slate-900 font-medium'}`}>
                      {n.message}
                    </p>
                    {!n.is_read && (
                      <span className="flex-shrink-0 w-2 h-2 rounded-full bg-indigo-500 mt-1" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-400">{timeAgo(n.created_at)}</span>
                    <span className="text-xs text-slate-300">·</span>
                    <span className="text-xs text-slate-400">{meta.label}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}