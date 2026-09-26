// routes/orderRoutes.js  (Stripe-integrated version)
import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { orderLimiter } from '../middlewares/rateLimiter.js';

export const createOrderRouter = (orderController) => {
    const router = express.Router();

    // ── Stripe webhook ────────────────────────────────────────────────────────
    // MUST be registered BEFORE express.json() parses the body.
    // Stripe requires the raw Buffer to verify the signature.
    // We mount it on /api, so the full path is POST /api/orders/stripe/webhook
    router.post(
        '/orders/stripe/webhook',
        express.raw({ type: 'application/json' }),
        orderController.stripeWebhook,
    );

    // ── Legacy generic webhook (Kaspi, CloudPayments, etc.) ──────────────────
    // Note: express.json() is needed for all routes below this point
    router.use(express.json());
    router.post('/orders/webhook', orderController.webhook);

    // ── Student routes ────────────────────────────────────────────────────────
    // Student: initiate purchase → returns { checkoutUrl, sessionId } for Stripe
    router.post(
        '/orders',
        authMiddleware,
        roleMiddleware(['student']),
        orderLimiter,
        orderController.createOrder,
    );

    // Student: order history
    router.get(
        '/orders/me', 
        authMiddleware, 
        orderController.getMyOrders
    );

    // Student: confirm payment on success page
    router.get(
        '/orders/:orderId/checkout-session',
        authMiddleware,
        roleMiddleware(['student']),
        orderController.getCheckoutSession,
    );

    // Student/admin: attach external provider order ID
    router.patch(
        '/orders/:orderId/attach-provider',
        authMiddleware,
        roleMiddleware(['student']),
        orderController.attachProvider,
    );

    // Admin: issue refund (also triggers Stripe refund)
    router.patch(
        '/orders/:orderId/refund',
        authMiddleware,
        roleMiddleware(['admin']),
        orderController.refund,
    );

    // Teacher / admin: list all orders for a course
    router.get(
        '/courses/:courseId/orders',
        authMiddleware,
        roleMiddleware(['teacher', 'admin']),
        orderController.getCourseOrders,
    );

    return router;
};