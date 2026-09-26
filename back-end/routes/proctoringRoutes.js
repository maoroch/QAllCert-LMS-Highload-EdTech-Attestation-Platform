import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';

export const createProctoringRouter = (proctoringController) => {
    const router = Router();
    router.use(authMiddleware);
    
    router.post('/proctoring/sessions', proctoringController.startSession);
    router.post('/proctoring/sessions/:sessionId/end', proctoringController.endSession);
    router.post('/proctoring/sessions/:sessionId/events', proctoringController.logEvent);
    router.get('/proctoring/sessions/:sessionId/events', proctoringController.getSessionEvents);
    
    return router;
};
