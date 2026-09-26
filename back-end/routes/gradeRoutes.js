import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { validateGrade } from '../middlewares/validationMiddleware.js';
import { gradingLimiter, studentReadLimiter } from '../middlewares/rateLimiter.js';

export const createGradeRouter = (gradeController) => {
    const router = Router();
    router.use(authMiddleware);

    // Teacher: grade a submission
    router.post('/submissions/:submissionId/grade',
        roleMiddleware(['teacher']), gradingLimiter, validateGrade, gradeController.grade);

    // Get single grade
    router.get('/submissions/:submissionId/grade', studentReadLimiter, gradeController.getGrade);

    // Teacher: all submissions for a course
    router.get('/courses/:courseId/submissions',
        roleMiddleware(['teacher']), gradeController.getCourseSubmissions);

    // Student: their own grades and pending submissions
    router.get('/me/grades',         roleMiddleware(['student']), studentReadLimiter, gradeController.getMyGrades);
    router.get('/me/grades/pending', roleMiddleware(['student']), studentReadLimiter, gradeController.getMyPending);

    return router;
};