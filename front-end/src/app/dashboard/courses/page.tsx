'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchCourses } from '../../../store/courses/coursesSlice';
import { useTranslation } from '../../../lib/i18n/useTranslation';
import { Button } from '../../../components/ui/button';

function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

export default function CoursesPage() {
    const dispatch = useAppDispatch();
    const { items, isLoading, error } = useAppSelector((state) => state.courses);
    const { user } = useAppSelector((state) => state.auth);
    const { t } = useTranslation();
    const isTeacher = user?.role === 'teacher';

    const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
    const [searchInput, setSearchInput] = useState('');
    const debouncedSearch = useDebounce(searchInput, 300);

    // Fetch courses — re-fetch when search query or tab changes
    useEffect(() => {
        dispatch(fetchCourses({
            search: debouncedSearch || undefined,
            teacherId: isTeacher && activeTab === 'my' && user ? user.id : undefined
        }));
    }, [dispatch, debouncedSearch, isTeacher, activeTab, user]);

    return (
        <div className="space-y-6">
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        {t('courses', 'title')}
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        {isTeacher
                            ? t('courses', 'manage')
                            : t('courses', 'viewCourse')}
                    </p>
                </div>
                {isTeacher && (
                    <Button variant="primary" onClick={() => window.location.href = '/dashboard/courses/new'}>
                        {t('courses', 'createCourse')}
                    </Button>
                )}
            </header>

            {/* Tabs for Teachers */}
            {isTeacher && (
                <div className="flex border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all ${
                            activeTab === 'all'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        {t('courses', 'allCourses')}
                    </button>
                    <button
                        onClick={() => setActiveTab('my')}
                        className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all ${
                            activeTab === 'my'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        {t('courses', 'myCourses')}
                    </button>
                </div>
            )}

            {/* Search bar */}
            <div className="relative max-w-md">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    placeholder={t('courses', 'searchCourses')}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                />
                {searchInput && (
                    <button
                        onClick={() => setSearchInput('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {error && (
                <div className="rounded-md bg-red-50 p-4 border border-red-200">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {isLoading ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="animate-pulse flex flex-col rounded-2xl bg-white overflow-hidden ring-1 ring-slate-200">
                            <div className="h-40 bg-slate-200" />
                            <div className="flex-1 p-6 space-y-4">
                                <div className="h-4 bg-slate-200 rounded w-3/4" />
                                <div className="h-4 bg-slate-200 rounded w-1/2" />
                                <div className="h-10 bg-slate-200 rounded mt-4" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {items.map((course: any) => (
                        <Link
                            key={course.id}
                            href={`/dashboard/courses/${course.id}`}
                            className="group flex flex-col rounded-2xl bg-white overflow-hidden ring-1 ring-slate-200 shadow-sm transition-all hover:shadow-md hover:ring-indigo-500"
                        >
                            <div className="relative h-40 overflow-hidden">
                                {course.cover_url ? (
                                    <img
                                        src={course.cover_url}
                                        alt={course.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-5">
                                    <h3 className="text-lg font-bold text-white line-clamp-2 drop-shadow">
                                        {course.title}
                                    </h3>
                                </div>
                            </div>
                            <div className="flex flex-1 flex-col justify-between p-5">
                                <div className="space-y-2">
                                    {course.teacher_name && (
                                        <p className="text-xs text-indigo-600 font-medium flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            {course.teacher_name}
                                        </p>
                                    )}
                                    <p className="text-xs text-slate-400">
                                        {new Date(course.created_at).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-slate-600 line-clamp-2">
                                        {course.description || t('common', 'noResults')}
                                    </p>
                                </div>
                                <div className="mt-5 flex items-center justify-between flex-wrap gap-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {/* Price badge */}
                                        {course.price && Number(course.price) > 0 ? (
                                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
                                                {Number(course.price).toLocaleString()} {course.currency || 'USD'}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                                                {t('pricing', 'free')}
                                            </span>
                                        )}
                                        {/* Published badge (teacher only) */}
                                        {isTeacher && (
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${course.is_published
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {course.is_published ? t('publishing', 'published') : t('publishing', 'draft')}
                                            </span>
                                        )}
                                    </div>
                                    <svg className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {items.length === 0 && !isLoading && (
                        <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-300 rounded-2xl">
                            {debouncedSearch ? (
                                <>
                                    <div className="text-4xl mb-3">🔍</div>
                                    <h3 className="text-sm font-semibold text-slate-900">{t('common', 'noResults')}</h3>
                                    <p className="mt-1 text-sm text-slate-500">{t('courses', 'tryDifferentSearch')}</p>
                                    <button onClick={() => setSearchInput('')} className="mt-3 text-sm text-indigo-600 hover:underline">
                                        {t('courses', 'clearSearch')}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-semibold text-slate-900">{t('courses', 'noCourses')}</h3>
                                    {isTeacher && (
                                        <div className="mt-4">
                                            <Button variant="outline" onClick={() => window.location.href = '/dashboard/courses/new'}>
                                                {t('courses', 'createCourse')}
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}