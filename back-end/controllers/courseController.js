export class CourseController {
    constructor(courseService) {
        this.courseService = courseService;
    }

    create = async (req, res, next) => {
        try {
            const { title, description } = req.body;
            const teacherId = req.user.id;
            const course = await this.courseService.createCourse({ title, description }, teacherId);
            res.status(201).json(course);
        } catch (err) {
            next(err);
        }
    };

    getAll = async (req, res, next) => {
        try {
            const { teacherId } = req.query;
            const courses = await this.courseService.getCourses(
                teacherId, 
                req.user?.role || 'student', 
                req.query.search,
                req.user?.id
            );
            res.json(courses);
        } catch (err) {
            next(err);
        }
    };

    getOne = async (req, res, next) => {
        try {
            const course = await this.courseService.getCourseById(req.params.courseId);
            res.json(course);
        } catch (err) {
            next(err);
        }
    };

    getCurriculum = async (req, res, next) => {
        try {
            const curriculum = await this.courseService.getCurriculum(req.params.courseId);
            res.json(curriculum);
        } catch (err) {
            next(err);
        }
    };

    update = async (req, res, next) => {
        try {
            const course = await this.courseService.updateCourse(
                req.params.courseId,
                req.body,
                req.user.id,
                req.user.role
            );
            res.json(course);
        } catch (err) {
            next(err);
        }
    };

    delete = async (req, res, next) => {
        try {
            await this.courseService.deleteCourse(req.params.courseId, req.user.id, req.user.role);
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    };

    publish = async (req, res, next) => {
        try {
            const course = await this.courseService.publishCourse(
                req.params.courseId, req.user.id, req.user.role
            );
            res.json(course);
        } catch (err) {
            next(err);
        }
    };

    unpublish = async (req, res, next) => {
        try {
            const course = await this.courseService.unpublishCourse(
                req.params.courseId, req.user.id, req.user.role
            );
            res.json(course);
        } catch (err) {
            next(err);
        }
    };
}
