// controllers/orderController.js  (Stripe-integrated version)
import { logger } from '../utils/logger.js';

export class OrderController {
    /**
     * @param {import('../services/orderService.js').OrderService}   orderService
     * @param {import('../services/stripeService.js').StripeService} stripeService
     */
    constructor(orderService, stripeService) {
        this.orderService  = orderService;
        this.stripeService = stripeService;
    }

    // ── POST /api/orders  { courseId, paymentProvider? } ─────────────────────
    // Creates an internal order record and (for paid courses) returns a Stripe
    // Checkout Session URL that the frontend redirects to.
    createOrder = async (req, res, next) => {
        try {
            const { courseId, paymentProvider = 'stripe' } = req.body;
            if (!courseId) return res.status(400).json({ error: 'courseId is required' });

            const result = await this.orderService.createOrder(
                req.user.id, courseId, paymentProvider,
            );

            // Free course — already enrolled, nothing to pay
            if (result.type === 'free') {
                return res.status(201).json(result);
            }

            // Paid course — create Stripe Checkout Session
            if (paymentProvider === 'stripe') {
                const session = await this.stripeService.createCheckoutSession({
                    orderId:       result.order.id,
                    courseId:      result.order.course_id,
                    courseTitle:   result.order.course_title || `Course #${result.order.course_id}`,
                    coverUrl:      result.order.cover_url || null,
                    amount:        result.order.amount,
                    currency:      result.order.currency,
                    customerEmail: req.user.email,
                });

                // Persist Stripe session ID so we can look it up in the webhook
                await this.orderService.attachProviderOrderId(
                    result.order.id, session.sessionId,
                );

                return res.status(201).json({
                    type:       'paid',
                    order:      result.order,
                    sessionId:  session.sessionId,
                    checkoutUrl: session.url,
                });
            }

            // Other providers (Kaspi, CloudPayments) — caller handles redirect
            res.status(201).json(result);
        } catch (err) {
            next(err);
        }
    };

    // ── GET /api/orders/me ────────────────────────────────────────────────────
    getMyOrders = async (req, res, next) => {
        try {
            const orders = await this.orderService.getMyOrders(req.user.id);
            res.json(orders);
        } catch (err) {
            next(err);
        }
    };

    // ── GET /api/courses/:courseId/orders  (teacher / admin) ─────────────────
    getCourseOrders = async (req, res, next) => {
        try {
            const orders = await this.orderService.getCourseOrders(
                req.params.courseId, req.user.id, req.user.role,
            );
            res.json(orders);
        } catch (err) {
            next(err);
        }
    };

    // ── GET /api/orders/:orderId/checkout-session ─────────────────────────────
    // Frontend calls this on the success page to confirm payment status.
    getCheckoutSession = async (req, res, next) => {
        try {
            const order = await this.orderService.getOrderById(req.params.orderId);
            if (!order) return res.status(404).json({ error: 'Order not found' });
            if (Number(order.user_id) !== Number(req.user.id)) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            // Retrieve live status from Stripe
            const session = await this.stripeService.retrieveSession(order.provider_order_id);

            // Sync payment status as a fallback if the webhook has not executed yet
            if (session.payment_status === 'paid' && order.status !== 'paid') {
                await this.orderService.handlePaymentSuccess(session.id, {
                    source:             'checkout_session_sync',
                    payment_intent:     session.payment_intent,
                    customer_email:     session.customer_email,
                    amount_total:       session.amount_total,
                    currency:           session.currency,
                });
                order.status = 'paid';
            }

            res.json({
                order,
                stripeStatus: session.payment_status, // 'paid' | 'unpaid' | 'no_payment_required'
                amountTotal:  session.amount_total,
                currency:     session.currency,
            });
        } catch (err) {
            next(err);
        }
    };

