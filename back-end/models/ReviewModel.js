export class ReviewModel {
    constructor(pool) {
        this.pool = pool;
    }

    async create({ userId, courseId, teacherId, rating, comment }) {
        const result = await this.pool.query(
            `INSERT INTO reviews (user_id, course_id, teacher_id, rating, comment)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (user_id, course_id) DO UPDATE
             SET rating = EXCLUDED.rating, comment = EXCLUDED.comment,
                 teacher_id = COALESCE(EXCLUDED.teacher_id, reviews.teacher_id),
                 updated_at = NOW()
             RETURNING *`,
            [userId, courseId, teacherId || null, rating, comment]
        );
        return result.rows[0];
    }

    async findByCourse(courseId) {
        const result = await this.pool.query(
            `SELECT r.*, sp.full_name as student_name
             FROM reviews r
             LEFT JOIN student_profiles sp ON r.user_id = sp.user_id
             WHERE r.course_id = $1
             ORDER BY r.created_at DESC`,
            [courseId]
        );
        return result.rows;
    }

    async findByTeacher(teacherId) {
        const result = await this.pool.query(
            `SELECT r.*, sp.full_name as student_name, c.title as course_title
             FROM reviews r
             LEFT JOIN student_profiles sp ON r.user_id = sp.user_id
             LEFT JOIN courses c ON r.course_id = c.id
             WHERE r.teacher_id = $1
             ORDER BY r.created_at DESC`,
            [teacherId]
        );
        return result.rows;
    }

    async findByUserAndCourse(userId, courseId) {
        const result = await this.pool.query(
            `SELECT * FROM reviews WHERE user_id = $1 AND course_id = $2`,
            [userId, courseId]
        );
        return result.rows[0];
    }

    async delete(id, userId) {
        await this.pool.query(`DELETE FROM reviews WHERE id = $1 AND user_id = $2`, [id, userId]);
    }
}