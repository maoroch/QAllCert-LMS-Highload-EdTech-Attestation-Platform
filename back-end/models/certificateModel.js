export class CertificateModel {
    constructor(pool) {
        this.pool = pool;
    }

    async create({ userId, courseId, pdfUrl, verificationCode }) {
        const result = await this.pool.query(
            `INSERT INTO certificates (user_id, course_id, pdf_url, verification_code)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [userId, courseId, pdfUrl, verificationCode]
        );
        return result.rows[0];
    }

    async findByUser(userId) {
        const result = await this.pool.query(
            `SELECT c.*, cr.title as course_title
             FROM certificates c
             JOIN courses cr ON c.course_id = cr.id
             WHERE c.user_id = $1
             ORDER BY c.issued_at DESC`,
            [userId]
        );
        return result.rows;
    }

    async findByCode(code) {
        const result = await this.pool.query(
            `SELECT c.*, 
                    cr.title as course_title, 
                    cr.slug as course_slug,
                    COALESCE(sp.full_name, u.email) as recipient_name
             FROM certificates c
             JOIN courses cr ON c.course_id = cr.id
             JOIN users u ON c.user_id = u.id
             LEFT JOIN student_profiles sp ON sp.user_id = u.id
             WHERE c.verification_code = $1`,
            [code]
        );
        return result.rows[0];
    }

    async findByUserAndCourse(userId, courseId) {
        const result = await this.pool.query(
            `SELECT * FROM certificates WHERE user_id = $1 AND course_id = $2`,
            [userId, courseId]
        );
        return result.rows[0];
    }
}