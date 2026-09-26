// app.js  — Stripe-integrated version
// Changes vs original:
//   1. Import StripeService
//   2. Instantiate stripeService after config is available
//   3. Pass stripeService to OrderController constructor
//   4. Register Stripe webhook route BEFORE express.json() middleware
//
// Everything else is identical to the original app.js.

import express from 'express';
import pg from 'pg';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import config from './config/index.js';
import { initRedis } from './lib/redis.js';
import { setupWorkers } from './lib/queues.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { limiter } from './middlewares/rateLimiter.js';
import { swaggerMiddleware, swaggerJsonMiddleware } from './swagger/swaggerMiddleware.js';
import { seed } from './seed.js';

// Models
import { UserModel } from './models/userModel.js';
import { RefreshTokenModel } from './models/refreshTokenModel.js';
import { StudentProfileModel } from './models/studentProfileModel.js';
import { TeacherProfileModel } from './models/teacherProfileModel.js';
import { CourseModel } from './models/courseModel.js';
import { ModuleModel } from './models/moduleModel.js';
import { LessonModel } from './models/lessonModel.js';
import { EnrollmentModel } from './models/enrollmentModel.js';
import { LessonProgressModel } from './models/lessonProgressModel.js';
import { AssignmentModel } from './models/assignmentModel.js';
import { SubmissionModel } from './models/submissionModel.js';
import { GradeModel } from './models/gradeModel.js';
import { CertificateModel } from './models/certificateModel.js';
import { StatsModel } from './models/statsModel.js';
import { ProctoringModel } from './models/proctoringModel.js';
import { ReviewModel } from './models/reviewModel.js';
import { OrderModel } from './models/orderModel.js';

// Services
import { AuthService } from './services/authService.js';
import { CourseService } from './services/courseService.js';
import { ModuleService } from './services/moduleService.js';
import { LessonService } from './services/lessonService.js';
import { EnrollmentService } from './services/enrollmentService.js';
import { AssignmentService } from './services/assignmentService.js';
import { SubmissionService } from './services/submissionService.js';
import { GradeService } from './services/gradeService.js';
import { CertificateService } from './services/certificateService.js';
import { AnalyticsService } from './services/analyticsService.js';
import { UserService } from './services/userService.js';
import { ProctoringService } from './services/proctoringService.js';
import { ReviewService } from './services/reviewService.js';
import { NotificationService } from './services/notificationService.js';
import { OrderService } from './services/orderService.js';
import { StripeService } from './services/stripeService.js';
import { EmailService } from './services/emailService.js';

// Controllers
import { AuthController } from './controllers/authController.js';
import { CourseController } from './controllers/courseController.js';
import { ModuleController } from './controllers/moduleController.js';
import { LessonController } from './controllers/lessonController.js';
import { EnrollmentController } from './controllers/enrollmentController.js';
import { AssignmentController } from './controllers/assignmentController.js';
import { SubmissionController } from './controllers/submissionController.js';
import { GradeController } from './controllers/gradeController.js';
import { CertificateController } from './controllers/certificateController.js';
import { AnalyticsController } from './controllers/analyticsController.js';
import { UserController } from './controllers/userController.js';
import { ProctoringController } from './controllers/proctoringController.js';
import { ReviewController } from './controllers/reviewController.js';
import { StudentController } from './controllers/studentController.js';
import { OrderController } from './controllers/orderController.js';

// Routes
import { createAuthRouter } from './routes/authRoutes.js';
import { createCourseRouter } from './routes/courseRoutes.js';
import { createModuleRouter } from './routes/moduleRoutes.js';
import { createLessonRouter } from './routes/lessonRoutes.js';
import { createEnrollmentRouter } from './routes/enrollmentRoutes.js';
import { createAssignmentRouter } from './routes/assignmentRoutes.js';
import { createSubmissionRouter } from './routes/submissionRoutes.js';
import { createGradeRouter } from './routes/gradeRoutes.js';
import { createCertificateRouter } from './routes/certificateRoutes.js';
import { createAnalyticsRouter } from './routes/analyticsRoutes.js';
import { createUserRouter } from './routes/userRoutes.js';
import { createProctoringRouter } from './routes/proctoringRoutes.js';
import { createReviewRouter } from './routes/reviewRoutes.js';
import { createStudentRouter } from './routes/studentRoutes.js';
import { createNotificationRouter } from './routes/notificationRoutes.js';
import { createFileRouter } from './routes/fileRoutes.js';
import { createOrderRouter } from './routes/orderRoutes.js';

// MinIO
import { initMinio, getMinioClient, BUCKETS } from './lib/minio.js';
import { FileModel } from './models/fileModel.js';
import { StorageService } from './services/storageService.js';
import { FileController } from './controllers/fileController.js';
import { logger } from './utils/logger.js';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

