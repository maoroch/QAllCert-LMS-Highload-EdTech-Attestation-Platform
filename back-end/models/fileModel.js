// models/fileModel.js
export class FileModel {
    constructor(pool) {
        this.pool = pool;
    }

    // General create (lesson materials, submission files)
    async create({ courseId, lessonId, submissionId, bucket, objectName, originalName, mimeType, size, fileType, uploadedBy }) {
        const result = await this.pool.query(
            `INSERT INTO files
               (course_id, lesson_id, submission_id, bucket, object_name, original_name,
                mime_type, size_bytes, file_type, uploaded_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
             RETURNING *`,
            [
                courseId   || null,
                lessonId   || null,
                submissionId || null,
                bucket,
                objectName,
                originalName,
                mimeType,
                size,
                fileType,
                uploadedBy || null,
            ]
        );
        return result.rows[0];
    }

    // Upsert course cover (one cover per course)
    async upsertCourseCover({ courseId, bucket, objectName, originalName, mimeType, size, publicUrl, uploadedBy }) {
        const result = await this.pool.query(
            `INSERT INTO files
               (course_id, bucket, object_name, original_name, mime_type, size_bytes,
                file_type, public_url, uploaded_by)
             VALUES ($1,$2,$3,$4,$5,$6,'course_cover',$7,$8)
             ON CONFLICT (course_id, file_type)
               WHERE file_type = 'course_cover'
             DO UPDATE SET
               object_name   = EXCLUDED.object_name,
               original_name = EXCLUDED.original_name,
               mime_type     = EXCLUDED.mime_type,
               size_bytes    = EXCLUDED.size_bytes,
               public_url    = EXCLUDED.public_url,
               uploaded_by   = EXCLUDED.uploaded_by,
               created_at    = NOW()
             RETURNING *`,
            [courseId, bucket, objectName, originalName, mimeType, size, publicUrl, uploadedBy || null]
        );
        return result.rows[0];
    }

    async findById(id) {
        const result = await this.pool.query(
            `SELECT * FROM files WHERE id = $1`,
            [id]
        );
        return result.rows[0];
    }

    async findByLesson(lessonId) {
        const result = await this.pool.query(
            `SELECT id, original_name, mime_type, size_bytes, file_type, created_at
             FROM files
             WHERE lesson_id = $1 AND file_type = 'lesson_material'
             ORDER BY created_at DESC`,
            [lessonId]
        );
        return result.rows;
    }

    async findBySubmission(submissionId) {
        const result = await this.pool.query(
            `SELECT id, original_name, mime_type, size_bytes, file_type, created_at
             FROM files
             WHERE submission_id = $1
             ORDER BY created_at DESC`,
            [submissionId]
        );
        return result.rows;
    }

    async findCourseCover(courseId) {
        const result = await this.pool.query(
            `SELECT * FROM files WHERE course_id = $1 AND file_type = 'course_cover' LIMIT 1`,
            [courseId]
        );
        return result.rows[0] || null;
    }

    async delete(id) {
        await this.pool.query(`DELETE FROM files WHERE id = $1`, [id]);
        return true;
    }
}
