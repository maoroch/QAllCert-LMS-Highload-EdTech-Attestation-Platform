import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { studentWriteLimiter, studentReadLimiter } from '../middlewares/rateLimiter.js';

export const createEnrollmentRouter = (enrollmentController) => {
    const router = Router();
    router.use(authMiddleware);
    router.post('/courses/:courseId/enroll',      studentWriteLimiter, enrollmentController.enroll);
    router.get('/enrollments/my',                  studentReadLimiter,  enrollmentController.getMyCourses);
    router.get('/me/enrollments',                  studentReadLimiter,  enrollmentController.getMyCourses);
    router.post('/lessons/:lessonId/complete',      studentWriteLimiter, enrollmentController.completeLesson);
    router.get('/courses/:courseId/progress',       studentReadLimiter,  enrollmentController.getProgress);
    return router;
};