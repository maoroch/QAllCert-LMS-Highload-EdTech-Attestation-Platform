'use client';

import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../../store/hooks';
import apiClient from '../../../lib/api/client';
import { useTranslation } from '../../../lib/i18n/useTranslation';

interface Student {
  user_id: number;
  email: string;
  full_name: string | null;
  phone_number: string | null;
  status: string;
  progress_percent: number;
  enrolled_at: string;
}

interface Review {
  id: number;
  student_name: string | null;
  rating: number;
  comment: string | null;
  course_title: string;
  created_at: string;
}

interface CourseItem { id: number; title: string; }

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((n) => (
        <svg key={n} className={`w-4 h-4 ${n <= rating ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function StudentsPage() {
  const { user, isLoading: authLoading } = useAppSelector((s) => s.auth);
  const { t } = useTranslation();
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState<'students' | 'reviews'>('students');
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'teacher') return;
    apiClient.get('/courses').then(({ data }) => {
      setCourses(data);
      if (data.length > 0) setSelectedCourseId(data[0].id);
    }).finally(() => setIsLoadingCourses(false));
  }, [user]);

  useEffect(() => {
    if (!selectedCourseId) return;
    setIsLoadingData(true);
    Promise.all([
      apiClient.get(`/courses/${selectedCourseId}/students`),
      apiClient.get(`/courses/${selectedCourseId}/reviews`),
    ]).then(([studRes, revRes]) => {
      setStudents(studRes.data);
      setReviews(revRes.data);
    }).catch(console.error).finally(() => setIsLoadingData(false));
  }, [selectedCourseId]);

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '—';

  const filteredStudents = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      (s.full_name?.toLowerCase().includes(q)) ||
      s.email.toLowerCase().includes(q) ||
      (s.phone_number?.includes(q))
    );
  });

  if (authLoading || user === null) {
    return <div className="flex items-center justify-center py-24"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" /></div>;
  }
  if (user.role !== 'teacher') {
    return <div className="rounded-md bg-red-50 p-4 border border-red-200"><p className="text-sm text-red-700">{t('studentsPage', 'accessRestricted')}</p></div>;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('studentsPage', 'title')}</h1>
        <p className="mt-1 text-sm text-slate-600">{t('studentsPage', 'subtitle')}</p>
      </header>

      {/* Course pills */}
      <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-slate-200 flex items-center gap-4 flex-wrap">
        <label className="text-sm font-medium text-slate-700 flex-shrink-0">{t('studentsPage', 'courseLabel')}</label>
        {isLoadingCourses ? (
          <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-full" />
        ) : (
          <div className="flex flex-wrap gap-2">
            {courses.map((c) => (
              <button key={c.id} onClick={() => setSelectedCourseId(c.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCourseId === c.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                {c.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: t('studentsPage', 'enrolled'), value: students.length, icon: '👥' },
          { label: t('studentsPage', 'active'), value: students.filter(s=>s.status==='active').length, icon: '📚' },
          { label: t('studentsPage', 'completed'), value: students.filter(s=>s.status==='completed').length, icon: '🎓' },
          { label: t('studentsPage', 'avgRating'), value: avgRating, icon: '⭐' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-slate-200 flex items-center gap-3">
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className="text-xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {(['students', 'reviews'] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
            {tab === 'students' ? t('studentsPage', 'studentsTab') : t('studentsPage', 'reviewsTab')} {tab === 'reviews' && reviews.length > 0 && `(${reviews.length})`}
          </button>
        ))}
      </div>

      {isLoadingData ? (
        <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="h-16 bg-slate-200 animate-pulse rounded-2xl"/>)}</div>
      ) : activeTab === 'students' ? (
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
          {/* Search */}
          <div className="p-4 border-b border-slate-200">
            <input
              type="text"
              placeholder={t('studentsPage', 'searchPlaceholder')}
              className="w-full max-w-sm rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {filteredStudents.length === 0 ? (
            <div className="p-8 text-center text-slate-500">{t('studentsPage', 'noStudents')}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('studentsPage', 'studentCol')}</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('studentsPage', 'phoneCol')}</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('studentsPage', 'statusCol')}</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('studentsPage', 'progressCol')}</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('studentsPage', 'enrolledCol')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((s) => (
                    <tr key={s.user_id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {(s.full_name || s.email).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{s.full_name || '—'}</p>
                            <p className="text-xs text-slate-500">{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{s.phone_number || <span className="text-slate-400 italic">{t('studentsPage', 'notProvided')}</span>}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          s.status === 'completed' ? 'bg-green-100 text-green-700' :
                          s.status === 'dropped' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>{s.status}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-slate-100 rounded-full h-2 w-24">
                            <div
                              className={`h-2 rounded-full ${s.progress_percent >= 100 ? 'bg-green-500' : s.progress_percent > 50 ? 'bg-indigo-500' : 'bg-amber-400'}`}
                              style={{ width: `${s.progress_percent}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-500 w-8">{s.progress_percent}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-500">
                        {new Date(s.enrolled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Reviews tab */
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="text-center py-16 text-slate-500 border-2 border-dashed border-slate-200 rounded-2xl">
              {t('studentsPage', 'noReviews')}
            </div>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-slate-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {(r.student_name || 'S').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{r.student_name || t('studentsPage', 'student')}</p>
                      <StarRating rating={r.rating} />
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0">
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </div>
                {r.comment && (
                  <p className="mt-3 text-sm text-slate-700 pl-12">{r.comment}</p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}