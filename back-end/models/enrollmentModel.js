export class EnrollmentModel {
    constructor(pool) {
        this.pool = pool;
    }

    async enroll(userId, courseId) {
        const existing = await this.pool.query(
            `SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2`,
            [userId, courseId]
        );
        if (existing.rows[0]) return existing.rows[0];
        const result = await this.pool.query(
            `INSERT INTO enrollments (user_id, course_id, status, progress_percent)
             VALUES ($1, $2, 'active', 0) RETURNING *`,
            [userId, courseId]
        );
        return result.rows[0];
    }

    async findByUser(userId) {
        const result = await this.pool.query(
            `SELECT e.*, c.title as course_title 
             FROM enrollments e
             JOIN courses c ON e.course_id = c.id
             WHERE e.user_id = $1
             ORDER BY e.enrolled_at DESC`,
            [userId]
        );
        return result.rows;
    }

    async findByUserAndCourse(userId, courseId) {
        const result = await this.pool.query(
            `SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2 LIMIT 1`,
            [userId, courseId]
        );
        return result.rows[0] || null;
    }


    async findByCourse(courseId) {
        const result = await this.pool.query(
            `SELECT e.*, u.email, u.id as user_id
             FROM enrollments e
             JOIN users u ON e.user_id = u.id
             WHERE e.course_id = $1`,
            [courseId]
        );
        return result.rows;
    }

    async findOne(userId, courseId) {
        const result = await this.pool.query(
            `SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2`,
            [userId, courseId]
        );
        return result.rows[0];
    }

    async updateProgress(userId, courseId, progressPercent) {
        const result = await this.pool.query(
            `UPDATE enrollments 
             SET progress_percent = $1, updated_at = NOW()
             WHERE user_id = $2 AND course_id = $3
             RETURNING *`,
            [progressPercent, userId, courseId]
        );
        return result.rows[0];
    }

    async updateStatus(userId, courseId, status) {
        const result = await this.pool.query(
            `UPDATE enrollments SET status = $1, updated_at = NOW()
             WHERE user_id = $2 AND course_id = $3 RETURNING *`,
            [status, userId, courseId]
        );
        return result.rows[0];
    }
}