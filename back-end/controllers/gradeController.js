export class GradeController {
    constructor(gradeService) {
        this.gradeService = gradeService;
    }

    grade = async (req, res, next) => {
        try {
            const { submissionId } = req.params;
            const { score, feedback } = req.body;
            const grade = await this.gradeService.gradeSubmission(
                submissionId, score, feedback, req.user.id, req.user.role
            );
            res.json(grade);
        } catch (err) { next(err); }
    };

    getGrade = async (req, res, next) => {
        try {
            const grade = await this.gradeService.getGrade(req.params.submissionId);
            res.json(grade);
        } catch (err) { next(err); }
    };

    getCourseSubmissions = async (req, res, next) => {
        try {
            const submissions = await this.gradeService.getCourseSubmissions(req.params.courseId);
            res.json(submissions);
        } catch (err) { next(err); }
    };

    // GET /api/me/grades — student views all their own graded work
    getMyGrades = async (req, res, next) => {
        try {
            const grades = await this.gradeService.getMyGrades(req.user.id);
            res.json(grades);
        } catch (err) { next(err); }
    };

    // GET /api/me/grades/pending — student views ungraded submissions
    getMyPending = async (req, res, next) => {
        try {
            const pending = await this.gradeService.getMyPending(req.user.id);
            res.json(pending);
        } catch (err) { next(err); }
    };
}