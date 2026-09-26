import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { validateReview } from '../middlewares/validationMiddleware.js';
import { reviewLimiter } from '../middlewares/rateLimiter.js';

export const createReviewRouter = (reviewController) => {
    const router = Router();
    router.use(authMiddleware);

    router.post('/courses/:courseId/reviews',    roleMiddleware(['student']), reviewLimiter, validateReview, reviewController.create);
    router.get('/courses/:courseId/reviews',     reviewController.getByCourse);
    router.post('/teachers/:teacherId/reviews',  roleMiddleware(['student']), reviewLimiter, validateReview, reviewController.create);
    router.get('/teachers/:teacherId/reviews',   reviewController.getByTeacher);
    router.delete('/reviews/:reviewId',          roleMiddleware(['student']), reviewController.delete);

    return router;
};