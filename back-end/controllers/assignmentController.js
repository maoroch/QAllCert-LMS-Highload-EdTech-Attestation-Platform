export class AssignmentController {
    constructor(assignmentService) {
        this.assignmentService = assignmentService;
    }

    create = async (req, res, next) => {
        try {
            const { lessonId } = req.params;
            const data = req.body;
            const assignment = await this.assignmentService.createAssignment(lessonId, data, req.user.id, req.user.role);
            res.status(201).json(assignment);
        } catch (err) {
            next(err);
        }
    };

    getByLesson = async (req, res, next) => {
        try {
            const assignments = await this.assignmentService.getAssignmentsByLesson(
                req.params.lessonId, req.user.id, req.user.role
            );
            res.json(assignments);
        } catch (err) {
            next(err);
        }
    };

    update = async (req, res, next) => {
        try {
            const { assignmentId } = req.params;
            const data = req.body;
            const assignment = await this.assignmentService.updateAssignment(assignmentId, data, req.user.id, req.user.role);
            res.json(assignment);
        } catch (err) {
            next(err);
        }
    };

    delete = async (req, res, next) => {
        try {
            const { assignmentId } = req.params;
            await this.assignmentService.deleteAssignment(assignmentId, req.user.id, req.user.role);
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    };
}