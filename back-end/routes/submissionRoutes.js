import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { validateSubmission } from '../middlewares/validationMiddleware.js';
import { submissionLimiter } from '../middlewares/rateLimiter.js';

export const createSubmissionRouter = (submissionController) => {
    const router = Router();
    router.use(authMiddleware);

    // submissionLimiter prevents assignment spam (5 per minute)
    router.post('/assignments/:assignmentId/submit',
        submissionLimiter, validateSubmission, submissionController.submit);
    router.get('/assignments/:assignmentId/my-submission',
        submissionController.getMySubmission);
    router.get('/assignments/:assignmentId/submissions',
        roleMiddleware(['teacher']), submissionController.getAllForTeacher);

    return router;
};