export class UserModel {
    constructor(pool) {
        this.pool = pool;
    }
    async findByEmail(email) {
        const result = await this.pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }
    async findById(id) {
        const result = await this.pool.query('SELECT id, email, role, email_verified, created_at, updated_at FROM users WHERE id = $1', [id]);
        return result.rows[0];
    }
    async create(email, passwordHash, role) {
        const result = await this.pool.query(
            `INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role`,
            [email, passwordHash, role]
        );
        return result.rows[0];
    }
    async updateResetToken(email, token, expiresAt) {
        const result = await this.pool.query(
            `UPDATE users SET reset_token = $1, reset_token_expires_at = $2 WHERE email = $3 RETURNING *`,
            [token, expiresAt, email]
        );
        return result.rows[0];
    }
    async findByResetToken(token) {
        const result = await this.pool.query(
            `SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires_at > NOW()`,
            [token]
        );
        return result.rows[0];
    }
    async updatePassword(id, passwordHash) {
        const result = await this.pool.query(
            `UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires_at = NULL WHERE id = $2 RETURNING *`,
            [passwordHash, id]
        );
        return result.rows[0];
    }
    async updateVerificationToken(id, token) {
        const result = await this.pool.query(
            `UPDATE users SET verification_token = $1 WHERE id = $2 RETURNING *`,
            [token, id]
        );
        return result.rows[0];
    }
    async findByVerificationToken(token) {
        const result = await this.pool.query(
            `SELECT * FROM users WHERE verification_token = $1`,
            [token]
        );
        return result.rows[0];
    }
    async verifyEmail(token) {
        const result = await this.pool.query(
            `UPDATE users SET email_verified = TRUE, verification_token = NULL WHERE verification_token = $1 RETURNING *`,
            [token]
        );
        return result.rows[0];
    }
}