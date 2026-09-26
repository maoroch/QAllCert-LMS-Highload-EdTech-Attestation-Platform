export class SubmissionController {
    constructor(submissionService) {
        this.submissionService = submissionService;
    }

    submit = async (req, res, next) => {
        try {
            const { assignmentId } = req.params;
            const { content, google_drive_link } = req.body;
            const submission = await this.submissionService.submitAssignment(
                assignmentId, req.user.id, content, google_drive_link
            );
            res.status(201).json(submission);
        } catch (err) {
            next(err);
        }
    };

    getMySubmission = async (req, res, next) => {
        try {
            const { assignmentId } = req.params;
            const submission = await this.submissionService.getMySubmission(
                assignmentId, req.user.id
            );
            res.json(submission);
        } catch (err) {
            next(err);
        }
    };

    getAllForTeacher = async (req, res, next) => {
        try {
            const { assignmentId } = req.params;
            const submissions = await this.submissionService.getAllSubmissionsForTeacher(
                assignmentId, req.user.id, req.user.role
            );
            res.json(submissions);
        } catch (err) {
            next(err);
        }
    };
}
