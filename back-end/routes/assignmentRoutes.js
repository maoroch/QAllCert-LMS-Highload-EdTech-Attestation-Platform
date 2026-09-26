import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import {
    validateCreateAssignment,
    validateUpdateAssignment,
} from '../middlewares/validationMiddleware.js';

export const createAssignmentRouter = (assignmentController) => {
    const router = Router();
    router.use(authMiddleware);

    router.post('/lessons/:lessonId/assignments',   roleMiddleware(['teacher']), validateCreateAssignment, assignmentController.create);
    router.get('/lessons/:lessonId/assignments',    assignmentController.getByLesson);
    router.patch('/assignments/:assignmentId',      roleMiddleware(['teacher']), validateUpdateAssignment, assignmentController.update);
    router.delete('/assignments/:assignmentId',     roleMiddleware(['teacher']), assignmentController.delete);

    return router;
};