export class GradeModel {
    constructor(pool) {
        this.pool = pool;
    }

    async createOrUpdate({ submissionId, score, feedback, gradedById }) {
        const existing = await this.pool.query(
            `SELECT * FROM grades WHERE submission_id = $1`,
            [submissionId]
        );
        if (existing.rows[0]) {
            const result = await this.pool.query(
                `UPDATE grades
                 SET score = $1, feedback = $2, graded_by = $3, graded_at = NOW(), updated_at = NOW()
                 WHERE submission_id = $4 RETURNING *`,
                [score, feedback, gradedById, submissionId]
            );
            return result.rows[0];
        } else {
            const result = await this.pool.query(
                `INSERT INTO grades (submission_id, score, feedback, graded_by)
                 VALUES ($1, $2, $3, $4) RETURNING *`,
                [submissionId, score, feedback, gradedById]
            );
            return result.rows[0];
        }
    }

    async findBySubmission(submissionId) {
        const result = await this.pool.query(
            `SELECT * FROM grades WHERE submission_id = $1`,
            [submissionId]
        );
        return result.rows[0];
    }

    // All GRADED submissions for a student — full context tree
    async findByUser(userId) {
        const result = await this.pool.query(
            `SELECT
                g.id            AS grade_id,
                g.score,
                g.feedback,
                g.graded_at,
                a.id            AS assignment_id,
                a.title         AS assignment_title,
                a.max_score,
                a.due_date,
                s.id            AS submission_id,
                s.content       AS submission_content,
                s.google_drive_link,
                s.submitted_at,
                l.id            AS lesson_id,
                l.title         AS lesson_title,
                m.title         AS module_title,
                c.id            AS course_id,
                c.title         AS course_title,
                tp.full_name    AS teacher_name
             FROM grades g
             JOIN submissions s  ON g.submission_id  = s.id
             JOIN assignments a  ON s.assignment_id  = a.id
             JOIN lessons l      ON a.lesson_id      = l.id
             JOIN modules m      ON l.module_id      = m.id
             JOIN courses c      ON m.course_id      = c.id
             LEFT JOIN teacher_profiles tp ON tp.user_id = c.teacher_id
             WHERE s.user_id = $1
             ORDER BY g.graded_at DESC`,
            [userId]
        );
        return result.rows;
    }

    // Submissions waiting for a grade
    async findPendingByUser(userId) {
        const result = await this.pool.query(
            `SELECT
                s.id            AS submission_id,
                s.content       AS submission_content,
                s.google_drive_link,
                s.submitted_at,
                a.id            AS assignment_id,
                a.title         AS assignment_title,
                a.max_score,
                a.due_date,
                l.title         AS lesson_title,
                m.title         AS module_title,
                c.id            AS course_id,
                c.title         AS course_title
             FROM submissions s
             JOIN assignments a  ON s.assignment_id = a.id
             JOIN lessons l      ON a.lesson_id     = l.id
             JOIN modules m      ON l.module_id     = m.id
             JOIN courses c      ON m.course_id     = c.id
             LEFT JOIN grades g  ON g.submission_id = s.id
             WHERE s.user_id = $1 AND g.id IS NULL
             ORDER BY s.submitted_at DESC`,
            [userId]
        );
        return result.rows;
    }
}