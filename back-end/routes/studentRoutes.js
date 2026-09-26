import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

export const createStudentRouter = (studentController) => {
    const router = Router();
    router.use(authMiddleware);
    router.get('/courses/:courseId/students', roleMiddleware(['teacher', 'admin']), studentController.getStudentsByCourse);
    return router;
};