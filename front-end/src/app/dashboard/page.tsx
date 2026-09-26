'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen, CheckCircle2, Clock, Award, ChevronRight,
  Loader2, AlertCircle, Flame, Trophy,
  ArrowUpRight, Users, BarChart3, ClipboardList,
  Star, Zap, Target,
} from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import apiClient from '../../lib/api/client';
import { useTranslation } from '../../lib/i18n/useTranslation';

// ── Breakpoint hook ────────────────────────────────────────────────────────────

type BP = 'mobile' | 'tablet' | 'desktop';

function useBreakpoint(): BP {
  const [bp, setBp] = useState<BP>('desktop');
  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setBp(w < 640 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop');
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return bp;
}

// ── Types ──────────────────────────────────────────────────────────────────────

interface UserStats {
  total_courses: number;
  completed_courses: number;
  average_score: number;
}

interface EnrolledCourse {
  course_id: number;
  course_title: string;
  progress_pct: number | null;
  enrolled_at: string;
  completed: boolean;
  cover_url?: string | null;
}

interface TeacherCourse {
  id: number;
  title: string;
  cover_url?: string | null;
  student_count?: number;
  avg_score?: number | null;
  created_at: string;
}

interface PendingSubmission {
  submission_id: number;
  assignment_title: string;
  course_title: string;
  course_id: number;
  submitted_at: string;
}

// ── Palette ────────────────────────────────────────────────────────────────────

const PALETTE = [
  { bg: '#fef3c7', text: '#92400e' },
  { bg: '#ede9fe', text: '#4c1d95' },
  { bg: '#d1fae5', text: '#065f46' },
  { bg: '#dbeafe', text: '#1e3a8a' },
  { bg: '#fce7f3', text: '#831843' },
];

// ── Course thumbnail ──────────────────────────────────────────────────────────

function CourseThumbnail({
  index, title, coverUrl, badge, height = 160,
}: {
  index: number; title: string; coverUrl?: string | null; badge: string; height?: number;
}) {
  const pal = PALETTE[index % PALETTE.length];
  // Icon to show when no cover image — cycle through icons
  const PlaceholderIcons = [BookOpen, Trophy, Flame, Star, Target];
  const PlaceholderIcon = PlaceholderIcons[index % PlaceholderIcons.length];

  return (
    <div style={{ height, position: 'relative', overflow: 'hidden', background: pal.bg, flexShrink: 0 }}>
      {coverUrl ? (
        <img src={coverUrl} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      ) : (
        <>
          {/* Subtle decorative circles */}
          <div style={{ position: 'absolute', top: -32, right: -32, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.45)' }} />
          <div style={{ position: 'absolute', bottom: -24, left: -24, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <PlaceholderIcon style={{ width: 24, height: 24, color: pal.text, opacity: 0.7 }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: pal.text, opacity: 0.5, maxWidth: 120, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {title}
            </span>
          </div>
        </>
      )}
      <span style={{
        position: 'absolute', top: 10, left: 10,
        background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)', color: 'white',
        fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 99,
      }}>
        {badge}
      </span>
    </div>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div style={{ background: '#ede9ff', borderRadius: 99, height: 5, overflow: 'hidden' }}>
      <div style={{ width: `${Math.min(100, Math.max(0, pct))}%`, height: '100%', borderRadius: 99, background: 'linear-gradient(90deg,#7c3aed,#a855f7)', transition: 'width 0.7s ease' }} />
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ icon: Icon, title, sub, href, linkLabel }: {
  icon: React.ElementType; title: string; sub: string; href?: string; linkLabel?: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 16px', textAlign: 'center' }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
        <Icon style={{ width: 24, height: 24, color: '#c4b5fd' }} />
      </div>
      <p style={{ fontWeight: 700, color: '#1a1040', margin: '0 0 4px' }}>{title}</p>
      <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>{sub}</p>
      {href && linkLabel && (
        <Link href={href} style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 700, color: 'white', background: '#7c3aed', padding: '8px 18px', borderRadius: 99, textDecoration: 'none' }}>
          {linkLabel} <ArrowUpRight style={{ width: 14, height: 14 }} />
        </Link>
      )}
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, color, bg, compact }: {
  icon: React.ElementType; label: string; value: string | number; color: string; bg: string; compact?: boolean;
}) {
  return (
    <div style={{ background: 'white', border: '1px solid #f3f4f6', borderRadius: 18, padding: compact ? '14px 16px' : '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      <div style={{ width: compact ? 34 : 38, height: compact ? 34 : 38, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: compact ? 10 : 12 }}>
        <Icon style={{ width: compact ? 16 : 18, height: compact ? 16 : 18, color }} />
      </div>
      <p style={{ fontSize: compact ? 22 : 28, fontWeight: 800, color: '#0f172a', margin: '0 0 3px' }}>{value}</p>
      <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>{label}</p>
    </div>
  );
}

// ── Awaiting grades panel (shared) ────────────────────────────────────────────

function AwaitingGradesPanel({ loading, pendingGrades, t }: {
  loading: boolean; pendingGrades: any[]; t: (s: 'dashboard', k: any) => string;
}) {
  return (
    <div style={{ background: 'white', borderRadius: 20, border: '1px solid #f3f4f6', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #f9fafb' }}>
        <h2 style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', margin: 0 }}>{t('dashboard', 'awaitingGrades')}</h2>
        <Link href="/dashboard/grades" style={{ fontSize: 11, fontWeight: 600, color: '#d97706', background: '#fef3c7', padding: '4px 10px', borderRadius: 99, textDecoration: 'none' }}>
          {t('dashboard', 'allGrades')} →
        </Link>
      </div>
      {loading ? (
        <div style={{ padding: 20 }}>{[1, 2, 3].map(i => <div key={i} style={{ height: 50, borderRadius: 10, background: '#f9fafb', marginBottom: 8 }} />)}</div>
      ) : pendingGrades.length === 0 ? (
        <div style={{ padding: '28px 20px', textAlign: 'center' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
            <Award style={{ width: 20, height: 20, color: '#c4b5fd' }} />
          </div>
          <p style={{ fontWeight: 700, color: '#0f172a', fontSize: 13, margin: '0 0 3px' }}>{t('dashboard', 'noPendingTitle')}</p>
          <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{t('dashboard', 'noPendingSub')}</p>
        </div>
      ) : (
        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          {pendingGrades.map((s, idx) => (
            <li key={idx} style={{ borderBottom: idx < pendingGrades.length - 1 ? '1px solid #f9fafb' : 'none' }}>
              <Link href="/dashboard/grades"
                style={{ display: 'flex', gap: 10, padding: '12px 20px', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: '#fefce8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock style={{ width: 15, height: 15, color: '#eab308' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.assignment_title}</p>
                  <p style={{ fontSize: 11, color: '#9ca3af', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.course_title}</p>
                  <p style={{ fontSize: 11, color: '#c4b5fd', margin: 0 }}>{new Date(s.submitted_at).toLocaleDateString()}</p>
                </div>
                <span style={{ background: '#7c3aed', color: 'white', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99, flexShrink: 0, alignSelf: 'center', whiteSpace: 'nowrap' }}>
                  {t('dashboard', 'awaitingBadge')}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── CTA card ──────────────────────────────────────────────────────────────────

function CtaCard({ t }: { t: (s: 'dashboard', k: any) => string }) {
  return (
    <div style={{ background: 'linear-gradient(135deg,#6d28d9,#7c3aed)', borderRadius: 20, padding: '20px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -28, right: -28, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -20, left: -20, width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: '0 0 3px', position: 'relative', zIndex: 1 }}>{t('dashboard', 'wantMore')}</p>
      <p style={{ fontSize: 15, fontWeight: 700, color: 'white', margin: '0 0 16px', position: 'relative', zIndex: 1 }}>{t('dashboard', 'exploreAllCourses')}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 7, marginBottom: 16, position: 'relative', zIndex: 1 }}>
        {[
          { icon: BookOpen, bg: 'rgba(255,255,255,0.15)' },
          { icon: Star, bg: 'rgba(251,191,36,0.25)' },
          { icon: Zap, bg: 'rgba(255,255,255,0.12)' },
          { icon: Target, bg: 'rgba(52,211,153,0.25)' },
          { icon: Trophy, bg: 'rgba(251,191,36,0.2)' },
          { icon: Flame, bg: 'rgba(249,115,22,0.25)' },
          { icon: CheckCircle2, bg: 'rgba(52,211,153,0.2)' },
          { icon: Award, bg: 'rgba(255,255,255,0.12)' },
        ].map(({ icon: Icon, bg }, i) => (
          <div key={i} style={{ aspectRatio: '1', borderRadius: 9, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon style={{ width: 15, height: 15, color: 'rgba(255,255,255,0.85)' }} />
          </div>
        ))}
      </div>
      <Link href="/dashboard/courses" style={{ display: 'block', textAlign: 'center', background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: 13, fontWeight: 600, textDecoration: 'none', padding: 10, borderRadius: 11, border: '1px solid rgba(255,255,255,0.2)', position: 'relative', zIndex: 1 }}>
        {t('dashboard', 'exploreCatalog')}
      </Link>
    </div>
  );
}

// ── Teacher dashboard ──────────────────────────────────────────────────────────

function TeacherDashboard({ userId, t }: { userId: number; t: (section: 'dashboard', key: any) => string }) {
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';
  const isDesktop = bp === 'desktop';

  const [stats, setStats] = useState<UserStats | null>(null);
  const [courses, setCourses] = useState<TeacherCourse[]>([]);
  const [pending, setPending] = useState<PendingSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, coursesRes] = await Promise.all([
          apiClient.get('/analytics/me'),
          apiClient.get(`/courses?teacherId=${userId}`),
        ]);
        setStats(statsRes.data);
        const myCourses: TeacherCourse[] = coursesRes.data;
        setCourses(myCourses);
        const detailResults = await Promise.allSettled(
          myCourses.slice(0, 6).map((c) =>
            apiClient.get(`/analytics/courses/${c.id}`).then(({ data }) => ({
              id: c.id, student_count: data.students?.length ?? 0, avg_score: data.stats?.avg_score ?? null,
            }))
          )
        );
        const detailMap: Record<number, { student_count: number; avg_score: number | null }> = {};
        detailResults.forEach((r) => { if (r.status === 'fulfilled') detailMap[r.value.id] = r.value; });
        setCourses((prev) => prev.map((c) => ({ ...c, ...(detailMap[c.id] ?? {}) })));
        const subResults = await Promise.allSettled(
          myCourses.slice(0, 6).map((c) =>
            apiClient.get(`/courses/${c.id}/submissions`).then(({ data }) =>
              (data as any[]).filter((s: any) => s.grade_id === null || s.score === null || s.score === undefined)
                .map((s: any) => ({ ...s, course_title: c.title, course_id: c.id }))
            )
          )
        );
        const allPending: PendingSubmission[] = [];
        subResults.forEach((r) => { if (r.status === 'fulfilled') allPending.push(...r.value); });
        setPending(allPending.slice(0, 5));
      } catch (err: any) { setError(err.message || 'Failed to load'); }
      finally { setLoading(false); }
    };
    load();
  }, [userId]);

  const totalStudents = courses.reduce((s, c) => s + (c.student_count ?? 0), 0);
  const avgCompletion = stats && stats.total_courses > 0 ? Math.round((stats.completed_courses / stats.total_courses) * 100) : 0;

  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fef2f2', color: '#b91c1c', borderRadius: 16, padding: '16px 20px', fontSize: 14, border: '1px solid #fecaca' }}>
      <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} /> {error}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: isDesktop ? 'row' : 'column', gap: 24 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: 14, marginBottom: 24 }}>
          <StatCard icon={Users} label={t('dashboard', 'totalStudents')} value={loading ? '—' : totalStudents} color="#7c3aed" bg="#f5f3ff" compact={isMobile} />
          <StatCard icon={BookOpen} label={t('dashboard', 'activeCourses')} value={loading ? '—' : courses.length} color="#0ea5e9" bg="#e0f2fe" compact={isMobile} />
          <StatCard icon={BarChart3} label={t('dashboard', 'avgCompletionRate')} value={loading ? '—' : `${avgCompletion}%`} color="#10b981" bg="#d1fae5" compact={isMobile} />
        </div>

        {/* Courses list */}
        <div style={{ background: 'white', borderRadius: 20, border: '1px solid #f3f4f6', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginBottom: isDesktop ? 0 : 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #f9fafb' }}>
            <h2 style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', margin: 0 }}>{t('dashboard', 'yourCourses')}</h2>
            <Link href="/dashboard/manage-courses" style={{ fontSize: 12, fontWeight: 600, color: '#7c3aed', background: '#f5f3ff', padding: '5px 12px', borderRadius: 99, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
              {t('dashboard', 'manage')} <ArrowUpRight style={{ width: 12, height: 12 }} />
            </Link>
          </div>
          {loading ? (
            <div style={{ padding: 20 }}>{[1, 2, 3].map(i => <div key={i} style={{ height: 56, borderRadius: 12, background: '#f9fafb', marginBottom: 10 }} />)}</div>
          ) : courses.length === 0 ? (
            <EmptyState icon={BookOpen} title={t('dashboard', 'noCourseTitle')} sub={t('dashboard', 'noCourseSub')} href="/dashboard/manage-courses" linkLabel={t('dashboard', 'createCourse')} />
          ) : (
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {courses.slice(0, 6).map((course, idx) => (
                <li key={course.id} style={{ borderBottom: idx < Math.min(courses.length, 6) - 1 ? '1px solid #f9fafb' : 'none' }}>
                  <Link href={`/dashboard/courses/${course.id}`} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 24px', textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: PALETTE[idx % PALETTE.length].bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, color: PALETTE[idx % PALETTE.length].text }}>
                      {course.cover_url
                        ? <img src={course.cover_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : course.title.charAt(0).toUpperCase()
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course.title}</p>
                      <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                        {course.student_count != null ? `${course.student_count} ${t('dashboard', 'students')}` : t('dashboard', 'loading')}
                        {course.avg_score != null && ` · avg ${course.avg_score.toFixed(0)}%`}
                      </p>
                    </div>
                    <ChevronRight style={{ width: 15, height: 15, color: '#d1d5db', flexShrink: 0 }} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width: isDesktop ? 280 : '100%', flexShrink: 0 }}>
        <div style={{ background: 'white', borderRadius: 20, border: '1px solid #f3f4f6', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid #f9fafb' }}>
            <h2 style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', margin: 0 }}>{t('dashboard', 'pendingReviews')}</h2>
            <Link href="/dashboard/grading" style={{ fontSize: 11, fontWeight: 600, color: '#f97316', background: '#fff7ed', padding: '4px 10px', borderRadius: 99, textDecoration: 'none' }}>
              {t('dashboard', 'allLink')} →
            </Link>
          </div>
          {loading ? (
            <div style={{ padding: 20 }}>{[1, 2, 3].map(i => <div key={i} style={{ height: 50, borderRadius: 10, background: '#f9fafb', marginBottom: 8 }} />)}</div>
          ) : pending.length === 0 ? (
            <EmptyState icon={CheckCircle2} title={t('dashboard', 'allCaughtUp')} sub={t('dashboard', 'noSubmissions')} />
          ) : (
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {pending.map((s, idx) => (
                <li key={s.submission_id} style={{ borderBottom: idx < pending.length - 1 ? '1px solid #f9fafb' : 'none' }}>
                  <Link href="/dashboard/grading" style={{ display: 'flex', gap: 10, padding: '12px 20px', textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <ClipboardList style={{ width: 15, height: 15, color: '#f97316' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.assignment_title}</p>
                      <p style={{ fontSize: 11, color: '#9ca3af', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.course_title}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Student dashboard ──────────────────────────────────────────────────────────

function StudentDashboard({ userId, t }: { userId: number; t: (section: 'dashboard', key: any) => string }) {
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';
  const isTablet = bp === 'tablet';
  const isDesktop = bp === 'desktop';

  const [stats, setStats] = useState<UserStats | null>(null);
  const [enrollments, setEnrollments] = useState<EnrolledCourse[]>([]);
  const [pendingGrades, setPendingGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, enrollRes] = await Promise.all([
          apiClient.get('/analytics/me'),
          apiClient.get('/me/enrollments'),
        ]);
        setStats(statsRes.data);
        setEnrollments(enrollRes.data);
        const gradesRes = await apiClient.get('/me/grades/pending').catch(() => ({ data: [] }));
        setPendingGrades(gradesRes.data.slice(0, 5));
      } catch (err: any) { setError(err.message || 'Failed to load'); }
      finally { setLoading(false); }
    };
    load();
  }, [userId]);

  const inProgress = enrollments.filter((e) => !e.completed);
  const completed = enrollments.filter((e) => e.completed);
  const avgScore = stats?.average_score ? Number(stats.average_score).toFixed(0) : null;

  const BADGE_KEYS: Array<'catMachineLearning' | 'catProgramming' | 'catDesign' | 'catScience' | 'catCourse'> = [
    'catMachineLearning', 'catProgramming', 'catDesign', 'catScience', 'catCourse',
  ];

  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fef2f2', color: '#b91c1c', borderRadius: 16, padding: '16px 20px', fontSize: 14, border: '1px solid #fecaca' }}>
      <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} /> {error}
    </div>
  );

  const bannerTitle = inProgress.length > 0
    ? `${inProgress.length} ${inProgress.length === 1 ? t('dashboard', 'bannerCourseSingular') : t('dashboard', 'bannerCoursePlural')} ${t('dashboard', 'bannerCoursesWaiting')}`
    : t('dashboard', 'bannerStartToday');

  const bannerSub = [
    completed.length > 0 ? `${completed.length} ${t('dashboard', 'bannerCompletedCount')}` : null,
    avgScore ? `${t('dashboard', 'bannerAvgScore')}: ${avgScore}%` : null,
  ].filter(Boolean).join(' · ') || t('dashboard', 'noEnrolledSub');

  // Course card columns: 1 on mobile, 2 on tablet+
  const cardsColumns = isMobile ? '1fr' : '1fr 1fr';
  // Stats columns: 2 on mobile, 4 on tablet+
  const statsColumns = isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)';
  // Thumbnail height
  const thumbH = isMobile ? 130 : 160;

  return (
    <div style={{ display: 'flex', flexDirection: isDesktop ? 'row' : 'column', gap: 20, alignItems: isDesktop ? 'flex-start' : 'stretch' }}>

      {/* ── Main content ── */}
      <div style={{ flex: 1, minWidth: 0 }}>

        {/* Welcome banner */}
        <div style={{
          background: '#f0ebff',
          borderRadius: 20,
          padding: isMobile ? '20px 18px' : '26px 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: isMobile ? 16 : 20,
          position: 'relative',
          overflow: 'hidden',
          gap: 16,
        }}>
          <div style={{ position: 'absolute', top: -20, right: 140, width: 110, height: 110, borderRadius: '50%', background: 'rgba(124,58,237,0.06)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -30, left: 50, width: 70, height: 70, borderRadius: '50%', background: 'rgba(124,58,237,0.06)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
            <p style={{ fontSize: 13, color: '#7c3aed', fontWeight: 600, margin: '0 0 5px' }}>
              {inProgress.length > 0 ? t('dashboard', 'bannerKeepItUp') : t('dashboard', 'bannerWelcomeBack')}
            </p>
            <h2 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: '#1a1040', margin: '0 0 5px', lineHeight: 1.25 }}>
              {bannerTitle}
            </h2>
            <p style={{ fontSize: 13, color: '#7c6fa0', margin: '0 0 16px' }}>{bannerSub}</p>
            <Link href="/dashboard/courses" style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: '#7c3aed', color: 'white',
              fontSize: 13, fontWeight: 700, textDecoration: 'none',
              padding: '9px 18px', borderRadius: 99,
            }}>
              {t('dashboard', 'viewCoursesBtn')} <ArrowUpRight style={{ width: 13, height: 13 }} />
            </Link>
          </div>

          {/* Illustration — hidden on mobile */}
          {!isMobile && (
            <div style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}>
              <img
                src="/raising-hand.svg"
                alt="Student illustration"
                style={{ width: isTablet ? 130 : 170, height: isTablet ? 130 : 170, objectFit: 'contain', display: 'block' }}
              />
            </div>
          )}
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: statsColumns, gap: isMobile ? 10 : 14, marginBottom: isMobile ? 18 : 24 }}>
          <StatCard icon={BookOpen} label={t('dashboard', 'enrolledCourses')} value={loading ? '—' : enrollments.length} color="#7c3aed" bg="#f5f3ff" compact={isMobile} />
          <StatCard icon={CheckCircle2} label={t('dashboard', 'completed')} value={loading ? '—' : completed.length} color="#10b981" bg="#d1fae5" compact={isMobile} />
          <StatCard icon={Flame} label={t('dashboard', 'inProgress')} value={loading ? '—' : inProgress.length} color="#f59e0b" bg="#fef3c7" compact={isMobile} />
          <StatCard icon={Trophy} label={t('dashboard', 'avgScore')} value={loading ? '—' : (avgScore ? `${avgScore}%` : '—')} color="#0ea5e9" bg="#e0f2fe" compact={isMobile} />
        </div>

        {/* Continue Learning */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? 12 : 14 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>
            {t('dashboard', 'continueLearning')}
          </h2>
          <Link href="/dashboard/courses" style={{ fontSize: 12, fontWeight: 600, color: '#7c3aed', background: '#f5f3ff', padding: '5px 14px', borderRadius: 99, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
            {t('dashboard', 'allCourses')} <ArrowUpRight style={{ width: 12, height: 12 }} />
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: cardsColumns, gap: isMobile ? 12 : 16 }}>
            {[1, 2].map(i => <div key={i} style={{ borderRadius: 18, background: '#f9fafb', height: isMobile ? 200 : 240 }} />)}
          </div>
        ) : inProgress.length === 0 && completed.length === 0 ? (
          <div style={{ background: 'white', borderRadius: 18, border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <EmptyState icon={BookOpen} title={t('dashboard', 'noEnrolledTitle')} sub={t('dashboard', 'noEnrolledSub')} href="/dashboard/courses" linkLabel={t('dashboard', 'exploreCourses')} />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: cardsColumns, gap: isMobile ? 12 : 16 }}>
            {[...inProgress, ...completed.slice(0, 2)].slice(0, 6).map((enrollment, idx) => {
              const pct = enrollment.progress_pct ?? 0;
              const isDone = enrollment.completed;
              return (
                <Link key={enrollment.course_id} href={`/dashboard/courses/${enrollment.course_id}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <div
                    style={{ background: 'white', borderRadius: 18, border: '1px solid #f3f4f6', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'transform 0.15s,box-shadow 0.15s', cursor: 'pointer' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(124,58,237,0.12)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; }}
                  >
                    <CourseThumbnail
                      index={idx}
                      title={enrollment.course_title}
                      coverUrl={enrollment.cover_url}
                      badge={isDone ? `✓ ${t('dashboard', 'completedCheck')}` : t('dashboard', BADGE_KEYS[idx % BADGE_KEYS.length])}
                      height={thumbH}
                    />
                    <div style={{ padding: isMobile ? '12px 14px' : '16px 18px' }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {enrollment.course_title}
                      </p>
                      <ProgressBar pct={pct} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                        <span style={{ fontSize: 12, color: '#9ca3af' }}>
                          {isDone ? t('dashboard', 'completedCheck') : `${Math.round(pct)}${t('dashboard', 'percentComplete')}`}
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 800, color: isDone ? '#10b981' : '#7c3aed' }}>
                          {Math.round(pct)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* On mobile/tablet — show awaiting grades + CTA inline after courses */}
        {!isDesktop && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 12 : 16, marginTop: isMobile ? 16 : 20 }}>
            <AwaitingGradesPanel loading={loading} pendingGrades={pendingGrades} t={t} />
            <CtaCard t={t} />
          </div>
        )}
      </div>

      {/* ── Right panel (desktop only) ── */}
      {isDesktop && (
        <div style={{ width: 284, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <AwaitingGradesPanel loading={loading} pendingGrades={pendingGrades} t={t} />
          <CtaCard t={t} />
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAppSelector((s) => s.auth);
  const { t } = useTranslation();
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return t('dashboard', 'goodMorning');
    if (h < 18) return t('dashboard', 'goodAfternoon');
    return t('dashboard', 'goodEvening');
  };

  if (authLoading || !user) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
      <Loader2 style={{ width: 32, height: 32, color: '#7c3aed', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  return (
    <div>
      {/* Page header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: isMobile ? 18 : 24,
      }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 800, color: '#0f172a', margin: '0 0 3px' }}>
            {greeting()}, {user.email?.split('@')[0]}!
          </h1>
          <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
            {user.role === 'teacher' ? t('dashboard', 'subtitleTeacher') : t('dashboard', 'subtitleStudent')}
          </p>
        </div>
        {/* User pill — desktop & tablet only */}
        {!isMobile && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 9,
            background: 'white', border: '1px solid #f3f4f6',
            borderRadius: 14, padding: '9px 14px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)', flexShrink: 0,
          }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700 }}>
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>{user.email}</p>
              <p style={{ fontSize: 11, color: '#9ca3af', margin: 0, textTransform: 'capitalize', lineHeight: 1.3 }}>
                {user.role === 'teacher' ? t('profilePage', 'roleTeacher') : t('profilePage', 'roleStudent')}
              </p>
            </div>
          </div>
        )}
      </div>

      {user.role === 'teacher' ? (
        <TeacherDashboard userId={user.id} t={t} />
      ) : (
        <StudentDashboard userId={user.id} t={t} />
      )}
    </div>
  );
}