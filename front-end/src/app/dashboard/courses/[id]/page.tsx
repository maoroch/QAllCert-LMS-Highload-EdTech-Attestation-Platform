'use client';

import React, { useEffect, useState, use, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { fetchCourseById, clearCurrentCourse, updateCourse, deleteCourse, publishCourse, unpublishCourse } from '../../../../store/courses/coursesSlice';
import apiClient from '../../../../lib/api/client';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { MarkdownEditor } from '../../../../components/MarkdownEditor';
import { FileUploader } from '../../../../components/FileUploader';
import { useTranslation } from '../../../../lib/i18n/useTranslation';

interface LessonData {
  id: number;
  title: string;
  content_type: 'text' | 'video' | 'practice';
  content: string;
  order_index: number;
  available_from: string | null;
  deadline: string | null;
  author_name?: string;
}
interface ModuleData {
  module_id: number;
  module_title: string;
  is_final: boolean;
  completion_message: string | null;
  lessons: LessonData[];
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function DateTimeField({ label, value, onChange, required }: { label: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="datetime-local"
        required={required}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const courseId = parseInt(id, 10);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { currentCourse, isLoading, error } = useAppSelector((s) => s.courses);
  const { user } = useAppSelector((s) => s.auth);
  const isTeacher = user?.role === 'teacher';
  const { t } = useTranslation();

  const [curriculum, setCurriculum] = useState<ModuleData[]>([]);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState<string | null>(null);
  const [courseProgress, setCourseProgress] = useState<number>(0);

  // Completion modal (student finishes final module)
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  // Review modal (student)
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Course edit
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPrice, setEditPrice] = useState<string>('0');
  const [editCurrency, setEditCurrency] = useState('USD');
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Delete course
  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Add Module
  const [showAddModule, setShowAddModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleIsFinal, setNewModuleIsFinal] = useState(false);
  const [newModuleCompletionMsg, setNewModuleCompletionMsg] = useState('');
  const [isAddingModule, setIsAddingModule] = useState(false);

  // Add Lesson
  const [addLessonFor, setAddLessonFor] = useState<number | null>(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonType, setLessonType] = useState<'text' | 'video' | 'practice'>('text');
  const [lessonContent, setLessonContent] = useState('');
  const [lessonAvailableFrom, setLessonAvailableFrom] = useState('');
  const [lessonDeadline, setLessonDeadline] = useState('');
  const [isAddingLesson, setIsAddingLesson] = useState(false);

  // Edit Lesson
  const [editLesson, setEditLesson] = useState<LessonData | null>(null);
  const [editLessonTitle, setEditLessonTitle] = useState('');
  const [editLessonType, setEditLessonType] = useState<'text' | 'video' | 'practice'>('text');
  const [editLessonContent, setEditLessonContent] = useState('');
  const [editLessonAvailFrom, setEditLessonAvailFrom] = useState('');
  const [editLessonDeadline, setEditLessonDeadline] = useState('');
  const [isSavingLesson, setIsSavingLesson] = useState(false);

  // Add Assignment
  const [addAssignmentFor, setAddAssignmentFor] = useState<number | null>(null);
  const [assignTitle, setAssignTitle] = useState('');
  const [assignDesc, setAssignDesc] = useState('');
  const [assignMaxScore, setAssignMaxScore] = useState('100');
  const [assignDueDate, setAssignDueDate] = useState('');
  const [isAddingAssign, setIsAddingAssign] = useState(false);

  const toLocalDT = (iso: string | null) => iso ? iso.slice(0, 16) : '';

  const loadCurriculum = async () => {
    try {
      const { data } = await apiClient.get(`/courses/${courseId}/curriculum`);
      setCurriculum(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    dispatch(fetchCourseById(courseId));
    loadCurriculum();
    if (user?.role === 'student') {
      apiClient.get(`/courses/${courseId}/progress`)
        .then(({ data }) => {
          setEnrollmentStatus(data.status);
          setCourseProgress(data.progressPercent);
        }).catch(() => { });
    }
    return () => { dispatch(clearCurrentCourse()); };
  }, [dispatch, courseId, user]);

const handleEnroll = async () => {
  if (!currentCourse) return;
 
  // Free course — enroll directly via enrollment endpoint
  if (!currentCourse.price || Number(currentCourse.price) === 0) {
    setIsEnrolling(true);
    try {
      await apiClient.post(`/courses/${courseId}/enroll`);
      setEnrollmentStatus('active');
    } catch (err: any) {
      if (
        err.response?.data?.message === 'Already enrolled' ||
        err.response?.data?.error === 'You already have access to this course'
      ) {
        setEnrollmentStatus('active');
      } else {
        alert('Failed to enroll: ' + (err.response?.data?.message || err.message));
      }
    } finally {
      setIsEnrolling(false);
    }
    return;
  }
 
  // Paid course — redirect to the dedicated Stripe Checkout page
  // (no loading spinner needed; navigation is instant)
  router.push(`/dashboard/checkout/${courseId}`);
};
 





  // ── Claim certificate ──
  const handleClaimCertificate = async () => {
    setIsClaiming(true);
    try {
      await apiClient.post(`/courses/${courseId}/certificate`);
      setShowCompletionModal(false);
      router.push('/dashboard/certificates');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to generate certificate');
    } finally { setIsClaiming(false); }
  };

  // ── Review ──
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    try {
      await apiClient.post(`/courses/${courseId}/reviews`, {
        rating: reviewRating,
        comment: reviewComment,
      });
      setShowReviewModal(false);
      alert('Review submitted! Thank you.');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally { setIsSubmittingReview(false); }
  };

  // ── Course co-authors states ──
  const [coauthors, setCoauthors] = useState<any[]>([]);
  const [newCoauthorEmail, setNewCoauthorEmail] = useState('');
  const [isAddingCoauthor, setIsAddingCoauthor] = useState(false);
  const [coauthorError, setCoauthorError] = useState<string | null>(null);

  const fetchCoauthorsList = useCallback(async () => {
    try {
      const res = await apiClient.get(`/courses/${courseId}/coauthors`);
      setCoauthors(res.data);
    } catch (err) {
      console.error('Failed to fetch coauthors', err);
    }
  }, [courseId]);

  // ── Course edit/delete ──
  const openEditModal = () => {
    if (!currentCourse) return;
    setEditTitle(currentCourse.title);
    setEditDescription(currentCourse.description || '');
    setEditPrice(String(currentCourse.price ?? 0));
    setEditCurrency(currentCourse.currency || 'USD');
    setIsEditing(true);
    
    // Fetch co-authors if main owner or admin
    if (user?.role === 'admin' || (user && Number(currentCourse.teacher_id) === Number(user.id))) {
      fetchCoauthorsList();
      setCoauthorError(null);
      setNewCoauthorEmail('');
    }
  };
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const result = await dispatch(updateCourse({
      id: courseId,
      title: editTitle,
      description: editDescription,
      price: parseFloat(editPrice) || 0,
      currency: editCurrency,
    }));
    setIsSaving(false);
    if (updateCourse.fulfilled.match(result)) setIsEditing(false);
  };

  const handlePublishToggle = async () => {
    if (!currentCourse) return;
    const action = currentCourse.is_published ? unpublishCourse : publishCourse;
    const confirmMsg = currentCourse.is_published
      ? t('publishing', 'unpublishConfirm')
      : t('publishing', 'publishConfirm');
    if (!confirm(confirmMsg)) return;
    setIsPublishing(true);
    await dispatch(action(courseId));
    setIsPublishing(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await dispatch(deleteCourse(courseId));
    setIsDeleting(false);
    if (deleteCourse.fulfilled.match(result)) router.push('/dashboard/courses');
  };

  // ── Add module ──
  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleTitle.trim()) return;
    setIsAddingModule(true);
    try {
      await apiClient.post(`/courses/${courseId}/modules`, {
        title: newModuleTitle,
        isFinal: newModuleIsFinal,
        completionMessage: newModuleIsFinal ? newModuleCompletionMsg : null,
      });
      setNewModuleTitle(''); setNewModuleIsFinal(false); setNewModuleCompletionMsg('');
      setShowAddModule(false);
      await loadCurriculum();
    } catch (err: any) {
      alert('Failed: ' + (err.response?.data?.message || err.message));
    } finally { setIsAddingModule(false); }
  };

  const handleDeleteModule = async (moduleId: number) => {
    if (!confirm('Delete this module and all its lessons?')) return;
    try {
      await apiClient.delete(`/modules/${moduleId}`);
      await loadCurriculum();
    } catch (err: any) { alert('Failed: ' + (err.response?.data?.message || err.message)); }
  };

  // ── Add lesson ──
  const openAddLesson = (moduleId: number) => {
    setAddLessonFor(moduleId); setLessonTitle(''); setLessonType('text');
    setLessonContent(''); setLessonAvailableFrom(''); setLessonDeadline('');
  };
  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addLessonFor) return;
    if (!lessonAvailableFrom) return alert('Available from date is required.');
    if (!lessonDeadline) return alert('Deadline is required.');
    setIsAddingLesson(true);
    try {
      await apiClient.post(`/modules/${addLessonFor}/lessons`, {
        title: lessonTitle, contentType: lessonType, content: lessonContent,
        available_from: lessonAvailableFrom, deadline: lessonDeadline,
      });
      setAddLessonFor(null);
      await loadCurriculum();
    } catch (err: any) {
      alert('Failed: ' + (err.response?.data?.message || err.message));
    } finally { setIsAddingLesson(false); }
  };

  // ── Edit lesson ──
  const openEditLesson = (lesson: LessonData) => {
    setEditLesson(lesson); setEditLessonTitle(lesson.title);
    setEditLessonType(lesson.content_type); setEditLessonContent(lesson.content || '');
    setEditLessonAvailFrom(toLocalDT(lesson.available_from));
    setEditLessonDeadline(toLocalDT(lesson.deadline));
  };
  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editLesson) return;
    if (!editLessonAvailFrom) return alert('Available from date is required.');
    if (!editLessonDeadline) return alert('Deadline is required.');
    setIsSavingLesson(true);
    try {
      await apiClient.patch(`/lessons/${editLesson.id}`, {
        title: editLessonTitle, content_type: editLessonType, contentType: editLessonType,
        content: editLessonContent, available_from: editLessonAvailFrom, deadline: editLessonDeadline,
      });
      setEditLesson(null);
      await loadCurriculum();
    } catch (err: any) {
      alert('Failed: ' + (err.response?.data?.message || err.message));
    } finally { setIsSavingLesson(false); }
  };

  const handleDeleteLesson = async (lessonId: number) => {
    if (!confirm('Delete this lesson?')) return;
    try {
      await apiClient.delete(`/lessons/${lessonId}`);
      await loadCurriculum();
    } catch (err: any) { alert('Failed: ' + (err.response?.data?.message || err.message)); }
  };

  // ── Add assignment ──
  const openAddAssignment = (lessonId: number) => {
    setAddAssignmentFor(lessonId); setAssignTitle(''); setAssignDesc('');
    setAssignMaxScore('100'); setAssignDueDate('');
  };
  const handleAddAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addAssignmentFor) return;
    if (!assignDueDate) return alert('Deadline is required for assignments.');
    setIsAddingAssign(true);
    try {
      await apiClient.post(`/lessons/${addAssignmentFor}/assignments`, {
        title: assignTitle, description: assignDesc,
        max_score: parseFloat(assignMaxScore), due_date: assignDueDate,
      });
      setAddAssignmentFor(null);
    } catch (err: any) {
      alert('Failed: ' + (err.response?.data?.message || err.message));
    } finally { setIsAddingAssign(false); }
  };

  if (isLoading) {
    return <div className="animate-pulse space-y-8"><div className="h-48 bg-slate-200 rounded-3xl" /></div>;
  }
  if (error || !currentCourse) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-bold text-slate-900">{t('courses', 'failedToLoadCourse')}</h3>
        <Link href="/dashboard/courses" className="mt-4 inline-block text-indigo-600 hover:underline">&larr; {t('common', 'back')}</Link>
      </div>
    );
  }

  const isEnrolled = !!enrollmentStatus;
  const hasFinalModule = curriculum.some(m => m.is_final);

  return (
    <div className="space-y-8">
      {/* ── Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-16 sm:px-12 sm:py-24 shadow-xl">
        {currentCourse.cover_url && (
          <img
            src={currentCourse.cover_url}
            alt={currentCourse.title}
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-purple-800/90 mix-blend-multiply" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div className="max-w-2xl text-white">
            <Link href="/dashboard/courses" className="inline-flex items-center text-sm text-white/70 hover:text-white mb-6 transition-colors">
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>{t('courses', 'backToCourses')}
            </Link>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">{currentCourse.title}</h1>
            <p className="text-indigo-100">{currentCourse.description}</p>
            {currentCourse.teacher_name && (
              <p className="mt-3 text-sm text-white/70 flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {t('courses', 'instructor')}: <span className="font-semibold text-white">{currentCourse.teacher_name}</span>
              </p>
            )}

            {/* Student progress bar */}
            {isEnrolled && user?.role === 'student' && (
              <div className="mt-6">
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>{t('courses', 'yourProgress')}</span><span>{courseProgress}%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full">
                  <div className="h-2 bg-white rounded-full transition-all" style={{ width: `${courseProgress}%` }} />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 flex-shrink-0">
            {isTeacher && currentCourse?.is_editable ? (
              <>
                <Button variant="secondary" size="lg" onClick={openEditModal}>✏️ {t('courses', 'editCourse')}</Button>
                <button
                  onClick={handlePublishToggle}
                  disabled={isPublishing}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm disabled:opacity-60 ${currentCourse.is_published
                    ? 'bg-amber-500 hover:bg-amber-400 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                >
                  {isPublishing ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : currentCourse.is_published ? (
                    <>📤 {t('publishing', 'unpublish')}</>
                  ) : (
                    <>🚀 {t('publishing', 'publish')}</>
                  )}
                </button>
                {(user?.role === 'admin' || (user && Number(currentCourse.teacher_id) === Number(user.id))) && (
                  <Button variant="ghost" size="lg" className="bg-red-500/20 hover:bg-red-500/40 text-white" onClick={() => setIsDeleteConfirm(true)}>🗑 {t('common', 'delete')}</Button>
                )}
              </>
            ) : isTeacher ? (
              <div className="text-sm bg-white/10 text-white/90 px-4 py-2.5 rounded-xl border border-white/20 text-center font-medium">
                👁️ {t('courses', 'readOnlyAccess')}
              </div>
            ) : isEnrolled ? (
              <>
                {enrollmentStatus === 'completed' && hasFinalModule && (
                  <Button variant="secondary" size="lg" onClick={() => setShowCompletionModal(true)}>🎓 {t('courses', 'claimCertificate')}</Button>
                )}
                <Button variant="ghost" size="lg" className="bg-white/10 hover:bg-white/20 text-white" onClick={() => setShowReviewModal(true)}>⭐ {t('courses', 'leaveReview')}</Button>
              </>
            ) : (
              <Button variant="secondary" size="lg" onClick={handleEnroll} disabled={isEnrolling}>
                {isEnrolling ? t('courses', 'enrolling') : t('courses', 'enroll')}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── Curriculum ── */}
      <section className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">{t('courses', 'curriculum')}</h2>
          {isTeacher && currentCourse?.is_editable && <Button variant="outline" size="sm" onClick={() => setShowAddModule(true)}>{t('courses', 'addModule')}</Button>}
        </div>

        {curriculum.length === 0 ? (
          <div className="text-center py-10 text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
            {isTeacher ? t('courses', 'noModulesTeacher') : t('courses', 'noContentAvailable')}
          </div>
        ) : !isEnrolled && user?.role === 'student' ? (
          /* ── Paywall: student not enrolled ── */
          <div className="space-y-4">
            {curriculum.map((mod) => (
              <div key={mod.module_id} className={`border rounded-xl overflow-hidden ${mod.is_final ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'}`}>
                {/* Module header — always visible */}
                <div className={`px-4 py-3 flex justify-between items-center ${mod.is_final ? 'bg-amber-50' : 'bg-slate-50'}`}>
                  <div className="flex items-center gap-2">
                    {mod.is_final && <span className="text-sm">🏁</span>}
                    <span className="font-semibold text-slate-900">{mod.module_title}</span>
                    {mod.is_final && (
                      <span className="text-xs bg-amber-200 text-amber-800 rounded-full px-2 py-0.5">{t('courses', 'finalModule')}</span>
                    )}
                  </div>
                  <span className="text-sm text-slate-500">{mod.lessons.length} {t('courses', 'lessonsCount')}</span>
                </div>

                {/* Locked lessons preview */}
                <div className="relative">
                  {/* Blurred ghost rows */}
                  <div className="divide-y divide-slate-100 select-none pointer-events-none" style={{ filter: 'blur(3px)', userSelect: 'none' }}>
                    {mod.lessons.slice(0, 3).map((lesson, idx) => (
                      <div key={lesson.id} className="flex items-center px-4 py-3">
                        <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-semibold mr-3 flex-shrink-0">{idx + 1}</div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{lesson.title}</p>
                          <p className="text-xs text-slate-400 capitalize">{lesson.content_type}</p>
                        </div>
                      </div>
                    ))}
                    {mod.lessons.length > 3 && (
                      <div className="px-4 py-2 text-xs text-slate-400">+{mod.lessons.length - 3} уроков…</div>
                    )}
                  </div>
                  {/* Lock overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[2px] rounded-b-xl gap-3 py-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="text-sm font-semibold">
                        {t('courses', 'enrollToAccess') || 'Запишитесь на курс, чтобы открыть уроки'}
                      </span>
                    </div>
                    <button
                      onClick={handleEnroll}
                      disabled={isEnrolling}
                      className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg hover:bg-indigo-700 disabled:opacity-60 transition-all"
                    >
                      {isEnrolling ? t('courses', 'enrolling') : t('courses', 'enroll')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {curriculum.map((mod) => (
              <div key={mod.module_id} className={`border rounded-xl overflow-hidden ${mod.is_final ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'}`}>
                {/* Module header */}
                <div className={`px-4 py-3 flex justify-between items-center ${mod.is_final ? 'bg-amber-50' : 'bg-slate-50'}`}>
                  <div className="flex items-center gap-2">
                    {mod.is_final && <span className="text-sm">🏁</span>}
                    <span className="font-semibold text-slate-900">{mod.module_title}</span>
                    {mod.is_final && (
                      <span className="text-xs bg-amber-200 text-amber-800 rounded-full px-2 py-0.5">{t('courses', 'finalModule')}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">{mod.lessons.length} {t('courses', 'lessonsCount')}</span>
                    {isTeacher && currentCourse?.is_editable && (
                      <>
                        <button onClick={() => openAddLesson(mod.module_id)} className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-2 py-1 rounded transition-colors">{t('courses', 'addLesson')}</button>
                        <button onClick={() => handleDeleteModule(mod.module_id)} className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors">{t('common', 'delete')}</button>
                      </>
                    )}
                  </div>
                </div>

                {/* Final module completion card for students */}
                {mod.is_final && user?.role === 'student' && isEnrolled && (
                  <div className="px-4 py-3 bg-amber-50/50 border-b border-amber-100">
                    <p className="text-sm text-amber-800 italic">
                      {mod.completion_message || t('courses', 'completionMsgFallback')}
                    </p>
                    {enrollmentStatus === 'completed' && (
                      <button
                        onClick={() => setShowCompletionModal(true)}
                        className="mt-2 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
                      >
                        {t('courses', 'claimCertBtn')}
                      </button>
                    )}
                  </div>
                )}

                {/* Lessons */}
                <div className="divide-y divide-slate-100">
                  {mod.lessons.map((lesson, idx) => {
                    const isLocked = lesson.available_from && new Date(lesson.available_from) > new Date();
                    const isPastDeadline = lesson.deadline && new Date(lesson.deadline) < new Date();
                    return (
                      <div key={lesson.id} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center flex-1 min-w-0 group">
                          {isLocked && user?.role === 'student' ? (
                            <div className="flex items-center flex-1 min-w-0 opacity-50 cursor-not-allowed">
                              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold mr-3 flex-shrink-0 text-slate-400">🔒</div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-slate-500 truncate">{lesson.title}</p>
                                <p className="text-xs text-slate-400">{t('courses', 'opensForStudents')} {new Date(lesson.available_from!).toLocaleDateString()}</p>
                              </div>
                            </div>
                          ) : (
                            <Link href={`/dashboard/courses/${courseId}/lessons/${lesson.id}`} className="flex items-center flex-1 min-w-0">
                              <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-semibold mr-3 flex-shrink-0">{idx + 1}</div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-slate-800 group-hover:text-indigo-600 transition-colors truncate">{lesson.title}</p>
                                <div className="flex items-center gap-3 mt-0.5">
                                  <p className="text-xs text-slate-400 capitalize">{lesson.content_type}</p>
                                  {lesson.author_name && (
                                    <p className="text-xs text-slate-400">{t('lessons', 'by')} {lesson.author_name}</p>
                                  )}
                                  {lesson.deadline && (
                                    <p className={`text-xs ${isPastDeadline ? 'text-red-400' : 'text-amber-500'}`}>
                                      {t('lessons', 'due')} {new Date(lesson.deadline).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </Link>
                          )}
                        </div>
                        {isTeacher && currentCourse?.is_editable && (
                          <div className="flex items-center gap-1 ml-3 flex-shrink-0">
                            <button onClick={() => openAddAssignment(lesson.id)} className="text-xs text-amber-600 hover:bg-amber-50 px-2 py-1 rounded">{t('courses', 'addAssignment')}</button>
                            <button onClick={() => openEditLesson(lesson)} className="text-xs text-slate-500 hover:bg-slate-100 px-2 py-1 rounded">{t('common', 'edit')}</button>
                            <button onClick={() => handleDeleteLesson(lesson.id)} className="text-xs text-red-400 hover:bg-red-50 px-2 py-1 rounded">{t('common', 'delete')}</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {mod.lessons.length === 0 && (
                    <div className="px-4 py-3 text-sm text-slate-400 italic">{t('courses', 'noLessonsYet')}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ══ MODALS ══════════════════════════════════ */}

      {/* Completion / Certificate modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md text-center p-8 space-y-5">
            <div className="text-7xl">🎓</div>
            <h2 className="text-2xl font-extrabold text-slate-900">{t('certificates', 'courseCompleted')}</h2>
            <p className="text-slate-600">
              {t('courses', 'courseCompletedDesc').replace('{courseTitle}', currentCourse.title)}
            </p>
            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={handleClaimCertificate}
                disabled={isClaiming}
                className="w-full rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-base font-bold text-white hover:from-amber-500 hover:to-orange-600 disabled:opacity-60 transition-all shadow-lg shadow-amber-200"
              >
                {isClaiming ? t('certificates', 'generating') : t('courses', 'getCertBtn')}
              </button>
              <button onClick={() => setShowCompletionModal(false)} className="text-sm text-slate-500 hover:text-slate-700">{t('common', 'close')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Review modal */}
      {showReviewModal && (
        <Modal title={t('courses', 'leaveReview')} onClose={() => setShowReviewModal(false)}>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('courses', 'ratingLabel')}</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setReviewRating(n)}
                    className={`text-2xl transition-transform hover:scale-110 ${n <= reviewRating ? 'opacity-100' : 'opacity-30'}`}>
                    ⭐
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('courses', 'commentOptional')}</label>
              <textarea rows={4} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder={t('courses', 'commentPlaceholder')}
                value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setShowReviewModal(false)}>{t('common', 'cancel')}</Button>
              <Button type="submit" variant="primary" isLoading={isSubmittingReview}>{t('courses', 'submitReview') || t('common', 'submit')}</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Course */}
      {isEditing && (
        <Modal title={t('courses', 'editCourseTitle') || t('courses', 'editCourse')} onClose={() => setIsEditing(false)}>
          <form onSubmit={handleSaveEdit} className="space-y-4">
            {/* Cover image upload */}
            <FileUploader
              variant="cover"
              label={t('files', 'uploadCover')}
              hint={t('files', 'coverHint')}
              accept="image/jpeg,image/png,image/webp,image/gif"
              maxSizeMB={5}
              currentUrl={currentCourse?.cover_url}
              onUpload={async (file) => {
                const form = new FormData();
                form.append('cover', file);
                await apiClient.post(`/courses/${courseId}/cover`, form, {
                  headers: { 'Content-Type': 'multipart/form-data' },
                });
                dispatch(fetchCourseById(courseId));
              }}
            />
            <Input label={t('courses', 'courseTitle')} required value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('courses', 'description')}</label>
              <textarea required rows={4} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('pricing', 'price')}</label>
                <input
                  type="number" min="0" step="0.01"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                />
                <p className="text-xs text-slate-400 mt-1">0 = {t('pricing', 'free')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('pricing', 'currency')}</label>
                <select
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={editCurrency}
                  onChange={(e) => setEditCurrency(e.target.value)}
                >
                  <option value="USD">USD — $</option>
                  <option value="KZT">KZT — ₸</option>
                  <option value="RUB">RUB — ₽</option>
                  <option value="EUR">EUR — €</option>
                </select>
              </div>
            </div>

            {/* Co-authors management (owner/admin only) */}
            {currentCourse && (user?.role === 'admin' || (user && Number(currentCourse.teacher_id) === Number(user.id))) && (
              <div className="border-t border-slate-200 pt-4 space-y-3">
                <h4 className="text-sm font-semibold text-slate-800">
                  {t('courses', 'coauthors') || 'Соавторы курса'}
                </h4>
                
                {/* List of co-authors */}
                {coauthors.length > 0 ? (
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {coauthors.map((coauthor) => (
                      <div key={coauthor.id} className="flex items-center justify-between bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 text-xs">
                        <div>
                          <span className="font-medium text-slate-800">{coauthor.full_name || 'No Name'}</span>
                          <span className="text-slate-400 ml-1.5">({coauthor.email})</span>
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await apiClient.delete(`/courses/${courseId}/coauthors/${coauthor.id}`);
                              fetchCoauthorsList();
                            } catch (err) {
                              console.error('Failed to remove coauthor', err);
                            }
                          }}
                          className="text-red-500 hover:text-red-700 font-semibold"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    {t('courses', 'noCoauthors') || 'У этого курса пока нет соавторов.'}
                  </p>
                )}

                {/* Add co-author form */}
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder={t('courses', 'enterCoauthorEmail') || 'Email преподавателя'}
                    className="flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newCoauthorEmail}
                    onChange={(e) => {
                      setNewCoauthorEmail(e.target.value);
                      setCoauthorError(null);
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isAddingCoauthor}
                    onClick={async () => {
                      if (!newCoauthorEmail.trim()) return;
                      setIsAddingCoauthor(true);
                      setCoauthorError(null);
                      try {
                        await apiClient.post(`/courses/${courseId}/coauthors`, { email: newCoauthorEmail.trim() });
                        setNewCoauthorEmail('');
                        fetchCoauthorsList();
                      } catch (err: any) {
                        const errMsg = err.response?.data?.error || 'Failed to add coauthor';
                        setCoauthorError(errMsg);
                      } finally {
                        setIsAddingCoauthor(false);
                      }
                    }}
                  >
                    {t('common', 'add') || 'Добавить'}
                  </Button>
                </div>
                {coauthorError && (
                  <p className="text-xs text-red-500">{coauthorError}</p>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>{t('common', 'cancel')}</Button>
              <Button type="submit" variant="primary" isLoading={isSaving}>{t('common', 'save')}</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Course */}
      {isDeleteConfirm && (
        <Modal title={t('courses', 'deleteCourseTitle') || t('courses', 'deleteCourse')} onClose={() => setIsDeleteConfirm(false)}>
          <div className="space-y-4">
            <p className="text-sm text-slate-700" dangerouslySetInnerHTML={{ __html: t('courses', 'deleteConfirm').replace('{courseTitle}', `<strong>${currentCourse.title}</strong>`) }}></p>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsDeleteConfirm(false)}>{t('common', 'cancel')}</Button>
              <button onClick={handleDelete} disabled={isDeleting} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium disabled:opacity-50">
                {isDeleting ? t('courses', 'deleting') : t('common', 'delete')}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Module */}
      {showAddModule && (
        <Modal title={t('courses', 'addModuleTitle')} onClose={() => setShowAddModule(false)}>
          <form onSubmit={handleAddModule} className="space-y-4">
            <Input label={t('courses', 'moduleTitleLabel')} required placeholder={t('courses', 'moduleTitlePlaceholder')} value={newModuleTitle} onChange={(e) => setNewModuleTitle(e.target.value)} />
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded" checked={newModuleIsFinal} onChange={(e) => setNewModuleIsFinal(e.target.checked)} />
              <span className="text-sm font-medium text-slate-700">{t('courses', 'markFinalModule')}</span>
            </label>
            {newModuleIsFinal && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('courses', 'completionMsgLabel')}</label>
                <textarea rows={3} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder={t('courses', 'completionMsgPlaceholder')}
                  value={newModuleCompletionMsg} onChange={(e) => setNewModuleCompletionMsg(e.target.value)} />
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setShowAddModule(false)}>{t('common', 'cancel')}</Button>
              <Button type="submit" variant="primary" isLoading={isAddingModule}>{t('courses', 'addModuleTitle') || t('courses', 'addModule')}</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Lesson */}
      {addLessonFor !== null && (
        <Modal title={t('courses', 'addLessonTitle')} onClose={() => setAddLessonFor(null)}>
          <form onSubmit={handleAddLesson} className="space-y-4">
            <Input label={t('courses', 'lessonTitleLabel')} required placeholder={t('courses', 'lessonTitlePlaceholder')} value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('courses', 'typeLabel')}</label>
              <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={lessonType} onChange={(e) => setLessonType(e.target.value as any)}>
                <option value="text">📝 {t('lessons', 'textLesson')}</option>
                <option value="video">🎬 {t('lessons', 'videoLesson')}</option>
                <option value="practice">💻 {t('lessons', 'practiceLesson')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{lessonType === 'video' ? t('courses', 'youtubeUrl') : t('courses', 'contentLabel')}</label>
              {lessonType === 'video'
                ? <Input type="url" placeholder="https://www.youtube.com/watch?v=..." value={lessonContent} onChange={(e) => setLessonContent(e.target.value)} />
                : <MarkdownEditor value={lessonContent} onChange={setLessonContent} minHeight={280} placeholder={'# Lecture Title\n\nWrite your lecture content here…\n\n## Section\n\nUse **bold**, _italic_, `code`, lists, tables and more.'} />
              }
            </div>
            <div className="grid grid-cols-2 gap-4">
              <DateTimeField label={t('courses', 'opensForStudents')} required value={lessonAvailableFrom} onChange={setLessonAvailableFrom} />
              <DateTimeField label={t('courses', 'deadlineLabel')} required value={lessonDeadline} onChange={setLessonDeadline} />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setAddLessonFor(null)}>{t('common', 'cancel')}</Button>
              <Button type="submit" variant="primary" isLoading={isAddingLesson}>{t('courses', 'addLessonTitle')}</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Lesson */}
      {editLesson && (
        <Modal title={t('courses', 'editLessonTitle')} onClose={() => setEditLesson(null)}>
          <form onSubmit={handleSaveLesson} className="space-y-4">
            <Input label={t('courses', 'lessonTitleLabel') || t('courses', 'assignTitleLabel')} required value={editLessonTitle} onChange={(e) => setEditLessonTitle(e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('courses', 'typeLabel')}</label>
              <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={editLessonType} onChange={(e) => setEditLessonType(e.target.value as any)}>
                <option value="text">📝 {t('lessons', 'textLesson')}</option>
                <option value="video">🎬 {t('lessons', 'videoLesson')}</option>
                <option value="practice">💻 {t('lessons', 'practiceLesson')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{editLessonType === 'video' ? t('courses', 'youtubeUrl') : t('courses', 'contentLabel')}</label>
              {editLessonType === 'video'
                ? <Input type="url" value={editLessonContent} onChange={(e) => setEditLessonContent(e.target.value)} />
                : <MarkdownEditor value={editLessonContent} onChange={setEditLessonContent} minHeight={280} />
              }
            </div>
            <div className="grid grid-cols-2 gap-4">
              <DateTimeField label={t('courses', 'opensForStudents')} required value={editLessonAvailFrom} onChange={setEditLessonAvailFrom} />
              <DateTimeField label={t('courses', 'deadlineLabel')} required value={editLessonDeadline} onChange={setEditLessonDeadline} />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setEditLesson(null)}>{t('common', 'cancel')}</Button>
              <Button type="submit" variant="primary" isLoading={isSavingLesson}>{t('common', 'save')}</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Assignment */}
      {addAssignmentFor !== null && (
        <Modal title={t('courses', 'addAssignmentTitle')} onClose={() => setAddAssignmentFor(null)}>
          <form onSubmit={handleAddAssignment} className="space-y-4">
            <Input label={t('courses', 'assignTitleLabel')} required value={assignTitle} onChange={(e) => setAssignTitle(e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('courses', 'assignDescLabel')}</label>
              <textarea rows={3} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={assignDesc} onChange={(e) => setAssignDesc(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label={t('courses', 'maxScoreLabel')} type="number" min="1" required value={assignMaxScore} onChange={(e) => setAssignMaxScore(e.target.value)} />
              <DateTimeField label={t('courses', 'deadlineLabel')} required value={assignDueDate} onChange={setAssignDueDate} />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setAddAssignmentFor(null)}>{t('common', 'cancel')}</Button>
              <Button type="submit" variant="primary" isLoading={isAddingAssign}>{t('courses', 'addAssignmentTitle')}</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}