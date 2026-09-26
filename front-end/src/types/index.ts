/**
 * Common Types for LMS Application
 * Mapped from PostgreSQL schema and Backend API Spec
 */

// ==========================================
// 1. Enums
// ==========================================
export type UserRole = 'student' | 'teacher' | 'admin';
export type EnrollmentStatus = 'active' | 'completed' | 'dropped';
export type LessonContentType = 'video' | 'text' | 'practice';
export type ProctoringSessionStatus = 'active' | 'ended' | 'flagged';

// ==========================================
// 2. Users & Auth
// ==========================================
export interface User {
    id: number;
    email: string;
    role: UserRole;
    email_verified?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface StudentProfile {
    id: number;
    user_id: number;
    full_name: string;
    avatar_url: string | null;
    metadata?: Record<string, any>;
}

export interface TeacherProfile {
    id: number;
    user_id: number;
    full_name: string;
    bio: string | null;
    avatar_url: string | null;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

// ==========================================
// 3. Courses, Modules, Lessons
// ==========================================
export interface Course {
    id: number;
    title: string;
    description: string;
    teacher_id: number;
    teacher_name?: string;
    cover_url?: string | null;
    is_published: boolean;
    price?: number | null;
    currency?: string;
    is_editable?: boolean;
    created_at: string;
    updated_at: string;
}

// ==========================================
// 9. Files / Storage
// ==========================================
export type FileType = 'course_cover' | 'lesson_material' | 'submission';

// ==========================================
// 10. Orders
// ==========================================
export type OrderStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
    id: number;
    user_id: number;
    course_id: number;
    course_title?: string;
    cover_url?: string | null;
    amount: number;
    currency: string;
    status: OrderStatus;
    payment_provider: string;
    provider_order_id?: string | null;
    created_at: string;
    updated_at: string;
}

export interface FileRecord {
    id: number;
    course_id?: number;
    lesson_id?: number;
    submission_id?: number;
    bucket: string;
    object_name: string;
    original_name: string;
    mime_type: string;
    size_bytes: number;
    file_type: FileType;
    public_url?: string | null;
    uploaded_by?: number;
    created_at: string;
}

export interface DownloadUrlResponse {
    url: string;
    expires_in: number | null;
}

export interface Module {
    id: number;
    course_id: number;
    title: string;
    order_index: number;
    created_at?: string;
    updated_at?: string;
}

export interface Lesson {
    id: number;
    module_id: number;
    title: string;
    content_type: LessonContentType;
    content: string; // text or URL
    order_index: number;
    created_at?: string;
    updated_at?: string;
}

// ==========================================
// 4. Enrollments & Progress
// ==========================================
export interface Enrollment {
    id: number;
    user_id: number;
    course_id: number;
    status: EnrollmentStatus;
    progress_percent: number;
    enrolled_at: string;
    updated_at?: string;
}

export interface LessonProgress {
    id: number;
    user_id: number;
    lesson_id: number;
    is_completed: boolean;
    completed_at: string | null;
    created_at?: string;
    updated_at?: string;
}

// ==========================================
// 5. Assignments
// ==========================================
export interface Assignment {
    id: number;
    lesson_id: number;
    title: string;
    description?: string;
    max_score: number;
    created_at?: string;
    updated_at?: string;
}

export interface Submission {
    id: number;
    assignment_id: number;
    user_id: number;
    content: string | null;
    google_drive_link: string | null;
    submitted_at: string;
    updated_at?: string;
    email?: string; // For teacher view
}

export interface Grade {
    id: number;
    submission_id: number;
    score: number;
    feedback?: string;
    graded_by: number | null;
    graded_at: string;
    created_at?: string;
    updated_at?: string;
}

// ==========================================
// 6. Certificates
// ==========================================
export interface Certificate {
    id: number;
    user_id: number;
    course_id: number;
    course_title?: string;
    issued_at: string;
    pdf_url: string;
    verification_code: string;
}

// ==========================================
// 7. Analytics
// ==========================================
export interface UserStats {
    total_courses: number;
    completed_courses: number;
    average_score: number;
}

export interface CourseStats {
    completion_rate: number;
    average_score: number;
    active_students_count: number;
    updated_at: string;
}

// ==========================================
// 8. API Common
// ==========================================
export interface ApiError {
    error: string;
    message?: string;
}
