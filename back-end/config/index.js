// config/index.js  (Stripe-integrated version)
import dotenv from 'dotenv';
dotenv.config();

export default {
    port: process.env.PORT || 3000,
    postgresUri: process.env.POSTGRES_URI,
    redisUrl: process.env.REDIS_URL,
    jwtSecret: process.env.JWT_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,

    // ── Stripe ────────────────────────────────────────────────────────────────
    stripe: {
        // Secret key (sk_test_... for dev, sk_live_... for prod)
        secretKey:     process.env.STRIPE_SECRET_KEY,
        // Webhook signing secret from `stripe listen` or Stripe Dashboard
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
        // Public key is consumed by the frontend (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
        // but kept here for reference / server-side assertions
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        // Frontend base URL used to build success/cancel redirect URLs
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3001',
    },
    resend: {
        apiKey: process.env.RESEND_API_KEY,
    },

    minio: {
        endPoint:  process.env.MINIO_ENDPOINT  || 'localhost',
        port:      parseInt(process.env.MINIO_PORT || '9000', 10),
        useSSL:    process.env.MINIO_USE_SSL === 'true',
        accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
        secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
        region:    process.env.MINIO_REGION     || 'us-east-1',
    },

    upload: {
        maxCoverSize:      5   * 1024 * 1024,   //   5 MB
        maxSubmissionSize: 50  * 1024 * 1024,   //  50 MB
        maxMaterialSize:   200 * 1024 * 1024,   // 200 MB

        allowedCoverTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        allowedMaterialTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/zip',
            'application/x-zip-compressed',
            'text/plain',
            'image/jpeg', 'image/png', 'image/webp', 'image/gif',
            'video/mp4', 'video/webm', 'video/ogg',
            'audio/mpeg', 'audio/ogg', 'audio/wav',
        ],
    },
};