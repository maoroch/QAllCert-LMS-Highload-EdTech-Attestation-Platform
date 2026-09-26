import * as Minio from 'minio';
import config from '../config/index.js';
import { logger } from '../utils/logger.js';

// ── Singleton ────────────────────────────────────────────────────────────────
let _client = null;

export function getMinioClient() {
    if (_client) return _client;
    _client = new Minio.Client({
        endPoint:  config.minio.endPoint,
        port:      config.minio.port,
        useSSL:    config.minio.useSSL,
        accessKey: config.minio.accessKey,
        secretKey: config.minio.secretKey,
    });
    return _client;
}

// ── Bucket definitions ────────────────────────────────────────────────────────
export const BUCKETS = {
    PUBLIC:  'public-assets',   // course covers — world-readable
    PRIVATE: 'course-files',    // lesson materials, submissions — API-only
};

const BUCKET_POLICIES = {
    [BUCKETS.PUBLIC]: JSON.stringify({
        Version: '2012-10-17',
        Statement: [{
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action:    ['s3:GetObject'],
            Resource:  [`arn:aws:s3:::${BUCKETS.PUBLIC}/*`],
        }],
    }),
};

// ── Init: create buckets if missing and set policies ─────────────────────────
export async function initMinio() {
    const client = getMinioClient();

    for (const bucket of Object.values(BUCKETS)) {
        const exists = await client.bucketExists(bucket);
        if (!exists) {
            await client.makeBucket(bucket, config.minio.region || 'us-east-1');
            logger.info(`[MinIO] Created bucket: ${bucket}`);
        } else {
            logger.info(`[MinIO] Bucket already exists: ${bucket}`);
        }

        // Apply public-read policy for public bucket
        if (BUCKET_POLICIES[bucket]) {
            await client.setBucketPolicy(bucket, BUCKET_POLICIES[bucket]);
            logger.info(`[MinIO] Applied public policy: ${bucket}`);
        }
    }
    logger.info('[MinIO] Initialisation complete');
}

// ── Upload helper ─────────────────────────────────────────────────────────────
/**
 * @param {string} bucket
 * @param {string} objectName  — e.g. 'courses/42/cover.jpg'
 * @param {Buffer|stream.Readable} stream
 * @param {number} size
 * @param {string} mimeType
 * @returns {Promise<string>}  objectName (stored as metadata)
 */
export async function uploadObject(bucket, objectName, stream, size, mimeType) {
    const client = getMinioClient();
    await client.putObject(bucket, objectName, stream, size, {
        'Content-Type': mimeType,
        'x-amz-meta-uploaded-at': new Date().toISOString(),
    });
    logger.info(`[MinIO] Uploaded: ${bucket}/${objectName} (${size} bytes, ${mimeType})`);
    return objectName;
}

/**
 * Upload a file from disk directly to MinIO using streaming/fPutObject.
 * Prevents allocating large file buffers in Node.js RAM (OOM protection).
 * @param {string} bucket
 * @param {string} objectName
 * @param {string} filePath
 * @param {string} mimeType
 */
export async function uploadLocalFile(bucket, objectName, filePath, mimeType) {
    const client = getMinioClient();
    await client.fPutObject(bucket, objectName, filePath, {
        'Content-Type': mimeType,
        'x-amz-meta-uploaded-at': new Date().toISOString(),
    });
    logger.info(`[MinIO] Uploaded from disk: ${bucket}/${objectName} (${mimeType})`);
    return objectName;
}

// ── Delete helper ─────────────────────────────────────────────────────────────
export async function deleteObject(bucket, objectName) {
    const client = getMinioClient();
    try {
        await client.removeObject(bucket, objectName);
        logger.info(`[MinIO] Deleted: ${bucket}/${objectName}`);
    } catch (err) {
        // Don't throw — deletion is best-effort
        logger.warn(`[MinIO] Delete warning for ${bucket}/${objectName}: ${err.message}`);
    }
}

// ── Pre-signed URL (temporary download link) ──────────────────────────────────
/**
 * @param {string} bucket
 * @param {string} objectName
 * @param {number} expirySeconds  default 1 hour
 */
export async function getPresignedUrl(bucket, objectName, expirySeconds = 3600) {
    const client = getMinioClient();
    return client.presignedGetObject(bucket, objectName, expirySeconds);
}

// ── Public URL (no auth needed for public bucket) ────────────────────────────
export function getPublicUrl(objectName) {
    return `/${BUCKETS.PUBLIC}/${objectName}`;
}
