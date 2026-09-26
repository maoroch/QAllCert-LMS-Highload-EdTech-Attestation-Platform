import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import {
    validateCreateModule,
    validateUpdateModule,
} from '../middlewares/validationMiddleware.js';

export const createModuleRouter = (moduleController) => {
    const router = Router();
    router.use(authMiddleware);

    router.post('/courses/:courseId/modules',   roleMiddleware(['teacher']), validateCreateModule, moduleController.create);
    router.get('/courses/:courseId/modules',    moduleController.getByCourse);
    router.patch('/modules/:moduleId',          roleMiddleware(['teacher']), validateUpdateModule, moduleController.update);
    router.delete('/modules/:moduleId',         roleMiddleware(['teacher']), moduleController.delete);

    return router;
};