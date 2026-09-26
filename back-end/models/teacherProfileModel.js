// models/teacherProfileModel.js
export class TeacherProfileModel {
    constructor(pool) {
        this.pool = pool;
    }
    async create(userId, fullName, bio = null, avatarUrl = null) {
        const result = await this.pool.query(
            `INSERT INTO teacher_profiles (user_id, full_name, bio, avatar_url)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [userId, fullName, bio, avatarUrl]
        );
        return result.rows[0];
    }
    async findByUserId(userId) {
        const result = await this.pool.query(
            `SELECT * FROM teacher_profiles WHERE user_id = $1`,
            [userId]
        );
        return result.rows[0];
    }
    async update(userId, { fullName, bio, avatarUrl }) {
        const result = await this.pool.query(
            `UPDATE teacher_profiles 
             SET full_name = COALESCE($1, full_name),
                 bio = COALESCE($2, bio),
                 avatar_url = COALESCE($3, avatar_url),
                 updated_at = NOW()
             WHERE user_id = $4 RETURNING *`,
            [fullName, bio, avatarUrl, userId]
        );
        return result.rows[0];
    }
}