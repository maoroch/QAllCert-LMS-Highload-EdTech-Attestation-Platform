// models/orderModel.js
export class OrderModel {
    constructor(pool) {
        this.pool = pool;
    }

    async create({ userId, courseId, amount, currency, paymentProvider }) {
        const result = await this.pool.query(
            `INSERT INTO orders (user_id, course_id, amount, currency, payment_provider, status)
             VALUES ($1, $2, $3, $4, $5, 'pending')
             RETURNING *`,
            [userId, courseId, amount, currency || 'USD', paymentProvider || 'stripe']
        );
        return result.rows[0];
    }

    async findById(id) {
        const result = await this.pool.query(
            `SELECT o.*, c.title AS course_title, u.email AS user_email
             FROM orders o
             JOIN courses c ON c.id = o.course_id
             JOIN users  u ON u.id = o.user_id
             WHERE o.id = $1`,
            [id]
        );
        return result.rows[0];
    }

    async findByUser(userId) {
        const result = await this.pool.query(
            `SELECT o.*, c.title AS course_title, c.cover_url
             FROM orders o
             JOIN courses c ON c.id = o.course_id
             WHERE o.user_id = $1
             ORDER BY o.created_at DESC`,
            [userId]
        );
        return result.rows;
    }

    async findByProviderOrderId(providerOrderId) {
        const result = await this.pool.query(
            `SELECT * FROM orders WHERE provider_order_id = $1 LIMIT 1`,
            [providerOrderId]
        );
        return result.rows[0];
    }

    async findPaidByUserAndCourse(userId, courseId) {
        const result = await this.pool.query(
            `SELECT * FROM orders
             WHERE user_id = $1 AND course_id = $2 AND status = 'paid'
             LIMIT 1`,
            [userId, courseId]
        );
        return result.rows[0] || null;
    }

    async updateStatus(id, { status, providerOrderId, providerData }) {
        const result = await this.pool.query(
            `UPDATE orders
             SET status             = $1,
                 provider_order_id  = COALESCE($2, provider_order_id),
                 provider_data      = COALESCE($3, provider_data),
                 updated_at         = NOW()
             WHERE id = $4
             RETURNING *`,
            [status, providerOrderId || null, providerData ? JSON.stringify(providerData) : null, id]
        );
        return result.rows[0];
    }

    async findByCourse(courseId) {
        const result = await this.pool.query(
            `SELECT o.*, u.email AS user_email
             FROM orders o
             JOIN users u ON u.id = o.user_id
             WHERE o.course_id = $1
             ORDER BY o.created_at DESC`,
            [courseId]
        );
        return result.rows;
    }

    // Revenue stats for teacher analytics
    async getRevenueByCourse(courseId) {
        const result = await this.pool.query(
            `SELECT
               COUNT(*) FILTER (WHERE status = 'paid')                AS total_paid,
               COALESCE(SUM(amount) FILTER (WHERE status = 'paid'), 0) AS total_revenue,
               currency
             FROM orders
             WHERE course_id = $1
             GROUP BY currency`,
            [courseId]
        );
        return result.rows;
    }
}
