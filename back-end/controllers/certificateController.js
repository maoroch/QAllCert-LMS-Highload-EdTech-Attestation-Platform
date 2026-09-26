export class CertificateController {
    constructor(certificateService) {
        this.certificateService = certificateService;
    }

    generate = async (req, res, next) => {
        try {
            const { courseId } = req.params;
            const result = await this.certificateService.generateCertificate(req.user.id, courseId, true);
            res.json(result);
        } catch (err) {
            next(err);
        }
    };

    getMyCertificates = async (req, res, next) => {
        try {
            const certs = await this.certificateService.getUserCertificates(req.user.id);
            res.json(certs);
        } catch (err) {
            next(err);
        }
    };

    verify = async (req, res, next) => {
        try {
            const { code } = req.params;
            const cert = await this.certificateService.verifyCertificate(code);
            if (!cert) return res.status(404).json({ message: 'Certificate not found' });
            res.json(cert);
        } catch (err) {
            next(err);
        }
    };
}