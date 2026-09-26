'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppSelector } from '../../../store/hooks';
import apiClient from '../../../lib/api/client';
import { useTranslation } from '../../../lib/i18n/useTranslation';

interface StudentRow {
  user_id: number;
  email: string;
  status: string;
  progress_percent: number;
  enrolled_at: string;
}
interface CourseAnalytics {
  stats: {
    completion_rate: number;
    average_score: number;
    active_students_count: number;
    updated_at: string;
  } | null;
  students: StudentRow[];
}
interface CourseItem {
  id: number;
  title: string;
}

export default function AnalyticsPage() {
  const { user, isLoading: authLoading } = useAppSelector((state) => state.auth);
  const { t } = useTranslation();
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [analytics, setAnalytics] = useState<CourseAnalytics | null>(null);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'teacher') return;
    const loadCourses = async () => {
      try {
        const { data } = await apiClient.get(`/courses?teacherId=${user.id}`);
        setCourses(data);
        if (data.length > 0) setSelectedCourseId(data[0].id);
      } catch (err) {
        console.error('Failed to load courses', err);
      } finally { setIsLoadingCourses(false); }
    };
    loadCourses();
  }, [user]);

  useEffect(() => {
    if (!selectedCourseId) return;
    const loadAnalytics = async () => {
      setIsLoadingAnalytics(true);
      setAnalytics(null);
      try {
        const { data } = await apiClient.get(`/analytics/courses/${selectedCourseId}`);
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally { setIsLoadingAnalytics(false); }
    };
    loadAnalytics();
  }, [selectedCourseId]);

  if (authLoading || user === null) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (user.role !== 'teacher') {
    return (
      <div className="max-w-4xl space-y-8">
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-700">{t('analyticsPage', 'accessRestricted')}</p>
        </div>
      </div>
    );
  }

  const stats = analytics?.stats;
  const students = analytics?.students ?? [];

  const statCards = [
    {
      label: t('analyticsPage', 'activeStudents'),
      value: stats?.active_students_count ?? '—',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      label: t('analyticsPage', 'avgCompletion'),
      value: stats?.completion_rate != null ? `${Math.round(Number(stats.completion_rate))}%` : '—',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'text-violet-600 bg-violet-50',
    },
    {
      label: t('analyticsPage', 'avgScore'),
      value: stats?.average_score != null ? Number(stats.average_score).toFixed(1) : '—',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: t('analyticsPage', 'totalEnrolled'),
      value: students.length,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: 'text-green-600 bg-green-50',
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('analyticsPage', 'title')}</h1>
        <p className="mt-2 text-sm text-slate-600">{t('analyticsPage', 'subtitle')}</p>
      </header>

      {/* Course selector */}
      <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center gap-4 flex-wrap">
          <label className="text-sm font-medium text-slate-700 flex-shrink-0">{t('analyticsPage', 'selectCourse')}</label>
          {isLoadingCourses ? (
            <div className="h-9 w-48 bg-slate-200 animate-pulse rounded-md" />
          ) : courses.length === 0 ? (
            <p className="text-sm text-slate-500">{t('analyticsPage', 'noCourses')} <Link href="/dashboard/courses/new" className="text-indigo-600 hover:underline">{t('analyticsPage', 'createOne')}</Link></p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {courses.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCourseId(c.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCourseId === c.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  {c.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isLoadingAnalytics ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-24 bg-slate-200 animate-pulse rounded-2xl" />)}
        </div>
      ) : analytics ? (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card) => (
              <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-slate-200">
                <div className={`inline-flex p-2 rounded-lg ${card.color} mb-3`}>{card.icon}</div>
                <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                <p className="text-xs text-slate-500 mt-1">{card.label}</p>
              </div>
            ))}
          </div>

          {/* Student progress bar visualization */}
          {students.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">{t('analyticsPage', 'progressDist')}</h2>
              <p className="text-xs text-slate-500 mb-4">{t('analyticsPage', 'progressDistSub')}</p>
              <div className="flex items-end gap-1 h-20">
                {students.map((s) => (
                  <div
                    key={s.user_id}
                    title={`${s.email}: ${s.progress_percent}%`}
                    className="flex-1 min-w-[4px] rounded-t bg-indigo-400 hover:bg-indigo-600 transition-colors cursor-pointer"
                    style={{ height: `${Math.max(s.progress_percent, 3)}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>0%</span><span>100%</span>
              </div>
            </div>
          )}

          {/* Students table */}
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">{t('analyticsPage', 'enrolledStudents')}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{students.length} {students.length !== 1 ? t('analyticsPage', 'studentsEnrolled') : t('analyticsPage', 'studentEnrolled')} {t('analyticsPage', 'enrolledSuffix')}</p>
            </div>
            {students.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">{t('analyticsPage', 'noStudentsEnrolled')}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('analyticsPage', 'studentCol')}</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('analyticsPage', 'statusCol')}</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('analyticsPage', 'progressCol')}</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('analyticsPage', 'enrolledCol')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map((s) => (
                      <tr key={s.user_id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {s.email.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-slate-800 font-medium">{s.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            s.status === 'completed' ? 'bg-green-100 text-green-700' :
                            s.status === 'dropped' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-slate-100 rounded-full h-2 min-w-[80px]">
                              <div
                                className={`h-2 rounded-full transition-all ${s.progress_percent >= 100 ? 'bg-green-500' : s.progress_percent > 50 ? 'bg-indigo-500' : 'bg-amber-400'}`}
                                style={{ width: `${s.progress_percent}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-500 w-8 text-right">{s.progress_percent}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs">
                          {new Date(s.enrolled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : selectedCourseId ? (
        <div className="text-center py-12 text-slate-500">{t('analyticsPage', 'noAnalytics')}</div>
      ) : null}
    </div>
  );
}