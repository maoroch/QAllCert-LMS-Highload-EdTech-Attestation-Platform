// Thin service — can be imported anywhere in the backend to push notifications
export class NotificationService {
    constructor(pool) {
        this.pool = pool;
    }

    async create(userId, type, message) {
        const result = await this.pool.query(
            `INSERT INTO notifications (user_id, type, message) VALUES ($1, $2, $3) RETURNING *`,
            [userId, type, message]
        );
        return result.rows[0];
    }

    async getForUser(userId, limit = 30) {
        const result = await this.pool.query(
            `SELECT * FROM notifications WHERE user_id = $1
             ORDER BY created_at DESC LIMIT $2`,
            [userId, limit]
        );
        return result.rows;
    }

    async markAllRead(userId) {
        await this.pool.query(
            `UPDATE notifications SET is_read = TRUE WHERE user_id = $1 AND is_read = FALSE`,
            [userId]
        );
    }

    async markOneRead(notificationId, userId) {
        await this.pool.query(
            `UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2`,
            [notificationId, userId]
        );
    }

    async getUnreadCount(userId) {
        const result = await this.pool.query(
            `SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = FALSE`,
            [userId]
        );
        return parseInt(result.rows[0].count, 10);
    }
}