// ── CRITICAL: Stripe webhook must receive raw body ────────────────────────────
// Register the webhook route BEFORE express.json() so the raw Buffer is preserved.
// The route itself applies express.raw() only to this specific endpoint.
// We create a temporary router here solely for the webhook; the full order router
// (with auth middleware) is mounted later after express.json().
import { createOrderRouter as createOrderRouterForWebhook } from './routes/orderRoutes.js';

// ── Security & parsing middleware ─────────────────────────────────────────────
app.use(cors());
app.use(helmet());

// ── Static files ──────────────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// ── Stateless Certificate Fallback ────────────────────────────────────────────
// If PDF is missing on local disk (multi-replica container / reboot), stream from MinIO
app.get('/certificates/:fileName', async (req, res, next) => {
    const localPath = path.join(__dirname, 'public', 'certificates', req.params.fileName);
    if (fs.existsSync(localPath)) {
        return res.sendFile(localPath);
    }
    try {
        const client = getMinioClient();
        const stream = await client.getObject(BUCKETS.PUBLIC, `certificates/${req.params.fileName}`);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${req.params.fileName}"`);
        stream.pipe(res);
    } catch (err) {
        next();
    }
});

// ── PostgreSQL Connection Pool (Tuned for Concurrency & Resiliency) ───────────
const pool = new pg.Pool({
    connectionString: config.postgresUri,
    max: parseInt(process.env.PG_POOL_MAX || '30', 10),
    idleTimeoutMillis: parseInt(process.env.PG_IDLE_TIMEOUT || '30000', 10),
    connectionTimeoutMillis: parseInt(process.env.PG_CONN_TIMEOUT || '5000', 10),
});

// Prevent unhandled error event on idle pool client from crashing the process
pool.on('error', (err) => {
    logger.error('Unexpected idle PostgreSQL client error', { error: err.message });
});

let redisClient;

