import { generateVerificationCode } from '../utils/generateCode.js';
import { generateCertificatePdf } from '../utils/pdfGenerator.js';
import { addCertificateJob, certificateQueue } from '../lib/queues.js';
import { logger } from '../utils/logger.js';

export class CertificateService {
    constructor(certificateModel, enrollmentModel, courseModel, userModel, studentProfileModel, redisClient = null) {
        this.certificateModel = certificateModel;
        this.enrollmentModel = enrollmentModel;
        this.courseModel = courseModel;
        this.userModel = userModel;
        this.studentProfileModel = studentProfileModel;
        this.redisClient = redisClient;
    }

    async _generateSync(userId, courseId) {
        const user = await this.userModel.findById(userId);
        const course = await this.courseModel.findById(courseId);

        let fullName = user?.email || 'Слушатель курса';
        try {
            const profile = await this.studentProfileModel?.findByUserId(userId);
            if (profile?.full_name) fullName = profile.full_name;
        } catch { /* ignore */ }

        const code = generateVerificationCode();
        const pdfUrl = await generateCertificatePdf(
            fullName,
            course.title,
            new Date().toISOString(),
            code
        );

        return await this.certificateModel.create({
            userId,
            courseId,
            pdfUrl,
            verificationCode: code,
        });
    }

    async generateCertificate(userId, courseId) {
        // 1. Verify the course is completed
        const enrollment = await this.enrollmentModel.findOne(userId, courseId);
        if (!enrollment || enrollment.status !== 'completed') {
            throw new Error('Course not completed');
        }

        // 2. Return existing certificate if already issued
        const existing = await this.certificateModel.findByUserAndCourse(userId, courseId);
        if (existing && existing.pdf_url) return existing;

        // 3. Queue the background generation job in BullMQ to avoid Event Loop freeze
        try {
            const job = await addCertificateJob(userId, courseId);

            // Wait briefly (up to 2500ms) for quick response if queue is free
            try {
                await job.waitUntilFinished(certificateQueue.token, 2500);
                const created = await this.certificateModel.findByUserAndCourse(userId, courseId);
                if (created) return created;
            } catch {
                // Background worker is taking longer due to load
            }

            return {
                status: 'processing',
                message: 'Certificate generation queued in background',
                jobId: job.id,
                userId,
                courseId
            };
        } catch (queueErr) {
            // Fallback to synchronous generation if Redis/BullMQ is down
            logger.warn('[CertificateService] BullMQ queue unavailable, falling back to sync generation', { error: queueErr.message });
            return await this._generateSync(userId, courseId);
        }
    }

    async getUserCertificates(userId) {
        return this.certificateModel.findByUser(userId);
    }

    async verifyCertificate(code) {
        const cacheKey = `cert:verify:${code}`;
        if (this.redisClient) {
            try {
                const cached = await this.redisClient.get(cacheKey);
                if (cached) {
                    return JSON.parse(cached);
                }
            } catch (err) {
                logger.warn('[CertificateService] Redis get error', { error: err.message });
            }
        }

        const cert = await this.certificateModel.findByCode(code);
        if (cert && this.redisClient) {
            try {
                // Cache valid certificates in Redis for 24 hours (86400 seconds)
                await this.redisClient.set(cacheKey, JSON.stringify(cert), { EX: 86400 });
            } catch (err) {
                logger.warn('[CertificateService] Redis set error', { error: err.message });
            }
        }
        return cert;
    }
}