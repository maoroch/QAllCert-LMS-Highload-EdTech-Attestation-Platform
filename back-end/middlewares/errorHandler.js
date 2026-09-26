import { logger } from '../utils/logger.js';

const ERROR_STATUS_MAP = {
    'Not found': 404,
    'not found': 404,
    'Not authorized': 403,
    'Not enrolled': 403,
    'Unauthorized': 401,
    'Already enrolled': 409,
    'User already exists': 409,
    'requires payment': 402,
    'File too large': 413,
    'File type': 415,
    'EMAIL_NOT_VERIFIED': 403,
    'Invalid credentials': 401,
};

function resolveStatus(err) {
    if (err.status) return err.status;
    if (err.statusCode) return err.statusCode;
    const msg = err.message || '';
    for (const [key, code] of Object.entries(ERROR_STATUS_MAP)) {
        if (msg.includes(key)) return code;
    }
    return 500;
}

export const errorHandler = (err, req, res, next) => {
    const status = resolveStatus(err);
    const message = err.message || 'Internal Server Error';

    logger.error('[Error]', {
        status,
        message,
        method: req.method,
        path: req.originalUrl,
        userId: req.user?.id,
        stack: status === 500 ? err.stack : undefined,
    });

    res.status(status).json({ error: message });
};
