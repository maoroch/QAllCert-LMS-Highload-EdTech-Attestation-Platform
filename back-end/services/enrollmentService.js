export class EnrollmentService {
    constructor(enrollmentModel, lessonProgressModel, courseModel, userModel, statsModel, lessonModel, moduleModel, pool, certificateModel) {
        this.enrollmentModel = enrollmentModel;
        this.lessonProgressModel = lessonProgressModel;
        this.courseModel = courseModel;
        this.userModel = userModel;
        this.statsModel = statsModel;
        this.lessonModel = lessonModel;
        this.moduleModel = moduleModel;
        this.pool = pool;
        // FIX: inject certificateModel so we can check for duplicates before queuing
        this.certificateModel = certificateModel;
    }

    async enrollUser(userId, courseId, skipPaymentCheck = false) {
        const course = await this.courseModel.findById(courseId);
        if (!course) throw new Error('Course not found');
        const existing = await this.enrollmentModel.findOne(userId, courseId);
        if (existing) throw new Error('Already enrolled');

        // Payment check: if course has a price, caller must confirm payment
        if (!skipPaymentCheck && course.price && Number(course.price) > 0) {
            throw new Error('This course requires payment. Please complete checkout first.');
        }

        return this.enrollmentModel.enroll(userId, courseId);
    }

    async getUserCourses(userId) {
        return this.enrollmentModel.findByUser(userId);
    }

    async completeLesson(userId, lessonId) {
        const progress = await this.lessonProgressModel.complete(userId, lessonId);

        const lesson = await this.lessonModel?.findById(lessonId);
        if (!lesson) return progress;

        const module = await this.moduleModel?.findById(lesson.module_id);
        if (!module) return progress;

        const courseId = module.course_id;

        // Calculate overall progress %
        const totalRes = await this.pool.query(
            `SELECT COUNT(*) FROM lessons l
             JOIN modules m ON l.module_id = m.id
             WHERE m.course_id = $1`,
            [courseId]
        );
        const totalLessons = parseInt(totalRes.rows[0].count, 10);
        const completedIds = await this.lessonProgressModel.getCompletedLessonIdsByUserAndCourse(userId, courseId);
        const percent = totalLessons
            ? Math.floor((completedIds.length / totalLessons) * 100)
            : 0;

        await this.enrollmentModel.updateProgress(userId, courseId, percent);

        if (percent === 100) {
            await this.enrollmentModel.updateStatus(userId, courseId, 'completed');

            // FIX: guard against duplicate certificate jobs
            // Only enqueue if a certificate doesn't already exist in the DB
            try {
                let alreadyIssued = false;
                if (this.certificateModel) {
                    const existing = await this.certificateModel.findByUserAndCourse(userId, courseId);
                    alreadyIssued = !!existing;
                }

                if (!alreadyIssued) {
                    const { addCertificateJob } = await import('../lib/queues.js');
                    await addCertificateJob(userId, courseId);
                } else {
                    console.log(`[Enrollment] Certificate already exists for user ${userId}, course ${courseId} — skipping job`);
                }
            } catch (err) {
                console.error('Failed to add certificate job:', err);
            }

            // Update analytics
            try {
                await this.statsModel?.updateCourseStats(courseId);
                await this.statsModel?.updateUserStats(userId);
            } catch (err) {
                console.error('Stats update failed (non-fatal):', err.message);
            }
        }

        return { ...progress, progressPercent: percent };
    }

    async getCourseProgress(userId, courseId) {
        const enrollment = await this.enrollmentModel.findOne(userId, courseId);
        if (!enrollment) throw new Error('Not enrolled');

        // Also return completed lesson IDs so the frontend can render sidebar checkmarks
        const completedLessons = await this.lessonProgressModel
            .getCompletedLessonIdsByUserAndCourse(userId, courseId);

        return {
            progressPercent: enrollment.progress_percent,
            status: enrollment.status,
            completedLessons,   // <-- NEW: used by lesson page sidebar
        };
    }
}