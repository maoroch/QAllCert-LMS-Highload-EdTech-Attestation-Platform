// controllers/fileController.js
import { logger } from '../utils/logger.js';

export class FileController {
    constructor(storageService, fileModel, courseModel, enrollmentModel) {
        this.storageService  = storageService;
        this.fileModel       = fileModel;
        this.courseModel     = courseModel;
        this.enrollmentModel = enrollmentModel;
    }

    // POST /courses/:courseId/cover
    uploadCourseCover = async (req, res, next) => {
        try {
            if (!req.file) return res.status(400).json({ error: 'No file provided' });
            const { courseId } = req.params;

            const course = await this.courseModel.findById(courseId);
            if (!course) return res.status(404).json({ error: 'Course not found' });
            if (req.user.role !== 'admin' && Number(course.teacher_id) !== Number(req.user.id)) {
                return res.status(403).json({ error: 'Not authorized' });
            }

            const file = await this.storageService.uploadCourseCover(
                courseId, req.file, req.user.id
            );

            // Patch cover_url on the course record
            await this.courseModel.update(courseId, { cover_url: file.public_url });

            logger.info('[FileController] Course cover updated', { courseId, userId: req.user.id });
            res.status(200).json({ cover_url: file.public_url, file });
        } catch (err) {
            next(err);
        }
    };

    // POST /lessons/:lessonId/files
    uploadLessonMaterial = async (req, res, next) => {
        try {
            if (!req.file) return res.status(400).json({ error: 'No file provided' });
            const { lessonId } = req.params;
            const { courseId } = req.body;  // sent by client

            if (!courseId) return res.status(400).json({ error: 'courseId is required' });

            const course = await this.courseModel.findById(courseId);
            if (!course) return res.status(404).json({ error: 'Course not found' });
            if (req.user.role !== 'admin' && Number(course.teacher_id) !== Number(req.user.id)) {
                return res.status(403).json({ error: 'Not authorized' });
            }

            const file = await this.storageService.uploadLessonMaterial(
                lessonId, courseId, req.file, req.user.id
            );

            logger.info('[FileController] Lesson material uploaded', { lessonId, userId: req.user.id });
            res.status(201).json(file);
        } catch (err) {
            next(err);
        }
    };

    // GET /lessons/:lessonId/files
    getLessonFiles = async (req, res, next) => {
        try {
            const files = await this.storageService.getLessonFiles(req.params.lessonId);
            res.json(files);
        } catch (err) {
            next(err);
        }
    };

    // GET /files/:fileId/download
    getDownloadUrl = async (req, res, next) => {
        try {
            const { fileId } = req.params;
            const record = await this.fileModel.findById(fileId);
            if (!record) return res.status(404).json({ error: 'File not found' });

            // Private files: only enrolled students, teacher of the course, or admin
            if (record.bucket === 'course-files') {
                const isAdmin = req.user.role === 'admin';
                const isOwner = Number(record.uploaded_by) === Number(req.user.id);

                let isEnrolled = false;
                if (record.course_id) {
                    const enrollment = await this.enrollmentModel
                        .findByUserAndCourse(req.user.id, record.course_id)
                        .catch(() => null);
                    isEnrolled = !!enrollment;

                    const course = await this.courseModel.findById(record.course_id);
                    const isTeacher = Number(course?.teacher_id) === Number(req.user.id);

                    if (!isAdmin && !isOwner && !isEnrolled && !isTeacher) {
                        return res.status(403).json({ error: 'Access denied' });
                    }
                } else if (!isAdmin && !isOwner) {
                    return res.status(403).json({ error: 'Access denied' });
                }
            }

            const { url, expiresIn } = await this.storageService.getDownloadUrl(
                fileId, req.user.id, req.user.role
            );

            logger.info('[FileController] Download URL served', { fileId, userId: req.user.id });
            res.json({ url, expires_in: expiresIn });
        } catch (err) {
            next(err);
        }
    };

    // DELETE /files/:fileId
    deleteFile = async (req, res, next) => {
        try {
            await this.storageService.deleteFile(
                req.params.fileId, req.user.id, req.user.role
            );
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    };
}
