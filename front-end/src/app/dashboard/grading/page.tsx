'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppSelector } from '../../../store/hooks';
import apiClient from '../../../lib/api/client';
import { Button } from '../../../components/ui/button';
import { useTranslation } from '../../../lib/i18n/useTranslation';

interface Submission {
  id: number;
  user_id: number;
  email: string;
  full_name: string | null;
  content: string;
  google_drive_link?: string | null;
  submitted_at: string;
  assignment_title: string;
  lesson_title: string;
  max_score: number;
  score: number | null;
  feedback: string | null;
  graded_at: string | null;
  grade_id: number | null;
}

interface CourseItem { id: number; title: string; }

function Badge({ graded }: { graded: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
      graded ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
    }`}>
      <span className={`h-1.5 w-1.5 rounded-full ${graded ? 'bg-green-500' : 'bg-amber-500'}`} />
      {graded ? 'Graded' : 'Pending'}
    </span>
  );
}

export default function GradingPage() {
  const { t } = useTranslation();
  const { user, isLoading: authLoading } = useAppSelector((s) => s.auth);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'graded'>('pending');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [gradeInputs, setGradeInputs] = useState<Record<number, { score: string; feedback: string }>>({});
  const [saving, setSaving] = useState<number | null>(null);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isLoadingSubs, setIsLoadingSubs] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'teacher') return;
    apiClient.get('/courses').then(({ data }) => {
      setCourses(data);
      if (data.length > 0) setSelectedCourseId(data[0].id);
    }).finally(() => setIsLoadingCourses(false));
  }, [user]);

  useEffect(() => {
    if (!selectedCourseId) return;
    setIsLoadingSubs(true);
    apiClient.get(`/courses/${selectedCourseId}/submissions`)
      .then(({ data }) => setSubmissions(data))
      .catch(console.error)
      .finally(() => setIsLoadingSubs(false));
  }, [selectedCourseId]);

  const handleGrade = async (sub: Submission) => {
    const input = gradeInputs[sub.id];
    if (!input?.score) return alert('Enter a score first.');
    const score = parseFloat(input.score);
    if (isNaN(score) || score < 0 || score > sub.max_score) {
      return alert(`Score must be between 0 and ${sub.max_score}`);
    }
    setSaving(sub.id);
    try {
      await apiClient.post(`/submissions/${sub.id}/grade`, {
        score,
        feedback: input.feedback || '',
      });
      // Refresh
      const { data } = await apiClient.get(`/courses/${selectedCourseId}/submissions`);
      setSubmissions(data);
      setExpanded(null);
    } catch (err: any) {
      alert('Failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(null);
    }
  };

  const filtered = submissions.filter((s) => {
    if (filter === 'pending') return s.grade_id === null;
    if (filter === 'graded') return s.grade_id !== null;
    return true;
  });

  const pendingCount = submissions.filter((s) => s.grade_id === null).length;

  if (authLoading || user === null) {
    return <div className="flex items-center justify-center py-24"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" /></div>;
  }
  if (user.role !== 'teacher') {
    return <div className="rounded-md bg-red-50 p-4 border border-red-200"><p className="text-sm text-red-700">{t('grading', 'accessRestricted')}</p></div>;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('grading', 'title')}</h1>
        <p className="mt-1 text-sm text-slate-600">{t('grading', 'subtitle')}</p>
      </header>

      {/* Course selector */}
      <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-slate-200 flex items-center gap-4 flex-wrap">
        <label className="text-sm font-medium text-slate-700 flex-shrink-0">{t('grading', 'course')}:</label>
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

      {/* Filter tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {(['pending', 'graded', 'all'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
            {t('grading', f)}{f === 'pending' && pendingCount > 0 && (
              <span className="ml-2 bg-amber-400 text-white text-xs rounded-full px-1.5 py-0.5">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Submissions list */}
      {isLoadingSubs ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 bg-slate-200 animate-pulse rounded-2xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500 border-2 border-dashed border-slate-200 rounded-2xl">
          {filter === 'pending' ? t('grading', 'allGraded') : t('grading', 'noSubmissions')}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((sub) => {
            const isOpen = expanded === sub.id;
            const input = gradeInputs[sub.id] || { score: sub.score != null ? String(sub.score) : '', feedback: sub.feedback || '' };
            return (
              <div key={sub.id} className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
                {/* Row header */}
                <button
                  onClick={() => setExpanded(isOpen ? null : sub.id)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {(sub.full_name || sub.email).charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{sub.full_name || sub.email}</p>
                      <p className="text-xs text-slate-500 truncate">
                        {sub.assignment_title} · {sub.lesson_title}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                    <Badge graded={sub.grade_id !== null} />
                    {sub.grade_id !== null && (
                      <span className="text-sm font-bold text-slate-700">{sub.score}/{sub.max_score}</span>
                    )}
                    <span className="text-xs text-slate-400">
                      {new Date(sub.submitted_at).toLocaleDateString()}
                    </span>
                    <svg className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Expanded grading panel */}
                {isOpen && (
                  <div className="border-t border-slate-200 p-5 bg-slate-50 space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t('grading', 'studentAnswer')}</p>
                      {sub.content && (
                        <div className="bg-white rounded-xl p-4 ring-1 ring-slate-200 text-sm text-slate-700 whitespace-pre-wrap max-h-48 overflow-y-auto mb-3">
                          {sub.content}
                        </div>
                      )}
                      {sub.google_drive_link && (
                        <div className="mt-2">
                          <a href={sub.google_drive_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline bg-indigo-50 px-3 py-1.5 rounded-lg">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            {t('grades', 'openGoogleDrive')}
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                          {t('grading', 'score')} ({t('grading', 'max')}: {sub.max_score})
                        </label>
                        <input
                          type="number"
                          min="0"
                          max={sub.max_score}
                          step="0.5"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          value={input.score}
                          onChange={(e) => setGradeInputs(prev => ({ ...prev, [sub.id]: { ...input, score: e.target.value } }))}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{t('grading', 'feedback')}</label>
                        <textarea
                          rows={2}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder={t('grading', 'feedbackPlaceholder')}
                          value={input.feedback}
                          onChange={(e) => setGradeInputs(prev => ({ ...prev, [sub.id]: { ...input, feedback: e.target.value } }))}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        onClick={() => handleGrade(sub)}
                        variant="primary"
                        isLoading={saving === sub.id}
                      >
                        {saving === sub.id ? t('grading', 'saving') : sub.grade_id ? t('grading', 'updateGrade') : t('grading', 'submitGrade')}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}