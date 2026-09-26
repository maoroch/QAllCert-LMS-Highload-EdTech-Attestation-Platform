export class LessonProgressModel {
    constructor(pool) {
        this.pool = pool;
    }

    async complete(userId, lessonId) {
        const existing = await this.pool.query(
            `SELECT * FROM lesson_progress WHERE user_id = $1 AND lesson_id = $2`,
            [userId, lessonId]
        );
        if (existing.rows[0] && existing.rows[0].is_completed) {
            return existing.rows[0];
        }
        if (existing.rows[0]) {
            const result = await this.pool.query(
                `UPDATE lesson_progress SET is_completed = true, completed_at = NOW(), updated_at = NOW()
                 WHERE user_id = $1 AND lesson_id = $2 RETURNING *`,
                [userId, lessonId]
            );
            return result.rows[0];
        } else {
            const result = await this.pool.query(
                `INSERT INTO lesson_progress (user_id, lesson_id, is_completed, completed_at)
                 VALUES ($1, $2, true, NOW()) RETURNING *`,
                [userId, lessonId]
            );
            return result.rows[0];
        }
    }

    async findByUserAndLesson(userId, lessonId) {
        const result = await this.pool.query(
            `SELECT * FROM lesson_progress WHERE user_id = $1 AND lesson_id = $2`,
            [userId, lessonId]
        );
        return result.rows[0];
    }

    async getCompletedLessonIdsByUserAndCourse(userId, courseId) {
        const result = await this.pool.query(
            `SELECT l.id 
             FROM lessons l
             JOIN modules m ON l.module_id = m.id
             JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.user_id = $1
             WHERE m.course_id = $2 AND lp.is_completed = true`,
            [userId, courseId]
        );
        return result.rows.map(row => row.id);
    }
}