export class SubmissionModel {
    constructor(pool) {
        this.pool = pool;
    }

    async create({ assignmentId, userId, content, googleDriveLink }) {
        const result = await this.pool.query(
            `INSERT INTO submissions (assignment_id, user_id, content, google_drive_link)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [assignmentId, userId, content || null, googleDriveLink || null]
        );
        return result.rows[0];
    }

    async findByAssignmentAndUser(assignmentId, userId) {
        const result = await this.pool.query(
            `SELECT s.*, g.score, g.feedback, g.graded_at
             FROM submissions s
             LEFT JOIN grades g ON g.submission_id = s.id
             WHERE s.assignment_id = $1 AND s.user_id = $2
             ORDER BY s.submitted_at DESC LIMIT 1`,
            [assignmentId, userId]
        );
        return result.rows[0];
    }

    async findByAssignment(assignmentId) {
        const result = await this.pool.query(
            `SELECT s.*, u.email,
                    sp.full_name,
                    g.score, g.feedback, g.graded_at, g.id as grade_id
             FROM submissions s
             JOIN users u ON s.user_id = u.id
             LEFT JOIN student_profiles sp ON sp.user_id = s.user_id
             LEFT JOIN grades g ON g.submission_id = s.id
             WHERE s.assignment_id = $1
             ORDER BY s.submitted_at DESC`,
            [assignmentId]
        );
        return result.rows;
    }

    // All submissions across ALL assignments in a course (for teacher grading page)
    async findByCourse(courseId) {
        const result = await this.pool.query(
            `SELECT s.*, u.email,
                    sp.full_name,
                    a.title as assignment_title, a.max_score,
                    l.title as lesson_title,
                    g.score, g.feedback, g.graded_at, g.id as grade_id
             FROM submissions s
             JOIN users u ON s.user_id = u.id
             LEFT JOIN student_profiles sp ON sp.user_id = s.user_id
             JOIN assignments a ON s.assignment_id = a.id
             JOIN lessons l ON a.lesson_id = l.id
             JOIN modules m ON l.module_id = m.id
             LEFT JOIN grades g ON g.submission_id = s.id
             WHERE m.course_id = $1
             ORDER BY g.graded_at NULLS FIRST, s.submitted_at DESC`,
            [courseId]
        );
        return result.rows;
    }

    async findById(id) {
        const result = await this.pool.query(`SELECT * FROM submissions WHERE id = $1`, [id]);
        return result.rows[0];
    }
}
