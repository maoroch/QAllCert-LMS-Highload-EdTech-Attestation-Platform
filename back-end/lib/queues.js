import { Queue, Worker } from 'bullmq';
import { getBullConnection } from './redis.js';
import { generateCertificatePdf } from '../utils/pdfGenerator.js';
import { generateVerificationCode } from '../utils/generateCode.js';

// ── Queues ────────────────────────────────────────────────────────────────────
export const certificateQueue = new Queue('certificate-queue', {
    connection: getBullConnection(),
    defaultJobOptions: { attempts: 3, backoff: { type: 'exponential', delay: 5000 } },
});

export const analyticsQueue = new Queue('analytics-queue', {
    connection: getBullConnection(),
    defaultJobOptions: { attempts: 2 },
});

export const proctoringQueue = new Queue('proctoring-queue', {
    connection: getBullConnection(),
    defaultJobOptions: { attempts: 1, timeout: 60000 },
});

// ── Certificate worker ────────────────────────────────────────────────────────
// NOTE: pool must be injected via setupWorkers() because queues.js is loaded
// before the DB pool is available at the top level.
let _pool = null;

export function injectPool(pool) {
    _pool = pool;
}

async function processCertificate({ userId, courseId }) {
    console.log(`[Worker] Generating certificate for user ${userId}, course ${courseId}`);

    if (!_pool) {
        throw new Error('DB pool not injected into certificate worker');
    }

    // 1. Avoid duplicate certificates
    const existing = await _pool.query(
        `SELECT id FROM certificates WHERE user_id = $1 AND course_id = $2`,
        [userId, courseId]
    );
    if (existing.rows.length > 0) {
        console.log(`[Worker] Certificate already exists for user ${userId}, course ${courseId} — skipping`);
        return { skipped: true };
    }

    // 2. Fetch user full_name (prefer student_profiles, fallback to users.email)
    const userRes = await _pool.query(
        `SELECT u.email, COALESCE(sp.full_name, u.email) as full_name
         FROM users u
         LEFT JOIN student_profiles sp ON sp.user_id = u.id
         WHERE u.id = $1`,
        [userId]
    );
    if (!userRes.rows.length) throw new Error(`User ${userId} not found`);
    const { full_name } = userRes.rows[0];

    // 3. Fetch course title
    const courseRes = await _pool.query(
        `SELECT title FROM courses WHERE id = $1`,
        [courseId]
    );
    if (!courseRes.rows.length) throw new Error(`Course ${courseId} not found`);
    const { title: courseTitle } = courseRes.rows[0];

    // 4. Generate PDF
    const code = generateVerificationCode();
    const pdfUrl = await generateCertificatePdf(full_name, courseTitle, new Date().toISOString(), code);

    // 5. Persist certificate row
    await _pool.query(
        `INSERT INTO certificates (user_id, course_id, pdf_url, verification_code)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id, course_id) DO NOTHING`,
        [userId, courseId, pdfUrl, code]
    );

    console.log(`[Worker] Certificate saved — user ${userId}, course ${courseId}, file ${pdfUrl}`);
    return { success: true, pdfUrl };
}

async function processAnalytics(data) {
    console.log(`[Worker] Analytics job:`, data);
    return { processed: true };
}

async function processProctoring(data) {
    console.log(`[Worker] Proctoring frame for session ${data.sessionId}`);
    return { processed: true };
}

// ── Setup ─────────────────────────────────────────────────────────────────────
export function setupWorkers(pool) {
    // Inject pool so the certificate worker can query the DB
    if (pool) injectPool(pool);

    const certWorker = new Worker(
        'certificate-queue',
        (job) => processCertificate(job.data),
        { connection: getBullConnection() }
    );
    const analyticsWorker = new Worker(
        'analytics-queue',
        (job) => processAnalytics(job.data),
        { connection: getBullConnection() }
    );
    const procWorker = new Worker(
        'proctoring-queue',
        (job) => processProctoring(job.data),
        { connection: getBullConnection() }
    );

    certWorker.on('completed', (job) => console.log(`✅ Certificate job ${job.id} done`));
    certWorker.on('failed', (job, err) => console.error(`❌ Certificate job ${job?.id} failed:`, err.message));
    analyticsWorker.on('completed', (job) => console.log(`✅ Analytics job ${job.id} done`));
    procWorker.on('completed', (job) => console.log(`✅ Proctoring job ${job.id} done`));

    return { certWorker, analyticsWorker, procWorker };
}

export async function addCertificateJob(userId, courseId) {
    return await certificateQueue.add('generate', { userId, courseId });
}

export async function addAnalyticsJob(type, payload) {
    return await analyticsQueue.add(type, payload);
}