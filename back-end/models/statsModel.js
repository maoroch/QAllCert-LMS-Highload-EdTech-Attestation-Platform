export class StatsModel {
    constructor(pool) {
        this.pool = pool;
    }

    // Обновление статистики курса
    async updateCourseStats(courseId) {
        // Подсчёт активных студентов (enrolled, not dropped)
        const activeRes = await this.pool.query(
            `SELECT COUNT(*) FROM enrollments WHERE course_id = $1 AND status = 'active'`,
            [courseId]
        );
        const activeStudents = parseInt(activeRes.rows[0].count, 10);

        // Процент завершения (средний прогресс)
        const progressRes = await this.pool.query(
            `SELECT AVG(progress_percent) as avg_progress FROM enrollments WHERE course_id = $1 AND status = 'active'`,
            [courseId]
        );
        const completionRate = progressRes.rows[0].avg_progress || 0;

        // Средняя оценка по всем выполненным заданиям в этом курсе
        const scoreRes = await this.pool.query(
            `SELECT AVG(g.score) as avg_score
             FROM grades g
             JOIN submissions s ON g.submission_id = s.id
             JOIN assignments a ON s.assignment_id = a.id
             JOIN lessons l ON a.lesson_id = l.id
             JOIN modules m ON l.module_id = m.id
             WHERE m.course_id = $1`,
            [courseId]
        );
        const averageScore = scoreRes.rows[0].avg_score || 0;

        await this.pool.query(
            `INSERT INTO course_stats (course_id, completion_rate, average_score, active_students_count, updated_at)
             VALUES ($1, $2, $3, $4, NOW())
             ON CONFLICT (course_id) DO UPDATE
             SET completion_rate = EXCLUDED.completion_rate,
                 average_score = EXCLUDED.average_score,
                 active_students_count = EXCLUDED.active_students_count,
                 updated_at = NOW()`,
            [courseId, completionRate, averageScore, activeStudents]
        );
    }

    // Обновление статистики пользователя
    async updateUserStats(userId) {
        const totalCoursesRes = await this.pool.query(
            `SELECT COUNT(*) FROM enrollments WHERE user_id = $1`,
            [userId]
        );
        const totalCourses = parseInt(totalCoursesRes.rows[0].count, 10);

        const completedCoursesRes = await this.pool.query(
            `SELECT COUNT(*) FROM enrollments WHERE user_id = $1 AND status = 'completed'`,
            [userId]
        );
        const completedCourses = parseInt(completedCoursesRes.rows[0].count, 10);

        const avgScoreRes = await this.pool.query(
            `SELECT AVG(g.score) as avg_score
             FROM grades g
             JOIN submissions s ON g.submission_id = s.id
             WHERE s.user_id = $1`,
            [userId]
        );
        const averageScore = avgScoreRes.rows[0].avg_score || 0;

        await this.pool.query(
            `INSERT INTO user_stats (user_id, total_courses, completed_courses, average_score, updated_at)
             VALUES ($1, $2, $3, $4, NOW())
             ON CONFLICT (user_id) DO UPDATE
             SET total_courses = EXCLUDED.total_courses,
                 completed_courses = EXCLUDED.completed_courses,
                 average_score = EXCLUDED.average_score,
                 updated_at = NOW()`,
            [userId, totalCourses, completedCourses, averageScore]
        );
    }
}