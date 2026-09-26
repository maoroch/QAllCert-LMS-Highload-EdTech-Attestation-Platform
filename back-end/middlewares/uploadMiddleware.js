// middlewares/uploadMiddleware.js
import multer from 'multer';
import config from '../config/index.js';
import { logger } from '../utils/logger.js';

import os from 'os';
import path from 'path';
import fs from 'fs';

// Temporary directory for streaming file uploads without clogging V8 RAM (OOM protection)
const uploadTmpDir = path.join(os.tmpdir(), 'qallcert-uploads');
if (!fs.existsSync(uploadTmpDir)) {
    try {
        fs.mkdirSync(uploadTmpDir, { recursive: true });
    } catch (e) {
        logger.warn('[Upload] Failed to ensure uploadTmpDir', { error: e.message });
    }
}

const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadTmpDir),
    filename: (req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${unique}${path.extname(file.originalname)}`);
    }
});

function makeFilter(allowedMimeTypes) {
    return (req, file, cb) => {
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`File type "${file.mimetype}" is not allowed.`), false);
        }
    };
}

// ── Course cover (public bucket) ──────────────────────────────────────────────
export const uploadCourseCover = multer({
    storage: diskStorage,
    limits: { fileSize: config.upload.maxCoverSize },
    fileFilter: makeFilter(config.upload.allowedCoverTypes),
}).single('cover');

// ── Lesson materials (private bucket, up to 200MB) ────────────────────────────
export const uploadLessonMaterial = multer({
    storage: diskStorage,
    limits: { fileSize: config.upload.maxMaterialSize },
    fileFilter: makeFilter(config.upload.allowedMaterialTypes),
}).single('file');

// ── Homework submission (private bucket, up to 50MB) ──────────────────────────
export const uploadSubmissionFile = multer({
    storage: diskStorage,
    limits: { fileSize: config.upload.maxSubmissionSize },
    fileFilter: makeFilter(config.upload.allowedMaterialTypes),
}).single('file');

// ── Error handler wrapper (turns multer errors into 400 responses) ────────────
export function handleMulterError(uploadFn) {
    return (req, res, next) => {
        uploadFn(req, res, (err) => {
            if (!err) return next();
            logger.warn('[Upload] Multer error', { message: err.message, user: req.user?.id });
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(413).json({ error: 'File too large', details: err.message });
                }
                return res.status(400).json({ error: 'Upload error', details: err.message });
            }
            return res.status(400).json({ error: err.message });
        });
    };
}
