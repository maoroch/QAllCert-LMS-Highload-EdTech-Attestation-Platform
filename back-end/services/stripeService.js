// services/stripeService.js
// Stripe payment integration service
// Docs: https://stripe.com/docs/api
import Stripe from 'stripe';
import config from '../config/index.js';
import { logger } from '../utils/logger.js';

const stripe = new Stripe(config.stripe.secretKey, {
    apiVersion: '2024-06-20',
});

export class StripeService {
    /**
     * Create a Stripe Checkout Session for a course purchase.
     * @param {object} params
     * @param {number}  params.orderId       - Internal order ID (used as metadata + client_reference_id)
     * @param {string}  params.courseTitle   - Human-readable course name shown on Stripe page
     * @param {string}  params.coverUrl      - Course thumbnail (optional, shown on Stripe page)
     * @param {number}  params.amount        - Price in major currency units (e.g. 29.99)
     * @param {string}  params.currency      - ISO 4217 code, e.g. 'usd', 'kzt'
     * @param {string}  params.customerEmail - Pre-fill email on Stripe Checkout
     * @returns {Promise<{sessionId: string, url: string}>}
     */
    async createCheckoutSession({ orderId, courseId, courseTitle, coverUrl, amount, currency, customerEmail }) {
        const unitAmount = Math.round(Number(amount) * 100); // Stripe uses cents

        const sessionParams = {
            mode: 'payment',
            client_reference_id: String(orderId),
            customer_email: customerEmail,
            line_items: [
                {
                    quantity: 1,
                    price_data: {
                        currency: currency.toLowerCase(),
                        unit_amount: unitAmount,
                        product_data: {
                            name: courseTitle,
                            ...(coverUrl && (coverUrl.startsWith('http://') || coverUrl.startsWith('https://') || coverUrl.startsWith('/')) ? {
                                images: [coverUrl.startsWith('/') ? `${config.stripe.frontendUrl}${coverUrl}` : coverUrl]
                            } : {}),
                        },
                    },
                },
            ],
            metadata: {
                order_id: String(orderId),
                course_id: String(courseId),
                course_title: courseTitle,
            },
            success_url: `${config.stripe.frontendUrl}/dashboard/checkout/${courseId}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:  `${config.stripe.frontendUrl}/dashboard/checkout/${courseId}/cancel`,
            // Collect billing address for receipt
            billing_address_collection: 'auto',
            // Allow promo codes
            allow_promotion_codes: true,
        };

        const session = await stripe.checkout.sessions.create(sessionParams);

        logger.info('[StripeService] Checkout session created', {
            sessionId: session.id,
            orderId,
        });

        return { sessionId: session.id, url: session.url };
    }

    /**
     * Verify and parse a Stripe webhook event.
     * Throws if the signature is invalid — always call this before trusting webhook data.
     * @param {Buffer}  rawBody   - Raw request body (must NOT be parsed with express.json())
     * @param {string}  signature - Value of the `stripe-signature` header
     * @returns {Stripe.Event}
     */
    constructWebhookEvent(rawBody, signature) {
        return stripe.webhooks.constructEvent(
            rawBody,
            signature,
            config.stripe.webhookSecret,
        );
    }

    /**
     * Retrieve a Checkout Session (used on the success page to confirm payment).
     * @param {string} sessionId
     * @returns {Promise<Stripe.Checkout.Session>}
     */
    async retrieveSession(sessionId) {
        return stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['payment_intent', 'customer'],
        });
    }

    /**
     * Issue a full refund for a PaymentIntent.
     * @param {string} paymentIntentId - From the order's provider_data.payment_intent
     * @returns {Promise<Stripe.Refund>}
     */
    async refundPayment(paymentIntentId) {
        const refund = await stripe.refunds.create({ payment_intent: paymentIntentId });
        logger.info('[StripeService] Refund created', { refundId: refund.id, paymentIntentId });
        return refund;
    }
}