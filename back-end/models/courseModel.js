export class CourseModel {
    constructor(pool) {
        this.pool = pool;
    }

    async create({ title, description, teacherId, slug }) {
        const result = await this.pool.query(
            `INSERT INTO courses (title, description, teacher_id, is_published, slug)
             VALUES ($1, $2, $3, false, $4) RETURNING *`,
            [title, description, teacherId, slug ?? null]
        );
        return result.rows[0];
    }

    async findAll({ teacherId, search, role, currentUserId } = {}) {
        const conditions = [];
        const values = [];
        let idx = 1;

        if (teacherId) {
            conditions.push(`c.teacher_id = $${idx++}`);
            values.push(teacherId);
        } else if (role === 'student') {
            // Students only see published courses
            conditions.push(`c.is_published = true`);
        } else if (role === 'teacher' && currentUserId) {
            // Teachers see all published courses + their own drafts/published courses
            conditions.push(`(c.is_published = true OR c.teacher_id = $${idx++})`);
            values.push(currentUserId);
        }

        if (search && search.trim()) {
            // Case-insensitive search on title and description
            conditions.push(`(c.title ILIKE $${idx} OR c.description ILIKE $${idx} OR c.slug ILIKE $${idx})`);
            values.push(`%${search.trim()}%`);
            idx++;
        }

        const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        const query = `
            SELECT c.*, tp.full_name AS teacher_name
            FROM courses c
            LEFT JOIN teacher_profiles tp ON tp.user_id = c.teacher_id
            ${where}
            ORDER BY c.created_at DESC
        `;
        const result = await this.pool.query(query, values);
        return result.rows;
    }

    async findById(idOrSlug) {
        const isNumeric = !isNaN(Number(idOrSlug)) && String(Number(idOrSlug)) === String(idOrSlug).trim();
        const condition = isNumeric ? 'c.id = $1' : '(c.slug = $1 OR c.title ILIKE $1)';
        const val = isNumeric ? Number(idOrSlug) : String(idOrSlug);

        const result = await this.pool.query(
            `SELECT c.*, tp.full_name AS teacher_name
             FROM courses c
             LEFT JOIN teacher_profiles tp ON tp.user_id = c.teacher_id
             WHERE ${condition}`,
            [val]
        );
        return result.rows[0];
    }

    async update(id, { title, description, cover_url, is_published, price, currency, slug }) {
        const result = await this.pool.query(
            `UPDATE courses
             SET title        = COALESCE($1, title),
                 description  = COALESCE($2, description),
                 cover_url    = COALESCE($3, cover_url),
                 is_published = COALESCE($4, is_published),
                 price        = COALESCE($5, price),
                 currency     = COALESCE($6, currency),
                 slug         = COALESCE($7, slug),
                 updated_at   = NOW()
             WHERE id = $8 RETURNING *`,
            [title, description, cover_url ?? null, is_published ?? null, price ?? null, currency ?? null, slug ?? null, id]
        );
        return result.rows[0];
    }

    async getCurriculum(courseIdOrSlug) {
        let courseId = courseIdOrSlug;
        const isNumeric = !isNaN(Number(courseIdOrSlug)) && String(Number(courseIdOrSlug)) === String(courseIdOrSlug).trim();
        if (!isNumeric) {
            const course = await this.findById(courseIdOrSlug);
            if (!course) return [];
            courseId = course.id;
        }

        const query = `
            SELECT
                m.id AS module_id,
                m.title AS module_title,
                m.order_index AS module_order,
                m.is_final,
                m.completion_message,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id',             l.id,
                            'title',          l.title,
                            'content_type',   l.content_type,
                            'content',        l.content,
                            'order_index',    l.order_index,
                            'available_from', l.available_from,
                            'deadline',       l.deadline,
                            'author_name',    tp.full_name
                        ) ORDER BY l.order_index ASC
                    ) FILTER (WHERE l.id IS NOT NULL), '[]'
                ) AS lessons
            FROM modules m
            LEFT JOIN lessons l ON m.id = l.module_id
            LEFT JOIN courses c ON m.course_id = c.id
            LEFT JOIN teacher_profiles tp ON tp.user_id = c.teacher_id
            WHERE m.course_id = $1
            GROUP BY m.id, m.title, m.order_index, m.is_final, m.completion_message
            ORDER BY m.order_index ASC
        `;
        const result = await this.pool.query(query, [courseId]);
        return result.rows;
    }

    async delete(id) {
        await this.pool.query(`DELETE FROM courses WHERE id = $1`, [id]);
        return true;
    }

    async isCoauthor(courseId, teacherId) {
        const result = await this.pool.query(
            `SELECT 1 FROM course_coauthors WHERE course_id = $1 AND teacher_id = $2`,
            [courseId, teacherId]
        );
        return result.rows.length > 0;
    }

    async findCoauthors(courseId) {
        const result = await this.pool.query(
            `SELECT u.id, u.email, tp.full_name
             FROM course_coauthors cc
             JOIN users u ON cc.teacher_id = u.id
             LEFT JOIN teacher_profiles tp ON tp.user_id = u.id
             WHERE cc.course_id = $1
             ORDER BY cc.created_at ASC`,
            [courseId]
        );
        return result.rows;
    }

    async addCoauthor(courseId, teacherId) {
        const result = await this.pool.query(
            `INSERT INTO course_coauthors (course_id, teacher_id)
             VALUES ($1, $2)
             ON CONFLICT (course_id, teacher_id) DO NOTHING
             RETURNING *`,
            [courseId, teacherId]
        );
        return result.rows[0];
    }

    async removeCoauthor(courseId, teacherId) {
        await this.pool.query(
            `DELETE FROM course_coauthors WHERE course_id = $1 AND teacher_id = $2`,
            [courseId, teacherId]
        );
        return true;
    }
}