    // ── POST /api/orders/stripe/webhook  (Stripe → server, no auth) ──────────
    // IMPORTANT: this route must receive the RAW body (see orderRoutes.js).
    stripeWebhook = async (req, res, next) => {
        const sig = req.headers['stripe-signature'];
        let event;

        try {
            event = this.stripeService.constructWebhookEvent(req.body, sig);
        } catch (err) {
            logger.warn('[StripeWebhook] Signature verification failed', { message: err.message });
            return res.status(400).json({ error: `Webhook signature verification failed: ${err.message}` });
        }

        logger.info('[StripeWebhook] Event received', { type: event.type, id: event.id });

        try {
            switch (event.type) {
                case 'checkout.session.completed': {
                    const session = event.data.object;
                    // client_reference_id is the internal order ID we stored during session creation
                    const orderId = session.client_reference_id;

                    if (session.payment_status === 'paid') {
                        await this.orderService.handlePaymentSuccess(session.id, {
                            stripe_event_id:    event.id,
                            payment_intent:     session.payment_intent,
                            customer_email:     session.customer_email,
                            amount_total:       session.amount_total,
                            currency:           session.currency,
                        });
                        logger.info('[StripeWebhook] Payment confirmed', { orderId, sessionId: session.id });
                    } else {
                        logger.warn('[StripeWebhook] Session completed but payment_status not paid', {
                            orderId, paymentStatus: session.payment_status,
                        });
                    }
                    break;
                }

                case 'checkout.session.expired': {
                    const session = event.data.object;
                    await this.orderService.handlePaymentFailure(session.id, {
                        stripe_event_id: event.id,
                        reason: 'checkout_session_expired',
                    });
                    break;
                }

                case 'charge.refunded': {
                    // Handled by admin refund flow — log only
                    logger.info('[StripeWebhook] Charge refunded', { chargeId: event.data.object.id });
                    break;
                }

                default:
                    logger.info('[StripeWebhook] Unhandled event type', { type: event.type });
            }
        } catch (err) {
            logger.error('[StripeWebhook] Handler error', { message: err.message, eventId: event.id });
            // Still respond 200 — Stripe will retry on 4xx/5xx
        }

        res.status(200).json({ received: true });
    };

    // ── POST /api/orders/webhook  (legacy generic webhook, kept for Kaspi etc.) ─
    webhook = async (req, res, next) => {
        try {
            const { event, provider_order_id, provider_data } = req.body;
            logger.info('[Webhook] Received', { event, provider_order_id });

            if (event === 'payment.success') {
                await this.orderService.handlePaymentSuccess(provider_order_id, provider_data);
            } else if (event === 'payment.failed') {
                await this.orderService.handlePaymentFailure(provider_order_id, provider_data);
            } else {
                logger.warn('[Webhook] Unknown event', { event });
            }

            res.status(200).json({ received: true });
        } catch (err) {
            logger.error('[Webhook] Error', { message: err.message });
            res.status(200).json({ received: true, warning: err.message });
        }
    };

    // ── PATCH /api/orders/:orderId/attach-provider  { providerOrderId } ───────
    attachProvider = async (req, res, next) => {
        try {
            const { providerOrderId } = req.body;
            const order = await this.orderService.attachProviderOrderId(
                req.params.orderId, providerOrderId,
            );
            res.json(order);
        } catch (err) {
            next(err);
        }
    };

    // ── PATCH /api/orders/:orderId/refund  (admin only) ───────────────────────
    refund = async (req, res, next) => {
        try {
            const order = await this.orderService.refundOrder(
                req.params.orderId, req.user.id, req.user.role,
            );

            // Trigger Stripe refund if payment was via Stripe
            if (order.payment_provider === 'stripe' && order.provider_data?.payment_intent) {
                try {
                    await this.stripeService.refundPayment(order.provider_data.payment_intent);
                } catch (stripeErr) {
                    logger.error('[OrderController] Stripe refund failed', {
                        orderId: order.id,
                        message: stripeErr.message,
                    });
                    // Don't fail the request — DB refund was already recorded
                }
            }

            res.json(order);
        } catch (err) {
            next(err);
        }
    };
}