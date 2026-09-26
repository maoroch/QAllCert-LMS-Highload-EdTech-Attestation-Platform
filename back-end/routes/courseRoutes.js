import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { cacheMiddleware } from '../middlewares/cacheMiddleware.js';
import { teacherWriteLimiter, studentReadLimiter } from '../middlewares/rateLimiter.js';
import {
    validateCreateCourse,
    validateUpdateCourse,
} from '../middlewares/validationMiddleware.js';

export const createCourseRouter = (courseController) => {
    const router = Router();

    // Public routes (no auth required for catalog browsing)
    router.get('/', studentReadLimiter, cacheMiddleware(60), courseController.getAll);
    router.get('/:courseId', studentReadLimiter, cacheMiddleware(30), courseController.getOne);
    router.get('/:courseId/curriculum', studentReadLimiter, cacheMiddleware(30), courseController.getCurriculum);

    // Protected routes (auth & teacher role required)
    router.post('/', authMiddleware, roleMiddleware(['teacher']), teacherWriteLimiter, validateCreateCourse, courseController.create);
    router.patch('/:courseId', authMiddleware, roleMiddleware(['teacher']), teacherWriteLimiter, validateUpdateCourse, courseController.update);
    router.delete('/:courseId', authMiddleware, roleMiddleware(['teacher']), teacherWriteLimiter, courseController.delete);
    router.patch('/:courseId/publish', authMiddleware, roleMiddleware(['teacher']), teacherWriteLimiter, courseController.publish);
    router.patch('/:courseId/unpublish', authMiddleware, roleMiddleware(['teacher']), teacherWriteLimiter, courseController.unpublish);

    return router;
};
