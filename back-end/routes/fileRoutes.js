// routes/fileRoutes.js
import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import {
    uploadCourseCover,
    uploadLessonMaterial,
    handleMulterError,
} from '../middlewares/uploadMiddleware.js';

export const createFileRouter = (fileController) => {
    const router = express.Router();

    // All routes require authentication (applied individually below to prevent global /api block)

    // ── Course cover ─────────────────────────────────────────────────────────
    // POST /courses/:courseId/cover
    router.post(
        '/courses/:courseId/cover',
        authMiddleware,
        roleMiddleware(['teacher', 'admin']),
        handleMulterError(uploadCourseCover),
        fileController.uploadCourseCover
    );

    // ── Lesson materials ─────────────────────────────────────────────────────
    // POST /lessons/:lessonId/files
    router.post(
        '/lessons/:lessonId/files',
        authMiddleware,
        roleMiddleware(['teacher', 'admin']),
        handleMulterError(uploadLessonMaterial),
        fileController.uploadLessonMaterial
    );

    // GET /lessons/:lessonId/files
    router.get(
        '/lessons/:lessonId/files',
        authMiddleware,
        fileController.getLessonFiles
    );

    // ── File access ──────────────────────────────────────────────────────────
    // GET /files/:fileId/download  — returns presigned URL
    router.get(
        '/files/:fileId/download',
        authMiddleware,
        fileController.getDownloadUrl
    );

    // DELETE /files/:fileId
    router.delete(
        '/files/:fileId',
        authMiddleware,
        roleMiddleware(['teacher', 'admin']),
        fileController.deleteFile
    );

    return router;
};
