'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchCurrentUser, logoutUser } from '../../store/auth/authSlice';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { LanguageSwitcher } from '../../components/ui/LanguageSwitcher';
import { useTranslation } from '../../lib/i18n/useTranslation';
import apiClient from '../../lib/api/client';
import { APP_NAME } from '../../lib/constants';
import {
  Home,
  BookOpen,
  Target,
  Bell,
  Award,
  Star,
  User,
  Users,
  Edit3,
  BarChart,
  LogOut,
  Menu,
  X,
  ShoppingBag,
} from 'lucide-react';

interface Notification {
  id: number;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

function NotificationBell() {
  const { t: nT } = useTranslation();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get('/notifications');
      setNotifications(data);
    } catch {
      // Notifications are non-critical — fail silently
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Закрытие при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAllRead = async () => {
    try {
      await apiClient.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch {/* silent */ }
  };

  return (
    <div className="relative w-9 h-9">
      <button
        ref={buttonRef}
        onClick={() => { setOpen((o) => !o); if (!open) fetchNotifications(); }}
        className="absolute inset-0 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className="absolute right-[-2rem] xl:right-[-6rem] md:right-[-6rem]  lg:right-0 top-full mt-2 z-50 w-screen max-w-[calc(100vw-2rem)] sm:w-80 bg-white rounded-2xl shadow-xl ring-1 ring-slate-200 overflow-hidden origin-top-right"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <h3 className="font-semibold text-sm text-slate-900">{nT('notifications', 'title')}</h3>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-indigo-600 hover:underline">
                {nT('notifications', 'markAllRead')}
              </button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600 mx-auto" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500">
                <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                {nT('notifications', 'noNotifs')}
              </div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className={`px-4 py-3 text-sm ${n.is_read ? 'opacity-60' : 'bg-indigo-50/50'}`}>
                  <p className="text-slate-800">{n.message}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(n.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) {
      router.push('/login');
    } else if (!user) {
      dispatch(fetchCurrentUser());
    } else if (user && user.email_verified === false) {
      router.push(`/verify-email?email=${encodeURIComponent(user.email)}`);
    }
  }, [user, dispatch, router]);

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push('/login');
  };

  // Иконки для пунктов меню (lucide)
  const getIcon = (key: string) => {
    switch (key) {
      case 'dashboard': return <Home className="w-5 h-5" />;
      case 'courses': return <BookOpen className="w-5 h-5" />;
      case 'myGrades': return <Target className="w-5 h-5" />;
      case 'notifications': return <Bell className="w-5 h-5" />;
      case 'certificates': return <Award className="w-5 h-5" />;
      case 'reviews': return <Star className="w-5 h-5" />;
      case 'orders': return <ShoppingBag className="w-5 h-5" />;
      case 'profile': return <User className="w-5 h-5" />;
      case 'manageCourses': return <BookOpen className="w-5 h-5" />;
      case 'grading': return <Edit3 className="w-5 h-5" />;
      case 'students': return <Users className="w-5 h-5" />;
      case 'analytics': return <BarChart className="w-5 h-5" />;
      default: return <Home className="w-5 h-5" />;
    }
  };

  const studentNav = [
    { key: 'dashboard', href: '/dashboard' },
    { key: 'courses', href: '/dashboard/courses' },
    { key: 'myGrades', href: '/dashboard/grades' },
    { key: 'orders', href: '/dashboard/orders' },
    { key: 'notifications', href: '/dashboard/notifications' },
    { key: 'certificates', href: '/dashboard/certificates' },
    { key: 'reviews', href: '/dashboard/reviews' },
    { key: 'profile', href: '/dashboard/profile' },
  ];

  const teacherNav = [
    { key: 'dashboard', href: '/dashboard' },
    { key: 'manageCourses', href: '/dashboard/courses' },
    { key: 'grading', href: '/dashboard/grading' },
    { key: 'students', href: '/dashboard/students' },
    { key: 'analytics', href: '/dashboard/analytics' },
    { key: 'reviews', href: '/dashboard/reviews' },
    { key: 'profile', href: '/dashboard/profile' },
  ];

  const navItems = user?.role === 'teacher' ? teacherNav : studentNav;

  // Функция проверки активности пункта меню
  const isLinkActive = (href: string) => {
    if (href === '/dashboard') {
      // Корневая страница дашборда активна только при точном совпадении
      return pathname === '/dashboard';
    }
    // Для всех остальных: точное совпадение или начало с href + '/'
    // (например, /dashboard/students или /dashboard/students/123)
    return pathname === href || pathname.startsWith(href + '/');
  };

  if (isLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!isAuthenticated && !user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">

      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-30">
        <span className="font-bold text-xl text-indigo-600">{APP_NAME}</span>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <NotificationBell />
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Overlay backdrop (mobile only) */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-20"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-full md:h-screen
        w-64 bg-white border-r border-slate-200 flex-shrink-0
        flex flex-col z-30 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo + language + notifications (desktop) */}
        <div className="p-6 hidden md:flex items-center justify-between">
          <span className="font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
            {APP_NAME}
          </span>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <NotificationBell />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isLinkActive(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${active
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-700 hover:bg-slate-100'
                  }`}
              >
                {getIcon(item.key)}
                {t('nav', item.key as any)}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center mb-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="ml-2 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{user?.email}</p>
              <p className="text-xs text-slate-500 capitalize">{t('profilePage', user?.role === 'teacher' ? 'roleTeacher' : 'roleStudent')}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {t('nav', 'signOut')}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto min-w-0">
        <div className="p-4 md:p-8">
          <ErrorBoundary context="Dashboard">
            {children}
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}