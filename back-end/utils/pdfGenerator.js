import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';
import { uploadLocalFile, BUCKETS } from '../lib/minio.js';
import { logger } from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Sanitise filename ────────────────────────────────────────────────────────
// CRITICAL FIX: verification code is user-supplied (stored in DB from crypto.randomBytes,
// but let's be defensive). Strip everything except hex chars to prevent path traversal.
// e.g. "../../etc/passwd" → "" which would be caught by the length check.
function sanitiseCode(code) {
    const safe = String(code).replace(/[^a-f0-9]/gi, '');
    if (safe.length < 8) throw new Error('Invalid verification code format');
    return safe;
}

export const generateCertificatePdf = async (userName, courseName, date, code) => {
    return new Promise((resolve, reject) => {
        try {
            // FIX: sanitise code before using it in a file path
            const safeCode = sanitiseCode(code);

            const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });

            const certificatesDir = path.join(__dirname, '..', 'public', 'certificates');
            if (!fs.existsSync(certificatesDir)) {
                fs.mkdirSync(certificatesDir, { recursive: true });
            }

            const fileName = `${safeCode}.pdf`;
            const filePath = path.join(certificatesDir, fileName);

            // FIX: verify the resolved path is still inside the expected directory
            // (defence-in-depth against any future code changes)
            const resolvedPath = path.resolve(filePath);
            const resolvedDir  = path.resolve(certificatesDir);
            if (!resolvedPath.startsWith(resolvedDir + path.sep)) {
                throw new Error('Path traversal detected — aborting certificate generation');
            }

            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // ── Certificate design ────────────────────────────────────────────
            const W = doc.page.width;
            const H = doc.page.height;

            // Outer border
            doc.rect(15, 15, W - 30, H - 30)
               .lineWidth(3)
               .stroke('#4f46e5');
            // Inner border
            doc.rect(22, 22, W - 44, H - 44)
               .lineWidth(1)
               .stroke('#818cf8');

            // Header band
            doc.rect(15, 15, W - 30, 70)
               .fill('#4f46e5');

            doc.fontSize(28)
               .fillColor('#ffffff')
               .text('CERTIFICATE OF COMPLETION', 0, 28, { align: 'center' });

            // Body
            doc.fontSize(16)
               .fillColor('#64748b')
               .text('This is to certify that', 0, 110, { align: 'center' });

            // Sanitise display values — strip control chars to prevent PDF injection
            const safeName   = String(userName).replace(/[\x00-\x1F\x7F]/g, '');
            const safeCourse = String(courseName).replace(/[\x00-\x1F\x7F]/g, '');

            doc.fontSize(34)
               .fillColor('#1e293b')
               .text(safeName, 0, 145, { align: 'center', underline: true });

            doc.fontSize(16)
               .fillColor('#64748b')
               .text('has successfully completed the accredited teacher course', 0, 200, { align: 'center' });

            doc.fontSize(22)
               .fillColor('#4f46e5')
               .text(safeCourse, 0, 230, { align: 'center' });

            // Footer
            const issuedDate = new Date(date).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
            });

            doc.fontSize(10)
               .fillColor('#64748b')
               .text(`Issued: ${issuedDate}`, 60, H - 85)
               .text(`Verification ID: ${safeCode}`, 60, H - 70)
               .text(`Accreditation: CAAAE № 25/20КА0003 • BIN: 250240001104`, 60, H - 55);

            // Seal circle (decorative)
            doc.circle(W - 90, H - 70, 40)
               .lineWidth(2)
               .stroke('#4f46e5');
            doc.fontSize(8)
               .fillColor('#4f46e5')
               .text('QAllCert', W - 120, H - 82, { width: 60, align: 'center' })
               .text('VERIFIED', W - 120, H - 70, { width: 60, align: 'center' })
               .text('CAAAE', W - 120, H - 58, { width: 60, align: 'center' });

            doc.end();

            stream.on('finish', async () => {
                try {
                    // Upload to MinIO for permanent stateless storage across replicas/restarts
                    try {
                        await uploadLocalFile(
                            BUCKETS.PUBLIC,
                            `certificates/${fileName}`,
                            filePath,
                            'application/pdf'
                        );
                        logger.info(`[PDFGenerator] Certificate uploaded to MinIO: certificates/${fileName}`);
                    } catch (minioErr) {
                        logger.warn(`[PDFGenerator] MinIO upload warning: ${minioErr.message}`);
                    }
                    resolve(`/certificates/${fileName}`);
                } catch (err) {
                    reject(err);
                }
            });
            stream.on('error', reject);
        } catch (err) {
            reject(err);
        }
    });
};