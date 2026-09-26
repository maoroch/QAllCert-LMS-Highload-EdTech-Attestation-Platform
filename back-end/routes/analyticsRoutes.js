import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

export const createAnalyticsRouter = (analyticsController) => {
    const router = Router();
    router.use(authMiddleware);
    router.get('/analytics/me', analyticsController.getMyAnalytics);
    router.get('/analytics/courses/:courseId', roleMiddleware(['teacher']), analyticsController.getCourseAnalytics);
    return router;
};