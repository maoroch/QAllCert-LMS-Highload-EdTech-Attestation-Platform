export class AssignmentModel {
    constructor(pool) {
        this.pool = pool;
    }

    async create({ lessonId, title, description, max_score, due_date }) {
        const result = await this.pool.query(
            `INSERT INTO assignments (lesson_id, title, description, max_score, due_date)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [lessonId, title, description, max_score, due_date || null]
        );
        return result.rows[0];
    }

    async findByLesson(lessonId) {
        const result = await this.pool.query(
            `SELECT * FROM assignments WHERE lesson_id = $1 ORDER BY created_at DESC`,
            [lessonId]
        );
        return result.rows;
    }

    async findById(id) {
        const result = await this.pool.query(`SELECT * FROM assignments WHERE id = $1`, [id]);
        return result.rows[0];
    }

    async update(id, { title, description, maxScore, due_date }) {
        const result = await this.pool.query(
            `UPDATE assignments 
             SET title = COALESCE($1, title), 
                 description = COALESCE($2, description), 
                 max_score = COALESCE($3, max_score),
                 due_date = COALESCE($4, due_date),
                 updated_at = NOW()
             WHERE id = $5 RETURNING *`,
            [title, description, maxScore, due_date, id]
        );
        return result.rows[0];
    }

    async delete(id) {
        await this.pool.query(`DELETE FROM assignments WHERE id = $1`, [id]);
        return true;
    }
}