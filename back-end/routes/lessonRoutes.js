import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { cacheMiddleware } from '../middlewares/cacheMiddleware.js';
import {
    validateCreateLesson,
    validateUpdateLesson,
} from '../middlewares/validationMiddleware.js';

export const createLessonRouter = (lessonController) => {
    const router = Router();
    router.use(authMiddleware);

    router.post('/modules/:moduleId/lessons',
        roleMiddleware(['teacher']), validateCreateLesson, lessonController.create);

    router.get('/modules/:moduleId/lessons',
        cacheMiddleware(30), lessonController.getByModule);

    // Lesson detail cached 30s — includes author name via JOIN
    router.get('/lessons/:lessonId',
        cacheMiddleware(30), lessonController.getOne);

    router.patch('/lessons/:lessonId',
        roleMiddleware(['teacher']), validateUpdateLesson, lessonController.update);

    router.delete('/lessons/:lessonId',
        roleMiddleware(['teacher']), lessonController.delete);

    return router;
};