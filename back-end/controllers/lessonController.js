export class LessonController {
    constructor(lessonService) {
        this.lessonService = lessonService;
    }

    create = async (req, res, next) => {
        try {
            const { moduleId } = req.params;
            const lesson = await this.lessonService.createLesson(
                moduleId, req.body, req.user.id, req.user.role
            );
            res.status(201).json(lesson);
        } catch (err) { next(err); }
    };

    getByModule = async (req, res, next) => {
        try {
            const lessons = await this.lessonService.getLessonsByModule(req.params.moduleId);
            res.json(lessons);
        } catch (err) { next(err); }
    };

    getOne = async (req, res, next) => {
        try {
            const lesson = await this.lessonService.getLessonById(req.params.lessonId);
            res.json(lesson);
        } catch (err) { next(err); }
    };

    update = async (req, res, next) => {
        try {
            // FIX: was calling with undefined `userRole` and `currentUserId` variables
            // Correct order: (lessonId, data, userId, role, updatedBy)
            const lesson = await this.lessonService.updateLesson(
                req.params.lessonId,
                req.body,
                req.user.id,   // currentUserId — for ownership check
                req.user.role, // userRole — for ownership check
                req.user.id    // updatedBy — saved as revision author
            );
            res.json(lesson);
        } catch (err) { next(err); }
    };

    delete = async (req, res, next) => {
        try {
            await this.lessonService.deleteLesson(
                req.params.lessonId, req.user.id, req.user.role
            );
            res.status(204).send();
        } catch (err) { next(err); }
    };
}