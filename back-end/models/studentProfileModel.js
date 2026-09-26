// models/studentProfileModel.js
export class StudentProfileModel {
    constructor(pool) {
        this.pool = pool;
    }

    async create(userId, fullName, avatarUrl = null, metadata = {}) {
        const result = await this.pool.query(
            `INSERT INTO student_profiles (user_id, full_name, avatar_url, metadata)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [userId, fullName, avatarUrl, metadata]
        );
        return result.rows[0];
    }

    async findByUserId(userId) {
        const result = await this.pool.query(
            `SELECT * FROM student_profiles WHERE user_id = $1`,
            [userId]
        );
        return result.rows[0];
    }

    // Get all students in a course with their profile info
    async findByCourse(courseId) {
        const result = await this.pool.query(
            `SELECT sp.*, u.email, e.status, e.progress_percent, e.enrolled_at
             FROM enrollments e
             JOIN users u ON e.user_id = u.id
             LEFT JOIN student_profiles sp ON sp.user_id = u.id
             WHERE e.course_id = $1
             ORDER BY e.enrolled_at DESC`,
            [courseId]
        );
        return result.rows;
    }

    async update(userId, { fullName, avatarUrl, metadata, phoneNumber }) {
        const result = await this.pool.query(
            `UPDATE student_profiles
             SET full_name = COALESCE($1, full_name),
                 avatar_url = COALESCE($2, avatar_url),
                 metadata = COALESCE($3, metadata),
                 phone_number = COALESCE($4, phone_number),
                 updated_at = NOW()
             WHERE user_id = $5 RETURNING *`,
            [fullName, avatarUrl, metadata, phoneNumber, userId]
        );
        return result.rows[0];
    }
}