export class EnrollmentController {
    constructor(enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    enroll = async (req, res, next) => {
        try {
            const { courseId } = req.params;
            const userId = req.user.id;
            const enrollment = await this.enrollmentService.enrollUser(userId, courseId);
            res.status(201).json(enrollment);
        } catch (err) {
            next(err);
        }
    };

    getMyCourses = async (req, res, next) => {
        try {
            const courses = await this.enrollmentService.getUserCourses(req.user.id);
            res.json(courses);
        } catch (err) {
            next(err);
        }
    };

    completeLesson = async (req, res, next) => {
        try {
            const { lessonId } = req.params;
            const progress = await this.enrollmentService.completeLesson(req.user.id, lessonId);
            res.json(progress);
        } catch (err) {
            next(err);
        }
    };

    getProgress = async (req, res, next) => {
        try {
            const { courseId } = req.params;
            const progress = await this.enrollmentService.getCourseProgress(req.user.id, courseId);
            res.json(progress);
        } catch (err) {
            next(err);
        }
    };
}