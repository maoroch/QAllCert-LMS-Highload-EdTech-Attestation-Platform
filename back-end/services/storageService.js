// services/storageService.js
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import {
    uploadObject, uploadLocalFile, deleteObject, getPresignedUrl, getPublicUrl,
    BUCKETS,
} from '../lib/minio.js';
import { logger } from '../utils/logger.js';

export class StorageService {
    constructor(fileModel) {
        this.fileModel = fileModel;   // FileModel for metadata persistence
    }

    // Helper: Upload file either from disk (streaming) or memory buffer, ensuring temp file cleanup
    async _uploadAndClean(bucket, objectName, file) {
        if (file.path) {
            try {
                await uploadLocalFile(bucket, objectName, file.path, file.mimetype);
            } finally {
                // Ensure temp file on disk is deleted after upload to prevent disk bloat
                fs.promises.unlink(file.path).catch((err) => {
                    logger.warn(`[Storage] Failed to unlink temp file ${file.path}: ${err.message}`);
                });
            }
        } else if (file.buffer) {
            await uploadObject(bucket, objectName, file.buffer, file.size, file.mimetype);
        } else {
            throw new Error('Invalid file object: neither path nor buffer provided');
        }
    }

    // ── Course cover (public) ────────────────────────────────────────────────

    async uploadCourseCover(courseId, file, uploadedBy) {
        const ext        = path.extname(file.originalname).toLowerCase();
        const objectName = `courses/${courseId}/cover${ext}`;

        await this._uploadAndClean(BUCKETS.PUBLIC, objectName, file);

        const publicUrl = getPublicUrl(objectName);

        // Persist metadata
        const record = await this.fileModel.upsertCourseCover({
            courseId,
            bucket:      BUCKETS.PUBLIC,
            objectName,
            originalName: file.originalname,
            mimeType:    file.mimetype,
            size:        file.size,
            publicUrl,
            uploadedBy,
        });

        logger.info('[Storage] Course cover uploaded', { courseId, objectName, uploadedBy });
        return record;
    }

    // ── Lesson material (private) ────────────────────────────────────────────

    async uploadLessonMaterial(lessonId, courseId, file, uploadedBy) {
        const ext        = path.extname(file.originalname).toLowerCase();
        const uid        = uuidv4();
        const objectName = `courses/${courseId}/lessons/${lessonId}/${uid}${ext}`;

        await this._uploadAndClean(BUCKETS.PRIVATE, objectName, file);

        const record = await this.fileModel.create({
            courseId,
            lessonId,
            bucket:       BUCKETS.PRIVATE,
            objectName,
            originalName: file.originalname,
            mimeType:     file.mimetype,
            size:         file.size,
            fileType:     'lesson_material',
            uploadedBy,
        });

        logger.info('[Storage] Lesson material uploaded', { lessonId, objectName, uploadedBy });
        return record;
    }

    // ── Submission file (private) ────────────────────────────────────────────

    async uploadSubmissionFile(submissionId, courseId, file, uploadedBy) {
        const ext        = path.extname(file.originalname).toLowerCase();
        const uid        = uuidv4();
        const objectName = `submissions/${courseId}/${submissionId}/${uid}${ext}`;

        await this._uploadAndClean(BUCKETS.PRIVATE, objectName, file);

        const record = await this.fileModel.create({
            courseId,
            submissionId,
            bucket:       BUCKETS.PRIVATE,
            objectName,
            originalName: file.originalname,
            mimeType:     file.mimetype,
            size:         file.size,
            fileType:     'submission',
            uploadedBy,
        });

        logger.info('[Storage] Submission file uploaded', { submissionId, objectName, uploadedBy });
        return record;
    }

    // ── Generate presigned download URL ────────────────────────────────────────

    async getDownloadUrl(fileId, requesterId, requesterRole) {
        const record = await this.fileModel.findById(fileId);
        if (!record) throw new Error('File not found');

        // Access check: only enrolled students, the teacher, or admin
        if (record.bucket === BUCKETS.PRIVATE) {
            if (requesterRole !== 'admin' &&
                Number(record.uploaded_by) !== Number(requesterId)) {
                // Allow if requester is the course teacher or enrolled — caller must verify
                // (See FileController for full auth logic)
            }
        }

        const url = record.bucket === BUCKETS.PUBLIC
            ? record.public_url
            : await getPresignedUrl(record.bucket, record.object_name, 3600);

        logger.info('[Storage] Download URL generated', { fileId, requesterId, bucket: record.bucket });
        return { url, expiresIn: record.bucket === BUCKETS.PUBLIC ? null : 3600 };
    }

    // ── Delete file ────────────────────────────────────────────────────────────

    async deleteFile(fileId, requesterId, requesterRole) {
        const record = await this.fileModel.findById(fileId);
        if (!record) throw new Error('File not found');

        if (requesterRole !== 'admin' && Number(record.uploaded_by) !== Number(requesterId)) {
            throw new Error('Not authorized');
        }

        await deleteObject(record.bucket, record.object_name);
        await this.fileModel.delete(fileId);
        logger.info('[Storage] File deleted', { fileId, requesterId });
        return true;
    }

    // ── List files for a lesson ───────────────────────────────────────────────

    async getLessonFiles(lessonId) {
        return this.fileModel.findByLesson(lessonId);
    }
}
