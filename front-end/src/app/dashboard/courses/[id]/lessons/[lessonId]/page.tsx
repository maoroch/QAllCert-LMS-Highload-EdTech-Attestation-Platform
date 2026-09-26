'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useAppSelector } from '../../../../../../store/hooks';
import { ErrorBoundary } from '../../../../../../components/ErrorBoundary';
import apiClient from '../../../../../../lib/api/client';
import { useTranslation } from '../../../../../../lib/i18n/useTranslation';
import { MarkdownEditor, MarkdownPreview } from '../../../../../../components/MarkdownEditor';
import { LessonMaterials } from '../../../../../../components/LessonMaterials';

type LessonError = { status: 403 | 404 | 500 | null; message: string };

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

// ── Homework submission panel ────────────────────────────────────────────────
interface Assignment {
  id: number;
  title: string;
  description?: string;
  max_score: number;
  due_date: string | null;
}

interface ExistingSubmission {
  id: number;
  content: string | null;
  google_drive_link: string | null;
  submitted_at: string;
  score?: number | null;
  feedback?: string | null;
  graded_at?: string | null;
}

function HomeworkPanel({ lessonId, isTeacher }: { lessonId: number; isTeacher: boolean }) {
  const { t } = useTranslation();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Record<number, ExistingSubmission>>({});
  const [loadingHW, setLoadingHW] = useState(true);

  // per-assignment form state
  const [draftContent, setDraftContent] = useState<Record<number, string>>({});
  const [draftLink, setDraftLink] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [success, setSuccess] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setLoadingHW(true);
    apiClient.get(`/lessons/${lessonId}/assignments`)
      .then(async ({ data }: { data: Assignment[] }) => {
        setAssignments(data);
        if (!isTeacher) {
          // fetch my existing submission for each assignment
          const entries = await Promise.all(
            data.map((a) =>
              apiClient.get(`/assignments/${a.id}/my-submission`)
                .then(({ data: sub }) => sub ? [a.id, sub] : null)
                .catch(() => null)
            )
          );
          const map: Record<number, ExistingSubmission> = {};
          entries.forEach((e) => { if (e) map[e[0] as number] = e[1] as ExistingSubmission; });
          setSubmissions(map);
        }
      })
      .catch(() => {}) // teacher may get 403 if not author — silently skip
      .finally(() => setLoadingHW(false));
  }, [lessonId, isTeacher]);

  const handleSubmit = async (assignment: Assignment) => {
    const content = draftContent[assignment.id] || '';
    const link = draftLink[assignment.id] || '';

    if (!content.trim() && !link.trim()) {
      setErrors((p) => ({ ...p, [assignment.id]: t('homework', 'enterAnswer') }));
      return;
    }
    if (link && !/^https:\/\/(drive|docs)\.google\.com\//.test(link)) {
      setErrors((p) => ({ ...p, [assignment.id]: t('homework', 'invalidLink') }));
      return;
    }

    setErrors((p) => ({ ...p, [assignment.id]: '' }));
    setSubmitting(assignment.id);
    try {
      await apiClient.post(`/assignments/${assignment.id}/submit`, {
        ...(content.trim() ? { content: content.trim() } : {}),
        ...(link.trim() ? { google_drive_link: link.trim() } : {}),
      });
      // refresh submission
      const { data: sub } = await apiClient.get(`/assignments/${assignment.id}/my-submission`);
      setSubmissions((p) => ({ ...p, [assignment.id]: sub }));
      setSuccess((p) => ({ ...p, [assignment.id]: true }));
      setTimeout(() => setSuccess((p) => ({ ...p, [assignment.id]: false })), 3000);
    } catch (err: any) {
      setErrors((p) => ({ ...p, [assignment.id]: err.response?.data?.message || t('homework', 'submissionFailed') }));
    } finally {
      setSubmitting(null);
    }
  };

  if (loadingHW || assignments.length === 0) return null;

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 className="text-lg font-bold text-slate-900">
          {t('homework', 'title')} {assignments.length > 1 ? `(${assignments.length})` : ''}
        </h2>
      </div>

      {assignments.map((assignment) => {
        const existing = submissions[assignment.id];
        const isGraded = existing && existing.score != null;
        const isPending = existing && existing.score == null;
        const isOverdue = assignment.due_date && new Date(assignment.due_date) < new Date();
        const content = draftContent[assignment.id] ?? '';
        const link = draftLink[assignment.id] ?? '';

        return (
          <div key={assignment.id} className="bg-white rounded-2xl ring-1 ring-slate-200 shadow-sm overflow-hidden">
            {/* Assignment header */}
            <div className="p-5 border-b border-slate-100">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h3 className="font-semibold text-slate-900">{assignment.title}</h3>
                  {assignment.description && (
                    <p className="mt-1 text-sm text-slate-600">{assignment.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
                    {t('homework', 'maxPts')} {assignment.max_score} {t('homework', 'pts')}
                  </span>
                  {assignment.due_date && (
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      isOverdue ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {t('lessons', 'due')} {new Date(assignment.due_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-5">
              {/* Teacher view: show assignment info only */}
              {isTeacher ? (
                <p className="text-sm text-slate-500 italic">{t('homework', 'studentsCanSubmit')}</p>
              ) : isGraded ? (
                /* Already graded */
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-700 ring-1 ring-green-200">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {t('homework', 'graded')} {existing.score}/{assignment.max_score}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(existing.graded_at!).toLocaleDateString()}
                    </span>
                  </div>
                  {existing.feedback && (
                    <div className="bg-indigo-50 rounded-xl p-3 text-sm text-slate-700">
                      <p className="text-xs font-semibold text-indigo-500 mb-1">{t('homework', 'teacherFeedback')}</p>
                      {existing.feedback}
                    </div>
                  )}
                  <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-500">
                    <p className="font-medium mb-1">{t('homework', 'yourSubmission')}</p>
                    {existing.google_drive_link && (
                      <a href={existing.google_drive_link} target="_blank" rel="noopener noreferrer"
                        className="text-indigo-500 hover:underline flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        {t('homework', 'googleDriveLink')} ↗
                      </a>
                    )}
                    {existing.content && <p className="mt-1 whitespace-pre-wrap">{existing.content}</p>}
                  </div>
                </div>
              ) : isPending ? (
                /* Submitted, awaiting grade */
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                    {t('homework', 'submittedAwaiting')}
                  </span>
                  <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-500">
                    <p className="font-medium mb-1">{t('homework', 'yourSubmission')}</p>
                    {existing.google_drive_link && (
                      <a href={existing.google_drive_link} target="_blank" rel="noopener noreferrer"
                        className="text-indigo-500 hover:underline flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        {t('homework', 'googleDriveLink')} ↗
                      </a>
                    )}
                    {existing.content && <p className="mt-1 whitespace-pre-wrap">{existing.content}</p>}
                    <p className="mt-1 text-slate-400">
                      {t('homework', 'submitted')} {new Date(existing.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ) : (
                /* Not yet submitted */
                <div className="space-y-3">
                  {/* Text answer */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      {t('homework', 'writtenAnswer')}
                    </label>
                    <textarea
                      rows={4}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      placeholder={t('homework', 'typePlaceholder')}
                      value={content}
                      onChange={(e) => setDraftContent((p) => ({ ...p, [assignment.id]: e.target.value }))}
                    />
                  </div>

                  {/* OR divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-xs text-slate-400 font-medium">{t('homework', 'or')}</span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>

                  {/* Google Drive link */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      {t('homework', 'googleDriveLink')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </div>
                      <input
                        type="url"
                        className="w-full pl-9 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="https://drive.google.com/…"
                        value={link}
                        onChange={(e) => setDraftLink((p) => ({ ...p, [assignment.id]: e.target.value }))}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {t('homework', 'shareLinkHint')}
                    </p>
                  </div>

                  {errors[assignment.id] && (
                    <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                      {errors[assignment.id]}
                    </p>
                  )}
                  {success[assignment.id] && (
                    <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
                      {t('homework', 'submittedSuccess')}
                    </p>
                  )}

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSubmit(assignment)}
                      disabled={submitting === assignment.id}
                      className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60 transition-colors"
                    >
                      {submitting === assignment.id ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          {t('homework', 'submitting')}
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          {t('homework', 'submitHomework')}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
// ────────────────────────────────────────────────────────────────────────────

function LessonErrorState({ error, courseId }: { error: LessonError; courseId: number }) {
  const { t } = useTranslation();
  if (error.status === 403) {
    return (
      <div className="flex items-center justify-center h-full p-10">
        <div className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-amber-200 max-w-md w-full text-center space-y-4">
          <div className="text-5xl">🔒</div>
          <h2 className="text-xl font-bold text-slate-900">{t('lessons', 'lockedLesson')}</h2>
          <p className="text-sm text-slate-500">
            {t('lessons', 'lessonNotAvailableDesc')}
          </p>
          <Link
            href={`/dashboard/courses/${courseId}`}
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:underline"
          >
            ← {t('lessons', 'backToCourse')}
          </Link>
        </div>
      </div>
    );
  }

  if (error.status === 404) {
    return (
      <div className="flex items-center justify-center h-full p-10">
        <div className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-slate-200 max-w-md w-full text-center space-y-4">
          <div className="text-5xl">📭</div>
          <h2 className="text-xl font-bold text-slate-900">{t('lessons', 'lessonNotFound')}</h2>
          <p className="text-sm text-slate-500">
            {t('lessons', 'lessonNotFoundDesc')}
          </p>
          <Link
            href={`/dashboard/courses/${courseId}`}
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:underline"
          >
            ← {t('lessons', 'backToCourse')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full p-10">
      <div className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-red-200 max-w-md w-full text-center space-y-4">
        <div className="text-5xl">⚠️</div>
        <h2 className="text-xl font-bold text-slate-900">{t('lessons', 'somethingWentWrong')}</h2>
        <p className="text-sm text-slate-500">{error.message}</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500"
          >
            {t('common', 'retry')}
          </button>
          <Link
            href={`/dashboard/courses/${courseId}`}
            className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200"
          >
            {t('lessons', 'backToCourse')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LessonPage({ params }: { params: Promise<{ id: string; lessonId: string }> }) {
  const { id, lessonId: lessonIdStr } = use(params);
  const courseId = parseInt(id, 10);
  const currentLessonId = parseInt(lessonIdStr, 10);

  const { user } = useAppSelector((s) => s.auth);
  const isTeacher = user?.role === 'teacher';
  const { t } = useTranslation();

  const [curriculum, setCurriculum] = useState<any[]>([]);
  const [lesson, setLesson] = useState<any>(null);
  const [lessonProgress, setLessonProgress] = useState<Record<number, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [lessonError, setLessonError] = useState<LessonError | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const isCompleted = !!lessonProgress[currentLessonId];

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setLessonError(null);

      try {
        // Fetch curriculum (always works) and lesson detail separately
        // so a locked lesson doesn't kill the sidebar
        const curriculumRes = await apiClient.get(`/courses/${courseId}/curriculum`);
        if (!cancelled) setCurriculum(curriculumRes.data);
      } catch {
        if (!cancelled) setCurriculum([]);
      }

      try {
        const lessonRes = await apiClient.get(`/lessons/${currentLessonId}`);
        if (!cancelled) setLesson(lessonRes.data);
      } catch (err: any) {
        if (cancelled) return;
        const status = err.response?.status;
        if (status === 403) {
          setLessonError({ status: 403, message: t('lessons', 'notAvailableYet') });
        } else if (status === 404) {
          setLessonError({ status: 404, message: t('lessons', 'lessonNotFound') });
        } else {
          setLessonError({ status: 500, message: err.response?.data?.message || t('lessons', 'failedToLoad') });
        }
      }

      if (user?.role === 'student') {
        try {
          const { data } = await apiClient.get(`/courses/${courseId}/progress`);
          if (!cancelled) {
            const map: Record<number, boolean> = {};
            (data.completedLessons || []).forEach((lid: number) => { map[lid] = true; });
            setLessonProgress(map);
          }
        } catch {/* non-critical */}
      }

      if (!cancelled) setIsLoading(false);
    };

    load();
    return () => { cancelled = true; };
  }, [courseId, currentLessonId, user]);

  const handleCompleteLesson = async () => {
    if (isCompleted || isCompleting) return;
    setIsCompleting(true);
    try {
      await apiClient.post(`/lessons/${currentLessonId}/complete`);
      setLessonProgress((prev) => ({ ...prev, [currentLessonId]: true }));
      const { data } = await apiClient.get(`/courses/${courseId}/curriculum`);
      setCurriculum(data);
    } catch (err: any) {
      console.error('Mark complete failed:', err.response?.data?.message || err.message);
    } finally {
      setIsCompleting(false);
    }
  };

  const renderContent = () => {
    if (!lesson) return null;
    if (lesson.content_type === 'video') {
      const videoId = getYouTubeId(lesson.content || '');
      if (!videoId) {
        return (
          <div className="bg-white rounded-xl p-8 ring-1 ring-slate-200 text-center text-slate-500">
            <p className="font-medium">{t('lessons', 'invalidYoutubeUrl')}</p>
            {lesson.content && (
              <a href={lesson.content} target="_blank" rel="noopener noreferrer"
                className="mt-2 inline-block text-indigo-600 hover:underline text-sm">{lesson.content}</a>
            )}
          </div>
        );
      }
      return (
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}`}
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="p-4">
            <a href={lesson.content} target="_blank" rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-indigo-500 transition-colors">{lesson.content}</a>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl p-8 shadow-sm ring-1 ring-slate-200">
        {lesson.author_name && (
          <p className="text-xs text-slate-400 mb-5 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {t('lessons', 'author')} <span className="font-medium text-slate-600">{lesson.author_name}</span>
          </p>
        )}
        <div className="prose max-w-none">
          {lesson.content
            ? <MarkdownPreview content={lesson.content} />
            : <span className="italic text-slate-400">{t('lessons', 'noContent')}</span>}
        </div>
      </div>
    );
  };

  return (
    <ErrorBoundary context="Lesson">
      <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col md:flex-row -m-4 md:-m-8">
        {/* ── Sidebar ── */}
        <div className="w-full md:w-72 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-slate-200">
            <Link href={`/dashboard/courses/${courseId}`}
              className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              {t('lessons', 'backToCourse')}
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {curriculum.map((mod: any) => (
              <div key={mod.module_id}>
                <div className="flex items-center gap-1 mb-2">
                  {mod.is_final && <span className="text-xs">🏁</span>}
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {mod.module_title}
                  </h3>
                </div>
                <div className="space-y-1">
                  {mod.lessons.map((l: any, idx: number) => {
                    const isActive = l.id === currentLessonId;
                    const isDone = !!lessonProgress[l.id];
                    const isLocked = l.available_from && new Date(l.available_from) > new Date();

                    if (isLocked && !isTeacher) {
                      return (
                        <div key={l.id}
                          className="flex items-center px-3 py-2.5 rounded-lg opacity-40 cursor-not-allowed">
                          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center mr-3 text-xs text-slate-400 flex-shrink-0">🔒</div>
                          <div className="min-w-0">
                            <p className="truncate text-slate-500 text-xs font-medium">{l.title}</p>
                            <p className="text-[10px] text-slate-400">
                              {t('lessons', 'opensOn')} {new Date(l.available_from).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <Link key={l.id}
                        href={`/dashboard/courses/${courseId}/lessons/${l.id}`}
                        className={`flex items-center px-3 py-2.5 rounded-lg text-sm transition-colors ${
                          isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs font-semibold flex-shrink-0 ${
                          isDone ? 'bg-green-100 text-green-600'
                          : isActive ? 'bg-indigo-200 text-indigo-700'
                          : 'bg-slate-100 text-slate-500'
                        }`}>
                          {isDone ? (
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd" />
                            </svg>
                          ) : idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`truncate font-medium text-xs ${isDone ? 'line-through text-slate-400' : ''}`}>
                            {l.title}
                          </p>
                          <p className="text-[10px] opacity-60 capitalize mt-0.5">{l.content_type}</p>
                        </div>
                      </Link>
                    );
                  })}
                  {mod.lessons.length === 0 && (
                    <p className="text-xs text-slate-400 italic px-3">{t('lessons', 'noLessons')}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Main ── */}
        <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse space-y-4 w-full max-w-3xl p-10">
                <div className="h-8 bg-slate-200 rounded w-1/2" />
                <div className="h-4 bg-slate-200 rounded w-full" />
                <div className="h-4 bg-slate-200 rounded w-5/6" />
                <div className="h-64 bg-slate-200 rounded-xl" />
              </div>
            </div>
          ) : lessonError ? (
            <LessonErrorState error={lessonError} courseId={courseId} />
          ) : !lesson ? (
            <LessonErrorState error={{ status: 404, message: t('lessons', 'lessonNotFound') }} courseId={courseId} />
          ) : (
            <>
              {/* Header */}
              <div className="bg-white border-b border-slate-200 px-6 py-5 flex-shrink-0">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <h1 className="text-2xl font-bold text-slate-900 truncate">{lesson.title}</h1>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span className="capitalize">{lesson.content_type} {t('lessons', 'lesson')}</span>
                      {lesson.author_name && (
                        <>
                          <span>·</span>
                          <span>{t('lessons', 'by')} <strong className="text-slate-700">{lesson.author_name}</strong></span>
                        </>
                      )}
                      {lesson.deadline && (
                        <>
                          <span>·</span>
                          <span className={new Date(lesson.deadline) < new Date() ? 'text-red-500' : 'text-amber-600'}>
                            {t('lessons', 'due')} {new Date(lesson.deadline).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {!isTeacher && (
                    <button
                      onClick={handleCompleteLesson}
                      disabled={isCompleted || isCompleting}
                      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all flex-shrink-0 ${
                        isCompleted
                          ? 'bg-green-100 text-green-700 cursor-default ring-1 ring-green-200'
                          : isCompleting
                          ? 'bg-slate-100 text-slate-500 cursor-wait'
                          : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd" />
                          </svg>
                          {t('lessons', 'completed')}
                        </>
                      ) : isCompleting ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          {t('lessons', 'marking')}
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          {t('lessons', 'markComplete')}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10">
                <div className="mx-auto max-w-3xl">
                  {renderContent()}
                  {!isLoading && lesson && (
                    <HomeworkPanel lessonId={currentLessonId} isTeacher={isTeacher} />
                  )}
                  {!isLoading && lesson && (
                    <LessonMaterials
                      lessonId={currentLessonId}
                      courseId={courseId}
                      isTeacher={isTeacher}
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}