async function startServer() {
    try {
        await pool.connect();
        console.log('✅ PostgreSQL connected');

        // Automatically run migrations if needed
        try {
            await pool.query(`
                CREATE TABLE IF NOT EXISTS public.course_coauthors (
                    id SERIAL PRIMARY KEY,
                    course_id integer NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
                    teacher_id integer NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
                    created_at timestamp with time zone DEFAULT now(),
                    UNIQUE (course_id, teacher_id)
                );
            `);
            console.log('✅ Database migration: course_coauthors table ready');

            await pool.query(`
                ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;
            `);
            console.log('✅ Database migration: courses.slug column ready');
        } catch (migErr) {
            console.error('⚠️ Database migration failed:', migErr.message);
        }

        // Automatically seed database if empty
        try {
            await seed(pool);
        } catch (seedErr) {
            console.error('⚠️ Auto-seed failed:', seedErr.message);
        }

        redisClient = await initRedis(app);
        console.log('✅ Redis ready');

        // ── Models ──────────────────────────────────────────────────────────────
        const userModel             = new UserModel(pool);
        const refreshTokenModel     = new RefreshTokenModel(pool);
        const studentProfileModel   = new StudentProfileModel(pool);
        const teacherProfileModel   = new TeacherProfileModel(pool);
        const courseModel           = new CourseModel(pool);
        const moduleModel           = new ModuleModel(pool);
        const lessonModel           = new LessonModel(pool);
        const enrollmentModel       = new EnrollmentModel(pool);
        const lessonProgressModel   = new LessonProgressModel(pool);
        const assignmentModel       = new AssignmentModel(pool);
        const submissionModel       = new SubmissionModel(pool);
        const gradeModel            = new GradeModel(pool);
        const certificateModel      = new CertificateModel(pool);
        const statsModel            = new StatsModel(pool);
        const proctoringModel       = new ProctoringModel(pool);
        const orderModel            = new OrderModel(pool);

        // ── Services ─────────────────────────────────────────────────────────────
        const emailService       = new EmailService();
        const authService        = new AuthService(
            userModel, refreshTokenModel, studentProfileModel, teacherProfileModel, redisClient, emailService
        );
        const courseService      = new CourseService(courseModel, userModel);
        const moduleService      = new ModuleService(moduleModel, courseModel);
        const lessonService      = new LessonService(lessonModel, moduleModel, courseModel);
        const enrollmentService  = new EnrollmentService(
            enrollmentModel, lessonProgressModel, courseModel, userModel, statsModel,
            lessonModel, moduleModel, pool, certificateModel,
        );
        const notificationService = new NotificationService(pool);
        const assignmentService   = new AssignmentService(assignmentModel, lessonModel, moduleModel, courseModel);
        const submissionService   = new SubmissionService(submissionModel, assignmentModel, lessonModel, moduleModel, courseModel);
        const gradeService        = new GradeService(
            gradeModel, submissionModel, assignmentModel,
            statsModel, lessonModel, moduleModel, notificationService, courseModel,
        );
        const certificateService  = new CertificateService(
            certificateModel, enrollmentModel, courseModel, userModel, studentProfileModel, redisClient
        );
        const analyticsService    = new AnalyticsService(statsModel, enrollmentModel, gradeModel, assignmentModel, courseModel);
        const userService         = new UserService(studentProfileModel, teacherProfileModel);
        const proctoringService   = new ProctoringService(proctoringModel);
        const orderService        = new OrderService(orderModel, courseModel, enrollmentModel, enrollmentService);

        // ▼ NEW: instantiate Stripe service
        const stripeService = new StripeService();

        // ── Controllers ───────────────────────────────────────────────────────────
        const authController        = new AuthController(authService);
        const courseController      = new CourseController(courseService);
        const moduleController      = new ModuleController(moduleService);
        const lessonController      = new LessonController(lessonService);
        const enrollmentController  = new EnrollmentController(enrollmentService);
        const assignmentController  = new AssignmentController(assignmentService);
        const submissionController  = new SubmissionController(submissionService);
        const gradeController       = new GradeController(gradeService);
        const certificateController = new CertificateController(certificateService);
        const analyticsController   = new AnalyticsController(analyticsService);
        const userController        = new UserController(userService);
        const proctoringController  = new ProctoringController(proctoringService);
        // ▼ CHANGED: pass stripeService as second argument
        const orderController       = new OrderController(orderService, stripeService);

        // MinIO
        await initMinio();
        logger.info('[App] MinIO ready');

        const fileModel      = new FileModel(pool);
        const storageService = new StorageService(fileModel);
        const fileController = new FileController(storageService, fileModel, courseModel, enrollmentModel);

        const reviewModel      = new ReviewModel(pool);
        const reviewService    = new ReviewService(reviewModel, enrollmentModel);
        const reviewController = new ReviewController(reviewService);
        const studentController = new StudentController(studentProfileModel, courseModel);

        // ── CRITICAL: mount order router BEFORE express.json() ────────────────────
        // The Stripe webhook endpoint inside createOrderRouter uses express.raw()
        // for its own route, but the other routes inside the same router still need
        // express.json() applied later. This works because express.raw() is applied
        // per-route, not globally.
        const orderRouter = createOrderRouter(orderController);
        app.use('/api', orderRouter);

        // ── Now safe to add JSON body parsing for all other routes ────────────────
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(limiter);

        // ── Routes ────────────────────────────────────────────────────────────────
        app.use('/api',                  createFileRouter(fileController));
        app.use('/api/auth',             createAuthRouter(authController));
        app.use('/api/courses',          createCourseRouter(courseController));
        app.use('/api',                  createModuleRouter(moduleController));
        app.use('/api',                  createLessonRouter(lessonController));
        app.use('/api',                  createEnrollmentRouter(enrollmentController));
        app.use('/api',                  createAssignmentRouter(assignmentController));
        app.use('/api',                  createSubmissionRouter(submissionController));
        app.use('/api',                  createReviewRouter(reviewController));
        app.use('/api',                  createStudentRouter(studentController));
        app.use('/api',                  createGradeRouter(gradeController));
        app.use('/api',                  createCertificateRouter(certificateController));
        app.use('/api',                  createAnalyticsRouter(analyticsController));
        app.use('/api',                  createUserRouter(userController));
        app.use('/api',                  createProctoringRouter(proctoringController));
        app.use('/api/notifications',    createNotificationRouter(notificationService));
        // Note: order router is already mounted above (before express.json)

        app.use('/api-docs', ...swaggerMiddleware);
        app.get('/api-docs.json', swaggerJsonMiddleware);

        // Health check
        app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }));

        // Global error handler
        app.use(errorHandler);

        // BullMQ workers
        setupWorkers(pool);
        console.log('🚀 BullMQ workers started');

        const server = app.listen(config.port, () => {
            console.log(`🚀 Server listening on port ${config.port}`);
        });

        const shutdown = async (signal) => {
            console.log(`${signal} received, closing server...`);
            server.close(async () => {
                console.log('HTTP server closed');
                await pool.end();
                console.log('PostgreSQL pool closed');
                if (redisClient) await redisClient.quit();
                console.log('Redis disconnected');
                process.exit(0);
            });
        };
        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT',  () => shutdown('SIGINT'));

    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

startServer();

export default app;