export class ProctoringModel {
    constructor(pool) {
        this.pool = pool;
    }

    async startSession(userId, courseId) {
        const query = `
            INSERT INTO proctoring_sessions (user_id, course_id, status)
            VALUES ($1, $2, 'active')
            RETURNING *;
        `;
        const { rows } = await this.pool.query(query, [userId, courseId]);
        return rows[0];
    }

    async endSession(sessionId, status = 'ended') {
        const query = `
            UPDATE proctoring_sessions
            SET ended_at = NOW(), status = $2, updated_at = NOW()
            WHERE id = $1
            RETURNING *;
        `;
        const { rows } = await this.pool.query(query, [sessionId, status]);
        return rows[0];
    }

    async getSession(sessionId) {
        const query = `SELECT * FROM proctoring_sessions WHERE id = $1`;
        const { rows } = await this.pool.query(query, [sessionId]);
        return rows[0];
    }

    async logEvent(sessionId, eventType, metadata = {}) {
        const query = `
            INSERT INTO proctoring_events (session_id, event_type, metadata)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const { rows } = await this.pool.query(query, [sessionId, eventType, JSON.stringify(metadata)]);
        return rows[0];
    }

    async getSessionEvents(sessionId) {
        const query = `SELECT * FROM proctoring_events WHERE session_id = $1 ORDER BY created_at ASC`;
        const { rows } = await this.pool.query(query, [sessionId]);
        return rows;
    }
}
