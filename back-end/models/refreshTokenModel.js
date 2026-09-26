export class RefreshTokenModel {
    constructor(pool) {
        this.pool = pool;
    }

    async create(userId, tokenHash, expiresAt) {
        await this.pool.query(
            `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
             VALUES ($1, $2, $3)`,
            [userId, tokenHash, expiresAt]
        );
    }

    // FIX: added AND expires_at > NOW() — expired tokens are now rejected
    async findByHash(tokenHash) {
        const res = await this.pool.query(
            `SELECT * FROM refresh_tokens
             WHERE token_hash = $1 AND expires_at > NOW()`,
            [tokenHash]
        );
        return res.rows[0];
    }

    async deleteByHash(tokenHash) {
        await this.pool.query(
            `DELETE FROM refresh_tokens WHERE token_hash = $1`,
            [tokenHash]
        );
    }

    async deleteByUserId(userId) {
        await this.pool.query(
            `DELETE FROM refresh_tokens WHERE user_id = $1`,
            [userId]
        );
    }

    // Cleanup job: remove all expired tokens to keep the table lean
    // Call this from a BullMQ scheduled job or a daily cron
    async deleteExpired() {
        const res = await this.pool.query(
            `DELETE FROM refresh_tokens WHERE expires_at <= NOW() RETURNING id`
        );
        return res.rowCount;
    }
}