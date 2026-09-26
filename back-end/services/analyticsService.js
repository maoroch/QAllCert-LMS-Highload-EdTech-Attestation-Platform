export class AnalyticsService {
    constructor(statsModel, enrollmentModel, gradeModel, assignmentModel, courseModel) {
        this.statsModel = statsModel;
        this.enrollmentModel = enrollmentModel;
        this.gradeModel = gradeModel;
        this.assignmentModel = assignmentModel;
        this.courseModel = courseModel;
    }

    async getUserAnalytics(userId) {
        const stats = await this.statsModel.pool.query(
            `SELECT * FROM user_stats WHERE user_id = $1`,
            [userId]
        );
        return stats.rows[0] || { total_courses: 0, completed_courses: 0, average_score: 0 };
    }

    async getCourseAnalyticsForTeacher(courseId, teacherId, userRole) {
        const course = await this.courseModel.findById(courseId);
        if (!course) throw new Error('Course not found');
        if (userRole !== 'admin' && course.teacher_id !== teacherId) throw new Error('Not authorized');
        const stats = await this.statsModel.pool.query(
            `SELECT * FROM course_stats WHERE course_id = $1`,
            [courseId]
        );
        const enrollments = await this.enrollmentModel.findByCourse(courseId);
        return { stats: stats.rows[0], students: enrollments };
    }

    async refreshCourseStats(courseId) {
        await this.statsModel.updateCourseStats(courseId);
    }

    async refreshUserStats(userId) {
        await this.statsModel.updateUserStats(userId);
    }
}