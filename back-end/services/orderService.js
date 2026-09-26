// services/orderService.js  (Stripe-integrated version)
// Changes vs original:
//   1. Added getOrderById() — used by getCheckoutSession controller endpoint
//   2. handlePaymentSuccess() now also stores stripe_session_id via updateStatus
//   3. Everything else is identical

import { logger } from '../utils/logger.js';

export class OrderService {
    constructor(orderModel, courseModel, enrollmentModel, enrollmentService) {
        this.orderModel        = orderModel;
        this.courseModel       = courseModel;
        this.enrollmentModel   = enrollmentModel;
        this.enrollmentService = enrollmentService;
    }

    // ── Create order (initiate checkout) ─────────────────────────────────────
    async createOrder(userId, courseId, paymentProvider = 'stripe') {
        const course = await this.courseModel.findById(courseId);
        if (!course) throw new Error('Course not found');
        if (!course.is_published) throw new Error('Course is not available');

        // Free course — enroll directly without payment
        if (!course.price || Number(course.price) === 0) {
            await this.enrollmentService.enrollUser(userId, courseId, true);
            return { type: 'free', enrolled: true };
        }

        // Check if already paid
        const existing = await this.orderModel.findPaidByUserAndCourse(userId, courseId);
        if (existing) throw new Error('You already have access to this course');

        const order = await this.orderModel.create({
            userId,
            courseId,
            amount:          course.price,
            currency:        course.currency || 'USD',
            paymentProvider,
        });

        // Attach course metadata so the controller can pass it to Stripe
        order.course_title = course.title;
        order.cover_url    = course.cover_url || null;

        logger.info('[OrderService] Order created', { orderId: order.id, userId, courseId });
        return { type: 'paid', order };
    }

    // ── Webhook: payment provider confirms payment ────────────────────────────
    async handlePaymentSuccess(providerOrderId, providerData = {}) {
        const order = await this.orderModel.findByProviderOrderId(providerOrderId);
        if (!order) throw new Error(`Order not found for provider ID: ${providerOrderId}`);

        if (order.status === 'paid') {
            logger.warn('[OrderService] Duplicate webhook, order already paid', { orderId: order.id });
            return order;
        }

        const updated = await this.orderModel.updateStatus(order.id, {
            status:          'paid',
            providerOrderId,
            providerData,
        });

        // Auto-enroll student (skip payment check — already confirmed by Stripe)
        await this.enrollmentService.enrollUser(order.user_id, order.course_id, true);
        logger.info('[OrderService] Payment confirmed, student enrolled', {
            orderId: order.id, userId: order.user_id, courseId: order.course_id,
        });

        return updated;
    }

    async handlePaymentFailure(providerOrderId, providerData = {}) {
        const order = await this.orderModel.findByProviderOrderId(providerOrderId);
        if (!order) return;
        await this.orderModel.updateStatus(order.id, { status: 'failed', providerOrderId, providerData });
        logger.info('[OrderService] Payment failed', { orderId: order.id });
    }

    // ── Attach Stripe Checkout Session ID after session is created ────────────
    async attachProviderOrderId(orderId, providerOrderId) {
        return this.orderModel.updateStatus(orderId, { status: 'pending', providerOrderId });
    }

    // ── Refund ────────────────────────────────────────────────────────────────
    async refundOrder(orderId, requesterId, requesterRole) {
        const order = await this.orderModel.findById(orderId);
        if (!order) throw new Error('Order not found');
        if (requesterRole !== 'admin') throw new Error('Only admins can issue refunds');
        if (order.status !== 'paid') throw new Error('Only paid orders can be refunded');

        const updated = await this.orderModel.updateStatus(orderId, { status: 'refunded' });
        logger.info('[OrderService] Order refunded', { orderId, requesterId });
        return updated;
    }

    // ── Queries ───────────────────────────────────────────────────────────────
    async getMyOrders(userId) {
        return this.orderModel.findByUser(userId);
    }

    // NEW: get single order by internal ID (used by getCheckoutSession endpoint)
    async getOrderById(orderId) {
        return this.orderModel.findById(orderId);
    }

    async getCourseOrders(courseId, requesterId, requesterRole) {
        const course = await this.courseModel.findById(courseId);
        if (!course) throw new Error('Course not found');
        if (requesterRole !== 'admin' && Number(course.teacher_id) !== Number(requesterId)) {
            throw new Error('Not authorized');
        }
        return this.orderModel.findByCourse(courseId);
    }

    async checkAccess(userId, courseId) {
        const course = await this.courseModel.findById(courseId);
        if (!course) return false;
        if (!course.price || Number(course.price) === 0) return true;
        const paid = await this.orderModel.findPaidByUserAndCourse(userId, courseId);
        return !!paid;
    }
}