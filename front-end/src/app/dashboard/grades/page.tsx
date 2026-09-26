'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppSelector } from '../../../store/hooks';
import apiClient from '../../../lib/api/client';
import { useTranslation } from '../../../lib/i18n/useTranslation';

interface GradedItem {
  grade_id: number;
  score: number;
  feedback: string | null;
  graded_at: string;
  assignment_id: number;
  assignment_title: string;
  max_score: number;
  due_date: string | null;
  submission_id: number;
  submission_content: string | null;
  google_drive_link: string | null;
  submitted_at: string;
  lesson_id: number;
  lesson_title: string;
  module_title: string;
  course_id: number;
  course_title: string;
  teacher_name: string | null;
}

interface PendingItem {
  submission_id: number;
  submission_content: string | null;
  google_drive_link: string | null;
  submitted_at: string;
  assignment_id: number;
  assignment_title: string;
  max_score: number;
  due_date: string | null;
  lesson_title: string;
  module_title: string;
  course_id: number;
  course_title: string;
}

function ScoreBadge({ score, maxScore }: { score: number; maxScore: number }) {
  const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;
  const color =
    pct >= 80 ? 'bg-green-100 text-green-700 ring-green-200'
    : pct >= 60 ? 'bg-amber-100 text-amber-700 ring-amber-200'
    : 'bg-red-100 text-red-700 ring-red-200';
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ring-1 ${color}`}>
      {score}/{maxScore}
    </span>
  );
}

function ProgressRing({ score, maxScore }: { score: number; maxScore: number }) {
  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const r = 20;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const color = pct >= 80 ? '#22c55e' : pct >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <div className="relative flex items-center justify-center w-14 h-14 flex-shrink-0">
      <svg className="absolute inset-0 -rotate-90" width="56" height="56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="#e2e8f0" strokeWidth="4" />
        <circle cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
      </svg>
      <span className="text-xs font-bold text-slate-700">{pct}%</span>
    </div>
  );
}

export default function GradesPage() {
  const { user, isLoading: authLoading } = useAppSelector((s) => s.auth);
  const [grades, setGrades] = useState<GradedItem[]>([]);
  const [pending, setPending] = useState<PendingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'graded' | 'pending'>('graded');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filterCourse, setFilterCourse] = useState<number | 'all'>('all');
  const { t } = useTranslation();

  useEffect(() => {
    if (!user || user.role !== 'student') return;
    Promise.all([
      apiClient.get('/me/grades'),
      apiClient.get('/me/grades/pending'),
    ]).then(([gRes, pRes]) => {
      setGrades(gRes.data);
      setPending(pRes.data);
    }).catch(console.error).finally(() => setIsLoading(false));
  }, [user]);

  // Unique courses for the filter
  const courses = Array.from(
    new Map(grades.map((g) => [g.course_id, g.course_title])).entries()
  ).map(([id, title]) => ({ id, title }));

  const filtered = filterCourse === 'all'
    ? grades
    : grades.filter((g) => g.course_id === filterCourse);

  // Aggregate stats
  const avgScore = filtered.length
    ? (filtered.reduce((sum, g) => sum + (g.score / g.max_score) * 100, 0) / filtered.length).toFixed(1)
    : '—';
  const best = filtered.length
    ? filtered.reduce((b, g) => (g.score / g.max_score) > (b.score / b.max_score) ? g : b)
    : null;

  if (authLoading || !user) {
    return <div className="flex items-center justify-center py-24"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" /></div>;
  }
  if (user.role !== 'student') {
    return (
      <div className="space-y-6">
        <header><h1 className="text-3xl font-bold text-slate-900">{t('grades', 'gradesTitle')}</h1></header>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-800 text-sm">
          {t('grades', 'forStudents')}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('grades', 'title')}</h1>
        <p className="mt-1 text-sm text-slate-600">{t('grades', 'trackPerformance')}</p>
      </header>

      {/* Stats cards */}
      {!isLoading && grades.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-slate-200">
            <p className="text-2xl font-bold text-slate-900">{grades.length}</p>
            <p className="text-xs text-slate-500 mt-1">{t('grades', 'gradedAssignments')}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-slate-200">
            <p className="text-2xl font-bold text-indigo-600">{avgScore}%</p>
            <p className="text-xs text-slate-500 mt-1">{t('grades', 'avgScore')}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-slate-200">
            <p className="text-2xl font-bold text-amber-600">{pending.length}</p>
            <p className="text-xs text-slate-500 mt-1">{t('grades', 'awaitingReview')}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-slate-200">
            {best ? (
              <>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round((best.score / best.max_score) * 100)}%
                </p>
                <p className="text-xs text-slate-500 mt-1 truncate" title={best.assignment_title}>
                  {t('grades', 'best')}: {best.assignment_title}
                </p>
              </>
            ) : (
              <p className="text-2xl font-bold text-slate-300">—</p>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {(['graded', 'pending'] as const).map((t_tab) => (
          <button key={t_tab} onClick={() => setActiveTab(t_tab)}
            className={`px-5 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === t_tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
            {t_tab === 'graded' ? `${t('grades', 'graded')} (${grades.length})` : `${t('grades', 'pending')} (${pending.length})`}
          </button>
        ))}
      </div>

      {activeTab === 'graded' ? (
        <>
          {/* Course filter */}
          {courses.length > 1 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-slate-500">{t('grades', 'filter')}</span>
              <button onClick={() => setFilterCourse('all')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filterCourse === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                {t('grades', 'allCourses')}
              </button>
              {courses.map((c) => (
                <button key={c.id} onClick={() => setFilterCourse(c.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filterCourse === c.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                  {c.title}
                </button>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 bg-slate-200 animate-pulse rounded-2xl"/>)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500">
              <div className="text-4xl mb-3">📝</div>
              <p className="font-medium">{t('grades', 'noGraded')}</p>
              <p className="text-sm mt-1">{t('grades', 'submitToReceive')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((g) => {
                const isOpen = expandedId === g.grade_id;
                return (
                  <div key={g.grade_id} className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
                    {/* Row */}
                    <button
                      onClick={() => setExpandedId(isOpen ? null : g.grade_id)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors gap-4"
                    >
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <ProgressRing score={g.score} maxScore={g.max_score} />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{g.assignment_title}</p>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                            <Link
                              href={`/dashboard/courses/${g.course_id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs text-indigo-500 hover:underline"
                            >
                              {g.course_title}
                            </Link>
                            <span className="text-xs text-slate-400">·</span>
                            <span className="text-xs text-slate-400">{g.module_title}</span>
                            <span className="text-xs text-slate-400">·</span>
                            <span className="text-xs text-slate-400">{g.lesson_title}</span>
                          </div>
                          {g.teacher_name && (
                            <p className="text-xs text-slate-400 mt-0.5">{t('grades', 'gradedBy')} {g.teacher_name}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <ScoreBadge score={g.score} maxScore={g.max_score} />
                        <div className="text-right hidden sm:block">
                          <p className="text-xs text-slate-400">
                            {new Date(g.graded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                        <svg className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {/* Expanded detail */}
                    {isOpen && (
                      <div className="border-t border-slate-100 bg-slate-50 p-5 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t('grades', 'yourSubmission')}</p>
                            <div className="bg-white rounded-xl p-4 ring-1 ring-slate-200 text-sm text-slate-700 space-y-2">
                              {g.google_drive_link && (
                                <a
                                  href={g.google_drive_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-500 hover:underline font-medium"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                  </svg>
                                  {t('grades', 'openGoogleDrive')}
                                </a>
                              )}
                              {g.submission_content && (
                                <div className="whitespace-pre-wrap max-h-40 overflow-y-auto">{g.submission_content}</div>
                              )}
                              {!g.google_drive_link && !g.submission_content && (
                                <span className="italic text-slate-400">{t('grades', 'noContent')}</span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                              {t('grades', 'submitted')} {new Date(g.submitted_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t('grades', 'feedback')}</p>
                            {g.feedback ? (
                              <div className="bg-white rounded-xl p-4 ring-1 ring-indigo-100 text-sm text-slate-700 min-h-[80px]">
                                {g.feedback}
                              </div>
                            ) : (
                              <div className="bg-white rounded-xl p-4 ring-1 ring-slate-200 text-sm text-slate-400 italic min-h-[80px] flex items-center">
                                {t('grades', 'noFeedback')}
                              </div>
                            )}
                            <p className="text-xs text-slate-400 mt-1">
                              {t('grades', 'gradedDate')} {new Date(g.graded_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* Pending tab */
        isLoading ? (
          <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-20 bg-slate-200 animate-pulse rounded-2xl"/>)}</div>
        ) : pending.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500">
            <div className="text-4xl mb-3">✅</div>
            <p className="font-medium">{t('grades', 'noPending')}</p>
            <p className="text-sm mt-1">{t('grades', 'allGraded')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map((p) => (
              <div key={p.submission_id} className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-slate-200">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                        {t('grades', 'awaitingReview')}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-900">{p.assignment_title}</p>
                    <div className="flex flex-wrap items-center gap-x-2 mt-0.5">
                      <Link href={`/dashboard/courses/${p.course_id}`}
                        className="text-xs text-indigo-500 hover:underline">{p.course_title}</Link>
                      <span className="text-xs text-slate-400">· {p.lesson_title}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-slate-500">{t('grades', 'maxScore')}: <strong>{p.max_score}</strong></p>
                    <p className="text-xs text-slate-400 mt-1">
                      {t('grades', 'submitted')} {new Date(p.submitted_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </p>
                    {p.due_date && (
                      <p className={`text-xs mt-1 ${new Date(p.due_date) < new Date() ? 'text-red-500' : 'text-slate-400'}`}>
                        {t('lessons', 'due')} {new Date(p.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}